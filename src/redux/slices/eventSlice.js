/**
 * Event Management Slice
 * Handles church events and calendar operations
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  viewMode: 'calendar', // 'calendar' or 'list'
};

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setEvents: (state, action) => {
      state.events = action.payload;
    },
    addEvent: (state, action) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action) => {
      const index = state.events.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action) => {
      state.events = state.events.filter(e => e.id !== action.payload);
    },
    setCurrentEvent: (state, action) => {
      state.currentEvent = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  setCurrentEvent,
  setViewMode,
  setLoading,
  setError,
} = eventSlice.actions;

export default eventSlice.reducer;
