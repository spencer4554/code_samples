/** @jsx React.DOM */

var $ = require("jquery");
var React = require("react");
var EventHeader = require("./components/EventHeader");
var Event = require("./components/Event");

module.exports.getEventHeader = function(event) {
    return <EventHeader />;
};

module.exports.getEventDetail = function(event) {
    return <Event max_quantity={10} price={20} serviceFee={1.53} facilitiesFee={1} />;
};
