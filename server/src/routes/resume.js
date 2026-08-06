import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { pool } from '../db/pool.js';

export const resumeRouter = Router();

resumeRouter.get('/pdf', async (req, res) => {
  try {
    // Fetch all data in parallel
    const [profileRes, experienceRes, educationRes, skillsRes, certificationsRes] = await Promise.all([
      pool.query('SELECT * FROM profile LIMIT 1'),
      pool.query('SELECT * FROM experience ORDER BY sort_order ASC'),
      pool.query('SELECT * FROM education ORDER BY sort_order ASC'),
      pool.query('SELECT * FROM skills ORDER BY category, sort_order ASC'),
      pool.query('SELECT * FROM certifications ORDER BY sort_order ASC'),
    ]);

    const profile = profileRes.rows[0];
    const experience = experienceRes.rows;
    const education = educationRes.rows;
    const skills = skillsRes.rows;
    const certifications = certificationsRes.rows;

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Create PDF
    const doc = new PDFDocument({
      size: 'LETTER',
      margins: { top: 40, bottom: 40, left: 45, right: 45 },
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${profile.name.replace(/\s+/g, '-')}-Resume.pdf"`);
    doc.pipe(res);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colors = {
      primary: '#1a1a2e',
      accent: '#2563eb',
      text: '#333333',
      muted: '#666666',
      light: '#999999',
      line: '#e2e8f0',
    };

    // === HEADER ===
    doc.fontSize(22).font('Helvetica-Bold').fillColor(colors.primary)
      .text(profile.name, { align: 'center' });

    doc.moveDown(0.2);
    doc.fontSize(10).font('Helvetica').fillColor(colors.accent)
      .text(profile.headline || 'Software Engineer', { align: 'center' });

    // Contact line
    doc.moveDown(0.3);
    const contactParts = [];
    if (profile.email) contactParts.push(profile.email);
    if (profile.location) contactParts.push(profile.location);
    if (profile.website) contactParts.push(profile.website);
    contactParts.push('io@ezeke.dev');
    if (profile.linkedin_url) contactParts.push('linkedin.com/in/ezzykeeel');
    if (profile.github_url) contactParts.push('github.com/eimf');

    doc.fontSize(8.5).font('Helvetica').fillColor(colors.muted)
      .text(contactParts.join('  •  '), { align: 'center' });

    doc.moveDown(0.5);
    drawLine(doc, colors.line);

    // === SUMMARY ===
    if (profile.summary) {
      doc.moveDown(0.4);
      sectionTitle(doc, 'SUMMARY', colors);
      doc.moveDown(0.2);
      doc.fontSize(9).font('Helvetica').fillColor(colors.text)
        .text(profile.summary, { lineGap: 2 });
      doc.moveDown(0.4);
      drawLine(doc, colors.line);
    }

    // === EXPERIENCE ===
    if (experience.length > 0) {
      doc.moveDown(0.4);
      sectionTitle(doc, 'EXPERIENCE', colors);

      for (const job of experience.slice(0, 5)) {
        doc.moveDown(0.3);
        // Role and company on same line
        doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.primary)
          .text(job.role, { continued: true });
        doc.fontSize(10).font('Helvetica').fillColor(colors.muted)
          .text(`  —  ${job.company}`);

        // Period
        doc.fontSize(8).font('Helvetica').fillColor(colors.light)
          .text(job.period || formatPeriod(job.start_date, job.end_date, job.current));

        // Highlights (bullet points)
        if (job.highlights && job.highlights.length > 0) {
          doc.moveDown(0.15);
          for (const highlight of job.highlights.slice(0, 3)) {
            doc.fontSize(8.5).font('Helvetica').fillColor(colors.text)
              .text(`•  ${highlight}`, { indent: 8, lineGap: 1.5 });
          }
        }
      }

      doc.moveDown(0.4);
      drawLine(doc, colors.line);
    }

    // === SKILLS ===
    if (skills.length > 0) {
      doc.moveDown(0.4);
      sectionTitle(doc, 'SKILLS', colors);
      doc.moveDown(0.2);

      // Group by category
      const grouped = skills.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s.name);
        return acc;
      }, {});

      for (const [category, names] of Object.entries(grouped)) {
        doc.fontSize(8.5).font('Helvetica-Bold').fillColor(colors.primary)
          .text(`${category}: `, { continued: true });
        doc.font('Helvetica').fillColor(colors.text)
          .text(names.join(', '));
      }

      doc.moveDown(0.4);
      drawLine(doc, colors.line);
    }

    // === EDUCATION ===
    if (education.length > 0) {
      doc.moveDown(0.4);
      sectionTitle(doc, 'EDUCATION', colors);
      doc.moveDown(0.2);

      for (const edu of education) {
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor(colors.primary)
          .text(edu.institution, { continued: true });

        const years = edu.start_year && edu.end_year
          ? `  (${edu.start_year}–${edu.end_year})`
          : edu.start_year ? `  (${edu.start_year})` : '';

        doc.fontSize(8).font('Helvetica').fillColor(colors.light)
          .text(years);

        if (edu.degree || edu.field) {
          doc.fontSize(8.5).font('Helvetica').fillColor(colors.text)
            .text([edu.degree, edu.field].filter(Boolean).join(' in '));
        }
        doc.moveDown(0.2);
      }

      doc.moveDown(0.2);
      drawLine(doc, colors.line);
    }

    // === CERTIFICATIONS ===
    if (certifications.length > 0) {
      doc.moveDown(0.4);
      sectionTitle(doc, 'CERTIFICATIONS', colors);
      doc.moveDown(0.2);

      const certLines = certifications.slice(0, 6).map((c) => {
        const parts = [c.name];
        if (c.authority) parts.push(`(${c.authority})`);
        if (c.date) parts.push(`— ${c.date}`);
        return parts.join(' ');
      });

      doc.fontSize(8.5).font('Helvetica').fillColor(colors.text)
        .text(certLines.join('\n'), { lineGap: 2 });
    }

    // Finalize
    doc.end();
  } catch (err) {
    console.error('PDF generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate resume PDF' });
  }
});

function sectionTitle(doc, title, colors) {
  doc.fontSize(10).font('Helvetica-Bold').fillColor(colors.accent)
    .text(title, { characterSpacing: 1.5 });
}

function drawLine(doc, color) {
  const y = doc.y;
  doc.strokeColor(color).lineWidth(0.5)
    .moveTo(doc.page.margins.left, y)
    .lineTo(doc.page.width - doc.page.margins.right, y)
    .stroke();
}

function formatPeriod(start, end, current) {
  if (!start) return '';
  const s = new Date(start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (current) return `${s} — Present`;
  if (!end) return s;
  const e = new Date(end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${s} — ${e}`;
}
