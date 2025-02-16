from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyPuzzleViewSet, ComparisonViewSet, LeaderboardView

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'daily-puzzles', DailyPuzzleViewSet)
router.register(r'comparison',ComparisonViewSet )


urlpatterns = [
    path('', include(router.urls)),
    path('leaderboard/', LeaderboardView.as_view())
]