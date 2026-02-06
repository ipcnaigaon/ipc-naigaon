/**
 * Fix Admin User Script
 * Updates the admin user document to use the correct UID
 * 
 * Usage: node src/scripts/fixAdminUser.js
 */

require('dotenv').config();
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

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

async function fixAdminUser() {
  console.log('=================================');
  console.log('Fixing Admin User Document');
  console.log('=================================\n');

  try {
    // Sign in to get the UID
    console.log('Signing in as admin...');
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'admin@christag.com',
      'admin123'
    );
    const uid = userCredential.user.uid;
    console.log(`✓ Admin UID: ${uid}\n`);

    // Get all user documents
    console.log('Checking existing user documents...');
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    let oldDocId = null;
    let userData = null;

    usersSnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.email === 'admin@christag.com') {
        oldDocId = docSnap.id;
        userData = data;
        console.log(`Found admin document with ID: ${oldDocId}`);
      }
    });

    // Create or update the correct document
    console.log('\nCreating/updating admin document with correct UID...');
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      email: 'admin@christag.com',
      name: 'Admin',
      role: 'admin',
      createdAt: userData?.createdAt || new Date(),
      updatedAt: new Date(),
    });
    console.log('✓ Admin document created/updated with UID as document ID');

    // Delete old document if it exists and is different
    if (oldDocId && oldDocId !== uid) {
      console.log('\nDeleting old admin document...');
      await deleteDoc(doc(db, 'users', oldDocId));
      console.log('✓ Old admin document deleted');
    }

    console.log('\n=================================');
    console.log('Admin User Fixed Successfully!');
    console.log('=================================\n');
    
    console.log('You can now login with:');
    console.log('Email: admin@christag.com');
    console.log('Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Fix failed:', error.message);
    process.exit(1);
  }
}

fixAdminUser();
