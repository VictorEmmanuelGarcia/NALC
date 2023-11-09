from django.urls import path
from . import views  # Import your views module
from .views import ThreadListCreateView, ThreadDetailView, MessageCreateView, MessageListView, ThreadListView

urlpatterns = [
    # Other URL patterns
    path('api/threads/', ThreadListCreateView.as_view(), name='thread-list'),
    path('api/threads/<int:pk>/', ThreadDetailView.as_view(), name='thread-detail'),
    path('api/messages/create/', MessageCreateView.as_view(), name='message-create'),
    path('api/messages/thread/<int:thread_id>/', MessageListView.as_view(), name='message-list'),
    path('api/threads/', ThreadListView.as_view(), name='thread-list'),
]