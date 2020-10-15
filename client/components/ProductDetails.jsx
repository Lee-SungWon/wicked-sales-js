import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);
  }

  componentDidMount() {
    fetch(`api/products/${this.props.productId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ product: data });
      })
      .catch(err => console.error(err));
  }

  handleClick() {
    this.props.setView('catalog', {})
  }

  handleAddToCart() {
    this.props.addToCart(this.state.product);
  }

  render() {
    if (!this.state.product) return null;
    return (
      <div className='m-3 box-details'>
        <div className='mt-2 mb-2 pointer' onClick={this.handleClick}>&lt; Back to catalog</div>
        <div className='d-flex'>
          <img className='m-2' src={this.state.product.image} />
          <div>
            <h2>{this.state.product.name}</h2>
            <p className='price'>${(this.state.product.price / 100).toFixed(2)}</p>
            <p>{this.state.product.shortDescription}</p>
            <button type="button" className="btn btn-primary" onClick={this.handleAddToCart}>Add to Cart</button>
          </div>
        </div>
        <div>
          <p>{this.state.product.longDescription}</p>
        </div>
      </div>
    )
  }
}

export default ProductDetails;
