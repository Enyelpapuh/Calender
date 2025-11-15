from django.contrib.auth.backends import BaseBackend
from django.contrib.auth.models import User

class EmailBackend(BaseBackend):
    """
    Autentica a un usuario usando su dirección de correo electrónico.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Busca al usuario por su email, que llega en el campo 'username'
            user = User.objects.get(email=username)
            # Comprueba la contraseña
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            # Si el usuario no existe, no hace nada
            return None

    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None