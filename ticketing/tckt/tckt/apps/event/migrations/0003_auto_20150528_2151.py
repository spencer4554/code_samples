# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0002_auto_20150528_2143'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventPrice',
            fields=[
                ('event', models.OneToOneField(related_name='price', primary_key=True, serialize=False, to='event.Event')),
                ('price_per', models.DecimalField(max_digits=6, decimal_places=2)),
                ('service_fee', models.DecimalField(max_digits=6, decimal_places=2)),
                ('facilities_fee', models.DecimalField(max_digits=6, decimal_places=2)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.RemoveField(
            model_name='event',
            name='price_per',
        ),
    ]
