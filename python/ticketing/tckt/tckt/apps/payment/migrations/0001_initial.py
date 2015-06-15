# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0004_auto_20150609_0040'),
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('processor_payment_id', models.CharField(max_length=50)),
                ('quantity', models.IntegerField()),
                ('amount', models.FloatField()),
                ('status', models.CharField(max_length=50, choices=[('started', 'started'), ('paypal_returned', 'paypal_returned'), ('canceled', 'canceled'), ('completed', 'completed'), ('refunded', 'refunded')])),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('event', models.ForeignKey(to='event.Event')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='TransactionUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(max_length=75)),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('payer_id', models.CharField(max_length=50)),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(auto_now=True)),
                ('shipping_address', models.ForeignKey(to='event.Location')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='transaction',
            name='user_id',
            field=models.ForeignKey(blank=True, to='payment.TransactionUser', null=True),
            preserve_default=True,
        ),
    ]
