# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Transaction, TransactionUser


class TransactionAdmin(admin.ModelAdmin):
    list_display = ('event',
                    'quantity',
                    'amount',
                    'status',
                    'user',
                    'created_date',
                    'updated_date')

admin.site.register(Transaction, TransactionAdmin)


class TransactionUserAdmin(admin.ModelAdmin):
    list_display = ('email',
                    'first_name',
                    'last_name',
                    'shipping_address',
                    'created_date',
                    'updated_date')


admin.site.register(TransactionUser, TransactionUserAdmin)
