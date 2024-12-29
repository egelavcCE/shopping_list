import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/Header/Header';
import ShoppingList from './components/ShoppingList';
import Cart from './components/Cart/Cart';
import Favorites from './components/Favorites/Favorites';
import HistoryLists from './components/History/HistoryLists';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
import SharedList from './components/SharedList/SharedList';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const handleAddToList = (product, skipCheck = false) => {
    if (!skipCheck) {
      const existingItem = cartItems.find(item => item["Ürün Adı"] === product["Ürün Adı"]);
      
      if (existingItem) {
        throw new Error('Bu ürün zaten listenizde bulunuyor!');
      }
    }

    const newItem = {
      ...product,
      id: Date.now().toString(),
      quantity: product.quantity || 1,
      completed: product.completed || false,
      note: product.note || ''
    };

    setCartItems(prevItems => [...prevItems, newItem]);
  };

  const handleAddMultipleToList = (products) => {
    products.forEach(product => {
      try {
        handleAddToList({
          "Ürün Adı": product.name,
          "Resim URL": product.imageUrl,
          quantity: product.quantity,
          completed: false,
          note: product.note || ''
        }, true);
      } catch (error) {
        console.error('Ürün eklenirken hata:', error);
      }
    });
  };

  const handleAddToFavorites = (product) => {
    const existingFavorite = favorites.find(item => item["Ürün Adı"] === product["Ürün Adı"]);
    
    if (existingFavorite) {
      throw new Error('Bu ürün zaten favorilerinizde!');
    }

    setFavorites(prevFavorites => [...prevFavorites, product]);
  };

  const handleRemoveFromFavorites = (product) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item["Ürün Adı"] !== product["Ürün Adı"])
    );
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  return (
    <CustomThemeProvider>
      <AuthProvider>
        <Router>
          <Header 
            onSearch={handleSearch} 
            cartItems={cartItems}
            favorites={favorites}
          />
          <Routes>
            <Route 
              path="/" 
              element={
                <ShoppingList 
                  searchTerm={searchTerm}
                  onSearchChange={handleSearch}
                  onAddToList={handleAddToList}
                  onAddToFavorites={handleAddToFavorites}
                />
              } 
            />
            <Route 
              path="/cart" 
              element={<Cart items={cartItems} setItems={setCartItems} />} 
            />
            <Route 
              path="/favorites" 
              element={
                <Favorites 
                  favorites={favorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  onAddToList={handleAddToList}
                />
              } 
            />
            <Route 
              path="/history" 
              element={<HistoryLists onAddMultipleToList={handleAddMultipleToList} />} 
            />
            <Route 
              path="/share/:listId" 
              element={<SharedList />} 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </CustomThemeProvider>
  );
}

export default App;
