from django.contrib import admin

from .models import SupperfanEntry

class SupperfanEntryAdmin(admin.ModelAdmin):
    list_display = ('user', 'date_created', 'id')
    list_filter = ['date_created']
    search_fields = ['user__username']

admin.site.register(SupperfanEntry, SupperfanEntryAdmin)
