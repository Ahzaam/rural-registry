import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Family } from "../types/types";
import { generateRandomId } from "../utils/idGenerator";

const FAMILIES_COLLECTION = "families";

export const getFamilies = async (): Promise<Family[]> => {
  try {
    const q = query(collection(db, FAMILIES_COLLECTION), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Family)
    );
  } catch (error) {
    console.error("Error getting families:", error);
    throw error;
  }
};

export const getFamilyByHomeId = async (homeId: string): Promise<Family | null> => {
  try {
    const q = query(collection(db, FAMILIES_COLLECTION), where("homeId", "==", homeId), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    } as Family;
  } catch (error) {
    console.error("Error getting family by homeId:", error);
    throw error;
  }
};

export const addFamily = async (family: Omit<Family, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    // Generate IDs for members
    const familyWithIds = {
      ...family,
      headOfFamily: { ...family.headOfFamily, id: generateRandomId() },
      spouse: family.spouse ? { ...family.spouse, id: generateRandomId() } : null,
      children: family.children.map((child) => ({ ...child, id: generateRandomId() })),
      otherMembers: family.otherMembers?.map((member) => ({ ...member, id: generateRandomId() })),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, FAMILIES_COLLECTION), familyWithIds);
    return docRef.id;
  } catch (error) {
    console.error("Error adding family:", error);
    throw error;
  }
};

export const updateFamily = async (id: string, family: Partial<Family>): Promise<void> => {
  try {
    const familyRef = doc(db, FAMILIES_COLLECTION, id);
    await updateDoc(familyRef, {
      ...family,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating family:", error);
    throw error;
  }
};

export const deleteFamily = async (id: string): Promise<void> => {
  try {
    const familyRef = doc(db, FAMILIES_COLLECTION, id);
    await deleteDoc(familyRef);
  } catch (error) {
    console.error("Error deleting family:", error);
    throw error;
  }
};

export const getFamilyById = async (id: string): Promise<Family> => {
  try {
    const familyRef = doc(db, FAMILIES_COLLECTION, id);
    const docSnap = await getDoc(familyRef);

    if (!docSnap.exists()) {
      throw new Error("Family not found");
    }

    return {
      id: docSnap.id,
      ...docSnap.data(),
    } as Family;
  } catch (error) {
    console.error("Error getting family by ID:", error);
    throw error;
  }
};
