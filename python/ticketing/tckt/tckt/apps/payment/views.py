# -*- coding: utf-8 -*-
from __future__ import unicode_literals

#import paypalrestsdk

import logging
from decimal import Decimal
from coffin.shortcuts import render
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404, redirect

from .utils import (create_paypal_payment,
                    get_total,
                    update_transaction,
                    get_payment,
                    PaymentNotFoundError,
                    mark_transaction_expired,
                    mark_transaction_successful,
                    mark_transaction_error,
                    mark_transaction_canceled)
from .models import Transaction
from tckt.apps.event.models import Event
from tckt.apps.event.utils import get_event_context


class PaymentNotEqualError(Exception):
    pass


def paypal_start(request):
    quantity = int(request.REQUEST.get('quantity', '0'))
    event = get_object_or_404(Event, pk=request.REQUEST.get('event_id'))
    amount = get_total(event, quantity)

    if amount != Decimal(request.REQUEST.get('amount', '0')):
        raise PaymentNotEqualError()

    cancel = "{}?event_slug={}".format(reverse('payment:cancel_paypal'), event.slug)

    payment_urls = create_paypal_payment(event,
                                         quantity,
                                         amount,
                                         return_url=request.build_absolute_uri(reverse('payment:record_paypal')),
                                         cancel_url=request.build_absolute_uri(cancel))

    set_session_data(payment_urls, request)

    return redirect(payment_urls['approval_url'])


def set_session_data(payment_urls, request):
    request.session['execute_url'] = payment_urls['execute_url']
    request.session['payment_url'] = payment_urls['payment_url']
    request.session['event_id'] = request.REQUEST.get('event_id')


def clear_session_data(request):
    request.session['execute_url'] = None
    request.session['payment_url'] = None
    request.session['event_id'] = None


# {'create_time': u'2015-06-07T20:26:25Z',
#  'id': u'PAY-34F52568R9671500SKV2KR4I',
#  'intent': u'sale',
#  'links': [{'href': u'https://api.sandbox.paypal.com/v1/payments/payment/PAY-34F52568R9671500SKV2KR4I',
#             'method': u'GET',
#             'rel': u'self'},
#            {'href': u'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-4EV79458L00626609',
#             'method': u'REDIRECT',
#             'rel': u'approval_url'},
#            {'href': u'https://api.sandbox.paypal.com/v1/payments/payment/PAY-34F52568R9671500SKV2KR4I/execute',
#             'method': u'POST',
#             'rel': u'execute'}],
#  'payer': {'payer_info': {'email': u'paulprior-buyer@yahoo.com',
#                           'first_name': u'Test',
#                           'last_name': u'Buyer',
#                           'payer_id': u'SJBGQMURMR7XS',
#                           'shipping_address': {'city': u'San Jose',
#                                                'country_code': u'US',
#                                                'line1': u'1 Main St',
#                                                'postal_code': u'95131',
#                                                'recipient_name': u'Test Buyer',
#                                                'state': u'CA'}},
#            'payment_method': u'paypal',
#            'status': u'VERIFIED'},
#  'state': u'created',
#  'transactions': [{'amount': {'currency': u'USD',
#                               'details': {'subtotal': u'29.12'},
#                               'total': u'29.12'},
#                    'description': u'creating a payment',
#                    'related_resources': []}],
#  'update_time': u'2015-06-07T20:26:25Z'}
def paypal_record(request):
    transaction = Transaction.objects.get(processor_payment_id=request.REQUEST['paymentId'])
    try:
        payment = get_payment(request.REQUEST['paymentId'])
    except PaymentNotFoundError:
        mark_transaction_expired(transaction)
        return redirect(reverse('event:detail'))

    update_transaction(transaction,
                       request.REQUEST['token'],
                       payment)

    context = get_event_context(transaction.event)
    context['transaction'] = transaction.to_json()

    return render(request, "event/detail.html", context)


def paypal_execute(request):
    logger = logging.getLogger(__name__)
    transaction = Transaction.objects.get(processor_payment_id=request.REQUEST['paymentId'])
    payment = get_payment(request.REQUEST['paymentId'])

    if payment.execute({'payer_id': payment.to_dict()['payer']['payer_info']['payer_id']}):
        mark_transaction_successful(transaction)
        logger.critical("Payment execute successfully")

    if transaction.status == 'completed':
        return redirect("{}?paymentId={}".format(reverse('payment:receipt'), request.REQUEST['paymentId']))

    mark_transaction_error(transaction)
    logger.critical(payment.error)  # Error Hash

    context = get_event_context(transaction.event)
    context['transaction'] = transaction.to_json()

    return render(request, "event/detail.html", context)


def paypal_cancel(request):
    try:
        t = Transaction.objects.get(token=request.REQUEST['token'])
        mark_transaction_canceled(t)
    except Transaction.DoesNotExist:
        pass
    return redirect(reverse('event:detail', args=[request.REQUEST['event_slug']]))


def stripe_execute(request):
    quantity = int(request.REQUEST.get('quantity', '0'))
    event = get_object_or_404(Event, pk=request.REQUEST.get('event_id'))
    amount = get_total(event, quantity)

    if amount != Decimal(request.REQUEST.get('amount', '0')):
        raise PaymentNotEqualError()

    request.REQUEST.get('token')
    request.REQUEST.get('email')

    return None


def receipt(request):
    transaction = Transaction.objects.get(processor_payment_id=request.REQUEST['paymentId'])
    context = get_event_context(transaction.event)
    context['transaction'] = transaction.to_json()
    return render(request, "payment/receipt.html", context)
