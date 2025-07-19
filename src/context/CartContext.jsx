import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

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
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
            lastUpdated: new Date().toISOString()
          };
          return updatedItems;
        } else {
          const newItem = {
            ...product,
            quantity: quantity,
            addedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            cartItemId: api.helpers.generateId()
          };
          return [...prevItems, newItem];
        }
      });

      console.log(`Added ${product.title} to cart`);
      
    } catch (error) {
      setError(error.message);
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const itemTotal = (item.price || 0) * (item.quantity || 0);
      return total + itemTotal;
    }, 0);
  }, [cartItems]);

  const getCartItemsCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  }, [cartItems]);

  const getUniqueItemsCount = useCallback(() => {
    return cartItems.length;
  }, [cartItems]);

  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  const getCartItem = useCallback((productId) => {
    return cartItems.find(item => item.id === productId);
  }, [cartItems]);

  const getItemsByCategory = useCallback((categoryId) => {
    return cartItems.filter(item => item.category?.id === categoryId);
  }, [cartItems]);

  const getCartStats = useCallback(() => {
    const total = getCartTotal();
    const itemCount = getCartItemsCount();
    const uniqueItems = getUniqueItemsCount();
    
    const averagePrice = itemCount > 0 ? total / itemCount : 0;
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

  const mergeCart = useCallback((newItems) => {
    try {
      setCartItems(prevItems => {
        const mergedItems = [...prevItems];
        
        newItems.forEach(newItem => {
          const existingIndex = mergedItems.findIndex(item => item.id === newItem.id);
          
          if (existingIndex >= 0) {
            mergedItems[existingIndex] = {
              ...mergedItems[existingIndex],
              quantity: mergedItems[existingIndex].quantity + newItem.quantity
            };
          } else {
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

  const validateCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const validItems = [];
      const invalidItems = [];

      for (const item of cartItems) {
        try {
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

  const calculateShipping = useCallback((shippingMethod = 'standard') => {
    const total = getCartTotal();
    const itemCount = getCartItemsCount();
    if (total >= 50) {
      return { cost: 0, method: 'free', estimatedDays: '3-5' };
    }
    
    const shippingRates = {
      standard: { cost: 9.99, estimatedDays: '5-7' },
      express: { cost: 19.99, estimatedDays: '2-3' },
      overnight: { cost: 39.99, estimatedDays: '1' }
    };
    
    const shipping = shippingRates[shippingMethod] || shippingRates.standard;
    if (itemCount > 10) {
      shipping.cost += 5.00;
    }
    
    return { ...shipping, method: shippingMethod };
  }, [getCartTotal, getCartItemsCount]);
  const getRecommendedProducts = useCallback(async () => {
    try {
      if (cartItems.length === 0) {
        return [];
      }
      const categories = [...new Set(cartItems.map(item => item.category?.id).filter(Boolean))];
      
      if (categories.length === 0) {
        return [];
      }
      const recommendations = await api.products.getByCategory(categories[0], 4);
      return recommendations.filter(product => !isInCart(product.id));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }, [cartItems, isInCart]);
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue = {
    cartItems,
    isLoading,
    error,
    cartId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getUniqueItemsCount,
    getCartStats,
    isInCart,
    getCartItem,
    getItemsByCategory,
    mergeCart,
    validateCart,
    applyDiscount,
    calculateShipping,
    getRecommendedProducts,
    clearError,
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

export const withCart = (Component) => {
  return function WrappedComponent(props) {
    return (
      <CartProvider>
        <Component {...props} />
      </CartProvider>
    );
  };
};

export const cartUtils = {
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
  getStorageSize: () => {
    try {
      const cart = localStorage.getItem('shopping_cart') || '';
      const metadata = localStorage.getItem('cart_metadata') || '';
      return cart.length + metadata.length;
    } catch (error) {
      return 0;
    }
  },
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