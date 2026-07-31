import { Router } from 'express';
import { pool } from '../db/pool.js';

export const experienceRouter = Router();

experienceRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM experience ORDER BY sort_order ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
