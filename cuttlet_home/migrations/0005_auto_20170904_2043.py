# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-09-05 01:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cuttlet_home', '0004_auto_20170803_2306'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='thumbnail_url',
            field=models.TextField(default='https://via.placeholder.com/36.png/07B8E1?text=+'),
        ),
    ]
