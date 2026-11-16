# Instalación de Agenda académica — Reto 3

## 1. Entorno y versiones

| Componente | Versión utilizada |
|------------|-------------------|
| Sistema operativo | Windows |
| Node.js | 24.20.0 |
| npm | 11.19.0 |
| MySQL Community Server | 8.4.13 |
| Express | 5.3.0 |
| mysql2 | 3.24.6 |
| Zod | 4.6.7 |

MySQL se ejecuta en el puerto 3307 para coexistir con MariaDB
de XAMPP. La aplicación utiliza MySQL, no MariaDB.

Para consultar las versiones:

```powershell
node --version
npm.cmd --version
npm.cmd list express mysql2 zod --depth=0
```

## 2. Obtener el proyecto

```powershell
git clone --branch reto-3 https://github.com/Yagv13/agenda-academica.git
cd agenda-academica
```

Si ya se dispone del repositorio local:

```powershell
git switch reto-3
```

## 3. Instalar dependencias

Desde la raíz del proyecto:

```powershell
npm.cmd ci
```

Este comando utiliza las versiones registradas en package-lock.json.

Express proporciona las rutas HTTP; mysql2 conecta la aplicación
con MySQL y Zod valida los datos recibidos por la API.

## 4. Inicializar la base de datos

Con MySQL iniciado, ejecutar:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u root -p
```

Dentro de la consola de MySQL, ejecutar el script utilizando
la ruta correspondiente a la ubicación del proyecto:

```sql
SOURCE C:/xampp/htdocs/agenda-academica/database/init.sql;
```

El script crea la base agenda_academica y la tabla tareas,
con clave primaria, fecha de creación y restricciones para
el nombre y el estado.

## 5. Crear el usuario de la aplicación

Antes de ejecutar el siguiente bloque, sustituir
REEMPLAZAR_POR_CLAVE_PROPIA por una contraseña exclusiva.
No ejecutar el ejemplo sin editarlo.

Estos comandos corresponden a una instalación nueva.
Si el usuario ya existe, no es necesario crearlo nuevamente.

```sql
CREATE USER 'agenda_app'@'127.0.0.1'
IDENTIFIED BY 'REEMPLAZAR_POR_CLAVE_PROPIA';

GRANT SELECT, INSERT, UPDATE, DELETE
ON agenda_academica.*
TO 'agenda_app'@'127.0.0.1';

EXIT;
```

La aplicación utiliza esta cuenta en lugar de root.
Los permisos se limitan a operaciones sobre los datos.

## 6. Configurar variables de entorno

Copiar el archivo de ejemplo:

```powershell
Copy-Item .env.example .env
```

Editar .env en VS Code y completar la contraseña de agenda_app:

```dotenv
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=agenda_app
DB_PASSWORD="REEMPLAZAR_POR_CLAVE_PROPIA"
DB_NAME=agenda_academica
```

El archivo .env contiene credenciales locales y está excluido
del repositorio mediante .gitignore.

Comprobar la exclusión:

```powershell
git check-ignore .env
```

La salida esperada es .env.

## 7. Iniciar la aplicación

Desde la raíz del proyecto:

```powershell
node --env-file=.env server/app.js
```

Mantener la terminal abierta mientras se utiliza la aplicación.

Dirección de acceso:

http://127.0.0.1:3000/

Express entrega la página principal y los recursos de las carpetas
css, js e img. No se publica toda la raíz del proyecto.

## 8. Verificar la conexión y las funciones

Abrir:

http://127.0.0.1:3000/api/estado

La respuesta debe indicar:

```json
{
  "estado": "ok",
  "base_datos": "conectada",
  "total_tareas": 0
}
```

El total depende de los registros existentes.

En la interfaz, comprobar:

1. Agregar tareas.
2. Marcar y desmarcar tareas como completadas.
3. Recargar y comprobar que los datos permanecen.
4. Eliminar tareas.

Para consultar los registros directamente en MySQL:

```powershell
& "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" -h 127.0.0.1 -P 3307 -u agenda_app -p -D agenda_academica -e "SELECT id, nombre, completada, creada_en FROM tareas ORDER BY id;"
```

La aplicación guarda las tareas en MySQL. Los registros anteriores
de localStorage no se migran automáticamente.

## 9. Validación y recursos minificados

Zod valida que el nombre tenga entre 1 y 120 caracteres después
de retirar espacios al inicio y al final. También valida que el
estado recibido sea booleano.

Las consultas con datos recibidos utilizan parámetros.

Después de modificar js/app.js, regenerar su versión minificada:

```powershell
npx.cmd terser js/app.js --compress --mangle --output js/app.min.js
```

Después de modificar css/estilos.css:

```powershell
npx.cmd cleancss -o css/estilos.min.css css/estilos.css
```

## 10. Configuraciones pendientes del reto

Esta versión documenta la conexión entre Express y MySQL
y las pruebas iniciales de la API y la interfaz.

Se incorporarán posteriormente:

- Dominio local y configuración de Apache como proxy.
- Certificado TLS y redirección a HTTPS.
- Encabezados HTTP de seguridad.
- Aviso de Privacidad y Términos de uso.
- Pruebas en dos navegadores.
- Resultados de rendimiento.

## Dominio local, HTTPS y encabezados de seguridad

Se agregó al archivo de Windows
`C:/Windows/System32/drivers/etc/hosts` la entrada:

    127.0.0.1 agenda.test

En Apache se habilitaron los módulos proxy, proxy_http, ssl y headers.

Se utilizó mkcert 1.4.4 para instalar una autoridad certificadora
local y generar un certificado para agenda.test:

    mkcert -install
    mkcert -cert-file C:/xampp/apache/conf/ssl-agenda/agenda.test.pem -key-file C:/xampp/apache/conf/ssl-agenda/agenda.test-key.pem agenda.test

La carpeta ssl-agenda debe crearse antes de generar el certificado.
Cada equipo debe generar sus propios certificados y claves.

Se configuraron dos Virtual Hosts:

- Puerto 80: redirección permanente a https://agenda.test/.
- Puerto 443: TLS y proxy hacia Express en http://127.0.0.1:3000/.

La copia documental está en docs/apache-agenda-https.conf.
Para reproducirla, revisar rutas, habilitar los módulos y agregar
los bloques a la configuración de Apache sin duplicarlos.
El puerto 443 debe estar configurado mediante Listen.

Se verificó la sintaxis con httpd.exe -t y el reconocimiento
de los Virtual Hosts con httpd.exe -S. Después se reinició Apache.

Se configuraron estos encabezados:

- Content-Security-Policy.
- Strict-Transport-Security, con max-age de 86400 segundos.
- X-Content-Type-Options.
- X-Frame-Options.
- Referrer-Policy.

Comprobaciones realizadas:

    curl.exe -I http://agenda.test/
    curl.exe --ssl-revoke-best-effort -I https://agenda.test/

La primera devolvió 301 con destino HTTPS. La segunda devolvió
200 y los cinco encabezados.

En Windows, curl presentó CRYPT_E_NO_REVOCATION_CHECK.
Para la comprobación local se utilizó --ssl-revoke-best-effort,
que permite continuar cuando faltan los puntos de consulta
de revocación, sin desactivar las demás validaciones TLS.

Las claves privadas no forman parte del repositorio.