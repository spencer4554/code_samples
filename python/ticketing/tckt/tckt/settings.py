# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from os.path import dirname, abspath, join

try:
    from envelop import Environment
except ImportError:
    raise ImportError('could not import milieu, please make sure it is installed (pip install milieu)')

env = Environment()

SECRET_KEY = '8y2v7mq%foapmsuftqu#)_muync$+x7$$n7$3!66kwblvh40%w'

DEBUG = True
PRODUCTION = False

LOCAL_FILE = lambda *parts: join(abspath(dirname(__file__)), *parts)

TEMPLATE_DEBUG = DEBUG

SITE_DOMAIN = env.get('SITE_DOMAIN', '127.0.0.1:8000')

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

INTERNAL_IPS = ('127.0.0.1',)
ALLOWED_HOSTS = ['*']

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

STATICFILES_DIRS = (
    LOCAL_FILE("../assets/"),
)

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.sessions',
    'django.contrib.staticfiles',

    'django_assets',

    # Our own apps
    'tckt.apps.user',
    'tckt.apps.event',
    'tckt.apps.payment',
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

TEMPLATE_DIRS = (
    LOCAL_FILE('templates'),
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
)

AUTH_USER_MODEL = 'user.TcktUser'
MEDIA_ROOT = LOCAL_FILE("../media/")
MEDIA_URL = '/media/'

# paulprior@Yahoo.com keys
if PRODUCTION:
    STRIPE_SECRET_KEY = 'sk_live_ixqePIx63LfV0F9V8t5DCq9I'
    STRIPE_PUBLISHABLE_KEY = 'pk_live_1LAUjeAbVG9SvgVKJMJGAmY0'
else:
    STRIPE_SECRET_KEY = 'sk_test_IMO4oUalAc2BaLy3im5fnl6X'
    STRIPE_PUBLISHABLE_KEY = 'pk_test_HG2A1tfa1fy90WFx8j28C9IB'
