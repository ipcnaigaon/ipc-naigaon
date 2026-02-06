/**
 * Event Service
 * Handles API calls for event management
 */

// Mock data for demonstration
let mockEvents = [
  {
    id: 1,
    title: 'Sunday Service',
    description: 'Weekly worship service',
    date: '2025-12-21',
    time: '10:00 AM',
    location: 'Main Sanctuary',
    type: 'worship',
    attendees: 150,
  },
  {
    id: 2,
    title: 'Youth Meeting',
    description: 'Monthly youth gathering',
    date: '2025-12-22',
    time: '6:00 PM',
    location: 'Youth Hall',
    type: 'youth',
    attendees: 45,
  },
  {
    id: 3,
    title: 'Christmas Carol Service',
    description: 'Special Christmas celebration',
    date: '2025-12-25',
    time: '7:00 PM',
    location: 'Main Sanctuary',
    type: 'special',
    attendees: 200,
  },
];

/**
 * Get all events
 */
export const getAllEvents = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEvents;
};

/**
 * Get event by ID
 */
export const getEventById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockEvents.find(e => e.id === parseInt(id));
};

/**
 * Create new event
 */
export const createEvent = async (eventData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newEvent = {
    ...eventData,
    id: Date.now(),
    attendees: 0,
  };
  mockEvents.push(newEvent);
  return newEvent;
};

/**
 * Update event
 */
export const updateEvent = async (id, eventData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockEvents.findIndex(e => e.id === parseInt(id));
  if (index !== -1) {
    mockEvents[index] = { ...mockEvents[index], ...eventData };
    return mockEvents[index];
  }
  throw new Error('Event not found');
};

/**
 * Delete event
 */
export const deleteEvent = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockEvents = mockEvents.filter(e => e.id !== parseInt(id));
  return { success: true };
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
