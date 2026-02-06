/**
 * Event Service - Firebase Integration
 * Handles Firebase Firestore operations for event management
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
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const EVENTS_COLLECTION = 'events';

/**
 * Get all events from Firebase
 */
const getEvents = async () => {
  try {
    const eventsCol = collection(db, EVENTS_COLLECTION);
    const eventsQuery = query(eventsCol, orderBy('date', 'desc'));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    const eventsList = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));
    
    return eventsList;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

/**
 * Get a single event by ID
 */
const getEventById = async (id) => {
  try {
    const eventDoc = doc(db, EVENTS_COLLECTION, id);
    const eventSnapshot = await getDoc(eventDoc);
    
    if (eventSnapshot.exists()) {
      const data = eventSnapshot.data();
      return {
        id: eventSnapshot.id,
        ...data,
        date: data.date?.toDate?.()?.toISOString() || data.date,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching event:', error);
    throw error;
  }
};

/**
 * Create a new event
 */
const createEvent = async (eventData) => {
  try {
    const newEvent = {
      ...eventData,
      attendees: eventData.attendees || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), newEvent);
    
    // Create notification for new event
    try {
      const { createNotification } = await import('./notificationService.firebase');
      const eventDate = new Date(eventData.date);
      await createNotification({
        type: 'event',
        title: 'New Event Added',
        message: `${eventData.title} scheduled for ${eventDate.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        })} at ${eventData.time}`,
        priority: 'normal',
        read: false,
      });
    } catch (notifError) {
      console.error('Failed to create notification for new event:', notifError);
      // Don't fail event creation if notification fails
    }
    
    return {
      id: docRef.id,
      ...newEvent,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 */
const updateEvent = async (id, eventData) => {
  try {
    const eventDoc = doc(db, EVENTS_COLLECTION, id);
    
    const updateData = {
      ...eventData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(eventDoc, updateData);
    
    // Fetch and return updated event
    return await getEventById(id);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

/**
 * Delete an event
 */
const deleteEvent = async (id) => {
  try {
    const eventDoc = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(eventDoc);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

/**
 * Get upcoming events
 */
const getUpcomingEvents = async () => {
  try {
    const now = Timestamp.now();
    const eventsCol = collection(db, EVENTS_COLLECTION);
    const q = query(
      eventsCol,
      where('date', '>=', now),
      orderBy('date', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const mapped = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
    }));

    // If no results, fallback to fetching all events and filter client-side.
    // This handles cases where `date` was stored as a string (type mismatch with Timestamp queries).
    if (!mapped.length) {
      try {
        console.warn('No upcoming events from Timestamp query — falling back to client-side filter');
        const all = await getEvents();
        const nowDate = new Date();
        const fallback = all.filter(e => {
          const d = new Date(e.date);
          return !isNaN(d) && d >= nowDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
        return fallback;
      } catch (fbErr) {
        console.error('Fallback fetch failed:', fbErr);
        // still return the empty mapped array
      }
    }

    return mapped;
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw error;
  }
};

/**
 * Get event statistics
 */
const getEventStats = async () => {
  try {
    const events = await getEvents();
    const now = new Date();
    
    return {
      total: events.length,
      upcoming: events.filter(e => new Date(e.date) >= now).length,
      past: events.filter(e => new Date(e.date) < now).length,
      totalAttendees: events.reduce((sum, e) => sum + (e.attendees || 0), 0),
    };
  } catch (error) {
    console.error('Error fetching event stats:', error);
    throw error;
  }
};

// Named exports for direct function imports
export const getAllEvents = getEvents;
export { 
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventStats,
};

// Default export
const eventService = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getUpcomingEvents,
  getEventStats,
};

export default eventService;
