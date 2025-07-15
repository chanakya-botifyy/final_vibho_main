// Notification System for Real-time Updates
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.notify();

    // Auto-remove after 5 seconds for success notifications
    if (notification.type === 'success') {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, 5000);
    }
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }

  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Predefined notification types
  employeeCreated(employeeName: string) {
    this.addNotification({
      type: 'success',
      title: 'Employee Added',
      message: `${employeeName} has been successfully added to the system.`
    });
  }

  attendanceCheckedIn(employeeName: string) {
    this.addNotification({
      type: 'info',
      title: 'Check-in Recorded',
      message: `${employeeName} has checked in successfully.`
    });
  }

  leaveRequestSubmitted(employeeName: string, leaveType: string) {
    this.addNotification({
      type: 'info',
      title: 'Leave Request Submitted',
      message: `${employeeName} has submitted a ${leaveType} leave request.`,
      actionUrl: '/leave'
    });
  }

  leaveRequestApproved(employeeName: string, leaveType: string) {
    this.addNotification({
      type: 'success',
      title: 'Leave Request Approved',
      message: `Your ${leaveType} leave request has been approved.`
    });
  }

  payrollGenerated(month: string, employeeCount: number) {
    this.addNotification({
      type: 'success',
      title: 'Payroll Generated',
      message: `Payroll for ${month} has been generated for ${employeeCount} employees.`,
      actionUrl: '/payroll'
    });
  }

  systemError(message: string) {
    this.addNotification({
      type: 'error',
      title: 'System Error',
      message
    });
  }
}

export const notificationService = new NotificationService();