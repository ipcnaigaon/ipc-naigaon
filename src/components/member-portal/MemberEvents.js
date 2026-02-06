/**
 * Member Events Component
 * Shows events for the current week
 */

import React, { useState, useEffect } from 'react';
import { getAllEvents } from '../../services/eventService.firebase';
import { formatTo12Hour } from '../../utils/timeFormatter';
import './MemberEvents.css';

const MemberEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const allEvents = await getAllEvents();
      const weekEvents = filterCurrentWeekEvents(allEvents);
      setEvents(weekEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCurrentWeekEvents = (allEvents) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    // Start from Sunday
    const dayOfWeek = now.getDay();
    const daysFromSunday = -dayOfWeek;
    startOfWeek.setDate(now.getDate() + daysFromSunday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // End on Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    return allEvents
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getDayName = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  };

  const isToday = (date) => {
    const today = new Date();
    const eventDate = new Date(date);
    return today.toDateString() === eventDate.toDateString();
  };

  const isPast = (date) => {
    const now = new Date();
    const eventDate = new Date(date);
    return eventDate < now && !isToday(date);
  };

  if (loading) {
    return <div className="member-events-loading">Loading events...</div>;
  }

  const getWeekDateRange = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysFromSunday = -dayOfWeek;
    
    const sunday = new Date(now);
    sunday.setDate(now.getDate() + daysFromSunday);
    
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    
    return {
      start: sunday.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      end: saturday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const weekRange = getWeekDateRange();

  return (
    <div className="member-events-container">
      <div className="member-events-header">
        <h2>📅 This Week's Events (Sun - Sat)</h2>
        <p className="week-info">
          {weekRange.start} - {weekRange.end}
        </p>
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <span className="no-events-icon">📭</span>
          <p>No events scheduled for this week</p>
        </div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div 
              key={event.id} 
              className={`weekly-event-item ${isToday(event.date) ? 'today' : ''} ${isPast(event.date) ? 'past' : ''}`}
            >
              <div className="event-date-badge">
                <span className="day">{new Date(event.date).getDate()}</span>
                <span className="month">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="weekday">{getDayName(event.date).substring(0, 3)}</span>
              </div>

              <div className="event-content">
                <h4 className="event-title">{event.title}</h4>
                {event.description && (
                  <p className="event-description">{event.description}</p>
                )}
                <div className="event-meta-info">
                  <span className="meta-item">
                    <span className="icon">🕐</span>
                    {formatTo12Hour(event.time)}
                  </span>
                  <span className="meta-item">
                    <span className="icon">📍</span>
                    {event.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberEvents;
