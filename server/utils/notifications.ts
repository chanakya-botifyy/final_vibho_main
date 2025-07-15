import { Notification, NotificationType } from '../models/notification.model';
import { User } from '../models/user.model';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
let ioInstance: any;

export const setIoInstance = (io: any) => {
  ioInstance = io;
};

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Initialize Twilio
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

// Create notification
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  tenantId: string,
  actionUrl?: string,
  metadata?: Record<string, unknown>
) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      read: false,
      actionUrl,
      metadata,
      tenantId
    });

    await notification.save();

    // Emit real-time notification via Socket.io
    if (ioInstance) {
      ioInstance.to(userId).emit('notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Send email notification
export const sendEmailNotification = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent.');
      return;
    }

    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'notifications@vibhohcm.com',
      subject,
      text,
      html: html || text
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

// Send SMS notification
export const sendSmsNotification = async (
  to: string,
  message: string
) => {
  try {
    if (!twilioClient) {
      console.warn('Twilio not configured. SMS not sent.');
      return;
    }

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    throw error;
  }
};

// Send WhatsApp notification
export const sendWhatsAppNotification = async (
  to: string,
  templateName: string,
  parameters: string[]
) => {
  try {
    if (!twilioClient) {
      console.warn('Twilio not configured. WhatsApp message not sent.');
      return;
    }

    await twilioClient.messages.create({
      body: `Template: ${templateName}, Params: ${parameters.join(', ')}`,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`
    });
  } catch (error) {
    console.error('Error sending WhatsApp notification:', error);
    throw error;
  }
};

// Send notification to multiple users
export const notifyUsers = async (
  userIds: string[],
  type: NotificationType,
  title: string,
  message: string,
  tenantId: string,
  actionUrl?: string,
  metadata?: Record<string, unknown>,
  sendEmail: boolean = false,
  sendSms: boolean = false
) => {
  try {
    const notifications = [];

    for (const userId of userIds) {
      const notification = await createNotification(
        userId,
        type,
        title,
        message,
        tenantId,
        actionUrl,
        metadata
      );
      
      notifications.push(notification);

      // Send email if requested
      if (sendEmail) {
        const user = await User.findById(userId);
        if (user && user.email) {
          await sendEmailNotification(
            user.email,
            title,
            message
          );
        }
      }

      // Send SMS if requested
      if (sendSms) {
        const user = await User.findById(userId);
      if (user && 'phone' in user && typeof user.phone === 'string' && user.phone) {
        await sendSmsNotification(
          user.phone,
          message
        );
      }
      }
    }

    return notifications;
  } catch (error) {
    console.error('Error notifying users:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (id: string, userId: string) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    return true;
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

// Get unread notifications count
export const getUnreadNotificationsCount = async (userId: string) => {
  try {
    const count = await Notification.countDocuments({
      userId,
      read: false
    });

    return count;
  } catch (error) {
    console.error('Error getting unread notifications count:', error);
    throw error;
  }
};