from django.conf.urls import url

from . import views

app_name = 'supperfan'
urlpatterns = [
    url(r'^$', views.Supperfan, name='supperfan')
]
