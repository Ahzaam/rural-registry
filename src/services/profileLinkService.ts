import { collection, doc, getDoc, updateDoc, setDoc, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { db } from '../firebase/config';

interface ProfileToken {
  id: string;
  familyId: string;
  maskedPhone: string;
  maskedNIC: string;
  expiresAt: Timestamp;
  verificationAttempts: number;
  isVerified: boolean;
  createdAt: Timestamp;
}

export class ProfileVerificationError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'ProfileVerificationError';
  }
}

export const generateProfileToken = async (familyId: string, phone: string, nic: string) => {
  try {
    const token = generateRandomToken();
    const tokenData: ProfileToken = {
      id: token,
      familyId,
      maskedPhone: maskPhoneNumber(phone),
      maskedNIC: maskNICNumber(nic),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      verificationAttempts: 0,
      isVerified: false,
      createdAt: Timestamp.fromDate(new Date())
    };
    
    await setDoc(doc(db, 'profileTokens', token), tokenData);
    return token;
  } catch (error) {
    console.error('Error generating profile token:', error);
    throw new ProfileVerificationError('Failed to generate profile link', 'generation_failed');
  }
};

import { getFunctions, httpsCallable } from 'firebase/functions';

export const verifyProfileToken = async (token: string, phone: string, nic: string) => {
  try {
    const functions = getFunctions();
    const verifyProfile = httpsCallable(functions, 'verifyProfile');
    
    const result = await verifyProfile({
      token,
      phone,
      nic
    });

    return result.data;
  } catch (error: any) {
    console.error('Verification failed:', error);
    const message = error.message || '';
    
    if (error.code === 'resource-exhausted') {
      throw new ProfileVerificationError('Maximum verification attempts reached. Please request a new verification link.', 'max_attempts');
    }
    if (error.code === 'permission-denied') {
      throw new ProfileVerificationError(message, 'invalid_details');
    }
    if (error.code === 'not-found') {
      throw new ProfileVerificationError('Invalid verification link', 'invalid_token');
    }
    if (error.code === 'failed-precondition') {
      if (message.includes('expired')) {
        throw new ProfileVerificationError('This verification link has expired', 'link_expired');
      }
      throw new ProfileVerificationError(message, 'verification_failed');
    }
    throw new ProfileVerificationError('Failed to verify profile link', 'verification_failed');
  }
};

export const getTokenDetails = async (token: string) => {
  try {
    const tokenDoc = await getDoc(doc(db, 'profileTokens', token));
    if (!tokenDoc.exists()) {
      throw new ProfileVerificationError('Invalid verification link', 'invalid_token');
    }
    return tokenDoc.data() as ProfileToken;
  } catch (error) {
    console.error('Error getting token details:', error);
    throw new ProfileVerificationError('Failed to get token details', 'token_retrieval_failed');
  }
};

// Helper functions
const maskPhoneNumber = (phone: string) => {
  // Check if phone has country code (starts with + and has more than 10 digits)
  const hasCountryCode = phone.startsWith('+') && phone.length > 10;
  if (hasCountryCode) {
    // Get country code part (everything until the last 10 digits)
    const countryCode = phone.slice(0, phone.length - 10);
    const lastThree = phone.slice(-3);
    return `${countryCode}${'*'.repeat(7)}${lastThree}`;
  } else {
    // No country code, just show last 3 digits
    const lastThree = phone.slice(-3);
    return `${'*'.repeat(phone.length - 3)}${lastThree}`;
  }
};

const maskNICNumber = (nic: string) => {
  const lastTwo = nic.slice(-2);
  return `${'*'.repeat(nic.length - 2)}${lastTwo}`;
};

const generateRandomToken = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let token = '';
  for (let i = 0; i < 15; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }
  return token;
};