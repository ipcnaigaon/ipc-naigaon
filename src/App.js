/**
 * Main App Component
 * Configures routing and Redux provider
 */

import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store/store';
import { loginSuccess } from './redux/slices/authSlice';
import { verifyToken } from './services/authService.firebase';

// Components
import HomePage from './components/home/HomePage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';
import Layout from './components/common/Layout';
import Dashboard from './components/dashboard/Dashboard';
import Members from './components/members/Members';
import Events from './components/events/Events';
import WeeklyEvents from './components/events/WeeklyEvents';
import Donations from './components/donations/Donations';
import Settings from './components/settings/Settings';
import ChangePassword from './components/settings/ChangePassword';
import UserManagement from './components/users/UserManagement';
import ResourcesManager from './components/resources/ResourcesManager';
import ArticleDetailPage from './components/articles/ArticleDetailPage';
import TestimonialsManagement from './components/testimonials/TestimonialsManagement';
import TestimonialForm from './components/testimonials/TestimonialForm';
import CelebrationsPage from './components/celebrations/CelebrationsPage';

// Member Portal Components
import MemberPortalLogin from './components/member-portal/MemberPortalLogin';
import MemberProtectedRoute from './components/member-portal/MemberProtectedRoute';
import MemberPortalLayout from './components/member-portal/MemberPortalLayout';
import MemberPortalDashboard from './components/member-portal/MemberPortalDashboard';
import MemberDonation from './components/member-portal/MemberDonation';
import MemberDonationHistory from './components/member-portal/MemberDonationHistory';
import MemberEvents from './components/member-portal/MemberEvents';
import MemberChangePassword from './components/member-portal/MemberChangePassword';
import MemberSignup from './components/member-portal/MemberSignup';

// Admin Components
import AdminMemberApprovals from './components/admin/AdminMemberApprovals';

import './App.css';

// App initialization wrapper
const AppInit = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await verifyToken();
          if (user) {
            // verifyToken now returns user object directly
            dispatch(loginSuccess({ user, token }));
          } else {
            // Token invalid, clear localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    };

    checkAuth();
  }, [dispatch]);

  return children;
};
function App() {
  const basename = '/';

  return (
    <Provider store={store}>
      <AppInit>
        <Router>
          <Routes>
            {/* Home Page */}
            <Route path="/" element={<HomePage />} />
            
            {/* Public Pages */}
            <Route path="/celebrations" element={<CelebrationsPage />} />
            
            {/* Article Detail Page */}
            <Route path="/article/:id" element={<ArticleDetailPage />} />

            {/* Admin Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Member Portal Public Routes */}
            <Route path="/member-portal/login" element={<MemberPortalLogin />} />
            <Route path="/member-portal/signup" element={<MemberSignup />} />

            {/* Member Portal Protected Routes */}
            <Route
              path="/member-portal"
              element={
                <MemberProtectedRoute>
                  <MemberPortalLayout />
                </MemberProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/member-portal/dashboard" replace />} />
              <Route path="dashboard" element={<MemberPortalDashboard />} />
              <Route path="donate" element={<MemberDonation />} />
              <Route path="donation-history" element={<MemberDonationHistory />} />
              <Route path="events" element={<MemberEvents />} />
              <Route path="change-password" element={<MemberChangePassword />} />
            </Route>

            {/* Admin Protected Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route 
                path="members" 
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <Members />
                  </RoleGuard>
                } 
              />
              <Route 
                path="member-approvals" 
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <AdminMemberApprovals />
                  </RoleGuard>
                } 
              />
              <Route 
                path="events" 
                element={
                  <RoleGuard allowedRoles={['admin', 'events_manager']}>
                    <Events />
                  </RoleGuard>
                } 
              />
              <Route 
                path="weekly-events" 
                element={
                  <RoleGuard allowedRoles={['admin', 'events_manager']}>
                    <WeeklyEvents />
                  </RoleGuard>
                } 
              />
              <Route 
                path="donations" 
                element={
                  <RoleGuard allowedRoles={['admin', 'finance_manager']}>
                    <Donations />
                  </RoleGuard>
                } 
              />
              <Route 
                path="users" 
                element={
                  <RoleGuard allowedRoles={['admin']}>
                    <UserManagement />
                  </RoleGuard>
                } 
              />
              <Route 
                path="resources" 
                element={
                  <RoleGuard allowedRoles={['admin', 'resource_manager']}>
                    <ResourcesManager />
                  </RoleGuard>
                } 
              />
              <Route 
                path="testimonials" 
                element={
                  <RoleGuard allowedRoles={['admin', 'content_manager']}>
                    <TestimonialsManagement />
                  </RoleGuard>
                } 
              />
              <Route 
                path="testimonials/new" 
                element={
                  <RoleGuard allowedRoles={['admin', 'content_manager']}>
                    <TestimonialForm />
                  </RoleGuard>
                } 
              />
              <Route 
                path="testimonials/:id" 
                element={
                  <RoleGuard allowedRoles={['admin', 'content_manager']}>
                    <TestimonialForm />
                  </RoleGuard>
                } 
              />
              <Route path="settings" element={<Settings />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppInit>
    </Provider>
  );
}

export default App;
