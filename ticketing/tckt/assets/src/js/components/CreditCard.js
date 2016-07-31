/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var number = require('../utils/number');
var classNames = require('classnames');

var OrderSummary = require('./OrderSummary');
// var Location = require('./Location');

var CreditCard = React.createClass({

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
            <div className="ticketing">          
              <div className="row" id="cc-container">
                  <div className="large-12 columns" id="cc-form">
                    <div className="row" id="summary">
                      <div className="small-12"> {this.props.name} </div>
                      <div className="small-12"> {this.props.datetime} </div>
                    </div>
                    
                    <div className="row" id="summary-details">
                      <div className="small-4">Ticket Type: <span className="break gold">REGULAR</span></div>
                      <div className="small-4">Quantity: <span className="break gold">{this.props.quantity}</span></div>
                      <div className="small-4">Total: <span className="break gold">${this.props.total}</span></div>
                    </div>
                    <p> ENTER YOUR PAYMENT DETAILS</p>
                    { this.state.errorMessage !== null ? <div className="error-message">* { this.state.errorMessage }</div> : "" }
                    { this.drawForm() }
                  </div>
                <hr />
                <div className="row">
                  <div className="large-12 columns cc-button-container">
                    <button onClick={this.handleSubmit} className="cc-submit-button">Proceed</button>
                  </div>
                </div>
              </div>
            </div>
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
            <form>
            <div className="row">
              <div className="large-12">
                <input className={this.getClasses("name")} onChange={this.handleChange} type="text" id="name" defaultValue="Name" />
              </div>
            </div>
            <div className="row">
              <div className="large-8 small-6">
                <input className={this.getClasses("number")} onChange={this.handleChange} type="text" id="number" defaultValue="Card Number" value={this.state.number} />
              </div>
              <div className="large-4 small-2">
                <input className={this.getClasses("cvc")} onChange={this.handleChange} type="text" id="cvc" defaultValue="CVC/Security Code" />
              </div>
              <div className="large-6 small-2">
                <select className={this.getClasses("exp_month")} onChange={this.handleChange} id="exp_month">
                    <option value="">Expiration Month</option>
                    <option value="01">01</option>
                    <option value="02">02</option>
                    <option value="03">03</option>
                    <option value="04">04</option>
                    <option value="05">05</option>
                    <option value="06">06</option>
                    <option value="07">07</option>
                    <option value="08">08</option>
                    <option value="09">09</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                </select>
              </div>
              <div className="large-6 small-2">
                <select className={this.getClasses("exp_year")} onChange={this.handleChange} id="exp_year">
                    <option value="">Expiration Year</option>
                    <option value="2016">2016</option>
                    <option value="2017">2017</option>
                    <option value="2018">2018</option>
                    <option value="2019">2019</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                </select>
              </div>
            </div> 
              <hr />
            <div className="row">
              <input className={this.getClasses("address_line1")} onChange={this.handleChange} type="text" id="address_line1" defaultValue="Address line 1"/>
            </div>
            <div className="row">
              <input className={this.getClasses("address_line2")}  onChange={this.handleChange} type="text" id="address_line2" defaultValue="Address line 2"/>
            </div>
            <div className="row">
              <div className="city-state-zip-section">
                <input className={this.getClasses("address_city", ["city-state-zip-field"])}  onChange={this.handleChange} type="text" id="address_city" defaultValue="City" />
                <select className={this.getClasses("address_state", ["city-state-zip-field"])} onChange={this.handleChange} id="address_state" >
                  <option value="">State</option>
                  <option value="AL">AL</option>
                  <option value="AK">AK</option>
                  <option value="AZ">AZ</option>
                  <option value="AR">AR</option>
                  <option value="CA">CA</option>
                  <option value="CO">CO</option>
                  <option value="CT">CT</option>
                  <option value="DE">DE</option>
                  <option value="FL">FL</option>
                  <option value="GA">GA</option>
                  <option value="HI">HI</option>
                  <option value="ID">ID</option>
                  <option value="IL">IL</option>
                  <option value="IN">IN</option>
                  <option value="IA">IA</option>
                  <option value="KS">KS</option>
                  <option value="KY">KY</option>
                  <option value="LA">LA</option>
                  <option value="ME">ME</option>
                  <option value="MD">MD</option>
                  <option value="MA">MA</option>
                  <option value="MI">MI</option>
                  <option value="MN">MN</option>
                  <option value="MS">MS</option>
                  <option value="MO">MO</option>
                  <option value="MT">MT</option>
                  <option value="NE">NE</option>
                  <option value="NV">NV</option>
                  <option value="NH">NH</option>
                  <option value="NJ">NJ</option>
                  <option value="NM">NM</option>
                  <option value="NY">NY</option>
                  <option value="NC">NC</option>
                  <option value="ND">ND</option>
                  <option value="OH">OH</option>
                  <option value="OK">OK</option>
                  <option value="OR">OR</option>
                  <option value="PA">PA</option>
                  <option value="RI">RI</option>
                  <option value="SC">SC</option>
                  <option value="SD">SD</option>
                  <option value="TN">TN</option>
                  <option value="TX">TX</option>
                  <option value="UT">UT</option>
                  <option value="VT">VT</option>
                  <option value="VA">VA</option>
                  <option value="WA">WA</option>
                  <option value="WV">WV</option>
                  <option value="WI">WI</option>
                  <option value="WY">WY</option>
                </select>
                <input className={this.getClasses("address_zip", ["city-state-zip-field"])} onChange={this.handleChange} type="text" id="address_zip" defaultValue="Zip Code" />
              </div>
            </div>
            </form>);
    }
});

module.exports = CreditCard;
