import nodemailer from 'npm:nodemailer';

const EMAIL_SENDER = Deno.env.get('EMAIL_SENDER');
const EMAIL_PASSWORD = Deno.env.get('EMAIL_PASSWORD');

if (!EMAIL_SENDER) {
  throw new Error('Missing required environment variable: EMAIL_SENDER');
}
if (!EMAIL_PASSWORD) {
  throw new Error('Missing required environment variable: EMAIL_PASSWORD');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_SENDER,
    pass: EMAIL_PASSWORD,
  },
});

const sendResetPassword = async (to: string, link: string) => {
  const html = `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <p>Hi,</p>
      <p>We received a request to reset your password.</p>
      <p><a href="${link}">Reset your password here</a></p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>— The Locals Team</p>
    </div>
  `;

  const info = await transporter.sendMail({
    from: `The Locals" <${EMAIL_SENDER}>`,
    to,
    subject: 'Reset your password',
    html,
  });

  console.log('Message sent:', info.messageId);
};

export const emailService = { sendResetPassword };
