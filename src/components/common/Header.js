/**
 * Header Component
 * Top navigation bar with notifications and user menu
 */

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/slices/authSlice';
import { toggleNotifications } from '../../redux/slices/notificationSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleNotificationClick = () => {
    dispatch(toggleNotifications());
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button" onClick={toggleSidebar}>
          ☰
        </button>
        <h1 className="header-title">Indian Pentecostal Church of God - Bethel Church, Naigaon East</h1>
      </div>

      <div className="header-right">
        {/* Search Bar */}
        <div className="search-bar">
          <input type="text" placeholder="Search..." />
        </div>

        {/* Notifications */}
        <div className="notification-icon" onClick={handleNotificationClick}>
          <span className="icon">🔔</span>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>
        <NotificationDropdown />

        {/* User Menu */}
        <div className="user-menu">
          <button
            className="user-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="dropdown-arrow">▼</span>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <p className="user-name-full">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
              <hr />
              <button onClick={() => navigate('/settings')}>⚙️ Settings</button>
              <button onClick={() => navigate('/profile')}>👤 Profile</button>
              <hr />
              <button onClick={handleLogout} className="logout-btn">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
