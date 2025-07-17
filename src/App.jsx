import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetailsPage from './pages/ProductDetails';
import CartPage from './pages/Cart';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        
        await new Promise(resolve => setTimeout(resolve, 1000)); 
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
    window.location.href = `/products?search=${encodeURIComponent(term)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-4">ShopClone</div>
          <Loading text="Loading application..." />
        </div>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header 
            onSearch={handleSearch}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
            
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetailsPage />} />
              
              <Route path="/cart" element={<CartPage />} />
              
              <Route path="/about" element={<About />} />
              
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

    
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;