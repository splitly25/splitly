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
export const sendPaymentEmail = async ({ recipientEmail, recipientName, payerName, amount, note, confirmationToken }) => {
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

    // Modern HTML email template matching UI style
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1e293b;
      margin: 0;
      padding: 0;
      width: 100%;
    }
    .email-wrapper {
      background-color: #e2e8f0;
      padding: 40px 20px;
      width: 100%;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .header { 
      background: linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%);
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header .icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content { 
      background: #ffffff;
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      color: #475569;
      margin-bottom: 20px;
    }
    .message {
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    .amount-card { 
      background: linear-gradient(135deg, rgba(239, 154, 154, 0.1) 0%, rgba(206, 147, 216, 0.1) 100%);
      border: 2px solid rgba(239, 154, 154, 0.3);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .amount-label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .amount { 
      font-size: 42px; 
      font-weight: 700;
      background: linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 10px 0;
    }
    .note { 
      background: #f8fafc;
      padding: 20px;
      border-left: 4px solid #ce93d8;
      border-radius: 12px;
      margin: 25px 0;
    }
    .note-label {
      font-weight: 600;
      color: #475569;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .note-content {
      color: #64748b;
      font-size: 15px;
    }
    .action-text {
      font-size: 16px;
      color: #475569;
      margin: 25px 0;
      text-align: center;
    }
    .footer {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 14px;
      text-align: center;
    }
    .footer strong {
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="icon">💰</div>
        <h1>Thông báo thanh toán</h1>
      </div>
      <div class="content">
      <p class="greeting">Xin chào <strong>${recipientName}</strong>,</p>
      <p class="message">
        <strong>${payerName}</strong> vừa thực hiện thanh toán cho bạn trên Splitly.
      </p>
      
      <div class="amount-card">
        <div class="amount-label">Số tiền thanh toán</div>
        <div class="amount">${amount.toLocaleString('vi-VN')}₫</div>
      </div>
      
      ${note ? `
      <div class="note">
        <div class="note-label">📝 Ghi chú</div>
        <div class="note-content">${note}</div>
      </div>
      ` : ''}
      
      <p class="action-text">
        Vui lòng kiểm tra và xác nhận khi bạn đã nhận được tiền.
      </p>
      
      ${confirmationToken ? `
      <div style="text-align: center; margin: 30px 0;">
        <a href="${env.WEB_URL || 'http://localhost:5173'}/payment/confirm?token=${confirmationToken}"
           style="display: inline-block;
                  padding: 16px 40px;
                  background: linear-gradient(135deg, #ef9a9a 0%, #ce93d8 100%);
                  color: white;
                  text-decoration: none;
                  border-radius: 18px;
                  font-weight: 600;
                  font-size: 16px;
                  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          ✓ Xác nhận đã nhận tiền
        </a>
      </div>
      ` : ''}
      
      <div class="footer">
        <p>Trân trọng,<br><strong>Splitly Team</strong></p>
      </div>
    </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    // Send email
    await transporter.sendMail({
      from: `"${env.ADMIN_EMAIL_NAME || 'Splitly'}" <${env.ADMIN_EMAIL_ADDRESS}>`,
      to: recipientEmail,
      subject: `💰 ${payerName} đã thanh toán cho bạn qua Splitly`,
      html: htmlContent
    })

    return true
  } catch (error) {
    return false
  }
}

/**
 * Send payment response notification email to payer
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} - Success status
 */
export const sendPaymentResponseEmail = async ({ payerEmail, payerName, recipientName, amount, isConfirmed }) => {
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

    const statusIcon = isConfirmed ? '✅' : '❌'
    const statusText = isConfirmed ? 'Đã nhận được' : 'Chưa nhận được'
    const statusColor = isConfirmed ? '#10b981' : '#ef4444'
    const statusGradient = isConfirmed 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
    const message = isConfirmed
      ? `<strong>${recipientName}</strong> đã xác nhận nhận được khoản thanh toán từ bạn.`
      : `<strong>${recipientName}</strong> đã xác nhận <strong>không</strong> nhận được khoản thanh toán. Vui lòng kiểm tra lại.`

    // Modern HTML email template
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1e293b;
      margin: 0;
      padding: 0;
      width: 100%;
    }
    .email-wrapper {
      background-color: #e2e8f0;
      padding: 40px 20px;
      width: 100%;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .header { 
      background: ${statusGradient};
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header .icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content { 
      background: #ffffff;
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      color: #475569;
      margin-bottom: 20px;
    }
    .message {
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    .status-card { 
      background: ${isConfirmed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
      border: 2px solid ${isConfirmed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .status-label {
      font-size: 14px;
      color: #64748b;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .status { 
      font-size: 24px; 
      font-weight: 700;
      color: ${statusColor};
      margin: 10px 0;
    }
    .amount { 
      font-size: 36px; 
      font-weight: 700;
      background: ${statusGradient};
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin: 15px 0;
    }
    .action-text {
      font-size: 16px;
      color: #475569;
      margin: 25px 0;
      text-align: center;
    }
    .login-button {
      text-align: center;
      margin: 30px 0;
    }
    .login-button a {
      display: inline-block;
      padding: 16px 40px;
      background: ${statusGradient};
      color: white;
      text-decoration: none;
      border-radius: 18px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .footer {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 14px;
      text-align: center;
    }
    .footer strong {
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="icon">${statusIcon}</div>
        <h1>Thông báo xác nhận thanh toán</h1>
      </div>
      <div class="content">
        <p class="greeting">Xin chào <strong>${payerName}</strong>,</p>
      <p class="message">
        ${message}
      </p>
      
      <div class="status-card">
        <div class="status-label">Trạng thái</div>
        <div class="status">${statusIcon} ${statusText}</div>
        <div class="status-label" style="margin-top: 20px;">Số tiền</div>
        <div class="amount">${amount.toLocaleString('vi-VN')}₫</div>
      </div>
      
      <p class="action-text">
        ${isConfirmed 
          ? 'Khoản thanh toán đã được xác nhận thành công. Cảm ơn bạn đã sử dụng Splitly!'
          : 'Vui lòng liên hệ trực tiếp với người nhận để kiểm tra thông tin thanh toán.'}
      </p>
      
      <div class="login-button">
        <a href="${env.WEB_URL || 'http://localhost:5173'}/login">
          Đăng nhập để xem chi tiết
        </a>
      </div>
      
      <div class="footer">
        <p>Trân trọng,<br><strong>Splitly Team</strong></p>
      </div>
    </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    // Send email
    await transporter.sendMail({
      from: `"${env.ADMIN_EMAIL_NAME || 'Splitly'}" <${env.ADMIN_EMAIL_ADDRESS}>`,
      to: payerEmail,
      subject: `${statusIcon} ${recipientName} ${statusText} thanh toán qua Splitly`,
      html: htmlContent
    })

    console.log(`Payment response email sent successfully to ${payerEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send payment response email:', error)
    return false
  }
}

/**
 * Send payment reminder email to debtor
 * @param {Object} params - Email parameters
 * @returns {Promise<boolean>} - Success status
 */
export const sendPaymentReminderEmail = async ({ debtorEmail, debtorName, creditorName, bills, creditorBankName, creditorBankAccount, reminderToken }) => {
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

    // Calculate total amount
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)

    // Generate QR code URL if bank info is available
    let qrCodeUrl = ''
    if (creditorBankName && creditorBankAccount && totalAmount > 0) {
      qrCodeUrl = `https://img.vietqr.io/image/${creditorBankName}-${creditorBankAccount}-qr_only.png?amount=${totalAmount}`
    }

    // Modern HTML email template for reminder
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      line-height: 1.6; 
      color: #1e293b;
      margin: 0;
      padding: 0;
      width: 100%;
    }
    .email-wrapper {
      background-color: #e2e8f0;
      padding: 40px 20px;
      width: 100%;
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    .header { 
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white; 
      padding: 40px 30px; 
      text-align: center;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .header .icon {
      font-size: 48px;
      margin-bottom: 10px;
    }
    .content { 
      background: #ffffff;
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      color: #475569;
      margin-bottom: 20px;
    }
    .message {
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 30px;
      line-height: 1.8;
    }
    .bills-list {
      background: #f8fafc;
      border-radius: 16px;
      padding: 20px;
      margin: 25px 0;
    }
    .bills-table {
      width: 100%;
      border-collapse: collapse;
    }
    .bill-row {
      border-bottom: 1px solid #e2e8f0;
    }
    .bill-row:last-child {
      border-bottom: none;
    }
    .bill-name {
      font-weight: 600;
      color: #1e293b;
      text-align: left;
      padding: 12px 0;
    }
    .bill-amount {
      font-weight: 700;
      color: #f59e0b;
      text-align: right;
      padding: 12px 0;
    }
    .total-card { 
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%);
      border: 2px solid rgba(251, 191, 36, 0.3);
      border-radius: 20px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
      color: #1e293b;
    }
    .total-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .total-amount { 
      font-size: 36px; 
      font-weight: 700;
      margin: 10px 0;
    }
    .action-text {
      font-size: 16px;
      color: #475569;
      margin: 25px 0;
      text-align: center;
    }
    .bank-info {
      background: #f5f5f5;
      border-radius: 18px;
      padding: 20px;
      margin: 25px 0;
    }
    .bank-info-title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 12px;
    }
    .bank-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
      table-layout: auto;
    }
    .bank-table td {
      padding: 4px 0;
    }
    .bank-label {
      font-size: 14px;
      color: #64748b;
      padding-right: 2px;
      white-space: nowrap;
    }
    .bank-value {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
    }
    .qr-section {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }
    .qr-code {
      width: 200px;
      height: 200px;
      object-fit: contain;
      border-radius: 8px;
      background: white;
      padding: 8px;
    }
    .login-button {
      text-align: center;
      margin: 30px 0;
    }
    .login-button a {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: white;
      text-decoration: none;
      border-radius: 18px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .footer {
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e2e8f0;
      color: #94a3b8;
      font-size: 14px;
      text-align: center;
    }
    .footer strong {
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="container">
      <div class="header">
        <div class="icon">⏰</div>
        <h1>Nhắc nhở thanh toán</h1>
      </div>
      <div class="content">
        <p class="greeting">Xin chào <strong>${debtorName}</strong>,</p>
        <p class="message">
          <strong>${creditorName}</strong> muốn nhắc nhở bạn về các khoản nợ chưa thanh toán trên Splitly.
        </p>
        
        <div class="bills-list">
          <table class="bills-table">
            ${bills.map(bill => `
              <tr class="bill-row">
                <td class="bill-name">${bill.billName}</td>
                <td class="bill-amount">${bill.amount.toLocaleString('vi-VN')}₫</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div class="total-card">
          <div class="total-label">Tổng số tiền cần thanh toán</div>
          <div class="total-amount">${totalAmount.toLocaleString('vi-VN')}₫</div>
        </div>
        
        ${creditorBankName && creditorBankAccount ? `
        <div class="bank-info">
          <div class="bank-info-title">Thông tin chuyển khoản</div>
          <table class="bank-table">
            <tr>
              <td class="bank-label">Ngân hàng:</td>
              <td class="bank-value">${creditorBankName}</td>
            </tr>
            <tr>
              <td class="bank-label">Số tài khoản:</td>
              <td class="bank-value">${creditorBankAccount}</td>
            </tr>
            <tr>
              <td class="bank-label">Chủ tài khoản:</td>
              <td class="bank-value">${creditorName}</td>
            </tr>
            <tr>
              <td class="bank-label">Số tiền thanh toán:</td>
              <td class="bank-value">${totalAmount.toLocaleString('vi-VN')}₫</td>
            </tr>
          </table>
          
          ${qrCodeUrl ? `
          <div class="qr-section">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" valign="middle" style="padding: 20px 0; min-height: 220px;">
                  <img src="${qrCodeUrl}" alt="QR Code thanh toán" class="qr-code" />
                </td>
              </tr>
            </table>
          </div>
          ` : ''}

          <p style="font-size: 12px; margin-top: 12px; font-style: italic;">
          Bạn chỉ muốn thanh toán một phần? <a href="${env.WEB_URL || 'http://localhost:5173'}/payment/pay?token=${reminderToken}">Nhấn vào đây để tùy chỉnh số tiền.</a>
        </div>
        ` : ''}
        
        <p class="action-text">
          Nếu bạn đã thanh toán, vui lòng nhấn vào nút bên dưới để xác nhận với ${creditorName}.
        </p>
        <div class="login-button">
          <a href="${env.WEB_URL || 'http://localhost:5173'}/payment/pay?token=${reminderToken}">
            Xác nhận thanh toán
          </a>
        </div>
        
        <div class="footer">
          <p>Trân trọng,<br><strong>Splitly Team</strong></p>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim()

    // Send email
    await transporter.sendMail({
      from: `"${env.ADMIN_EMAIL_NAME || 'Splitly'}" <${env.ADMIN_EMAIL_ADDRESS}>`,
      to: debtorEmail,
      subject: `⏰ ${creditorName} nhắc nhở bạn thanh toán qua Splitly`,
      html: htmlContent
    })

    console.log(`Payment reminder email sent successfully to ${debtorEmail}`)
    return true
  } catch (error) {
    console.error('Failed to send payment reminder email:', error)
    return false
  }
}
