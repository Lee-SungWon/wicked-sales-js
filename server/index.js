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
    const cartIdValue = [req.session.cartId];
    db.query(query, cartIdValue)
      .then(result => res.status(200).json(result.rows))
      .catch(err => next(err));
  }
});

app.post('/api/cart/:productId', (req, res, next) => {
  const productId = Number(req.params.productId);
  if (!Number.isInteger(productId) || productId <= 0) {
    res.status(400).json({ error: 'productId must be a positive integer' });
    return;
  }

  const params = [productId];
  const query = 'select "price" from "products" where "productId" = $1';

  db.query(query, params)
    .then(productRes => {
      const product = productRes.rows[0];
      if (!product) {
        throw new ClientError(
          `cannot find product with productId ${productId}`,
          400
        );
      }

      if (!req.session.cartId) {
        const insertQuery =
          'insert into "carts" ("cartId", "createdAt") values(default, default) returning *';

        return db.query(insertQuery).then(insertedRes => {
          return {
            cartId: insertedRes.rows[0].cartId,
            price: product.price
          };
        });
      } else {
        return { cartId: req.session.cartId, price: product.price };
      }
    })
    .then(result2 => {
      req.session.cartId = result2.cartId;
      const addItemQuery =
        'insert into "cartItems" ("cartId", "productId", "price") values ($1, $2, $3) returning "cartItemId"';
      const addItemValues = [req.session.cartId, productId, result2.price];
      return db.query(addItemQuery, addItemValues).then(addedToCartRes => {
        return addedToCartRes.rows[0].cartItemId;
      });
    })
    .then(result3 => {
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
      const cartInfoValues = [result3];
      return db.query(cartInfoQuery, cartInfoValues).then(finalRes => {
        res.status(201).json(finalRes.rows[0]);
      });
    })
    .catch(err => {
      next(err);
    });
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
