import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './db/pool.js';
import { profileRouter } from './routes/profile.js';
import { reposRouter } from './routes/repos.js';
import { experienceRouter } from './routes/experience.js';
import { educationRouter } from './routes/education.js';
import { skillsRouter } from './routes/skills.js';
import { adminRouter } from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5174' }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public API routes
app.use('/api/profile', profileRouter);
app.use('/api/repos', reposRouter);
app.use('/api/experience', experienceRouter);
app.use('/api/education', educationRouter);
app.use('/api/skills', skillsRouter);

// Admin routes (auth required)
app.use('/api/admin', adminRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  pool.query('SELECT NOW()').then(() => {
    console.log('✅ Database connected');
  }).catch((err) => {
    console.error('❌ Database connection failed:', err.message);
  });
});
