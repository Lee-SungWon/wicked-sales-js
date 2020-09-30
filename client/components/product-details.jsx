import React from 'react';

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { product: null };
    this.onBackToCatalogClick = this.onBackToCatalogClick.bind(this);
    this.handleAddBtn = this.handleAddBtn.bind(this);
  }

  componentDidMount() {
    fetch(`api/products/${this.props.productId}`)
      .then(res => res.json())
      .then(data => {
        this.setState({ product: data });
      })
      .catch(err => console.error(err));
  }

  onBackToCatalogClick() {
    this.props.setView('catalog', {});
  }

  handleAddBtn() {
    this.props.addToCart(this.state.product);
  }

  render() {

  }
}

export default ProductDetails;
