/**
 * Firebase Data Migration Script
 * Run this script to seed initial data into Firebase
 * 
 * Usage: node src/scripts/migrateToFirebase.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Validate configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Firebase configuration is missing!');
  console.error('Please check your .env file and ensure all REACT_APP_FIREBASE_* variables are set.');
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sample data
const members = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-0101',
    gender: 'male',
    dateOfBirth: '1990-05-15',
    address: '123 Main St, Kazhakkuttom',
    joinDate: '2020-01-10',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: true,
    credentials: {
      username: 'john1',
      password: 'Welcome@2020',
      temporaryPassword: true,
      lastPasswordChange: null,
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-0102',
    gender: 'female',
    dateOfBirth: '1985-08-22',
    address: '456 Oak Ave, Trivandrum',
    joinDate: '2019-05-20',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: true,
    credentials: {
      username: 'jane2',
      password: 'Welcome@2019',
      temporaryPassword: true,
      lastPasswordChange: null,
    }
  },
  {
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '555-0103',
    gender: 'male',
    dateOfBirth: '1995-03-10',
    address: '789 Pine Rd, Kazhakkuttom',
    joinDate: '2021-09-15',
    status: 'active',
    membershipType: 'youth',
    hasPortalAccess: true,
    credentials: {
      username: 'michael3',
      password: 'Welcome@2021',
      temporaryPassword: true,
      lastPasswordChange: null,
    }
  },
  {
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    phone: '555-0104',
    gender: 'female',
    dateOfBirth: '1992-11-30',
    address: '321 Elm St, Trivandrum',
    joinDate: '2018-03-25',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: true,
    credentials: {
      username: 'sarah4',
      password: 'Welcome@2018',
      temporaryPassword: true,
      lastPasswordChange: null,
    }
  },
  {
    name: 'David Brown',
    email: 'david@example.com',
    phone: '555-0105',
    gender: 'male',
    dateOfBirth: '1988-07-18',
    address: '654 Maple Dr, Kazhakkuttom',
    joinDate: '2022-11-05',
    status: 'active',
    membershipType: 'regular',
    hasPortalAccess: false,
    credentials: null,
  }
];

const events = [
  {
    title: 'Sunday Worship Service',
    description: 'Weekly worship and praise service',
    date: '2024-12-22T10:00:00',
    location: 'Main Church Hall',
    category: 'worship',
    attendees: 150,
  },
  {
    title: 'Youth Fellowship',
    description: 'Monthly youth gathering and activities',
    date: '2024-12-28T18:00:00',
    location: 'Youth Center',
    category: 'fellowship',
    attendees: 45,
  },
  {
    title: 'Christmas Celebration',
    description: 'Special Christmas service and celebration',
    date: '2024-12-25T09:00:00',
    location: 'Main Church Hall',
    category: 'special',
    attendees: 200,
  },
  {
    title: 'New Year Prayer Meeting',
    description: 'Beginning the year with prayer and worship',
    date: '2025-01-01T06:00:00',
    location: 'Main Church Hall',
    category: 'prayer',
    attendees: 100,
  }
];

const donations = [
  {
    amount: 5000,
    donor: 'John Doe',
    memberId: 'member-1',
    category: 'Tithe',
    paymentMethod: 'UPI',
    date: '2024-12-01T10:00:00',
    status: 'completed',
    notes: 'Monthly tithe - December',
  },
  {
    amount: 2500,
    donor: 'Jane Smith',
    memberId: 'member-2',
    category: 'Offering',
    paymentMethod: 'Card',
    date: '2024-12-05T11:30:00',
    status: 'completed',
    notes: 'Special offering',
  },
  {
    amount: 10000,
    donor: 'Michael Johnson',
    memberId: 'member-3',
    category: 'Building Fund',
    paymentMethod: 'Net Banking',
    date: '2024-12-10T14:00:00',
    status: 'completed',
    notes: 'Contribution to building fund',
  },
  {
    amount: 3000,
    donor: 'Sarah Williams',
    memberId: 'member-4',
    category: 'Mission',
    paymentMethod: 'UPI',
    date: '2024-12-15T09:00:00',
    status: 'completed',
    notes: 'Mission support',
  }
];

const notifications = [
  {
    title: 'Christmas Service',
    message: 'Join us for our special Christmas celebration on December 25th at 9 AM',
    type: 'event',
    read: false,
    userId: 'all',
  },
  {
    title: 'Donation Received',
    message: 'Thank you for your generous donation of ₹5000',
    type: 'donation',
    read: false,
    userId: 'member-1',
  },
  {
    title: 'New Year Prayer Meeting',
    message: 'Welcome 2025 with us in prayer. January 1st, 6 AM',
    type: 'event',
    read: false,
    userId: 'all',
  }
];

// Migration functions
async function migrateMembers() {
  console.log('Migrating members...');
  const membersCol = collection(db, 'members');
  
  for (const member of members) {
    try {
      await addDoc(membersCol, {
        ...member,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✓ Added member: ${member.name}`);
    } catch (error) {
      console.error(`✗ Error adding ${member.name}:`, error.message);
    }
  }
}

async function migrateEvents() {
  console.log('\nMigrating events...');
  const eventsCol = collection(db, 'events');
  
  for (const event of events) {
    try {
      await addDoc(eventsCol, {
        ...event,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✓ Added event: ${event.title}`);
    } catch (error) {
      console.error(`✗ Error adding ${event.title}:`, error.message);
    }
  }
}

async function migrateDonations() {
  console.log('\nMigrating donations...');
  const donationsCol = collection(db, 'donations');
  
  for (const donation of donations) {
    try {
      await addDoc(donationsCol, {
        ...donation,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log(`✓ Added donation: ₹${donation.amount} from ${donation.donor}`);
    } catch (error) {
      console.error(`✗ Error adding donation:`, error.message);
    }
  }
}

async function migrateNotifications() {
  console.log('\nMigrating notifications...');
  const notificationsCol = collection(db, 'notifications');
  
  for (const notification of notifications) {
    try {
      await addDoc(notificationsCol, {
        ...notification,
        createdAt: serverTimestamp(),
      });
      console.log(`✓ Added notification: ${notification.title}`);
    } catch (error) {
      console.error(`✗ Error adding notification:`, error.message);
    }
  }
}

async function createAdminUser() {
  console.log('\nCreating admin user...');
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'admin@christag.com',
      'admin123'
    );
    
    // Add user document to Firestore with UID as document ID
    const userDocRef = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDocRef, {
      email: 'admin@christag.com',
      name: 'Admin',
      role: 'admin',
      createdAt: serverTimestamp(),
    });
    
    console.log('✓ Admin user created: admin@christag.com / admin123');
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('ℹ Admin user already exists');
    } else {
      console.error('✗ Error creating admin user:', error.message);
    }
  }
}

// Run migration
async function runMigration() {
  console.log('=================================');
  console.log('Firebase Data Migration Started');
  console.log('=================================\n');
  
  try {
    await createAdminUser();
    await migrateMembers();
    await migrateEvents();
    await migrateDonations();
    await migrateNotifications();
    
    console.log('\n=================================');
    console.log('Migration Completed Successfully!');
    console.log('=================================\n');
    
    console.log('You can now login with:');
    console.log('Email: admin@christag.com');
    console.log('Password: admin123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Migration failed:', error);
    process.exit(1);
  }
}

// Execute migration
runMigration();
