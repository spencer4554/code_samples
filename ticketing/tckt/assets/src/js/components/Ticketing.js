/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var number = require('../utils/number');
// var Location = require('./Location');


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
        var total = this.calculateTotal(quantity);
        this.setState({'quantity': quantity,
                       'total': total });
        // this.props.showCreditCard(quantity, total);
    },

    drawTicketSelect: function() {
        if (!_.isEmpty(this.props.transaction)) {
            return <p className="ticket-service-fee ticket-column-data">{this.state.quantity}</p>;
        } else {
            return (
                <div>
                  <select onChange={this.changeQuantity} name="ticket-quantity" className="ticket-quantity ticket-column-data">
                    <option>Select #</option>
                    { _.map(_.range(10), function(i) { return <option key={"option_" + i} value={i+1}>{i+1}</option> })};
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
                <div className="ticket-header large-4 columns" id="total-price">
                  <p className="ticket-shipping ticket-column-data">Total: &nbsp; {number.asCurrency(this.state.total)}</p>
                </div>
              </div>
            </div>);
    },

    paypalOnClick: function(event) {
        if (this.state.quantity === 0) {
            alert("Please select a quantity before continuing.");
            event.preventDefault();
        }
    },

    stripeOnClick: function(event) {
        event.preventDefault();

        if (this.state.quantity === 0) {
            alert("Please select a quantity before continuing.");
            return;
        }

        this.props.showCreditCard(this.state.quantity, this.state.total);
    },

    drawPurchaseButton: function() {
        var description = this.state.quantity + " tickets ($" + this.state.total + ")";

        if (this.props.showPurchase) {
            return <div className="large-4 right ticketing-order-button-holder">
                     <a href="#" className="button order-button" onClick={this.props.purchase}>Place Your Order</a>
                   </div>;
        } else {
            return <div className="large-3 columns right ticketing-order-button-holder">
                     <button className="stripe-button-el" onClick={this.stripeOnClick} id="customButton">Proceed</button>
                   </div>;
        }
    },

    render: function() {
        return (
            <div className="ticketing">
              <div className="row">
                <div className="large-12 column">
                  <div className="ticket-column-headings hide">Buy Tickets</div>
                  <p className="ticket-column-data ticket-restrictions">{ this.props.maxQuantity ? "There is a " + this.props.maxQuantity + " ticket limit per customer.  " : null }Service fees are non-refundable.</p>
                </div>
              </div>
              <div className="row">
                <div className="large-12">
                  <div className="ticket-details columns">
                    <ul>
                      <li className="large-3 columns">
                        <div className="ticket-column-headings ticket-type" >Ticket Type</div>
                        <p className="ticket-type ticket-column-data">Regular</p>
                      </li>                   
                      <li className="large-3 columns">
                        <div className="ticket-column-headings">Item Price</div>
                        <p className="ticket-price ticket-column-data">{number.asCurrency(this.props.pricePer)}</p>
                      </li>
                      <li className="large-3 columns">
                        <div className="ticket-column-headings">Service Fee<i className="fa fa-info" data-toggle="tooltip" data-placement="top" title="" data-tooltip-on="" data-original-title="$0.05 per additional GB"></i></div>
                        <p className="ticket-service-fee ticket-column-data">{number.asCurrency(this.props.serviceFee)}</p>
                      </li>
                      <li className="large-3 columns">
                        <div className="ticket-column-headings">Facilities Fee<i className="fa fa-info" data-toggle="tooltip" data-placement="top" title="" data-tooltip-on="" data-original-title="$0.05 per additional GB"></i></div>
                        <p className="ticket-facilities-fee ticket-column-data">{number.asCurrency(this.props.facilitiesFee)}</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
                <div className="row ticketing-selects-row">
                  <div className="large-12">
                    <div className="large-4 columns">
                      <p className="quantity ticket-shipping ticket-column-data">Quantity</p>
                    </div>
                    <div className="ticket-header large-8 columns">
                       { this.drawTicketSelect() }
                    </div>
                  </div>                 
                  <div className="large-12">
                    <div className="ticket-header large-4 columns">
                      <p className="shipping-method ticket-shipping ticket-column-data">Shipping method</p>
                    </div>
                    <div className="ticket-header  large-8 columns">
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
