# project/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from users.views import hello_world  # Import the hello_world view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
    path('api/', include('users.urls')),  # Include your app's URLs here
    path('', hello_world),  # This maps the root URL to the hello_world view


]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
