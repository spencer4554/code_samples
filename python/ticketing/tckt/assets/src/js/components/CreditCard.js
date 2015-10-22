/** @jsx React.DOM */

React = require('react');
var _ = require('underscore');
var $ = require('jquery');
var number = require('../utils/number');
var classNames = require('classnames');

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
            'exp_month': null,
            'exp_year': null,
            'address_line1': null,
            'address_line2': null,
            'address_city': null,
            'address_state': null,
            'address_zip': null,
            'address_country': 'USA',
            'errors': {},
            'defaultsCleared': [],
            'errorMessage': null
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
        var RequiredFields = ['name', 'number', 'cvc', 'exp_month', 'exp_year', 'address_line1', 'address_city', 'address_state', 'address_zip'];
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

    stripeResponseHandler: function(status, response) {
        if (status == 200) {
            debugger;
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
              <div className="row">
                <div className="large-12">
                  <div className="large-9 columns">
                    <p>ENTER YOUR PAYMENT DETAILS</p>
                    { this.state.errorMessage !== null ? <div className="error-message">* { this.state.errorMessage }</div> : "" }
                    { this.drawForm() }
                  </div>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="large-12 columns" style={{ 'paddingRight': 30, 'paddingTop': 10 }}>
                  <button onClick={this.handleSubmit} style={{'float': 'right'}}>Place Order</button>
                </div>
              </div>
            </div>
        );
    },

    getClasses: function(fieldName, extraClasses) {
        if (this.state.defaultsCleared===undefined) {
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
              <input className={this.getClasses("name")} onChange={this.handleChange} type="text" id="name" defaultValue="Name" />
              <input className={this.getClasses("number")} onChange={this.handleChange} type="text" id="number" defaultValue="Card Number" style={{'width': 299, 'float': 'left'}} value={this.state.number} />
              <input className={this.getClasses("cvc")} onChange={this.handleChange} type="text" id="cvc" defaultValue="CVC/Security Code" style={{'width': 150, 'float': 'right'}} />
              <select className={this.getClasses("exp_month")} onChange={this.handleChange} id="exp_month" style={{'width': 150, 'marginRight': 6}}>
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
              <select className={this.getClasses("exp_year")} onChange={this.handleChange} id="exp_year" style={{'width': 150}}>
                  <option value="">Expiration Year</option>
                  <option value="2015">2015</option>
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
              <hr />
              <input className={this.getClasses("address_line1")} onChange={this.handleChange} type="text" id="address_line1" defaultValue="Address line 1"/>
              <input className={this.getClasses("address_line2")}  onChange={this.handleChange} type="text" id="address_line2" defaultValue="Address line 2"/>
              <div className="city-state-zip-section">
                <input className={this.getClasses("address_city", ["city-state-zip-field"])}  onChange={this.handleChange} type="text" id="address_city" defaultValue="City" style={{'width': 170}} />
                <select className={this.getClasses("address_state", ["city-state-zip-field"])} onChange={this.handleChange} id="address_state" style={{'width': 100}}>
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
                <input className={this.getClasses("address_zip", ["city-state-zip-field"])} onChange={this.handleChange} type="text" id="address_zip" defaultValue="Zip Code" style={{'width': 130}} />
              </div>
            </form>);
    }
});

module.exports = CreditCard;
