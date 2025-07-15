// Email service for VibhoHCM
// This file contains the email sending functionality

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Send email using configured transport
 * @param options Email options
 * @returns Promise that resolves when email is sent
 */
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Send email
    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: options.to,
      cc: options.cc,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    });
    
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

/**
 * Send welcome email to new user
 * @param email User email
 * @param name User name
 * @param password User password
 * @param tenantName Tenant name
 * @param tenantDomain Tenant domain
 */
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  password: string,
  tenantName: string,
  tenantDomain: string
): Promise<void> => {
  const loginUrl = `https://${tenantDomain}/login`;
  
  await sendEmail({
    to: email,
    subject: `Welcome to ${tenantName} on VibhoHCM`,
    text: `
      Welcome to ${tenantName} on VibhoHCM!
      
      Your account has been created. Here are your login details:
      
      Email: ${email}
      Password: ${password}
      
      You can log in at: ${loginUrl}
      
      Please change your password after your first login.
      
      Best regards,
      The VibhoHCM Team
    `,
    html: `
      <h2>Welcome to ${tenantName} on VibhoHCM!</h2>
      <p>Your account has been created. Here are your login details:</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Password:</strong> ${password}</p>
      <p>You can log in at: <a href="${loginUrl}">${loginUrl}</a></p>
      <p>Please change your password after your first login.</p>
      <p>Best regards,<br>The VibhoHCM Team</p>
    `
  });
};

/**
 * Send password reset email
 * @param email User email
 * @param resetToken Password reset token
 * @param tenantDomain Tenant domain
 */
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  tenantDomain: string
): Promise<void> => {
  const resetUrl = `https://${tenantDomain}/reset-password/${resetToken}`;
  
  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    text: `
      You requested a password reset for your VibhoHCM account.
      
      Please click the following link to reset your password:
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you did not request this, please ignore this email.
      
      Best regards,
      The VibhoHCM Team
    `,
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your VibhoHCM account.</p>
      <p>Please click the button below to reset your password:</p>
      <p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,<br>The VibhoHCM Team</p>
    `
  });
};

/**
 * Send subscription change notification
 * @param email User email
 * @param tenantName Tenant name
 * @param oldPlan Old subscription plan
 * @param newPlan New subscription plan
 * @param effectiveDate Effective date of change
 */
export const sendSubscriptionChangeEmail = async (
  email: string,
  tenantName: string,
  oldPlan: string,
  newPlan: string,
  effectiveDate: string
): Promise<void> => {
  await sendEmail({
    to: email,
    subject: 'Subscription Plan Changed',
    text: `
      Dear Admin,
      
      Your subscription plan for ${tenantName} has been changed from ${oldPlan} to ${newPlan}.
      
      This change will be effective from ${effectiveDate}.
      
      If you have any questions, please contact support.
      
      Best regards,
      The VibhoHCM Team
    `,
    html: `
      <h2>Subscription Plan Changed</h2>
      <p>Dear Admin,</p>
      <p>Your subscription plan for <strong>${tenantName}</strong> has been changed from <strong>${oldPlan}</strong> to <strong>${newPlan}</strong>.</p>
      <p>This change will be effective from <strong>${effectiveDate}</strong>.</p>
      <p>If you have any questions, please contact support.</p>
      <p>Best regards,<br>The VibhoHCM Team</p>
    `
  });
};