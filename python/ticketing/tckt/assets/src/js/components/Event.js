/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');

var EventHeader = React.createClass({
    render: function() {
        return (
          <article>
            <div className="row">
              <div className="large-4 columns">
                <img src="{% static 'img/thegreen.jpg' %}"/>
              </div>
              <div className="large-8 columns event-right-column">
                <div className="ticketing">
                  <div className="row">
                    <div className="large-12 column">
                      <span className="ticket-column-headings">Buy Tickets</span>
                      <p className="ticket-column-data ticket-restrictions">There is a 10 ticket limit per customer. Service fees are non-refundable.</p>
                    </div>
                  </div>
                  <div className="row">
                    <div className="large-12">
                      <div className="ticket-header large-3 columns">
                        <span className="ticket-column-headings">Ticket Type</span>
                        <p className="ticket-type ticket-column-data">Regular</p>
                      </div>
                      <div className="ticket-details large-9 columns">
                        <ul>
                          <li className="large-3 columns">
                            <span className="ticket-column-headings">Item Price</span>
                            <p className="ticket-price ticket-column-data">$20.00</p>
                          </li>
                          <li className="large-3 columns">
                            <span className="ticket-column-headings">Service Fee<i className="fa fa-info" data-toggle="tooltip" data-placement="top" title="" data-tooltip-on="" data-original-title="$0.05 per additional GB"></i></span>
                            <p className="ticket-service-fee ticket-column-data">$1.53</p>
                          </li>
                          <li className="large-3 columns">
                            <span className="ticket-column-headings">Facilities Fee<i className="fa fa-info" data-toggle="tooltip" data-placement="top" title="" data-tooltip-on="" data-original-title="$0.05 per additional GB"></i></span>
                            <p className="ticket-facilities-fee ticket-column-data">$1.00</p>
                          </li>
                          <li className="large-3 columns">
                            <span className="ticket-column-headings">Quantity</span>
                            <select name="ticket-quantity" className="ticket-quantity ticket-column-data">
                              <option></option>
                              <option value="1">01</option>
                              <option value="2">02</option>
                              <option value="3">03</option>
                              <option value="4">04</option>
                              <option value="5">05</option>
                              <option value="6">06</option>
                              <option value="7">07</option>
                              <option value="8">08</option>
                              <option value="9">09</option>
                              <option value="10">10</option>
                            </select>
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
                  <div className="row">
                    <div className="large-12">
                      <div className="ticket-checkout-row large-4 columns right">
                        <a href="#" className="ticket-checkout button">CHECKOUT</a>
                      </div>
                    </div>
                  </div>
                </div>
                <br />
                <div className="event-detail">
                  <div className="row">
                    <div className="large-12 column">
                      <span className="ticket-column-headings">Event Details</span>
                      <p className="event-details">
                        <span>The Green live at the Fat Cat Music House and Lounge</span>
                        <span>Doors at 6PM Show at 7PM</span>
                        <span>21+ event</span>
                        <span>For Booth reservations or questions please call 209-312-3463</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          );
    }
});

module.exports = EventHeader;
