// src/context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Create the context
const CartContext = createContext();

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  useEffect(() => {
    saveCartToStorage();
  }, [cartItems]);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('shopping_cart');
      const savedCartId = localStorage.getItem('cart_id');
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
      
      if (savedCartId) {
        setCartId(savedCartId);
      } else {
        const newCartId = api.helpers.generateId();
        setCartId(newCartId);
        localStorage.setItem('cart_id', newCartId);
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
      setCartItems([]);
    }
  };

  const saveCartToStorage = () => {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
      
      // Also save cart metadata
      const cartMetadata = {
        itemCount: getCartItemsCount(),
        lastUpdated: new Date().toISOString(),
        cartId: cartId
      };
      localStorage.setItem('cart_metadata', JSON.stringify(cartMetadata));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  };

  // Add item to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      setIsLoading(true);
      setError(null);

      // Validate product
      if (!product || !product.id) {
        throw new Error('Invalid product data');
      }

      // Validate quantity
      if (quantity < 1) {
        throw new Error('Quantity must be at least 1');
      }

      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex >= 0) {
          // Item already exists, update quantity
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            lastUpdated: new Date().toISOString()
          };
          return updatedItems;
        } else {
          // New item, add to cart
          const newItem = {
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            cartItemId: api.helpers.generateId() // Unique ID for cart item
          };
          return [...prevItems, newItem];
        }
      });

      // Show success feedback (you can customize this)
      console.log(`Added ${product.title} to cart`);
      
    } catch (error) {
      setError(error.message);
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    try {
      setCartItems(prevItems => 
        prevItems.filter(item => item.id !== productId)
      );
      console.log(`Removed item ${productId} from cart`);
    } catch (error) {
      setError('Failed to remove item from cart');
      console.error('Error removing from cart:', error);
    }
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        removeFromCart(productId);
        return;
      }

      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId 
            ? { 
                ...item, 
                quantity: newQuantity,
                lastUpdated: new Date().toISOString()
              }
            : item
        )
      );
    } catch (error) {
      setError('Failed to update quantity');
      console.error('Error updating quantity:', error);
    }
  }, [removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    try {
      setCartItems([]);
      localStorage.removeItem('shopping_cart');
      localStorage.removeItem('cart_metadata');
      console.log('Cart cleared');
    } catch (error) {
      setError('Failed to clear cart');
      console.error('Error clearing cart:', error);
    }
  }, []);

  // Get cart total (price)
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  }, [cartItems]);

  // Get total number of items in cart
  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  // Get unique items count (different products)
  const getUniqueItemsCount = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  // Get specific item from cart
  const getCartItem = useCallback((productId) => {
    return cartItems.find(item => item.id === productId);
  }, [cartItems]);

  // Get cart items by category
  const getItemsByCategory = useCallback((categoryId) => {
    return cartItems.filter(item => item.category?.id === categoryId);
  }, [cartItems]);

  // Calculate cart statistics
  const getCartStats = useCallback(() => {
    const total = getCartTotal();
    const itemCount = getCartItemsCount();
    const uniqueItems = getUniqueItemsCount();
    
    // Calculate average price per item
    const averagePrice = itemCount > 0 ? total / itemCount : 0;
    
    // Find most expensive and cheapest items
    const prices = cartItems.map(item => item.price || 0);
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

    return {
      total,
      itemCount,
      uniqueItems,
      averagePrice,
      maxPrice,
      minPrice,
      isEmpty: cartItems.length === 0
    };
  }, [cartItems, getCartTotal, getCartItemsCount, getUniqueItemsCount]);

  // Merge cart (useful for login scenarios)
  const mergeCart = useCallback((newItems) => {
    try {
      setCartItems(prevItems => {
        const mergedItems = [...prevItems];
        
        newItems.forEach(newItem => {
          const existingIndex = mergedItems.findIndex(item => item.id === newItem.id);
          
          if (existingIndex >= 0) {
            // Merge quantities
            mergedItems[existingIndex] = {
              ...mergedItems[existingIndex],
              quantity: mergedItems[existingIndex].quantity + newItem.quantity
            };
          } else {
            // Add new item
            mergedItems.push({
              ...newItem,
              cartItemId: api.helpers.generateId()
            });
          }
        });
        
        return mergedItems;
      });
    } catch (error) {
      setError('Failed to merge cart');
      console.error('Error merging cart:', error);
    }
  }, []);

  // Validate cart items (check if products still exist)
  const validateCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const validItems = [];
      const invalidItems = [];

      for (const item of cartItems) {
        try {
          // Check if product still exists
          await api.products.getById(item.id);
          validItems.push(item);
        } catch (error) {
          invalidItems.push(item);
        }
      }

      if (invalidItems.length > 0) {
        setCartItems(validItems);
        console.warn(`Removed ${invalidItems.length} invalid items from cart`);
      }

      return { validItems, invalidItems };
    } catch (error) {
      console.error('Error validating cart:', error);
      return { validItems: cartItems, invalidItems: [] };
    } finally {
      setIsLoading(false);
    }
  }, [cartItems]);

  // Apply discount to cart
  const applyDiscount = useCallback((discountPercent) => {
    try {
      const discountAmount = getCartTotal() * (discountPercent / 100);
      return {
        originalTotal: getCartTotal(),
        discountPercent,
        discountAmount,
        finalTotal: getCartTotal() - discountAmount
      };
    } catch (error) {
      console.error('Error applying discount:', error);
      return null;
    }
  }, [getCartTotal]);

  // Estimate shipping cost
  const calculateShipping = useCallback((shippingMethod = 'standard') => {
    const total = getCartTotal();
    const itemCount = getCartItemsCount();
    
    // Free shipping over $50
    if (total >= 50) {
      return { cost: 0, method: 'free', estimatedDays: '3-5' };
    }
    
    const shippingRates = {
      standard: { cost: 9.99, estimatedDays: '5-7' },
      express: { cost: 19.99, estimatedDays: '2-3' },
      overnight: { cost: 39.99, estimatedDays: '1' }
    };
    
    const shipping = shippingRates[shippingMethod] || shippingRates.standard;
    
    // Add extra cost for heavy orders
    if (itemCount > 10) {
      shipping.cost += 5.00;
    }
    
    return { ...shipping, method: shippingMethod };
  }, [getCartTotal, getCartItemsCount]);

  // Get recommended products based on cart
  const getRecommendedProducts = useCallback(async () => {
    try {
      if (cartItems.length === 0) {
        return [];
      }

      // Get categories from cart items
      const categories = [...new Set(cartItems.map(item => item.category?.id).filter(Boolean))];
      
      if (categories.length === 0) {
        return [];
      }

      // Get products from same categories
      const recommendations = await api.products.getByCategory(categories[0], 4);
      
      // Filter out items already in cart
      return recommendations.filter(product => !isInCart(product.id));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }, [cartItems, isInCart]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Context value
  const contextValue = {
    // State
    cartItems,
    isLoading,
    error,
    cartId,
    
    // Core actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    
    // Calculations
    getCartTotal,
    getCartItemsCount,
    getUniqueItemsCount,
    getCartStats,
    
    // Utilities
    isInCart,
    getCartItem,
    getItemsByCategory,
    
    // Advanced features
    mergeCart,
    validateCart,
    applyDiscount,
    calculateShipping,
    getRecommendedProducts,
    
    // Error handling
    clearError,
    
    // Formatters (using API helpers)
    formatPrice: api.helpers.formatPrice,
    calculateCartTotal: api.helpers.calculateCartTotal,
    calculateCartItemsCount: api.helpers.calculateCartItemsCount
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// HOC for components that need cart context
export const withCart = (Component) => {
  return function WrappedComponent(props) {
    return (
      <CartProvider>
        <Component {...props} />
      </CartProvider>
    );
  };
};

// Cart persistence utilities
export const cartUtils = {
  // Export cart data
  exportCart: () => {
    try {
      const cartData = localStorage.getItem('shopping_cart');
      const metadata = localStorage.getItem('cart_metadata');
      
      return {
        items: cartData ? JSON.parse(cartData) : [],
        metadata: metadata ? JSON.parse(metadata) : null,
        exportedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting cart:', error);
      return null;
    }
  },
  
  // Import cart data
  importCart: (cartData) => {
    try {
      if (cartData && cartData.items) {
        localStorage.setItem('shopping_cart', JSON.stringify(cartData.items));
        if (cartData.metadata) {
          localStorage.setItem('cart_metadata', JSON.stringify(cartData.metadata));
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing cart:', error);
      return false;
    }
  },
  
  // Get cart size in storage
  getStorageSize: () => {
    try {
      const cart = localStorage.getItem('shopping_cart') || '';
      const metadata = localStorage.getItem('cart_metadata') || '';
      return cart.length + metadata.length;
    } catch (error) {
      return 0;
    }
  },
  
  // Clear all cart data
  clearStorage: () => {
    try {
      localStorage.removeItem('shopping_cart');
      localStorage.removeItem('cart_metadata');
      localStorage.removeItem('cart_id');
      return true;
    } catch (error) {
      console.error('Error clearing cart storage:', error);
      return false;
    }
  }
};

export default CartContext;