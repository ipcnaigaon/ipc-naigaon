/**
 * Email Service
 * Handles sending emails for notifications and credentials
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Send welcome email with credentials to new member
 * @param {object} memberData - Member information
 * @param {string} username - Generated username
 * @param {string} password - Generated password
 * @returns {Promise}
 */
export const sendWelcomeEmail = async (memberData, username, password) => {
  try {
    // Mock implementation - replace with actual email service
    console.log('Sending welcome email to:', memberData.email);
    console.log('Username:', username);
    console.log('Password:', password);

    const emailData = {
      to: memberData.email,
      subject: 'Welcome to IPC Naigaon Mumbai Portal',
      template: 'welcome',
      data: {
        name: memberData.name,
        username: username,
        password: password,
        portalUrl: window.location.origin + '/member-portal',
        churchName: 'India Pentecostal Church of God, Naigaon Mumbai',
      },
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, replace with actual API call:
    // const response = await axios.post(`${API_URL}/email/send-welcome`, emailData);
    // return response.data;

    return {
      success: true,
      message: 'Welcome email sent successfully',
      emailData,
    };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

/**
 * Send password reset email
 * @param {string} email - Member's email
 * @param {string} resetToken - Password reset token
 * @returns {Promise}
 */
export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const emailData = {
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: {
        resetUrl: `${window.location.origin}/reset-password?token=${resetToken}`,
        expiryTime: '24 hours',
      },
    };

    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Password reset email sent successfully',
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send event notification email
 * @param {string} email - Member's email
 * @param {object} eventData - Event information
 * @returns {Promise}
 */
export const sendEventNotification = async (email, eventData) => {
  try {
    const emailData = {
      to: email,
      subject: `Upcoming Event: ${eventData.title}`,
      template: 'event-notification',
      data: {
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventTime: eventData.time,
        eventLocation: eventData.location,
        eventDescription: eventData.description,
      },
    };

    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Event notification sent successfully',
    };
  } catch (error) {
    console.error('Error sending event notification:', error);
    throw new Error('Failed to send event notification');
  }
};

/**
 * Send bulk email to multiple recipients
 * @param {Array} recipients - Array of email addresses
 * @param {object} emailContent - Email subject and body
 * @returns {Promise}
 */
export const sendBulkEmail = async (recipients, emailContent) => {
  try {
    const emailData = {
      recipients: recipients,
      subject: emailContent.subject,
      body: emailContent.body,
      template: emailContent.template || 'default',
    };

    await new Promise(resolve => setTimeout(resolve, 1500));

    return {
      success: true,
      message: `Bulk email sent to ${recipients.length} recipients`,
      sentCount: recipients.length,
    };
  } catch (error) {
    console.error('Error sending bulk email:', error);
    throw new Error('Failed to send bulk email');
  }
};

/**
 * Get email template preview
 * @param {string} templateName - Name of the email template
 * @param {object} data - Template data
 * @returns {string} HTML preview
 */
export const getEmailTemplatePreview = (templateName, data) => {
  const templates = {
    welcome: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #667eea;">Welcome to ${data.churchName}!</h2>
        <p>Hello ${data.name},</p>
        <p>We're excited to have you join our church community portal. Here are your login credentials:</p>
        <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Username:</strong> ${data.username}</p>
          <p><strong>Temporary Password:</strong> ${data.password}</p>
          <p><strong>Portal URL:</strong> <a href="${data.portalUrl}">${data.portalUrl}</a></p>
        </div>
        <p>Please change your password after your first login for security purposes.</p>
        <p>If you have any questions, feel free to contact the church administration.</p>
        <p>Blessings,<br>${data.churchName} Team</p>
      </div>
    `,
    'password-reset': `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #667eea;">Password Reset Request</h2>
        <p>We received a request to reset your password.</p>
        <p>Click the button below to reset your password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${data.resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in ${data.expiryTime}.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  return templates[templateName] || '<p>Template not found</p>';
};

export default {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEventNotification,
  sendBulkEmail,
  getEmailTemplatePreview,
};
