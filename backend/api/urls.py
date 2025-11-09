from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('reminders/', views.reminders_list, name='reminders_list'),
    path('register/', views.register, name='register'),
    # Usamos la vista de login basada en función, que es más simple
    path('login/', views.login, name='login'),
    path('events/create/', views.create_event, name='create_event'),
]
