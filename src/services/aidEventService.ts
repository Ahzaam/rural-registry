import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { AidEvent, Distribution, MonthlyContribution } from "../types/types";

const EVENTS_COLLECTION = "aid_events";
const DISTRIBUTIONS_COLLECTION = "distributions";
const CONTRIBUTIONS_COLLECTION = "contributions";

export const createAidEvent = async (event: Omit<AidEvent, "id" | "createdAt" | "updatedAt">) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...event,
    createdAt: now,
    updatedAt: now,
  });
  return { ...event, id: docRef.id, createdAt: now, updatedAt: now };
};

// export const updateAidEvent = async (id: string, event: Partial<AidEvent>) => {
//   const docRef = doc(db, EVENTS_COLLECTION, id);
//   await updateDoc(docRef, { ...event, updatedAt: Timestamp.now() });
// };

export const getAidEvents = async () => {
  const q = query(collection(db, EVENTS_COLLECTION), orderBy("date", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    date: (doc.data().date as Timestamp).toDate(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
  })) as AidEvent[];
};

export const getAidEvent = async (eventId: string): Promise<AidEvent> => {
  const docRef = doc(db, EVENTS_COLLECTION, eventId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Event not found");
  }
  return {
    id: docSnap.id,
    ...docSnap.data(),
    date: (docSnap.data().date as Timestamp).toDate(),
    createdAt: (docSnap.data().createdAt as Timestamp).toDate(),
    updatedAt: (docSnap.data().updatedAt as Timestamp).toDate(),
  } as AidEvent;
};

export const createDistribution = async (distribution: Omit<Distribution, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  try {
    const distributionWithTimestamp = {
      ...distribution,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, DISTRIBUTIONS_COLLECTION), distributionWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error creating distribution:", error);
    throw error;
  }
};

export const updateDistribution = async (id: string, distribution: Partial<Distribution>): Promise<void> => {
  try {
    const distributionRef = doc(db, DISTRIBUTIONS_COLLECTION, id);
    await updateDoc(distributionRef, {
      ...distribution,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating distribution:", error);
    throw error;
  }
};

export const getDistributionsByEvent = async (eventId: string) => {
  const q = query(collection(db, DISTRIBUTIONS_COLLECTION), where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    distributedAt: doc.data().distributedAt ? (doc.data().distributedAt as Timestamp).toDate() : "",
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
  })) as unknown as Distribution[];
};

export const getDistribution = async (eventId: string, familyId: string): Promise<Distribution | null> => {
  try {
    const q = query(collection(db, DISTRIBUTIONS_COLLECTION), where("eventId", "==", eventId), where("familyId", "==", familyId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Distribution;
  } catch (error) {
    console.error("Error getting distribution:", error);
    throw error;
  }
};

export const createContribution = async (
  contribution: Omit<MonthlyContribution, "id" | "createdAt" | "updatedAt">
): Promise<string> => {
  try {
    const contributionWithTimestamp = {
      ...contribution,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, CONTRIBUTIONS_COLLECTION), contributionWithTimestamp);
    return docRef.id;
  } catch (error) {
    console.error("Error creating contribution:", error);
    throw error;
  }
};

export const updateContribution = async (id: string, contribution: Partial<MonthlyContribution>): Promise<void> => {
  try {
    const contributionRef = doc(db, CONTRIBUTIONS_COLLECTION, id);
    await updateDoc(contributionRef, {
      ...contribution,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating contribution:", error);
    throw error;
  }
};

export const getContributionsByEvent = async (eventId: string) => {
  const q = query(collection(db, CONTRIBUTIONS_COLLECTION), where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
  })) as MonthlyContribution[];
};

export const getContribution = async (eventId: string, familyId: string): Promise<MonthlyContribution | null> => {
  try {
    const q = query(collection(db, CONTRIBUTIONS_COLLECTION), where("eventId", "==", eventId), where("familyId", "==", familyId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as MonthlyContribution;
  } catch (error) {
    console.error("Error getting contribution:", error);
    throw error;
  }
};

export const subscribeToEventRecords = (
  eventId: string,
  type: "distribution" | "collection",
  callback: (records: (Distribution | MonthlyContribution)[]) => void
): (() => void) => {
  const collectionName = type === "distribution" ? DISTRIBUTIONS_COLLECTION : CONTRIBUTIONS_COLLECTION;
  const q = query(collection(db, collectionName), where("eventId", "==", eventId), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (Distribution | MonthlyContribution)[];
    callback(records);
  });
};

export const updateAidEvent = async (eventId: string, event: AidEvent): Promise<void> => {
  const eventRef = doc(db, "aidEvents", eventId);
  await updateDoc(eventRef, {
    ...event,
    updatedAt: Timestamp.now(),
  });
};
