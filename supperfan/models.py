from django.db import models
from django.utils import timezone

class SupperfanEntry(models.Model):
    user = models.ForeignKey('auth.User')
    created_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.user
