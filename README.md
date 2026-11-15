# Agenda académica

Aplicación web para registrar tareas académicas, marcarlas como completadas y eliminarlas. Las tareas se almacenan en el navegador mediante localStorage.

Proyecto desarrollado para el reto de la materia Despliegue de aplicaciones web y móviles de la Universidad Virtual del Estado de Guanajuato.

## Funcionalidades

- Registrar tareas académicas.
- Marcar y desmarcar tareas como completadas.
- Eliminar tareas.
- Mostrar el contador de tareas completadas.
- Conservar las tareas después de recargar la página.
- Adaptar la interfaz a pantallas de diferentes tamaños.
- Rechazar tareas vacías o compuestas únicamente por espacios.

## Tecnologías

- HTML5.
- CSS3.
- JavaScript.
- localStorage para almacenamiento en el navegador.
- Apache mediante XAMPP para el despliegue local.
- Git y GitHub para el versionamiento.
- Node.js y npm para ejecutar herramientas de optimización.
- clean-css-cli para minificar CSS.
- Terser para minificar JavaScript.
- Squoosh para optimizar imágenes.

## Estructura del proyecto

```text
agenda-academica/
├── css/
│   ├── estilos.css
│   └── estilos.min.css
├── js/
│   ├── app.js
│   └── app.min.js
├── img/
│   └── estudio.webp
├── docs/
│   ├── estudio-original.png
│   └── apache-vhost.conf
├── index.html
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

- `index.html`: estructura de la interfaz y referencias a los recursos minificados.
- `css/`: hoja de estilos original y versión minificada.
- `js/`: lógica original y versión minificada.
- `img/`: imagen optimizada utilizada por la aplicación.
- `docs/`: imagen original y copia documental de la configuración de Apache.
- `package.json`: información del proyecto y dependencias de desarrollo.
- `package-lock.json`: versiones resueltas de las dependencias.
- `.gitignore`: exclusión de dependencias, paquetes y archivos del editor.

La carpeta `dist/` se genera durante el empaquetado y está excluida del repositorio.

## Estado del proyecto

La aplicación está implementada y funciona mediante un Virtual Host de Apache en:

http://127.0.0.1:8081/

Se verificó la carga de la interfaz, el registro, completado y eliminación de tareas, así como su conservación después de recargar la página.

La imagen está optimizada y el HTML utiliza las versiones minificadas de CSS y JavaScript.

## Optimización de imágenes

La imagen original PNG se convirtió a WebP mediante Squoosh.

| Recurso | Peso aproximado |
|---------|-----------------|
| Imagen original PNG | 30.8 KB |
| Imagen optimizada WebP | 25.9 KB |

La reducción aproximada fue de 4.9 KB, equivalente al 15.9 % respecto al peso original.

Se revisó visualmente la calidad y se incorporó `img/estudio.webp` a la aplicación. La imagen original se conserva como evidencia y se excluye del paquete de despliegue.

## Minificación de CSS y JavaScript

Se utilizaron clean-css-cli y Terser como dependencias de desarrollo.

### Instalación de herramientas

Para reproducir la instalación desde el repositorio:

```powershell
npm.cmd ci
```

### Generación de archivos minificados

Desde la carpeta raíz del proyecto:

```powershell
npx.cmd cleancss -o css/estilos.min.css css/estilos.css
npx.cmd terser js/app.js --compress --mangle --output js/app.min.js
```

### Resultados

| Archivo | Original | Minificado | Reducción aproximada |
|---------|----------|------------|---------------------|
| CSS | 3121 bytes | 2049 bytes | 34.3 % |
| JavaScript | 3841 bytes | 2327 bytes | 39.4 % |
| Total | 6962 bytes | 4376 bytes | 37.1 % |

El HTML utiliza los recursos minificados:

```html
<link rel="stylesheet" href="css/estilos.min.css">
<script src="js/app.min.js" defer></script>
```

Los archivos originales se conservan para facilitar el mantenimiento. Después de modificarlos, es necesario generar nuevamente sus versiones minificadas.

Node.js y npm se utilizan para las herramientas de desarrollo; no son necesarios para ejecutar la aplicación en Apache.

## Versionamiento

Repositorio:

https://github.com/Yagv13/agenda-academica

Se utilizó Git para registrar los cambios de forma progresiva mediante commits descriptivos.

Los avances registrados incluyen:

1. Creación de la estructura inicial y documentación.
2. Implementación de las funciones de la agenda.
3. Integración de la imagen optimizada en WebP.
4. Minificación de CSS y JavaScript.

Para consultar el historial:

```powershell
git log --oneline
```

Para obtener una copia del proyecto:

```powershell
git clone https://github.com/Yagv13/agenda-academica.git
```

El archivo `.gitignore` excluye:

- `node_modules/`
- `dist/`
- Archivos `.zip` y `.tar.gz`.
- Configuración local de VS Code.

## Configuración del servidor Apache

### Entorno utilizado

- Servidor: Apache mediante XAMPP.
- Dirección de escucha: `127.0.0.1`.
- Puerto: `8081`.
- Directorio raíz: `C:/xampp/htdocs/agenda-academica`.
- Página inicial: `index.html`.
- URL: http://127.0.0.1:8081/

### Habilitación de Virtual Hosts

En el archivo:

```text
C:/xampp/apache/conf/httpd.conf
```

Se comprobó que estuviera activa la siguiente directiva:

```apache
Include conf/extra/httpd-vhosts.conf
```

### Configuración del Virtual Host

Se agregó el siguiente bloque a:

```text
C:/xampp/apache/conf/extra/httpd-vhosts.conf
```

```apache
# Agenda académica: entorno de simulación local
Listen 127.0.0.1:8081

<VirtualHost 127.0.0.1:8081>
    ServerName localhost
    DocumentRoot "C:/xampp/htdocs/agenda-academica"
    DirectoryIndex index.html

    <Directory "C:/xampp/htdocs/agenda-academica">
        Options -Indexes
        AllowOverride None
        Require local
    </Directory>

    ErrorLog "logs/agenda-academica-error.log"
    CustomLog "logs/agenda-academica-access.log" combined
</VirtualHost>
```

La directiva `Listen` establece la dirección y el puerto de escucha. El bloque `VirtualHost` asigna las solicitudes recibidas a la carpeta definida mediante `DocumentRoot`.

La configuración permite el acceso desde el equipo local y desactiva el listado automático de directorios.

Al reproducirla, debe comprobarse que el puerto 8081 esté disponible y que no exista otra directiva `Listen` superpuesta.

Se conserva una copia documental en `docs/apache-vhost.conf`. Esta copia no se carga automáticamente: Apache utiliza la configuración ubicada en su directorio `conf`.

### Validación

Se ejecutaron los siguientes comandos en PowerShell:

```powershell
& C:\xampp\apache\bin\httpd.exe -t
& C:\xampp\apache\bin\httpd.exe -S
```

La validación de sintaxis devolvió:

```text
Syntax OK
```

La consulta de Virtual Hosts mostró:

```text
127.0.0.1:8081 localhost
```

Después de detener e iniciar Apache desde XAMPP, se comprobó el acceso a la aplicación mediante la URL configurada.

## Empaquetado para despliegue

El paquete debe incluir únicamente los archivos necesarios para ejecutar la aplicación:

```text
index.html
css/
└── estilos.min.css
js/
└── app.min.js
img/
└── estudio.webp
```

### Preparación del paquete

Desde la carpeta raíz del proyecto, ejecutar en PowerShell:

```powershell
New-Item -ItemType Directory -Force -Path dist\paquete\css, dist\paquete\js, dist\paquete\img

Copy-Item index.html dist\paquete\
Copy-Item css\estilos.min.css dist\paquete\css\
Copy-Item js\app.min.js dist\paquete\js\
Copy-Item img\estudio.webp dist\paquete\img\

Compress-Archive -Path dist\paquete\* -DestinationPath dist\agenda-academica.zip -Force
```

Estos comandos se ejecutan inicialmente con una carpeta `dist/paquete` nueva. Si se reutiliza esa carpeta, debe revisarse que no contenga archivos adicionales de empaquetados anteriores.

El archivo resultante es:

```text
dist/agenda-academica.zip
```

El paquete excluye las dependencias de desarrollo, el historial de Git, las imágenes originales y la documentación.

### Verificación del paquete

Extraer el ZIP:

```powershell
Expand-Archive -Path dist\agenda-academica.zip -DestinationPath dist\verificacion -Force
Get-ChildItem dist\verificacion -Recurse
```

Con Apache iniciado y la configuración descrita, abrir:

http://127.0.0.1:8081/dist/verificacion/

Comprobar:

- Carga de la imagen.
- Aplicación de los estilos.
- Registro de tareas.
- Cambio del estado de las tareas.
- Eliminación de tareas.
- Conservación de los datos después de recargar.

### Resultado de la verificación

Se generó el archivo `dist/agenda-academica.zip`, con un tamaño
de 29 055 bytes, y se extrajo en `dist/verificacion/`.

Se comprobó su funcionamiento desde:
http://127.0.0.1:8081/dist/verificacion/

La copia extraída cargó correctamente los estilos, JavaScript
y la imagen. Se verificaron el registro, completado y eliminación
de tareas, así como su conservación después de recargar la página.

## Almacenamiento y alcance

La aplicación utiliza localStorage y no requiere una base de datos.

Las tareas se almacenan por origen: protocolo, nombre de host y puerto. Por ello, acceder mediante `localhost` o mediante `127.0.0.1:8081` puede mostrar datos diferentes.

Los datos no se sincronizan entre navegadores ni equipos. Si se elimina el almacenamiento del sitio, se pierden las tareas guardadas.

El despliegue descrito corresponde a un entorno de simulación local.