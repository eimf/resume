import { Router } from 'express';
import { sendContactEmail, sendConfirmationEmail } from '../services/email.js';

export const contactRouter = Router();

contactRouter.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

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

    await sendContactEmail({ name, email, subject, message });
    await sendConfirmationEmail({ name, email, subject, message });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});
