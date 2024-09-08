from rest_framework import generics
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from django.contrib.auth import authenticate, update_session_auth_hash
from .serializers import RegisterSerializer, LoginSerializer, ChangePasswordSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.decorators import action

from django.http import HttpResponse

def hello_world(request):
    return HttpResponse("Hello World")

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated access for registration

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Generate a refresh token for the user
            refresh = RefreshToken.for_user(user)
            
            # Get the access token from the refresh token and convert it to a string
            access = str(refresh.access_token)
            
            # Convert the refresh token to a string
            refresh = str(refresh)
            
            # Return both tokens
            return Response({
                'refresh': refresh,  # The refresh token itself
                'access': access,    # The access token as a string
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def put(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = self.get_object()
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']

            if not user.check_password(old_password):
                return Response({"old_password": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.save()
            update_session_auth_hash(request, user)  # Update session hash to keep user logged in
            return Response({"message": "Password changed successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from rest_framework import viewsets
from .models import Story, Section, Branch, UserInteraction
from .serializers import StorySerializer, SectionSerializer, BranchSerializer, UserInteractionSerializer
from .permissions import IsStoryOwner

class StoryViewSet(viewsets.ModelViewSet):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [IsAuthenticated, IsStoryOwner]  # Combined permissions

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
"""
class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
"""    


class BranchViewSet(viewsets.ModelViewSet):
    serializer_class = BranchSerializer
    queryset = Branch.objects.all()  # Return all branches by default

    def get_queryset(self):
        """
        This view should return a list of branches filtered by section,
        or return all branches if no section filter is applied.
        """
        section_id = self.request.query_params.get('section', None)
        if section_id is not None:
            return Branch.objects.filter(section_id=section_id)
        return super().get_queryset()  # Return all branches if no section_id is provided

    def partial_update(self, request, *args, **kwargs):
        branch = self.get_object()  # This will fetch the branch using the ID in the URL
        increment_value = request.data.get('is_clicked', 0)
        if increment_value:
            branch.is_clicked += int(increment_value)
            branch.save()
        return Response({'status': 'branch click count updated'}, status=status.HTTP_200_OK)
   
    
class SectionViewSet(viewsets.ModelViewSet):
    serializer_class = SectionSerializer
    queryset = Section.objects.all()  # Default queryset so DRF can infer the basename 
    def get_queryset(self):
        """
        This view should return a list of all sections for the
        story as determined by the story id in the request query parameters.
        """
        story_id = self.request.query_params.get('story_id', None)
        if story_id is not None:
            return Section.objects.filter(story_id=story_id)
        return Section.objects.none()  # Return an empty queryset if no story_id is provided

    def perform_create(self, serializer):
        section = serializer.save()
        # Mark the branches as converted
        branch_ids = self.request.data.get('branch_ids', [])
        Branch.objects.filter(id__in=branch_ids).update(is_converted=True)




class UserInteractionViewSet(viewsets.ModelViewSet):
    queryset = UserInteraction.objects.all()
    serializer_class = UserInteractionSerializer
