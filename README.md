# Calender

Guía rápida para levantar el proyecto (backend Django + frontend Vite/React).

Resumen de pasos
1. Crear entorno virtual Python e instalar dependencias backend
2. Instalar dependencias frontend y generar build
3. Ejecutar `manage.py migrate` y `collectstatic`
4. Levantar servidor de desarrollo Django o producción

Instrucciones detalladas

-- Windows (PowerShell) --

# Clonar repo (si aún no lo hiciste)
git clone <repo-url>
cd Calender

# 1) Crear y activar virtualenv (en la carpeta `backend` usamos `.venv`)
cd backend
python -m venv .venv
; .\.venv\Scripts\Activate.ps1


# Actualizar pip e instalar dependencias Python
python -m pip install --upgrade pip
pip install -r requieriments.txt

# 2) Instalar dependencias frontend y generar build (en otra shell)
cd ..\frontend\Calender
npm install
npm run build

# 3) Volver al backend, migrar y recolectar estáticos
cd ..\..\backend
python manage.py migrate
python manage.py collectstatic --noinput

# 4) Ejecutar servidor de desarrollo
python manage.py runserver

# Acceder en el navegador
Abre http://127.0.0.1:8000/

Notas específicas para PowerShell
- Si PowerShell bloquea la activación del virtualenv por política de ejecución, ejecuta (como administrador):
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

-- Linux / macOS (Bash) --

# Clonar repo y moverse al proyecto
git clone <repo-url>
cd Calender

# 1) Crear y activar virtualenv
cd backend
python3 -m venv .venv
source .venv/bin/activate

# Actualizar pip e instalar dependencias
python -m pip install --upgrade pip
pip install -r requieriments.txt

# 2) Instalar dependencias frontend y generar build (en otra terminal/tab)
cd ../frontend/Calender
npm install
npm run build

# 3) Volver al backend, migrar y recolectar estáticos
cd ../../backend
python manage.py migrate
python manage.py collectstatic --noinput

# 4) Ejecutar servidor de desarrollo
python manage.py runserver 0.0.0.0:8000

Producción (recomendado)
- Usar un servidor WSGI (Gunicorn/uWSGI) + Nginx para servir estáticos, o configurar WhiteNoise.

Ejemplo mínimo con Gunicorn + WhiteNoise
1. Instalar dependencias de producción:
	pip install gunicorn whitenoise
2. En `backend/backend/settings.py` añadir en `MIDDLEWARE` (después de SecurityMiddleware):
	'whitenoise.middleware.WhiteNoiseMiddleware',
	y establecer `STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'`
3. Ejecutar collectstatic:
	python manage.py collectstatic --noinput
4. Ejecutar gunicorn (desde la carpeta `backend`):
	gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 3

Consejos y resolución de problemas
- Asegúrate de que `STATIC_URL` en `backend/backend/settings.py` empieza con `/static/`.
- Si los archivos del frontend tienen hashes y la plantilla apunta a nombres antiguos, usa el `index.html` del build en `static/dist/index.html` o configura las plantillas para resolver dinámicamente los archivos (ya hay utilidades en el proyecto para esto).
- Si ves 404 para `/static/...`, revisa que `python manage.py collectstatic` copie los archivos en `STATIC_ROOT` (por defecto `backend/staticfiles_collected/`).
- Para desarrollo con HMR, puedes ejecutar el dev server de Vite en `frontend/Calender` con `npm run dev` y configurar Django para hacer proxy o apuntar las peticiones a `http://localhost:5173`.

Comandos útiles (resumen)
PowerShell (Windows):

```powershell
cd backend
python -m venv .venv
 .\.venv\Scripts\Activate.ps1
pip install -r requieriments.txt
cd ..\frontend\Calender
npm install
npm run build
cd ..\..\backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver
```

Linux/macOS (Bash):
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requieriments.txt
cd ../frontend/Calender
npm install
npm run build
cd ../../backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver 0.0.0.0:8000
```

Contacto
Si algo falla, copia los errores de la terminal y las rutas exactas (por ejemplo el 404 en DevTools) y ábrelos en una nueva issue o contáctame.
