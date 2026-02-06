/**
 * Recent Activity Component
 * Displays recent donations and activities
 */

import React from 'react';
import { format } from 'date-fns';
import './RecentActivity.css';

const RecentActivity = ({ donations, events }) => {
  // Combine and sort activities
  const activities = [
    ...donations.map((d) => ({
      type: 'donation',
      title: `${d.donor || 'Anonymous'} donated ₹${d.amount}`,
      subtitle: d.category || 'Donation',
      date: d.date,
      icon: '💰',
    })),
    ...events.slice(0, 3).map((e) => ({
      type: 'event',
      title: e.title,
      subtitle: `${e.attendees || 0} attendees`,
      date: e.date,
      icon: '📅',
    })),
  ]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 8);

  return (
    <div className="recent-activity">
      {activities.length === 0 ? (
        <p className="no-activity">No recent activity</p>
      ) : (
        <ul className="activity-list">
          {activities.map((activity, index) => (
            <li key={index} className="activity-item">
              <span className="activity-icon">{activity.icon}</span>
              <div className="activity-content">
                <p className="activity-title">{activity.title}</p>
                <p className="activity-subtitle">{activity.subtitle}</p>
              </div>
              <span className="activity-date">
                {format(new Date(activity.date), 'MMM d')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;
