¡Claro\! Aquí tienes el archivo completo en formato **Markdown**, listo para usar como tu `README.md`. Incluye la guía de pre-requisitos, el desarrollo y la configuración completa para el despliegue en Apache.

-----

````markdown
# Calender - Guía Completa de Instalación y Despliegue

Este proyecto utiliza una arquitectura **Django** (backend) con **Vite/React** (frontend).

---

## 1. Pre-requisitos (Instalación Inicial)

Asegúrate de que **Python 3** y **Node.js** estén instalados en tu sistema.

### Linux / macOS (Bash)

```bash
# 1. Verificar Python 3
python3 --version

# 2. Instalar Node.js y npm (Para sistemas basados en Debian/Ubuntu)
sudo apt update
sudo apt install nodejs npm
````

-----

## 2\.  Desarrollo y Compilación (Build del Proyecto)

Esta sección cubre la clonación, la instalación de dependencias y la generación de archivos estáticos.

### Guía Rápida para Linux / macOS (Bash)

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd Calender

# 2. Configurar Backend (Python/Django)
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
pip install -r requieriments.txt

# 3. Configurar Frontend (Node/React/Vite)
cd ../frontend/Calender
npm install
npm run build # Genera la compilación de React

# 4. Finalizar Backend y Ejecutar Servidor de Desarrollo
cd ../../backend
python manage.py migrate
python manage.py collectstatic --noinput

# Ejecutar servidor de desarrollo
python manage.py runserver 0.0.0.0:8000 
# Accede en el navegador: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
```

### Guía Rápida para Windows (PowerShell)

```powershell
# 1. Clonar el repositorio
git clone <repo-url>
cd Calender

# 2. Configurar Backend (Python/Django)
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requieriments.txt

# 3. Configurar Frontend (Node/React/Vite)
cd ..\frontend\Calender
npm install
npm run build

# 4. Finalizar Backend y Ejecutar Servidor de Desarrollo
cd ..\..\backend
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py runserver
```

-----

## 3\. ⚙️ Despliegue en Producción (Apache y WSGI)

Para el despliegue en Linux, se utiliza **Apache** con **mod\_wsgi**. **Ajusta la ruta `/home/ubuntu/Desktop/Calender` a la ruta real de tu proyecto.**

### A. Instalación de WSGI y Permisos

```bash
# Instalar mod_wsgi y dependencias de producción de Python
sudo apt update
sudo apt install libapache2-mod-wsgi-py3
pip install gunicorn whitenoise
sudo a2enmod wsgi

# Dar permisos al usuario de Apache (www-data) sobre la carpeta del proyecto
sudo chown -R www-data:www-data /home/ubuntu/Desktop/Calender
sudo chmod -R 755 /home/ubuntu/Desktop/Calender
```

### B. Configuración del Virtual Host (`calender.conf`)

Crea y edita el archivo de configuración del Virtual Host:

```bash
sudo nano /etc/apache2/sites-available/calender.conf
```

**Contenido de `calender.conf` (con rutas de ejemplo):**

```apache
<VirtualHost *:8080>

    # 1. Información Básica
    ServerName 3.135.51.128 
    ServerAdmin webmaster@localhost

    # 2. Configuración de Archivos Estáticos (Vite/React Build)
    Alias /static/ /home/ubuntu/Desktop/Calender/backend/staticfiles_collected/

    <Directory /home/ubuntu/Desktop/Calender/backend/staticfiles_collected/>
        Require all granted
        Options FollowSymLinks
    </Directory>

    # 3. Configuración del Entorno Virtual (WSGIDaemonProcess)
    # **IMPORTANTE:** Verifica la versión de Python en la ruta (.venv/lib/python3.12/)
    WSGIDaemonProcess calender python-path=/home/ubuntu/Desktop/Calender/backend:/home/ubuntu/Desktop/Calender/backend/.venv/lib/python3.12/site-packages

    WSGIProcessGroup calender
    WSGIScriptAlias / /home/ubuntu/Desktop/Calender/backend/backend/wsgi.py

    # 4. Directorio de WSGI y Permisos
    <Directory /home/ubuntu/Desktop/Calender/backend/backend/>
        <Files wsgi.py>
            Require all granted
        </Files>
        Options FollowSymLinks
        AllowOverride None
    </Directory>

    # 5. Permisos del Directorio Raíz del Proyecto
    <Directory /home/ubuntu/Desktop/Calender/backend>
        Require all granted
    </Directory>

    # 6. Logs
    ErrorLog ${APACHE_LOG_DIR}/calender_error.log
    CustomLog ${APACHE_LOG_DIR}/calender_access.log combined

</VirtualHost>
```

### C. Modificación de Configuración Global (`apache2.conf`)

Edita el archivo de configuración principal de Apache para asegurar los permisos de acceso al directorio de tu proyecto.

```bash
sudo nano /etc/apache2/apache2.conf
```

Añade o ajusta el siguiente bloque dentro de `apache2.conf`:

```apache
# ... contenido preexistente ...

# Permite que Apache acceda al directorio de la aplicación
<Directory /home/ubuntu/Desktop/Calender/backend>
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
</Directory>

# ... contenido preexistente ...
```

### D. Activación y Reinicio

```bash
# Habilitar el Virtual Host
sudo a2ensite calender.conf

# Reiniciar Apache para aplicar las configuraciones
sudo systemctl restart apache2
```

```
```