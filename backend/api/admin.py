from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import Evento, Recordatorio

# Des-registrar el modelo de usuario base si ya está registrado
if admin.site.is_registered(User):
    admin.site.unregister(User)

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Administración personalizada para el modelo User.
    """
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'date_joined')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('-date_joined',)

@admin.register(Evento)
class EventoAdmin(admin.ModelAdmin):
    """
    Administración para el modelo Evento.
    """
    list_display = ('Titulo', 'Usuario', 'FechaInicio', 'FechaFin', 'Estado', 'CreadoEn')
    list_filter = ('Estado', 'FechaInicio', 'Usuario')
    search_fields = ('Titulo', 'Descripcion', 'Usuario__username')
    date_hierarchy = 'FechaInicio'
    ordering = ('-FechaInicio',)

@admin.register(Recordatorio)
class RecordatorioAdmin(admin.ModelAdmin):
    """
    Administración para el modelo Recordatorio.
    """
    list_display = ('get_evento_titulo', 'TipoAviso', 'FechaEnviado', 'Estado')
    list_filter = ('Estado', 'TipoAviso', 'FechaEnviado')
    search_fields = ('Evento__Titulo',)
    ordering = ('-FechaEnviado',)

    def get_evento_titulo(self, obj):
        return obj.Evento.Titulo
    get_evento_titulo.short_description = 'Evento'
    get_evento_titulo.admin_order_field = 'Evento__Titulo'
