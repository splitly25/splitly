import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: parseInt(env.SMTP_PORT) || 587,
  secure: parseInt(env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  // Additional options for better compatibility
  tls: {
    // Do not fail on invalid certificates (for development)
    rejectUnauthorized: false,
  },
  // Connection timeout
  connectionTimeout: 10000,
  // Greeting timeout
  greetingTimeout: 10000,
  // Socket timeout
  socketTimeout: 10000,
})

const sendEmail = async (to, subject, textContent, htmlContent) => {
  const mailOptions = {
    from: {
      name: env.ADMIN_EMAIL_NAME,
      address: env.ADMIN_EMAIL_ADDRESS,
    },
    to: to,
    subject: subject,
    text: textContent,
    html: htmlContent,
  }

  return await transporter.sendMail(mailOptions)
}

const verifyConnection = async () => {
  try {
    await transporter.verify()
    console.log('SMTP server is ready to send emails')
    return true
  } catch (error) {
    console.error('SMTP connection error:', error.message)
    return false
  }
}

export const NodemailerProvider = {
  sendEmail,
  verifyConnection,
}
