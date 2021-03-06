# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.core.management.base import BaseCommand

from ...models import Event, Location, EventPrice


class Command(BaseCommand):
    def handle(self, *args, **options):
        location_1 = Location.objects.create(
            business_name="Fat Cat Music House and Lounge",
            line1="930 11th Street",
            city="Modesto",
            state="CA",
            zipcode="95354",
            phone='9173068629')

        location_2 = Location.objects.create(
            business_name="Paul's House",
            line1="19 Allenwood Rd",
            line2="This is the second line.",
            city="Great Neck",
            state="NY",
            zipcode="11023",
            phone='9173068629')

        e1 = Event.objects.create(
            slug='the-green',
            name="The Green",
            subtitle="Yo man whats up",
            short_description="This be the short description yo",
            description="The Green live at the Fat Cat Music House and Lounge\n\nDoors at 6PM Show at 7PM\nFor Booth reservations or questions please call 209-312-3463",
            presenter="Chris Ricci Presents",
            date=datetime.datetime(2015, 01, 28, 18, 00),
            start_text='Doors at 7pm.',
            location=location_1)

        EventPrice.objects.create(event=e1,
                                  price_per=12,
                                  service_fee=1.54,
                                  facilities_fee=1.02)

        e2 = Event.objects.create(
            name="The Blue",
            subtitle="Its actually green",
            short_description="",
            description="The Blue live at the Paul's House\n\nDoors at 6PM Show at 7PM\nFor Booth reservations or questions please call 209-312-3463",
            presenter="Paul Prior Presents",
            date=datetime.datetime(2014, 12, 28, 18, 00),
            start_text='Doors at 7pm.',
            location=location_2)

        EventPrice.objects.create(event=e2,
                                  price_per=12,
                                  service_fee=1.55,
                                  facilities_fee=1.01)
