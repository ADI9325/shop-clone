import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, ArrowLeft, CreditCard, Lock, Truck } from 'lucide-react';
import CartItem from './CartItem';
import Button from '../common/Button';
import api from '../../services/api';

const Cart = () => {
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const discount = subtotal * (promoDiscount / 100);
  const total = subtotal + shipping + tax - discount;

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = async (itemId) => {
    removeFromCart(itemId);
  };

  const handleMoveToWishlist = async (item) => {
    console.log('Moving to wishlist:', item.title);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    
    const promoCodes = {
      'SAVE10': 10,
      'WELCOME15': 15,
      'SAVE20': 20
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setPromoDiscount(promoCodes[promoCode.toUpperCase()]);
      setPromoCode('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate('/');
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-12 w-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>
          
          <div className="space-x-4">
            <Button 
              variant="primary" 
              size="large"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              size="large"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-1">
            {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continue Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                onMoveToWishlist={handleMoveToWishlist}
              />
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
            >
              Clear entire cart
            </button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  variant="outline"
                  size="medium"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim()}
                >
                  Apply
                </Button>
              </div>
              {promoError && (
                <p className="text-red-600 text-sm mt-1">{promoError}</p>
              )}
              {promoDiscount > 0 && (
                <p className="text-green-600 text-sm mt-1">
                  Promo code applied! {promoDiscount}% off
                </p>
              )}
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{api.helpers.formatPrice(subtotal)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    api.helpers.formatPrice(shipping)
                  )}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">{api.helpers.formatPrice(tax)}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-medium text-green-600">
                    -{api.helpers.formatPrice(discount)}
                  </span>
                </div>
              )}
              
              <hr className="border-gray-300" />
              
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{api.helpers.formatPrice(total)}</span>
              </div>
            </div>

            <div className="mb-6 p-3 bg-blue-50 rounded-md">
              <div className="flex items-center space-x-2 text-sm text-blue-800">
                <Truck className="h-4 w-4" />
                <span>
                  {shipping === 0 
                    ? 'Free shipping on this order!' 
                    : `Add ${api.helpers.formatPrice(50 - subtotal)} more for free shipping`
                  }
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="large"
              onClick={handleCheckout}
              loading={isCheckingOut}
              className="w-full mb-4"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
            </Button>

            <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
              <Lock className="h-3 w-3" />
              <span>Secure checkout with SSL encryption</span>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 mb-2">We accept</p>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  MC
                </div>
                <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  AMEX
                </div>
                <div className="w-8 h-5 bg-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">
                  PP
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;