# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.db import models


def _image_upload_to(instance, filename):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S")
    return "offer-image/{}/{}/{}.jpg".format(instance.offering.uid, instance.ref, timestamp)


class Location(models.Model):
    business_name = models.CharField(max_length=256)
    line1 = models.CharField(max_length=256)
    line2 = models.CharField(max_length=256)
    city = models.CharField(max_length=256)
    state = models.CharField(max_length=2)
    zipcode = models.CharField(max_length=2)


class Event(models.Model):
    name = models.CharField(max_length=60)
    short_description = models.CharField(max_length=512)
    description = models.CharField(max_length=4096)
    presenter = models.CharField(max_length=256)
    date = models.DateField()
    location = models.ForeignKey('event.location')
    image = models.ImageField(upload_to=_image_upload_to)
