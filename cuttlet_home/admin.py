from django.contrib import admin

from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'thumbnail_url', 'account_type', 'juice_ml', 'all_juice')
    list_filter = ['all_juice']
    search_fields = ['user__username', 'user__name']

admin.site.register(Profile, ProfileAdmin)
