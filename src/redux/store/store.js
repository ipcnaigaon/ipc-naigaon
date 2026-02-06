/**
 * Redux Store Configuration
 * Configures the Redux store with all application slices
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import memberReducer from '../slices/memberSlice';
import eventReducer from '../slices/eventSlice';
import donationReducer from '../slices/donationSlice';
import notificationReducer from '../slices/notificationSlice';
import memberPortalReducer from '../slices/memberPortalSlice';
import uiReducer from '../slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: memberReducer,
    events: eventReducer,
    donations: donationReducer,
    notifications: notificationReducer,
    memberPortal: memberPortalReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
