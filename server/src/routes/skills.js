import { Router } from 'express';
import { pool } from '../db/pool.js';

export const skillsRouter = Router();

skillsRouter.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM skills
      ORDER BY
        CASE category
          WHEN 'Languages' THEN 1
          WHEN 'Frontend' THEN 2
          WHEN 'Backend' THEN 3
          WHEN 'Cloud & DevOps' THEN 4
          WHEN 'AI & Tooling' THEN 5
          WHEN 'Mobile' THEN 6
          WHEN 'Embedded & IoT' THEN 7
          WHEN 'Architecture' THEN 8
          ELSE 99
        END,
        sort_order ASC
    `);

    // Group by category (preserves SQL category order)
    const grouped = {};
    for (const skill of result.rows) {
      if (!grouped[skill.category]) {
        grouped[skill.category] = { name: skill.category, color: skill.color, skills: [] };
      }
      grouped[skill.category].skills.push(skill.name);
    }

    res.json(Object.values(grouped));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
