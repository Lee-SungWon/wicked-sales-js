import React from 'react';

class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: '', creditCard: '', shippingAddress: '' };
    this.getTotalPrice = this.getTotalPrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getTotalPrice() {
    let total = 0;
    for (let i = 0; i < this.props.orderItems.length; i++) {
      total += this.props.orderItems[i].price;
    }
    return total / 100;
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.placeOrder(this.state);
    this.setState({ name: '', creditCard: '', shippingAddress: '' });
  }

  render() {
    return (
      <div className="row vh-100">
        <div className="d-flex flex-column p-3 mx-auto my-cart">
          <div className="h1">My Cart</div>
          <div className="h2">Order Total: ${this.getTotalPrice()}</div>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                value={this.state.name}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Credit Card</label>
              <input
                name="creditCard"
                type="text"
                className="form-control"
                value={this.state.creditCard}
                onChange={this.handleChange}
              />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea
                name="shippingAddress"
                className="form-control"
                rows="4"
                value={this.state.shippingAddress}
                onChange={this.handleChange}
              ></textarea>
            </div>
            <div className="d-flex justify-content-between">
              <div className="back pointer" onClick={() => this.props.setView('catalog', {})}>
                &lt; Continue Shopping
              </div>
              <button type="submit" className="btn btn-primary">
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default CheckoutForm;
