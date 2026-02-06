/**
 * Shareable Weekly Events Component
 * Generates a downloadable/shareable image of the week's events
 */

import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import ipcLogo from '../../assets/ipc-logo.png';
import './ShareableWeeklyEvents.css';

const ShareableWeeklyEvents = ({ events, weekRange, onClose }) => {
  const shareableRef = useRef(null);

  // Debug: Log the weekRange value
  console.log('ShareableWeeklyEvents - weekRange:', weekRange);

  const formatTo12Hour = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getDayColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)', // Cyan - Monday
      'linear-gradient(135deg, #673ab7 0%, #512da8 100%)', // Deep Purple - Tuesday
      'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)', // Dark Blue - Wednesday
      'linear-gradient(135deg, #047857 0%, #065f46 100%)', // Dark Green - Thursday
      'linear-gradient(135deg, #ff5722 0%, #e64a19 100%)', // Deep Orange - Friday
      'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', // Pink - Saturday
      'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)', // Purple - Sunday
    ];
    return colors[index % colors.length];
  };

  const groupEventsByDay = () => {
    const grouped = {};
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const dayKey = eventDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!grouped[dayKey]) {
        grouped[dayKey] = {
          date: eventDate,
          dayNum: eventDate.getDate(),
          dayName: eventDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          events: []
        };
      }
      
      grouped[dayKey].events.push(event);
    });

    // Sort events within each day by time
    Object.keys(grouped).forEach(day => {
      grouped[day].events.sort((a, b) => {
        const timeA = a.time || '00:00';
        const timeB = b.time || '00:00';
        return timeA.localeCompare(timeB);
      });
    });

    return grouped;
  };

  const downloadAsImage = async () => {
    if (!shareableRef.current) return;

    try {
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: '#667eea',
        scale: 2,
        logging: false,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `weekly-events-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  const shareAsWhatsApp = async () => {
    if (!shareableRef.current) return;

    try {
      const canvas = await html2canvas(shareableRef.current, {
        backgroundColor: '#667eea',
        scale: 2,
        logging: false,
        useCORS: true
      });

      canvas.toBlob(async (blob) => {
        if (navigator.share && navigator.canShare({ files: [new File([blob], 'weekly-events.png', { type: 'image/png' })] })) {
          const file = new File([blob], 'weekly-events.png', { type: 'image/png' });
          await navigator.share({
            files: [file],
            title: 'This Week\'s Events - CAG Kazhakuttom',
            text: 'Check out this week\'s events!'
          });
        } else {
          // Fallback: download the image
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'weekly-events.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error sharing:', error);
      alert('Failed to share. Image has been downloaded instead.');
    }
  };

  const groupedEvents = groupEventsByDay();
  const sortedDays = Object.keys(groupedEvents).sort((a, b) => {
    return groupedEvents[a].date - groupedEvents[b].date;
  });

  return (
    <div className="shareable-modal-overlay" onClick={onClose}>
      <div className="shareable-modal" onClick={(e) => e.stopPropagation()}>
        <div className="shareable-header">
          <h2>📱 Share Weekly Events</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="shareable-preview-container">
          <div className="shareable-preview" ref={shareableRef}>
            <div className="shareable-content">
              <div className="shareable-header-section">
                <div className="shareable-header-top">
                  <img src={ipcLogo} alt="IPC Naigaon Logo" className="ipc-logo-shareable" />
                </div>
                
                <div className="shareable-title-section">
                  <h1 className="cag-main-title">IPC Naigaon Weekly Gathering</h1>
                  <p className="week-date-range">{weekRange || 'DATE RANGE NOT AVAILABLE'}</p>
                </div>
              </div>

              <div className="shareable-events-list">
                {sortedDays.length === 0 ? (
                  <div className="no-events-message-shareable">
                    <p>No events scheduled for this week.</p>
                  </div>
                ) : (
                  sortedDays.map((dayKey, dayIndex) => {
                    const dayData = groupedEvents[dayKey];
                    
                    // Debug: Log day data
                    console.log('Day data:', { dayKey, dayNum: dayData.dayNum, dayName: dayData.dayName });
                    
                    return (
                      <div key={dayKey} className="shareable-day-section">
                        <div className="day-section-wrapper" style={{ background: getDayColor(dayIndex) }}>
                          <div className="day-date-badge">
                            <div className="day-number">{dayData.dayNum || '??'}</div>
                            <div className="day-name">{dayData.dayName || 'DAY'}</div>
                          </div>
                          
                          <div className="day-events-content">
                            {dayData.events.map((event, index) => {
                              // Define color classes for different event types
                              const eventColorClass = index === 0 ? 'event-primary' : 
                                                     index === 1 ? 'event-secondary' : 
                                                     'event-tertiary';
                              
                              return (
                                <div key={index} className={`event-line ${eventColorClass}`}>
                                  <span className="event-title-main">{event.title}</span>
                                  <span className="event-time-main">
                                    {event.time ? formatTo12Hour(event.time) : ''}
                                    {event.location ? ` @ ${event.location}` : ''}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="contact-card-shareable">
                <div className="contact-badge">FOR MORE DETAILS</div>
                <p>PR Johnson George : 9284333603</p>
              </div>
            </div>
          </div>
        </div>

        <div className="shareable-actions">
          <button className="btn-download" onClick={downloadAsImage}>
            💾 Download as Image
          </button>
          <button className="btn-share" onClick={shareAsWhatsApp}>
            📱 Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareableWeeklyEvents;
