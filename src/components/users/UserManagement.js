/**
 * User Management Component
 * Allows admin to manage users and assign roles
 */

import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../config/firebase';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const roles = [
    { value: 'admin', label: 'Admin', description: 'Full system access' },
    { value: 'events_manager', label: 'Events Manager', description: 'Manage events and notifications' },
    { value: 'finance_manager', label: 'Finance Manager', description: 'Manage donations and finances' },
    { value: 'resource_manager', label: 'Resource Manager', description: 'Manage articles and resources' },
    { value: 'user', label: 'User', description: 'Basic access' },
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString(),
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      setEditingUser(null);
      alert('User role updated successfully');
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Failed to update user role');
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-admin';
      case 'events_manager': return 'badge-events';
      case 'finance_manager': return 'badge-finance';
      case 'resource_manager': return 'badge-resources';
      default: return 'badge-user';
    }
  };

  const getRoleLabel = (role) => {
    const roleObj = roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };

  const handleCreateAdminChange = (e) => {
    setAdminFormData({
      ...adminFormData,
      [e.target.name]: e.target.value,
    });
    setFormError('');
  };

  const validateAdminForm = () => {
    if (!adminFormData.name.trim()) {
      setFormError('Full name is required');
      return false;
    }
    if (!adminFormData.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(adminFormData.email)) {
      setFormError('Please enter a valid email address');
      return false;
    }
    if (!adminFormData.password) {
      setFormError('Password is required');
      return false;
    }
    if (adminFormData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return false;
    }
    if (adminFormData.password !== adminFormData.confirmPassword) {
      setFormError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!validateAdminForm()) {
      return;
    }

    setFormLoading(true);
    setFormError('');

    try {
      const auth = getAuth();
      
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminFormData.email,
        adminFormData.password
      );

      const userId = userCredential.user.uid;

      // Create user document in Firestore
      await addDoc(collection(db, 'users'), {
        id: userId,
        email: adminFormData.email.toLowerCase(),
        name: adminFormData.name.trim(),
        role: 'admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Refresh users list
      await loadUsers();
      setAdminFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setShowCreateAdmin(false);
      alert('Admin user created successfully');
    } catch (error) {
      console.error('Error creating admin user:', error);
      if (error.code === 'auth/email-already-in-use') {
        setFormError('This email is already in use');
      } else {
        setFormError(error.message || 'Failed to create admin user');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleCloseCreateAdmin = () => {
    setShowCreateAdmin(false);
    setAdminFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setFormError('');
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>👤 User Management</h1>
        <p>Manage users and assign roles</p>
      </div>

      <div className="users-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="btn-create-admin"
          onClick={() => setShowCreateAdmin(true)}
        >
          ➕ Create Admin User
        </button>
      </div>

      <div className="role-info-cards">
        {roles.map(role => (
          <div key={role.value} className="role-info-card">
            <h4>{role.label}</h4>
            <p>{role.description}</p>
          </div>
        ))}
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td>
                  {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <div className="role-editor">
                      <select
                        defaultValue={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="role-select"
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditingUser(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-edit"
                      onClick={() => setEditingUser(user.id)}
                    >
                      Change Role
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>No users found</p>
          </div>
        )}
      </div>

      {showCreateAdmin && (
        <div className="modal-overlay" onClick={handleCloseCreateAdmin}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Admin User</h2>
              <button
                className="modal-close"
                onClick={handleCloseCreateAdmin}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="admin-form">
              {formError && <div className="error-message">{formError}</div>}

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={adminFormData.name}
                  onChange={handleCreateAdminChange}
                  placeholder="Enter full name"
                  disabled={formLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={adminFormData.email}
                  onChange={handleCreateAdminChange}
                  placeholder="Enter email address"
                  disabled={formLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={adminFormData.password}
                  onChange={handleCreateAdminChange}
                  placeholder="Create a password"
                  disabled={formLoading}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={adminFormData.confirmPassword}
                  onChange={handleCreateAdminChange}
                  placeholder="Confirm password"
                  disabled={formLoading}
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseCreateAdmin}
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-create"
                  disabled={formLoading}
                >
                  {formLoading ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
