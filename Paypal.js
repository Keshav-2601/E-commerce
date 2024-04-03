import React from "react";

class Paypal extends React.Component {
  constructor(props) {
    super(props);
    this.paypalRef = React.createRef();
  }

  componentDidMount() {
    if (!window.paypal) {
      console.error("PayPal SDK not loaded"); // Check if the SDK is available
      return;
    }

    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "Cool looking table",
                amount: {
                  currency_code: "EUR",
                  value: "650.00", // Make sure to use a string for decimal values
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          console.log(order); // Handle order confirmation
        },
        onError: (err) => {
          console.log(err); // Handle errors
        },
      })
      .render(this.paypalRef.current);
  }

  componentWillUnmount() {
    this.paypalRef.current.innerHTML = ""; // Clear the PayPal button on unmount
  }

  render() {
    return <div ref={this.paypalRef}></div>;
  }
}

export default Paypal;
