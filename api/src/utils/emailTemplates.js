/**
 * Splitly Email Templates
 * Beautiful, responsive email templates matching the Splitly design system
 */

// Splitly Design System Colors
const COLORS = {
  primary: '#EF9A9A', // Primary Pink
  secondary: '#4A148C', // Primary Purple
  text: '#1A1A1A', // Dark text
  textMuted: '#757575', // Gray text
  bgPrimary: '#FFFFFF', // White background
  bgSecondary: '#FAFAFA', // Off-white background
  border: '#E5E7EB', // Light border
  success: '#4CAF50', // Green
  gradientPrimary: 'linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%)', // Pink to Lavender
}

/**
 * Base email template wrapper
 * @param {string} content - HTML content to wrap
 * @returns {string} Complete HTML email
 */
const baseTemplate = (content) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Splitly</title>
  <style>
    /* Reset styles */
    body, table, td, a {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }
    /* Prevent Gmail from changing colors */
    .im { color: inherit !important; }
    /* iOS link colors */
    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${COLORS.bgSecondary};">
  <!-- Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${COLORS.bgSecondary};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <!-- Main Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: ${COLORS.bgPrimary}; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); overflow: hidden;">

          <!-- Header with Gradient -->
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%); padding: 40px 30px;">
              <h1 style="margin: 0; color: ${COLORS.bgPrimary}; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                Splitly
              </h1>
              <p style="margin: 8px 0 0 0; color: ${COLORS.bgPrimary}; font-size: 14px; font-weight: 500; opacity: 0.95;">
                Split Bills, Share Smiles
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: ${COLORS.bgSecondary}; padding: 30px; text-align: center; border-top: 1px solid ${COLORS.border};">
              <p style="margin: 0 0 10px 0; color: ${COLORS.textMuted}; font-size: 14px;">
                Made with ❤️ by the Splitly Team
              </p>
              <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 12px;">
                © ${new Date().getFullYear()} Splitly. All rights reserved.
              </p>
              <div style="margin-top: 20px;">
                <a href="https://splitly.com/privacy" style="color: ${COLORS.primary}; text-decoration: none; font-size: 12px; margin: 0 10px;">Privacy Policy</a>
                <span style="color: ${COLORS.border};">|</span>
                <a href="https://splitly.com/terms" style="color: ${COLORS.primary}; text-decoration: none; font-size: 12px; margin: 0 10px;">Terms of Service</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Create a styled button for emails
 * @param {string} text - Button text
 * @param {string} url - Button URL
 * @param {string} color - Button background color (default: primary)
 * @returns {string} Button HTML
 */
const createButton = (text, url, color = COLORS.primary) => {
  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <a href="${url}" target="_blank" style="display: inline-block; padding: 16px 32px; background-color: ${color}; color: ${COLORS.text}; text-decoration: none; border-radius: 16px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1); transition: all 0.2s ease;">
            ${text}
          </a>
        </td>
      </tr>
    </table>
  `
}

/**
 * Verification Email Template
 * @param {string} userName - User's name
 * @param {string} verificationLink - Verification URL
 * @returns {Object} Email subject and HTML content
 */
export const verificationEmailTemplate = (userName, verificationLink) => {
  const content = `
    <div style="text-align: center;">
      <!-- Icon -->
      <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">✉️</span>
      </div>

      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.text}; font-size: 24px; font-weight: 700;">
        Welcome to Splitly${userName ? `, ${userName}` : ''}!
      </h2>

      <!-- Message -->
      <p style="margin: 0 0 24px 0; color: ${COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
        We're excited to have you on board! To get started with splitting bills and sharing expenses with your friends, please verify your email address.
      </p>

      <!-- Button -->
      ${createButton('Verify My Email', verificationLink, COLORS.primary)}

      <!-- Alternative Link -->
      <p style="margin: 24px 0 0 0; color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <p style="margin: 8px 0 0 0; word-break: break-all;">
        <a href="${verificationLink}" style="color: ${COLORS.secondary}; text-decoration: none; font-size: 14px;">
          ${verificationLink}
        </a>
      </p>

      <!-- Security Note -->
      <div style="margin-top: 32px; padding: 16px; background-color: ${COLORS.bgSecondary}; border-radius: 12px; border-left: 4px solid ${COLORS.primary};">
        <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 13px; line-height: 1.5; text-align: left;">
          <strong style="color: ${COLORS.text};">🔒 Security Note:</strong><br>
          If you didn't create an account with Splitly, you can safely ignore this email. Your email address will not be used without verification.
        </p>
      </div>
    </div>
  `

  return {
    subject: 'Welcome to Splitly - Verify Your Email Address',
    html: baseTemplate(content),
    text: `Welcome to Splitly${userName ? `, ${userName}` : ''}!\n\nPlease verify your email address by clicking this link:\n${verificationLink}\n\nIf you didn't create an account with Splitly, you can safely ignore this email.\n\nThank you,\nThe Splitly Team`,
  }
}

/**
 * Welcome Email Template (after verification)
 * @param {string} userName - User's name
 * @returns {Object} Email subject and HTML content
 */
export const welcomeEmailTemplate = (userName) => {
  const content = `
    <div style="text-align: center;">
      <!-- Icon -->
      <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">🎉</span>
      </div>

      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.text}; font-size: 24px; font-weight: 700;">
        You're All Set${userName ? `, ${userName}` : ''}!
      </h2>

      <!-- Message -->
      <p style="margin: 0 0 32px 0; color: ${COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
        Your email has been verified successfully. You can now start using Splitly to manage shared expenses with ease!
      </p>

      <!-- Features -->
      <div style="text-align: left; margin: 32px 0;">
        <div style="margin-bottom: 20px; padding: 16px; background-color: ${COLORS.bgSecondary}; border-radius: 12px;">
          <span style="font-size: 24px; margin-right: 12px;">💰</span>
          <strong style="color: ${COLORS.text}; font-size: 16px;">Split Bills Easily</strong>
          <p style="margin: 8px 0 0 36px; color: ${COLORS.textMuted}; font-size: 14px;">
            Create bills and split them fairly among friends
          </p>
        </div>

        <div style="margin-bottom: 20px; padding: 16px; background-color: ${COLORS.bgSecondary}; border-radius: 12px;">
          <span style="font-size: 24px; margin-right: 12px;">📊</span>
          <strong style="color: ${COLORS.text}; font-size: 16px;">Track Expenses</strong>
          <p style="margin: 8px 0 0 36px; color: ${COLORS.textMuted}; font-size: 14px;">
            Keep track of who owes what in real-time
          </p>
        </div>

        <div style="padding: 16px; background-color: ${COLORS.bgSecondary}; border-radius: 12px;">
          <span style="font-size: 24px; margin-right: 12px;">✨</span>
          <strong style="color: ${COLORS.text}; font-size: 16px;">Settle Up</strong>
          <p style="margin: 8px 0 0 36px; color: ${COLORS.textMuted}; font-size: 14px;">
            Simplify payments and settle debts effortlessly
          </p>
        </div>
      </div>
    </div>
  `

  return {
    subject: 'Welcome to Splitly - Let\'s Get Started!',
    html: baseTemplate(content),
    text: `You're All Set${userName ? `, ${userName}` : ''}!\n\nYour email has been verified successfully. You can now start using Splitly to manage shared expenses with ease!\n\nThank you,\nThe Splitly Team`,
  }
}

/**
 * Password Reset Email Template
 * @param {string} userName - User's name
 * @param {string} resetLink - Password reset URL
 * @returns {Object} Email subject and HTML content
 */
export const passwordResetEmailTemplate = (userName, resetLink) => {
  const content = `
    <div style="text-align: center;">
      <!-- Icon -->
      <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">🔑</span>
      </div>

      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.text}; font-size: 24px; font-weight: 700;">
        Reset Your Password
      </h2>

      <!-- Message -->
      <p style="margin: 0 0 24px 0; color: ${COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
        Hi${userName ? ` ${userName}` : ''}, we received a request to reset your password. Click the button below to create a new password.
      </p>

      <!-- Button -->
      ${createButton('Reset Password', resetLink, COLORS.secondary)}

      <!-- Expiry Notice -->
      <p style="margin: 24px 0 0 0; color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
        This link will expire in 1 hour for security reasons.
      </p>

      <!-- Security Note -->
      <div style="margin-top: 32px; padding: 16px; background-color: ${COLORS.bgSecondary}; border-radius: 12px; border-left: 4px solid ${COLORS.secondary};">
        <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 13px; line-height: 1.5; text-align: left;">
          <strong style="color: ${COLORS.text};">🔒 Security Tip:</strong><br>
          If you didn't request a password reset, please ignore this email or contact support if you have concerns about your account security.
        </p>
      </div>
    </div>
  `

  return {
    subject: 'Reset Your Splitly Password',
    html: baseTemplate(content),
    text: `Reset Your Password\n\nHi${userName ? ` ${userName}` : ''}, we received a request to reset your password.\n\nClick this link to reset your password:\n${resetLink}\n\nThis link will expire in 1 hour.\n\nIf you didn't request a password reset, please ignore this email.\n\nThank you,\nThe Splitly Team`,
  }
}

/**
 * Bill Invitation Email Template
 * @param {string} inviterName - Name of person who created the bill
 * @param {string} billName - Name of the bill
 * @param {string} billLink - Link to view the bill
 * @returns {Object} Email subject and HTML content
 */
export const billInvitationEmailTemplate = (inviterName, billName, billLink) => {
  const content = `
    <div style="text-align: center;">
      <!-- Icon -->
      <div style="width: 80px; height: 80px; margin: 0 auto 24px; background: linear-gradient(135deg, #EF9A9A 0%, #CE93D8 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
        <span style="font-size: 40px;">🧾</span>
      </div>

      <!-- Greeting -->
      <h2 style="margin: 0 0 16px 0; color: ${COLORS.text}; font-size: 24px; font-weight: 700;">
        You've Been Added to a Bill
      </h2>

      <!-- Message -->
      <p style="margin: 0 0 24px 0; color: ${COLORS.textMuted}; font-size: 16px; line-height: 1.6;">
        <strong>${inviterName}</strong> has added you to <strong>"${billName}"</strong> on Splitly.
      </p>

      <!-- Button -->
      ${createButton('View Bill Details', billLink, COLORS.primary)}

      <!-- Info Box -->
      <div style="margin-top: 32px; padding: 20px; background-color: ${COLORS.bgSecondary}; border-radius: 12px;">
        <p style="margin: 0; color: ${COLORS.text}; font-size: 14px; line-height: 1.6; text-align: left;">
          📝 <strong>What's Next?</strong><br>
          <span style="color: ${COLORS.textMuted};">Review the bill details and see your share of the expenses. You can easily settle up with your friends through the app.</span>
        </p>
      </div>
    </div>
  `

  return {
    subject: `You've Been Added to "${billName}" on Splitly`,
    html: baseTemplate(content),
    text: `You've Been Added to a Bill\n\n${inviterName} has added you to "${billName}" on Splitly.\n\nView bill details: ${billLink}\n\nThank you,\nThe Splitly Team`,
  }
}
