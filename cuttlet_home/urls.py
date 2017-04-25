from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'cuttlet_home'
urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^signup/$', views.signup, name='signup'),
    url(r'^login/$', auth_views.login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout', kwargs={'next_page': '/'}),
]
