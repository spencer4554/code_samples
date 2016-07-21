# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import tckt.apps.payment.models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0004_auto_20150614_1923'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='uid',
            field=models.CharField(default=tckt.apps.payment.models._get_uid, unique=True, max_length=8),
            preserve_default=True,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='status',
            field=models.CharField(max_length=50, choices=[('started', 'started'), ('paypal_returned', 'paypal_returned'), ('paypal_expired', 'paypal_expired'), ('paypal_error', 'paypal_error'), ('canceled', 'canceled'), ('completed', 'completed'), ('refunded', 'refunded')]),
        ),
    ]
