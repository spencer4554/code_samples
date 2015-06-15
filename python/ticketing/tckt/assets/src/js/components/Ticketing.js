/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var number = require('../utils/number');

var Ticketing = React.createClass({
    getInitialState: function() {
        if (!_.isEmpty(this.props.transaction)) {
            return {'quantity': this.props.transaction.quantity,
                    'total': this.calculateTotal(this.props.transaction.quantity)};
        } else {
            return {'quantity': 0,
                    'total': 0};
        }
    },

    calculateTotal: function(quantity) {
        return ((parseFloat(this.props.pricePer) + parseFloat(this.props.serviceFee) + parseFloat(this.props.facilitiesFee)) * quantity).toFixed(2);
    },

    changeQuantity: function(event) {
        var quantity = parseFloat(event.target.value);
        this.setState({'quantity': quantity,
                       'total': this.calculateTotal(quantity)});
    },

    drawTicketSelect: function() {
        if (!_.isEmpty(this.props.transaction)) {
            return <p className="ticket-service-fee ticket-column-data">{this.state.quantity}</p>;
        } else {
            return (
                <div>
                  <select onChange={this.changeQuantity} name="ticket-quantity" className="ticket-quantity ticket-column-data" style={{marginTop: 10}}>
                    <option>Select #</option>
                    { _.map(_.range(10), function(i) { return <option value={i+1}>{i+1}</option> })};
                  </select>
                  <p className="ticket-service-fee ticket-column-data"></p>
                </div>
            );
        }
    },

    drawTotals: function() {
        return (
            <div className="row">
              <div className="large-12">
                <div className="ticket-header large-4 columns">
                  <p className="ticket-shipping ticket-column-data">Total:</p>
                </div>
                <div className="ticket-header large-2 columns">
                  <p className="ticket-shipping ticket-column-data">{number.asCurrency(this.state.total)}</p>
                </div>
              </div>
            </div>);
    },

    onClick: function(event) {
        if (this.state.quantity === 0) {
            alert("Please select a quantity before continuing.");
            event.preventDefault();
        }
    },

    drawPurchaseButton: function() {
        if (this.props.showPurchase) {
            return <div className="large-4 right ticketing-order-button-holder">
                     <a href="#" className="button order-button" onClick={this.props.purchase}>Place Your Order</a>
                   </div>;
        } else {
            return (
                <div className="ticket-checkout-row large-3 columns right">
                  <a onClick={this.onClick} href={ this.props.urls.payment_start + '?event_id=' + this.props.eventId + '&quantity=' + this.state.quantity + "&amount=" + this.state.total} data-paypal-button="true">
                    <img src="//www.paypalobjects.com/en_US/i/btn/btn_xpressCheckout.gif" alt="Check out with PayPal" />
                  </a>
                </div>);
        }
    },

    render: function() {
        return (
            <div className="ticketing">
              <div className="row">
                <div className="large-12 column">
                  <span className="ticket-column-headings" style={{display: 'block'}}>Buy Tickets</span>
                  <p className="ticket-column-data ticket-restrictions" style={{height: 40}}>{ this.props.maxQuantity ? "There is a " + this.props.maxQuantity + " ticket limit per customer.  " : null }Service fees are non-refundable.</p>
                </div>
              </div>
              <div className="row">
                <div className="large-12">
                  <div className="ticket-header large-3 columns">
                    <span className="ticket-column-headings" style={{display: 'block'}}>Ticket Type</span>
                    <p className="ticket-type ticket-column-data">Regular</p>
                  </div>
                  <div className="ticket-details large-9 columns">
                    <ul>
                      <li className="large-3 columns">
                        <span className="ticket-column-headings">Item Price</span>
                        <p className="ticket-price ticket-column-data">{number.asCurrency(this.props.pricePer)}</p>
                      </li>
                      <li className="large-3 columns">
                        <span className="ticket-column-headings">Service Fee<i className="fa fa-info" data-toggle="tooltip" data-placement="top" title="" data-tooltip-on="" data-original-title="$0.05 per additional GB"></i></span>
                        <p className="ticket-service-fee ticket-column-data">{number.asCurrency(this.props.serviceFee)}</p>
                      </li>
                      <li className="large-3 columns">
                        <span className="ticket-column-headings">Facilities Fee<i className="fa fa-info" data-toggle="tooltip" data-placement="top" title="" data-tooltip-on="" data-original-title="$0.05 per additional GB"></i></span>
                        <p className="ticket-facilities-fee ticket-column-data">{number.asCurrency(this.props.facilitiesFee)}</p>
                      </li>
                      <li className="large-3 columns">
                        <span className="ticket-column-headings">Quantity</span>
                         { this.drawTicketSelect() }
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="large-12 column">
                  <span className="ticket-column-headings">Shipping</span>
                </div>
              </div>
              <div className="row">
                <div className="large-12">
                  <div className="ticket-header large-4 columns">
                    <p className="ticket-shipping ticket-column-data">Select your shipping method</p>
                  </div>
                  <div className="ticket-header large-3 columns">
                    <select name="ticket-shipping-options" className="ticket-shipping-options ticket-column-data">
                      <option value="wc">Will Call</option>
                    </select>
                  </div>
                </div>
              </div>
              <hr />
              { this.state.quantity > 0 ? [this.drawTotals(), <hr />] : null }
              <div className="row">
                <div className="large-12">
                  { this.drawPurchaseButton() }
                </div>
              </div>
            </div>
        );
    }
});

module.exports = Ticketing;
