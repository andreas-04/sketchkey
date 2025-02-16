from rest_framework import serializers
from .models import DailyPuzzle
from django.utils import timezone

class DailyPuzzleSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    class Meta:
        model = DailyPuzzle
        fields = ['id', 'user', 'canvas', 'prompt', 'date']
        read_only_fields = ['prompt', 'date']  

    def validate(self, data):
        if 'user' not in data:
            raise serializers.ValidationError("User is required.")
        return data