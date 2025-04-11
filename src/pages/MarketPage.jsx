import React, { useState, useEffect } from "react";
//Import Files
import Navbar from "../marketplace/Navbar";
import Sidebar from "../marketplace/Sidebar";
import ProductGrid from "../marketplace/Productgrid";
import Footer from "../marketplace/Footer";
import AddtoCart from "./AddtoCart";
//Installed Notifications
import { toast } from 'react-hot-toast';
//Backend Calling
import { API_BACKENDAPI_URL, API_FAKESTORE_URL } from '../../varConstant';

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]); 
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  //Storing Token receive on Sign in
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

//API Calling Endpoints
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/ViewMarket`, {
        //Require based on Matt documents
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(" ⚠️ Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(" ⚠️ Something went wrong while loading products. Check your internet connection.")
    }
  };

  useEffect(() => {
    if (token) {
    fetchProducts();
    }
  }, [token, refreshTrigger]);


  //Adding Cart
  const addToCart = (product) => {
    if (!cart.some((item) => item.id === product.id)) {
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  //Adding Wishlist
  const addToWishlist = (product) => {
    setWishlist((prevCart) => [...prevCart, product]);
  };

  //Automatically Refresh Marketplace
  const refreshMarketplace = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  
  return (
    <div className="font-sans">
      <Navbar 
        onSearch={setSearchQuery} 
        cartItems={cart} 
        wishlistItems={wishlist}  // ✅ Pass wishlist
        onCategorySelect={setSelectedCategory}
      />
  
      <div className="flex transition-all duration-100">
        {isSidebarOpen && <Sidebar />}
  
        <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"}`}>
          <ProductGrid 
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              addToCart={addToCart}  
              addToWishlist={addToWishlist} 
              isSidebarOpen={isSidebarOpen}
              refreshTrigger={refreshTrigger}
              products={products} // Pass the products to ProductGrid
              cartItems={cart} // Pass the cartItems state
              setCartItems={setCart} // Pass the setCart function
          />
        </div>
      </div>

      {/* Place AddtoCart where it should render */}
      <AddtoCart 
        cartItems={cart} 
        setCartItems={setCart} 
      />

      <Footer />
    </div>
  );
};

export default MarketPage;
