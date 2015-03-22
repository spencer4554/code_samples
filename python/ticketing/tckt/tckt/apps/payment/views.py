# -*- coding: utf-8 -*-
from __future__ import unicode_literals

#import paypalrestsdk

from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404, redirect

from .utils import create_paypal_payment
from tckt.apps.event.models import Event


def paypal_start(request):
    event = get_object_or_404(Event, pk=request.REQUEST.get('event_id'))
    amount = event.price_per * int(request.REQUEST['quantity'])
    payment_urls = create_paypal_payment(amount,
                                         record_url=request.build_absolute_uri(reverse('payment:record')),
                                         cancel_url=request.build_absolute_uri(reverse('payment:cancel')))

    request.session['execute_url'] = payment_urls['execute_url']
    request.session['payment_url'] = payment_urls['payment_url']

    return redirect(payment_urls['approval_url'])
    

def paypal_record(request):
    pass


def paypal_cancel(request):
    pass
