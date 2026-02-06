/**
 * Donation Service
 * Handles API calls for donation management
 */

// Mock data for demonstration
let mockDonations = [
  {
    id: 1,
    donorName: 'John Doe',
    amount: 500,
    type: 'tithe',
    date: '2025-12-15',
    paymentMethod: 'cash',
    notes: 'Regular tithe',
  },
  {
    id: 2,
    donorName: 'Jane Smith',
    amount: 250,
    type: 'offering',
    date: '2025-12-14',
    paymentMethod: 'card',
    notes: 'Sunday offering',
  },
  {
    id: 3,
    donorName: 'Michael Johnson',
    amount: 1000,
    type: 'special',
    date: '2025-12-10',
    paymentMethod: 'bank_transfer',
    notes: 'Building fund',
  },
  {
    id: 4,
    donorName: 'Sarah Williams',
    amount: 300,
    type: 'tithe',
    date: '2025-12-08',
    paymentMethod: 'card',
    notes: 'Monthly tithe',
  },
  {
    id: 5,
    donorName: 'Anonymous',
    amount: 2000,
    type: 'special',
    date: '2025-12-01',
    paymentMethod: 'cash',
    notes: 'Mission support',
  },
];

/**
 * Get all donations
 */
export const getAllDonations = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDonations;
};

/**
 * Get donation by ID
 */
export const getDonationById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDonations.find(d => d.id === parseInt(id));
};

/**
 * Create new donation
 */
export const createDonation = async (donationData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newDonation = {
    ...donationData,
    id: Date.now(),
  };
  mockDonations.unshift(newDonation);
  return newDonation;
};

/**
 * Update donation
 */
export const updateDonation = async (id, donationData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockDonations.findIndex(d => d.id === parseInt(id));
  if (index !== -1) {
    mockDonations[index] = { ...mockDonations[index], ...donationData };
    return mockDonations[index];
  }
  throw new Error('Donation not found');
};

/**
 * Delete donation
 */
export const deleteDonation = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockDonations = mockDonations.filter(d => d.id !== parseInt(id));
  return { success: true };
};

/**
 * Get donation statistics
 */
export const getDonationStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const total = mockDonations.reduce((sum, d) => sum + d.amount, 0);
  const thisMonth = mockDonations
    .filter(d => {
      const date = new Date(d.date);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + d.amount, 0);
  
  return {
    total,
    thisMonth,
    count: mockDonations.length,
  };
};

export default {
  getAllDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats,
};
