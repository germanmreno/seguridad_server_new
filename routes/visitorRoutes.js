import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './authRoutes.js';
import { serializeBigInt } from '../utils/serializer.js';

const router = express.Router();

const prisma = new PrismaClient();

// Validation middleware
const validateRegistration = (req, res, next) => {
  console.log('Validating registration');
  console.log(req.body);

  // Base required fields (always required)
  const requiredFields = [
    'dni_type_id',
    'dni_number',
    'firstName',
    'lastName',
    'contact_number_prefix_id',
    'contact_number',
    'enterpriseName',
    'enterpriseRif',
    'visit_type_id',
    'entity_id',
    'administrative_unit_id',
    'visit_date',
    'visit_reason',
  ];

  const missingFields = requiredFields.filter(
    (field) => req.body[field] === undefined
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: 'Missing required fields',
      fields: missingFields,
    });
  }

  // Validate vehicle data only if visit_type_id is 2 (vehicular)
  if (req.body.visit_type_id === 2) {
    if (!req.body.vehicle_plate || !req.body.vehicle_model) {
      return res.status(400).json({
        error: 'Incomplete vehicle information',
        message: 'Both plate and model are required for vehicular visits',
      });
    }
  } else if (req.body.visit_type_id === 1) {
    // For pedestrian visits, clear any vehicle data if accidentally sent
    delete req.body.vehicle_plate;
    delete req.body.vehicle_model;
    delete req.body.vehicle_brand;
    delete req.body.vehicle_color;
  }

  next();
};

// Get all visitors with their latest visits and related information
router.get('/', async (req, res) => {
  try {
    const visits = await prisma.visit.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        visitor: {
          include: {
            dnis_type: true,
            numbers_prefix: true,
            visitor_companies: {
              include: {
                company: true,
              },
            },
          },
        },
        visit_type: true,
        entity: true,
        administrative_unit: true,
        area: true,
        direction: true,
        vehicle: {
          select: {
            id: true,
            brand: true,
            model: true,
            color: true,
            plate: true,
          },
        },
      },
    });

    // Format the response to be more frontend-friendly
    const formattedVisits = visits.map((visit) => ({
      id: visit.id,
      visitDate: visit.visit_date,
      exitDate: visit.exit_date,
      visitReason: visit.visit_reason,
      createdAt: visit.createdAt,
      updatedAt: visit.updatedAt,

      // Visitor information
      visitor: {
        id: visit.visitor.id,
        fullName: `${visit.visitor.first_name} ${visit.visitor.last_name}`,
        dniType: visit.visitor.dnis_type.abbreviation,
        dniNumber: visit.visitor.dni_number,
        contactNumber: `${visit.visitor.numbers_prefix.code}${visit.visitor.contact_number}`,
        company: visit.visitor.visitor_companies[0]?.company || null,
      },

      // Visit type
      visitType: visit.visit_type.name,

      // Location information
      location: {
        entity: visit.entity.name,
        administrativeUnit: visit.administrative_unit.name,
        direction: visit.direction?.name || null,
        area: visit.area?.name || null,
      },

      // Vehicle information (if exists)
      vehicle: visit.vehicle
        ? {
            id: visit.vehicle.id,
            plate: visit.vehicle.plate,
            brand: visit.vehicle.brand,
            model: visit.vehicle.model,
            color: visit.vehicle.color,
          }
        : null,
    }));

    res.json(serializeBigInt(formattedVisits));
  } catch (err) {
    console.error('Error fetching visits:', err);
    res.status(500).json({
      message: 'Error fetching visits',
      error: err.message,
    });
  }
});

// Search visitor by DNI
router.get('/search-visitor', async (req, res) => {
  const { dni } = req.query;

  if (!dni) {
    return res.status(400).json({ error: 'DNI is required' });
  }

  try {
    const visitor = await prisma.visitor.findFirst({
      where: {
        dni_number: parseInt(dni),
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        dni_number: true,
        contact_number: true,
        visitor_companies: {
          include: {
            company: true,
          },
        },
      },
    });

    if (visitor) {
      // Format the response to match frontend expectations
      const formattedVisitor = {
        firstName: visitor.first_name,
        lastName: visitor.last_name,
        dni: visitor.dni_number.toString(),
        phoneNumber: visitor.contact_number,
        enterpriseName: visitor.visitor_companies[0]?.company.name || '',
      };
      res.json(formattedVisitor);
    } else {
      res.status(404).json({ message: 'Visitor not found' });
    }
  } catch (error) {
    console.error('Error searching for visitor:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while searching for the visitor' });
  }
});

// Get all entities
router.get('/selects/entities', async (req, res) => {
  try {
    const entities = await prisma.entity.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(entities);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching entities' });
  }
});

// Get administrative units by entity
router.get('/selects/administrative-units/:entityId', async (req, res) => {
  try {
    const { entityId } = req.params;
    const adminUnits = await prisma.administrativeUnit.findMany({
      where: {
        entity_id: parseInt(entityId),
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.json(adminUnits);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching administrative units' });
  }
});

// Get directions by administrative unit
router.get('/selects/directions/:adminUnitId', async (req, res) => {
  try {
    const { adminUnitId } = req.params;
    const directions = await prisma.direction.findMany({
      where: {
        administrative_unit_id: BigInt(adminUnitId),
      },
      select: {
        id: true,
        name: true,
      },
    });
    res.json(directions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching directions' });
  }
});

// Get areas by administrative unit or direction
router.get('/selects/areas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;

    const areas = await prisma.area.findMany({
      where:
        type === 'direction'
          ? { direction_id: BigInt(id) }
          : { administrative_unit_id: BigInt(id) },
      select: {
        id: true,
        name: true,
      },
    });
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching areas' });
  }
});

// Add a new visitor
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      dni,
      business,
      phone,
      gerency,
      contact,
      observation,
      date,
      hour,
      registered_by,
    } = req.body;

    const newVisitor = await prisma.visitor.create({
      data: {
        firstName,
        lastName,
        dni,
        business,
        phone,
        gerency,
        contact,
        observation,
        date: new Date(date),
        hour,
        registered_by,
      },
    });

    res.status(201).json(newVisitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a visitor (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    await prisma.visitor.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Visitor deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete multiple visitors (admin only)
router.delete('/', verifyToken, async (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    await prisma.visitor.deleteMany({ where: { id: { in: req.body.ids } } });
    res.json({ message: 'Visitors deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Register complete visitor data
router.post('/register-complete', validateRegistration, async (req, res) => {
  try {
    const transaction = await prisma.$transaction(async (prisma) => {
      const {
        // Visitor data
        dni_type_id,
        dni_number,
        firstName,
        lastName,
        contact_number_prefix_id,
        contact_number,

        // Enterprise data
        enterpriseName,
        enterpriseRif,

        // Visit data
        visit_type_id,
        entity_id,
        administrative_unit_id,
        area_id,
        direction_id,
        visit_date,
        exit_date,
        visit_reason,

        // Vehicle data (optional)
        vehicle_plate,
        vehicle_model,
        vehicle_brand,
        vehicle_color,
      } = req.body;

      // 1. Check if visitor already exists
      const existingVisitor = await prisma.visitor.findFirst({
        where: {
          AND: [{ dni_type_id }, { dni_number }],
        },
      });

      // 2. Create or use existing visitor
      const visitor =
        existingVisitor ||
        (await prisma.visitor.create({
          data: {
            dni_type_id,
            dni_number,
            first_name: firstName,
            last_name: lastName,
            contact_number_prefix_id,
            contact_number,
          },
        }));

      // 3. Create or find enterprise by RIF (more reliable than name)
      let company = await prisma.company.findUnique({
        where: { rif: enterpriseRif },
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: enterpriseName,
            rif: enterpriseRif,
          },
        });
      }

      // 4. Create visitor-company relationship if it doesn't exist
      const existingRelation = await prisma.visitorCompany.findFirst({
        where: {
          visitor_id: visitor.id,
          company_id: company.id,
        },
      });

      if (!existingRelation) {
        await prisma.visitorCompany.create({
          data: {
            visitor_id: visitor.id,
            company_id: company.id,
          },
        });
      }

      // 5. Create vehicle only if it's a vehicular visit
      let vehicle = null;
      if (visit_type_id === 2 && vehicle_plate && vehicle_model) {
        vehicle = await prisma.vehicle.create({
          data: {
            plate: vehicle_plate,
            model: vehicle_model,
            brand: vehicle_brand || '',
            color: vehicle_color || '',
          },
        });
      }

      // 6. Create visit
      const visit = await prisma.visit.create({
        data: {
          visitor_id: visitor.id,
          visit_type_id,
          entity_id,
          administrative_unit_id: BigInt(administrative_unit_id),
          area_id: area_id ? BigInt(area_id) : null,
          direction_id: direction_id ? BigInt(direction_id) : null,
          visit_date: new Date(visit_date),
          visit_reason,
          ...(vehicle?.id ? { vehicle_id: vehicle.id } : {}),
        },
      });

      return {
        visitor,
        company,
        vehicle,
        visit,
      };
    });

    res.status(201).json(serializeBigInt(transaction));
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: 'Error during registration',
      details: error.message,
    });
  }
});

// Update visit exit date
router.patch('/exit/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedVisit = await prisma.visit.update({
      where: { id: parseInt(id) },
      data: {
        exit_date: new Date(),
      },
      include: {
        visitor: {
          include: {
            dnis_type: true,
            numbers_prefix: true,
            visitor_companies: {
              include: {
                company: true,
              },
            },
          },
        },
        visit_type: true,
        entity: true,
        administrative_unit: true,
        area: true,
        direction: true,
        vehicle: true,
      },
    });

    res.json(serializeBigInt(updatedVisit));
  } catch (error) {
    console.error('Error updating visit exit:', error);
    res.status(500).json({
      error: 'Error updating visit exit',
      details: error.message,
    });
  }
});

export default router;
