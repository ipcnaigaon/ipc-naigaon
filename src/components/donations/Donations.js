import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDonations } from '../../redux/slices/donationSlice';
import { getAllDonations } from '../../services/donationService.firebase';
import AddDonationModal from './AddDonationModal';
import './Donations.css';

const Donations = () => {
  const dispatch = useDispatch();
  const { filteredDonations, totalAmount, monthlyTotal } = useSelector((state) => state.donations);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    const data = await getAllDonations();
    dispatch(setDonations(data));
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Tithe', label: 'Tithe' },
    { value: 'Offering', label: 'Offering' },
    { value: 'Building Fund', label: 'Building Fund' },
    { value: 'Mission', label: 'Mission' },
    { value: 'general', label: 'General Fund' },
    { value: 'building', label: 'Building' },
    { value: 'missions', label: 'Missions' },
    { value: 'youth', label: 'Youth Ministry' },
    { value: 'charity', label: 'Charity' }
  ];

  const getFilteredData = () => {
    return filteredDonations.filter(donation => {
      const matchesCategory = selectedCategory === 'all' || donation.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        donation.donor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const displayedDonations = getFilteredData();
  
  const filteredTotal = displayedDonations.reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="donations-page">
      <div className="page-header">
        <h1>Donation Tracking</h1>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ➕ Add Donation
        </button>
      </div>
      <div className="donation-stats">
        <div className="stat-box">
          <h3>Total Donations</h3>
          <p className="stat-value">₹{totalAmount.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>This Month</h3>
          <p className="stat-value">₹{monthlyTotal.toLocaleString()}</p>
        </div>
        <div className="stat-box">
          <h3>Filtered Total</h3>
          <p className="stat-value">₹{filteredTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="donations-filters">
        <div className="filter-group">
          <label>Search Donor:</label>
          <input
            type="text"
            placeholder="Search by donor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div className="filter-results">
          Showing {displayedDonations.length} of {filteredDonations.length} donations
        </div>
      </div>

      <div className="donations-table-container">
        <table className="donations-table">
          <thead>
            <tr>
              <th>Donor</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {displayedDonations.length > 0 ? (
              displayedDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>{donation.donor || donation.donorName || 'Anonymous'}</td>
                  <td className="amount">₹{donation.amount}</td>
                  <td><span className={`badge ${donation.category}`}>{donation.category}</span></td>
                  <td>{new Date(donation.date).toLocaleDateString()}</td>
                  <td>{donation.paymentMethod}</td>
                  <td>{donation.notes || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                  No donations found matching your filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Donation Modal */}
      {showAddModal && (
        <AddDonationModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadDonations}
        />
      )}
    </div>
  );
};

export default Donations;
