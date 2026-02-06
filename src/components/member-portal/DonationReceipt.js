/**
 * Donation Receipt Component
 * Displays and allows printing of donation receipts
 */

import React from 'react';
import './DonationReceipt.css';
import churchLogo from '../../assets/ipc-logo.png';

const DonationReceipt = ({ donation, member, onClose }) => {
  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const generateReceiptNumber = () => {
    return donation.receiptNumber || `RCP-${donation.id?.substring(0, 8).toUpperCase()}`;
  };

  return (
    <div className="receipt-modal-overlay" onClick={onClose}>
      <div className="receipt-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="receipt-close-btn" onClick={onClose}>×</button>
        
        <div className="receipt-container" id="receipt-print">
          {/* Church Header */}
          <div className="receipt-header">
            <h1>Indian Pentecostal Church of God</h1>
            <p className="church-address">
              2nd Floor, Mak Tower, 5705/4, National Highway<br />
              Near Kartika Park Hotel, Kazhakuttam<br />
              Vadakkumbhagam, Kazhakkoottam<br />
              Thiruvananthapuram, Kerala 695582
            </p>
            <p className="receipt-subtitle">Donation Receipt</p>
          </div>

          {/* Receipt Details */}
          <div className="receipt-info-bar">
            <div className="receipt-number">
              <strong>Receipt #:</strong> {generateReceiptNumber()}
            </div>
            <div className="receipt-date">
              <strong>Date:</strong> {new Date(donation.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Donor Information */}
          <div className="receipt-section">
            <h3>Received From:</h3>
            <div className="receipt-details">
              <p><strong>Name:</strong> {donation.donor || member?.name || 'Anonymous'}</p>
              {member?.email && <p><strong>Email:</strong> {member.email}</p>}
              {member?.phone && <p><strong>Phone:</strong> {member.phone}</p>}
              {member?.address && <p><strong>Address:</strong> {member.address}</p>}
            </div>
          </div>

          {/* Donation Details */}
          <div className="receipt-section">
            <h3>Donation Details:</h3>
            <table className="receipt-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Payment Method</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{donation.category} Fund</td>
                  <td>{donation.paymentMethod}</td>
                  <td className="receipt-amount">₹{donation.amount.toFixed(2)}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2"><strong>Total Amount:</strong></td>
                  <td className="receipt-total"><strong>₹{donation.amount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Additional Information */}
          {donation.notes && (
            <div className="receipt-section">
              <h3>Notes:</h3>
              <p>{donation.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="receipt-footer">
            <p>Thank you for your generous contribution!</p>
            <p className="receipt-signature">Church Administrator</p>
            <p className="receipt-disclaimer">
              This is an official receipt for your records. For any queries, please contact the church office.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions">
          <button className="btn-print" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>
          <button className="btn-close-receipt" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationReceipt;
