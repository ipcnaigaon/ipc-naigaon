/**
 * Member Service - Firebase Integration
 * Handles Firebase Firestore operations for member management
 */

import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const MEMBERS_COLLECTION = 'members';

/**
 * Generate credentials for a member
 * Username: email
 * Password: emailprefix123 (email substring before @)
 */
const generateCredentials = (member) => {
  const username = member.email;
  const emailPrefix = member.email.split('@')[0];
  const password = emailPrefix + '123';
  return {
    username,
    password,
    temporaryPassword: true,
    lastPasswordChange: null,
  };
};

/**
 * Send credentials email (mock implementation)
 */
const sendCredentialsEmail = async (member, credentials) => {
  // Simulate email sending
  console.log(`Email sent to ${member.email}`);
  console.log(`Username: ${credentials.username}`);
  console.log(`Temporary Password: ${credentials.password}`);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return true;
};

/**
 * Create member signup (pending approval)
 * Creates a new member record with isApproved = false
 */
const createMemberSignup = async (signupData) => {
  try {
    const { name, email, phone, gender, dateOfBirth, dateOfJoining, maritalStatus, marriageDate } = signupData;
    
    // Check if member with this email already exists
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(membersCol, where('email', '==', email.toLowerCase()));
    const existingMembers = await getDocs(q);
    
    if (!existingMembers.empty) {
      throw new Error('An account with this email already exists');
    }
    
    // Create new member signup with pending approval
    const newMember = {
      name,
      email: email.toLowerCase(),
      phone,
      gender,
      dateOfBirth,
      joinDate: dateOfJoining,
      maritalStatus,
      marriageDate: maritalStatus === 'married' ? marriageDate : null,
      status: 'pending',
      isApproved: false,
      hasPortalAccess: false,
      credentials: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(membersCol, newMember);
    
    console.log(`Member signup created: ${email}`);
    
    return {
      id: docRef.id,
      ...newMember,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating member signup:', error);
    throw error;
  }
};

/**
 * Get all pending member signups
 */
const getPendingSignups = async () => {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    
    // First, let's try to get all members to see if there are any
    const allDocsSnapshot = await getDocs(membersCol);
    console.log(`Total members in database: ${allDocsSnapshot.size}`);
    
    // Now query for unapproved members
    const q = query(
      membersCol,
      where('isApproved', '==', false)
    );
    const querySnapshot = await getDocs(q);
    console.log(`Pending signups found: ${querySnapshot.size}`);
    
    const signups = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));
    
    // Sort by createdAt descending on the client side
    signups.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
      return dateB - dateA;
    });
    
    return signups;
  } catch (error) {
    console.error('Error fetching pending signups:', error);
    console.error('Error details:', error.code, error.message);
    throw error;
  }
};

/**
 * Approve a member signup
 */
const approveMemberSignup = async (memberId) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    const memberData = await getDoc(memberDoc);
    
    if (!memberData.exists()) {
      throw new Error('Member not found');
    }
    
    const member = { id: memberDoc.id, ...memberData.data() };
    const credentials = generateCredentials(member);
    
    await updateDoc(memberDoc, {
      isApproved: true,
      status: 'active',
      hasPortalAccess: true,
      credentials: credentials,
      updatedAt: serverTimestamp(),
    });
    
    // Send approval email with credentials
    await sendCredentialsEmail(member, credentials);
    
    return {
      id: memberId,
      ...member,
      isApproved: true,
      status: 'active',
      hasPortalAccess: true,
      credentials: credentials,
    };
  } catch (error) {
    console.error('Error approving member signup:', error);
    throw error;
  }
};

/**
 * Reject a member signup
 */
const rejectMemberSignup = async (memberId) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    
    await deleteDoc(memberDoc);
    
    console.log(`Member signup rejected: ${memberId}`);
    return true;
  } catch (error) {
    console.error('Error rejecting member signup:', error);
    throw error;
  }
};

/**
 * Get all members from Firebase
 */
const getMembers = async () => {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const membersSnapshot = await getDocs(membersCol);
    const membersList = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to ISO strings
      dateOfBirth: doc.data().dateOfBirth?.toDate?.()?.toISOString() || doc.data().dateOfBirth,
      joinDate: doc.data().joinDate?.toDate?.()?.toISOString() || doc.data().joinDate,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));
    return membersList;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

/**
 * Get a single member by ID
 */
const getMemberById = async (id) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, id);
    const memberSnapshot = await getDoc(memberDoc);
    
    if (memberSnapshot.exists()) {
      const data = memberSnapshot.data();
      return {
        id: memberSnapshot.id,
        ...data,
        dateOfBirth: data.dateOfBirth?.toDate?.()?.toISOString() || data.dateOfBirth,
        joinDate: data.joinDate?.toDate?.()?.toISOString() || data.joinDate,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching member:', error);
    throw error;
  }
};

/**
 * Get member by credentials (for portal login)
 */
const getMemberByCredentials = async (username, password) => {
  try {
    const membersCol = collection(db, MEMBERS_COLLECTION);
    const q = query(
      membersCol,
      where('credentials.username', '==', username),
      where('hasPortalAccess', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      
      // Verify password
      if (data.credentials?.password === password) {
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate?.()?.toISOString() || data.dateOfBirth,
          joinDate: data.joinDate?.toDate?.()?.toISOString() || data.joinDate,
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error authenticating member:', error);
    throw error;
  }
};

/**
 * Create a new member
 */
const createMember = async (memberData) => {
  try {
    const newMember = {
      ...memberData,
      status: memberData.status || 'active',
      hasPortalAccess: false,
      credentials: null,
      // Ensure marriage date is null if not married
      marriageDate: memberData.maritalStatus === 'married' ? memberData.marriageDate : null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, MEMBERS_COLLECTION), newMember);
    
    return {
      id: docRef.id,
      ...newMember,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating member:', error);
    throw error;
  }
};

/**
 * Update an existing member
 */
const updateMember = async (id, memberData) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, id);
    
    const updateData = {
      ...memberData,
      // Ensure marriage date is null if not married
      marriageDate: memberData.maritalStatus === 'married' ? memberData.marriageDate : null,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(memberDoc, updateData);
    
    // Fetch and return updated member
    return await getMemberById(id);
  } catch (error) {
    console.error('Error updating member:', error);
    throw error;
  }
};

/**
 * Delete a member
 */
const deleteMember = async (id) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, id);
    await deleteDoc(memberDoc);
    return true;
  } catch (error) {
    console.error('Error deleting member:', error);
    throw error;
  }
};

/**
 * Generate and save member portal credentials
 */
const generateMemberCredentials = async (memberId) => {
  try {
    const member = await getMemberById(memberId);
    
    if (!member) {
      throw new Error('Member not found');
    }
    
    if (member.hasPortalAccess && member.credentials) {
      throw new Error('Member already has portal access');
    }
    
    const credentials = generateCredentials(member);
    
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    await updateDoc(memberDoc, {
      hasPortalAccess: true,
      credentials: credentials,
      updatedAt: serverTimestamp(),
    });
    
    await sendCredentialsEmail(member, credentials);
    
    return {
      ...member,
      hasPortalAccess: true,
      credentials: credentials,
    };
  } catch (error) {
    console.error('Error generating credentials:', error);
    throw error;
  }
};

/**
 * Reset member portal password
 */
const resetMemberCredentials = async (memberId) => {
  try {
    const member = await getMemberById(memberId);
    
    if (!member) {
      throw new Error('Member not found');
    }
    
    if (!member.hasPortalAccess || !member.credentials) {
      throw new Error('Member does not have portal access');
    }
    
    const emailPrefix = member.email.split('@')[0];
    const newPassword = emailPrefix + '123';
    
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    await updateDoc(memberDoc, {
      'credentials.password': newPassword,
      'credentials.temporaryPassword': true,
      'credentials.lastPasswordChange': serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    const updatedCredentials = {
      ...member.credentials,
      password: newPassword,
      temporaryPassword: true,
    };
    
    await sendCredentialsEmail(member, updatedCredentials);
    
    return {
      ...member,
      credentials: updatedCredentials,
    };
  } catch (error) {
    console.error('Error resetting credentials:', error);
    throw error;
  }
};

/**
 * Revoke member portal access
 */
const revokeMemberAccess = async (memberId) => {
  try {
    const memberDoc = doc(db, MEMBERS_COLLECTION, memberId);
    
    await updateDoc(memberDoc, {
      hasPortalAccess: false,
      credentials: null,
      updatedAt: serverTimestamp(),
    });
    
    const member = await getMemberById(memberId);
    return member;
  } catch (error) {
    console.error('Error revoking access:', error);
    throw error;
  }
};

/**
 * Search members by name or email
 */
const searchMembers = async (searchTerm) => {
  try {
    const members = await getMembers();
    
    if (!searchTerm) return members;
    
    const term = searchTerm.toLowerCase();
    return members.filter(member =>
      member.name.toLowerCase().includes(term) ||
      member.email.toLowerCase().includes(term)
    );
  } catch (error) {
    console.error('Error searching members:', error);
    throw error;
  }
};

/**
 * Get member statistics
 */
const getMemberStats = async () => {
  try {
    const members = await getMembers();
    
    return {
      total: members.length,
      active: members.filter(m => m.status === 'active').length,
      inactive: members.filter(m => m.status === 'inactive').length,
      withPortalAccess: members.filter(m => m.hasPortalAccess).length,
    };
  } catch (error) {
    console.error('Error fetching member stats:', error);
    throw error;
  }
};

// Named exports for direct function imports
export const getAllMembers = getMembers;
export const getMember = getMemberById;
export { 
  getMembers,
  getMemberById,
  getMemberByCredentials,
  createMember,
  updateMember,
  deleteMember,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess,
  searchMembers,
  getMemberStats,
  createMemberSignup,
  getPendingSignups,
  approveMemberSignup,
  rejectMemberSignup,
};

// Default export
const memberService = {
  getMembers,
  getMemberById,
  getMemberByCredentials,
  createMember,
  updateMember,
  deleteMember,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess,
  searchMembers,
  getMemberStats,
  createMemberSignup,
  getPendingSignups,
  approveMemberSignup,
  rejectMemberSignup,
};

export default memberService;
