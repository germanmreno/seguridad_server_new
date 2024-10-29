import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.area.deleteMany();
    await prisma.direction.deleteMany();
    await prisma.administrativeUnit.deleteMany();
    await prisma.entity.deleteMany();

    // Create entities one by one to ensure proper ID assignment

    console.log('Creating entity...');
    const midme = await prisma.entity.create({
      data: {
        name: 'MIDME',
      },
    });

    const cvm = await prisma.entity.create({
      data: {
        name: 'CVM',
      },
    });

    console.log('Creating administrative units...');
    await prisma.administrativeUnit.createMany({
      data: [
        {
          id: 860000000000n,
          name: 'Despacho del Ministro o la Minista de Desarrollo Minero Ecológico',
          entity_id: midme.id,
        },
        {
          id: 860100000000n,
          name: 'Despacho del Viceministro de Exploración e Inversión Ecominera',
          entity_id: midme.id,
        },
        {
          id: 860200000000n,
          name: 'Despacho del Viceministro de Seguimiento y Control del Desarrollo Ecominero',
          entity_id: midme.id,
        },
        {
          id: 860002000000n,
          name: 'Oficina Estratégica de Seguimiento y Evaluación de Políticas Públicas',
          entity_id: midme.id,
        },
        {
          id: 860003000000n,
          name: 'Consultoría Jurídica',
          entity_id: midme.id,
        },
        {
          id: 860004000000n,
          name: 'Oficina de Auditoría Interna',
          entity_id: midme.id,
        },
        {
          id: 860005000000n,
          name: 'Oficina de Atención Ciudadana',
          entity_id: midme.id,
        },
        {
          id: 860006000000n,
          name: 'Oficina de Gestión Comunicacional',
          entity_id: midme.id,
        },
        {
          id: 860007000000n,
          name: 'Oficina de Planificación y Presupuesto',
          entity_id: midme.id,
        },
        {
          id: 860008000000n,
          name: 'Oficina de Gestión Humana',
          entity_id: midme.id,
        },
        {
          id: 860009000000n,
          name: 'Oficina de Gestión Administrativa',
          entity_id: midme.id,
        },
        {
          id: 860010000000n,
          name: 'Oficina de las Tecnologías de la Información y Comunicación',
          entity_id: midme.id,
        },
        {
          id: 860011000000n,
          name: 'Oficina de Integración y Asuntos Internacionales',
          entity_id: midme.id,
        },
        {
          id: 860012000000n,
          name: 'Oficina de Prevención y Control de Legitimación de Capitales',
          entity_id: midme.id,
        },
        {
          id: 860013000000n,
          name: 'Oficina de Coordinación Territorial',
          entity_id: midme.id,
        },
        {
          id: 860014000000n,
          name: 'Oficina de Desarrollo de Capacidades',
          entity_id: midme.id,
        },
      ],
    });

    // Create directions

    console.log('Creating directions...');
    const directions = [
      {
        id: 860001000000n,
        name: 'Dirección General del Despacho',
        administrative_unit_id: 860000000000n,
      },
      {
        id: 860002010000n,
        name: 'Dirección de Línea de Seguimiento y Evaluación de las Políticas del Sector Minero',
        administrative_unit_id: 860002000000n,
      },
      {
        id: 860002020000n,
        name: 'Dirección de Línea de Análisis Estadístico del Sector Minero Ecológico',
        administrative_unit_id: 860002000000n,
      },
      {
        id: 860003010000n,
        name: 'Dirección de Línea de Asesoría Jurídica',
        administrative_unit_id: 860003000000n,
      },
      {
        id: 860003020000n,
        name: 'Dirección de Línea de Recursos Administrativos y Litigio',
        administrative_unit_id: 860003000000n,
      },
      {
        id: 860006010000n,
        name: 'Dirección de Línea de Producción de Contenidos',
        administrative_unit_id: 860006000000n,
      },
      {
        id: 860006020000n,
        name: 'Dirección de Línea de Prensa',
        administrative_unit_id: 860006000000n,
      },
      {
        id: 860006030000n,
        name: 'Dirección de Línea de Relaciones Públicas, Protocolo y Eventos',
        administrative_unit_id: 860006000000n,
      },
      {
        id: 860006040000n,
        name: 'Dirección de Línea de Análisis Estratégico',
        administrative_unit_id: 860006000000n,
      },
      {
        id: 860007010000n,
        name: 'Dirección de Línea de Planificación y Optimización de Procesos',
        administrative_unit_id: 860007000000n,
      },
      {
        id: 860007020000n,
        name: 'Dirección de Línea de Presupuesto',
        administrative_unit_id: 860007000000n,
      },
      {
        id: 860008010000n,
        name: 'Dirección Técnica y Desarrollo Humano',
        administrative_unit_id: 860008000000n,
      },
      {
        id: 860008020000n,
        name: 'Dirección de Línea de Administración de Personal',
        administrative_unit_id: 860008000000n,
      },
      {
        id: 860008030000n,
        name: 'Dirección de Bienestar Social',
        administrative_unit_id: 860008000000n,
      },
      {
        id: 860009010000n,
        name: 'Dirección de Línea de Seguridad y Transporte',
        administrative_unit_id: 860009000000n,
      },
      {
        id: 860009020000n,
        name: 'Dirección de Línea de Administración y Finanzas',
        administrative_unit_id: 860009000000n,
      },
      {
        id: 860009030000n,
        name: 'Dirección de Línea de Adquisición y Servicios',
        administrative_unit_id: 860009000000n,
      },
      {
        id: 860009040000n,
        name: 'Dirección de Bienes Nacionales',
        administrative_unit_id: 860009000000n,
      },
      {
        id: 860101000000n,
        name: 'Dirección General de Investigación y Exploración Minera',
        administrative_unit_id: 860100000000n,
      },
      {
        id: 860102000000n,
        name: 'Dirección General de Planificación, Desarrollo e Inversión Minera',
        administrative_unit_id: 860100000000n,
      },
      {
        id: 860103000000n,
        name: 'Dirección General del Sistema de Información Minera',
        administrative_unit_id: 860100000000n,
      },
      {
        id: 860201000000n,
        name: 'Dirección General de la Gestión Productiva de la Pequeña Minería',
        administrative_unit_id: 860200000000n,
      },
      {
        id: 860202000000n,
        name: 'Dirección General de la Gestión Productiva de la Mediana y Gran Minería',
        administrative_unit_id: 860200000000n,
      },
      {
        id: 860203000000n,
        name: 'Dirección General de Gestión Ecosocialista del Desarrollo Minero',
        administrative_unit_id: 860200000000n,
      },
      {
        id: 860204000000n,
        name: 'Dirección General de Prevención y Resguardo Minero',
        administrative_unit_id: 860200000000n,
      },
    ];

    for (const direction of directions) {
      await prisma.direction.create({
        data: direction,
      });
    }

    console.log('Creating areas...');

    const areas = [
      {
        id: 860001000100n,
        name: 'Área de Trabajo de Secretaría General',
        direction_id: 860001000000n,
      },
      {
        id: 860001000200n,
        name: 'Área de Trabajo de Administración y Logística',
        direction_id: 860001000000n,
      },
      {
        id: 860001000300n,
        name: 'Área de Trabajo de Seguimiento de Instrucciones',
        direction_id: 860001000000n,
      },
      {
        id: 860001000400n,
        name: 'Área de Trabajo de Puntos de Cuenta',
        direction_id: 860001000000n,
      },
      {
        id: 860002010100n,
        name: 'Área de Trabajo de Seguimiento a las Políticas, Planes, Programas y Proyectos',
        direction_id: 860002010000n,
      },
      {
        id: 860002010200n,
        name: 'Área de Trabajo de Análisis del Resultado, Efecto e Impacto de las Políticas',
        direction_id: 860002010000n,
      },
      {
        id: 860002020100n,
        name: 'Área de Trabajo de Análisis Estadístico Geográfico',
        direction_id: 860002020000n,
      },
      {
        id: 860002020200n,
        name: 'Área de Trabajo de Enlaces Institucionales y Estadísticas Oficiales',
        direction_id: 860002020000n,
      },
      {
        id: 860003010100n,
        name: 'Área de Trabajo de Doctrinas y Opiniones Jurídicas',
        direction_id: 860003010000n,
      },
      {
        id: 860003010200n,
        name: 'Área de Trabajo de Normativo y Contratos',
        direction_id: 860003010000n,
      },
      {
        id: 860003020100n,
        name: 'Área de Trabajo de Recursos Administrativos',
        direction_id: 860003020000n,
      },
      {
        id: 860003020200n,
        name: 'Área de Trabajo de Litigio',
        direction_id: 860003020000n,
      },
      {
        id: 860004000100n,
        name: 'Área de Trabajo de Control Posterior',
        administrative_unit_id: 860004000000n,
      },
      {
        id: 860004000200n,
        name: 'Área de Trabajo de Determinación de Responsabilidades',
        administrative_unit_id: 860004000000n,
      },
      {
        id: 860005000100n,
        name: 'Área de Trabajo de Atención Social',
        administrative_unit_id: 860005000000n,
      },
      {
        id: 860005000200n,
        name: 'Área de Trabajo de Participación Ciudadana',
        administrative_unit_id: 860005000000n,
      },
      {
        id: 860005000300n,
        name: 'Área de Trabajo de Evaluación y Seguimiento de la Gestión',
        administrative_unit_id: 860005000000n,
      },
      {
        id: 860006010100n,
        name: 'Área de Trabajo de Audiovisuales',
        direction_id: 860006010000n,
      },
      {
        id: 860006010200n,
        name: 'Área de Trabajo de Contenido',
        direction_id: 860006010000n,
      },
      {
        id: 860006020100n,
        name: 'Área de Trabajo de Comunicación Interna',
        direction_id: 860006020000n,
      },
      {
        id: 860006020200n,
        name: 'Área de Trabajo de Comunicación Externa',
        direction_id: 860006020000n,
      },
      {
        id: 860006030100n,
        name: 'Área de Trabajo de Relaciones Públicas',
        direction_id: 860006030000n,
      },
      {
        id: 860006030200n,
        name: 'Área de Trabajo de Protocolo y Eventos',
        direction_id: 860006030000n,
      },
      {
        id: 860006040100n,
        name: 'Área de Trabajo de Estrategia',
        direction_id: 860006040000n,
      },
      {
        id: 860006040200n,
        name: 'Área de Trabajo de Comunicación Digital',
        direction_id: 860006040000n,
      },
      {
        id: 860007010100n,
        name: 'Área de Trabajo de Planificación Operativa',
        direction_id: 860007010000n,
      },
      {
        id: 860007010200n,
        name: 'Área de Trabajo de Organización y Optimización de Procesos',
        direction_id: 860007010000n,
      },
      {
        id: 860007020100n,
        name: 'Área de Trabajo de Presupuesto Nivel Central',
        direction_id: 860007020000n,
      },
      {
        id: 860007020200n,
        name: 'Área de Trabajo de Presupuesto Nivel Entes',
        direction_id: 860007020000n,
      },
      {
        id: 860008010100n,
        name: 'Área de Trabajo de Ingreso y Remuneración',
        direction_id: 860008010000n,
      },
      {
        id: 860008010200n,
        name: 'Área de Trabajo de Trabajo y Capacitación',
        direction_id: 860008010000n,
      },
      {
        id: 860008010300n,
        name: 'Área de Trabajo de Archivos y Expedientes',
        direction_id: 860008010000n,
      },
      {
        id: 860008020100n,
        name: 'Área de Trabajo de Nómina, Registro y Control',
        direction_id: 860008020000n,
      },
      {
        id: 860008020200n,
        name: 'Área de Trabajo de Análisis Presupuestario',
        direction_id: 860008020000n,
      },
      {
        id: 860008020300n,
        name: 'Área de Trabajo de Aportes y Prestaciones Sociales',
        direction_id: 860008020000n,
      },
      {
        id: 860008030100n,
        name: 'Área de Trabajo de Atención Integral',
        direction_id: 860008030000n,
      },
      {
        id: 860008030200n,
        name: 'Área de Trabajo de Servicio Médico',
        direction_id: 860008030000n,
      },
      {
        id: 860008030300n,
        name: 'Área de Trabajo de Seguridad e Higiene Laboral',
        direction_id: 860008030000n,
      },
      {
        id: 860009010100n,
        name: 'Área de Trabajo de Seguridad',
        direction_id: 860009010000n,
      },
      {
        id: 860009010200n,
        name: 'Área de Trabajo de Transporte',
        direction_id: 860009010000n,
      },
      {
        id: 860009020100n,
        name: 'Área de Trabajo de Ordenación de Pagos',
        direction_id: 860009020000n,
      },
      {
        id: 860009020200n,
        name: 'Área de Trabajo de Tesorería',
        direction_id: 860009020000n,
      },
      {
        id: 860009020300n,
        name: 'Área de Trabajo de Contabilidad',
        direction_id: 860009020000n,
      },
      {
        id: 860009030100n,
        name: 'Área de Trabajo de Servicios Generales',
        direction_id: 860009030000n,
      },
      {
        id: 860009030200n,
        name: 'Área de Trabajo de Compras',
        direction_id: 860009030000n,
      },
      {
        id: 860009030300n,
        name: 'Área de Trabajo de Almacén',
        direction_id: 860009030000n,
      },
      {
        id: 860009030400n,
        name: 'Área de Trabajo de Correspondencia y Archivo',
        direction_id: 860009030000n,
      },
      {
        id: 860009040100n,
        name: 'Área de Trabajo de Bienes en Desuso',
        direction_id: 860009040000n,
      },
      {
        id: 860009040200n,
        name: 'Área de Trabajo de Bienes Patrimoniales',
        direction_id: 860009040000n,
      },
      {
        id: 860010000100n,
        name: 'Área de Trabajo de Proyecto y Vinculación Institucional',
        administrative_unit_id: 860010000000n,
      },
      {
        id: 860010000200n,
        name: 'Área de Trabajo de Automatización de Procesos',
        administrative_unit_id: 860010000000n,
      },
      {
        id: 860010000300n,
        name: 'Área de Trabajo de Seguridad de la Información',
        administrative_unit_id: 860010000000n,
      },
      {
        id: 860010000400n,
        name: 'Área de Trabajo de Atención Tecnológica Integral',
        administrative_unit_id: 860010000000n,
      },
      {
        id: 860010000500n,
        name: 'Área de Trabajo de Infraestructura Tecnológica y Servicios',
        administrative_unit_id: 860010000000n,
      },
      {
        id: 860011000100n,
        name: 'Área de Trabajo de Asuntos Bilaterales de Países de América y Europa',
        administrative_unit_id: 860011000000n,
      },
      {
        id: 860011000200n,
        name: 'Área de Trabajo de Asuntos Bilaterales de Países de África y Medio Oriente',
        administrative_unit_id: 860011000000n,
      },
      {
        id: 860011000300n,
        name: 'Área de Trabajo de Asuntos Bilaterales de Países de Asia y Oceanía',
        administrative_unit_id: 860011000000n,
      },
      {
        id: 860011000400n,
        name: 'Área de Trabajo de Asuntos Multilaterales de Laudos y Normas Mineras Internacionales',
        administrative_unit_id: 860011000000n,
      },
      {
        id: 860012000100n,
        name: 'Área de Trabajo de Supervisión y Control',
        administrative_unit_id: 860012000000n,
      },
      {
        id: 860012000200n,
        name: 'Área de Trabajo de Estadísticas y Análisis Estratégico',
        administrative_unit_id: 860012000000n,
      },
      {
        id: 860013000100n,
        name: 'Área de Trabajo de Acompañamiento Territorial',
        administrative_unit_id: 860013000000n,
      },
      {
        id: 860013000200n,
        name: 'Área de Trabajo de Análisis y Estadísticas Regionales',
        administrative_unit_id: 860013000000n,
      },
      {
        id: 860101000100n,
        name: 'Área de Trabajo de Operaciones Geológicas',
        direction_id: 860101000000n,
      },
      {
        id: 860101000200n,
        name: 'Área de Trabajo de Reservas y Tecnologías',
        direction_id: 860101000000n,
      },
      {
        id: 860101000300n,
        name: 'Área de Trabajo de Estudios Integrados',
        direction_id: 860101000000n,
      },
      {
        id: 860101000400n,
        name: 'Área de Trabajo de Finanzas y Gestión',
        direction_id: 860101000000n,
      },
      {
        id: 860102000100n,
        name: 'Área de Trabajo de Economía Minera y Vigilancia Tecnológica',
        direction_id: 860102000000n,
      },
      {
        id: 860102000200n,
        name: 'Área de Trabajo de Planificación Sectorial Ecominera',
        direction_id: 860102000000n,
      },
      {
        id: 860102000300n,
        name: 'Área de Trabajo de Valoración Integral Ecominera',
        direction_id: 860102000000n,
      },
      {
        id: 860102000400n,
        name: 'Área de Trabajo de Desarrollo de Sistemas de Información Minera',
        direction_id: 860102000000n,
      },
      {
        id: 860102000500n,
        name: 'Área de Trabajo de Investigaciones Económicas',
        direction_id: 860102000000n,
      },
      {
        id: 860102000600n,
        name: 'Área de Trabajo de Promoción e Inversión',
        direction_id: 860102000000n,
      },
      {
        id: 860103000100n,
        name: 'Área de Trabajo de Gestión Territorial',
        direction_id: 860103000000n,
      },
      {
        id: 860103000200n,
        name: 'Área de Trabajo de Gestión de Datos',
        direction_id: 860103000000n,
      },
      {
        id: 860103000300n,
        name: 'Área de Trabajo de Registro Minero',
        direction_id: 860103000000n,
      },
      {
        id: 860201000100n,
        name: 'Área de Trabajo de Gestión Técnica',
        direction_id: 860201000000n,
      },
      {
        id: 860201000200n,
        name: 'Área de Trabajo de Gestión Socioeconómica',
        direction_id: 860201000000n,
      },
      {
        id: 86020000100n,
        name: 'Área de Trabajo de Gestión Productiva de los Minerales Metálicos y Estratégicos',
        direction_id: 860202000000n,
      },
      {
        id: 860200000200n,
        name: 'Área de Trabajo de Gestión Productiva de los Minerales No Metálicos y Descentralizados',
        direction_id: 860202000000n,
      },
      {
        id: 860200000300n,
        name: 'Área de Trabajo de Gestión Financiera de la Actividad Minera',
        direction_id: 860202000000n,
      },
      {
        id: 860203000100n,
        name: 'Área de Trabajo de Planificación y Desarrollo Estratégico',
        direction_id: 860203000000n,
      },
      {
        id: 860203000200n,
        name: 'Área de Trabajo de Estudios Ambientales',
        direction_id: 860203000000n,
      },
      {
        id: 860203000300n,
        name: 'Área de Trabajo de Gestión del Conocimiento y Análisis de Información',
        direction_id: 860203000000n,
      },
      {
        id: 860204000100n,
        name: 'Área de Trabajo de Operaciones Mineras',
        direction_id: 860204000000n,
      },
      {
        id: 860204000200n,
        name: 'Área de Trabajo de Doctrina y Programación',
        direction_id: 860204000000n,
      },
    ];

    for (const area of areas) {
      try {
        // Check if the area has a direction_id
        if (area.direction_id) {
          const direction = await prisma.direction.findUnique({
            where: { id: area.direction_id },
          });

          if (!direction) {
            console.warn(
              `Warning: Direction ${area.direction_id} not found for area ${area.name}`
            );
            continue;
          }
        }

        // Check if the area has an administrative_unit_id
        if (area.administrative_unit_id) {
          const adminUnit = await prisma.administrativeUnit.findUnique({
            where: { id: area.administrative_unit_id },
          });

          if (!adminUnit) {
            console.warn(
              `Warning: Administrative Unit ${area.administrative_unit_id} not found for area ${area.name}`
            );
            continue;
          }
        }

        // Create the area with the appropriate fields
        await prisma.area.create({
          data: {
            id: area.id,
            name: area.name,
            direction_id: area.direction_id || null,
            administrative_unit_id: area.administrative_unit_id || null,
          },
        });
        console.log(`Created area: ${area.name}`);
      } catch (error) {
        console.error(`Error creating area ${area.name}:`, error);
      }
    }

    console.log('Seed completed successfully!');

    // Create administrative units

    // const cvm_administrative_units = await prisma.administrativeUnit.create({
    //   data: [
    //     {
    //       name: 'Oficina de Tecnología de la Información',
    //       entity_id: cvm.id,
    //     },
    //     {
    //       name: 'Consultoría Jurídica',
    //       entity_id: cvm.id,
    //     },
    //     {
    //       name: 'Oficina de Planificación, Presupuesto y Organización',
    //       entity_id: cvm.id,
    //     },
    //     {
    //       name: 'Oficina de Gestión Humana',
    //       entity_id: cvm.id,
    //     },
    //     {
    //       name: 'Oficina de Seguridad Integral',
    //     },
    //   ],
    // });

    // console.log({ cvm_administrative_units });

    // const cvm_it_directions = await prisma.direction.createMany({
    //   data: [
    //     {
    //       name: 'Coordinación de Infraestructura Tecnológica',
    //       administrative_unit_id: cvm_administrative_units.id,
    //     },
    //     {
    //       name: 'Coordinación de Desarrollo de Sistemas',
    //       administrative_unit_id: cvm_administrative_units.id,
    //     },
    //     {
    //       name: 'Coordinación de Desarrollo de Soporte Tecnológico',
    //       administrative_unit_id: cvm_administrative_units.id,
    //     },
    //   ],
    // });
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
