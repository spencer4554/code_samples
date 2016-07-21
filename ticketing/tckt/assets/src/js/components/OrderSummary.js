/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var number = require('../utils/number');

var OrderSummary = React.createClass({
    drawLocation: function() {
        return this.props.event.location.name + ", " + this.props.event.location.line1 + ", " + this.props.event.location.city;
    },
    render: function() {
        return (
            <div>
              <div id="myModal" className="transaction-modal" data-reveal aria-labelledby="modalTitle" aria-hidden="true" role="dialog">
                <h2 id="modalTitle">Review &amp; Place Your Order</h2>
                <div className="order-summary">
                  <dl>
                    <dt>Show:</dt><dd>{this.props.event.name}</dd>
                    <dt>Date/Time:</dt><dd>{this.props.event.datetime}</dd>
                    <dt>Location:</dt><dd>{this.drawLocation()}</dd>
                    <dt># Tickets:</dt><dd>{this.props.quantity}</dd>
                    <hr />
                    <dt>TOTAL:</dt><dd>{number.asCurrency(this.props.amount)}</dd>
                    <hr />
                  </dl>
                  <div className='order-button-holder'>
                    <a href="#" className="button order-button" onClick={this.props.purchase}>Place Your Order</a>
                  </div>
                </div>
                <a className="close" onClick={this.props.close}>&#215;</a>
              </div>
            </div>
        );
    }
});

module.exports = OrderSummary;
