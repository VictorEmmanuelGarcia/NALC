from rest_framework import serializers
from .models import researchpaper, Thread, Message

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
        fields = '__all__'

class ThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thread
        fields = '__all__'


# Message Serializers
class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'