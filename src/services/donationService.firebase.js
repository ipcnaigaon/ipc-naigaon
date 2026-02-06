/**
 * Donation Service - Firebase Integration
 * Handles Firebase Firestore operations for donation management
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
import { createNotification } from './notificationService.firebase';

const DONATIONS_COLLECTION = 'donations';

/**
 * Get all donations from Firebase
 */
const getDonations = async () => {
  try {
    const donationsCol = collection(db, DONATIONS_COLLECTION);
    const donationsQuery = query(donationsCol, orderBy('date', 'desc'));
    const donationsSnapshot = await getDocs(donationsQuery);
    
    const donationsList = donationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));
    
    return donationsList;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};

/**
 * Get a single donation by ID
 */
const getDonationById = async (id) => {
  try {
    const donationDoc = doc(db, DONATIONS_COLLECTION, id);
    const donationSnapshot = await getDoc(donationDoc);
    
    if (donationSnapshot.exists()) {
      const data = donationSnapshot.data();
      return {
        id: donationSnapshot.id,
        ...data,
        date: data.date?.toDate?.()?.toISOString() || data.date,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching donation:', error);
    throw error;
  }
};

/**
 * Get donations by member ID
 */
const getDonationsByMember = async (memberId) => {
  try {
    const donationsCol = collection(db, DONATIONS_COLLECTION);
    const q = query(
      donationsCol,
      where('memberId', '==', memberId)
    );
    
    const querySnapshot = await getDocs(q);
    
    const donations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate?.()?.toISOString() || doc.data().date,
    }));
    
    // Sort by date in descending order (newest first)
    return donations.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error fetching member donations:', error);
    throw error;
  }
};

/**
 * Create a new donation
 */
const createDonation = async (donationData) => {
  try {
    const newDonation = {
      ...donationData,
      status: donationData.status || 'completed',
      date: donationData.date || new Date().toISOString(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, DONATIONS_COLLECTION), newDonation);
    
    // Create notification for completed donation
    if (newDonation.status === 'completed') {
      try {
        await createNotification({
          type: 'donation',
          title: 'New Donation Received',
          message: `${donationData.donor || 'Anonymous'} donated ₹${donationData.amount} for ${donationData.category}`,
          read: false,
          priority: 'normal',
        });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't fail the donation if notification fails
      }
    }
    
    return {
      id: docRef.id,
      ...newDonation,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating donation:', error);
    throw error;
  }
};

/**
 * Update an existing donation
 */
const updateDonation = async (id, donationData) => {
  try {
    const donationDoc = doc(db, DONATIONS_COLLECTION, id);
    
    const updateData = {
      ...donationData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(donationDoc, updateData);
    
    // Fetch and return updated donation
    return await getDonationById(id);
  } catch (error) {
    console.error('Error updating donation:', error);
    throw error;
  }
};

/**
 * Delete a donation
 */
const deleteDonation = async (id) => {
  try {
    const donationDoc = doc(db, DONATIONS_COLLECTION, id);
    await deleteDoc(donationDoc);
    return true;
  } catch (error) {
    console.error('Error deleting donation:', error);
    throw error;
  }
};

/**
 * Get donation statistics
 */
const getDonationStats = async () => {
  try {
    const donations = await getDonations();
    
    const total = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyDonations = donations.filter(d => 
      new Date(d.date) >= thisMonth
    );
    const monthlyTotal = monthlyDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
    
    // Get donations by category
    const byCategory = donations.reduce((acc, d) => {
      const category = d.category || 'General';
      acc[category] = (acc[category] || 0) + d.amount;
      return acc;
    }, {});
    
    return {
      total,
      count: donations.length,
      monthlyTotal,
      monthlyCount: monthlyDonations.length,
      byCategory,
      average: donations.length > 0 ? total / donations.length : 0,
    };
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    throw error;
  }
};

/**
 * Get donations for a specific year
 */
const getDonationsByYear = async (year) => {
  try {
    const donations = await getDonations();
    
    return donations.filter(d => {
      const donationYear = new Date(d.date).getFullYear();
      return donationYear === parseInt(year);
    });
  } catch (error) {
    console.error('Error fetching donations by year:', error);
    throw error;
  }
};

/**
 * Get monthly donation data for charts
 */
const getMonthlyDonationData = async (year) => {
  try {
    const donations = await getDonationsByYear(year || new Date().getFullYear());
    
    const monthlyData = Array(12).fill(0);
    
    donations.forEach(donation => {
      const month = new Date(donation.date).getMonth();
      monthlyData[month] += donation.amount;
    });
    
    return monthlyData;
  } catch (error) {
    console.error('Error fetching monthly donation data:', error);
    throw error;
  }
};

// Named exports for direct function imports
export const getAllDonations = getDonations;
export { 
  getDonations,
  getDonationById,
  getDonationsByMember,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats,
  getDonationsByYear,
  getMonthlyDonationData,
};

// Default export
const donationService = {
  getDonations,
  getDonationById,
  getDonationsByMember,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats,
  getDonationsByYear,
  getMonthlyDonationData,
};

export default donationService;
