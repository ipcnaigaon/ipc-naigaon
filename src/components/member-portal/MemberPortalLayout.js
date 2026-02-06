/**
 * Member Portal Layout Component
 */

import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/memberPortalSlice';
import { toggleNotifications } from '../../redux/slices/notificationSlice';
import NotificationDropdown from '../notifications/NotificationDropdown';
import churchLogo from '../../assets/ipc-logo.png';
import './MemberPortalLayout.css';

const MemberPortalLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { member } = useSelector((state) => state.memberPortal);
  const { notifications } = useSelector((state) => state.notifications);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/member-portal/login');
  };

  const navigateTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const handleNotificationToggle = () => {
    dispatch(toggleNotifications());
  };

  return (
    <div className="member-portal-layout">
      {/* Mobile Sidebar */}
      <aside className={`member-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src={churchLogo} alt="IPC Naigaon Mumbai" className="sidebar-logo-image" />
            <h2>IPC Naigaon</h2>
          </div>
          <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          <button onClick={() => navigateTo('/member-portal/dashboard')} className="nav-link">
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button onClick={() => navigateTo('/member-portal/events')} className="nav-link">
            <span className="nav-icon">📅</span>
            <span className="nav-text">Events</span>
          </button>
          <button onClick={() => navigateTo('/member-portal/donate')} className="nav-link">
            <span className="nav-icon">💝</span>
            <span className="nav-text">Donate</span>
          </button>
          <button onClick={() => navigateTo('/member-portal/donation-history')} className="nav-link">
            <span className="nav-icon">📜</span>
            <span className="nav-text">History</span>
          </button>
          <button onClick={() => navigateTo('/member-portal/change-password')} className="nav-link">
            <span className="nav-icon">🔐</span>
            <span className="nav-text">Change Password</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Header */}
      <header className="member-portal-nav">
        <div className="member-portal-nav-left">
          <div className="member-portal-logo">
            <img src={churchLogo} alt="IPC Naigaon" className="logo-image" />
            <h2>Indian Pentecostal Church of God - Bethel Church, Naigaon East</h2>
          </div>
          <nav className="member-nav-links">
            <button onClick={() => navigateTo('/member-portal/dashboard')} className="nav-link">
              📊 Dashboard
            </button>
            <button onClick={() => navigateTo('/member-portal/events')} className="nav-link">
              📅 Events
            </button>
            <button onClick={() => navigateTo('/member-portal/donate')} className="nav-link">
              💝 Donate
            </button>
            <button onClick={() => navigateTo('/member-portal/donation-history')} className="nav-link">
              📜 History
            </button>
            <button onClick={() => navigateTo('/member-portal/change-password')} className="nav-link">
              🔐 Change Password
            </button>
          </nav>
        </div>
        <div className="member-portal-nav-right">
          <div className="member-center">
            <span className="member-name">Welcome, {member?.name}</span>
            <div className="notification-container">
              <button className="notification-bell" onClick={handleNotificationToggle}>
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              <NotificationDropdown />
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </header>

      {/* Main content */}
      <main className="member-portal-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberPortalLayout;
