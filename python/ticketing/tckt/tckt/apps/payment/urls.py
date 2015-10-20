# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import patterns, url

from . import views

urlpatterns = patterns('',
    url(r'^paypal_start$', views.paypal_start, name="start_paypal"),
    url(r'^paypal_record$', views.paypal_record, name="record_paypal"),
    url(r'^paypal_cancel$', views.paypal_cancel, name="cancel_paypal"),
    url(r'^paypal_execute$', views.paypal_execute, name="execute_paypal"),
    url(r'^stripe_execute$', views.stripe_execute, name="execute_stripe"),
    url(r'^receipt$', views.receipt, name="receipt"),
)
