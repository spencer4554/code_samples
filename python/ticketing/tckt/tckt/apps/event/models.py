# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime
import json

from django.db import models
from urllib import quote


def _image_upload_to(instance, filename):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    return "event-image/{}/{}.jpg".format(instance.id, timestamp)


class Location(models.Model):
    business_name = models.CharField(max_length=256)
    line1 = models.CharField(max_length=256)
    line2 = models.CharField(max_length=256, null=True, blank=True)
    city = models.CharField(max_length=256)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=5)
    phone = models.CharField(max_length=15)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def to_dict(self):
        return {'name': self.business_name,
                'line1': self.line1,
                'line2': self.line2,
                'city': self.city,
                'state': self.state,
                'zipcode': self.zipcode,
                'phone': self.phone,
                'addr_code': quote(",".join([self.line1, self.city, self.state, self.zipcode]))}


class Event(models.Model):
    name = models.CharField(max_length=60)
    subtitle = models.CharField(max_length=256)
    slug = models.CharField(max_length=100, unique=True)
    short_description = models.CharField(max_length=512)
    description = models.CharField(max_length=4096)
    presenter = models.CharField(max_length=256)
    date = models.DateTimeField()
    start_text = models.CharField(max_length=100)
    location = models.ForeignKey('event.location')
    image = models.ImageField(upload_to=_image_upload_to)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def to_dict(self):
        def suffix(d):
            return 'th' if 11 <= d <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(int(d) % 10, 'th')

        return {'eventId': self.id,
                'slug': self.slug,
                'maxQuantity': 10,
                'location': self.location.to_dict(),
                'presenter': self.presenter,
                'name': self.name,
                'subtitle': self.subtitle,
                'description': self.description,
                'dow': self.date.strftime('%a'),
                'month': self.date.strftime('%b'),
                'day': self.date.strftime('%d'),
                'datetime': self.date.strftime('%B %-d{} %Y, %-I:%M %p').format(suffix(self.date.strftime('%-d'))),
                'startText': self.start_text,
                'image': self.image.url}

    def to_json(self):
        data = self.to_dict()
        data.update(self.price.to_dict())
        return json.dumps(data)


class EventPrice(models.Model):
    event = models.OneToOneField(Event, primary_key=True, related_name='price')
    price_per = models.DecimalField(max_digits=6, decimal_places=2)
    service_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    facilities_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def total_price(self):
        return self.price_per + self.service_fee + self.facilities_fee

    def to_dict(self):
        return {'pricePer': str(self.price_per),
                'serviceFee': str(self.service_fee),
                'facilitiesFee': str(self.facilities_fee)}
