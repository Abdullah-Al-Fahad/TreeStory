from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, ChangePasswordView, StoryViewSet, SectionViewSet, BranchViewSet, UserInteractionViewSet

# Auth-related URLs
auth_patterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Add this line

]

# Story-related viewsets
router = DefaultRouter()
router.register(r'stories', StoryViewSet)
router.register(r'sections', SectionViewSet)
router.register(r'branches', BranchViewSet)
router.register(r'user_interactions', UserInteractionViewSet)

# Combine auth routes and viewsets into a single urlpatterns
urlpatterns = [
  
    path('', include(router.urls)),  # Story-related routes
    path('auth/', include(auth_patterns)),  # Auth-related routes
]
