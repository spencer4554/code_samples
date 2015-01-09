/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');

var EventHeader = React.createClass({
    render: function() {
        return (
          <div className="row">
            <div className="large-1 columns">
              <div className="event-date">
                <p className="event-date-day-of-week">Mon</p>
                <p className="event-date-month">Dec</p>
                <p className="event-date-day">29</p>
              </div>
            </div>
            <div className="large-7 columns">
              <span className="event-presenter">Chris Ricci Presents</span>
              <h2 className="event-name">THE GREEN</h2>
              <span className="event-subtitle">Chocolate & Roses Tour + Special Guest: Through The Roots</span>
            </div>
            <div className="large-4 columns">
              <span className="location-name">Fat Cat Music House and Lounge</span>
              <a className="event-location" href="http://maps.google.com/maps?daddr=289%20Kent%20Avenue%2011249" rel="nofollow" target="_blank"><img src="https://cdn.ticketfly.com/wp-content/themes/ticketfly-v3/img/icon-location-small.gif" /></a>
              <div className="location-address">
                <span>289 Kent Avenue</span>
                <span>Brooklyn, NY, 1124 9</span>
                <span>917.306.8629</span>
              </div>
              <div className="event-start">
                Doors 7:00pm / Show 8:00pm
              </div>
            </div>
          </div>
        );
    }

});

module.exports = EventHeader;
