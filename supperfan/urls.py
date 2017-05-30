from django.conf.urls import url

from . import views

app_name = 'supperfan'
urlpatterns = [
    url(r'^(?P<pk>\d+)/$', views.Supperfan, name='supperfan'),
    url(r'^new/$', views.SupperfanNew, name='supperfan_new')
]
