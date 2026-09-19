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

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;
// Comma-separated list of frontend hostnames the widget is allowed to load on.
// Production MUST NOT include localhost/127.0.0.1.
const EXPECTED_HOSTNAMES = new Set(
  (process.env.TURNSTILE_HOSTNAMES ?? '')
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
);

/**
 * Wall 3 — Verify a Cloudflare Turnstile token server-side.
 * Browser -> our backend -> siteverify. Never call siteverify from the browser.
 * Returns true only when Cloudflare confirms the token, the action matches, and
 * the frontend hostname is on our allowlist.
 */
async function verifyTurnstile(token, clientIp) {
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) {
    return false;
  }
  if (EXPECTED_HOSTNAMES.size === 0) {
    console.error('Turnstile: TURNSTILE_HOSTNAMES is not configured; rejecting.');
    return false;
  }

  let result;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: clientIp,
      }),
    });
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = await r.json();
  } catch (err) {
    console.error('Turnstile verify failed:', err.message);
    return false;
  }

  return (
    result.success === true &&
    result.action === 'contact' &&
    EXPECTED_HOSTNAMES.has(result.hostname)
  );
}

contactRouter.post('/', contactLimiter, async (req, res) => {
  try {
    // `website` is the honeypot field (see Wall 1). Real users never see it,
    // so it stays empty; bots fill every field they find.
    const { name, email, subject, message, website } = req.body;
    const turnstileToken = req.body['cf-turnstile-response'];

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

    // Wall 3 — Turnstile: verify the bot-challenge token before any side effect.
    // Only enforced when a secret is configured, so local dev without keys still works.
    if (TURNSTILE_SECRET) {
      const ok = await verifyTurnstile(turnstileToken, req.ip);
      if (!ok) {
        return res.status(403).json({ error: 'Verification failed. Please try again.' });
      }
    }

    // Send the notification to the site owner first.
    await sendContactEmail({ name, email, subject, message });

    // Wall 4 — Backscatter fix: only send the "thank you" confirmation to the
    // submitter AFTER the request has passed the honeypot, validation, and the
    // bot challenge, and the owner notification succeeded. This prevents the form
    // from mailing arbitrary addresses a bot might type in.
    await sendConfirmationEmail({ name, email, subject, message });

    res.json({ success: true, message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});
