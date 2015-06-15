# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from coffin.shortcuts import render
from .models import Event
from .utils import get_event_context


def detail(request):
    event = Event.objects.all().first()
    return render(request, "event/detail.html", get_event_context(event))
