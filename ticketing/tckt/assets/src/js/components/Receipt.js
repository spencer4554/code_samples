/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var number = require('../utils/number');

var Receipt = React.createClass({
    drawLocation: function() {
        return this.props.location.line1 + ', ' + this.props.location.city + ', ' + this.props.location.state;
    },

    render: function() {
        return (
            <div className="ticketing">
              <div className="row">
                <div className="large-12 column">
                  <h2>Thank You for your Order!</h2>
                  <dl>
                    <dt>Order Number:</dt><dd>{this.props.transaction.order_number}</dd>
                    <dt>Name:</dt><dd>{ this.props.transaction.user.first_name + ' ' + this.props.transaction.user.last_name}</dd>
                    <dt>Show:</dt><dd>{this.props.name}</dd>
                    <dt>Date/Time:</dt><dd>{this.props.datetime}</dd>
                    <dt>Location:</dt><dd>{this.drawLocation()}</dd>
                    <dt># Tickets:</dt><dd>{this.props.transaction.quantity}</dd>
                    <hr />
                    <dt>TOTAL:</dt><dd>{number.asCurrency(this.props.transaction.amount)}</dd>
                    <hr />
                  </dl>
                  <p>Please collect your tickets at Will Call.</p>
                </div>
              </div>
            </div>
        );
    }
});

module.exports = Receipt;
