/**
 * Member Service
 * Handles API calls for member management
 */

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

// Mock data for demonstration with credentials
let mockMembers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    gender: 'male',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, City',
    joinDate: '2020-01-10',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: true,
    credentials: {
      username: 'john1',
      password: 'Welcome@2020',
      temporaryPassword: true,
      lastPasswordChange: null,
    },
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0102',
    gender: 'female',
    dateOfBirth: '1985-08-22',
    address: '456 Oak Ave, City',
    joinDate: '2019-06-15',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: true,
    credentials: {
      username: 'jane2',
      password: 'Welcome@2019',
      temporaryPassword: true,
      lastPasswordChange: null,
    },
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '555-0103',
    gender: 'male',
    dateOfBirth: '1978-03-10',
    address: '789 Pine Rd, City',
    joinDate: '2018-03-20',
    status: 'active',
    membershipType: 'leadership',
    hasPortalAccess: true,
    credentials: {
      username: 'michael3',
      password: 'Welcome@2018',
      temporaryPassword: true,
      lastPasswordChange: null,
    },
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '555-0104',
    gender: 'female',
    dateOfBirth: '1992-11-08',
    address: '321 Elm St, City',
    joinDate: '2021-03-15',
    status: 'active',
    membershipType: 'volunteer',
    hasPortalAccess: true,
    credentials: {
      username: 'sarah4',
      password: 'Welcome@2021',
      temporaryPassword: true,
      lastPasswordChange: null,
    },
  },
  {
    id: 5,
    name: 'David Brown',
    email: 'david@example.com',
    phone: '555-0105',
    gender: 'male',
    dateOfBirth: '1988-07-25',
    address: '654 Maple Ave, City',
    joinDate: '2019-09-10',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: false,
    credentials: null,
  },
];

/**
 * Get all members
 */
export const getAllMembers = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockMembers;
};

/**
 * Get member by ID
 */
export const getMemberById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockMembers.find(m => m.id === parseInt(id));
};

/**
 * Create new member
 */
export const createMember = async (memberData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newMember = {
    ...memberData,
    id: Date.now(),
    hasPortalAccess: memberData.hasPortalAccess || false,
    credentials: null,
  };
  
  // Generate credentials if portal access is enabled
  if (newMember.hasPortalAccess) {
    newMember.credentials = generateCredentials(newMember);
    
    // Simulate sending email notification
    console.log('📧 Email Notification Sent:');
    console.log(`To: ${newMember.email}`);
    console.log(`Subject: Your IPC Naigaon Mumbai Portal Credentials`);
    console.log(`Username: ${newMember.credentials.username}`);
    console.log(`Temporary Password: ${newMember.credentials.password}`);
    console.log(`Login URL: http://localhost:3000/member-portal/login`);
  }
  
  // Create a new array instead of modifying the existing one
  mockMembers = [newMember, ...mockMembers];
  return newMember;
};

/**
 * Update member
 */
export const updateMember = async (id, memberData) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockMembers.findIndex(m => m.id === parseInt(id));
  if (index !== -1) {
    const updatedMember = { ...mockMembers[index], ...memberData };
    mockMembers = [
      ...mockMembers.slice(0, index),
      updatedMember,
      ...mockMembers.slice(index + 1)
    ];
    return updatedMember;
  }
  throw new Error('Member not found');
};

/**
 * Delete member
 */
export const deleteMember = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockMembers = mockMembers.filter(m => m.id !== parseInt(id));
  return { success: true };
};

/**
 * Generate credentials for existing member
 */
export const generateMemberCredentials = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const memberIndex = mockMembers.findIndex(m => m.id === parseInt(id));
  
  if (memberIndex === -1) {
    throw new Error('Member not found');
  }
  
  const member = mockMembers[memberIndex];
  const credentials = generateCredentials(member);
  const updatedMember = {
    ...member,
    credentials,
    hasPortalAccess: true
  };
  
  mockMembers = [
    ...mockMembers.slice(0, memberIndex),
    updatedMember,
    ...mockMembers.slice(memberIndex + 1)
  ];
  
  // Simulate sending email notification
    console.log('📧 Email Notification Sent:');
    console.log(`To: ${updatedMember.email}`);
    console.log(`Subject: Your IPC Naigaon Mumbai Portal Credentials`);
  console.log(`Username: ${credentials.username}`);
  console.log(`Temporary Password: ${credentials.password}`);
  console.log(`Login URL: http://localhost:3000/member-portal/login`);
  
  return { member: updatedMember, credentials };
};

/**
 * Reset member credentials
 */
export const resetMemberCredentials = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const memberIndex = mockMembers.findIndex(m => m.id === parseInt(id));
  
  if (memberIndex === -1) {
    throw new Error('Member not found');
  }
  
  const member = mockMembers[memberIndex];
  
  if (!member.credentials) {
    throw new Error('Member does not have portal access');
  }
  
  const emailPrefix = member.email.split('@')[0];
  const newPassword = emailPrefix + '123';
  const updatedMember = {
    ...member,
    credentials: {
      ...member.credentials,
      password: newPassword,
      temporaryPassword: true,
      lastPasswordChange: new Date().toISOString()
    }
  };
  
  mockMembers = [
    ...mockMembers.slice(0, memberIndex),
    updatedMember,
    ...mockMembers.slice(memberIndex + 1)
  ];
  
  // Simulate sending email notification
  console.log('📧 Password Reset Email Sent:');
  console.log(`To: ${updatedMember.email}`);
  console.log(`Subject: Your Password Has Been Reset`);
  console.log(`Username: ${updatedMember.credentials.username}`);
  console.log(`New Temporary Password: ${newPassword}`);
  
  return { member: updatedMember, newPassword };
};

/**
 * Revoke member portal access
 */
export const revokeMemberAccess = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const memberIndex = mockMembers.findIndex(m => m.id === parseInt(id));
  
  if (memberIndex === -1) {
    throw new Error('Member not found');
  }
  
  const updatedMember = {
    ...mockMembers[memberIndex],
    credentials: null,
    hasPortalAccess: false
  };
  
  mockMembers = [
    ...mockMembers.slice(0, memberIndex),
    updatedMember,
    ...mockMembers.slice(memberIndex + 1)
  ];
  
  return updatedMember;
};

export default {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess,
};
