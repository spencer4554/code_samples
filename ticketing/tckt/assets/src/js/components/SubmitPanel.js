/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var Ticketing = require('./Ticketing');
var CreditCard = require('./CreditCard');
var OrderSummary = require('./OrderSummary');
var number = require('../utils/number');

var Event = React.createClass({
    drawTotals: function() {
        return (
            <div className="ticketing">
              <div className="row">
                <div className="large-12">
                  <div className="ticket-header large-4 columns">
                    <p className="ticket-shipping ticket-column-data">Total:</p>
                  </div>
                  <div className="ticket-header large-2 columns">
                    <p className="ticket-shipping ticket-column-data">{number.asCurrency(this.state.total)}</p>
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="large-12">
                  { this.drawNextButton() }
                </div>
              </div>
            </div>);
    },

    drawNextButton: function() {
        return <div className="large-3 columns right" style={{marginBottom: 10}}>
                   <button className="stripe-button-el" onClick={this.nextOnClick} id="customButton">Next</button>
               </div>;
    },

    nextOnClick: function(event) {
        event.preventDefault();

        if (this.state.showCreditCard) {

        } else {
            if (this.state.quantity === 0) {
                alert("Please select a quantity before continuing.");
                return;
            }

            this.setState({
                'showCreditCard': true,
            });
        }
    },
