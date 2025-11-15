from django.contrib import admin
from django.urls import path, include, re_path # Importar re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # 1. RUTA DE ADMINISTRADOR
    path('admin/', admin.site.urls),
    
    # 2. RUTA DE LA API: Agrupa todas las URLs de tu aplicación 'api' bajo el prefijo /api/
    path('api/', include('api.urls')),
    
    # 3. RUTA DEL FRONTEND (SPA): Debe ir al final.
    # Captura CUALQUIER URL restante (incluida la raíz '/') y sirve el spa_base.html
    re_path(r'^.*', TemplateView.as_view(template_name='spa_base.html')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)