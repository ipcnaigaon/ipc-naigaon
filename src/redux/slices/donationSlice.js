/**
 * Donation Management Slice
 * Handles donation tracking and reporting
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  donations: [],
  filteredDonations: [],
  loading: false,
  error: null,
  totalAmount: 0,
  monthlyTotal: 0,
  filters: {
    startDate: null,
    endDate: null,
    type: 'all',
    minAmount: null,
    maxAmount: null,
  },
};

const donationSlice = createSlice({
  name: 'donations',
  initialState,
  reducers: {
    setDonations: (state, action) => {
      state.donations = action.payload;
      state.filteredDonations = action.payload;
      calculateTotals(state);
    },
    addDonation: (state, action) => {
      state.donations.unshift(action.payload);
      state.filteredDonations = state.donations;
      calculateTotals(state);
    },
    updateDonation: (state, action) => {
      const index = state.donations.findIndex(d => d.id === action.payload.id);
      if (index !== -1) {
        state.donations[index] = action.payload;
        state.filteredDonations = state.donations;
        calculateTotals(state);
      }
    },
    deleteDonation: (state, action) => {
      state.donations = state.donations.filter(d => d.id !== action.payload);
      state.filteredDonations = state.donations;
      calculateTotals(state);
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      applyFilters(state);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

// Helper function to calculate totals
const calculateTotals = (state) => {
  state.totalAmount = state.donations.reduce((sum, d) => sum + d.amount, 0);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  state.monthlyTotal = state.donations
    .filter(d => {
      const date = new Date(d.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    })
    .reduce((sum, d) => sum + d.amount, 0);
};

// Helper function to apply filters
const applyFilters = (state) => {
  let filtered = [...state.donations];

  if (state.filters.startDate) {
    filtered = filtered.filter(d => new Date(d.date) >= new Date(state.filters.startDate));
  }

  if (state.filters.endDate) {
    filtered = filtered.filter(d => new Date(d.date) <= new Date(state.filters.endDate));
  }

  if (state.filters.type !== 'all') {
    filtered = filtered.filter(d => d.type === state.filters.type);
  }

  if (state.filters.minAmount) {
    filtered = filtered.filter(d => d.amount >= state.filters.minAmount);
  }

  if (state.filters.maxAmount) {
    filtered = filtered.filter(d => d.amount <= state.filters.maxAmount);
  }

  state.filteredDonations = filtered;
};

export const {
  setDonations,
  addDonation,
  updateDonation,
  deleteDonation,
  setFilters,
  setLoading,
  setError,
} = donationSlice.actions;

export default donationSlice.reducer;
