/**
 * Stats Card Component
 * Displays key metrics in a card format
 */

import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="stats-card" style={{ borderTopColor: color }}>
      <div className="stats-card-content">
        <div className="stats-card-text">
          <h3>{title}</h3>
          <p className="stats-value">{value}</p>
          <p className="stats-subtitle">{subtitle}</p>
        </div>
        <div className="stats-card-icon" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
