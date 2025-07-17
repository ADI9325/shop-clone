import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const CartSummary = ({ 
  showDetails = false, 
  className = "",
  onCheckout 
}) => {
  const { cartItems, getCartTotal, getCartItemsCount } = useCart();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-4 text-center ${className}`}>
        <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Cart Summary ({getCartItemsCount()} items)
      </h3>

      {showDetails && (
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{api.helpers.formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? 'FREE' : api.helpers.formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span>{api.helpers.formatPrice(tax)}</span>
          </div>
          <hr className="border-gray-200" />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-xl font-bold text-gray-900">
          {api.helpers.formatPrice(total)}
        </span>
      </div>

      {onCheckout && (
        <button
          onClick={onCheckout}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;