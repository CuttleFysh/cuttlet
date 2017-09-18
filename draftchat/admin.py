from django.contrib import admin
from django.urls import reverse

from .models import DraftchatEntry

class DraftchatAdmin(admin.ModelAdmin):
    readonly_fields = ('profile_link',)
    list_display = ('id', 'date_created', 'user', 'profile_link')
    list_filter = ['date_created']
    search_fields = ['user__username', 'user__profile__name']
    ordering = ['-date_created']

    def profile_link(self, obj):
            return '<a href="%s">%s</a>' % (
                reverse('admin:cuttlet_home_profile_change', args=(obj.user.profile.id,)), obj.user.profile.name
                )
    profile_link.allow_tags = True
    profile_link.short_description = 'Profile'

admin.site.register(DraftchatEntry, DraftchatAdmin)
