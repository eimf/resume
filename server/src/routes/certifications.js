import { Router } from 'express';
import { pool } from '../db/pool.js';

export const certificationsRouter = Router();

certificationsRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM certifications ORDER BY sort_order ASC, id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
