import { Notification, NotificationType } from '../models/notification.model.ts';
import { User } from '../models/user.model.ts';
import sgMail from '@sendgrid/mail';
import fetch from 'node-fetch';
import { io } from '../index.ts';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Helper function to send WhatsApp message via Meta API
async function sendWhatsAppMessage(toPhoneNumber, message) {
  const apiUrl = process.env.WHATSAPP_API_URL; // e.g. https://graph.facebook.com/v15.0
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!apiUrl || !accessToken || !phoneNumberId) {
    console.error('WhatsApp API environment variables are not set');
    return;
  }

  const url = `${apiUrl}/${phoneNumberId}/messages`;

  const body = {
    messaging_product: 'whatsapp',
    to: toPhoneNumber,
    type: 'text',
    text: {
      body: message
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error sending WhatsApp message:', errorData);
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

// Get notifications
exports.getNotifications = async (req, res) => {
  try {
    const { id: userId, tenantId } = req.user;
    const { read, page = 1, limit = 20 } = req.query;

    // Build query
    const query = { userId, tenantId };

    if (read !== undefined) {
      query.read = read === 'true';
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const notifications = await Notification.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Get total count
    const total = await Notification.countDocuments(query);

    res.status(200).json({
      notifications,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    const { id: userId } = req.user;

    await Notification.updateMany(
      { userId, read: false },
      { read: true }
    );

    res.status(200).json({
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId } = req.user;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      userId
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send notification
exports.sendNotification = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      userIds,
      type,
      title,
      message,
      actionUrl,
      metadata,
      sendEmail = false,
      sendSms = false
    } = req.body;

    if (!userIds || !userIds.length) {
      return res.status(400).json({ message: 'User IDs are required' });
    }

    const notifications = [];

    for (const userId of userIds) {
      // Create notification
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
      notifications.push(notification);

      // Emit real-time notification via Socket.io
      io.to(userId).emit('notification', notification);

      // Send email if requested
      if (sendEmail) {
        const user = await User.findById(userId);
        if (user && user.email) {
          try {
            await sgMail.send({
              to: user.email,
              from: process.env.SENDGRID_FROM_EMAIL || 'notifications@vibhohcm.com',
              subject: title,
              text: message,
              html: `<div>
                <h2>${title}</h2>
                <p>${message}</p>
                ${actionUrl ? `<p><a href="${actionUrl}">Click here</a> for more details.</p>` : ''}
              </div>`
            });
          } catch (emailError) {
            console.error('Error sending email:', emailError);
          }
        }
      }

      // Send SMS if requested
      if (sendSms) {
        const user = await User.findById(userId);
        if (user && user.phone) {
          try {
            await sendWhatsAppMessage(user.phone, `${title}: ${message}`);
          } catch (smsError) {
            console.error('Error sending WhatsApp message:', smsError);
          }
        }
      }
    }

    res.status(201).json({
      message: 'Notifications sent successfully',
      notifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get unread count
exports.getUnreadCount = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const count = await Notification.countDocuments({
      userId,
      read: false
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};