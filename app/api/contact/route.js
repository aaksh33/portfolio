import axios from "axios";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// ✅ Create and configure Nodemailer transporter (no need for `service` if you already use host/port)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

// ✅ Telegram message sender
async function sendTelegramMessage(token, chat_id, message) {
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await axios.post(url, { text: message, chat_id });
    return res.data.ok;
  } catch (error) {
    console.error(
      "Error sending Telegram message:",
      error.response?.data || error.message
    );
    return false;
  }
}

// ✅ HTML email template
const generateEmailTemplate = (name, email, userMessage) => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// ✅ Send Email via Nodemailer
async function sendEmail({ name, email, message: userMessage }, plainTextMsg) {
  const mailOptions = {
    from: `"Portfolio" <${process.env.EMAIL_ADDRESS}>`, // better formatting
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From ${name}`,
    text: plainTextMsg,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error while sending email:", error.message);
    return false;
  }
}

// ✅ API Route (works in Next.js 13/14 App Router)
export async function POST(request) {
  try {
    const payload = await request.json();
    const { name, email, message: userMessage } = payload;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat_id) {
      return NextResponse.json(
        { success: false, message: "Missing Telegram credentials." },
        { status: 400 }
      );
    }

    const plainTextMsg = `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`;

    // Run Telegram + Email in parallel 🚀
    const [telegramSuccess, emailSuccess] = await Promise.all([
      sendTelegramMessage(token, chat_id, plainTextMsg),
      sendEmail(payload, plainTextMsg),
    ]);

    if (telegramSuccess && emailSuccess) {
      return NextResponse.json(
        { success: true, message: "Message + email sent successfully!" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to send message or email." },
      { status: 500 }
    );
  } catch (error) {
    console.error("API Error:", error.message);
    return NextResponse.json(
      { success: false, message: "Server error occurred." },
      { status: 500 }
    );
  }
}
