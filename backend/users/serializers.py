from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate  # Make sure to import this
from django.contrib.auth import get_user_model
from .models import Story, Section, Branch

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate(self, data):
        """
        Check that the passwords match.
        """
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords must match."})
        return data

    def create(self, validated_data):
        """
        Create a new user with the provided data.
        """
        # Remove confirm_password before creating the user
        validated_data.pop('confirm_password', None)

        # Create user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


def authenticate_user(email, password):
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
        if user.check_password(password):
            return user
    except User.DoesNotExist:
        return None
    return None

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        """
        Validate the user credentials.
        """
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate_user(email, password)
            if user is None:
                raise serializers.ValidationError("Invalid credentials.")
        else:
            raise serializers.ValidationError("Must include both 'email' and 'password'.")

        data['user'] = user
        return data

# users/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords must match."})
        return data
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['confirm_new_password']:
            raise serializers.ValidationError({"confirm_new_password": "New passwords must match."})
        return data
    

from rest_framework import serializers
from .models import Story, Section, Branch, UserInteraction

class BranchSerializer(serializers.ModelSerializer):
    is_clicked = serializers.IntegerField(required=False, default=0)

    class Meta:
        model = Branch
        fields = ['id', 'section', 'branch_option', 'branch_number', 'branch_writing','is_clicked']

class SectionSerializer(serializers.ModelSerializer):
    branches = BranchSerializer(many=True, read_only=True)

    class Meta:
        model = Section
        fields = ['id', 'section_name', 'story', 'branch_size', 'section_number', 'section_writing', 'branches']
        extra_kwargs = {
            'section': {'read_only': True}  # Ensure this field is read-only
        }

class StorySerializer(serializers.ModelSerializer):
    sections = SectionSerializer(many=True, read_only=True)

    class Meta:
        model = Story
        fields = ['id', 'story_name', 'user', 'section_size', 'genre', 'sections']
        extra_kwargs = {
            'user': {'read_only': True}  # Ensure this field is read-only
        }
class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = ['id', 'user', 'story', 'section', 'branch', 'time_spent', 'timestamp']
