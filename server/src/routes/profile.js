import { Router } from 'express';
import { pool } from '../db/pool.js';

export const profileRouter = Router();

profileRouter.get('/', async (req, res) => {
  try {
    const [profileResult, languagesResult] = await Promise.all([
      pool.query('SELECT * FROM profile LIMIT 1'),
      pool.query("SELECT value FROM settings WHERE key = 'spoken_languages'"),
    ]);

    const profile = profileResult.rows[0] || null;
    if (!profile) return res.json(null);

    let spokenLanguages = [];
    try {
      spokenLanguages = JSON.parse(languagesResult.rows[0]?.value || '[]');
    } catch {
      spokenLanguages = [];
    }

    res.json({ ...profile, spoken_languages: spokenLanguages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
