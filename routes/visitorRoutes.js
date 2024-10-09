import express from 'express';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './authRoutes.js';

const router = express.Router();

const prisma = new PrismaClient();

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

export default router;
