# Proyecto CRUD - QuerySquad (Talento Evolutivo S.A.)

## Integrantes

- Cardoso, Virginia
- Cohene Báez, Lorena
- Colmeiro, Gisela
- Murguía, Cristina

---

# Descripción del Proyecto

**QuerySquad** es un Sistema de Gestión Integral desarrollado para optimizar la administración y operación de una consultora empresarial.

La aplicación centraliza la gestión de empresas clientes, empleados, socios, novedades laborales, auditorías y liquidaciones de haberes, permitiendo administrar toda la información desde una única plataforma.

Además, incorpora mecanismos de autenticación y control de acceso para garantizar la seguridad de los datos y restringir el acceso a usuarios autorizados.

---

## Objetivos del Sistema

- Centralizar la información de la consultora.
- Automatizar tareas administrativas recurrentes.
- Mejorar la trazabilidad de operaciones mediante auditorías.
- Gestionar empresas, empleados y socios de manera eficiente.
- Facilitar el seguimiento de novedades y liquidaciones.
- Garantizar la seguridad mediante autenticación y autorización de usuarios.

---

## Funcionalidades Principales

### Gestión de Empresas
- Alta de empresas.
- Modificación de datos.
- Activación y desactivación de empresas.
- Consulta de empresas activas e inactivas.

### Gestión de Empleados
- Alta de empleados.
- Edición de información.
- Consulta de empleados registrados.

### Gestión de Novedades
- Registro de novedades laborales.
- Edición de novedades.
- Eliminación de novedades.
- Consulta general de novedades.

### Gestión de Liquidaciones
- Administración de liquidaciones de haberes.
- Seguimiento de procesos de liquidación.

### Gestión de Socios
- Administración de socios.
- Gestión de permisos y accesos.

### Auditoría
- Registro y seguimiento de acciones realizadas dentro del sistema.

### Seguridad
- Inicio y cierre de sesión.
- Protección de rutas privadas.
- Restricción de acceso a usuarios no autenticados.

---

# Stack Tecnológico

## Backend
- Node.js
- Express.js

## Base de Datos
- MongoDB
- Mongoose ODM

## Frontend
- Pug (Motor de plantillas)
- Bootstrap

---

# Dependencias

## Producción

- **Express (^5.2.1):** Framework para el desarrollo del servidor web y la gestión de rutas.
- **Express Session (^1.19.0):** Administración de sesiones de usuario para autenticación y autorización.
- **Method Override (^3.0.0):** Permite utilizar métodos HTTP PUT y DELETE desde formularios HTML.
- **Mongoose (^8.24.0):** Biblioteca para modelado de datos y conexión con MongoDB.
- **Pug (^3.0.4):** Motor de plantillas utilizado para la generación dinámica de vistas.

## Desarrollo

- **Nodemon (^3.1.14):** Reinicia automáticamente el servidor al detectar cambios en el código.

---

# Requisitos Previos

Antes de ejecutar el proyecto es necesario tener instalado:

- Node.js
- npm
- MongoDB Community Server
- Git

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone https://github.com/LorenaCoheneBaez/querySquad_crud.git
```

## 2. Ingresar al directorio del proyecto

```bash
cd querySquad_crud
```

## 3. Instalar dependencias

```bash
npm install
```

---

# Configuración de MongoDB

Este proyecto utiliza MongoDB como base de datos.

Asegúrese de que el servicio de MongoDB se encuentre ejecutándose localmente.

### Cadena de conexión

```text
mongodb://127.0.0.1:27017/query_squad_db
```

## Migración de datos

Para cargar los datos iniciales:

```bash
node migracionMongo.js
```

---

# Ejecución del Proyecto

```bash
npm run dev
```

El servidor se ejecutará en:

```text
http://localhost:3000
```

---

# Autenticación y Autorización

El sistema implementa autenticación basada en sesiones para proteger las rutas privadas.

Los usuarios deben iniciar sesión para acceder a los módulos del sistema.

Si un usuario intenta acceder directamente a una URL protegida sin autenticarse, será redirigido a la pantalla de inicio de sesión.

Los permisos pueden administrarse mediante los socios registrados en la base de datos.

---

# Usuario de Prueba

Para fines académicos y de demostración se dejó configurado un usuario administrador con acceso completo al sistema.

### Credenciales

```text
Usuario: admin
Contraseña: 1234
```

> Nota: Este usuario fue habilitado únicamente para facilitar las pruebas funcionales y la presentación del proyecto.

---

# Rutas del Sistema

| Página | Ruta |
|----------|----------|
| Login | http://localhost:3000 |
| Empresas | http://localhost:3000/empresas |
| Nueva Empresa | http://localhost:3000/empresas/nueva |
| Empresas Activas | http://localhost:3000/empresas/listado-empresas-activas |
| Empresas Inactivas | http://localhost:3000/empresas/listado-empresas-inactivas |
| Empleados | http://localhost:3000/empleados |
| Nuevo Empleado | http://localhost:3000/empleados/nuevo |
| Novedades | http://localhost:3000/novedades |
| Auditoría | http://localhost:3000/auditoria |
| Liquidaciones | http://localhost:3000/liquidaciones |
| Socios | http://localhost:3000/socios |

---

# Estructura del Proyecto

```text
querySquad_crud
│
├── middlewares
├── models
├── routes
├── views
├── public
├── index.js
├── migracionMongo.js
├── package.json
└── README.md
```

---

# Licencia

Proyecto desarrollado con fines académicos para la materia **Desarrollo de Sistemas Web (Back End) - 2°** de la **Tecnicatura Superior en Desarrollo de Software** del **IFTS 29** con el fin de poner en práctica e implementar las tecnologías backend utilizando Node.js, Express y MongoDB.
La idea del proyecto es dejar de usar planillas manuales y centralizar todo en una API REST.
