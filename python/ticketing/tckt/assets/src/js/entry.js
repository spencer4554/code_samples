/** @jsx React.DOM */

var $ = require("jquery");
var React = require("react");
var EventHeader = require("./components/EventHeader");
var Event = require("./components/Event");
var _ = require("underscore");

module.exports.getEventHeader = function(event, urls) {
    return <EventHeader {..._.extend(event, urls)} />;
};

module.exports.getEventDetail = function(event, urls, transaction) {
    var props = _.extend(event, urls);
    props['transaction'] = transaction;
    return <Event {...props} />;
};
