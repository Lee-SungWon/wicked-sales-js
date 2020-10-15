import React from 'react';
import Header from './Header';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
import CartSummary from './CartSummary';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      },
      cart: []
    };
    this.setView = this.setView.bind(this);
    this.getCartItems = this.getCartItems.bind(this);
    this.addToCart = this.addToCart.bind(this);
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
    console.log(this.state.cart)
  }

  render() {
    if (this.state.view.name === 'catalog') {
      return (
        <>
          <Header setView={this.setView} cartItemCount={this.state.cart.length} />
          <div className="container d-flex flex-wrap">
            <ProductList setView={this.setView} />
          </div>
        </>
      )
    }

    if (this.state.view.name === 'details') {
      return (
        <>
          <Header setView={this.setView} cartItemCount={this.state.cart.length} />
          <div>
            <ProductDetails setView={this.setView} productId={this.state.view.params.productId} addToCart={this.addToCart} />
          </div>
        </>
      )
    }

    if (this.state.view.name === 'cart') {
      return (
        <>
          <Header setView={this.setView} cartItemCount={this.state.cart.length} />
          <div>
            <CartSummary setView={this.setView} cartItems={this.state.cart} />
          </div>
        </>
      )
    }
  }
}
