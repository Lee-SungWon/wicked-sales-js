import React from 'react';
import ProductListItem from './ProductListItem';

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: []
    };
    this.getProducts = this.getProducts.bind(this);
  }

  componentDidMount() {
    this.getProducts();
  }

  getProducts() {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        this.setState({
          products: data
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      this.state.products.map((product) => {
        return (
            <ProductListItem
              product={product}
              setView={this.props.setView}
            />
        );
      })
    )
  }
}

export default ProductList;
