from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DailyPuzzle
from .serializers import DailyPuzzleSerializer
from django.utils import timezone

class DailyPuzzleViewSet(viewsets.ModelViewSet):
    queryset = DailyPuzzle.objects.all()
    serializer_class = DailyPuzzleSerializer
    permission_classes = [IsAuthenticated]  # Require authentication

    
    def create(self, request, *args, **kwargs):
        today = timezone.now().date()
        user = request.user

        existing_puzzle = DailyPuzzle.objects.filter(user=user, date=today).first()

        if existing_puzzle:
            # Update existing puzzle
            serializer = self.get_serializer(existing_puzzle, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            data = request.data.copy()
            data['user'] = user.id
            data['date'] = today.isoformat()  # Convert date to ISO string <-- FIX HERE
            
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


    def perform_create(self, serializer):
        # Add the current user to the validated data
        serializer.save(user=self.request.user)