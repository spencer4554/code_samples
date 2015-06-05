# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import paypalrestsdk


def paypal_login():
    paypalrestsdk.configure({
        'mode': 'sandbox',
        'client_id': 'AQkquBDf1zctJOWGKWUEtKXm6qVhueUEMvXO_-MCI4DQQ4-LWvkDLIN2fGsd',
        'client_secret': 'EL1tVxAjhT7cJimnz5-Nsx9k2reTKSVfErNQF-CmrwJgxRtylkGTKlU4RvrX'
    })


"""
Direct the user to the approval_url on the PayPal site, so that the user can approve the payment. PayPal then redirects the user to the return_url that was specified when the payment was created. A payer ID is appended to the return URL, as PayerID.

The response should be this:
{
  "id": "PAY-6RV70583SB702805EKEYSZ6Y",
  "create_time": "2013-03-01T22:34:35Z",
  "update_time": "2013-03-01T22:34:36Z",
  "state": "created",
  "intent": "sale",
  "payer": {
    "payment_method": "paypal"
  },
  "transactions": [
    {
      "amount": {
        "total": "7.47",
        "currency": "USD",
        "details": {
          "subtotal": "7.47"
        }
      },
      "description": "This is the payment transaction description."
    }
  ],
  "links": [
    {
      "href": "https://api.sandbox.paypal.com/v1/payments/payment/PAY-6RV70583SB702805EKEYSZ6Y",
      "rel": "self",
      "method": "GET"
    },
    {
      "href": "https://www.sandbox.paypal.com/webscr?cmd=_express-checkout&token=EC-60U79048BN7719609",
      "rel": "approval_url",
      "method": "REDIRECT"
    },
    {
      "href": "https://api.sandbox.paypal.com/v1/payments/payment/PAY-6RV70583SB702805EKEYSZ6Y/execute",
      "rel": "execute",
      "method": "POST"
    }
  ]
} """
""""""


def get_total(event, num_tickets):
    return event.price.total_price() * num_tickets


def create_paypal_payment(amount, return_url, cancel_url):
    paypal_login()
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": return_url,
            "cancel_url": cancel_url,
        },
        "transactions": [{
            "amount": {
                "total": amount,
                "currency": "USD"
            },
            "description": "creating a payment"
        }]
    })

    payment.create()

    find_href = lambda rel: [x['href'] for x in payment['links'] if x['rel'] == rel][0]

    return {'approval_url': find_href('approval_url'),
            'execute_url': find_href('execute'),
            'payment_url': find_href('self')}
