from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'cuttlet_home'
urlpatterns = [
    url(r'^$', views.Home, name='home'),
    url(r'^signup/$', views.SignUp, name='signup'),
    url(r'^login/$', views.Login, name='login'),
    url(r'^logout/$', auth_views.logout, name='logout', kwargs={'next_page': '/'}),
    url(r'^twitch_oauth2_callback/$', views.TwitchOAuth2Callback, name='twitch_oauth2_callback'),
    url(r'^youtube_oauth2_callback/$', views.YoutubeOAuth2Callback, name='youtube_oauth2_callback'),
]
