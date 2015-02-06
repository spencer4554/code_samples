/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var Ticketing = require('./Ticketing');

var EventHeader = React.createClass({
    render: function() {
        return (
          <article>
            <div className="row">
              <div className="large-4 columns">
                <img src="{% static 'img/thegreen.jpg' %}"/>
              </div>
              <div className="large-8 columns event-right-column">
                <Ticketing  {...this.props} />
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
