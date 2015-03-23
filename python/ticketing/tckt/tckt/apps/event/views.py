# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from coffin.shortcuts import render
from .models import Event


def detail(request):
    e = Event.objects.all().first()
    context = {'event': e.to_json(),
               'title': e.name}
    return render(request, "event/detail.html", context)
