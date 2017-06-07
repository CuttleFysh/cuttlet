from django.conf.urls import url

from . import views

app_name = 'supperfan'
urlpatterns = [
    # Regex generated to fit uuid4
    # UUID example: 91996bcb-6554-4de4-a870-a1c43a9ccf64
    url(r'^(?P<id>[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})/$', views.Supperfan, name='supperfan'),
    url(r'^new/$', views.SupperfanNew, name='supperfan_new')
]
