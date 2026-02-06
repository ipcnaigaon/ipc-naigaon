/**
 * Member Portal Slice
 * Manages member portal authentication and state
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  member: JSON.parse(localStorage.getItem('memberData') || 'null'),
  token: localStorage.getItem('memberToken'),
  isAuthenticated: !!localStorage.getItem('memberToken'),
  loading: false,
  error: null,
};

const memberPortalSlice = createSlice({
  name: 'memberPortal',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.member = action.payload.member;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('memberToken', action.payload.token);
      localStorage.setItem('memberData', JSON.stringify(action.payload.member));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.member = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('memberToken');
      localStorage.removeItem('memberData');
    },
    updateMemberProfile: (state, action) => {
      state.member = { ...state.member, ...action.payload };
      localStorage.setItem('memberData', JSON.stringify(state.member));
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateMemberProfile 
} = memberPortalSlice.actions;

export default memberPortalSlice.reducer;
