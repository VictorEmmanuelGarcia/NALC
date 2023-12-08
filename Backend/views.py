from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
from langchain_experimental.sql import SQLDatabaseChain
import os
from django.http import JsonResponse
from rest_framework.decorators import api_view
import json
from .models import researchpaper, Thread, Message, User
from .serializers import ThreadCreateSerializer
from rest_framework import generics, status
from .serializers import ThreadSerializer, MessageSerializer, UserCreateSerializer, UserLoginSerializer, UserSerializer, UserUpdateSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers


os.environ["OPENAI_API_KEY"] = "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"
# Create the SQLDatabase instance with the MySQL connection URI
db = SQLDatabase.from_uri(f"mysql://{settings.DATABASES['default']['USER']}:{settings.DATABASES['default']['PASSWORD']}@{settings.DATABASES['default']['HOST']}:{settings.DATABASES['default']['PORT']}/{settings.DATABASES['default']['NAME']}", include_tables=["backend_researchpaper"])

llm = OpenAI(temperature=0, verbose=True)

db_chain = SQLDatabaseChain.from_llm(llm, db, verbose=True)


# Admin views
@csrf_exempt
def upload_and_replace_data(request):
    if 'file' in request.FILES:
        uploaded_file = request.FILES['file']
        if uploaded_file.name.endswith('.json'):
            try:
                with uploaded_file.open() as file:
                    data = json.load(file)

                    # Clear existing data
                    researchpaper.objects.all().delete()

                    # Insert new data from the JSON file
                    for item in data:
                        record_type_mapping = {
                            '1 (Proposal, 2 Thesis/Research, 3 Project)': 1,
                            '2 (Thesis/Research)': 2,
                            '3 (Project)': 3,
                            # Add mappings for other record types if needed
                        }

                        classification_mapping = {
                            '1 (Basic Research, 2 Applied Research)': 1,
                            '2 (Applied Research)': 2,
                            # Add mappings for other classifications if needed
                        }

                        # Get the record_type and classification from the JSON data
                        record_type_str = item['Record Type \n(1 - Proposal, 2 - Thesis/Research, 3 - Project)']
                        classification_str = item['Classification \n(1 - Basic Research, 2 - Applied Research)\\']

                        # Map the record_type and classification to integers, defaulting to 1 if not found in mappings
                        record_type = record_type_mapping.get(record_type_str, 1)
                        classification = classification_mapping.get(classification_str, 1)

                        # Create the researchpaper object using the mapped values
                        researchpaper.objects.create(
                            title=item['Title'],
                            abstract=item['Abstract'],
                            year=item['Year'],
                            record_type=record_type,
                            classification=classification,
                            psc_ed=item['PSCED'],
                            author=item['Author'][:255]
                        )

                    return JsonResponse({'message': 'Data replaced successfully.'})
            except Exception as e:
                return JsonResponse({'error': f'An error occurred while processing the file: {str(e)}'}, status=400)
        else:
            return JsonResponse({'error': 'Invalid file type. Only JSON files are accepted.'}, status=400)
    else:
        return JsonResponse({'error': 'No file provided in the request.'}, status=400)

# Thread Views (CRUD)
class ThreadListCreateView(generics.ListCreateAPIView):
    queryset = Thread.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ThreadCreateSerializer
        return ThreadSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Thread created", "data": serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

class ThreadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response({"message": "Thread updated", "data": serializer.data})

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({"message": "Thread deleted"}, status=status.HTTP_204_NO_CONTENT)

class DeleteAllThreads(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        # Delete all threads associated with the user making the request
        Thread.objects.filter(user=request.user).delete()
        return Response({"message": "All threads deleted for the current user"}, status=status.HTTP_204_NO_CONTENT)

class UserThreadListView(generics.ListAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retrieve the authenticated user based on the token
        user = self.request.user
        
        # Filter threads associated with the authenticated user
        queryset = Thread.objects.filter(user=user)
        return queryset

class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        thread_id = request.data.get("thread_id")
        thread = get_object_or_404(Thread, pk=thread_id)

        query = request.data.get("query")

        # Fetch conversation history
        conversation_history = Message.objects.filter(thread=thread).order_by('created_at')
        history_text = "\n".join([json.loads(msg.message_text)['query'] + "\n" + json.loads(msg.message_text)['response'] for msg in conversation_history])

        # Combine history with the current query
        combined_query = history_text + "\nUser: " + query  # Make sure to label the speaker for clarity

        # Debug: print combined_query to check if history is correct
        print("Combined Query for db_chain:", combined_query)

        # Call db_chain with the combined_query to consider past conversation
        response = db_chain(combined_query)  # Assuming db_chain can handle this format

        # Debug: print response to check what db_chain returns
        print("Response from db_chain:", response)

        # Create a mutable copy of request.data
        mutable_data = request.data.copy()

        # Add the thread and message_text to the mutable_data
        mutable_data["thread"] = thread.pk

        # Structure the message_text for easy mapping in React
        message_text = {
            'query': query,
            'response': response.get("result", "No result found")
        }

        # Set the message_text field with the structured data
        mutable_data["message_text"] = json.dumps(message_text)

        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)

        # Save the new message
        self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Message created", "data": serializer.data}, status=status.HTTP_201_CREATED, headers=headers)


class MessageListView(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the thread_id from the URL parameter
        thread_id = self.kwargs.get('thread_id')
        
        # Retrieve all messages associated with the specified thread
        queryset = Message.objects.filter(thread_id=thread_id)
        return queryset

class UserRegisterView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        email = request.data.get('email', None)

        if email:
            if User.objects.filter(email=email).exists():
                # Email is already in use
                return Response({'error': 'Email is already in use.'}, status=status.HTTP_409_CONFLICT)

            serializer = self.get_serializer(data=request.data)
            try:
                serializer.is_valid(raise_exception=True)
            except serializers.ValidationError as validation_error:
                # Improper email format
                return Response({'error': 'Invalid email format.', 'details': validation_error.detail}, status=status.HTTP_400_BAD_REQUEST)

            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        # Invalid request, email is required
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        permission_classes = [AllowAny]

        user = serializer.validated_data['user']

        user = serializer.validated_data['user']
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response_data = {
            'message': 'Login successful',
            'email': user.email,
            'name': user.name,
            'access_token': access_token,
            'is_superuser': serializer.validated_data['is_superuser'],
        }
        
        return Response(response_data, status=status.HTTP_200_OK)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user  # Get the currently logged-in user

        serializer = UserUpdateSerializer(instance=user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserDetailsView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user 