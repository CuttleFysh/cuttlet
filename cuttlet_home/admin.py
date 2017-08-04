from django.contrib import admin
from django.urls import reverse

from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    readonly_fields = ('user_link',)
    list_display = ('name', 'user', 'thumbnail_url', 'account_type', 'juice_ml', 'all_juice', 'user_link')
    list_filter = ['all_juice']
    search_fields = ['user__username', 'user__name']

    def user_link(self, obj):
            return '<a href="%s">%s</a>' % (
                reverse('admin:auth_user_change', args=(obj.user.id,)), obj.user
                )
    user_link.allow_tags = True
    user_link.short_description = 'user'

admin.site.register(Profile, ProfileAdmin)
