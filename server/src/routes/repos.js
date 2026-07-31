import { Router } from 'express';
import { pool } from '../db/pool.js';

export const reposRouter = Router();

reposRouter.get('/', async (req, res) => {
  try {
    // Show featured projects first, then fall back to most recently updated
    const result = await pool.query(
      `SELECT * FROM projects 
       ORDER BY is_featured DESC, stars DESC, last_updated DESC NULLS LAST
       LIMIT 9`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
