/**
 * Testimonial Service - Firebase Integration
 * Handles Firebase Firestore operations for testimonials
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
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

const TESTIMONIALS_COLLECTION = 'testimonials';

/**
 * Get all testimonials from Firebase
 */
export const getAllTestimonials = async () => {
  try {
    const testimonialsCol = collection(db, TESTIMONIALS_COLLECTION);
    
    // Try with orderBy first
    try {
      const testimonialsQuery = query(testimonialsCol, orderBy('createdAt', 'desc'));
      const testimonialsSnapshot = await getDocs(testimonialsQuery);
      
      const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      }));
      
      return testimonialsList;
    } catch (orderByError) {
      // If orderBy fails (e.g., empty collection), try without orderBy
      console.warn('OrderBy failed, fetching without sort:', orderByError.message);
      const testimonialsSnapshot = await getDocs(testimonialsCol);
      
      const testimonialsList = testimonialsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      }));
      
      return testimonialsList;
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    throw error;
  }
};

/**
 * Get a single testimonial by ID
 */
export const getTestimonialById = async (id) => {
  try {
    const testimonialDoc = doc(db, TESTIMONIALS_COLLECTION, id);
    const testimonialSnapshot = await getDoc(testimonialDoc);
    
    if (!testimonialSnapshot.exists()) {
      throw new Error('Testimonial not found');
    }
    
    return {
      id: testimonialSnapshot.id,
      ...testimonialSnapshot.data(),
      createdAt: testimonialSnapshot.data().createdAt?.toDate?.()?.toISOString() || testimonialSnapshot.data().createdAt,
      updatedAt: testimonialSnapshot.data().updatedAt?.toDate?.()?.toISOString() || testimonialSnapshot.data().updatedAt,
    };
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    throw error;
  }
};

/**
 * Create a new testimonial
 */
export const createTestimonial = async (testimonialData) => {
  try {
    const testimonialsCol = collection(db, TESTIMONIALS_COLLECTION);
    
    const newTestimonial = {
      ...testimonialData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(testimonialsCol, newTestimonial);
    
    return {
      id: docRef.id,
      ...newTestimonial,
    };
  } catch (error) {
    console.error('Error creating testimonial:', error);
    throw error;
  }
};

/**
 * Update a testimonial
 */
export const updateTestimonial = async (id, updates) => {
  try {
    const testimonialDoc = doc(db, TESTIMONIALS_COLLECTION, id);
    
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(testimonialDoc, updateData);
    
    return {
      id,
      ...updates,
    };
  } catch (error) {
    console.error('Error updating testimonial:', error);
    throw error;
  }
};

/**
 * Delete a testimonial
 */
export const deleteTestimonial = async (id) => {
  try {
    const testimonialDoc = doc(db, TESTIMONIALS_COLLECTION, id);
    await deleteDoc(testimonialDoc);
    
    return { id };
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    throw error;
  }
};
