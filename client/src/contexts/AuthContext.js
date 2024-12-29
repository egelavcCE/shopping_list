import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../utils/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Kullanıcı bilgilerini Firestore'dan al
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              uid: user.uid,
              email: user.email,
              name: userData.name,
              ...userData
            });
          } else {
            // Eğer kullanıcı dokümanı yoksa oluştur
            const userData = {
              email: user.email,
              name: user.email.split('@')[0],
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            };
            await setDoc(userDocRef, userData);
            setUser({
              uid: user.uid,
              email: user.email,
              name: userData.name,
              ...userData
            });
          }
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Kullanıcı bilgileri alınırken hata:', error);
          setUser({
            uid: user.uid,
            email: user.email,
            name: user.email.split('@')[0]
          });
          setIsAuthenticated(true);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, name) => {
    try {
      // Firebase Authentication ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Kullanıcı bilgilerini Firestore'a kaydet
      const userRef = doc(db, 'users', userCredential.user.uid);
      const userData = {
        name,
        email,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await setDoc(userRef, userData);
      
      setUser({
        uid: userCredential.user.uid,
        email,
        name,
        ...userData
      });

      return userCredential.user;
    } catch (error) {
      console.error('Kayıt hatası:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Son giriş zamanını güncelle
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });

      return userCredential.user;
    } catch (error) {
      console.error('Giriş hatası:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user?.uid) {
        try {
          // Son çıkış zamanını güncelle
          await setDoc(doc(db, 'users', user.uid), {
            lastLogout: serverTimestamp()
          }, { merge: true });
        } catch (firestoreError) {
          console.error('Son çıkış zamanı güncellenirken hata:', firestoreError);
        }
      }
      await signOut(auth);
    } catch (error) {
      console.error('Çıkış hatası:', error);
      throw new Error('Çıkış sırasında bir hata oluştu: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 