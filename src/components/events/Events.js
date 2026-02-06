/**
 * Events List Component
 * Display and manage church events
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents, deleteEvent } from '../../redux/slices/eventSlice';
import { getAllEvents, deleteEvent as deleteEventService } from '../../services/eventService.firebase';
import { formatTo12Hour } from '../../utils/timeFormatter';
import EventModal from './EventModal';
import './Events.css';

const Events = () => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      dispatch(setEvents(data));
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEventService(id);
        dispatch(deleteEvent(id));
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Event Management</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              📋 List
            </button>
            <button
              className={view === 'calendar' ? 'active' : ''}
              onClick={() => setView('calendar')}
            >
              📅 Calendar
            </button>
          </div>
          <button className="btn btn-primary" onClick={handleAddEvent}>
            ➕ Add Event
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <div className="events-grid">
          {events.length === 0 ? (
            <p className="no-data">No events found</p>
          ) : (
            events.map((event) => (
              <div key={event.id} className="event-card">
                <div className="event-card-header">
                  <h3>{event.title}</h3>
                  <span className={`event-type ${event.type}`}>{event.type}</span>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-details">
                  <div className="event-detail">
                    <span className="icon">📅</span>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="event-detail">
                    <span className="icon">🕐</span>
                    <span>{formatTo12Hour(event.time)}</span>
                  </div>
                  <div className="event-detail">
                    <span className="icon">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="event-detail">
                    <span className="icon">👥</span>
                    <span>{event.attendees} attendees</span>
                  </div>
                </div>
                <div className="event-actions">
                  <button
                    className="btn-small btn-secondary"
                    onClick={() => handleEditEvent(event)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="calendar-view">
          <p className="calendar-placeholder">Calendar view (integrate with react-calendar or similar library)</p>
        </div>
      )}

      {showModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowModal(false)}
          onSuccess={loadEvents}
        />
      )}
    </div>
  );
};

export default Events;
