/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var Ticketing = require('./Ticketing');

var Event = React.createClass({
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
                      <p className="event-details">{this.props.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
          );
    }
});

module.exports = Event;
