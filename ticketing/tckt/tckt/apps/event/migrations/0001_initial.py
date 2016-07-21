# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import tckt.apps.event.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=60)),
                ('subtitle', models.CharField(max_length=256)),
                ('short_description', models.CharField(max_length=512)),
                ('description', models.CharField(max_length=4096)),
                ('presenter', models.CharField(max_length=256)),
                ('date', models.DateField()),
                ('start_text', models.CharField(max_length=100)),
                ('image', models.ImageField(upload_to=tckt.apps.event.models._image_upload_to)),
                ('price_per', models.DecimalField(max_digits=6, decimal_places=2)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Location',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('business_name', models.CharField(max_length=256)),
                ('line1', models.CharField(max_length=256)),
                ('line2', models.CharField(max_length=256)),
                ('city', models.CharField(max_length=256)),
                ('state', models.CharField(max_length=2)),
                ('zipcode', models.CharField(max_length=5)),
                ('phone', models.CharField(max_length=15)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='event',
            name='location',
            field=models.ForeignKey(to='event.Location'),
            preserve_default=True,
        ),
    ]
