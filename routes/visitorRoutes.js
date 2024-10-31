import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

const prisma = new PrismaClient();

// Validation middleware
const validateRegistration = (req, res, next) => {
  const requiredFields = [
    'dni_type_id',
    'dni_number',
    'firstName',
    'lastName',
    'contact_number_prefix_id',
    'contact_number',
    'enterpriseName',
    'visit_type_id',
    'entity_id',
    'administrative_unit_id',
    'area_id',
    'direction_id',
    'visit_date',
    'exit_date',
    'entry_type',
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

  // Validate vehicle data consistency
  if (req.body.vehicle_plate || req.body.vehicle_model) {
    if (!req.body.vehicle_plate || !req.body.vehicle_model) {
      return res.status(400).json({
        error: 'Incomplete vehicle information',
        message: 'Both plate and model are required when registering a vehicle',
      });
    }
  }

  next();
};

// Get all visitors
router.get('/', async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

        // Visit data
        visit_type_id,
        entity_id,
        administrative_unit_id,
        area_id,
        direction_id,
        visit_date,
        exit_date,
        entry_type,
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

      // 3. Create or find enterprise
      let company = await prisma.company.findFirst({
        where: { name: enterpriseName },
      });

      if (!company) {
        company = await prisma.company.create({
          data: { name: enterpriseName },
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

      // 5. Create vehicle if data is provided
      let vehicle = null;
      if (vehicle_plate && vehicle_model) {
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
          area_id: BigInt(area_id),
          direction_id: BigInt(direction_id),
          visit_date: new Date(visit_date),
          exit_date: new Date(exit_date),
          entry_type,
          visit_reason,
          ...(vehicle && { vehicle_id: vehicle.id }), // Only add vehicle_id if vehicle exists
        },
      });

      return {
        visitor,
        company,
        vehicle,
        visit,
      };
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({
      error: 'Error during registration',
      details: error.message,
    });
  }
});

export default router;
