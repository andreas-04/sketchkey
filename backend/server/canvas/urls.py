from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyPuzzleViewSet

# Create a router and register the viewset
router = DefaultRouter()
router.register(r'daily-puzzles', DailyPuzzleViewSet)

urlpatterns = [
    path('', include(router.urls)),
]