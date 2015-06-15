# -*- coding: utf-8 -*-
from __future__ import unicode_literals


def get_event_context(event):
    return {'event': event.to_json(),
            'title': event.name}
