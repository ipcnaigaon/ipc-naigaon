/**
 * Create Role-Based Users Script
 * Creates admin, events manager, and finance manager users
 * Reads credentials from .env file
 * 
 * Usage: node src/scripts/createRoleUsers.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Build users array dynamically from environment variables
const users = [
  {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    name: process.env.ADMIN_NAME,
    role: 'admin',
  },
  {
    email: process.env.EVENTS_MANAGER_EMAIL,
    password: process.env.EVENTS_MANAGER_PASSWORD,
    name: process.env.EVENTS_MANAGER_NAME,
    role: 'events_manager',
  },
  {
    email: process.env.FINANCE_MANAGER_EMAIL,
    password: process.env.FINANCE_MANAGER_PASSWORD,
    name: process.env.FINANCE_MANAGER_NAME,
    role: 'finance_manager',
  },
  {
    email: process.env.RESOURCE_MANAGER_EMAIL,
    password: process.env.RESOURCE_MANAGER_PASSWORD,
    name: process.env.RESOURCE_MANAGER_NAME,
    role: 'resource_manager',
  },
];

// Validate that all required environment variables are set
function validateEnvironment() {
  const requiredVars = [
    'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'ADMIN_NAME',
    'EVENTS_MANAGER_EMAIL', 'EVENTS_MANAGER_PASSWORD', 'EVENTS_MANAGER_NAME',
    'FINANCE_MANAGER_EMAIL', 'FINANCE_MANAGER_PASSWORD', 'FINANCE_MANAGER_NAME',
    'RESOURCE_MANAGER_EMAIL', 'RESOURCE_MANAGER_PASSWORD', 'RESOURCE_MANAGER_NAME',
  ];

  const missing = requiredVars.filter(v => !process.env[v]);
  if (missing.length > 0) {
    console.error('\n✗ Missing environment variables:', missing.join(', '));
    console.error('Please check your .env file and ensure all user credentials are defined.\n');
    process.exit(1);
  }
}

async function createUser(userData) {
  try {
    console.log(`\nCreating user: ${userData.email}...`);
    
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );
    
    const uid = userCredential.user.uid;
    
    // Create user document with UID as document ID
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    console.log(`✓ User created successfully`);
    console.log(`  Email: ${userData.email}`);
    console.log(`  Password: ${userData.password}`);
    console.log(`  Role: ${userData.role}`);
    
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log(`ℹ User already exists: ${userData.email}`);
    } else {
      console.error(`✗ Error creating user ${userData.email}:`, error.message);
    }
  }
}

async function createAllUsers() {
  console.log('=================================');
  console.log('Creating Role-Based Users');
  console.log('=================================');

  for (const userData of users) {
    await createUser(userData);
  }

  console.log('\n=================================');
  console.log('User Creation Completed!');
  console.log('=================================\n');
  
  console.log('Login Credentials:\n');
  users.forEach((user, index) => {
    const roleLabel = user.role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    console.log(`${index + 1}. ${roleLabel}:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}\n`);
  });

  process.exit(0);
}

// Main execution
(async () => {
  try {
    validateEnvironment();
    await createAllUsers();
  } catch (error) {
    console.error('\n✗ Script failed:', error);
    process.exit(1);
  }
})();
