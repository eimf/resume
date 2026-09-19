import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { sendContactEmail, sendConfirmationEmail } from '../services/email.js';

export const contactRouter = Router();

// Wall 2 — Rate limit: cap submissions per IP so a bot can't flood the inbox.
// A real person sends one or two messages; a bot tries hundreds.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // max 3 submissions per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many messages sent. Please try again later.' },
});

contactRouter.post('/', contactLimiter, async (req, res) => {
  try {
    // `website` is the honeypot field (see Wall 1). Real users never see it,
    // so it stays empty; bots fill every field they find.
    const { name, email, subject, message, website } = req.body;

    // Wall 1 — Honeypot: if the hidden field is filled, it's a bot.
    // Return a fake success so the bot doesn't learn it was caught, and send nothing.
    if (website) {
      return res.json({ success: true, message: 'Message sent successfully.' });
    }

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        error: 'Name, email, and message are required.',
      });
    }

    if (name.length > 100) {
      return res.status(400).json({ error: 'Name must be under 100 characters.' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message must be under 5000 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address.' });
    }

    // Send the notification to the site owner first.
    await sendContactEmail({ name, email, subject, message });

    // Wall 4 — Backscatter fix: only send the "thank you" confirmation to the
    // submitter AFTER the request has passed the honeypot and validation and the
    // owner notification succeeded. This prevents the form from mailing arbitrary
    // addresses a bot might type in.
    await sendConfirmationEmail({ name, email, subject, message });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});
