from django.contrib import admin
from django.urls import path, include, re_path # Importar re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse
import os

urlpatterns = [
    # 1. RUTA DE ADMINISTRADOR
    path('admin/', admin.site.urls),
    
    # 2. RUTA DE LA API: Agrupa todas las URLs de tu aplicación 'api' bajo el prefijo /api/
    path('api/', include('api.urls')),
    
    # 3. RUTA DEL FRONTEND (SPA): Debe ir al final. (ver serve_spa abajo)
]


def serve_spa(request):
    # Posibles ubicaciones del index.html (en orden de preferencia)
    candidates = [
        settings.BASE_DIR / 'staticfiles_collected' / 'dist' / 'index.html',
        settings.BASE_DIR / 'static' / 'dist' / 'index.html',
    ]
    try:
        if hasattr(settings, 'FRONTEND_DIR'):
            candidates.append(settings.FRONTEND_DIR / 'dist' / 'index.html')
    except Exception:
        pass

    for p in candidates:
        try:
            p_str = str(p)
            if os.path.exists(p_str):
                with open(p_str, 'rb') as f:
                    return HttpResponse(f.read(), content_type='text/html')
        except Exception:
            continue

    return HttpResponse('index.html no encontrado', status=404)

# Captura cualquier URL restante y sirve el SPA
urlpatterns += [
    re_path(r'^.*', serve_spa),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)