/**
 * Weekly Events Component
 * Display current week events grouped by day with nice background
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEvents } from '../../redux/slices/eventSlice';
import { getAllEvents } from '../../services/eventService.firebase';
import { formatTo12Hour } from '../../utils/timeFormatter';
import ShareableWeeklyEvents from './ShareableWeeklyEvents';
import './WeeklyEvents.css';

const WeeklyEvents = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { events } = useSelector((state) => state.events);
  const [loading, setLoading] = useState(true);
  const [groupedEvents, setGroupedEvents] = useState({});
  const [showShareable, setShowShareable] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      groupEventsByDay();
    }
  }, [events]);

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

  const getWeekRange = () => {
  const now = new Date();
  const currentDay = now.getDay(); // Sunday = 0, Monday = 1, ... Saturday = 6

  // Find Sunday of the current week
  const sunday = new Date(now);
  sunday.setDate(now.getDate() - currentDay);
  sunday.setHours(0, 0, 0, 0);

  // Find Saturday of the current week
  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);
  saturday.setHours(23, 59, 59, 999);

  return { start: sunday, end: saturday };
};


  const isInCurrentWeek = (date) => {
    const eventDate = new Date(date);
    const { start, end } = getWeekRange();
    return eventDate >= start && eventDate <= end;
  };

  const groupEventsByDay = () => {
    const weekEvents = events.filter(event => isInCurrentWeek(event.date));
    
    const grouped = weekEvents.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      const dayKey = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: 'numeric'
      });
      
      if (!acc[dayKey]) {
        acc[dayKey] = {
          date: eventDate,
          events: []
        };
      }
      
      acc[dayKey].events.push(event);
      return acc;
    }, {});

    // Sort events within each day by time
    Object.keys(grouped).forEach(day => {
      grouped[day].events.sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
      });
    });

    setGroupedEvents(grouped);
  };

  const formatDateRange = () => {
    const { start, end } = getWeekRange();
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  };

  const getDateNumber = (dateString) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const sortedDays = Object.keys(groupedEvents).sort((a, b) => {
    return groupedEvents[a].date - groupedEvents[b].date;
  });

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentWeekEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const { start, end } = getWeekRange();
    return eventDate >= start && eventDate <= end;
  });

  if (loading) {
    return (
      <div className="weekly-events-modal-overlay" onClick={onClose}>
        <div className="weekly-events-page" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
          <div className="weekly-events-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading events...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="weekly-events-modal-overlay" onClick={onClose}>
        <div className="weekly-events-page" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
          <button 
            className="modal-share-btn" 
            onClick={() => setShowShareable(true)}
            title="Share as Image"
          >
            📱
          </button>
          <div className="weekly-events-header">
            <div className="header-content">
              <h1>📅 This Week's Events</h1>
              <p className="week-range">{formatDateRange()}</p>
            </div>
          </div>

          <div className="weekly-events-content">
            {sortedDays.length === 0 ? (
              <div className="no-events-message">
                <div className="no-events-icon">📭</div>
                <h3>No Events This Week</h3>
                <p>There are no scheduled events for the current week.</p>
              </div>
            ) : (
              <div className="days-grid">
                {sortedDays.map((dayKey) => {
                  const dayData = groupedEvents[dayKey];
                const isToday = new Date().toDateString() === dayData.date.toDateString();
                
                return (
                  <div key={dayKey} className={`day-card ${isToday ? 'today' : ''}`}>
                    <div className="day-header">
                      <div className="day-badge">
                        <span className="day-name">{getDayOfWeek(dayData.date)}</span>
                        <span className="day-number">{getDateNumber(dayData.date)}</span>
                      </div>
                      {isToday && <span className="today-badge">Today</span>}
                    </div>
                    
                    <div className="day-title">
                      <h3>{dayKey}</h3>
                    </div>

                    <div className="day-events">
                      {dayData.events.map((event) => (
                        <div key={event.id} className="week-event-card">
                          <div className="event-time">
                            <span className="time-icon">🕐</span>
                            <span className="time-text">
                              {event.time ? formatTo12Hour(event.time) : 'All Day'}
                            </span>
                          </div>
                          
                          <div className="event-details">
                            <h4>{event.title}</h4>
                            {event.location && (
                              <div className="event-location">
                                <span className="location-icon">📍</span>
                                <span>{event.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

      {showShareable && (
        <ShareableWeeklyEvents
          events={currentWeekEvents}
          weekRange={formatDateRange()}
          onClose={() => setShowShareable(false)}
        />
      )}
    </>
  );
};

export default WeeklyEvents;
