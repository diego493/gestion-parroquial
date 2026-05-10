# Sistema de Gestión de Equipos Parroquiales - Maracaibo

Sistema web para la gestión de equipos parroquiales y directiva municipal del municipio Maracaibo, con integración al CNE para consulta de cédulas.

## 🏗️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT (JSON Web Tokens)
- **Validación**: Zod

## 📋 Requisitos Previos

- Node.js 18+ 
- PostgreSQL 14+
- npm o yarn

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd parish-management-system
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del root, server y client
npm run install:all
```

### 3. Configurar variables de entorno

#### Backend (.env en carpeta server/)
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/parish_db?schema=public"
JWT_SECRET="tu-secreto-jwt-muy-seguro"
PORT=3001
NODE_ENV=development
CNE_API_URL="https://api.cne.gob.ve/consulta"
```

#### Frontend (.env en carpeta client/)
```env
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME="Gestión Parroquial Maracaibo"
```

### 4. Configurar base de datos

```bash
# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos con seed
npm run prisma:seed
```

### 5. Iniciar aplicación

```bash
# En modo desarrollo (ambos servidores)
npm run dev:server  # Terminal 1
npm run dev:client  # Terminal 2
```

## 🏛️ Estructura del Proyecto

```
parish-management-system/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   ├── seed.ts                # Datos de prueba
│   └── migrations/            # Migraciones
├── server/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── config/            # Configuraciones
│   │   ├── controllers/       # Controladores
│   │   ├── middleware/        # Middleware (auth, validación)
│   │   ├── routes/            # Rutas API
│   │   ├── services/          # Servicios de negocio
│   │   ├── utils/             # Utilidades
│   │   └── index.ts           # Entry point
│   ├── package.json
│   └── tsconfig.json
├── client/                    # Frontend React + Vite
│   ├── src/
│   │   ├── components/        # Componentes reutilizables
│   │   ├── pages/             # Páginas
│   │   ├── hooks/             # Custom hooks
│   │   ├── services/          # Servicios API
│   │   ├── store/             # Estado global (Zustand/Context)
│   │   ├── types/             # Tipos TypeScript
│   │   ├── utils/             # Utilidades
│   │   └── App.tsx            # Componente principal
│   ├── package.json
│   └── vite.config.ts
├── package.json               # Root package.json
└── README.md
```

## 👥 Roles y Permisos

### Supremo
- Control total del sistema
- Gestión de todos los usuarios
- Auditoría de historial (logs)
- Gestión de las 18 parroquias
- Dashboard global con progreso de reclutamiento
- Gestión de directiva municipal

### Administrador
- Gestión de usuarios y coordinadores parroquiales
- Llenado de tablas y generación de reportes
- Creación de usuarios coordinadores
- Exportación de datos a Excel
- Filtros y búsquedas avanzadas

### Coordinador Parroquial
- Solo lectura y escritura de datos de SU parroquia asignada
- No puede editar ni eliminar usuarios (debe solicitarlo al admin)
- Generación de enlaces de invitación para su equipo
- Gestión de cargos parroquiales

## 📊 Funcionalidades Principales

### Gestión de Usuarios
- Registro con cédula (consulta automática al CNE)
- Autocompletado de nombres, apellidos y colegio electoral
- Detección de personas no inscritas en el CNE
- Asignación de cargos por parroquia

### Parroquias
- 18 parroquias de Maracaibo predefinidas
- Progreso de reclutamiento por parroquia (ej: 1/6 cargos ocupados)
- Filtros por parroquia, cargo, estado CNE

### Directiva Municipal
- 6 cargos municipales (Coordinador Juvenil Municipal, etc.)
- Gestión independiente de cargos parroquiales

### Reportes
- Reportes por parroquia
- Búsquedas por nombre y cédula
- Exportación a Excel
- Filtro de no inscritos en CNE

### Enlaces de Invitación
- Coordinadores pueden generar enlaces para su parroquia
- Configuración de límite de usos y expiración
- Registro simplificado mediante enlace

## 🔗 Integración CNE

El sistema se integra con la API del CNE para:
- Consultar cédula y obtener nombres/apellidos
- Obtener centro de votación (estado, municipio, parroquia)
- Marcar como "NO INSCRITO" si no se encuentra en el sistema

API de referencia: https://github.com/robertgon97/Consulta-CNE

## 📝 Credenciales de Prueba

Después de ejecutar el seed:

| Rol | Email | Contraseña | Cédula |
|-----|-------|------------|--------|
| Supremo | supremo@parroquias.com | Supremo2024! | V-12345678 |
| Administrador | admin@parroquias.com | Admin2024! | V-98765432 |
| Coordinador | coord.anto@parroquias.com | Coord2024! | V-11223344 |
| No Inscrito | noregistrado@parroquias.com | NoReg2024! | V-00000000 |

## 🛠️ Comandos Útiles

```bash
# Desarrollo
npm run dev:server          # Iniciar backend en modo desarrollo
npm run dev:client          # Iniciar frontend en modo desarrollo

# Build de producción
npm run build:server        # Compilar backend
npm run build:client        # Compilar frontend

# Base de datos
npm run prisma:generate     # Generar Prisma Client
npm run prisma:migrate      # Ejecutar migraciones
npm run prisma:seed         # Poblar base de datos
npm run prisma:studio       # Abrir Prisma Studio (GUI)

# Instalación
npm run install:all         # Instalar dependencias de todos los paquetes
```

## 📄 Licencia

MIT

## 👨‍💻 Desarrollado por

Equipo de Desarrollo - Gestión Parroquial Maracaibo