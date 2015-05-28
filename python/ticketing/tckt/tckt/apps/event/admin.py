# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Location, Event


class LocationAdmin(admin.ModelAdmin):
    list_display = ('business_name',
                    'line1',
                    'line2',
                    'city',
                    'state',
                    'zipcode',
                    'phone')


admin.site.register(Location, LocationAdmin)
admin.site.register(Event, admin.ModelAdmin)
