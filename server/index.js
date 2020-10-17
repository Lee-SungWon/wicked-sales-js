require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query(`select 'successfully connected' as "message"`)
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/products', (req, res, next) => {
  const sql = `
    select "productId",
          "name",
          "price",
          "image",
          "shortDescription"
    from "products";
  `;

  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
})

app.get('/api/products/:productId', (req, res, next) => {
  const sql = `
    select "productId",
          "name",
          "price",
          "image",
          "shortDescription",
          "longDescription"
    from "products"
    where "productId" = $1;
  `
  const productId = req.params.productId;

  const params = [productId];

  db.query(sql, params)
    .then(result => {
      const product = result.rows[0];
      if (!product) {
        res
          .status(404)
          .json({ error: `cannot find product with productId ${productId}` });
      } else {
        res.status(200).json(product);
      }
    })
    .catch(err => next(err));
})


app.get('/api/cart', (req, res, next) => {
  if (!req.session.cartId) {
    res.json([]);
  } else {
    const query = `
      select
        "c"."cartItemId",
        "c"."price",
        "p"."productId",
        "p"."image",
        "p"."name",
        "p"."shortDescription"
      from "cartItems" as "c"
      join "products" as "p" using ("productId")
      where "c"."cartId" = $1
    `;
    db.query(query, [req.session.cartId])
      .then(result => res.status(200).json(result.rows))
      .catch(err => next(err));
  }
});

app.post('/api/cart/:productId', (req, res, next) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    return next(new ClientError('ProductId must be a positive integer', 400));
  }


  const query = `
  select "price"
  from "products"
  where "productId" = $1
  `;

  db.query(query, [productId])
    .then(res => {
      const product = res.rows[0];
      if (!product) {
        throw new ClientError( `cannot find product with productId ${productId}`, 400 );
      }

      if (!req.session.cartId) {
        const query = `
          insert into "carts" ("cartId", "createdAt")
          values(default, default)
          returning *
        `;


        return db.query(query)
        .then(res => {
          return {
            cartId: res.rows[0].cartId,
            price: product.price
          };
        });
      } else {
        return { cartId: req.session.cartId, price: product.price };
      }
    })
    .then(res => {
      req.session.cartId = res.cartId;
      const addItemQuery = `
        insert into "cartItems"("cartId", "productId", "price")
        values($1, $2, $3)
        returning "cartItemId"
      `
      const addItemValues = [req.session.cartId, productId, res.price];
      return db.query(addItemQuery, addItemValues).then(addedToCartRes => {
        return addedToCartRes.rows[0].cartItemId;
      });
    })
    .then(data => {
      const cartInfoQuery = `
        select
          "c"."cartItemId",
          "c"."price",
          "p"."productId",
          "p"."image",
          "p"."name",
          "p"."shortDescription"
        from "cartItems" as "c"
        join "products" as "p" using ("productId")
        where "c"."cartItemId" = $1;
      `;
      const cartInfoValues = [data];
      return db.query(cartInfoQuery, cartInfoValues).then(result => {
        res.status(201).json(result.rows[0]);
      });
    })
    .catch(err => {
      next(err);
    });
});


app.post('/api/orders', (req, res, next) => {
  if (!req.session.cartId) {
    res.status(400).json({ error: 'there is no cart for this session' });
    return;
  }

  if (!req.body.name || !req.body.creditCard || !req.body.shippingAddress) {
    res.status(400).json({ error: 'missing one or more of required fields' });
    return;
  }

  const query = `
    insert into "orders" ("cartId", "name", "creditCard", "shippingAddress")
    values ($1, $2, $3, $4)
    returning *;
    `;

  const params = [
    req.session.cartId,
    req.body.name,
    req.body.creditCard,
    req.body.shippingAddress
  ];

  db.query(query, params)
    .then(result => {
      delete req.session.cartId;
      res.status(201).json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
