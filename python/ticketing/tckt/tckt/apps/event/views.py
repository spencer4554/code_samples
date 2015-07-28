# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from coffin.shortcuts import render
from .models import Event
from .utils import get_event_context


def detail(request, slug):
    event = Event.objects.get(slug=slug)
    return render(request, "event/detail.html", get_event_context(event))
