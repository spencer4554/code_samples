# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import paypalrestsdk
from .models import Transaction, TransactionUser
from tckt.apps.event.models import Location


class PaymentNotFoundError(Exception):
    pass


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


def create_transaction(event, quantity, payment):
    d = payment.to_dict()
    return Transaction.objects.create(
        processor_payment_id=d['id'],
        event=event,
        quantity=quantity,
        amount=d['transactions'][0]['amount']['total'],
        status='started')


def create_paypal_payment(event, quantity, amount, return_url, cancel_url):
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
                "total": str(amount),
                "currency": "USD"
            },
            "description": "creating a payment"
        }]
    })

    payment.create()

    create_transaction(event, quantity, payment)

    find_href = lambda rel: [x['href'] for x in payment['links'] if x['rel'] == rel][0]

    return {'approval_url': find_href('approval_url'),
            'execute_url': find_href('execute'),
            'payment_url': find_href('self')}


def get_payment(payment_id):
    paypal_login()
    payment = paypalrestsdk.Payment.find(payment_id)

    data = payment.to_dict()

    if data == {}:
        raise PaymentNotFoundError()

    return data


def update_transaction(transaction, token, payment_data):
    transaction.status = 'paypal_returned'
    transaction.token = token

    payer_info = payment_data['payer']['payer_info']

    try:
        u = TransactionUser.objects.get(payer_id=payment_data['payer']['payer_info']['payer_id'])
        shipping_address = u.shipping_address
    except TransactionUser.DoesNotExist:
        u = TransactionUser()
        u.payer_id = payer_info['payer_id']
        shipping_address = Location()

    transaction.user = u

    u.email = payer_info['email']
    u.first_name = payer_info['first_name']
    u.last_name = payer_info['last_name']

    address = payer_info['shipping_address']

    shipping_address.line1 = address['line1']
    shipping_address.city = address['city']
    shipping_address.state = address['state']
    shipping_address.zipcode = address['postal_code']

    shipping_address.save()
    u.shipping_address = shipping_address
    u.save()
    transaction.save()


def mark_transaction_expired(transaction):
    transaction.status = 'paypal_expired'
    transaction.save()
