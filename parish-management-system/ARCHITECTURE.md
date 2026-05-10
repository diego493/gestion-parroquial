# Arquitectura del Sistema - Gestión Parroquial Maracaibo

## 📐 Visión General

Este documento describe la arquitectura técnica y las decisiones de diseño del sistema de gestión de equipos parroquiales.

---

## 🏗️ Arquitectura General

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   API CNE       │
│   React + Vite  │◄───────►│   (Externa)     │
│   TypeScript    │         │                 │
└────────┬────────┘         └─────────────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend       │
│   Express.js    │
│   TypeScript    │
└────────┬────────┘
         │
         │ Prisma ORM
         │
┌────────▼────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

---

## 🗄️ Modelo de Datos

### Entidades Principales

1. **User** - Usuarios del sistema
   - Datos de identificación (cédula, nombres, apellidos)
   - Datos del CNE (centro de votación, estado, municipio, parroquia)
   - Rol (SUPREMO, ADMINISTRADOR, COORDINADOR)
   - Relación con parroquia (opcional)

2. **Parish** - Las 18 parroquias de Maracaibo
   - Nombre, código, descripción
   - Relación con coordinadores y cargos

3. **Cargo** - Puestos por parroquia (6 tipos)
   - Coordinador Parroquial
   - Coordinador de Organización
   - Coordinador de Comunicación
   - Secretario Político 1
   - Secretario Político 2
   - Afiliado
   - También soporta cargos municipales

4. **CargoAssignment** - Asignación de usuario a cargo
   - Relación usuario-cargo-parroquia
   - Estado (VACANTE, OCUPADO, SUSPENDIDO)
   - Fecha de asignación y fin

5. **MunicipalBoard** - Directiva Municipal
   - Relación usuario-cargo municipal
   - Gestión independiente de cargos parroquiales

6. **InvitationLink** - Enlaces de invitación
   - Token único para registro
   - Límite de usos y expiración
   - Vinculado a parroquia

7. **AuditLog** - Registro de auditoría
   - Todas las acciones del sistema
   - Usuario, acción, entidad afectada
   - Datos antes/después (JSON)

8. **ParishHistory** - Historial de eventos
   - Eventos importantes por parroquia
   - Tracking de cambios

---

## 🔐 Sistema de Roles (RBAC)

### Supremo
- **Acceso**: Total
- **Permisos**:
  - CRUD completo de usuarios
  - Gestión de parroquias
  - Auditoría completa
  - Dashboard global
  - Gestión de directiva municipal
  - Configuración del sistema

### Administrador
- **Acceso**: Amplio
- **Permisos**:
  - CRUD de usuarios (excepto supremo)
  - Gestión de coordinadores
  - Generación de reportes
  - Exportación a Excel
  - Filtros y búsquedas avanzadas
  - No puede modificar supremo

### Coordinador Parroquial
- **Acceso**: Limitado a su parroquia
- **Permisos**:
  - Lectura de datos de su parroquia
  - Escritura de datos de su parroquia
  - Generación de enlaces de invitación
  - No puede editar/eliminar usuarios
  - No puede acceder a otras parroquias

---

## 📁 Estructura de Carpetas

```
parish-management-system/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Datos de prueba
│   └── migrations/            # Migraciones generadas
│
├── server/                    # Backend
│   ├── src/
│   │   ├── config/            # Configuraciones
│   │   │   ├── database.ts    # Conexión Prisma
│   │   │   ├── auth.ts        # Configuración JWT
│   │   │   └── cors.ts        # Configuración CORS
│   │   │
│   │   ├── controllers/       # Controladores
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── parish.controller.ts
│   │   │   ├── cargo.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   ├── cne.controller.ts
│   │   │   └── invitation.controller.ts
│   │   │
│   │   ├── middleware/        # Middleware
│   │   │   ├── auth.middleware.ts    # Verificación JWT
│   │   │   ├── rbac.middleware.ts    # Control de roles
│   │   │   ├── validation.middleware.ts # Validación Zod
│   │   │   └── audit.middleware.ts   # Auditoría
│   │   │
│   │   ├── routes/            # Rutas API
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   ├── parish.routes.ts
│   │   │   ├── cargo.routes.ts
│   │   │   ├── report.routes.ts
│   │   │   ├── cne.routes.ts
│   │   │   └── invitation.routes.ts
│   │   │
│   │   ├── services/          # Servicios de negocio
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── parish.service.ts
│   │   │   ├── cargo.service.ts
│   │   │   ├── report.service.ts
│   │   │   ├── cne.service.ts
│   │   │   ├── invitation.service.ts
│   │   │   └── audit.service.ts
│   │   │
│   │   ├── utils/             # Utilidades
│   │   │   ├── cne.ts         # Cliente API CNE
│   │   │   ├── excel.ts       # Generación Excel
│   │   │   ├── password.ts    # Hash de contraseñas
│   │   │   ├── token.ts       # Generación de tokens
│   │   │   └── logger.ts      # Logging
│   │   │
│   │   ├── types/             # Tipos TypeScript
│   │   │   ├── express.d.ts   # Extensiones Express
│   │   │   ├── cne.ts         # Tipos API CNE
│   │   │   └── api.ts         # Tipos API generales
│   │   │
│   │   └── index.ts           # Entry point
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── client/                    # Frontend
│   ├── public/
│   │   └── favicon.svg
│   │
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   │   ├── ui/            # Componentes UI base
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Table.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   └── Badge.tsx
│   │   │   │
│   │   │   ├── layout/        # Componentes de layout
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   │
│   │   │   ├── forms/         # Componentes de formularios
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── UserForm.tsx
│   │   │   │   ├── ParishForm.tsx
│   │   │   │   └── CNEConsultForm.tsx
│   │   │   │
│   │   │   └── data/          # Componentes de datos
│   │   │       ├── UserTable.tsx
│   │   │       ├── ParishCard.tsx
│   │   │       ├── ProgressChart.tsx
│   │   │       └── ReportTable.tsx
│   │   │
│   │   ├── pages/             # Páginas
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── ParishesPage.tsx
│   │   │   ├── UsersPage.tsx
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── MunicipalBoardPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   │
│   │   ├── hooks/             # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useUsers.ts
│   │   │   ├── useParishes.ts
│   │   │   ├── useCNE.ts
│   │   │   └── useReports.ts
│   │   │
│   │   ├── services/          # Servicios API
│   │   │   ├── api.ts         # Cliente Axios
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── parish.service.ts
│   │   │   ├── report.service.ts
│   │   │   └── cne.service.ts
│   │   │
│   │   ├── store/             # Estado global (Zustand)
│   │   │   ├── auth.store.ts
│   │   │   ├── ui.store.ts
│   │   │   └── filter.store.ts
│   │   │
│   │   ├── types/             # Tipos TypeScript
│   │   │   ├── user.ts
│   │   │   ├── parish.ts
│   │   │   ├── cargo.ts
│   │   │   └── api.ts
│   │   │
│   │   ├── utils/             # Utilidades
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── App.tsx            # Componente principal
│   │   ├── main.tsx           # Entry point
│   │   └── index.css          # Estilos globales
│   │
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── package.json               # Root package.json
├── README.md                  # Documentación principal
├── API.md                     # Documentación de API
├── ARCHITECTURE.md            # Este archivo
└── .gitignore
```

---

## 🔄 Flujos Principales

### 1. Registro con Enlace de Invitación

```
1. Coordinador genera enlace de invitación
   POST /api/invitations
   └─> Token único + parishId + maxUses + expiresAt

2. Usuario recibe enlace
   https://app.com/register?token=abc123

3. Usuario ingresa cédula
   GET /api/cne/consult/V-12345678
   └─> API CNE devuelve nombres, apellidos, centro de votación

4. Usuario completa registro
   POST /api/auth/register
   └─> Token válido + datos CNE + contraseña
   └─> Usuario creado con role=COORDINADOR, parishId=parish del token
```

### 2. Consulta de Progreso por Parroquia

```
1. Usuario solicita progreso
   GET /api/parishes/:id/progress

2. Sistema calcula:
   - Total cargos por parroquia (6)
   - Cargos ocupados (CargoAssignment con status=OCUPADO)
   - Porcentaje = ocupados / total * 100

3. Response:
   {
     "totalCargos": 6,
     "cargosOcupados": 3,
     "porcentaje": 50,
     "cargos": [...]
   }
```

### 3. Generación de Reporte Excel

```
1. Usuario solicita reporte
   GET /api/reports/export?type=users&format=excel

2. Servicio genera Excel con:
   - Encabezados
   - Filtros aplicados
   - Formato condicional (no inscritos en rojo)

3. Response:
   - Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
   - Content-Disposition: attachment; filename="reporte.xlsx"
```

---

## 🛡️ Seguridad

### Autenticación
- JWT con expiración configurable
- Refresh tokens (opcional)
- Hash de contraseñas con bcrypt (10 rounds)

### Autorización
- Middleware RBAC en cada ruta
- Validación de propiedad de recursos
- Coordinadores solo acceden a su parroquia

### Validación
- Zod schemas en todos los inputs
- Sanitización de datos
- Prevención de inyección SQL (Prisma ORM)

### Auditoría
- Log de todas las acciones
- IP y User Agent
- Datos antes/después de cambios

---

## 📊 Rendimiento

### Optimizaciones
- Índices en campos de búsqueda frecuente
- Denormalización de parishId en CargoAssignment
- Paginación en listados grandes
- Cache de consultas frecuentes (React Query)

### Límites
- Rate limiting por IP
- Límite de solicitudes por ventana
- Timeout en consultas CNE

---

## 🚀 Despliegue

### Requisitos
- Node.js 18+
- PostgreSQL 14+
- 512MB RAM mínimo
- 1GB almacenamiento

### Variables de Entorno (Producción)
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=<64-character-random-string>
CNE_API_URL=https://api.cne.gob.ve/consulta
```

### Comandos de Despliegue
```bash
# Build
npm run build:server
npm run build:client

# Migraciones
npm run prisma:migrate:prod

# Iniciar
npm run start:server
```

---

## 📝 Notas de Diseño

### Decisiones Clave

1. **Prisma ORM**: Facilita migraciones y type-safety
2. **TypeScript**: Type-safety en frontend y backend
3. **React Query**: Cache y sincronización de datos
4. **Zustand**: Estado global ligero
5. **TailwindCSS**: Estilos utilitarios rápidos
6. **Zod**: Validación type-safe

### Futuras Mejoras

- [ ] Websockets para notificaciones en tiempo real
- [ ] Exportación a PDF además de Excel
- [ ] Dashboard con gráficos avanzados
- [ ] Sistema de notificaciones por email
- [ ] API de estadísticas avanzadas
- [ ] Modo offline (PWA)