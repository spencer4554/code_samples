/** @jsx React.DOM */

var React = require("react");
var $ = require("jquery");
var _ = require("underscore");
var EventHeader = require("./components/EventHeader");
var Event = require("./components/Event");
var Receipt = require("./components/Receipt");


module.exports.getEventHeader = function(event, urls) {
    var props = _.extend(event, urls);
    return <EventHeader {...props} />;
};

module.exports.getEventDetail = function(event, urls, transaction) {
    var props = _.extend(event, urls);
    props.transaction = transaction;
    return <Event {...props} />;
};

module.exports.getReceipt = function(event, urls, transaction) {
    if (transaction.status != 'completed') {
        return;
    }

    var props = _.extend(event, urls);
    props.transaction = transaction;
    return <Receipt {...props} />;
};
