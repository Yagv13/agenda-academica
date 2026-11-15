# Agenda académica

Aplicación web para registrar tareas académicas, marcarlas como
completadas y eliminarlas.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- localStorage para almacenamiento en el navegador
- Apache mediante XAMPP para el despliegue local

## Estructura

- index.html: interfaz principal.
- css/: hojas de estilo.
- js/: lógica de la aplicación.
- img/: imágenes de la aplicación.
- docs/: documentación de configuración del servidor.

## Estado

Estructura inicial del proyecto. Pendiente implementar las funciones,
optimizar los recursos y configurar el Virtual Host.

## Optimización de imágenes

La imagen original PNG se convirtió a WebP mediante Squoosh.

| Recurso | Peso |
|---------|------|
| Imagen original PNG | 30.8 KB |
| Imagen optimizada WebP | 25.9 KB |

La reducción aproximada fue de 4.9 KB (15.9 %).
Se verificó visualmente la calidad y se utilizó la versión WebP
en la aplicación.

## Minificación de CSS y JavaScript

Se utilizaron clean-css-cli y Terser, instalados como dependencias
de desarrollo.

Comandos utilizados:

    npx.cmd cleancss -o css/estilos.min.css css/estilos.css
    npx.cmd terser js/app.js --compress --mangle --output js/app.min.js

| Archivo     | Original   | Minificado | Reducción |
|-------------|------------|------------|-----------|
| CSS         | 3121 bytes | 2049 bytes | 34.3 %    |
| JavaScript  | 3841 bytes | 2327 bytes | 39.4 %    |

El HTML utiliza los archivos minificados. Se conservan los originales
para facilitar su mantenimiento.