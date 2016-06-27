/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var Location = require('./Location');

var EventHeader = React.createClass({
    render: function() {
        return (
          <div className="row">
            <div className="large-1 columns">
              <div className="event-date">
                <p className="event-date-day-of-week">{ this.props.dow }</p>
                <p className="event-date-month">{ this.props.month }</p>
                <p className="event-date-day">{ this.props.day }</p>
              </div>
            </div>
            <div className="large-7 columns" id="event-details">
              <span className="event-presenter">{ this.props.presenter }</span>
              <h2 className="event-name">{ this.props.name }</h2>
              <span className="event-subtitle">{ this.props.subtitle }</span>
            </div>
            <div className="large-4 columns" id="event-location">
              <Location {...this.props.location} />
              <div className="event-start">
                {this.props.startText}
              </div>
            </div>
          </div>
        );
    }
});

module.exports = EventHeader;
