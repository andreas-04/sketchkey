from django.db import models
import requests
from django.utils import timezone

# Create your models here.
class DailyPuzzle(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    canvas = models.FileField(upload_to='puzzles/',blank=True)
    prompt = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)
    elo_rating = models.FloatField(default=1000.0)
    match_count = models.IntegerField(default=0)
    last_compared = models.DateTimeField(null=True)
    
    

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


class Comparison(models.Model):
    user = models.ForeignKey('users.UserProfile', on_delete=models.CASCADE)
    shown_puzzles = models.ManyToManyField(DailyPuzzle, related_name='comparisons_shown')
    selected_puzzle = models.ForeignKey(DailyPuzzle, on_delete=models.CASCADE, related_name='comparisons_won')
    timestamp = models.DateTimeField(auto_now_add=True)
    processed = models.BooleanField(default=False)