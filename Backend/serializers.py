from rest_framework import serializers
from .models import researchpaper, Thread, Message, User
from django.contrib.auth import authenticate

# User Serializers
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data.get('name', ''),
        )
        return user

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'password') 

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(email=email, password=password)

            if user:
                data['user'] = user
            else:
                raise serializers.ValidationError("Unable to log in with provided credentials.")
        else:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        return data

# ResearchPaper Serializer
class ResearchPaperSerializer(serializers.ModelSerializer):
    class Meta:
        model = researchpaper
        fields = '__all__'

# File Upload Serializer
class ResearchPaperImportSerializer(serializers.Serializer):
    file = serializers.FileField()


# Thread Serializers
class ThreadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = ['thread_name']

class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__'


# Message Serializers
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'