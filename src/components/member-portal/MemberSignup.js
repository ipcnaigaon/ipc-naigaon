/**
 * Member Signup Component
 * Allows potential members to sign up for portal access
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMemberSignup } from '../../services/memberService.firebase';
import './MemberSignup.css';

const MemberSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    dateOfJoining: '',
    maritalStatus: '',
    marriageDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const validateForm = () => {
    if (!formData.name || !formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email || !formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone || !formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.phone.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    if (!formData.gender || !formData.gender.trim()) {
      setError('Gender is required');
      return false;
    }
    if (!formData.dateOfBirth || !formData.dateOfBirth.trim()) {
      setError('Date of Birth is required');
      return false;
    }
    if (!formData.dateOfJoining || !formData.dateOfJoining.trim()) {
      setError('Date of Joining is required');
      return false;
    }
    if (!formData.maritalStatus || !formData.maritalStatus.trim()) {
      setError('Marital Status is required');
      return false;
    }
    if (formData.maritalStatus === 'married' && (!formData.marriageDate || !formData.marriageDate.trim())) {
      setError('Marriage Date is required for married members');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createMemberSignup({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.trim(),
        gender: formData.gender.trim(),
        dateOfBirth: formData.dateOfBirth.trim(),
        dateOfJoining: formData.dateOfJoining.trim(),
        maritalStatus: formData.maritalStatus.trim(),
        marriageDate: formData.maritalStatus === 'married' ? formData.marriageDate.trim() : null,
      });

      setSignupEmail(formData.email);
      setFormData({
        name: '',
        email: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        dateOfJoining: '',
        maritalStatus: '',
        marriageDate: '',
      });
      setShowApprovalPopup(true);
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClosePopup = () => {
    setShowApprovalPopup(false);
    navigate('/member-portal/login');
  };

  return (
    <div className="member-signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>🙏 Member Registration</h1>
          <p>Join Indian Pentecostal Church of God - Bethel Church, Naigaon East</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dateOfJoining">Date of Joining</label>
            <input
              type="date"
              id="dateOfJoining"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus">Marital Status</label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              disabled={loading}
              required
            >
              <option value="">Select Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>

          {formData.maritalStatus === 'married' && (
            <div className="form-group">
              <label htmlFor="marriageDate">Marriage Date</label>
              <input
                type="date"
                id="marriageDate"
                name="marriageDate"
                value={formData.marriageDate}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          )}

          <button type="submit" className="btn-signup" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="signup-footer">
          <p>Already registered?</p>
          <button
            type="button"
            className="btn-login-link"
            onClick={() => navigate('/member-portal/login')}
          >
            Sign In
          </button>
        </div>

        <div className="signup-info">
          <h3>📋 Registration Process</h3>
          <ol>
            <li>Complete the registration form above</li>
            <li>Your registration will be reviewed by church administrators</li>
            <li>Once approved, you'll receive confirmation</li>
            <li>You can then sign in with your email and password (set by admin)</li>
          </ol>
        </div>
      </div>

      {/* Approval Popup */}
      {showApprovalPopup && (
        <div className="popup-overlay" onClick={handleClosePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-icon">✅</div>
            <h2>Registration Submitted!</h2>
            <p>
              Thank you for registering, <strong>{formData.name || 'Member'}</strong>!
            </p>
            <div className="popup-message">
              <p>
                Your registration has been submitted and is <strong>subject to church administrator approval</strong>.
              </p>
              <p>
                A confirmation email will be sent to <strong>{signupEmail}</strong> once your account is approved.
              </p>
              <p>
                Until then, please check back or contact the church office for updates.
              </p>
            </div>
            <button onClick={handleClosePopup} className="btn-popup-close">
              Go to Member Portal Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberSignup;
