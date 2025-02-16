from rest_framework import serializers
from .models import DailyPuzzle, Comparison
from django.utils import timezone

class DailyPuzzleSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])
    class Meta:
        model = DailyPuzzle
        fields = ['id', 'user', 'canvas', 'prompt', 'date']
        read_only_fields = ['prompt', 'date']  
        extra_kwargs = {
            'user': {'required': False, 'allow_null': True},  # ✅ Make user optional
            'date': {'required': False, 'allow_null': True},  # ✅ Make date optional
        }

    def validate(self, data):
        if 'user' not in data:
            raise serializers.ValidationError("User is required.")
        return data

class ComparisonSerializer(serializers.ModelSerializer):
    shown_puzzles = serializers.PrimaryKeyRelatedField(
        queryset=DailyPuzzle.objects.all(),
        many=True,
        required=True
    )
    selected_puzzle = serializers.PrimaryKeyRelatedField(
        queryset=DailyPuzzle.objects.all(),
        required=True
    )

    class Meta:
        model = Comparison
        fields = ['shown_puzzles', 'selected_puzzle']
        read_only_fields = ['user', 'timestamp']

    def validate(self, data):
        """
        Validate that:
        1. The selected_puzzle is one of the shown_puzzles.
        2. The user's daily puzzle is included in shown_puzzles.
        """
        user = self.context['request'].user
        shown_puzzles = data['shown_puzzles']
        selected_puzzle = data['selected_puzzle']

        # Check if selected_puzzle is in shown_puzzles
        if selected_puzzle not in shown_puzzles:
            raise serializers.ValidationError(
                {"selected_puzzle": "Selected puzzle must be one of the shown puzzles."}
            )

        # Check if the user's daily puzzle is included
        try:
            user_puzzle = DailyPuzzle.objects.get(
                user=user,
                date=timezone.now().date()
            )
        except DailyPuzzle.DoesNotExist:
            raise serializers.ValidationError(
                {"error": "You must submit a daily puzzle before making comparisons."}
            )

        # if user_puzzle not in shown_puzzles:
        #     raise serializers.ValidationError(
        #         {"shown_puzzles": "Comparison must include your daily puzzle."}
        #     )

        return data

    def create(self, validated_data):
        """
        Create a Comparison instance.
        """
        user = self.context['request'].user
        shown_puzzles = validated_data.pop('shown_puzzles')
        selected_puzzle = validated_data.pop('selected_puzzle')

        comparison = Comparison.objects.create(
            user=user,
            selected_puzzle=selected_puzzle
        )
        comparison.shown_puzzles.set(shown_puzzles)

        return comparison