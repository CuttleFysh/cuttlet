import uuid
from django.db import models
from django.utils import timezone

class SupperfanEntry(models.Model):
    user = models.ForeignKey('auth.User', editable=False)
    date_created = models.DateTimeField(default=timezone.now)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    def __str__(self):
        return str(self.id)
