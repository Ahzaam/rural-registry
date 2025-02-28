import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwzBmToSTV5-nKSDjy27H3eu8FK5gAuHI",
  authDomain: "hapugastalawa-00000.firebaseapp.com",
  projectId: "hapugastalawa-00000",
  storageBucket: "hapugastalawa-00000.appspot.com",
  messagingSenderId: "712965436826",
  appId: "1:712965436826:web:59ee59e634c962c1577623",
  measurementId: "G-PSWYRTXS37"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
