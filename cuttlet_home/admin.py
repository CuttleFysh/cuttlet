from django.contrib import admin

from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'twitch_channel', 'youtube_channel', 'juice_ml', 'all_juice')
    list_filter = ['all_juice']
    search_fields = ['user__username', 'twitch_channel', 'youtube_channel']

admin.site.register(Profile, ProfileAdmin)
