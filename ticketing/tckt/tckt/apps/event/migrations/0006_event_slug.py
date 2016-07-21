# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import __builtin__


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0005_auto_20150614_1923'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='slug',
            field=models.CharField(unique=True, max_length=100),
            preserve_default=False,
        ),
    ]
