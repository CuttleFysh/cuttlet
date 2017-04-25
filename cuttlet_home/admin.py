from django.contrib import admin

from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'juice_ml', 'all_juice')
    list_filter = ['all_juice']
    search_fields = ['user']

admin.site.register(Profile, ProfileAdmin)
