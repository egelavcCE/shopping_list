import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { db } from './firebase';

// Yeni alışveriş listesi oluştur
export const createShoppingList = async (userId, listName = 'Yeni Liste') => {
  try {
    const listRef = doc(collection(db, 'shoppingLists'));
    const listData = {
      id: listRef.id,
      userId,
      name: listName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(listRef, listData);
    return listRef.id;
  } catch (error) {
    console.error('Liste oluşturulurken hata:', error);
    throw new Error('Liste oluşturulamadı');
  }
};

// Listeye ürün ekle veya güncelle
export const updateShoppingListItems = async (listId, items) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    const itemsCollection = collection(listRef, 'items');
    
    // Her ürün için ayrı döküman oluştur
    for (const item of items) {
      const itemRef = doc(itemsCollection, item.id);
      await setDoc(itemRef, {
        id: item.id,
        name: item["Ürün Adı"],
        imageUrl: item["Resim URL"],
        quantity: item.quantity,
        completed: item.completed,
        note: item.note,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error('Ürünler kaydedilirken hata:', error);
    throw new Error('Ürünler kaydedilemedi');
  }
};

// Kullanıcının listelerini getir
export const getUserLists = async (userId) => {
  try {
    const listsRef = collection(db, 'shoppingLists');
    const q = query(listsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const lists = [];
    for (const doc of querySnapshot.docs) {
      const list = {
        id: doc.id,
        ...doc.data()
      };
      
      // Her liste için ürün sayısını al
      const itemsCollection = collection(db, 'shoppingLists', doc.id, 'items');
      const itemsSnapshot = await getDocs(itemsCollection);
      list.itemCount = itemsSnapshot.size;
      
      lists.push(list);
    }
    
    return lists;
  } catch (error) {
    console.error('Listeler alınırken hata:', error);
    throw new Error('Listeler alınamadı');
  }
};

// Liste detaylarını getir
export const getShoppingList = async (listId) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    const listDoc = await getDoc(listRef);
    
    if (!listDoc.exists()) {
      throw new Error('Liste bulunamadı');
    }

    const itemsCollection = collection(db, 'shoppingLists', listId, 'items');
    const itemsSnapshot = await getDocs(itemsCollection);
    const items = itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      id: listDoc.id,
      ...listDoc.data(),
      items
    };
  } catch (error) {
    console.error('Liste detayları alınırken hata:', error);
    throw new Error('Liste detayları alınamadı');
  }
};

// Listeyi tekrarla
export const replicateList = async (userId, originalList) => {
  try {
    // Yeni liste oluştur
    const listRef = doc(collection(db, 'shoppingLists'));
    const listData = {
      id: listRef.id,
      userId,
      name: `${originalList.name} (Kopya)`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    await setDoc(listRef, listData);

    // Ürünleri yeni listeye kopyala
    const itemsCollection = collection(listRef, 'items');
    for (const item of originalList.items) {
      const itemRef = doc(itemsCollection);
      await setDoc(itemRef, {
        ...item,
        id: itemRef.id,
        updatedAt: serverTimestamp()
      });
    }

    return listRef.id;
  } catch (error) {
    console.error('Liste kopyalanırken hata:', error);
    throw new Error('Liste kopyalanamadı');
  }
};

// Liste paylaşım ayarlarını güncelle
export const updateListSharing = async (listId, isShared = true) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    await updateDoc(listRef, {
      isShared,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Liste paylaşım ayarları güncellenirken hata:', error);
    throw new Error('Liste paylaşım ayarları güncellenemedi');
  }
};

// Paylaşılan listeyi getir
export const getSharedList = async (listId) => {
  try {
    const listRef = doc(db, 'shoppingLists', listId);
    const listDoc = await getDoc(listRef);
    
    if (!listDoc.exists()) {
      throw new Error('Liste bulunamadı');
    }

    const listData = listDoc.data();
    if (!listData.isShared) {
      throw new Error('Bu liste paylaşıma kapalı');
    }

    const itemsCollection = collection(db, 'shoppingLists', listId, 'items');
    const itemsSnapshot = await getDocs(itemsCollection);
    const items = itemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      id: listDoc.id,
      ...listData,
      items
    };
  } catch (error) {
    console.error('Paylaşılan liste alınırken hata:', error);
    throw new Error('Paylaşılan liste alınamadı');
  }
}; 