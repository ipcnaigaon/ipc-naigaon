/**
 * Testimonials Management Component
 * Admin interface for managing testimonials
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  getAllTestimonials, 
  deleteTestimonial 
} from '../../services/testimonialService.firebase';
import './TestimonialsManagement.css';

const TestimonialsManagement = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Load testimonials
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Loading testimonials from admin panel...');
      const data = await getAllTestimonials();
      console.log('Loaded testimonials:', data);
      setTestimonials(data);
      
      if (data.length === 0) {
        console.log('No testimonials found in database');
      }
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setError('Failed to load testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteTestimonial(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      setDeleteConfirm(null);
      setError('');
    } catch (err) {
      setError('Failed to delete testimonial: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="testimonials-management-container">
      <div className="management-header">
        <div className="header-content">
          <h1>Manage Testimonials</h1>
          <p>Create, edit, and manage member testimonials displayed on the homepage</p>
        </div>
        <button 
          className="btn-new-testimonial"
          onClick={() => navigate('/admin/testimonials/new')}
        >
          + New Testimonial
        </button>
      </div>

      {error && <div className="management-error">{error}</div>}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search by name, role, or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && !testimonials.length ? (
        <div className="loading">Loading testimonials...</div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="no-data">
          <p>No testimonials found. Create your first testimonial!</p>
        </div>
      ) : (
        <div className="testimonials-table-wrapper">
          <table className="testimonials-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Content</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map(testimonial => (
                <tr key={testimonial.id}>
                  <td className="name-cell">
                    <strong>{testimonial.name}</strong>
                  </td>
                  <td className="role-cell">{testimonial.role}</td>
                  <td className="content-cell">
                    <div className="content-preview">
                      {testimonial.content.substring(0, 60)}...
                    </div>
                  </td>
                  <td className="date-cell">
                    {new Date(testimonial.createdAt).toLocaleDateString()}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/testimonials/${testimonial.id}`)}
                      title="Edit testimonial"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => setDeleteConfirm(testimonial.id)}
                      title="Delete testimonial"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="confirmation-modal" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Delete Testimonial?</h3>
            <p>This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManagement;
