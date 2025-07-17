import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, User, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = ({ onSearch, searchTerm, setSearchTerm }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else if (searchTerm?.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isLoggedIn = localStorage.getItem('token');
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">ShopClone</h1>
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm || ''}
                onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={closeMenus}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                onClick={closeMenus}
              >
                Products
              </Link>
            </nav>
            
            <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Heart className="h-6 w-6" />
            </button>

            <Link 
              to="/cart" 
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={closeMenus}
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {getCartItemsCount()}
                </span>
              )}
            </Link>

            <div className="relative">
              {isLoggedIn ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <User className="h-6 w-6" />
                    <span className="hidden lg:block font-medium">{user?.name || 'User'}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeMenus}
                      >
                        Profile
                      </Link>
                      <Link 
                        to="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={closeMenus}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                    onClick={closeMenus}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={closeMenus}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="mb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm || ''}
                  onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </form>
            </div>

            <nav className="flex flex-col space-y-3 mb-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 py-2 font-medium transition-colors"
                onClick={closeMenus}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-600 hover:text-gray-900 py-2 font-medium transition-colors"
                onClick={closeMenus}
              >
                Products
              </Link>
              <Link 
                to="/cart" 
                className="text-gray-600 hover:text-gray-900 py-2 flex items-center font-medium transition-colors"
                onClick={closeMenus}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart ({getCartItemsCount()})
              </Link>
              <button className="text-gray-600 hover:text-gray-900 py-2 flex items-center font-medium transition-colors text-left">
                <Heart className="h-5 w-5 mr-2" />
                Wishlist
              </button>
            </nav>

            <div className="border-t pt-4">
              {isLoggedIn ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-900">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user?.name || 'User'}</span>
                  </div>
                  <Link 
                    to="/profile" 
                    className="block text-gray-600 hover:text-gray-900 py-1 transition-colors"
                    onClick={closeMenus}
                  >
                    Profile
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block text-gray-600 hover:text-gray-900 py-1 transition-colors"
                    onClick={closeMenus}
                  >
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block text-red-600 hover:text-red-700 py-1 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center bg-gray-100 text-gray-900 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    onClick={closeMenus}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    onClick={closeMenus}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;