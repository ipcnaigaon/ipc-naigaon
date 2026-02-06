/**
 * Member Portal Login Component
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../../redux/slices/memberPortalSlice';
import { memberLogin } from '../../services/memberPortalService';
import './MemberPortalLogin.css';

const MemberPortalLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.memberPortal);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await memberLogin(formData.username, formData.password);
      dispatch(loginSuccess(response.data));
      navigate('/member-portal/dashboard');
    } catch (err) {
      dispatch(loginFailure(err.message || 'Login failed'));
    }
  };

  return (
    <div className="member-portal-login-container">
      <div className="member-portal-login-card">
        <div className="member-portal-header">
          <h1>🙏 Member Portal</h1>
          <h2>Welcome Back</h2>
          <p>Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="member-portal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="signup-section">
            <p>Don't have an account? <button type="button" className="link-button-signup" onClick={() => navigate('/member-portal/signup')}>Register Here</button></p>
          </div>

          <div className="member-portal-footer">
            <button type="button" className="link-button" onClick={() => navigate('/login')}>
              Admin Login
            </button>
            <button type="button" className="home-link-button" onClick={() => navigate('/')}>
              <span className="home-icon">🏠</span>
              Back to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberPortalLogin;
