import { useState, useEffect} from "react";
//Animation Design
import { motion, AnimatePresence } from "framer-motion";
//Package Icons
import { ShoppingCart, Heart } from "lucide-react";
//Installed Notification
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, addToCart, addToWishlist }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddtoCartModal, setShowAddtoCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Product Card click Handler
  const handleCardClick = () => {
    setShowModal(true);
  };
  
  //Add to Cart Modal
  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      if (cartItems.some(item => item.id === product.id)) {
        throw new Error(" ⚠️ This product is already in your cart!");
      } 
      setCartItems(prevItems => [...prevItems, product]);
      setShowModal(false);
      setTimeout(() => {
        addToCart(product);
        setShowAddtoCartModal(true);
        setTimeout(() => {
          setShowAddtoCartModal(false);
        }, 1000);
      }, 300);
    } catch (error) {
        toast.error(error.message || " ⚠️ Network error. Please check your connection");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleWishlist = async () => {
    try {
      setShowModal(false); // Close the modal
      setTimeout(() => {
        addToWishlist(product);  // Trigger the callback to add to wishlist
        setShowWishlistModal(true);
        setTimeout(() => {
          setShowWishlistModal(false);
        }, 1000);
      }, 300);
    } catch (error) {
      toast.error(error.message || " ⚠️ Something went wrong while adding to wishlist!");
    }
  };
  
  return (
    <>
   <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 p-8 rounded-[30px] shadow-lg relative flex flex-col items-center w-80 h-auto cursor-pointer transition-all duration-300 hover:shadow-2xl"
      onClick={handleCardClick}
    >

      {/* New Badge */}
      <div className="absolute top-1/2 right-[-20px] transform -translate-y-1/2 rotate-90 bg-red-500 text-white text-base font-bold px-4 py-2 rounded-md">
        New
      </div>

      {/* Animated Product Image */}
      <motion.img
        src={product.image}
        alt={product.title}
        className="h-60 w-60 object-contain rounded-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />

      {/* Product Details */}
      <div className="text-center mt-4">
        <p className="text-red-500 font-bold text-2xl">${product.price}</p>
        <p className="font-semibold text-gray-700 text-lg">{product.title}</p>
        <p className="font-semibold text-gray-700 text-lg">{product.quantity + " available"}</p>
        <p className="font-semibold text-gray-700 text-lg">{product.rating + " ★"}</p>
      </div>
      </motion.div>

      {/* Product Modal Animation */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6"
          >

          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-white p-10 rounded-2xl shadow-xl w-full md:w-[1200px] md:h-[550px] max-w-full relative flex flex-col md:flex-row overflow-hidden"
            onAbort={(e) => e.stopPropagation()}
          >
        {/* Close Button */}
          <button
            className="fixed top-3 right-7 text-gray-500 text-5xl font-bold hover:text-gray-700"
            onClick={() => setShowModal(false)}
          >
          {/* Symbol for X */}
            &times;
          </button>

        {/* Product Modal Image Section */}
          <div className="md:w-1/2 w-full flex justify-center items-center p-6">
            <img
              src={product.image}
              alt={product.title}
              className="object-contain h-60 w-60 md:h-96 md:w-96 rounded-lg shadow-lg"
            />
          </div>

        {/* Product Details Section */}
          <div className="md:w-1/2 w-full p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4"><span>{product.title || "No details provided"}</span></h2>
                <br></br>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-yellow-400 text-2xl font-semibold">
                  {product.rating || "No user rate this product"}★ 
                    </span>
              <span className="text-gray-500 text-lg">
                   ({product.rating || "0"} user reviews)
              </span>
            </div>
              <span className="text-gray-700 text-lg leading-relaxed mb-4">
                {product.description?.split(" ").slice(0, 30).join(" ") || "No details provided"}
                {product.description?.split(" ").length > 30 ? "..." : ""}
              </span>
                <br></br>
              <span className="text-lg text-gray-700 mb-5">
                <strong>Stock:</strong> {product.quantity + " available" || "Out of stock"}
              </span>
          </div>

      {/* Button Main Container */}
        <div className="mt-10 relative w-full h-[60px] pb-4">
      {/* Wishlist Button Animation */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-0 bottom-6 w-[100px] h-[50px] bg-red-500 text-white flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-red-600 shadow-md"
          onClick={handleWishlist}
        >
          <Heart size={28} />
        </motion.button>
      {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-30 bottom-6 w-[100px] h-[50px] bg-orange-500 text-white flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-orange-600 shadow-md"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={28} />
        </motion.button>
      {/* Checkout Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-10 bottom-6 w-[300px] h-[50px] bg-green-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-green-700 shadow-md"
        >
      Buy Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add to Cart Modal */}
      <AnimatePresence>
        {showAddtoCartModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-[9999] bg-transparent backdrop-blur-md"
          >
            <motion.div
              initial={{ y: -50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.6 }}
              className="bg-green-600/90 text-white py-6 px-10 rounded-2xl shadow-xl text-xl font-semibold flex items-center space-x-3"
            >
              <span className="text-3xl">✅</span>
              <span>{`"${product.title}" has been added to your cart.`}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

        {/* Wishlist Modal */}
          <AnimatePresence>
            {showWishlistModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 flex items-center justify-center z-[9999] bg-transparent backdrop-blur-md"
              >
                <motion.div
                  initial={{ y: -50, opacity: 0, scale: 0.9 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -50, opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0.6 }}
                  className="bg-red-500/90 text-white py-6 px-10 rounded-2xl shadow-xl text-xl font-semibold flex items-center space-x-3"
                >
                  <span className="text-3xl">❤️</span>
                  <span>{`"${product.title}" has been added to your wishlist.`}</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

    </>
  );
};

export default ProductCard;
