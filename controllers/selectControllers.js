import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getEntities = async (req, res) => {
  try {
    const entities = await prisma.entity.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.json(entities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAdministrativeUnitsByEntity = async (req, res) => {
  const { entityId } = req.params;
  try {
    const units = await prisma.administrativeUnit.findMany({
      where: {
        entity_id: parseInt(entityId),
      },
      select: {
        id: true,
        name: true,
      },
    });
    // Convert BigInt to String
    const serializedUnits = units.map((unit) => ({
      ...unit,
      id: unit.id.toString(),
    }));
    res.json(serializedUnits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDirectionsByUnit = async (req, res) => {
  const { unitId } = req.params;
  try {
    console.log('Fetching directions for unit:', unitId); // Debug log

    const directions = await prisma.direction.findMany({
      where: {
        administrative_unit_id: BigInt(unitId.toString()),
      },
      select: {
        id: true,
        name: true,
        administrative_unit_id: true,
      },
    });

    console.log('Found directions:', directions); // Debug log

    // Convert BigInt to String for JSON serialization
    const serializedDirections = directions.map((direction) => ({
      ...direction,
      id: direction.id.toString(),
      administrative_unit_id: direction.administrative_unit_id.toString(),
    }));

    res.json(serializedDirections);
  } catch (error) {
    console.error('Error in getDirectionsByUnit:', error); // Debug log
    res.status(500).json({
      error: error.message,
      details: 'Error fetching directions',
    });
  }
};

export const getAreasByParent = async (req, res) => {
  const { parentId } = req.params;
  const { type } = req.query; // 'unit' or 'direction'

  try {
    console.log(`Fetching areas for ${type} with ID:`, parentId);

    let areas = [];
    const parentBigInt = BigInt(parentId.toString());

    if (type === 'unit') {
      // Get areas directly related to the administrative unit
      areas = await prisma.area.findMany({
        where: {
          administrative_unit_id: parentBigInt,
        },
        select: {
          id: true,
          name: true,
          administrative_unit_id: true,
          direction_id: true,
          administrative_unit: {
            select: {
              name: true,
            },
          },
        },
      });

      // Get areas related to directions under this administrative unit
      const directionsUnderUnit = await prisma.direction.findMany({
        where: {
          administrative_unit_id: parentBigInt,
        },
        select: {
          id: true,
        },
      });

      const directionIds = directionsUnderUnit.map((dir) => dir.id);

      if (directionIds.length > 0) {
        const areasUnderDirections = await prisma.area.findMany({
          where: {
            direction_id: {
              in: directionIds,
            },
          },
          select: {
            id: true,
            name: true,
            administrative_unit_id: true,
            direction_id: true,
            direction: {
              select: {
                name: true,
              },
            },
          },
        });

        areas = [...areas, ...areasUnderDirections];
      }
    } else if (type === 'direction') {
      // Get only areas related to the specific direction
      areas = await prisma.area.findMany({
        where: {
          direction_id: parentBigInt,
        },
        select: {
          id: true,
          name: true,
          administrative_unit_id: true,
          direction_id: true,
          direction: {
            select: {
              name: true,
            },
          },
        },
      });
    } else {
      return res.status(400).json({
        error: 'Invalid type parameter. Must be either "unit" or "direction"',
      });
    }

    console.log(`Found ${areas.length} areas`);

    // Convert BigInt to String for JSON serialization
    const serializedAreas = areas.map((area) => ({
      ...area,
      id: area.id.toString(),
      administrative_unit_id: area.administrative_unit_id?.toString() || null,
      direction_id: area.direction_id?.toString() || null,
    }));

    res.json(serializedAreas);
  } catch (error) {
    console.error('Error in getAreasByParent:', error);
    res.status(500).json({
      error: error.message,
      details: 'Error fetching areas',
    });
  }
};
