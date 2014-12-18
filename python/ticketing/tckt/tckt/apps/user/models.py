# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import random

from django.db import models
from custom_user.models import AbstractEmailUser


def _get_uid():
    chars = "abcdef0123456789"
    return ''.join(random.choice(chars) for _ in range(8))


class TcktUser(AbstractEmailUser):
    """
    This model is just an extension of the EmailUser
    supplied by https://github.com/jcugat/django-custom-user.

    Right now it is exactly the same, but starting it as version
    we controll should make things easier in the future and has
    very little maintenance cost.
    """
    uid = models.CharField(max_length=8, default=_get_uid, unique=True)
