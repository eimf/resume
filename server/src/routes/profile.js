import { Router } from 'express';
import { pool } from '../db/pool.js';

export const profileRouter = Router();

profileRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM profile LIMIT 1');
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
