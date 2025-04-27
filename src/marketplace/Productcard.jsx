import React, { useState, useContext} from "react";
import { useNavigate } from 'react-router-dom';
//Animation Design
import { motion, AnimatePresence } from "framer-motion";
//Package UI Icons
import { ShoppingCart, Heart, EyeIcon } from "lucide-react";
//Installed Notification for Error Handling
import { toast } from 'react-hot-toast';
//Importing useContext
import { AppContext } from "../AppContext";
//Backend Calling
import { API_BACKENDAPI_URL } from "../../varConstant";

const ProductCard = ({ product, addToCart, addToWishlist }) => {
  const [showModal, setShowModal] = useState(false);
  const [showAddtoCartModal, setShowAddtoCartModal] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  //useContext for removing cartItems, setCartItems duplication
  const { cartItems, setCartItems, wishlistItems, setWishlistItems } = useContext(AppContext);
  
  //For Modal Card
  const handleCardClick = () => {
    setShowModal(true);
  };
  
  //For Add to Cart Function
  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
  
      //Checking if user sign in first before add to cart function works
      const isUserLoggedIn = !!sessionStorage.getItem("token");
      if (!isUserLoggedIn) {
        toast.error("⚠️ Sign in first before adding product into cart.");
        return;
      }
  
      // Check if the item is already in the cart
      if (cartItems.some((item) => item.marketID === product.marketID)) {
        toast.error("⚠️ This product is already in your cart!");
        return;
      }
  
      // Add the item to the cart
      setCartItems((prevItems) => {
        const updatedCart = [...prevItems, product];
        sessionStorage.setItem("cartItems", JSON.stringify(updatedCart)); // Save to sessionStorage
        return updatedCart;
      });
  
      setShowModal(false);
      setTimeout(() => {
        setShowAddtoCartModal(true);
        setTimeout(() => {
          setShowAddtoCartModal(false);
        }, 1000);
      }, 300);
    } catch (error) {
      console.error("⚠️ Error in handleAddToCart:", error);
      toast.error(error.message || "⚠️ Network error. Please check your connection");
    } finally {
      setIsLoading(false);
    }
  };

//API AddToCart and Error Handling
const addItemToCart = async (marketID, quantity) => {
  try {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("⚠️ You have no access here... Sign in first! ");
      return;
    }

    const numericMarketID = parseInt(marketID);
    const requestBody = {
      token,
      marketid: numericMarketID,
      quantity,
    };

    const response = await fetch(`${API_BACKENDAPI_URL}/api/AddToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("API Response Status:", response.status);
    const data = await response.json();
    console.log("API AddToCart: ", data);

    if (data === "Added to cart") {
      toast.success(`🎉 Your "${product.title}" has been added to your cart!`);
      setCartItems((prevItems) => [...prevItems, { ...product, quantity }]);
    } else if (data === "Market quantity is not enough") {
      toast.error("⚠️ Not enough stock available.");
    } else if (data === "You already added it on your cart.") {
      toast.error("⚠️ You cannot add this item because you already have it.");
    } else if (data === "Invalid user token") {
      toast.error("⚠️ Invalid user token. Please sign in again.");
    } else {
      toast.error(`⚠️ Error: ${data}`);
    }
  } catch (error) {
    console.error("⚠️ Error adding item to cart:", error);
    toast.error("⚠️ Unable to add item to cart. Please try again.");
  }
};
  

  // Wishlist Modal
  const handleWishlist = async () => {
    try {
      if (wishlistItems.some(item => item.id === product.id)) {
        throw new Error("⚠️ This product is already in your wishlist!");
      }

      setWishlistItems(prevItems => {
        const updatedWishlist = [...prevItems, product];
        sessionStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist)); // Save to sessionStorage
        return updatedWishlist;
      });

      setShowModal(false); // Close the modal
      setTimeout(() => {
        addToWishlist(product); // Trigger the callback to add to wishlist
        setShowWishlistModal(true);
        setTimeout(() => {
          setShowWishlistModal(false);
        }, 1000);
      }, 300);
    } catch (error) {
      toast.error(error.message || "⚠️ Something went wrong while adding to wishlist!");
    }
  };
  
  return (
    <>
      {/* Product Card UI */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-[420px] bg-white border border-[#e5e7eb] p-4 rounded-2xl shadow-lg relative flex flex-col h-auto cursor-pointer transition-all duration-300 hover:shadow-2xl"
        onClick={handleCardClick}
      >
        {/* Badge */}
        {product.status && (
          <div className="absolute z-10 w-[5em] text-center top-10 left-10 bg-[#007580] text-white px-3 py-1 rounded-lg text-base font-inter font-medium">
            {product.status}
          </div>
        )}

        {/* Image */}
        <div className="mb-5 w-full h-[420px] overflow-hidden rounded-xl relative group">
          <motion.img
            src={product.image}
            alt={product.title}
            className="w-full h-[450px] object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <EyeIcon className="w-12 h-12 text-white" />
          </motion.div>
        </div>

        {/* Details */}
        <div className="feature_content px-3">
          <div className="flex items-center justify-between mb-5">
            <h4 className="relative text-xl -top-5 left-3 text-[#007580] capitalize font-inter font-medium">
              {product.title || "No Title"}
            </h4>
            <button
              className="relative cursor-pointer text-sm top-5 bg-[#007580] h-[62px] w-[72px] rounded-lg flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(); // Only call handleAddToCart
                addItemToCart(product.marketID, product.quantity); // Call addItemToCart with the correct parameters                
              }}
            >
              <ShoppingCart size="1.75rem" color="#fff" />
            </button>
          </div>

          <p className="relative text-3xl -top-5 left-3 items-center gap-3 text-[#272343] font-bold font-inter">
            ${product.price || "0"}
            {product.currentPrice && (
              <span className="text-lg text-[#9a9caa] font-inter font-normal line-through">
                ${product.currentPrice}
              </span>
              
            )}
          </p>
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
            onClick={(e) => e.stopPropagation()}
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
                  {product.rating || "No user rate this product"}⭐ 
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
                <strong>Stock:</strong> {product.quantity ? `${product.quantity} available` : "Out of stock"}
              </span>
          </div>

      {/* Button Main Container */}
        <div className="mt-10 relative w-full h-[60px] pb-4">
      {/* Wishlist Button Animation */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute -left-2 -bottom-5 w-[100px] h-[60px] bg-red-500 text-white flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-red-600 shadow-md"
          onClick={handleWishlist}
          
        >
          <Heart size={28} />
        </motion.button>
      {/* Add to Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
        className={`absolute left-27 -bottom-5 w-[100px] h-[60px] ${
          isLoading ? "bg-gray-400" : "bg-orange-500"
        } text-white flex items-center justify-center rounded-xl transition-all duration-300 hover:bg-orange-600 shadow-md`}
        onClick={(e) => {
          handleAddToCart();
          addItemToCart(product.marketID, product.quantity); // Call addItemToCart with the correct parameters                
        }}
      >
        <ShoppingCart size={28} />
      </motion.button>
      {/* Checkout Button */}
      <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-10 -bottom-5 w-[250px] h-[60px] bg-green-600 text-white py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-300 hover:bg-green-700 shadow-md"
          onClick={() => navigate("/checkout", {
            state: {
              cartItems: [product],
              total: product.price * product.quantity
            }
          })}
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
