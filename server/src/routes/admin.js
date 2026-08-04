import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { pool } from '../db/pool.js';
import { authMiddleware } from '../middleware/auth.js';
import { syncGitHubRepos } from '../services/github.js';

export const adminRouter = Router();

// Login
adminRouter.post('/auth/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });

    const result = await pool.query("SELECT value FROM settings WHERE key = 'admin_password_hash'");
    if (!result.rows.length) return res.status(500).json({ error: 'Admin not configured' });

    const valid = await bcrypt.compare(password, result.rows[0].value);
    if (!valid) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All routes below require auth
adminRouter.use(authMiddleware);

// GitHub sync
adminRouter.post('/sync/github', async (req, res) => {
  try {
    const result = await syncGitHubRepos();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update profile
adminRouter.put('/profile', async (req, res) => {
  try {
    const { name, headline, summary, location, email, website } = req.body;
    await pool.query(`
      UPDATE profile SET
        name = COALESCE($1, name),
        headline = COALESCE($2, headline),
        summary = COALESCE($3, summary),
        location = COALESCE($4, location),
        email = COALESCE($5, email),
        website = COALESCE($6, website),
        updated_at = NOW()
      WHERE id = 1
    `, [name, headline, summary, location, email, website]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project admin fields (featured, description, deploy)
adminRouter.patch('/projects/:id/feature', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [id];
    let idx = 1;

    if ('is_featured' in req.body) {
      fields.push(`is_featured = $${++idx}`);
      values.push(!!req.body.is_featured);
    }
    if ('custom_description' in req.body) {
      fields.push(`custom_description = $${++idx}`);
      values.push(req.body.custom_description || null);
    }
    if ('deploy_url' in req.body) {
      const url = (req.body.deploy_url || '').trim();
      fields.push(`deploy_url = $${++idx}`);
      values.push(url || null);
      // Clearing the URL also clears the live flag unless explicitly set below
      if (!url && !('is_deployed' in req.body)) {
        fields.push(`is_deployed = $${++idx}`);
        values.push(false);
      }
    }
    if ('is_deployed' in req.body) {
      fields.push(`is_deployed = $${++idx}`);
      values.push(!!req.body.is_deployed);
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    await pool.query(
      `UPDATE projects SET ${fields.join(', ')} WHERE id = $1`,
      values
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects (admin view - includes non-featured)
adminRouter.get('/projects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects ORDER BY last_updated DESC NULLS LAST');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
adminRouter.get('/dashboard', async (req, res) => {
  try {
    const [projects, lastSync] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE is_featured) as featured FROM projects'),
      pool.query("SELECT value FROM settings WHERE key = 'last_github_sync'"),
    ]);
    res.json({
      projects: projects.rows[0],
      lastGitHubSync: lastSync.rows[0]?.value || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
