# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

STATUSES = [('started', 'started'),
            ('paypal_returned', 'paypal_returned'),
            ('canceled', 'canceled'),
            ('completed', 'completed'),
            ('refunded', 'refunded')]


class Payment(models.model):
    processor_payment_id = models.CharField(max_length=50)
    event_id = models.ForeignKey('event.Event')
    amount = models.FloatField()
    status = models.CharField(max_length=50, choices=STATUSES)
    user_id = models.ForeignKey('PaymentUser', null=True, blank=True)


class PaymentUser(models.model):
    email = models.EmailField()
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    payer_id = models.CharField(max_length=50)
