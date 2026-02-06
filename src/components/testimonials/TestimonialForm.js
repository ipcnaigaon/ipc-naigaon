/**
 * Testimonial Form Component
 * Admin interface for creating and editing testimonials
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  createTestimonial, 
  getTestimonialById, 
  updateTestimonial 
} from '../../services/testimonialService.firebase';
import './TestimonialForm.css';

const TestimonialForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load testimonial data if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadTestimonial();
    }
  }, [id]);

  const loadTestimonial = async () => {
    try {
      setLoading(true);
      const testimonial = await getTestimonialById(id);
      setFormData({
        name: testimonial.name || '',
        role: testimonial.role || '',
        content: testimonial.content || '',
      });
    } catch (err) {
      setError('Failed to load testimonial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.role.trim()) {
      setError('Role/Position is required');
      return false;
    }
    if (!formData.content.trim()) {
      setError('Testimonial content is required');
      return false;
    }
    if (formData.content.length < 20) {
      setError('Testimonial content must be at least 20 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (isEditMode) {
        await updateTestimonial(id, formData);
        setSuccess('Testimonial updated successfully!');
      } else {
        await createTestimonial(formData);
        setSuccess('Testimonial created successfully!');
        setFormData({ name: '', role: '', content: '' });
      }

      // Redirect after success
      setTimeout(() => {
        navigate('/admin/testimonials');
      }, 1500);
    } catch (err) {
      setError('Failed to save testimonial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/testimonials');
  };

  return (
    <div className="testimonial-form-container">
      <div className="form-header">
        <h1>{isEditMode ? 'Edit Testimonial' : 'Create New Testimonial'}</h1>
        <p>Share a member's faith story with our church community</p>
      </div>

      {error && <div className="form-error">{error}</div>}
      {success && <div className="form-success">{success}</div>}

      <form onSubmit={handleSubmit} className="testimonial-form">
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Br Leji, Sis Maria"
            maxLength="100"
            disabled={loading}
          />
          <span className="char-count">{formData.name.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role / Position *</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="e.g., Member since 2018, Youth Ministry, Children's Ministry"
            maxLength="100"
            disabled={loading}
          />
          <span className="char-count">{formData.role.length}/100</span>
        </div>

        <div className="form-group">
          <label htmlFor="content">Testimonial Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Share the testimonial content here. Be authentic and inspiring."
            rows="6"
            maxLength="500"
            disabled={loading}
          />
          <span className="char-count">{formData.content.length}/500</span>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : (isEditMode ? 'Update Testimonial' : 'Create Testimonial')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
