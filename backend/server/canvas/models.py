from django.db import models
import requests
from django.utils import timezone

# Create your models here.
class DailyPuzzle(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    canvas = models.FileField(upload_to='puzzles/', blank=True, null=True)
    prompt = models.CharField(max_length = 256, blank=True)
    
    try :
        response = requests.post("prompt/")
        if response.status_code == 200:
            prompt = response.json()[0]
    except Exception as e:
        print(f"Error generating prompt: {e}")
    
    date = models.DateField(default=timezone.now)  
    def __str__(self):
            return f"DailyPuzzle for {self.user} on {self.date}"
    
    class Meta:
        unique_together = ['user', 'date']

    def save(self, *args, **kwargs):
        if not self.date:
            self.date = timezone.now().date()

        if not self.pk or self.date != timezone.now().date():
            try:
                response = requests.get("https://random-word-api.herokuapp.com/word")
                if response.status_code == 200:
                    self.prompt = response.json()[0]  
            except Exception as e:
                print(f"Error generating prompt: {e}")
        super().save(*args, **kwargs)  


