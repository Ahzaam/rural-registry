// filepath: f:\PROGRAMMING\JavaScript\rural-registry\src\services\announcementService.ts
import { 
  addDoc, 
  collection, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  updateDoc, 
  where, 
  serverTimestamp, 
  orderBy, 
  Timestamp,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Announcement } from '../types/types';

const announcementsRef = collection(db, 'announcements');

export const createAnnouncement = async (announcement: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Convert date objects to Firebase Timestamps
    const visibleFrom = Timestamp.fromDate(announcement.visibleFrom);
    const visibleUntil = Timestamp.fromDate(announcement.visibleUntil);
    
    const docRef = await addDoc(announcementsRef, {
      ...announcement,
      visibleFrom,
      visibleUntil,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error creating announcement:', error);
    throw error;
  }
};

export const getAnnouncement = async (id: string) => {
  try {
    const docRef = doc(db, 'announcements', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      return {
        id: docSnap.id,
        ...data,
        visibleFrom: data.visibleFrom.toDate(),
        visibleUntil: data.visibleUntil.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Announcement;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting announcement:', error);
    throw error;
  }
};

export const getActiveAnnouncements = async (maxResults = 10) => {
  try {
    const now = Timestamp.fromDate(new Date());
    
    // Query for active announcements within visibility timeframe
    // Sort by createdAt in descending order to show newest first
    const q = query(
      announcementsRef,
      where('isActive', '==', true),
      where('visibleFrom', '<=', now),
      where('visibleUntil', '>=', now),
      orderBy('createdAt', 'desc'), // Sort by creation date (newest first)
      limit(maxResults) // Limit the number of results
    );
    
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        ...data,
        visibleFrom: data.visibleFrom.toDate(),
        visibleUntil: data.visibleUntil.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Announcement);
    });
    
    // After sorting by creation date, still prioritize high priority items at the top
    return announcements.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder];
      const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder];
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, keep the newest first (sort by createdAt desc)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  } catch (error) {
    console.error('Error getting active announcements:', error);
    throw error;
  }
};

export const getAllAnnouncements = async () => {
  try {
    const q = query(announcementsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const announcements: Announcement[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      announcements.push({
        id: doc.id,
        ...data,
        visibleFrom: data.visibleFrom.toDate(),
        visibleUntil: data.visibleUntil.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Announcement);
    });
    
    return announcements;
  } catch (error) {
    console.error('Error getting all announcements:', error);
    throw error;
  }
};

export const updateAnnouncement = async (id: string, updates: Partial<Announcement>) => {
  try {
    const docRef = doc(db, 'announcements', id);
    
    // Process date fields if present
    const processedUpdates: Record<string, any> = { ...updates, updatedAt: serverTimestamp() };
    
    if (updates.visibleFrom) {
      processedUpdates.visibleFrom = Timestamp.fromDate(updates.visibleFrom);
    }
    
    if (updates.visibleUntil) {
      processedUpdates.visibleUntil = Timestamp.fromDate(updates.visibleUntil);
    }
    
    await updateDoc(docRef, processedUpdates);
    
    return id;
  } catch (error) {
    console.error('Error updating announcement:', error);
    throw error;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    const docRef = doc(db, 'announcements', id);
    await deleteDoc(docRef);
    
    return id;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    throw error;
  }
};