from django.contrib import admin

from .models import HohEntry

class HohEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_created', 'id')
    list_filter = ['date_created']
    search_fields = ['user__username']

admin.site.register(HohEntry, HohEntryAdmin)
