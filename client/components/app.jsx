import React from 'react';
import Header from './Header';
import ProductList from './ProductList';
import ProductDetails from './ProductDetails';
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      isLoading: true,
      view: {
        name: 'catalog',
        params: {}
      }
    };
    this.setView = this.setView.bind(this);
  }

  componentDidMount() {
    fetch('/api/health-check')
      .then(res => res.json())
      .then(data => this.setState({ message: data.message || data.error }))
      .catch(err => this.setState({ message: err.message }))
      .finally(() => this.setState({ isLoading: false }));
  }

  setView(name, params) {
    this.setState({
      view: {
        name: name,
        params: params
      }
    })
  }

  render() {
    if (this.state.view.name === 'catalog') {
      return (
        <>
          <Header />
          <div className="container d-flex flex-wrap">
            <ProductList setView={this.setView} />
          </div>
        </>
      )
    }

    if (this.state.view.name === 'details') {
      return (
        <>
          <Header />
          <div>
            <ProductDetails setView={this.setView} productId={this.state.view.params.productId} />
          </div>
        </>
      )
    }
  }
}
