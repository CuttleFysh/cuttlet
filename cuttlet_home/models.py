from django.db import models
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.TextField(default='')
    account_type = models.TextField(default='')
    thumbnail_url = models.TextField(default='http://via.placeholder.com/36.png/8ADCE5?text=+');
    juice_ml = models.IntegerField(default=11)
    all_juice = models.IntegerField(default=11)

    def __str__(self):
        return self.user.username

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, juice_ml=100, all_juice=100)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
