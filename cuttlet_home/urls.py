from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'cuttlet_home'
urlpatterns = [
    url(r'^$', views.Home, name='home'),
    url(r'^logout/$', auth_views.logout, name='logout', kwargs={'next_page': '/'}),
    url(r'^twitch_login/$', views.TwitchLogin, name='twitch_login'),
    url(r'^youtube_login/$', views.YoutubeLogin, name='youtube_login'),
    url(r'^refill/$', views.Refill, name='refill'),
    url(r'^privacy/$', views.Privacy, name='privacy'),
]
