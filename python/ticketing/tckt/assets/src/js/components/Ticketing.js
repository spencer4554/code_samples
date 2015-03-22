/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var number = require('../utils/number');

var Ticketing = React.createClass({
    getInitialState: function() {
        return {'quantity': 0}
    },

    changeQuantity: function(event) {
        this.setState({'quantity': event.target.value});
    },

    drawTicketSelect: function() {
        return (
            <select onChange={this.changeQuantity} name="ticket-quantity" className="ticket-quantity ticket-column-data" style={{marginTop: 10}}>
              <option>Select #</option>
              { _.map(_.range(10), function(i) { return <option value={i+1}>{i+1}</option> }) }
            </select>)
    },

    drawTotals: function() {
        return (
            <div className="row">
              <div className="large-12">
                <div className="ticket-header large-4 columns">
                  <p className="ticket-shipping ticket-column-data">Total:</p>
                </div>
                <div className="ticket-header large-2 columns">
                  <p className="ticket-shipping ticket-column-data">{number.asCurrency(this.calculateTotal())}</p>
                </div>
              </div> 
            </div>)
    },

    calculateTotal: function() {
        return (this.props.price + this.props.serviceFee + this.props.facilitiesFee) * this.state.quantity;
    },
    
    render: function() {
        return (
            <div className="ticketing">
              <div className="row">
                <div className="large-12 column">
                  <span className="ticket-column-headings" style={{display: 'block'}}>Buy Tickets</span>
                  <p className="ticket-column-data ticket-restrictions" style={{height: 40}}>{ this.props.max_quantity ? "There is a " + this.props.max_quantity + " ticket limit per customer.  " : null }Service fees are non-refundable.</p>
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
                        <p className="ticket-price ticket-column-data">{number.asCurrency(this.props.price)}</p>
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
                        <p className="ticket-service-fee ticket-column-data"></p>
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
                  <div className="ticket-checkout-row large-4 columns right">
                    <a href={ '/payment/paypal_start?event_id=' + this.props.event_id + '&quantity=' + this.state.quantity } data-paypal-button="true">
                      <img src="//www.paypalobjects.com/en_US/i/btn/btn_xpressCheckout.gif" alt="Check out with PayPal" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

module.exports = Ticketing;
