# API Documentation - Sistema de Gestión Parroquial

## Base URL
```
http://localhost:3001/api
```

## Autenticación
Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 🔐 Autenticación

#### POST `/auth/login`
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

#### POST `/auth/register`
Registro de nuevo usuario (requiere enlace de invitación)
```json
{
  "token": "token-de-invitación",
  "email": "usuario@ejemplo.com",
  "password": "contraseña",
  "cedula": "V-12345678"
}
```

#### POST `/auth/forgot-password`
Solicitar restablecimiento de contraseña
```json
{
  "email": "usuario@ejemplo.com"
}
```

---

### 👥 Usuarios

#### GET `/users`
Listar usuarios (con filtros y paginación)
- **Permisos**: Supremo, Administrador
- **Query params**: `page`, `limit`, `search`, `parish`, `role`, `cargo`, `cneStatus`

#### GET `/users/:id`
Obtener detalles de un usuario
- **Permisos**: Supremo, Administrador, Coordinador (solo su parroquia)

#### POST `/users`
Crear nuevo usuario
- **Permisos**: Supremo, Administrador
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña",
  "cedula": "V-12345678",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "0414-1234567",
  "parishId": "uuid-parroquia",
  "role": "COORDINADOR"
}
```

#### PUT `/users/:id`
Actualizar usuario
- **Permisos**: Supremo, Administrador

#### DELETE `/users/:id`
Eliminar usuario
- **Permisos**: Supremo, Administrador

---

### 🏛️ Parroquias

#### GET `/parishes`
Listar todas las parroquias
- **Query params**: `search`

#### GET `/parishes/:id`
Obtener detalles de una parroquia con progreso de cargos

#### GET `/parishes/:id/progress`
Obtener progreso de reclutamiento
```json
{
  "parishId": "uuid",
  "name": "Antonio Borjas Romero",
  "totalCargos": 6,
  "cargosOcupados": 3,
  "porcentaje": 50,
  "cargos": [
    {
      "name": "Coordinador Parroquial",
      "status": "OCUPADO",
      "usuario": "Juan Pérez"
    },
    {
      "name": "Coordinador de Organización",
      "status": "VACANTE"
    }
  ]
}
```

#### GET `/parishes/:id/team`
Obtener equipo completo de una parroquia

---

### 💼 Cargos

#### GET `/cargos`
Listar cargos (con filtros)
- **Query params**: `parish`, `isMunicipal`, `status`

#### POST `/cargos/assign`
Asignar usuario a cargo
- **Permisos**: Supremo, Administrador
```json
{
  "userId": "uuid-usuario",
  "cargoId": "uuid-cargo",
  "parishId": "uuid-parroquia",
  "status": "OCUPADO"
}
```

#### DELETE `/cargos/assign/:assignmentId`
Remover asignación de cargo
- **Permisos**: Supremo, Administrador

---

### 🏛️ Directiva Municipal

#### GET `/municipal-board`
Obtener miembros de la directiva municipal

#### POST `/municipal-board/assign`
Asignar cargo municipal
- **Permisos**: Supremo, Administrador

---

### 📊 Reportes

#### GET `/reports/parishes`
Reporte de parroquias con progreso
- **Query params**: `format` (json, excel)
- **Permisos**: Supremo, Administrador

#### GET `/reports/users`
Reporte de usuarios con filtros
- **Query params**: `parish`, `role`, `cneStatus`, `cargo`, `format`
- **Permisos**: Supremo, Administrador

#### GET `/reports/not-registered`
Reporte de personas no inscritas en el CNE
- **Permisos**: Supremo, Administrador

#### GET `/reports/export`
Exportar datos a Excel
- **Query params**: `type` (users, parishes, cargos)
- **Permisos**: Supremo, Administrador

---

### 🔗 Enlaces de Invitación

#### POST `/invitations`
Generar enlace de invitación
- **Permisos**: Coordinador (su parroquia), Administrador, Supremo
```json
{
  "parishId": "uuid-parroquia",
  "maxUses": 10,
  "expiresIn": 7 // días
}
```

#### GET `/invitations/:token`
Validar enlace de invitación

#### DELETE `/invitations/:id`
Desactivar enlace de invitación

---

### 🗳️ CNE (Consulta de Cédulas)

#### GET `/cne/consult/:cedula`
Consultar cédula en el CNE
- **Permisos**: Autenticado
- **Response**:
```json
{
  "found": true,
  "data": {
    "nombres": "Juan",
    "apellidos": "Pérez",
    "centroVotacion": "U.E. Antonio Borjas Romero",
    "estado": "Zulia",
    "municipio": "Maracaibo",
    "parroquia": "Antonio Borjas Romero"
  }
}
```

---

## Códigos de Estado

| Código | Significado |
|--------|-------------|
| 200 | Éxito |
| 201 | Creado |
| 400 | Solicitud inválida |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | No encontrado |
| 429 | Demasiadas solicitudes |
| 500 | Error interno |

## Errores Comunes

```json
{
  "error": "Mensaje de error descriptivo",
  "code": "ERROR_CODE",
  "details": {} // Detalles adicionales
}