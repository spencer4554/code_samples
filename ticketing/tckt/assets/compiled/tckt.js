require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require('underscore');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var number = require('../utils/number');
var classNames = require('classnames');

var OrderSummary = require('./OrderSummary');
// var Location = require('./Location');

var CreditCard = React.createClass({displayName: 'CreditCard',

    componentDidMount: function() {
        $(".clearDefault").focus(this.clearInitial);
    },

    clearInitial: function(event) {
        if (_.contains(this.state.defaultsCleared, event.target.id)) {
            return;
        }

        event.target.value = '';
        changes = {'defaultsCleared': this.state.defaultsCleared};
        changes.defaultsCleared.push(event.target.id);
        this.setState(changes);
    },

    getInitialState: function() {
        return {
            'name': null,
            'number': null,
            'cvc': null,
            'email': null,
            'exp_month': null,
            'exp_year': null,
            'address_line1': null,
            'address_line2': null,
            'address_city': null,
            'address_state': null,
            'address_zip': null,
            'address_country': 'USA',
            'errorMessage': null,
            'errors': {},
            'defaultsCleared': [],
            'phone': null,
        };
    },

    displayCreditCardNumber: function(ccNumber) {
        var card_types = {
            'amex': [4, 6, 5],
            'other': [4, 4, 4, 4]};

        if (ccNumber === null || ccNumber === 'undefined' || ccNumber.length === 0) { return; }

        var type = ccNumber[0] == 3 ? card_types.amex : card_types.other, remaining_digits = ccNumber, answer = "";
        _.map(type, function(num_digits) {
            if (remaining_digits.length <= num_digits) {
                answer = answer + remaining_digits;
                remaining_digits = '';
            } else {
                answer = answer + remaining_digits.slice(0,num_digits) + '-';
                remaining_digits = remaining_digits.slice(num_digits);
            }
        });

        if (answer.slice(-1) == '-') {
            return answer.slice(0, answer.length - 1);
        } else {
            return answer;
        }
    },

    handleChange: function(event) {
        var changes = {};

        if (typeof(event.target.selectedIndex) != "undefined") {
            /* handle selects */
            changes[event.target.id] = event.target[event.target.selectedIndex]['value'];
        } else if (event.target.id == 'number') {
            changes.number = this.displayCreditCardNumber(event.target.value.replace(/[^0-9]/g, ''));
        } else {
            changes[event.target.id] = event.target.value;
        }

        if (this.state.errors[event.target.id] !== undefined) {
            changes.errors = this.state.errors;
            delete changes.errors[event.target.id];
        }

        this.setState(changes);
    },

    check: function(fieldName) {
        if (this.state[fieldName] === null || this.state.length === 0) {
            this.errors[fieldName] = 'Field is required.';
        }
    },

    checkState: function() {
        var RequiredFields = ['name', 'number', 'cvc', 'exp_month', 'exp_year', 'address_line1', 'address_city', 'address_state', 'address_zip', 'email', 'phone'];
        this.errors = {};

        _.each(RequiredFields, this.check);
        var changes = {'errors': this.errors};

        if (_.size(this.errors) > 0) {
            changes['errorMessage'] = 'Please enter all required data.';
        } else {
            changes['errorMessage'] = null;
        }

        this.setState(changes);

        return _.size(this.errors) === 0;
    },

    handleSubmit: function(event) {
        if (!this.checkState()) {
            return;
        }

        Stripe.setPublishableKey(this.props.stripe.publishable_key);
        var stripe_data = _.clone(this.state)
        stripe_data.number = stripe_data.number.replace(/-/g, '');
        Stripe.card.createToken(stripe_data, this.stripeResponseHandler);
    },

    // Object {id: "tok_17klT4BRRt7xpyGJ2ZhRitPb",
    //         object: "token",
    //         client_ip: "108.27.20.60"}
    // card:
    //     address_city: "Great Neck"
    //     address_country: "USA"
    //     address_line1: "19 Allenwood Rd"
    //     address_line1_check: "unchecked"
    //     address_line2: null
    //     address_state: "NY"
    //     address_zip: "11023"
    //     address_zip_check: "unchecked"
    //     brand: "Visa"
    //     country: "US"
    //     cvc_check: "unchecked"
    //     dynamic_last4: null
    //     exp_month: 4
    //     exp_year: 2018
    //     funding: "unknown"
    //     id: "card_17klT4BRRt7xpyGJaiqc5N5R"
    //     last4: "1111"
    //     metadata: Object
    //     name: "Paul Prior"
    //     object: "card"
    //     tokenization_method: null
    //     __proto__: Object
    //     client_ip: "108.27.20.60"
    //     created: 1456969290
    //     id: "tok_17klT4BRRt7xpyGJ2ZhRitPb"
    //     livemode: false
    //     object: "token"
    //     type: "card"
    //     used: false
    stripeResponseHandler: function(status, response) {
        if (status == 200) {
            $.ajax({
                url: this.props.urls.start_stripe,
                data: {
                    email: this.state.email,
                    phone: this.state.phone,
                    name: response.card.name,
                    token: response.id,
                    address_state: response.card.address_state,
                    address_zip: response.card.address_zip,
                    address_city: response.card.address_city,
                    address_line1: response.card.address_line1,
                    address_line2: response.card.address_line2,
                    },
                dataType: 'json',
                cache: false,
                success: function(data) {
                    this.props.setTransaction({transaction: data.transaction});
                }.bind(this),
                error: function(xhr, status, err) {
                    console.error(this.props.urls.start_stripe, status, err.toString());
                }.bind(this)
            });
            this.props.close();
        } else if (status >= 400 || status < 500) {
            changes = {'errorMessage': response.error.message,
                'errors': {}};
            changes.errors[response.error.param] = 'Error';
            this.setState(changes);
        }
    },

    render: function() {
        return (
            React.createElement("div", {className: "ticketing"}, 
              React.createElement("div", {className: "row", id: "cc-container"}, 
                  React.createElement("div", {className: "large-12 columns", id: "cc-form"}, 
                    React.createElement("div", {className: "row", id: "summary"}, 
                      React.createElement("div", {className: "small-12"}, " ", this.props.name, " "), 
                      React.createElement("div", {className: "small-12"}, " ", this.props.datetime, " ")
                    ), 
                    
                    React.createElement("div", {className: "row", id: "summary-details"}, 
                      React.createElement("div", {className: "small-4"}, "Ticket Type: ", React.createElement("span", {className: "break gold"}, "REGULAR")), 
                      React.createElement("div", {className: "small-4"}, "Quantity: ", React.createElement("span", {className: "break gold"}, this.props.quantity)), 
                      React.createElement("div", {className: "small-4"}, "Total: ", React.createElement("span", {className: "break gold"}, "$", this.props.total))
                    ), 
                    React.createElement("p", null, " ENTER YOUR PAYMENT DETAILS"), 
                     this.state.errorMessage !== null ? React.createElement("div", {className: "error-message"}, "* ",  this.state.errorMessage) : "", 
                     this.drawForm() 
                  ), 
                React.createElement("hr", null), 
                React.createElement("div", {className: "row"}, 
                  React.createElement("div", {className: "large-12 columns cc-button-container"}, 
                    React.createElement("button", {onClick: this.handleSubmit, className: "cc-submit-button"}, "Proceed")
                  )
                )
              )
            )
        );
    },

    getClasses: function(fieldName, extraClasses) {
        if (this.state.defaultsCleared===undefined) {
            this.
            debugger;
        }
        var classes = {
            'clearDefault': this.state.defaultsCleared[fieldName] === undefined,
            'error-field': _.has(this.state.errors, fieldName)
        };

        if (extraClasses !== undefined) {
            _.each(extraClasses, function(className) { classes[className] = true; });
        }
        return classNames(classes);
    },

    drawForm: function() {
        return (
            React.createElement("form", null, 
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "large-12"}, 
                React.createElement("input", {className: this.getClasses("name"), onChange: this.handleChange, type: "text", id: "name", defaultValue: "Name"})
              )
            ), 
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "large-8 small-6"}, 
                React.createElement("input", {className: this.getClasses("number"), onChange: this.handleChange, type: "text", id: "number", defaultValue: "Card Number", value: this.state.number})
              ), 
              React.createElement("div", {className: "large-4 small-2"}, 
                React.createElement("input", {className: this.getClasses("cvc"), onChange: this.handleChange, type: "text", id: "cvc", defaultValue: "CVC/Security Code"})
              ), 
              React.createElement("div", {className: "large-6 small-2"}, 
                React.createElement("select", {className: this.getClasses("exp_month"), onChange: this.handleChange, id: "exp_month"}, 
                    React.createElement("option", {value: ""}, "Expiration Month"), 
                    React.createElement("option", {value: "01"}, "01"), 
                    React.createElement("option", {value: "02"}, "02"), 
                    React.createElement("option", {value: "03"}, "03"), 
                    React.createElement("option", {value: "04"}, "04"), 
                    React.createElement("option", {value: "05"}, "05"), 
                    React.createElement("option", {value: "06"}, "06"), 
                    React.createElement("option", {value: "07"}, "07"), 
                    React.createElement("option", {value: "08"}, "08"), 
                    React.createElement("option", {value: "09"}, "09"), 
                    React.createElement("option", {value: "10"}, "10"), 
                    React.createElement("option", {value: "11"}, "11"), 
                    React.createElement("option", {value: "12"}, "12")
                )
              ), 
              React.createElement("div", {className: "large-6 small-2"}, 
                React.createElement("select", {className: this.getClasses("exp_year"), onChange: this.handleChange, id: "exp_year"}, 
                    React.createElement("option", {value: ""}, "Expiration Year"), 
                    React.createElement("option", {value: "2016"}, "2016"), 
                    React.createElement("option", {value: "2017"}, "2017"), 
                    React.createElement("option", {value: "2018"}, "2018"), 
                    React.createElement("option", {value: "2019"}, "2019"), 
                    React.createElement("option", {value: "2020"}, "2020"), 
                    React.createElement("option", {value: "2021"}, "2021"), 
                    React.createElement("option", {value: "2022"}, "2022"), 
                    React.createElement("option", {value: "2023"}, "2023"), 
                    React.createElement("option", {value: "2024"}, "2024"), 
                    React.createElement("option", {value: "2025"}, "2025"), 
                    React.createElement("option", {value: "2026"}, "2026"), 
                    React.createElement("option", {value: "2027"}, "2027")
                )
              )
            ), 
              React.createElement("hr", null), 
            React.createElement("div", {className: "row"}, 
              React.createElement("input", {className: this.getClasses("address_line1"), onChange: this.handleChange, type: "text", id: "address_line1", defaultValue: "Address line 1"})
            ), 
            React.createElement("div", {className: "row"}, 
              React.createElement("input", {className: this.getClasses("address_line2"), onChange: this.handleChange, type: "text", id: "address_line2", defaultValue: "Address line 2"})
            ), 
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "city-state-zip-section"}, 
                React.createElement("input", {className: this.getClasses("address_city", ["city-state-zip-field"]), onChange: this.handleChange, type: "text", id: "address_city", defaultValue: "City"}), 
                React.createElement("select", {className: this.getClasses("address_state", ["city-state-zip-field"]), onChange: this.handleChange, id: "address_state"}, 
                  React.createElement("option", {value: ""}, "State"), 
                  React.createElement("option", {value: "AL"}, "AL"), 
                  React.createElement("option", {value: "AK"}, "AK"), 
                  React.createElement("option", {value: "AZ"}, "AZ"), 
                  React.createElement("option", {value: "AR"}, "AR"), 
                  React.createElement("option", {value: "CA"}, "CA"), 
                  React.createElement("option", {value: "CO"}, "CO"), 
                  React.createElement("option", {value: "CT"}, "CT"), 
                  React.createElement("option", {value: "DE"}, "DE"), 
                  React.createElement("option", {value: "FL"}, "FL"), 
                  React.createElement("option", {value: "GA"}, "GA"), 
                  React.createElement("option", {value: "HI"}, "HI"), 
                  React.createElement("option", {value: "ID"}, "ID"), 
                  React.createElement("option", {value: "IL"}, "IL"), 
                  React.createElement("option", {value: "IN"}, "IN"), 
                  React.createElement("option", {value: "IA"}, "IA"), 
                  React.createElement("option", {value: "KS"}, "KS"), 
                  React.createElement("option", {value: "KY"}, "KY"), 
                  React.createElement("option", {value: "LA"}, "LA"), 
                  React.createElement("option", {value: "ME"}, "ME"), 
                  React.createElement("option", {value: "MD"}, "MD"), 
                  React.createElement("option", {value: "MA"}, "MA"), 
                  React.createElement("option", {value: "MI"}, "MI"), 
                  React.createElement("option", {value: "MN"}, "MN"), 
                  React.createElement("option", {value: "MS"}, "MS"), 
                  React.createElement("option", {value: "MO"}, "MO"), 
                  React.createElement("option", {value: "MT"}, "MT"), 
                  React.createElement("option", {value: "NE"}, "NE"), 
                  React.createElement("option", {value: "NV"}, "NV"), 
                  React.createElement("option", {value: "NH"}, "NH"), 
                  React.createElement("option", {value: "NJ"}, "NJ"), 
                  React.createElement("option", {value: "NM"}, "NM"), 
                  React.createElement("option", {value: "NY"}, "NY"), 
                  React.createElement("option", {value: "NC"}, "NC"), 
                  React.createElement("option", {value: "ND"}, "ND"), 
                  React.createElement("option", {value: "OH"}, "OH"), 
                  React.createElement("option", {value: "OK"}, "OK"), 
                  React.createElement("option", {value: "OR"}, "OR"), 
                  React.createElement("option", {value: "PA"}, "PA"), 
                  React.createElement("option", {value: "RI"}, "RI"), 
                  React.createElement("option", {value: "SC"}, "SC"), 
                  React.createElement("option", {value: "SD"}, "SD"), 
                  React.createElement("option", {value: "TN"}, "TN"), 
                  React.createElement("option", {value: "TX"}, "TX"), 
                  React.createElement("option", {value: "UT"}, "UT"), 
                  React.createElement("option", {value: "VT"}, "VT"), 
                  React.createElement("option", {value: "VA"}, "VA"), 
                  React.createElement("option", {value: "WA"}, "WA"), 
                  React.createElement("option", {value: "WV"}, "WV"), 
                  React.createElement("option", {value: "WI"}, "WI"), 
                  React.createElement("option", {value: "WY"}, "WY")
                ), 
                React.createElement("input", {className: this.getClasses("address_zip", ["city-state-zip-field"]), onChange: this.handleChange, type: "text", id: "address_zip", defaultValue: "Zip Code"})
              )
            )
            ));
    }
});

module.exports = CreditCard;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/number":10,"./OrderSummary":5,"classnames":11,"underscore":"9eM++n"}],2:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require('underscore');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var Ticketing = require('./Ticketing');
var CreditCard = require('./CreditCard');
var OrderSummary = require('./OrderSummary');
var Location = require('./Location');


var Event = React.createClass({displayName: 'Event',

    getInitialState: function() {
        var orderSummaryOpen = false, orderError = false;

        if (!_.isEmpty(this.props.transaction)) {
            if (this.props.transaction.status == 'paypal_error') {
                orderError = true;
            } else {
                orderSummaryOpen = true;
            }
        }

        return {'showCreditCard': false,
                'quantity': 1,
                'total': 1,
                'orderSummaryOpen': orderSummaryOpen,
                'orderError': orderError};
    },

    closeOrderSummaryOverlay: function() {
        this.setState({orderSummaryOpen: false,
                       showCreditCard: false});
    },

    purchase: function() {
        var url = this.props.urls.execute_paypal + "?paymentId=" + this.props.transaction.processor_payment_id;
        window.location.href = url;
    },

    clear: function() {
        window.location.href = this.props.urls.restart;
    },

    drawCreditCard: function() {
        var props = _.clone(this.props);
        props.quantity = this.state.quantity; 
        props.total = this.state.total;
        props.close = this.closeOrderSummaryOverlay;
        return React.createElement(CreditCard, React.__spread({},  props ));
    },

    showCreditCard: function(quantity, total) { 
        this.setState({
            'showCreditCard': true,
            'quantity': quantity,
            'total': total
        });
    },

    drawTicketing: function() {
        var props = _.clone(this.props);
        props.showPurchase = !_.isEmpty(this.props.transaction);
        props.purchase = this.purchase;
        props.showCreditCard = this.showCreditCard;
        return React.createElement(Ticketing, React.__spread({},  props));
    },

    drawOrderSummaryOverlay: function() {
        if (!this.state.orderSummaryOpen) {
            return '';
        }

        var props = this.props.transaction;
        props.close = this.closeOrderSummaryOverlay;
        props.purchase = this.purchase;

        return React.createElement(OrderSummary, React.__spread({},  props));
    },

    drawOrderError: function() {
        if (!this.state.orderError) {
            return '';
        }

        return (
          React.createElement("div", {className: "large-12 columns"}, 
              React.createElement("div", {'data-alert': true, className: "alert-box alert radius"}, 
                "Paypal returned an error.  ", React.createElement("a", {onClick:  this.purchase}, "Retry your payment"), " or ", React.createElement("a", {onClick:  this.clear}, "start again.")
            )
          ));
    },
    // updateData: function(quantity, total){
    //      this.setState({
    //         'quantity': quantity,
    //         'total': total
    //     });       
    // },

    render: function() {
        return (
          React.createElement("div", null, 
            React.createElement("article", null, 
              React.createElement("div", {className: "row"}, 
                 this.drawOrderError(), 

                React.createElement("div", {className: "event-detail"}, 
                  React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "large-12 column"}, 
                      React.createElement("span", {className: "small-4 ticket-column-headings"}, "Event Details"), 
                      React.createElement("p", {className: "event-details"}, this.props.description)
                    )
                  )
                ), 
                React.createElement("div", {className: "large-4 columns event-left-column"}, 
                  React.createElement("div", {className: "small-4  event-image-container"}, React.createElement("img", {className: "event-col-img", src:  this.props.image})), 
                    
                  React.createElement("div", {className: "small-4 event-details2"}, 
                    React.createElement("span", {className: "small-4 ticket-column-headings"}, "Event Details"), 
                    React.createElement("p", {className: "event-details"}, this.props.description)
                  ), 

                  React.createElement("div", {className: "small-4 location-container"}, 
                    React.createElement(Location, React.__spread({},  this.props.location)), 
                    React.createElement("div", {className: "event-start"}, 
                      this.props.startText
                    )
                  )

                ), 
                React.createElement("div", {className: "large-8 columns event-right-column"}, 
                   this.state.showCreditCard ? this.drawCreditCard() : this.drawTicketing(), 
                  React.createElement("br", null)
                )
              )
            ), 
             this.drawOrderSummaryOverlay() 
          )
        );
    }
});

module.exports = Event;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./CreditCard":1,"./Location":4,"./OrderSummary":5,"./Ticketing":7,"underscore":"9eM++n"}],3:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require("underscore");
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var Location = require('./Location');

var EventHeader = React.createClass({displayName: 'EventHeader',
    render: function() {
        return (
          React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "small-2 columns"}, 
              React.createElement("div", {className: "event-date"}, 
                React.createElement("p", {className: "event-date-day-of-week"},  this.props.dow), 
                React.createElement("span", {className: "event-date-month"},  this.props.month, " "), 
                React.createElement("span", {className: "event-date-day"},  this.props.day)
              )
            ), 
            React.createElement("div", {className: "small-10 columns", id: "event-details"}, 
              React.createElement("span", {className: "event-presenter"},  this.props.presenter), 
              React.createElement("h2", {className: "event-name"},  this.props.name), 
              React.createElement("span", {className: "event-subtitle"},  this.props.subtitle)
            )
          )
        );
    }
});

module.exports = EventHeader;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Location":4,"underscore":"9eM++n"}],4:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require("underscore");
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var Location = require('./Location');


var Location = React.createClass({displayName: 'Location',
    render: function() {
        return (
            React.createElement("div", {id: "location"}, 
              React.createElement("span", {className: "location-name"}, this.props.name), 
              React.createElement("a", {className: "event-location", href: "http://maps.google.com/maps?daddr=" + this.props.addr_code, rel: "nofollow", target: "_blank"}, 
                React.createElement("img", {src: "https://cdn.ticketfly.com/wp-content/themes/ticketfly-v3/img/icon-location-small.gif"})
              ), 
              React.createElement("div", {className: "location-address"}, 
                React.createElement("span", null, this.props.line1), 
                 this.props.line2 ? React.createElement("span", null, this.props.line2) : '', 
                React.createElement("span", null, this.props.city + ", " + this.props.state + " " + this.props.zipcode), 
                React.createElement("span", null, this.props.phone)
              ), 
              React.createElement("div", {className: "event-start"}, this.props.startText)
            )
        );
    }
});

module.exports = Location

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./Location":4,"underscore":"9eM++n"}],5:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require('underscore');
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var number = require('../utils/number');

var OrderSummary = React.createClass({displayName: 'OrderSummary',
  
    drawLocation: function() {
        return this.props.event.location.name + ", " + this.props.event.location.line1 + ", " + this.props.event.location.city;
    },
    render: function() {
        return (
            React.createElement("div", null, 
              React.createElement("div", {id: "myModal", className: "transaction-modal", 'data-reveal': true, 'aria-labelledby': "modalTitle", 'aria-hidden': "true", role: "dialog"}, 
                React.createElement("h2", {id: "modalTitle"}, "Review & Place Your Order"), 
                React.createElement("div", {className: "order-summary"}, 
                  React.createElement("dl", null, 
                    React.createElement("dt", null, "Show:"), React.createElement("dd", null, this.props.event.name), 
                    React.createElement("dt", null, "Date/Time:"), React.createElement("dd", null, this.props.event.datetime), 
                    React.createElement("dt", null, "Location:"), React.createElement("dd", null, this.drawLocation()), 
                    React.createElement("dt", null, "# Tickets:"), React.createElement("dd", null, this.props.quantity), 
                    React.createElement("hr", null), 
                    React.createElement("dt", null, "TOTAL:"), React.createElement("dd", null, number.asCurrency(this.props.amount)), 
                    React.createElement("hr", null)
                  ), 
                  React.createElement("div", {className: "order-button-holder"}, 
                    React.createElement("a", {href: "#", className: "button order-button", onClick: this.props.purchase}, "Place Your Order")
                  )
                ), 
                React.createElement("a", {className: "close", onClick: this.props.close}, "×")
              )
            )
        );
    }
});

module.exports = OrderSummary;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/number":10,"underscore":"9eM++n"}],6:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require("underscore");
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var number = require('../utils/number');

var Receipt = React.createClass({displayName: 'Receipt',
    drawLocation: function() {
        return this.props.location.line1 + ', ' + this.props.location.city + ', ' + this.props.location.state;
    },

    render: function() {
        return (
            React.createElement("div", {className: "ticketing"}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "large-12 column"}, 
                  React.createElement("h2", null, "Thank You for your Order!"), 
                  React.createElement("dl", null, 
                    React.createElement("dt", null, "Order Number:"), React.createElement("dd", null, this.props.transaction.order_number), 
                    React.createElement("dt", null, "Name:"), React.createElement("dd", null,  this.props.transaction.user.first_name + ' ' + this.props.transaction.user.last_name), 
                    React.createElement("dt", null, "Show:"), React.createElement("dd", null, this.props.name), 
                    React.createElement("dt", null, "Date/Time:"), React.createElement("dd", null, this.props.datetime), 
                    React.createElement("dt", null, "Location:"), React.createElement("dd", null, this.drawLocation()), 
                    React.createElement("dt", null, "# Tickets:"), React.createElement("dd", null, this.props.transaction.quantity), 
                    React.createElement("hr", null), 
                    React.createElement("dt", null, "TOTAL:"), React.createElement("dd", null, number.asCurrency(this.props.transaction.amount)), 
                    React.createElement("hr", null)
                  ), 
                  React.createElement("p", null, "Please collect your tickets at Will Call.")
                )
              )
            )
        );
    }
});

module.exports = Receipt;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/number":10,"underscore":"9eM++n"}],7:[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var _ = require("underscore");
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var number = require('../utils/number');
// var Location = require('./Location');


var Ticketing = React.createClass({displayName: 'Ticketing',

    getInitialState: function() {
        if (!_.isEmpty(this.props.transaction)) {
            return {'quantity': this.props.transaction.quantity,
                    'total': this.calculateTotal(this.props.transaction.quantity)};
        } else {
            return {'quantity': 0,
                    'total': 0};
        }
    },

    calculateTotal: function(quantity) {
        return ((parseFloat(this.props.pricePer) + parseFloat(this.props.serviceFee) + parseFloat(this.props.facilitiesFee)) * quantity).toFixed(2);
    },

    changeQuantity: function(event) {
        var quantity = parseFloat(event.target.value);
        var total = this.calculateTotal(quantity);
        this.setState({'quantity': quantity,
                       'total': total });
        // this.props.showCreditCard(quantity, total);
    },

    drawTicketSelect: function() {
        if (!_.isEmpty(this.props.transaction)) {
            return React.createElement("p", {className: "ticket-service-fee ticket-column-data"}, this.state.quantity);
        } else {
            return (
                React.createElement("div", null, 
                  React.createElement("select", {onChange: this.changeQuantity, name: "ticket-quantity", className: "ticket-quantity ticket-column-data"}, 
                    React.createElement("option", null, "Select #"), 
                     _.map(_.range(10), function(i) { return React.createElement("option", {key: "option_" + i, value: i+1}, i+1) }), ";"
                  ), 
                  React.createElement("p", {className: "ticket-service-fee ticket-column-data"})
                )
            );
        }
    },

    drawTotals: function() {
        return (
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "large-12"}, 
                React.createElement("div", {className: "ticket-header large-4 columns", id: "total-price"}, 
                  React.createElement("p", {className: "ticket-shipping ticket-column-data"}, "Total:   ", number.asCurrency(this.state.total))
                )
              )
            ));
    },

    paypalOnClick: function(event) {
        if (this.state.quantity === 0) {
            alert("Please select a quantity before continuing.");
            event.preventDefault();
        }
    },

    stripeOnClick: function(event) {
        event.preventDefault();

        if (this.state.quantity === 0) {
            alert("Please select a quantity before continuing.");
            return;
        }

        this.props.showCreditCard(this.state.quantity, this.state.total);
    },

    drawPurchaseButton: function() {
        var description = this.state.quantity + " tickets ($" + this.state.total + ")";

        if (this.props.showPurchase) {
            return React.createElement("div", {className: "large-4 right ticketing-order-button-holder"}, 
                     React.createElement("a", {href: "#", className: "button order-button", onClick: this.props.purchase}, "Place Your Order")
                   );
        } else {
            return React.createElement("div", {className: "large-3 columns right ticketing-order-button-holder"}, 
                     React.createElement("button", {className: "stripe-button-el", onClick: this.stripeOnClick, id: "customButton"}, "Proceed")
                   );
        }
    },

    render: function() {
        return (
            React.createElement("div", {className: "ticketing"}, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "large-12 column"}, 
                  React.createElement("div", {className: "ticket-column-headings hide"}, "Buy Tickets"), 
                  React.createElement("p", {className: "ticket-column-data ticket-restrictions"},  this.props.maxQuantity ? "There is a " + this.props.maxQuantity + " ticket limit per customer.  " : null, "Service fees are non-refundable.")
                )
              ), 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "large-12"}, 
                  React.createElement("div", {className: "ticket-details columns"}, 
                    React.createElement("ul", null, 
                      React.createElement("li", {className: "large-3 columns"}, 
                        React.createElement("div", {className: "ticket-column-headings ticket-type"}, "Ticket Type"), 
                        React.createElement("p", {className: "ticket-type ticket-column-data"}, "Regular")
                      ), 
                      React.createElement("li", {className: "large-3 columns"}, 
                        React.createElement("div", {className: "ticket-column-headings"}, "Item Price"), 
                        React.createElement("p", {className: "ticket-price ticket-column-data"}, number.asCurrency(this.props.pricePer))
                      ), 
                      React.createElement("li", {className: "large-3 columns"}, 
                        React.createElement("div", {className: "ticket-column-headings"}, "Service Fee", React.createElement("i", {className: "fa fa-info", 'data-toggle': "tooltip", 'data-placement': "top", title: "", 'data-tooltip-on': "", 'data-original-title': "$0.05 per additional GB"})), 
                        React.createElement("p", {className: "ticket-service-fee ticket-column-data"}, number.asCurrency(this.props.serviceFee))
                      ), 
                      React.createElement("li", {className: "large-3 columns"}, 
                        React.createElement("div", {className: "ticket-column-headings"}, "Facilities Fee", React.createElement("i", {className: "fa fa-info", 'data-toggle': "tooltip", 'data-placement': "top", title: "", 'data-tooltip-on': "", 'data-original-title': "$0.05 per additional GB"})), 
                        React.createElement("p", {className: "ticket-facilities-fee ticket-column-data"}, number.asCurrency(this.props.facilitiesFee))
                      )
                    )
                  )
                )
              ), 
                React.createElement("div", {className: "row ticketing-selects-row"}, 
                  React.createElement("div", {className: "large-12"}, 
                    React.createElement("div", {className: "large-4 columns"}, 
                      React.createElement("p", {className: "quantity ticket-shipping ticket-column-data"}, "Quantity")
                    ), 
                    React.createElement("div", {className: "ticket-header large-8 columns"}, 
                        this.drawTicketSelect() 
                    )
                  ), 
                  React.createElement("div", {className: "large-12"}, 
                    React.createElement("div", {className: "ticket-header large-4 columns"}, 
                      React.createElement("p", {className: "shipping-method ticket-shipping ticket-column-data"}, "Shipping method")
                    ), 
                    React.createElement("div", {className: "ticket-header  large-8 columns"}, 
                      React.createElement("select", {name: "ticket-shipping-options", className: "ticket-shipping-options ticket-column-data"}, 
                        React.createElement("option", {value: "wc"}, "Will Call")
                      )
                    )
                  )
                ), 
              React.createElement("hr", null), 
               this.state.quantity > 0 ? [this.drawTotals(), React.createElement("hr", null)] : null, 
              React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "large-12"}, 
                   this.drawPurchaseButton() 
                )
              )
            )
        );
    }
});

module.exports = Ticketing;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../utils/number":10,"underscore":"9eM++n"}],"eventRender":[function(require,module,exports){
module.exports=require('97BZ3n');
},{}],"97BZ3n":[function(require,module,exports){
(function (global){
/** @jsx React.DOM */

var React = (typeof window !== "undefined" ? window.React : typeof global !== "undefined" ? global.React : null);
var $ = (typeof window !== "undefined" ? window.$ : typeof global !== "undefined" ? global.$ : null);
var _ = require("underscore");
var EventHeader = require("./components/EventHeader");
var Event = require("./components/Event");
var Receipt = require("./components/Receipt");


module.exports.getEventHeader = function(event, urls, stripe) {
    var props = _.extend(event, urls);
    props.stripe = stripe;
    return React.createElement(EventHeader, React.__spread({},  props));
};

module.exports.getEventDetail = function(event, urls, transaction, stripe) {
    var props = _.extend(event, urls);
    props.transaction = transaction;
    props.stripe = stripe;
    return React.createElement(Event, React.__spread({},  props));
};

module.exports.getReceipt = function(event, urls, transaction) {
    if (transaction.status != 'completed') {
        return;
    }

    var props = _.extend(event, urls);
    props.transaction = transaction;
    return React.createElement(Receipt, React.__spread({},  props));
};

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/Event":2,"./components/EventHeader":3,"./components/Receipt":6,"underscore":"9eM++n"}],10:[function(require,module,exports){
module.exports.asFormatedString = function(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

module.exports.asCurrency = function(num) {
    if (isNaN(num) || !num && num !== 0) {
        return '--';
    }

    var neg = (num < 0);
    if (neg) {
        num = num * -1;
    }

    var str = module.exports.asFormatedString(parseFloat(num).toFixed(2));
    str = "$" + str;
    if (neg) {
        str = "(" + str + ")";
    }
    return str;
};

},{}],11:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],"underscore":[function(require,module,exports){
module.exports=require('9eM++n');
},{}],"9eM++n":[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},["97BZ3n"])