/* eslint-disable no-useless-catch */
/**
 * Email Service
 * Simple email utility using nodemailer
 */

import { env } from '~/config/environment.js'

/**
 * Send payment notification email
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} - Success status
 */
export const sendPaymentEmail = async ({ recipientEmail, recipientName, payerName, amount, note }) => {
  try {
    // Only send email if SMTP is configured
    if (!env.SMTP_USER || !env.SMTP_PASSWORD || !env.ADMIN_EMAIL_ADDRESS) {
      return false
    }

    // Import nodemailer only when needed
    const nodemailer = await import('nodemailer')
    
    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(env.SMTP_PORT) || 587,
      secure: parseInt(env.SMTP_PORT) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD
      }
    })

    // Simple HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #574D98 0%, #6b5fa8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .amount { font-size: 32px; font-weight: bold; color: #574D98; margin: 20px 0; }
    .note { background: white; padding: 15px; border-left: 4px solid #574D98; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 Thông báo thanh toán</h1>
    </div>
    <div class="content">
      <p>Xin chào <strong>${recipientName}</strong>,</p>
      <p><strong>${payerName}</strong> vừa thực hiện thanh toán cho bạn trên Splitly.</p>
      <div class="amount">${amount.toLocaleString('vi-VN')}₫</div>
      ${note ? `<div class="note"><strong>Ghi chú:</strong> ${note}</div>` : ''}
      <p>Vui lòng kiểm tra và xác nhận khi bạn đã nhận được tiền.</p>
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Trân trọng,<br>
        <strong>Splitly Team</strong>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim()

    // Send email
    await transporter.sendMail({
      from: `"${env.ADMIN_EMAIL_NAME || 'Splitly'}" <${env.ADMIN_EMAIL_ADDRESS}>`,
      to: recipientEmail,
      subject: `💰 ${payerName} đã thanh toán cho bạn`,
      html: htmlContent
    })

    return true
  } catch (error) {
    return false
  }
}
