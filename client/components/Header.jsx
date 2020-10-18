import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.handleCartClick = this.handleCartClick.bind(this);
  }

  handleCartClick() {
    this.props.setView('cart', {});
  }

  render() {
    return (
      <header>
        <div className="d-flex justify-content-between">
          <h3 className="pointer ml-5" onClick={() => this.props.setView('catalog', {})}>
            <i className="mr-2 fas fa-baby-carriage"></i>
            Babies N Us
          </h3>
          <div className="mr-5 header-cart pointer" onClick={this.handleCartClick}>
            <span>{this.props.cartItemCount} Items</span>
            <i className="fas fa-shopping-cart ml-2"></i>
          </div>
        </div>
      </header>
    )
  };
}

export default Header;
