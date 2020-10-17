import React from 'react';
import Header from './Header';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import CartSummary from './CartSummary';
import CheckoutForm from './CheckoutForm';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'checkout',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.placeOrder = this.placeOrder.bind(this);
  }

  componentDidMount() {
    this.getCartItems();
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params: params
      }
    })
  }

  getCartItems() {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        this.setState({ cart: data });
      })
      .catch(err => console.error(err));
  }

  addToCart(product) {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`/api/cart/${ product.productId }`, init)
      .then(res => res.json())
      .then(data => {
        const cart = [...this.state.cart];
        cart.push(data);
        this.setState({ cart: cart });
      })
      .catch(err => console.error(err));
  }

  placeOrder(order) {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    };
    fetch('/api/orders', init)
      .then(res => {
        this.setState({ cart: [], view: { name: 'catalog', params: {} } });
      });
  }

  render() {
    let view = null;
    if (this.state.view.name === 'catalog') {
      view = <div className="container d-flex flex-wrap"><ProductList setView={this.setView} /></div>
    } else if (this.state.view.name === 'details') {
      view = <ProductDetails setView={this.setView} productId={this.state.view.params.productId} addToCart={this.addToCart} />
    } else if (this.state.view.name === 'cart') {
      view = <CartSummary setView={this.setView} cartItems={this.state.cart} />
    } else if (this.state.view.name === 'checkout') {
      view = <CheckoutForm setView={this.setView} placeOrder={this.placeOrder} orderItems={this.state.cart} />
    }
      return (
        <>
          <Header setView={this.setView} cartItemCount={this.state.cart.length} />
          <div>
            {view}
          </div>
        </>
      )
    }
}
