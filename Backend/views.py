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
from .models import researchpaper, Thread, Message
from .serializers import ThreadCreateSerializer
from rest_framework import generics, status
from .serializers import ThreadSerializer, MessageSerializer
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

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

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ThreadCreateSerializer
        return ThreadSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "Thread created", "data": serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

class ThreadDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

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

class ThreadListView(generics.ListAPIView):
    serializer_class = ThreadSerializer

    def get_queryset(self):
        # Retrieve all threads
        queryset = Thread.objects.all()
        return queryset

# Message View (Create and Read)
class MessageCreateView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def create(self, request, *args, **kwargs):
        thread_id = request.data.get("thread_id")
        thread = get_object_or_404(Thread, pk=thread_id)

        query = request.data.get("query")

        # Create a mutable copy of request.data
        mutable_data = request.data.copy()

        # Add the thread and message_text to the mutable_data
        mutable_data["thread"] = thread.pk

        # Call db_chain to get the response
        response = db_chain(query)

        # Structure the message_text for easy mapping in React
        message_text = {
            'query': query,
            'result': response.get("result", "No result found")
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

    def get_queryset(self):
        # Get the thread_id from the URL parameter
        thread_id = self.kwargs.get('thread_id')
        
        # Retrieve all messages associated with the specified thread
        queryset = Message.objects.filter(thread_id=thread_id)
        return queryset