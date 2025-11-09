from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('reminders/', views.reminders_list, name='reminders_list'),
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('events/', views.event_list, name='event_list'),  # Nueva ruta para listar eventos
    path('events/create/', views.create_event, name='create_event'),
]
