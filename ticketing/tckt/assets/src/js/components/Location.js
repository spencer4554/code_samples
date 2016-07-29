/** @jsx React.DOM */

React = require('react');
var _ = require("underscore");
var $ = require('jquery');
var Location = require('./Location');


var Location = React.createClass({
    render: function() {
        return (
            <div id="location">
              <span className="location-name">{this.props.name}</span>
              <a className="event-location" href={"http://maps.google.com/maps?daddr=" + this.props.addr_code}rel="nofollow" target="_blank">
                <img src="https://cdn.ticketfly.com/wp-content/themes/ticketfly-v3/img/icon-location-small.gif" />
              </a>
              <div className="location-address">
                <span>{this.props.line1}</span>
                { this.props.line2 ? <span>{this.props.line2}</span> : '' }
                <span>{this.props.city + ", " + this.props.state + " " + this.props.zipcode}</span>
                <span>{this.props.phone}</span>
              </div>
              <div className="event-start">{this.props.startText}</div>
            </div>
        );
    }
});

module.exports = Location
