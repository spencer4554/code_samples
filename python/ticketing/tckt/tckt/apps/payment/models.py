# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
import json

STATUSES = [('started', 'started'),
            ('paypal_returned', 'paypal_returned'),
            ('paypal_expired', 'paypal_expired'),
            ('canceled', 'canceled'),
            ('completed', 'completed'),
            ('refunded', 'refunded')]


class Transaction(models.Model):
    processor_payment_id = models.CharField(max_length=50)
    event = models.ForeignKey('event.Event')
    quantity = models.IntegerField()
    amount = models.FloatField()
    status = models.CharField(max_length=50, choices=STATUSES)
    user = models.ForeignKey('TransactionUser', null=True, blank=True)
    token = models.CharField(max_length=50, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def to_dict(self):
        return {'processor_payment_id': self.processor_payment_id,
                'event': self.event.to_dict(),
                'quantity': self.quantity,
                'amount': self.amount,
                'status': self.status,
                'user': self.user.to_dict(),
                'token': self.token}

    def to_json(self):
        return json.dumps(self.to_dict())


class TransactionUser(models.Model):
    email = models.EmailField()
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    payer_id = models.CharField(max_length=50)
    shipping_address = models.ForeignKey('event.location')
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def to_dict(self):
        return {'email': self.email,
                'first_name': self.first_name,
                'last_name': self.last_name,
                'payer_id': self.payer_id,
                'shipping_address': self.shipping_address.to_dict()}
