import nodemailer from "nodemailer";

export interface SupportEmailPayload {
  ticketId: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

export async function sendSupportNotificationEmail(payload: SupportEmailPayload) {
  const targetEmail = process.env.SUPPORT_EMAIL || "support.code404@gmail.com";

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"Code404 Support Bot" <${targetEmail}>`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1117; color: #e6edf3; padding: 24px; border-radius: 8px; border: 1px solid #30363d;">
      <div style="border-bottom: 2px solid #238636; padding-bottom: 12px; margin-bottom: 20px;">
        <h2 style="color: #2f81f7; margin: 0;">Code404 Support Request Received</h2>
        <p style="color: #8b949e; font-size: 13px; margin-top: 4px;">Ticket ID: ${payload.ticketId}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #8b949e; width: 120px;"><strong>Submitter:</strong></td>
          <td style="padding: 8px 0; color: #e6edf3;">${payload.name} (${payload.email})</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8b949e;"><strong>Subject:</strong></td>
          <td style="padding: 8px 0; color: #e6edf3; font-weight: bold;">${payload.subject}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #8b949e;"><strong>Submitted At:</strong></td>
          <td style="padding: 8px 0; color: #e6edf3;">${new Date(payload.createdAt).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })} IST</td>
        </tr>
      </table>

      <div style="background-color: #161b22; padding: 16px; border-radius: 6px; border-left: 4px solid #2f81f7; margin-bottom: 20px;">
        <h4 style="margin-top: 0; color: #8b949e; font-size: 12px; text-transform: uppercase;">Message Body:</h4>
        <p style="white-space: pre-wrap; margin: 0; font-size: 14px; line-height: 1.6;">${payload.message}</p>
      </div>

      <div style="border-top: 1px solid #30363d; margin-top: 24px; padding-top: 16px; font-size: 12px; color: #8b949e; text-align: center;">
        SkillForge by Code404 &bull; Support Notification System &bull; Target: ${targetEmail}
      </div>
    </div>
  `;

  // Log notification to console for diagnostic visibility
  console.log(`[Code404 Support Notification] Ticket ${payload.ticketId} submitted by ${payload.email} (Target: ${targetEmail})`);

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(`[Code404 Support Notification] SMTP environment variables not configured. Safe fallback activated. Email payload prepared for ${targetEmail}.`);
    return { success: true, delivered: false, note: "SMTP not configured, payload logged to support audit." };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: smtpFrom,
      to: targetEmail,
      replyTo: payload.email,
      subject: `[Code404 Support #${payload.ticketId.slice(0, 8)}] ${payload.subject}`,
      html: htmlContent,
    });

    console.log(`[Code404 Support Notification] Email sent successfully to ${targetEmail}`);
    return { success: true, delivered: true };
  } catch (error) {
    console.error(`[Code404 Support Notification Error] Failed to send email to ${targetEmail}:`, error);
    // Return success: true so API submission DB record remains safe
    return { success: true, delivered: false, error: String(error) };
  }
}
