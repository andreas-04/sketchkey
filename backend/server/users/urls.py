from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserProfileViewSet, UserRegistrationView

router = DefaultRouter()
router.register(r'users', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegistrationView.as_view()),

]