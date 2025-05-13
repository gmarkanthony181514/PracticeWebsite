import { useState, useEffect, useRef, useContext } from "react";
//Importing Files
import ProductCard from "./Productcard";
//Installed Notification
import { toast } from 'react-hot-toast';
//useContext
import { AppContext } from "../Context/AppContext";

const ProductGrid = ({ searchQuery, isSidebarOpen, products }) => {
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const noMatchToastShown = useRef(false);
  const [loading, setLoading] = useState(false);
  const { cartItems, setCartItems, wishlistItems, setWishlistItems } = useContext(AppContext);

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

  // Add to Cart
  const handleAddToCart = (product) => {
    if (cartItems.some((item) => item.marketID === product.marketID)) {
      toast.error("⚠️ This product is already in your cart!");
      return;
    }

    const productWithIDs = {
      ...product,
      cartID: product.cartID || "",
      cartsessionID: product.cartsessionID || "",
    };
  
    setCartItems((prevItems) => {
      const updatedCart = [...prevItems, productWithIDs];
      sessionStorage.setItem("cartItems", JSON.stringify(updatedCart));
      return updatedCart;
    });
  
    toast.success(`🎉 "${product.title}" has been added to your cart.`);
  };

  // This is just for the future idea
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
      <div className="grid grid-cols-10 md:grid-cols-3 gap-10 p-4">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={handleAddToCart}
              addToWishlist={handleAddToWishlist}
            />
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-500">There is nothing here!</p>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;