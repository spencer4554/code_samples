# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Location, Event


admin.site.register(Location, admin.ModelAdmin)
admin.site.register(Event, admin.ModelAdmin)
