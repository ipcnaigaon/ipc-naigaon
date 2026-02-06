/**
 * Member Donation History Component
 * Displays donation history for logged-in member
 */

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getDonationsByMember } from '../../services/donationService.firebase';
import DonationReceipt from './DonationReceipt';
import './MemberDonationHistory.css';

const MemberDonationHistory = () => {
  const { member } = useSelector((state) => state.memberPortal);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    if (member?.id) {
      loadDonations();
    }
  }, [member]);

  const loadDonations = async () => {
    if (!member?.id) {
      console.log('No member ID found:', member);
      return;
    }
    
    console.log('Loading donations for member ID:', member.id);
    setLoading(true);
    try {
      const memberDonations = await getDonationsByMember(member.id);
      console.log('Fetched donations:', memberDonations);
      setDonations(memberDonations || []);
    } catch (error) {
      console.error('Error loading donations:', error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDonations = () => {
    return donations.reduce((sum, donation) => sum + donation.amount, 0);
  };

  const getFilteredDonations = () => {
    if (filterYear === 'all') return donations;
    
    return donations.filter(donation => {
      const year = new Date(donation.date).getFullYear();
      return year === parseInt(filterYear);
    });
  };

  const viewReceipt = (donation) => {
    setSelectedDonation(donation);
  };

  const closeReceipt = () => {
    setSelectedDonation(null);
  };

  if (loading) {
    return <div className="loading">Loading donation history...</div>;
  }

  const filteredDonations = getFilteredDonations();

  return (
    <div className="donation-history-container">
      <div className="history-header">
        <h2>📊 Your Donation History</h2>
        <div className="history-stats">
          <div className="stat-card">
            <span className="stat-label">Total Donations</span>
            <span className="stat-value">₹{getTotalDonations().toFixed(2)}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Transactions</span>
            <span className="stat-value">{donations.length}</span>
          </div>
        </div>
      </div>

      <div className="history-filters">
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="year-filter"
        >
          <option value="all">All Years</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
      </div>

      {filteredDonations.length > 0 ? (
        <div className="donations-list">
          {filteredDonations.map((donation) => (
            <div key={donation.id} className="donation-card">
              <div className="donation-info">
                <div className="donation-main">
                  <span className="donation-amount">₹{donation.amount.toFixed(2)}</span>
                  <span className="donation-category">{donation.category}</span>
                </div>
                <div className="donation-details">
                  <span className="donation-date">
                    📅 {new Date(donation.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="donation-method">💳 {donation.paymentMethod}</span>
                  <span className="donation-status">
                    {donation.status === 'completed' ? '✅ Completed' : '⏳ Pending'}
                  </span>
                </div>
              </div>
              <div className="donation-actions">
                <span className="receipt-number">#{donation.id?.substring(0, 8).toUpperCase()}</span>
                <button
                  className="btn-download"
                  onClick={() => viewReceipt(donation)}
                >
                  📄 View Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-donations">
          <p>No donations found for the selected period.</p>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedDonation && (
        <DonationReceipt
          donation={selectedDonation}
          member={member}
          onClose={closeReceipt}
        />
      )}
    </div>
  );
};

export default MemberDonationHistory;
