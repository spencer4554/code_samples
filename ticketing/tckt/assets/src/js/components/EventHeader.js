/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var Location = require('./Location');

var EventHeader = React.createClass({
    render: function() {
        return (
          <div className="row">
            <div className="small-2 columns">
              <div className="event-date">
                <p className="event-date-day-of-week">{ this.props.dow }</p>
                <span className="event-date-month">{ this.props.month } </span>
                <span className="event-date-day">{ this.props.day }</span>
              </div>
            </div>
            <div className="small-10 columns" id="event-details">
              <span className="event-presenter">{ this.props.presenter }</span>
              <h2 className="event-name">{ this.props.name }</h2>
              <span className="event-subtitle">{ this.props.subtitle }</span>
            </div>
          </div>
        );
    }
});

module.exports = EventHeader;
