# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Location, Event, EventPrice


class LocationAdmin(admin.ModelAdmin):
    list_display = ('business_name',
                    'line1',
                    'line2',
                    'city',
                    'state',
                    'zipcode',
                    'phone')


admin.site.register(Location, LocationAdmin)


class EventPriceInline(admin.TabularInline):
    model = EventPrice


class EventAdmin(admin.ModelAdmin):
    inlines = (EventPriceInline,)
    list_display = ('name',
                    'subtitle',
                    'presenter',
                    'date')


admin.site.register(Event, EventAdmin)
