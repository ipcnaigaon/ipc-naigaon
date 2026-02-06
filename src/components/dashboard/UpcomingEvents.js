/**
 * Upcoming Events Component
 * Displays upcoming church events
 */

import React from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { formatTo12Hour } from '../../utils/timeFormatter';
import './UpcomingEvents.css';

const UpcomingEvents = ({ events }) => {
  const navigate = useNavigate();

  return (
    <div className="upcoming-events">
      {events.length === 0 ? (
        <p className="no-events">No upcoming events</p>
      ) : (
        <ul className="events-list">
          {events.map((event) => (
            <li key={event.id} className="event-item">
              <div className="event-date">
                <span className="event-day">
                  {format(new Date(event.date), 'd')}
                </span>
                <span className="event-month">
                  {format(new Date(event.date), 'MMM')}
                </span>
              </div>
              <div className="event-content">
                <h4>{event.title}</h4>
                <p>{event.location}</p>
                <span className="event-time">{formatTo12Hour(event.time)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button
        className="view-all-btn"
        onClick={() => navigate('/events')}
      >
        View All Events
      </button>
    </div>
  );
};

export default UpcomingEvents;
