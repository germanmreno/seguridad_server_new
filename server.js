import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import visitorRoutes from './routes/visitorRoutes.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
