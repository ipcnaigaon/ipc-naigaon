import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markAsRead, deleteNotification, toggleNotifications, setNotifications } from '../../redux/slices/notificationSlice';
import { getRecentNotifications, markAsRead as markNotificationAsRead, deleteNotification as deleteNotificationService } from '../../services/notificationService.firebase';
import './NotificationDropdown.css';

const NotificationDropdown = () => {
  const dispatch = useDispatch();
  const { notifications, showNotifications } = useSelector((state) => state.notifications);
  const { user } = useSelector((state) => state.auth);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Check if the click is not on the notification bell icon
        const notificationIcon = document.querySelector('.notification-icon');
        if (notificationIcon && !notificationIcon.contains(event.target)) {
          dispatch(toggleNotifications());
        }
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showNotifications, dispatch]);

  const loadNotifications = async () => {
    try {
      const data = await getRecentNotifications(10);
      dispatch(setNotifications(data));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  // Filter notifications based on user role
  const getFilteredNotifications = () => {
    if (!user) return notifications;
    
    const userRole = (user.role || 'member').trim().toLowerCase();
    
    // Members should only see event notifications, not donation updates
    if (userRole === 'member') {
      return notifications.filter(notification => {
        const message = (notification.message || '').toLowerCase();
        // Exclude donation-related notifications
        return !message.includes('donation') && 
               !message.includes('donated') && 
               !message.includes('contribution');
      });
    }
    
    // Admin and other roles see all notifications
    return notifications;
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      dispatch(deleteNotification(id));
    } catch (error) {
      console.error('Error clearing notification:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotificationService(id);
      dispatch(deleteNotification(id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (!showNotifications) return null;

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <div className="notification-header">
        <h3>Notifications</h3>
        <button onClick={() => dispatch(toggleNotifications())}>✕</button>
      </div>
      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <p className="no-notifications">No notifications</p>
        ) : (
          filteredNotifications.slice(0, 10).map((notification) => (
            <div key={notification.id} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
              <div className="notification-content">
                <p>{notification.message}</p>
                <span className="notification-time">
                  {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : ''}
                </span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button onClick={() => handleMarkAsRead(notification.id)}>✓</button>
                )}
                <button onClick={() => handleDelete(notification.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
