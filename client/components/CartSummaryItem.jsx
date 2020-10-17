import React from 'react';

class CartSummaryItem extends React.Component {
  render() {
    return (
      <div className="card my-3 mx-auto d-flex justify-content-center flex-row p-2">
        <div
          className="checkout-img"
          style={{
            height: '300px',
            width: '40%',
            backgroundImage: `url(${this.props.item.image})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="card-body d-flex justify-content-start align-items-center">
          <div>
            <h2 className="card-title">{this.props.item.name}</h2>
            <p className="card-text">${this.props.item.price / 100}</p>
            <p className="card-text">{this.props.item.shortDescription}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default CartSummaryItem;
