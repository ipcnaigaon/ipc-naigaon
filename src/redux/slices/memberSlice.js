/**
 * Member Management Slice
 * Handles church member data and operations
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  members: [],
  filteredMembers: [],
  currentMember: null,
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    status: 'all',
    gender: 'all',
    ageGroup: 'all',
  },
};

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {
    setMembers: (state, action) => {
      state.members = action.payload;
      state.filteredMembers = action.payload;
    },
    addMember: (state, action) => {
      state.members.unshift(action.payload);
      state.filteredMembers = state.members;
    },
    updateMember: (state, action) => {
      const index = state.members.findIndex(m => m.id === action.payload.id);
      if (index !== -1) {
        state.members[index] = action.payload;
        state.filteredMembers = state.members;
      }
    },
    deleteMember: (state, action) => {
      state.members = state.members.filter(m => m.id !== action.payload);
      state.filteredMembers = state.members;
    },
    setCurrentMember: (state, action) => {
      state.currentMember = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      applyFilters(state);
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

// Helper function to apply filters
const applyFilters = (state) => {
  let filtered = [...state.members];

  // Apply search
  if (state.searchTerm) {
    filtered = filtered.filter(member =>
      member.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      member.phone.includes(state.searchTerm)
    );
  }

  // Apply status filter
  if (state.filters.status !== 'all') {
    filtered = filtered.filter(member => member.status === state.filters.status);
  }

  // Apply gender filter
  if (state.filters.gender !== 'all') {
    filtered = filtered.filter(member => member.gender === state.filters.gender);
  }

  state.filteredMembers = filtered;
};

export const {
  setMembers,
  addMember,
  updateMember,
  deleteMember,
  setCurrentMember,
  setSearchTerm,
  setFilters,
  setLoading,
  setError,
} = memberSlice.actions;

export default memberSlice.reducer;
