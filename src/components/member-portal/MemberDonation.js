/**
 * Member Donation Component
 * Allows members to make donations through various payment methods
 */

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { createDonation } from '../../services/donationService.firebase';
import './MemberDonation.css';

const MemberDonation = () => {
  const { member } = useSelector((state) => state.memberPortal);
  const [donationType, setDonationType] = useState('one-time');
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [category, setCategory] = useState('general');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states for different payment methods
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    bankName: ''
  });
  
  const [upiDetails, setUpiDetails] = useState({
    provider: 'googlepay',
    upiId: ''
  });
  
  const [netbankingDetails, setNetbankingDetails] = useState({
    bankName: '',
    accountType: 'savings'
  });
  
  const [paytmDetails, setPaytmDetails] = useState({
    phoneNumber: ''
  });

  const quickAmounts = [100, 250, 500, 1000, 2500, 5000];
  
  const donationCategories = [
    { value: 'general', label: 'General Fund', icon: '🏛️' },
    { value: 'building', label: 'Building Fund', icon: '🏗️' },
    { value: 'missions', label: 'Missions', icon: '🌍' },
    { value: 'youth', label: 'Youth Ministry', icon: '👦' },
    { value: 'charity', label: 'Charity', icon: '❤️' },
    { value: 'Tithe', label: 'Tithe', icon: '📖' }
  ];

  const paymentMethods = [
    { value: 'upi', label: 'UPI (Google Pay/PhonePe)', icon: '📱' },
    // { value: 'card', label: 'Credit/Debit Card', icon: '💳' }, // Disabled for now
    // { value: 'netbanking', label: 'Net Banking', icon: '🏦' }, // Disabled for now
    // { value: 'paytm', label: 'Paytm Wallet', icon: '💰' }, // Disabled for now
    // { value: 'razorpay', label: 'Razorpay', icon: '💳' }, // Disabled for now
    { value: 'cash', label: 'Cash/Cheque', icon: '💵' }
  ];

  const upiProviders = [
    { value: 'googlepay', label: 'Google Pay' },
    { value: 'phonepe', label: 'PhonePe' },
    { value: 'paytm', label: 'Paytm UPI' },
    { value: 'bhim', label: 'BHIM UPI' },
    { value: 'amazonpay', label: 'Amazon Pay' },
    { value: 'other', label: 'Other UPI Apps' }
  ];

  const indianBanks = [
    { value: 'sbi', label: 'State Bank of India' },
    { value: 'hdfc', label: 'HDFC Bank' },
    { value: 'icici', label: 'ICICI Bank' },
    { value: 'axis', label: 'Axis Bank' },
    { value: 'pnb', label: 'Punjab National Bank' },
    { value: 'canara', label: 'Canara Bank' },
    { value: 'other', label: 'Other Banks' }
  ];

  const handleAmountSelect = (value) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const handleCustomAmount = (e) => {
    setCustomAmount(e.target.value);
    setAmount('');
  };

  const getFinalAmount = () => {
    return customAmount || amount;
  };

  const openUpiApp = () => {
    const finalAmount = getFinalAmount();
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    const upiId = 'johnsonappusa@oksbi';
    const name = 'Indian Pentecostal Church of God';
    const amount = parseFloat(finalAmount).toFixed(2);
    const note = `${category} donation - ${member?.name || 'Anonymous'}`;
    
    // UPI deep link format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR&tn=NOTE
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    // Try to open UPI app
    window.location.href = upiUrl;
    
    // Fallback: show instruction if app doesn't open
    setTimeout(() => {
      alert(`If the UPI app didn't open automatically, please use UPI ID: ${upiId}\nAmount: ₹${amount}`);
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalAmount = getFinalAmount();
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    setLoading(true);

    try {
      const donationData = {
        amount: parseFloat(finalAmount),
        donor: isAnonymous ? 'Anonymous' : member?.name || 'Member',
        memberId: member?.id || null,
        category,
        paymentMethod,
        date: new Date().toISOString(),
        status: 'completed',
        notes: `${donationType} donation via member portal`
      };

      console.log('Creating donation with data:', donationData);
      console.log('Member object:', member);

      // Save to Firebase
      await createDonation(donationData);
      
      // Show success message
      alert(`✅ Thank you for your ${donationType} donation of ₹${finalAmount}!\n\nPayment Method: ${paymentMethod}\nCategory: ${category}`);
      
      // Reset form
      setAmount('');
      setCustomAmount('');
      setCardDetails({ cardNumber: '', cardName: '', expiryDate: '', cvv: '' });
      setBankDetails({ accountName: '', accountNumber: '', routingNumber: '', bankName: '' });
      setUpiDetails({ provider: 'googlepay', upiId: '' });
      setNetbankingDetails({ bankName: '', accountType: 'savings' });
      setPaytmDetails({ phoneNumber: '' });
    } catch (error) {
      console.error('Error processing donation:', error);
      alert('Failed to process donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="member-donation-container">
      <div className="donation-header">
        <h1>💝 Make a Donation</h1>
        <p>Your generosity helps us continue our mission and serve the community</p>
      </div>

      <form onSubmit={handleSubmit} className="donation-form">
        {/* Donation Type */}
        <div className="form-section">
          <h3>Donation Type</h3>
          <div className="donation-type-selector">
            <button
              type="button"
              className={`type-btn ${donationType === 'one-time' ? 'active' : ''}`}
              onClick={() => setDonationType('one-time')}
            >
              <span className="type-icon">🎁</span>
              <span>One-Time</span>
            </button>
            <button
              type="button"
              className={`type-btn ${donationType === 'recurring' ? 'active' : ''}`}
              onClick={() => setDonationType('recurring')}
            >
              <span className="type-icon">🔄</span>
              <span>Monthly</span>
            </button>
          </div>
        </div>

        {/* Donation Category */}
        <div className="form-section">
          <h3>Donation Category</h3>
          <div className="category-grid">
            {donationCategories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                className={`category-btn ${category === cat.value ? 'active' : ''}`}
                onClick={() => setCategory(cat.value)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Amount Selection */}
        <div className="form-section">
          <h3>Donation Amount</h3>
          <div className="amount-grid">
            {quickAmounts.map((amt) => (
              <button
                key={amt}
                type="button"
                className={`amount-btn ${amount === amt.toString() ? 'active' : ''}`}
                onClick={() => handleAmountSelect(amt)}
              >
                ₹{amt}
              </button>
            ))}
          </div>
          <div className="custom-amount">
            <label>Or enter custom amount:</label>
            <div className="amount-input-wrapper">
              <span className="currency-symbol">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={customAmount}
                onChange={handleCustomAmount}
                min="1"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="form-section">
          <h3>Payment Method</h3>
          <div className="payment-methods">
            {paymentMethods.map((method) => (
              <button
                key={method.value}
                type="button"
                className={`payment-btn ${paymentMethod === method.value ? 'active' : ''}`}
                onClick={() => setPaymentMethod(method.value)}
              >
                <span className="payment-icon">{method.icon}</span>
                <span>{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Details Forms */}
        {paymentMethod === 'card' && (
          <div className="form-section payment-details">
            <h3>Card Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                  maxLength="19"
                  required
                />
              </div>
              <div className="form-group full-width">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.cardName}
                  onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                  maxLength="5"
                  required
                />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'bank' && (
          <div className="form-section payment-details">
            <h3>Direct Bank Transfer (NEFT/RTGS/IMPS)</h3>
            <div className="payment-info-box">
              <h4>🏦 Church Bank Account Details:</h4>
              <div className="bank-details">
                <div className="detail-row">
                  <span className="detail-label">Account Name:</span>
                  <span className="detail-value">Indian Pentecostal Church of God</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Account Number:</span>
                  <span className="detail-value">1234567890123</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">IFSC Code:</span>
                  <span className="detail-value">SBIN0001234</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Bank:</span>
                  <span className="detail-value">State Bank of India</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Branch:</span>
                  <span className="detail-value">Naigaon, Mumbai</span>
                </div>
              </div>
              <p className="info-note">💡 Please use your name as reference when transferring.</p>
              <p>After completing the transfer, click "Complete Donation" to record your contribution.</p>
            </div>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Transaction Reference Number (After Transfer)</label>
                <input
                  type="text"
                  placeholder="Enter UTR/Reference Number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {paymentMethod === 'upi' && (
          <div className="form-section payment-details">
            <h3>UPI Payment Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Select UPI App</label>
                <select
                  value={upiDetails.provider}
                  onChange={(e) => setUpiDetails({ ...upiDetails, provider: e.target.value })}
                  required
                >
                  {upiProviders.map((provider) => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Your UPI ID (Optional for receipt)</label>
                <input
                  type="text"
                  placeholder="yourname@paytm / yourname@oksbi"
                  value={upiDetails.upiId}
                  onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                />
              </div>
            </div>
            <div className="payment-info-box">
              <h4>📱 Church UPI ID:</h4>
              <div className="wallet-address">
                <code>johnsonappusa@oksbi</code>
                <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText('johnsonappus@oksbi')}>
                  📋 Copy
                </button>
              </div>
              <button 
                type="button" 
                className="upi-pay-btn"
                onClick={openUpiApp}
                disabled={!getFinalAmount()}
              >
                💳 Pay with UPI App
              </button>
              <p className="info-note">💸 Click the button above to open your UPI app, or manually use the UPI ID.</p>
              <p>You will receive a confirmation once the payment is completed.</p>
            </div>
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="form-section payment-details">
            <h3>Net Banking Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Select Your Bank</label>
                <select
                  value={netbankingDetails.bankName}
                  onChange={(e) => setNetbankingDetails({ ...netbankingDetails, bankName: e.target.value })}
                  required
                >
                  <option value="">Choose your bank</option>
                  {indianBanks.map((bank) => (
                    <option key={bank.value} value={bank.value}>
                      {bank.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group full-width">
                <label>Account Type</label>
                <select
                  value={netbankingDetails.accountType}
                  onChange={(e) => setNetbankingDetails({ ...netbankingDetails, accountType: e.target.value })}
                  required
                >
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>
            </div>
            <div className="payment-info-box">
              <p>🏦 You will be redirected to your bank's secure login page.</p>
              <p className="info-note">Make sure you have your net banking credentials ready.</p>
            </div>
          </div>
        )}

        {paymentMethod === 'paytm' && (
          <div className="form-section payment-details">
            <h3>Paytm Wallet</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Paytm Registered Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={paytmDetails.phoneNumber}
                  onChange={(e) => setPaytmDetails({ ...paytmDetails, phoneNumber: e.target.value })}
                  maxLength="10"
                  required
                />
              </div>
            </div>
            <div className="payment-info-box">
              <p>💰 You will receive a payment request on your Paytm app.</p>
              <p className="info-note">Make sure you have sufficient balance in your Paytm wallet.</p>
            </div>
          </div>
        )}

        {paymentMethod === 'razorpay' && (
          <div className="form-section payment-details">
            <div className="payment-info-box">
              <p>💳 You will be redirected to Razorpay's secure payment gateway.</p>
              <p className="info-note">Accepts UPI, Cards, Net Banking, and Wallets.</p>
              <p>Razorpay is India's most trusted payment gateway with bank-level security.</p>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="form-section payment-details">
            <div className="payment-info-box">
              <h4>💵 Mail Your Check To:</h4>
              <address>
                Indian Pentecostal Church of God<br />
                Naigaon<br />
                Mumbai, Maharashtra
              </address>
              <p className="info-note">Make checks payable to "Indian Pentecostal Church of God"</p>
              <p>Or visit our office during business hours to donate in person.</p>
            </div>
          </div>
        )}

        {/* Anonymous Option */}
        <div className="form-section">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <span>Make this donation anonymous</span>
          </label>
        </div>

        {/* Summary */}
        <div className="donation-summary">
          <h3>Donation Summary</h3>
          <div className="summary-row">
            <span>Amount:</span>
            <strong>₹{getFinalAmount() || '0.00'}</strong>
          </div>
          <div className="summary-row">
            <span>Type:</span>
            <strong>{donationType === 'one-time' ? 'One-Time' : 'Monthly Recurring'}</strong>
          </div>
          <div className="summary-row">
            <span>Category:</span>
            <strong>{donationCategories.find(c => c.value === category)?.label}</strong>
          </div>
          <div className="summary-row">
            <span>Payment:</span>
            <strong>{paymentMethods.find(p => p.value === paymentMethod)?.label}</strong>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading || !getFinalAmount()}
        >
          {loading ? '⏳ Processing...' : `💝 ${paymentMethod === 'cash' ? 'Record' : 'Complete'} Donation`}
        </button>

        <p className="secure-note">
          🔒 All transactions are secure and encrypted. Your financial information is safe with us.
        </p>
      </form>
    </div>
  );
};

export default MemberDonation;
