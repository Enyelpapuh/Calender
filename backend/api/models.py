from django.db import models
from django.contrib.auth.models import User

# --- Opciones para campos con valores fijos (ENUM) ---

TIPO_AVISO_CHOICES = (
    ('EMAIL', 'Correo Electrónico'),
    ('NOTIFICACION_APP', 'Notificación en la Aplicación'),
)

UNIDAD_TIEMPO_CHOICES = (
    ('MINUTOS', 'Minutos'),
    ('HORAS', 'Horas'),
    ('DIAS', 'Días'),
)

ESTADO_CHOICES = (
    ('ACTIVO', 'Activo'),
    ('CANCELADO', 'Cancelado'),
    ('FINALIZADO', 'Finalizado'),
)

ESTADO_RECORDATORIO_CHOICES = (
    ('PENDIENTE', 'Pendiente de Envío'),
    ('ENVIADO', 'Enviado Exitosamente'),
    ('FALLIDO', 'Fallo en el Envío'),
)

# -----------------------------------------------------------

# class Usuario(models.Model):
#     """
#     Representa a los usuarios del sistema.
#     Nota: En un proyecto real de Django, se recomienda extender AbstractUser o usar CustomUser.
#     """
#     # UsuarioID (PK)
#     # Django automáticamente crea el campo 'id' como PK
    
#     Nombre = models.CharField(max_length=100)
#     Correo = models.EmailField(max_length=255, unique=True)
    
#     # Contraseña: Se almacenaría un hash. En Django, esto se maneja por defecto.
#     # En este modelo simple, lo dejamos como CharField, pero el ORM se encargaría del hashing.
#     Contraseña = models.CharField(max_length=255) 
    
#     ZonaHoraria = models.CharField(max_length=50, default='America/Managua')
#     FechaRegistro = models.DateTimeField(auto_now_add=True)

#     class Meta:
#         verbose_name = "Usuario"
#         verbose_name_plural = "Usuarios"

#     def __str__(self):
#         return self.Correo

# -----------------------------------------------------------

class Evento(models.Model):
    """
    Representa un evento o cita único (no repetitivo) creado por un usuario.
    """
    # EventoID (PK) - Automático
    
    # UsuarioID (FK)
    Usuario = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='eventos' # Para acceder a los eventos desde un usuario: usuario.eventos.all()
    )
    
    Titulo = models.CharField(max_length=255)
    Descripcion = models.TextField(null=True, blank=True)
    FechaInicio = models.DateTimeField()
    FechaFin = models.DateTimeField(null=True, blank=True)
    Color = models.CharField(max_length=10, null=True, blank=True) # Ej: #FF5733
    Estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='ACTIVO')
    Ubicacion = models.CharField(max_length=255, null=True, blank=True)
    
    # CreadoEn / ActualizadoEn
    CreadoEn = models.DateTimeField(auto_now_add=True)
    ActualizadoEn = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Evento"
        verbose_name_plural = "Eventos"
        ordering = ['FechaInicio']

    def __str__(self):
        return f"{self.Titulo} ({self.FechaInicio.strftime('%Y-%m-%d')})"

# -----------------------------------------------------------

class Recordatorio(models.Model):
    """
    Define un aviso programado para un evento específico. 
    Representa la instancia de aviso.
    """
    # RecordatorioID (PK) - Automático
    
    # EventoID (FK)
    Evento = models.ForeignKey(
        Evento, 
        on_delete=models.CASCADE, 
        related_name='recordatorios'
    )
    
    TipoAviso = models.CharField(max_length=50, choices=TIPO_AVISO_CHOICES)
    TiempoAntes = models.IntegerField(help_text="Cantidad de tiempo (ej: 15)")
    UnidadTiempo = models.CharField(max_length=10, choices=UNIDAD_TIEMPO_CHOICES)
    
    # Estado: Indica si ya fue procesado el envío
    Estado = models.CharField(max_length=20, choices=ESTADO_RECORDATORIO_CHOICES, default='PENDIENTE')
    
    # FechaEnviado: La fecha y hora exacta en que el sistema DEBE enviar el aviso (programación)
    FechaEnviado = models.DateTimeField()

    class Meta:
        verbose_name = "Recordatorio"
        verbose_name_plural = "Recordatorios"
        # Asegura que no se creen múltiples recordatorios iguales (ej: email 15 min antes) para el mismo evento
        unique_together = ('Evento', 'TipoAviso', 'TiempoAntes', 'UnidadTiempo')
        ordering = ['FechaEnviado']

    def __str__(self):
        return f"Aviso de {self.Evento.Titulo} - Programado para: {self.FechaEnviado}"