from django.shortcuts import render, HttpResponse
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated # Importamos IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Evento, Recordatorio
from .serializers import (
    UserSerializer,
    RegisterSerializer,
    RecordatorioSerializer,
    EventoSerializer,
)

def home(request):
    return HttpResponse("<h1>Servidor Django funcionando correctamente ✅</h1><p>El backend está activo.</p>")


# --- VISTA CORREGIDA ---
@api_view(['GET']) # 1. La convertimos en una vista de API que solo acepta GET
@permission_classes([IsAuthenticated]) # 2. Exigimos que el usuario esté autenticado
def reminders_list(request):
    # 3. Ahora request.user es el usuario correcto, por lo que el filtro funciona
    reminders = Recordatorio.objects.filter(Evento__Usuario=request.user)
    serializer = RecordatorioSerializer(reminders, many=True)
    # 4. Usamos la respuesta estándar de DRF
    return Response(serializer.data)


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    # Ahora authenticate() sabrá cómo usar el email gracias a nuestro EmailBackend
    user = authenticate(request, username=email, password=password)

    if user is not None:
        refresh = RefreshToken.for_user(user)
        # Añadimos los datos del usuario al token
        refresh['username'] = user.username
        refresh['email'] = user.email
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({"detail": "No se encontró una cuenta activa con las credenciales proporcionadas"}, status=401)

# --- NUEVA VISTA PARA LISTAR EVENTOS ---
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_list(request):
    """
    Devuelve una lista de todos los eventos para el usuario autenticado.
    """
    events = Evento.objects.filter(Usuario=request.user)
    serializer = EventoSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    user = request.user
    data = request.data
    
    serializer = EventoSerializer(data=data)
    if serializer.is_valid():
        serializer.save(Usuario=user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

