import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'

// Cargar variables de entorno
dotenv.config()

// Importar rutas (se crearán después)
// import authRoutes from './routes/auth.routes'
// import userRoutes from './routes/user.routes'
// import parishRoutes from './routes/parish.routes'
// import cargoRoutes from './routes/cargo.routes'
// import reportRoutes from './routes/report.routes'
// import cneRoutes from './routes/cne.routes'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware de seguridad
app.use(helmet())

// Configurar CORS
const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173']
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No allowed by CORS'))
    }
  },
  credentials: true,
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Demasiadas solicitudes, por favor intente de nuevo más tarde',
})
app.use('/api', limiter)

// Middlewares de parsing
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
  })
})

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    name: 'Sistema de Gestión Parroquial - Maracaibo',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
    },
  })
})

// Rutas de la API (se implementarán después)
// app.use('/api/auth', authRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/parishes', parishRoutes)
// app.use('/api/cargos', cargoRoutes)
// app.use('/api/reports', reportRoutes)
// app.use('/api/cne', cneRoutes)

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
  })
})

// Manejo de errores global
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  
  res.status(err instanceof Error && 'status' in err ? (err as any).status : 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
})

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Sistema de Gestión Parroquial - Maracaibo             ║
║  Servidor corriendo en puerto ${PORT}                    ║
║  Entorno: ${process.env.NODE_ENV || 'development'}                            ║
╚════════════════════════════════════════════════════════╝
  `)
})

export default app