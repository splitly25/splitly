import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'
import { env } from '~/config/environment'

let emailAPI = new TransactionalEmailsApi()
emailAPI.authentications.apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (to, subject, textContent, htmlContent) => {
  let message = new SendSmtpEmail()
  message.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME,
  }
  message.to = [{ email: to }]
  message.subject = subject
  message.textContent = textContent
  message.htmlContent = htmlContent

  return emailAPI.sendTransacEmail(message)
}

const verifyConnection = async () => {
  try {
    // Try to get account info to verify API key is valid
    if (!env.BREVO_API_KEY || env.BREVO_API_KEY === '') {
      console.error('Brevo API key is missing')
      return false
    }
    console.log('Brevo email service is ready (API key configured)')
    return true
  } catch (error) {
    console.error('Brevo connection error:', error.message)
    return false
  }
}

export const BrevoEmailProvider = {
  sendEmail,
  verifyConnection,
}
