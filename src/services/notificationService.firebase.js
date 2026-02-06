/**
 * Notification Service - Firebase Integration
 * Handles Firebase Firestore operations for notification management
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const NOTIFICATIONS_COLLECTION = 'notifications';

/**
 * Get all notifications from Firebase
 */
const getNotifications = async () => {
  try {
    const notificationsCol = collection(db, NOTIFICATIONS_COLLECTION);
    const notificationsQuery = query(notificationsCol, orderBy('createdAt', 'desc'));
    const notificationsSnapshot = await getDocs(notificationsQuery);
    
    const notificationsList = notificationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));
    
    return notificationsList;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

/**
 * Get unread notifications
 */
const getUnreadNotifications = async (userId) => {
  try {
    const notificationsCol = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(
      notificationsCol,
      where('userId', '==', userId),
      where('read', '==', false),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));
  } catch (error) {
    console.error('Error fetching unread notifications:', error);
    throw error;
  }
};

/**
 * Get recent notifications
 */
const getRecentNotifications = async (limitCount = 10) => {
  try {
    const notificationsCol = collection(db, NOTIFICATIONS_COLLECTION);
    const q = query(
      notificationsCol,
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
    }));
  } catch (error) {
    console.error('Error fetching recent notifications:', error);
    throw error;
  }
};

/**
 * Create a new notification
 */
const createNotification = async (notificationData) => {
  try {
    const newNotification = {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), newNotification);
    
    return {
      id: docRef.id,
      ...newNotification,
      createdAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Mark notification as read (clears/deletes the notification)
 */
const markAsRead = async (id) => {
  try {
    const notificationDoc = doc(db, NOTIFICATIONS_COLLECTION, id);
    await deleteDoc(notificationDoc);
    return true;
  } catch (error) {
    console.error('Error clearing notification:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsRead = async (userId) => {
  try {
    const unreadNotifications = await getUnreadNotifications(userId);
    
    const updatePromises = unreadNotifications.map(notification => 
      updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notification.id), { read: true })
    );
    
    await Promise.all(updatePromises);
    
    return true;
  } catch (error) {
    console.error('Error marking all as read:', error);
    throw error;
  }
};

/**
 * Delete a notification
 */
const deleteNotification = async (id) => {
  try {
    const notificationDoc = doc(db, NOTIFICATIONS_COLLECTION, id);
    await deleteDoc(notificationDoc);
    return true;
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Get a single notification by ID
 */
const getNotificationById = async (id) => {
  try {
    const notificationDoc = doc(db, NOTIFICATIONS_COLLECTION, id);
    const notificationSnapshot = await getDoc(notificationDoc);
    
    if (notificationSnapshot.exists()) {
      const data = notificationSnapshot.data();
      return {
        id: notificationSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching notification:', error);
    throw error;
  }
};

/**
 * Get notification count
 */
const getUnreadCount = async (userId) => {
  try {
    const unread = await getUnreadNotifications(userId);
    return unread.length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
};

// Named exports for direct function imports
export { 
  getNotifications,
  getUnreadNotifications,
  getRecentNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};

// Default export
const notificationService = {
  getNotifications,
  getUnreadNotifications,
  getRecentNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};

export default notificationService;
