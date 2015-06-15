# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0003_transaction_token'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='status',
            field=models.CharField(max_length=50, choices=[('started', 'started'), ('paypal_returned', 'paypal_returned'), ('paypal_expired', 'paypal_expired'), ('canceled', 'canceled'), ('completed', 'completed'), ('refunded', 'refunded')]),
        ),
    ]
