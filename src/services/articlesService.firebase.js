/**
 * Articles Service - Firebase Integration
 * Handles Firebase Firestore operations for articles/resources
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

const ARTICLES_COLLECTION = 'articles';

/**
 * Get all articles from Firebase
 */
const getArticles = async () => {
  try {
    const articlesCol = collection(db, ARTICLES_COLLECTION);
    const articlesQuery = query(articlesCol, orderBy('createdAt', 'desc'));
    const articlesSnapshot = await getDocs(articlesQuery);
    
    const articlesList = articlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
    }));
    
    return articlesList;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

/**
 * Get a single article by ID
 */
const getArticleById = async (id) => {
  try {
    const articleDoc = doc(db, ARTICLES_COLLECTION, id);
    const articleSnapshot = await getDoc(articleDoc);
    
    if (articleSnapshot.exists()) {
      const data = articleSnapshot.data();
      return {
        id: articleSnapshot.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    throw error;
  }
};

/**
 * Create a new article
 */
const createArticle = async (articleData) => {
  try {
    const newArticle = {
      ...articleData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(collection(db, ARTICLES_COLLECTION), newArticle);
    
    return {
      id: docRef.id,
      ...newArticle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * Update an existing article
 */
const updateArticle = async (id, articleData) => {
  try {
    const articleDoc = doc(db, ARTICLES_COLLECTION, id);
    
    const updateData = {
      ...articleData,
      updatedAt: serverTimestamp(),
    };
    
    await updateDoc(articleDoc, updateData);
    
    // Fetch and return updated article
    return await getArticleById(id);
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

/**
 * Delete an article
 */
const deleteArticle = async (id) => {
  try {
    const articleDoc = doc(db, ARTICLES_COLLECTION, id);
    await deleteDoc(articleDoc);
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

// Named exports for direct function imports
export const getAllArticles = getArticles;
export { 
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

// Default export
const articlesService = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

export default articlesService;
