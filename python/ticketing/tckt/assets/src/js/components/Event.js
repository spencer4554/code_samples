/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var Ticketing = require('./Ticketing');
var OrderSummary = require('./OrderSummary');

var Event = React.createClass({

    getInitialState: function() {
        return {'orderSummaryOpen': !_.isEmpty(this.props.transaction)};
    },

    closeOrderSummaryOverlay: function() {
        this.setState({orderSummaryOpen: false});
    },

    purchase: function() {
        alert("ORDER PLACED");
    },

    drawTicketing: function() {
        var props = this.props;
        props.showPurchase = !_.isEmpty(this.props.transaction);
        props.purchase = this.purchase;
        return <Ticketing  {...props} />;
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

    render: function() {
        return (
          <div>
            <article>
              <div className="row">
                <div className="large-4 columns">
                  <img src={ this.props.image }/>
                </div>
                <div className="large-8 columns event-right-column">
                  { this.drawTicketing() }
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
