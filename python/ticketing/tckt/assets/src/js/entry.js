/** @jsx React.DOM */

var $ = require("jquery");
var React = require("react");
var EventHeader = require("./components/EventHeader");
var Event = require("./components/Event");

module.exports.getEventHeader = function(event) {
    return <EventHeader day={event.day} dow={event.dow} month={event.month} presenter={event.presenter} name={event.name} subtitle={event.subtitle} location={event.location} />;
};

module.exports.getEventDetail = function(event) {
    console.log(event);
    return <Event event_id={event.id} max_quantity={event.maxQuantity} price={parseFloat(event.price)} serviceFee={parseFloat(event.serviceFee)} facilitiesFee={parseFloat(event.facilitiesFee)} />;
};
