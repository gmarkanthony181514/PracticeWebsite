import React, { useState, useEffect } from "react";
// Import Files
import Navbar from "../marketplace/Navbar";
import Sidebar from "../marketplace/Sidebar";
import ProductGrid from "../marketplace/Productgrid";
import Footer from "../FooterPages/Footer";
// Installed Notifications
import { toast } from "react-hot-toast";
// Backend Calling
import { API_BACKENDAPI_URL } from "../../varConstant";

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]); // Cart state
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");

  // Load token from sessionStorage
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    } else {
      toast.error("⚠️ No token received. Please sign in again.");
    }
  }, []);

  // Load cart from sessionStorage on page load
  useEffect(() => {
    const savedCart = sessionStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart)); // Load the cart from sessionStorage
      } catch (err) {
        console.error("⚠️ Failed to parse cart from session:", err);
      }
    }
  }, []);

  // Save cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("cartItems", JSON.stringify(cart));
  }, [cart]);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/ViewMarket`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error("⚠️ Failed to fetch products");
      }
  
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("⚠️ Something went wrong while loading products. Check your internet connection.");
    }
  };

  

  useEffect(() => {
    if (token) {
      fetchProducts();
    }
  }, [token]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    toast.success("🎉 Successfully added to your cart.");
  };

  // Add product to wishlist
  const addToWishlist = (product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.some((item) => item.id === product.id)) {
        toast("⚠️ Product is already in your wishlist.");
        return prevWishlist;
      }
      toast.success("🎉 Successfully added to your wishlist.");
      return [...prevWishlist, product];
    });
  };
  return (
    <div className="font-sans">
      <Navbar
        onSearch={setSearchQuery}
        cartItems={cart}
        wishlistItems={wishlist}
        onCategorySelect={setSelectedCategory}
      />

      <div className="flex transition-all duration-100">
        {isSidebarOpen && <Sidebar />}

        <div
          className={`transition-all duration-300 ${
            isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"
          }`}
        >
          <ProductGrid
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            isSidebarOpen={isSidebarOpen}
            products={products}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketPage;