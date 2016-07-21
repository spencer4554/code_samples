# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0003_auto_20150528_2151'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='created_date',
            field=models.DateTimeField(default=datetime.date(2015, 6, 9), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='event',
            name='updated_date',
            field=models.DateTimeField(default=datetime.date(2015, 6, 9), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='eventprice',
            name='created_date',
            field=models.DateTimeField(default=datetime.date(2015, 6, 9), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='eventprice',
            name='updated_date',
            field=models.DateTimeField(default=datetime.date(2015, 6, 9), auto_now=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='location',
            name='created_date',
            field=models.DateTimeField(default=datetime.date(2015, 6, 9), auto_now_add=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='location',
            name='updated_date',
            field=models.DateTimeField(default=datetime.date(2015, 6, 9), auto_now=True),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='eventprice',
            name='facilities_fee',
            field=models.DecimalField(default=0, max_digits=6, decimal_places=2),
        ),
        migrations.AlterField(
            model_name='eventprice',
            name='service_fee',
            field=models.DecimalField(default=0, max_digits=6, decimal_places=2),
        ),
    ]
