import { Router } from 'express';
import { pool } from '../db/pool.js';

export const skillsRouter = Router();

skillsRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY category, sort_order ASC');

    // Group by category
    const grouped = result.rows.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = { name: skill.category, color: skill.color, skills: [] };
      }
      acc[skill.category].skills.push(skill.name);
      return acc;
    }, {});

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
