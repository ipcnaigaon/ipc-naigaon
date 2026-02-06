/**
 * Member Modal Component
 * Form for adding/editing members
 */

import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMember, updateMember } from '../../redux/slices/memberSlice';
import { createMember, updateMember as updateMemberService } from '../../services/memberService.firebase';
import './MemberModal.css';

const MemberModal = ({ member, onClose, onSuccess, onRefresh }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
    dateOfBirth: '',
    address: '',
    joinDate: new Date().toISOString().split('T')[0],
    status: 'active',
    membershipType: 'regular',
    maritalStatus: '',
    marriageDate: '',
    hasPortalAccess: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      hasPortalAccess: e.target.checked,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (member) {
        const updated = await updateMemberService(member.id, formData);
        dispatch(updateMember(updated));
      } else {
        const created = await createMember(formData);
        dispatch(addMember(created));
        
        if (formData.hasPortalAccess && created.credentials) {
          alert(`✅ Member added successfully!\n\nPortal credentials have been automatically generated and emailed to ${formData.email}\n\nUsername: ${created.credentials.username}\nPassword: ${created.credentials.password}`);
        }
      }
      // Call the appropriate callback
      if (onSuccess) {
        onSuccess();
      } else if (onRefresh) {
        onRefresh();
      }
      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{member ? 'Edit Member' : 'Add New Member'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Join Date *</label>
              <input
                type="date"
                name="joinDate"
                value={formData.joinDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-group">
              <label>Membership Type *</label>
              <select
                name="membershipType"
                value={formData.membershipType}
                onChange={handleChange}
              >
                <option value="regular">Regular</option>
                <option value="leadership">Leadership</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Marital Status</label>
              <select
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>

            {formData.maritalStatus === 'married' && (
              <div className="form-group">
                <label>Marriage Date</label>
                <input
                  type="date"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>

          {!member && (
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.hasPortalAccess}
                  onChange={handleCheckboxChange}
                />
                <span>Create member portal access and send credentials via email</span>
              </label>
              {formData.hasPortalAccess && (
                <p className="help-text">
                  ✅ A secure username and password will be generated and emailed to the member automatically.
                </p>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : member ? 'Update' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
