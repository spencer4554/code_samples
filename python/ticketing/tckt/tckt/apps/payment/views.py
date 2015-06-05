# -*- coding: utf-8 -*-
from __future__ import unicode_literals

#import paypalrestsdk

from decimal import Decimal
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404, redirect

from .utils import create_paypal_payment, get_total
from tckt.apps.event.models import Event


class PaymentNotEqualError(Exception):
    pass


def paypal_start(request):
    event = get_object_or_404(Event, pk=request.REQUEST.get('event_id'))
    amount = get_total(event, int(request.REQUEST.get('quantity', '0')))

    if amount != Decimal(request.REQUEST.get('amount', '0')):
        raise PaymentNotEqualError()

    payment_urls = create_paypal_payment(amount,
                                         return_url=request.build_absolute_uri(reverse('payment:record')),
                                         cancel_url=request.build_absolute_uri(reverse('payment:cancel')))

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


def paypal_record(request):
    pass


def paypal_cancel(request):
    return redirect(reverse('event:detail'))
