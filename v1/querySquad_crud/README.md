# Proyecto CRUD - QuerySquad (Talento Evolutivo S.A.)

¡Hola! Este es el repositorio del equipo **QuerySquad**.

### Integrantes:
- Cardoso, Virginia
- Cohene Báez, Lorena
- Colmeiro, Gisela
- Murguía, Cristina

Este proyecto fue desarrollado para la materia **Desarrollo de Sistemas Web (Back End) - 2°** de la **Tecnicatura Superior en Desarrollo de Software** del **IFTS 29**.

Aquí estamos desarrollando un sistema backend para gestionar la información de la consultora de Recursos Humanos **"Talento Evolutivo S.A."**. La idea del proyecto es dejar de usar planillas manuales y centralizar todo en una API REST.

### Stack Tecnológico

- **Backend:** Node.js con Express.
- **Base de Datos:** MongoDB con Mongoose ODM.
- **Vistas:** Pug (Motor de plantillas para el frontend).

### ¿Cómo instalar el proyecto?

#### Desde la terminal:

- Clonar el proyecto:

```
git clone https://github.com/LorenaCoheneBaez/querySquad_crud.git
```

### Es necesario instalar las dependencias:

```
npm install
```

### Configuración de MongoDB:

Este proyecto utiliza **MongoDB** como base de datos. Asegúrate de tener MongoDB instalado y ejecutándose localmente.

**Conexión:** `mongodb://127.0.0.1:27017/query_squad_db`

Para migrar los datos desde los archivos JSON a MongoDB, ejecuta el siguiente comando:

```
node migracionMongo.js
```

### Levantar correr el proyecto:

```
npm run dev
```

## Acceso:

- Usuario: `admin`
- Contraseña: `1234`

## Rutas:

| Página                          | Ruta                                                      |
| ------------------------------- | --------------------------------------------------------- |
| Login                           | http://localhost:3000                                     |
| Listado de todas las empresas   | http://localhost:3000/empresas                            |
| Registrar Nueva Empresa         | http://localhost:3000/empresas/nueva                      |
| Listado de empresas activas     | http://localhost:3000/empresas/listado-empresas-activas   |
| Listado de empresas inactivas   | http://localhost:3000/empresas/listado-empresas-inactivas |
| Actualizar Estado de la Empresa | http://localhost:3000/empresas?msg=status                 |
| Listado de todos los Empleados  | http://localhost:3000/empleados                           |
| Registrar Empleado nuevo        | http://localhost:3000/empleados/nuevo                     |
| Actualizar Datos del Empleado   | http://localhost:3000/empleados/actualizar/id             |
| Listado General de Novedades    | http://localhost:3000/novedades                           |
| Formulario Editar Novedad       | http://localhost:3000/novedades/editar/id                 |
| Crear Novedad (POST)            | http://localhost:3000/novedades                           |
| Actualizar Novedad (PUT)        | http://localhost:3000/novedades/id                        |
| Eliminar Novedad (DELETE)       | http://localhost:3000/novedades/id                        |
