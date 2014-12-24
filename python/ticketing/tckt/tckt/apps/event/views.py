# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from coffin.shortcuts import render


def detail(request):
    context = {}
    return render(request, "event/detail.html", context)
