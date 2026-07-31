import { Router } from 'express';
import { pool } from '../db/pool.js';

export const educationRouter = Router();

educationRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM education ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
