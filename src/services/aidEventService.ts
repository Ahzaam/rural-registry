import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
  getDoc,
  Timestamp,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { AidEvent, Distribution, MonthlyContribution } from "../types/types";

const EVENTS_COLLECTION = "aidEvents";
const DISTRIBUTIONS_COLLECTION = "distributions";
const CONTRIBUTIONS_COLLECTION = "monthlyContributions";

export const createAidEvent = async (event: Omit<AidEvent, "id" | "createdAt" | "updatedAt">) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
    ...event,
    createdAt: now,
    updatedAt: now,
  });
  return { ...event, id: docRef.id, createdAt: now, updatedAt: now };
};

export const updateAidEvent = async (id: string, event: Partial<AidEvent>) => {
  const docRef = doc(db, EVENTS_COLLECTION, id);
  await updateDoc(docRef, { ...event, updatedAt: Timestamp.now() });
};

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

export const createDistribution = async (distribution: Omit<Distribution, "id" | "createdAt" | "updatedAt">) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, DISTRIBUTIONS_COLLECTION), {
    ...distribution,
    createdAt: now,
    updatedAt: now,
  });
  return { ...distribution, id: docRef.id, createdAt: now, updatedAt: now };
};

export const updateDistribution = async (id: string, distribution: Partial<Distribution>) => {
  const docRef = doc(db, DISTRIBUTIONS_COLLECTION, id);
  await updateDoc(docRef, {
    ...distribution,
    updatedAt: Timestamp.now(),
    ...(distribution.status === "distributed" ? { distributedAt: Timestamp.now() } : {}),
  });
};

export const getDistributionsByEvent = async (eventId: string) => {
  const q = query(collection(db, DISTRIBUTIONS_COLLECTION), where("eventId", "==", eventId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    distributedAt: doc.data().distributedAt ? (doc.data().distributedAt as Timestamp).toDate() : undefined,
    createdAt: (doc.data().createdAt as Timestamp).toDate(),
    updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
  })) as Distribution[];
};

export const getDistribution = async (eventId: string, familyId: string): Promise<Distribution | null> => {
  try {
    const q = query(collection(db, "distributions"), where("eventId", "==", eventId), where("familyId", "==", familyId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as Distribution;
  } catch (error) {
    console.error("Error getting distribution:", error);
    throw error;
  }
};

export const createContribution = async (contribution: Omit<MonthlyContribution, "id" | "createdAt" | "updatedAt">) => {
  const now = Timestamp.now();
  const docRef = await addDoc(collection(db, CONTRIBUTIONS_COLLECTION), {
    ...contribution,
    createdAt: now,
    updatedAt: now,
  });
  return { ...contribution, id: docRef.id, createdAt: now, updatedAt: now };
};

export const updateContribution = async (id: string, contribution: Partial<MonthlyContribution>) => {
  const docRef = doc(db, CONTRIBUTIONS_COLLECTION, id);
  await updateDoc(docRef, { ...contribution, updatedAt: Timestamp.now() });
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
    const q = query(collection(db, "contributions"), where("eventId", "==", eventId), where("familyId", "==", familyId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as MonthlyContribution;
  } catch (error) {
    console.error("Error getting contribution:", error);
    throw error;
  }
};

export const subscribeToEventRecords = (
  eventId: string,
  eventType: "distribution" | "collection",
  callback: (records: (Distribution | MonthlyContribution)[]) => void
) => {
  const collectionName = eventType === "distribution" ? DISTRIBUTIONS_COLLECTION : CONTRIBUTIONS_COLLECTION;
  const q = query(collection(db, collectionName), where("eventId", "==", eventId));

  // Return the unsubscribe function
  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        distributedAt: doc.data().distributedAt ? (doc.data().distributedAt as Timestamp).toDate() : undefined,
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
        updatedAt: (doc.data().updatedAt as Timestamp).toDate(),
      })) as (Distribution | MonthlyContribution)[];
      callback(records);
    },
    (error) => {
      console.error("Error in real-time updates:", error);
    }
  );
};
