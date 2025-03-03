import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

interface FeatureFlags {
  enableLandingPage: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableLandingPage: true,
};

export const getFeatureFlags = async (): Promise<FeatureFlags> => {
  try {
    const featureFlagsDoc = await getDoc(doc(db, 'config', 'featureFlags'));
    if (featureFlagsDoc.exists()) {
      return { ...DEFAULT_FLAGS, ...featureFlagsDoc.data() as FeatureFlags };
    }
    return DEFAULT_FLAGS;
  } catch (error) {
    console.error('Error fetching feature flags:', error);
    return DEFAULT_FLAGS;
  }
};

export const updateFeatureFlags = async (flags: Partial<FeatureFlags>): Promise<void> => {
  try {
    const currentFlags = await getFeatureFlags();
    await setDoc(doc(db, 'config', 'featureFlags'), {
      ...currentFlags,
      ...flags
    });
  } catch (error) {
    console.error('Error updating feature flags:', error);
    throw error;
  }
};