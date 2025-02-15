from django.db import models
from django.contrib.auth.models import  AbstractUser
# Create your models here.

class UserProfile (AbstractUser):
    ranking = models.IntegerField(default=0)
