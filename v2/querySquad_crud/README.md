# Proyecto CRUD - QuerySquad v2

¡Hola! Este es el repositorio de la versión 2 del sistema **QuerySquad**.

## Integrantes

- Cardoso, Virginia
- Cohene Báez, Lorena
- Colmeiro, Gisela
- Murguía, Cristina

## ¿Qué diferencia a la versión 2?

La carpeta`v1`contiene la versión inicial del proyecto, con el CRUD base para empresas, empleados y novedades. La carpeta `v2` amplía esa base con nuevas funcionalidades y una estructura más completa para la gestión de la consultora.

### Cambios principales en la versión 2

- **Migración a la Nube:** Transición completa de archivos JSON a **MongoDB Atlas** utilizando Mongoose ODM para asegurar la persistencia e integridad de los datos.
- **Nuevos Módulos Core:** Se incorporó la gestión de **Liquidaciones de Haberes** (con cálculos automáticos de convenios) y la administración de **Socios**.
- **Seguridad de Acceso:** Implementación de autenticación por sesión (`express-session`) y protección mediante middlewares en todas las rutas privadas.
- **Módulo de Auditoría:** Sistema de trazabilidad automática que registra acciones críticas (Altas, Bajas lógicas, Modificaciones) de los usuarios.
- **Calidad de Código (Testing):** Cobertura del 100% en pruebas unitarias utilizando **Jest** para los validadores de entrada.
- **Interfaz UI/UX:** Transición a un motor de plantillas dinámico (**Pug**) con diseño *responsive* en Bootstrap 5 e interacciones mediante modales.

## Stack Tecnológico

- **Backend:** Node.js, Express.js
- **Base de Datos:** MongoDB (Atlas), Mongoose ODM
- **Vistas:** Pug, HTML5, Bootstrap 5, Bootstrap Icons
- **Testing:** Jest

## Instalación

```bash
git clone https://github.com/LorenaCoheneBaez/querySquad_crud.git
cd v2/querySquad_crud
npm install
```

## Configuración de entorno

Puedes crear un archivo .env en la raíz del proyecto con las siguientes variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/query_squad_db
SESSION_SECRET=querysquad
```

La aplicación las leerá automáticamente al iniciarse.

## Configuración de MongoDB

Asegúrate de tener MongoDB en ejecución localmente.

Conexión utilizada:

```text
mongodb://127.0.0.1:27017/query_squad_db
```

Cargar datos iniciales:

```bash
node migracionMongo.js
```

## Ejecución del proyecto en modo desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en:

```text
http://localhost:3000
```

## Uso correcto del sistema

1. Ingresar a la URL de inicio.
2. Iniciar sesión con:
   ```text
   Usuario: admin
   Contraseña: 1234
   ```
3. Una vez autenticado, podrá acceder a las secciones de empresas, empleados, novedades, auditoría, liquidaciones y socios.
4. Todas las rutas del sistema están protegidas; si no se encuentra logueado, se redirigirá al login.

## Rutas principales de la versión 2

| Página            | Ruta                                      |
| ----------------- | ----------------------------------------- |
| Login             | http://localhost:3000                     |
| Cerrar sesión     | http://localhost:3000/logout              |
| Empresas          | http://localhost:3000/empresas            |
| Nueva Empresa     | http://localhost:3000/empresas/nueva      |
| Empleados         | http://localhost:3000/empleados           |
| Nuevo Empleado    | http://localhost:3000/empleados/nuevo     |
| Novedades         | http://localhost:3000/novedades           |
| Auditoría         | http://localhost:3000/auditoria           |
| Liquidaciones     | http://localhost:3000/liquidaciones       |
| Nueva Liquidación | http://localhost:3000/liquidaciones/nueva |
| Socios            | http://localhost:3000/socios              |
| Nuevo Socio       | http://localhost:3000/socios/nuevo        |


## Ejecución de Pruebas Unitarias (Testing)

El sistema cuenta con casos de test automatizados que garantizan que no ingresen datos corruptos o incompletos a la base de datos. 

Para correr la evaluación, ejecutar:

```bash
npm run test
```

Antes de ejecutarlos debemos asegurarnos tenemos instalado el Framework Jest. 

Si necesitamos instalarlo:

```bash
npm install --save-dev jest
```