import { db } from '../firebase/config';
import { doc, updateDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { Family, HomeHistory, PaymentRecord } from '../types/types';

const FAMILIES_COLLECTION = 'families';

export const addHomeHistory = async (familyId: string, homeHistory: HomeHistory): Promise<void> => {
  try {
    const familyRef = doc(db, FAMILIES_COLLECTION, familyId);
    await updateDoc(familyRef, {
      homeHistory: arrayUnion({
        ...homeHistory,
        fromDate: homeHistory.fromDate instanceof Date ? Timestamp.fromDate(homeHistory.fromDate) : homeHistory.fromDate,
        toDate: homeHistory.toDate instanceof Date ? Timestamp.fromDate(homeHistory.toDate) : homeHistory.toDate
      })
    });
  } catch (error) {
    console.error('Error adding home history:', error);
    throw error;
  }
};

export const addPaymentRecord = async (familyId: string, paymentRecord: PaymentRecord): Promise<void> => {
  try {
    const familyRef = doc(db, FAMILIES_COLLECTION, familyId);

    console.log(paymentRecord)
    await updateDoc(familyRef, {
      paymentHistory: arrayUnion({
        ...paymentRecord,
        date: paymentRecord.date instanceof Date ? Timestamp.fromDate(paymentRecord.date) : paymentRecord.date
      })
    });
  } catch (error) {
    console.error('Error adding payment record:', error);
    throw error;
  }
};