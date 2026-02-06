/**
 * Add Donation Modal Component
 * Allows admin to add donations for members
 */

import React, { useState, useEffect } from 'react';
import { getAllMembers } from '../../services/memberService.firebase';
import { createDonation } from '../../services/donationService.firebase';
import './AddDonationModal.css';

const AddDonationModal = ({ onClose, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    amount: '',
    category: 'Tithe',
    paymentMethod: 'Cash',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const data = await getAllMembers();
      setMembers(data.filter(m => m.status === 'active'));
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleMemberChange = (e) => {
    const memberId = e.target.value;
    const member = members.find(m => m.id === memberId);
    setFormData({
      ...formData,
      memberId,
      memberName: member ? member.name : ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.memberId || !formData.amount) {
      alert('Please select a member and enter amount');
      return;
    }

    setLoading(true);
    try {
      const donationData = {
        memberId: formData.memberId,
        donor: formData.memberName,
        amount: parseFloat(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        date: new Date(formData.date).toISOString(),
        status: 'completed',
        notes: formData.notes || 'Added by admin'
      };

      await createDonation(donationData);
      alert('Donation added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding donation:', error);
      alert('Failed to add donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-donation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Donation</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Select Member *</label>
            <select
              value={formData.memberId}
              onChange={handleMemberChange}
              required
              className="form-select"
            >
              <option value="">-- Select a member --</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.email})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="Tithe">Tithe</option>
                <option value="Offering">Offering</option>
                <option value="Building Fund">Building Fund</option>
                <option value="Mission">Mission</option>
                <option value="general">General Fund</option>
                <option value="youth">Youth Ministry</option>
                <option value="charity">Charity</option>
              </select>
            </div>

            <div className="form-group">
              <label>Payment Method *</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                required
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cheque">Cheque</option>
                <option value="Google Pay">Google Pay</option>
                <option value="PhonePe">PhonePe</option>
                <option value="Paytm">Paytm</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="3"
              placeholder="Additional notes..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDonationModal;
