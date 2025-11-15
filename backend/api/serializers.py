from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Recordatorio, Evento

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class RecordatorioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recordatorio
        fields = '__all__'

class EventoSerializer(serializers.ModelSerializer):
    """
    Serializador para el modelo Evento.
    """
    # Este campo es de solo lectura para el CLIENTE (no vendrá en el JSON),
    # pero sí lo mostraremos en la respuesta.
    Usuario = UserSerializer(read_only=True)

    class Meta:
        model = Evento
        # Definimos todos los campos que el serializador manejará.
        fields = [
            'id', 'Usuario', 'Titulo', 'Descripcion', 'FechaInicio', 'FechaFin', 
            'Color', 'Estado', 'Ubicacion', 'CreadoEn', 'ActualizadoEn'
        ]
        # IMPORTANTE: Quitamos 'Usuario' de aquí.
        # Esto permite que el método .save(Usuario=...) de la vista funcione.
        read_only_fields = ['id', 'CreadoEn', 'ActualizadoEn']
