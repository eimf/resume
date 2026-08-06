import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_EMAIL || 'io@ezeke.dev';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@ezeke.dev';

/**
 * Send a contact form email via Resend.
 * @param {{ name: string, email: string, subject?: string, message: string }} data
 */
export async function sendContactEmail({ name, email, subject, message }) {
  const emailSubject = subject || `New message from ${name}`;

  const { data, error } = await resend.emails.send({
    from: `${name} via Portfolio <${FROM_EMAIL}>`,
    to: [TO_EMAIL],
    replyTo: email,
    subject: emailSubject,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #58a6ff; padding-bottom: 8px;">
          New Contact Form Message
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555; width: 80px;">From:</td>
            <td style="padding: 8px 12px;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555;">Email:</td>
            <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          ${subject ? `<tr>
            <td style="padding: 8px 12px; font-weight: 600; color: #555;">Subject:</td>
            <td style="padding: 8px 12px;">${subject}</td>
          </tr>` : ''}
        </table>
        <div style="background: #f6f8fa; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 24px;">
          Sent from your portfolio contact form at ezeke.dev
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send email');
  }

  return data;
}

/**
 * Send a confirmation email to the person who submitted the contact form.
 * @param {{ name: string, email: string, subject?: string, message: string }} data
 */
export async function sendConfirmationEmail({ name, email, subject, message }) {
  const { data, error } = await resend.emails.send({
    from: `Ezequiel Lopez <${FROM_EMAIL}>`,
    to: [email],
    replyTo: TO_EMAIL,
    subject: 'Thanks for reaching out!',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1a1a2e; border-bottom: 2px solid #58a6ff; padding-bottom: 8px;">
          Message Received
        </h2>
        <p style="color: #333; line-height: 1.6;">
          Hey ${name},
        </p>
        <p style="color: #333; line-height: 1.6;">
          Thanks for reaching out! I've received your message and will get back to you as soon as I can.
        </p>
        <p style="color: #333; line-height: 1.6;">
          Here's a copy of what you sent:
        </p>
        ${subject ? `<p style="color: #555; font-size: 14px;"><strong>Subject:</strong> ${subject}</p>` : ''}
        <div style="background: #f6f8fa; border-radius: 8px; padding: 16px; margin: 16px 0; border-left: 3px solid #58a6ff;">
          <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; color: #444; font-size: 14px;">${message}</p>
        </div>
        <p style="color: #333; line-height: 1.6;">
          — Ezequiel
        </p>
        <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 24px 0;" />
        <p style="color: #888; font-size: 12px;">
          You can reply directly to this email to reach me at io@ezeke.dev
        </p>
      </div>
    `,
  });

  if (error) {
    console.error('Confirmation email error:', error.message);
    // Don't throw — confirmation is non-critical
  }

  return data;
}
