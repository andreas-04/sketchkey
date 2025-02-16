from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import DailyPuzzle, Comparison
from .serializers import DailyPuzzleSerializer, ComparisonSerializer
from django.utils import timezone
from rest_framework.decorators import action
from .services import ELOService
from django.db.models import Q
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
class DailyPuzzleViewSet(viewsets.ModelViewSet):
    queryset = DailyPuzzle.objects.all()
    serializer_class = DailyPuzzleSerializer
    permission_classes = [IsAuthenticated]  # Require authentication

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
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


    @action(detail=False, methods=['get'])
    def comparison_options(self, request):
        """Get 3 puzzles for comparison"""
        user = request.user
        today = timezone.now().date()
        
        try:
            # Get user's current puzzle
            user_puzzle = DailyPuzzle.objects.get(user=user, date=today)
        except DailyPuzzle.DoesNotExist:
            return Response(
                {'error': 'Complete your daily puzzle first'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get comparison candidates
        excluded_ids = Comparison.objects.filter(
            Q(user=user) | Q(shown_puzzles=user_puzzle)
        ).values_list('shown_puzzles', flat=True).distinct()

        candidates = DailyPuzzle.objects.exclude(
            Q(user=user) | 
            Q(id__in=excluded_ids) |
            Q(id=user_puzzle.id)
        ).order_by('?')[:3]

        if len(candidates) < 3:
            return Response(
                {'error': 'Not enough comparison options available'},
                status=status.HTTP_404_NOT_FOUND
            )

        options = list(candidates)
        serializer = self.get_serializer(options, many=True)
        return Response(serializer.data)


class ComparisonViewSet(viewsets.GenericViewSet):
    queryset = Comparison.objects.all()
    serializer_class = ComparisonSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user_puzzle = DailyPuzzle.objects.get(
            user=user, 
            date=timezone.now().date()
        )
        selected_puzzle = serializer.validated_data['selected_puzzle']
        shown_puzzles = serializer.validated_data['shown_puzzles']

        # # Verify user's puzzle is included
        # if user_puzzle not in shown_puzzles:
        #     return Response(
        #         {'error': 'Comparison must include your daily puzzle'},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        # Record comparison
        comparison = Comparison.objects.create(
            user=user,
            selected_puzzle=selected_puzzle
        )
        comparison.shown_puzzles.set(shown_puzzles)

        # Update ELO ratings
        winner = selected_puzzle
        losers = [p for p in shown_puzzles if p != winner]
        ELOService.update_ratings(winner, losers)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    


class LeaderboardView(APIView):
    def get(self, request):
        leaderboard = DailyPuzzle.objects.all()\
            .order_by('-elo_rating')[:100]\
            .values('id', 'user__username', 'elo_rating')
        return Response(leaderboard)
    

@csrf_exempt
def update_daily_puzzle(request, puzzle_id):
    if request.method == "PUT":
        puzzle = get_object_or_404(DailyPuzzle, id=puzzle_id)

        if "canvas" in request.FILES:
            puzzle.canvas = request.FILES["canvas"]  # Update image file


        puzzle.save()
        return JsonResponse({"message": "DailyPuzzle updated successfully", "file_url": puzzle.canvas.url})

    return JsonResponse({"error": "Invalid request"}, status=400)