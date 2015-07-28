# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^start$', views.paypal_start, name="start"),
    url(r'^record$', views.paypal_record, name="record"),
    url(r'^cancel$', views.paypal_cancel, name="cancel"),
    url(r'^execute$', views.paypal_execute, name="execute"),
    url(r'^receipt$', views.receipt, name="receipt"),
)
