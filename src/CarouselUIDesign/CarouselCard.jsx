//Package UI Animation
import { motion } from 'framer-motion';
//Package UI Icons
import { Star } from "lucide-react";
//Importing Connected Files
import CountdownTimer from './CountdownTimer';

  //Carousel Cards Design
    const ProductCard = ({ product, isActive, handleBuyNow }) => (
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        transition={{
        duration: 0.4,
        ease: "easeOut",
        type: "spring",
        stiffness: 120,
      }}
        className={`group relative w-[500px] h-[450px] p-4 rounded-2xl 
                  bg-gradient-to-br from-gray-800/60 to-black/40 backdrop-blur-lg
                  border-2 border-purple-500/30 shadow-xl transform transition-all duration-500
                  ${isActive ? "scale-100 z-30 opacity-100" : "scale-90 z-10 opacity-60"}`}
                  style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                }}>
              
        {/* Live UI Design */}
          {product.isLive && (
            <div className="absolute top-6 right-7 flex items-center gap-2 z-40 animate-pulse-slow">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                    </span>
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">LIVE</span>
                </div>
              )}
                    
        {/* Name, Condition, Image Design */}
          <div className="relative h-60 mb-4 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                  <p 
                    className="text-sm text-purple-300 mb-1">
                    {product.condition}
                  </p>
                    <h2 
                      className="text-white text-lg font-bold mb-2 line-clamp-2">
                      {product.name}
                    </h2>
        
        {/* Countdown Design */}
          {product.isLive && (
            <div className="mt-2 text-sm text-white">
              <p>Ending live in: <CountdownTimer endTime={product.endTime} /></p>
            </div>
          )}
        
        {/* Rating Design */}
          <div className="flex items-center text-yellow-400 mb-4">
            <Star className="w-4 h-4" />
              <span className="ml-1 text-sm">
                {product.rating} ({product.reviews})
              </span>
          </div>

        {/* Price Design */}
          <div className="mt-auto flex justify-between items-center">
            <span className="text-lg text-green-400 font-semibold">
              ${product.price}
            </span>
                          
        {/* Button Design */}
          <button 
            onClick={() => handleBuyNow(product)}
            className="opacity-0 group-hover:opacity-100
            bg-gradient-to-r from-purple-600 to-pink-600
            text-white px-3 py-1 rounded-full text-sm
            transition-transform duration-200 hover:scale-105
            hover:shadow-lg transition-opacity"
            > Buy Now 
          </button>
       </div>
  </motion.div>
);

export default ProductCard;