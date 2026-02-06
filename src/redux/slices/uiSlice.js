/**
 * UI Slice
 * Manages UI state like modals
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  celebrationsModalOpen: false,
  weeklyEventsModalOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCelebrationsModal: (state) => {
      state.celebrationsModalOpen = true;
    },
    closeCelebrationsModal: (state) => {
      state.celebrationsModalOpen = false;
    },
    openWeeklyEventsModal: (state) => {
      state.weeklyEventsModalOpen = true;
    },
    closeWeeklyEventsModal: (state) => {
      state.weeklyEventsModalOpen = false;
    },
  },
});

export const { openCelebrationsModal, closeCelebrationsModal, openWeeklyEventsModal, closeWeeklyEventsModal } = uiSlice.actions;
export default uiSlice.reducer;
