/**
 * Member Portal Service
 * Handles API calls for member portal authentication and data
 */

import { getMemberByCredentials, getMemberById } from './memberService.firebase';

/**
 * Member login
 */
export const memberLogin = async (username, password) => {
  try {
    // Use Firebase member authentication
    const member = await getMemberByCredentials(username, password);
    
    if (!member) {
      throw new Error('Invalid username or password');
    }
    
    // Check if account is approved
    if (member.isApproved === false) {
      throw new Error('Your account has not been activated yet. Please wait for administrator approval.');
    }
    
    if (!member.hasPortalAccess) {
      throw new Error('Portal access not enabled for this account');
    }
    
    return {
      success: true,
      data: {
        token: 'member-token-' + member.id + '-' + Date.now(),
        member: {
          id: member.id,
          username: member.credentials.username,
          name: member.name,
          email: member.email,
          phone: member.phone,
          membershipType: member.membershipType,
          joinDate: member.joinDate,
        },
      },
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get member profile - fetch from Firebase
 */
export const getMemberProfile = async (memberId) => {
  try {
    const member = await getMemberById(memberId);
    
    if (!member) {
      throw new Error('Member not found');
    }
    
    return member;
  } catch (error) {
    console.error('Error fetching member profile:', error);
    throw error;
  }
};

/**
 * Update member profile
 */
export const updateMemberProfile = async (memberId, profileData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { ...profileData, id: memberId };
};

/**
 * Change member password
 */
export const changeMemberPassword = async (memberId, currentPassword, newPassword) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (currentPassword === 'member123') {
    return { success: true, message: 'Password changed successfully' };
  }
  throw new Error('Current password is incorrect');
};

/**
 * Get member's registered events
 */
export const getMemberEvents = async (memberId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 1,
      title: 'Sunday Service',
      date: '2025-12-21',
      time: '10:00 AM',
      location: 'Main Sanctuary',
      registered: true,
    },
    {
      id: 3,
      title: 'Christmas Carol Service',
      date: '2025-12-25',
      time: '7:00 PM',
      location: 'Main Sanctuary',
      registered: true,
    },
  ];
};

/**
 * Register for an event
 */
export const registerForEvent = async (memberId, eventId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Successfully registered for event' };
};

/**
 * Unregister from an event
 */
export const unregisterFromEvent = async (memberId, eventId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true, message: 'Successfully unregistered from event' };
};

export default {
  memberLogin,
  getMemberProfile,
  updateMemberProfile,
  changeMemberPassword,
  getMemberEvents,
  registerForEvent,
  unregisterFromEvent,
};
