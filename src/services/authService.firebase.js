/**
 * Auth Service - Firebase Integration
 * Handles Firebase Authentication operations
 */

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword as firebaseUpdatePassword,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const USERS_COLLECTION = 'users';

/**
 * Login with email and password
 */
const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from Firestore
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      
      return {
        user: {
          id: user.uid,
          email: user.email,
          name: userData.name || user.displayName,
          role: userData.role || 'user',
        },
        token: await user.getIdToken(),
      };
    }
    
    // If no user document exists, create a basic one
    const newUserData = {
      email: user.email,
      name: user.displayName || email.split('@')[0],
      role: 'user',
      createdAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, USERS_COLLECTION, user.uid), newUserData);
    
    return {
      user: {
        id: user.uid,
        email: user.email,
        name: newUserData.name,
        role: 'user',
      },
      token: await user.getIdToken(),
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Login failed');
  }
};

/**
 * Register a new user
 */
const register = async (userData) => {
  try {
    const { email, password, name } = userData;
    
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with name
    await updateProfile(user, { displayName: name });
    
    // Create user document in Firestore
    const newUserData = {
      email,
      name,
      role: 'user',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    await setDoc(doc(db, USERS_COLLECTION, user.uid), newUserData);
    
    return {
      user: {
        id: user.uid,
        email: user.email,
        name,
        role: 'user',
      },
      token: await user.getIdToken(),
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.message || 'Registration failed');
  }
};

/**
 * Logout current user
 */
const logout = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Logout failed');
  }
};

/**
 * Get current user
 */
const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            resolve({
              id: user.uid,
              email: user.email,
              name: userData.name || user.displayName,
              role: userData.role || 'user',
            });
          } else {
            resolve({
              id: user.uid,
              email: user.email,
              name: user.displayName,
              role: 'user',
            });
          }
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Update user profile
 */
const updateUserProfile = async (userId, profileData) => {
  try {
    const user = auth.currentUser;
    
    if (!user || user.uid !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Update Firebase Auth profile
    if (profileData.name) {
      await updateProfile(user, { displayName: profileData.name });
    }
    
    // Update Firestore document
    const userDoc = doc(db, USERS_COLLECTION, userId);
    await setDoc(userDoc, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    const updatedDoc = await getDoc(userDoc);
    const userData = updatedDoc.data();
    
    return {
      id: userId,
      email: user.email,
      ...userData,
    };
  } catch (error) {
    console.error('Profile update error:', error);
    throw new Error('Failed to update profile');
  }
};

/**
 * Change user password with current password verification
 */
const updatePassword = async (currentPassword, newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user logged in');
    }
    
    // Re-authenticate user with current password
    try {
      await signInWithEmailAndPassword(auth, user.email, currentPassword);
    } catch (error) {
      throw new Error('Current password is incorrect');
    }
    
    // Change to new password
    const updatedUser = auth.currentUser;
    await firebaseUpdatePassword(updatedUser, newPassword);
    
    // Update timestamp in Firestore
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      lastPasswordChange: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Password update error:', error);
    throw new Error(error.message || 'Failed to update password');
  }
};

/**
 * Change user password
 */
const changePassword = async (newPassword) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user logged in');
    }
    
    await firebaseUpdatePassword(user, newPassword);
    
    // Update timestamp in Firestore
    await setDoc(doc(db, USERS_COLLECTION, user.uid), {
      lastPasswordChange: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error('Password change error:', error);
    throw new Error(error.message || 'Failed to change password');
  }
};

/**
 * Request password reset
 */
const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Validate token (check if user is authenticated)
 */
const validateToken = async () => {
  try {
    const user = auth.currentUser;
    
    if (user) {
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: user.uid,
          email: user.email,
          name: userData.name || user.displayName,
          role: userData.role || 'user',
        };
      }
      
      // Return basic user info if no Firestore document
      return {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0],
        role: 'user',
      };
    }
    
    return null;
  } catch (error) {
    console.error('Token validation error:', error);
    return null;
  }
};

// Named exports for direct function imports
export { 
  login,
  register,
  logout,
  getCurrentUser,
  updateUserProfile,
  updatePassword,
  changePassword,
  resetPassword,
  validateToken,
};

// Alias for verifyToken
export const verifyToken = validateToken;

// Default export
const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  updateUserProfile,
  updatePassword,
  changePassword,
  resetPassword,
  validateToken,
  verifyToken: validateToken,
};

export default authService;
