import React from 'react';
import { useNavigate } from 'react-router-dom';
//Package UI Import
import { Star } from 'lucide-react';
//Importing Files
import CountdownTimer from './CountdownTimer';

const ExtensionProducts = ({ product }) => {
  const navigate = useNavigate();

  //Button for navigating Checkout for Live Selling Cards (UI Only)
  const handleBuyNow = (product) => {
    navigate("/checkout", {
      state: {
        cartItems: [product],
        total: product.price,
      },
    });
  };

  return (
    <div className="group relative p-4 rounded-2xl 
        bg-gradient-to-br from-gray-800/60 to-black/40 backdrop-blur-lg
        border-2 border-purple-500/30 shadow-xl transform transition-all duration-500">
      
      {product.isLive && (
        <div className="absolute top-5 right-7 flex items-center gap-2 z-40">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75">
            </span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <span 
            className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              LIVE
          </span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-56 mb-4 rounded-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Details */}
      <p className="text-sm text-purple-300 mb-1">{product.condition}</p>
      <h2 className="text-white text-lg font-bold mb-2 line-clamp-2">
        {product.name}
      </h2>

      {product.isLive && (
        <div className="mt-2 text-sm text-white">
          <p>Ending live in: <CountdownTimer endTime={product.endTime} /></p>
        </div>
      )}

      {/* Rating & Reviews */}
      <div className="flex items-center text-yellow-400 mb-4">
        <Star className="w-4 h-4" />
        <span className="ml-1 text-sm">
          {product.rating} ({product.reviews})
        </span>
      </div>

      {/* Price & Buy Now Button */}
      <div className="mt-auto flex justify-between items-center">
      <span className="text-lg text-green-400 font-semibold transition-transform duration-200 hover:scale-110 hover:text-green-300">
          ${product.price}
        </span>
        <button 
        onClick={() => handleBuyNow(product)}
        className="opacity-0 group-hover:opacity-100
                     bg-gradient-to-r from-purple-600 to-pink-600
                     text-white px-3 py-1 rounded-full text-sm
                     transition-transform duration-200 hover:scale-105
                     hover:shadow-lg transition-opacity">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ExtensionProducts;
