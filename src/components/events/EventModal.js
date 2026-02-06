import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addEvent, updateEvent } from '../../redux/slices/eventSlice';
import { createEvent, updateEvent as updateEventService } from '../../services/eventService.firebase';

const EventModal = ({ event, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'worship',
    zoomLink: '',
    isRecurring: false,
    recurringPattern: 'weekly',
    recurringEndDate: '',
    recurringDays: [],
  });

  useEffect(() => {
    if (event) setFormData(event);
  }, [event]);

  const generateRecurringEvents = () => {
    if (!formData.isRecurring) return [formData];
    
    const events = [];
    const startDate = new Date(formData.date);
    const endDate = new Date(formData.recurringEndDate);
    
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      if (formData.recurringPattern === 'daily') {
        events.push({
          ...formData,
          date: currentDate.toISOString().split('T')[0],
          isRecurring: false,
        });
        currentDate.setDate(currentDate.getDate() + 1);
      } else if (formData.recurringPattern === 'weekly') {
        if (formData.recurringDays.length > 0) {
          // Specific days of week
          const dayOfWeek = currentDate.getDay();
          if (formData.recurringDays.includes(dayOfWeek)) {
            events.push({
              ...formData,
              date: currentDate.toISOString().split('T')[0],
              isRecurring: false,
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        } else {
          // Same day every week
          events.push({
            ...formData,
            date: currentDate.toISOString().split('T')[0],
            isRecurring: false,
          });
          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else if (formData.recurringPattern === 'monthly') {
        events.push({
          ...formData,
          date: currentDate.toISOString().split('T')[0],
          isRecurring: false,
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    
    return events;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (event) {
        const updated = await updateEventService(event.id, formData);
        dispatch(updateEvent(updated));
      } else {
        const eventsToCreate = generateRecurringEvents();
        for (const eventData of eventsToCreate) {
          const created = await createEvent(eventData);
          dispatch(addEvent(created));
        }
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to save event');
    }
  };

  const handleDayToggle = (dayIndex) => {
    const days = [...formData.recurringDays];
    const index = days.indexOf(dayIndex);
    if (index > -1) {
      days.splice(index, 1);
    } else {
      days.push(dayIndex);
    }
    setFormData({...formData, recurringDays: days.sort()});
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Add New Event'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Event Title *</label>
            <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date *</label>
              <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Time *</label>
              <input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Type *</label>
              <select value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                <option value="worship">Worship</option>
                <option value="youth">Youth</option>
                <option value="special">Special</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Zoom Link (Optional)</label>
            <input 
              type="url" 
              placeholder="https://zoom.us/j/your-meeting-id" 
              value={formData.zoomLink} 
              onChange={(e) => setFormData({...formData, zoomLink: e.target.value})} 
            />
            <small style={{color: '#718096', marginTop: '4px', display: 'block'}}>Enter the Zoom meeting link if this event will be held online</small>
          </div>
          
          {!event && (
            <>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={formData.isRecurring} 
                    onChange={(e) => setFormData({...formData, isRecurring: e.target.checked})} 
                  />
                  <span>Recurring Event</span>
                </label>
              </div>
              
              {formData.isRecurring && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Repeat Pattern *</label>
                      <select value={formData.recurringPattern} onChange={(e) => setFormData({...formData, recurringPattern: e.target.value})}>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>End Date *</label>
                      <input 
                        type="date" 
                        value={formData.recurringEndDate} 
                        onChange={(e) => setFormData({...formData, recurringEndDate: e.target.value})} 
                        min={formData.date}
                        required 
                      />
                    </div>
                  </div>
                  
                  {formData.recurringPattern === 'weekly' && (
                    <div className="form-group">
                      <label>Repeat on (optional - leave empty for same day every week)</label>
                      <div className="days-selector">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`day-btn ${formData.recurringDays.includes(index) ? 'active' : ''}`}
                            onClick={() => handleDayToggle(index)}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{event ? 'Update' : 'Add Event'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
