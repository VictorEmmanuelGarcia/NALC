from django.urls import path
from . import views  # Import your views module

urlpatterns = [
    # Other URL patterns
    path('langchain/', views.langchain_view, name='langchain-view'),  # Add this line
]