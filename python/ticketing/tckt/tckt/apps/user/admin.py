# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from custom_user.admin import EmailUserAdmin

from .models import TcktUser

# Register your models here.

admin.site.register(TcktUser, EmailUserAdmin)
