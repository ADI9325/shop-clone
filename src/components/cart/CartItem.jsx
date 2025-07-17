import React, { useState } from 'react';
import { Trash2, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item.id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      setIsRemoving(false);
    }
  };

  const handleMoveToWishlist = async () => {
    try {
      if (onMoveToWishlist) {
        await onMoveToWishlist(item);
      }
      await onRemove(item.id);
    } catch (error) {
      console.error('Failed to move to wishlist:', error);
    }
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 transition-opacity ${isRemoving ? 'opacity-50' : ''}`}>
      <div className="flex items-start space-x-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={api.helpers.getImageUrl(item.images?.[0])}
            alt={item.title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h3 className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                {item.title}
              </h3>
              
              <p className="text-sm text-gray-500 mt-1">
                Category: {item.category?.name}
              </p>
              
              <div className="flex items-center mt-2">
                <span className="text-lg font-semibold text-gray-900">
                  {api.helpers.formatPrice(item.price)}
                </span>
                {item.originalPrice && item.originalPrice > item.price && (
                  <span className="ml-2 text-sm text-gray-500 line-through">
                    {api.helpers.formatPrice(item.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {api.helpers.formatPrice(itemTotal)}
              </p>
            </div>
          </div>

          {/* Quantity Controls and Actions */}
          <div className="flex items-center justify-between mt-4">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Qty:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                
                <span className="px-3 py-1 text-center min-w-[3rem] text-sm font-medium">
                  {isUpdating ? '...' : item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating}
                  className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMoveToWishlist}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Move to Wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>
              
              <button
                onClick={handleRemove}
                disabled={isRemoving}
                className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 transition-colors"
                title="Remove from Cart"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;