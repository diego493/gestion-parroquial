import { PrismaClient, Role, UserStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ============================================
// PARROQUIAS DE MARACAIBO
// ============================================

const parishes = [
  { name: 'Antonio Borjas Romero', code: 'ABR' },
  { name: 'Bolívar', code: 'BOL' },
  { name: 'Cacique Mara', code: 'CM' },
  { name: 'Caracciolo Parra Pérez', code: 'CPP' },
  { name: 'Cecilio Acosta', code: 'CA' },
  { name: 'Chiquinquirá', code: 'CHI' },
  { name: 'Coquivacoa', code: 'COQ' },
  { name: 'Cristo de Aranza', code: 'CDA' },
  { name: 'Francisco Eugenio Bustamante', code: 'FEB' },
  { name: 'Idelfonso Vásquez', code: 'IV' },
  { name: 'Juana de Ávila', code: 'JA' },
  { name: 'Luis Hurtado Higuera', code: 'LHH' },
  { name: 'Manuel Dagnino', code: 'MD' },
  { name: 'Olegario Villalobos', code: 'OV' },
  { name: 'Raúl Leoni', code: 'RL' },
  { name: 'Santa Lucía', code: 'SL' },
  { name: 'Venancio Pulgar', code: 'VP' },
  { name: 'San Isidro', code: 'SI' }
]

// ============================================
// SEED PRINCIPAL
// ============================================

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // ============================================
  // CREAR PARROQUIAS
  // ============================================

  for (const parish of parishes) {
    await prisma.parish.upsert({
      where: {
        code: parish.code
      },
      update: {},
      create: {
        name: parish.name,
        code: parish.code,
        municipality: 'Maracaibo',
        description: `Parroquia ${parish.name} del municipio Maracaibo`
      }
    })
  }

  console.log('✅ Parroquias creadas correctamente')

  // ============================================
  // CREAR USUARIO SUPREMO
  // ============================================

  const hashedPassword = await bcrypt.hash('Supremo2024!', 10)

  await prisma.user.upsert({
    where: {
      email: 'supremo@parroquias.com'
    },
    update: {},
    create: {
      email: 'supremo@parroquias.com',
      password: hashedPassword,
      cedula: 'V12345678',
      firstName: 'Administrador',
      lastName: 'Supremo',
      role: Role.SUPREMO,
      status: UserStatus.ACTIVO
    }
  })

  console.log('✅ Usuario Supremo creado correctamente')

  // ============================================
  // MENSAJE FINAL
  // ============================================

  console.log('\n🎉 Seed completado exitosamente')
  console.log('\n📋 Credenciales de acceso:')
  console.log('Email: supremo@parroquias.com')
  console.log('Password: Supremo2024!')
}

// ============================================
// EJECUCIÓN
// ============================================

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
