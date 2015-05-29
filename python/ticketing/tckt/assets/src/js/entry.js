/** @jsx React.DOM */

var $ = require("jquery");
var React = require("react");
var EventHeader = require("./components/EventHeader");
var Event = require("./components/Event");

module.exports.getEventHeader = function(event) {
    return <EventHeader {...event} />;
};

module.exports.getEventDetail = function(event) {
    return <Event {...event} />;
};
