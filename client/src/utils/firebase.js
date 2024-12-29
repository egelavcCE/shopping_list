import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBMf1UTeDxo6ROqEJ6heZDYUdjAWoLKsLI",
  authDomain: "shoppinglist-5eb60.firebaseapp.com",
  projectId: "shoppinglist-5eb60",
  storageBucket: "shoppinglist-5eb60.applestorage.googleapis.com",
  messagingSenderId: "918103127344",
  appId: "1:918103127344:web:2f8b01a07240ad888684f5",
  measurementId: "G-C6FKFS4D6E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Çevrimdışı veri desteğini etkinleştir
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log('Çoklu sekme açık olduğu için çevrimdışı depolama etkinleştirilemiyor');
    } else if (err.code == 'unimplemented') {
      console.log('Tarayıcı çevrimdışı depolamayı desteklemiyor');
    }
  });

export { db, analytics, auth }; 