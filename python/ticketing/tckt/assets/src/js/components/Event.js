/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var Ticketing = require('./Ticketing');
var CreditCard = require('./CreditCard');
var OrderSummary = require('./OrderSummary');

var Event = React.createClass({

    getInitialState: function() {
        var orderSummaryOpen = false, orderError = false;

        if (!_.isEmpty(this.props.transaction)) {
            if (this.props.transaction.status == 'paypal_error') {
                orderError = true;
            } else {
                orderSummaryOpen = true;
            }
        }

        return {'showCreditCard': false,
                'quantity': 1,
                'total': 1,
                'orderSummaryOpen': orderSummaryOpen,
                'orderError': orderError};
    },

    closeOrderSummaryOverlay: function() {
        this.setState({orderSummaryOpen: false,
                       showCreditCard: false});
    },

    purchase: function() {
        var url = this.props.urls.execute_paypal + "?paymentId=" + this.props.transaction.processor_payment_id;
        window.location.href = url;
    },

    clear: function() {
        window.location.href = this.props.urls.restart;
    },

    drawCreditCard: function() {
        var props = _.clone(this.props);
        props.quantity = this.state.quantity;
        props.total = this.state.total;
        props.close = this.closeOrderSummaryOverlay;
        return <CreditCard {...props} />;
    },

    showCreditCard: function(quantity, total) {
        this.setState({
            'showCreditCard': true,
            'quantity': quantity,
            'total': total
        });
    },

    drawTicketing: function() {
        var props = _.clone(this.props);
        props.showPurchase = !_.isEmpty(this.props.transaction);
        props.purchase = this.purchase;
        props.showCreditCard = this.showCreditCard;
        return <Ticketing {...props} />;
    },

    drawOrderSummaryOverlay: function() {
        if (!this.state.orderSummaryOpen) {
            return '';
        }

        var props = this.props.transaction;
        props.close = this.closeOrderSummaryOverlay;
        props.purchase = this.purchase;

        return <OrderSummary {...props} />;
    },

    drawOrderError: function() {
        if (!this.state.orderError) {
            return '';
        }

        return (
          <div className="large-12 columns">
              <div data-alert className="alert-box alert radius">
                Paypal returned an error.  <a onClick={ this.purchase }>Retry your payment</a> or <a onClick={ this.clear }>start again.</a>
            </div>
          </div>);
    },

    render: function() {
        return (
          <div>
            <article>
              <div className="row">
                { this.drawOrderError() }
                <div className="large-4 columns" id="event-img">
                  <img src={ this.props.image }/>
                </div>
                <div className="large-8 columns event-right-column">
                  { this.state.showCreditCard ? this.drawCreditCard() : this.drawTicketing() }
                  <br />
                  <div className="event-detail">
                    <div className="row">
                      <div className="large-12 column">
                        <span className="ticket-column-headings">Event Details</span>
                        <p className="event-details">{this.props.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
            { this.drawOrderSummaryOverlay() }
          </div>
        );
    }
});

module.exports = Event;
