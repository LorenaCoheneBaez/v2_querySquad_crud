# Proyecto CRUD - QuerySquad v2

¡Hola! Este es el repositorio de la versión 2 del sistema **QuerySquad**.

## Integrantes

- Cardoso, Virginia
- Cohene Báez, Lorena
- Colmeiro, Gisela
- Murguía, Cristina

## ¿Qué diferencia a la versión 2?

La carpeta v1 contiene la versión inicial del proyecto, con el CRUD base para empresas, empleados y novedades. La carpeta v2 amplía esa base con nuevas funcionalidades y una estructura más completa para la gestión de la consultora.

### Cambios principales en la versión 2

- Se incorporó la gestión de liquidaciones de haberes.
- Se agregó la administración de socios.
- Se ampliaron las rutas del sistema para cubrir nuevos módulos.
- Se implementó autenticación por sesión y protección de rutas privadas.
- Se mejoró la navegación entre módulos y formularios.

## Stack Tecnológico

- Backend: Node.js con Express.
- Base de Datos: MongoDB con Mongoose ODM.
- Vistas: Pug.

## Instalación

```bash
git clone https://github.com/LorenaCoheneBaez/querySquad_crud.git
cd v2/querySquad_crud
npm install
```

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

## Ejecución del proyecto

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
