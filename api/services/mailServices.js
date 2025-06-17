import dotenv from 'dotenv'
dotenv.config()

import sgMail from '@sendgrid/mail'

// Init API key.
sgMail.setApiKey(process.env.SEND_GRID_API_KEY)

/**
 * Send email using SendGrid
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} options.html - HTML body
 */

export const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: process.env.SENDER_EMAIL,
    subject,
    text,
    html
  }

  try {
    await sgMail.send(msg)
    console.log('Email sent to: ', to)
  } catch (error) {
    console.log('Email sending failed; ', error)
    if (error.response) {
      console.log('error response body: ', error.response.body)
    } else {
      console.error('🔍 Raw Error:', error.message)
    }

    // Re-throw the actual error so your controller sees it
    throw new Error(
      error.response?.body?.errors?.[0]?.message || 'Email failed to send'
    )
  }
}
