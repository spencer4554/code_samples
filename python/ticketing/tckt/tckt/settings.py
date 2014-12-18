# -*- coding: utf-8 -*-
from __future__ import unicode_literals

"""
Django settings for tckt project.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.6/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
try:
    from envelop import Environment
except ImportError:
    raise ImportError('could not import milieu, please make sure it is installed (pip install milieu)')

env = Environment()

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.6/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '8y2v7mq%foapmsuftqu#)_muync$+x7$$n7$3!66kwblvh40%w'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = DEBUG

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Our own apps
    'tckt.apps.user',
    'tckt.apps.event',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'tckt.urls'

WSGI_APPLICATION = 'tckt.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.6/ref/settings/#databases

db_auth = env.get_uri('DATABASE_DEFAULT', "mysql://root@localhost/tckt")
db_options = {
    'init_command': 'SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED',
    'compress': True
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.{0}'.format(db_auth.scheme),
        'NAME': db_auth.path.replace('/', ''),
        'HOST': db_auth.host,
        'PORT': db_auth.port,
        'USER': db_auth.user,
        'PASSWORD': db_auth.password,
        'OPTIONS': db_options,
    },
}

# Internationalization
# https://docs.djangoproject.com/en/1.6/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.6/howto/static-files/

STATIC_URL = '/static/'

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

AUTH_USER_MODEL = 'user.TcktUser'
