import React, { useState, useEffect, useRef, useContext } from "react";
//Importing Files
import ProductCard from "./Productcard";
//BackEnd Calling
import {API_BACKENDAPI_URL } from '../../varConstant';
//Installed Notification
import { toast } from 'react-hot-toast';
//useContext
import { AppContext } from "../AppContext";

const ProductGrid = ({ searchQuery, isSidebarOpen }) => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [lastMarketId, setLastMarketId] = useState(null);
  const [loading, setLoading] = useState(false);
  const noMatchToastShown = useRef(false);

  const { cartItems, setCartItems, wishlistItems, setWishlistItems } = useContext(AppContext);


  // Fetching Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BACKENDAPI_URL}/api/ViewMarket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          last_market_id: lastMarketId || "",
          search: searchQuery || "",
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      console.log("View Market Response", response.status); // Log the response status
      const data = await response.json();
      console.log(data); // Log the response data


      if (data === "No Data") {
        toast.info("⚠️ No more products available.");
        return;
      }
  
      if (data === "Failed to list market items") {
        toast.error("⚠️ Failed to load products. Please try again.");
        return;
      }
  
      if (Array.isArray(data)) {
        if (data.length > 0) {
          const usedIds = new Set(); // To ensure unique cart IDs within the session
  
          const formattedProducts = data.map((product) => {
            const cartID = product.CartID !== undefined ? product.CartID : null;
            const cartsessionID = product.CartSessionID !== undefined ? product.CartSessionID : null;
          
            return {
              marketID: `market-${product.MarketID || "No ID"}-${product.ItemID || "No ID"}-${product.UserID || "No ID"}`,
              userID: product.UserID,
              cartID,
              cartsessionID,
              status: product.Status,
              title: `${product.Brand || "No details"} ${product.Model || "No details"}`,
              dateListed: product.DateListed,
              quantity: product.Quantity,
              price: product.Price,
              description: product.Description || "No description available",
              image: product.Image ? `data:image/jpeg;base64,${product.Image}` : "/default.jpg",
              username: product.Username,
              ItemID: product.ItemID,
            };
          });
  
          setProducts(formattedProducts);
          setDisplayedProducts(formattedProducts);
          setLastMarketId(formattedProducts[formattedProducts.length - 1].marketID);
          toast.success("🎉 Successfully loaded available products.");
        } else {
          setProducts([]);
          setDisplayedProducts([]);
        }
      }
    } catch (error) {
      toast.error(`⚠️ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Avoid spamming Toast Notification
  useEffect(() => {
    noMatchToastShown.current = false;
  }, [searchQuery]);

  // Search Filter
  useEffect(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setDisplayedProducts(filtered);

    const debounceToast = setTimeout(() => {
      if (!loading && searchQuery && filtered.length === 0 && !noMatchToastShown.current) {
        toast.error("⚠️ No products found or not added on Marketplace.");
        noMatchToastShown.current = true;
      }
    }, 250);

    return () => clearTimeout(debounceToast);
  }, [searchQuery, products]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Add to Cart
  const handleAddToCart = (product) => {
    if (cartItems.some((item) => item.marketID === product.marketID)) {
      toast.error("⚠️ This product is already in your cart!");
      return;
    }

    const productWithIDs = {
      ...product,
      cartID,
      cartsessionID,
    };
  
    setCartItems((prevItems) => {
      const updatedCart = [...prevItems, productWithIDs];
      sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    toast.success(`🎉 "${product.title}" has been added to your cart.`);
  };

  // Add to Wishlist
  const handleAddToWishlist = (product) => {
    if (wishlistItems.some(item => item.marketID === product.marketID)) {
      toast.error("⚠️ This product is already in your wishlist!");
      return;
    }

    setWishlistItems(prevItems => {
      const updatedWishlist = [...prevItems, product];
      sessionStorage.setItem("wishlistItems", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });

    toast.success(`❤️ "${product.title}" has been added to your wishlist.`);
  };
  

  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"}`}>
      <br />
      <div className="grid grid-cols-10 md:grid-cols-3 gap-10 p-4">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard
              key={product.marketID}
              product={product}
              addToCart={handleAddToCart}
              addToWishlist={handleAddToWishlist}
            />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;