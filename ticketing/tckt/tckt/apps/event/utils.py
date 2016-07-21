# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
import json


def get_event_context(event):
    return {'event': event.to_json(),
            'title': event.name,
            'slug': event.slug,
            'stripe': json.dumps({'publishable_key': settings.STRIPE_PUBLISHABLE_KEY})}
