/**
 * Seed para poblar las 18 parroquias de Maracaibo, cargos parroquiales y municipales
 * Ejecutar con: npx prisma db seed
 * 
 * Cargos en orden jerárquico:
 * 1. Coordinador Parroquial/Municipal
 * 2. Coordinador de Organización
 * 3. Coordinador de Comunicación
 * 4. Secretario Político 1
 * 5. Secretario Político 2
 * 6. Afiliado
 */

import { PrismaClient, Role, UserStatus, CargoStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ============================================
// DATOS DE SEMILLA
// ============================================

/// Las 18 parroquias de Maracaibo
const parishes = [
  { name: 'Antonio Borjas Romero', code: 'ABR' },
  { name: 'Bolívar', code: 'BOL' },
  { name: 'Cacique Mara', code: 'CM' },
  { name: 'Caracciolo Parra Pérez', code: 'CPP' },
  { name: 'Cecilio Acosta', code: 'CA' },
  { name: 'Chiquinquirá', code: 'CHI' },
  { name: 'Cristo de Aranza', code: 'CDA' },
  { name: 'Coquivacoa', code: 'COQ' },
  { name: 'Francisco Eugenio Bustamante', code: 'FEB' },
  { name: 'Idelfonso Vásquez', code: 'IV' },
  { name: 'Juana de Ávila', code: 'JA' },
  { name: 'Luis Hurtado Higuera', code: 'LHH' },
  { name: 'Manuel Dagnino', code: 'MD' },
  { name: 'Olegario Villalobos', code: 'OV' },
  { name: 'Raúl Leoni', code: 'RL' },
  { name: 'Santa Lucía', code: 'SL' },
  { name: 'Venancio Pulgar', code: 'VP' },
  { name: 'San Isidro', code: 'SI' },
];

/// Cargos por defecto para cada parroquia (6 puestos en orden jerárquico)
const parishCargos = [
  { 
    name: 'Coordinador Parroquial', 
    code: 'COORD_PAR', 
    order: 1, 
    description: 'Máxima autoridad de la parroquia, responsable de la coordinación general' 
  },
  { 
    name: 'Coordinador de Organización', 
    code: 'COORD_ORG', 
    order: 2, 
    description: 'Responsable de la organización y planificación de actividades' 
  },
  { 
    name: 'Coordinador de Comunicación', 
    code: 'COORD_COM', 
    order: 3, 
    description: 'Responsable de la comunicación y difusión de información' 
  },
  { 
    name: 'Secretario Político 1', 
    code: 'SEC_POL_1', 
    order: 4, 
    description: 'Primera secretaría política de la parroquia' 
  },
  { 
    name: 'Secretario Político 2', 
    code: 'SEC_POL_2', 
    order: 5, 
    description: 'Segunda secretaría política de la parroquia' 
  },
  { 
    name: 'Afiliado', 
    code: 'AFILIADO', 
    order: 6, 
    description: 'Miembro afiliado de la parroquia' 
  },
];

/// Cargos para la Directiva Municipal (6 puestos)
const municipalCargos = [
  { 
    name: 'Coordinador Juvenil Municipal de Maracaibo', 
    code: 'COORD_JUV_MUN', 
    order: 1, 
    description: 'Máxima autoridad juvenil del municipio Maracaibo' 
  },
  { 
    name: 'Coordinador de Organización Municipal', 
    code: 'COORD_ORG_MUN', 
    order: 2, 
    description: 'Responsable de la organización y planificación municipal' 
  },
  { 
    name: 'Coordinador de Comunicación Municipal', 
    code: 'COORD_COM_MUN', 
    order: 3, 
    description: 'Responsable de la comunicación y difusión municipal' 
  },
  { 
    name: 'Secretario Político 1 Municipal', 
    code: 'SEC_POL_1_MUN', 
    order: 4, 
    description: 'Primera secretaría política municipal' 
  },
  { 
    name: 'Secretario Político 2 Municipal', 
    code: 'SEC_POL_2_MUN', 
    order: 5, 
    description: 'Segunda secretaría política municipal' 
  },
  { 
    name: 'Afiliado Municipal', 
    code: 'AFILIADO_MUN', 
    order: 6, 
    description: 'Miembro afiliado de la directiva municipal' 
  },
];

/// Usuario Supremo por defecto
const defaultSupremo = {
  email: 'supremo@parroquias.com',
  password: 'Supremo2024!',
  cedula: 'V-12345678',
  firstName: 'Administrador',
  lastName: 'Supremo',
  role: Role.SUPREMO,
  status: UserStatus.ACTIVO,
};

// ============================================
// FUNCIONES DE SEMILLA
// ============================================

async function seedParishes() {
  console.log('📍 Sembrando parroquias...');
  
  for (const parishData of parishes) {
    await prisma.parish.upsert({
      where: { code: parishData.code },
      update: {},
      create: {
        name: parishData.name,
        code: parishData.code,
        municipality: 'Maracaibo',
        description: `Parroquia ${parishData.name} del municipio Maracaibo`,
      },
    });
  }
  
  const count = await prisma.parish.count();
  console.log(`✅ ${count} parroquias creadas/actualizadas`);
}

async function seedParishCargos() {
  console.log('💼 Sembrando cargos parroquiales...');
  
  const parishes = await prisma.parish.findMany();
  let totalCargos = 0;
  
  for (const parish of parishes) {
    for (const cargoData of parishCargos) {
      await prisma.cargo.upsert({
        where: {
          parishId_code: {
            parishId: parish.id,
            code: cargoData.code,
          },
        },
        update: {},
        create: {
          name: cargoData.name,
          code: cargoData.code,
          order: cargoData.order,
          description: cargoData.description,
          parishId: parish.id,
          isMunicipal: false,
        },
      });
      totalCargos++;
    }
  }
  
  console.log(`✅ ${totalCargos} cargos parroquiales creados (${parishCargos.length} por cada una de ${parishes.length} parroquias)`);
}

async function seedMunicipalCargos() {
  console.log('🏛️ Sembrando cargos municipales...');
  
  for (const cargoData of municipalCargos) {
    await prisma.cargo.create({
      data: {
        name: cargoData.name,
        code: cargoData.code,
        order: cargoData.order,
        description: cargoData.description,
        parishId: null, // NULL para cargos municipales
        isMunicipal: true,
      },
    });
  }
  
  const count = await prisma.cargo.count({
    where: { isMunicipal: true }
  });
  console.log(`✅ ${count} cargos municipales creados`);
}

async function seedSupremoUser() {
  console.log('👤 Sembrando usuario Supremo...');
  
  const hashedPassword = await bcrypt.hash(defaultSupremo.password, 10);
  
  await prisma.user.upsert({
    where: { email: defaultSupremo.email },
    update: {},
    create: {
      email: defaultSupremo.email,
      password: hashedPassword,
      cedula: defaultSupremo.cedula,
      firstName: defaultSupremo.firstName,
      lastName: defaultSupremo.lastName,
      role: defaultSupremo.role,
      status: defaultSupremo.status,
      parishId: null,
      isNotRegistered: false,
    },
  });
  
  console.log(`✅ Usuario Supremo creado: ${defaultSupremo.email}`);
}

async function seedSampleData() {
  console.log('📊 Sembrando datos de ejemplo...');
  
  // Crear un administrador de ejemplo
  const hashedPassword = await bcrypt.hash('Admin2024!', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@parroquias.com',
      password: hashedPassword,
      cedula: 'V-98765432',
      firstName: 'Administrador',
      lastName: 'General',
      role: Role.ADMINISTRADOR,
      status: UserStatus.ACTIVO,
      parishId: null,
      isNotRegistered: false,
      phone: '0414-0000000',
    },
  });
  
  // Crear un coordinador de ejemplo para la primera parroquia
  const firstParish = await prisma.parish.findFirst({
    orderBy: { createdAt: 'asc' },
  });
  
  if (firstParish) {
    const coordPassword = await bcrypt.hash('Coord2024!', 10);
    const coordinator = await prisma.user.create({
      data: {
        email: 'coord.anto@parroquias.com',
        password: coordPassword,
        cedula: 'V-11223344',
        firstName: 'Juan',
        lastName: 'Pérez',
        phone: '0414-1234567',
        role: Role.COORDINADOR,
        status: UserStatus.ACTIVO,
        parishId: firstParish.id,
        votingCenter: 'U.E. Antonio Borjas Romero',
        votingState: 'Zulia',
        votingMunicipality: 'Maracaibo',
        votingParish: 'Antonio Borjas Romero',
        isNotRegistered: false,
      },
    });
    
    // Asignar el cargo de coordinador parroquial a este usuario
    const cargoCoord = await prisma.cargo.findFirst({
      where: {
        parishId: firstParish.id,
        code: 'COORD_PAR',
      },
    });
    
    if (cargoCoord) {
      await prisma.cargoAssignment.create({
        data: {
          cargoId: cargoCoord.id,
          userId: coordinator.id,
          parishId: firstParish.id,
          status: CargoStatus.OCUPADO,
          assignedByUserId: admin.id,
        },
      });
    }
    
    // Crear un ejemplo de persona NO inscrita en el CNE
    const notRegisteredPassword = await bcrypt.hash('NoReg2024!', 10);
    await prisma.user.create({
      data: {
        email: 'noregistrado@parroquias.com',
        password: notRegisteredPassword,
        cedula: 'V-00000000',
        firstName: 'Persona',
        lastName: 'No Inscrita',
        role: Role.COORDINADOR,
        status: UserStatus.ACTIVO,
        parishId: firstParish.id,
        isNotRegistered: true,
        votingCenter: 'NO INSCRITO EN CNE',
      },
    });
    
    // Crear un enlace de invitación de ejemplo
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.invitationLink.create({
      data: {
        token: token,
        parishId: firstParish.id,
        createdByUserId: coordinator.id,
        isActive: true,
        maxUses: 10,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
      },
    });
  }
  
  console.log('✅ Datos de ejemplo creados');
}

// ============================================
// EJECUCIÓN PRINCIPAL
// ============================================

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...\n');
  
  try {
    await seedParishes();
    await seedParishCargos();
    await seedMunicipalCargos();
    await seedSupremoUser();
    await seedSampleData();
    
    console.log('\n🎉 Seed completado exitosamente!');
    console.log('\n📋 Credenciales de ejemplo:');
    console.log('   - Supremo: supremo@parroquias.com / Supremo2024! (V-12345678)');
    console.log('   - Admin: admin@parroquias.com / Admin2024! (V-98765432)');
    console.log('   - Coord: coord.anto@parroquias.com / Coord2024! (V-11223344)');
    console.log('   - No Reg: noregistrado@parroquias.com / NoReg2024! (V-00000000)');
    
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();