import React, { useState, useEffect } from "react";
// Import Files
import Navbar from "../../NavigationPage/NavbarMain";
import Sidebar from "../../MarketplacePage/ExtraIdeas/Sidebar";
import ProductGrid from "../../MarketplacePage/Productgrid";
import Footer from "../../FooterPages/Footer";
// Installed Notifications
import { toast } from "react-hot-toast";
// Backend Calling
import { API_BACKENDRICOAPI_URL } from "../../BackendConnector/apiRoutes";

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [lastMarketplaceId, setLastMarketplaceId] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  //Checking if the token has totally saved from the sessionStorage
  const [token, setToken] = useState("");
    useEffect(() => {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        toast.error("⚠️ No token found from your sign in. Check your account status by contacting us.");
      }
    }, []);

    //Fetching Products from the Rico API of marketplace/laodmore
    const fetchProducts = async (lastId = 0) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/marketplace/loadmore`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ lastMarketplaceId: lastId }),
        });

        if (!response.ok) {
          throw new Error("⚠️ Failed to fetch products. Contact us to fix this.");
        }

        const responseData = await response.json();
        const fetchingProducts = responseData.data || [];
        const filteredProducts = fetchingProducts.map((product) => ({
          id: product.marketplace_id,
          title: product.title,
          description: product.description,
          quantity: product.quantity,
          price: product.price,
          status: product.status,
          dateListed: product.date_created,
          dateUpdated: product.date_updated,
          category: product.category,
          marketplace_Id: product.marketplace_id,
          userId: product.user_id,
          image: product.image_base64,
        }));

        // If less than 10 items returned, no more to load
        setHasMore(filteredProducts.length === 10);

        // Append or set products
        setProducts((prev) => lastId === 0 ? filteredProducts : [...prev, ...filteredProducts]);

        // Update lastMarketplaceId for next load
        if (filteredProducts.length > 0) {
          setLastMarketplaceId(filteredProducts[filteredProducts.length - 1].id);
        }
      } catch (error) {
        toast.error("⚠️ Failed to retrieve products in marketplace items.");
      } finally {
        setIsLoading(false);
      }
    };
  
    //if there is token detected the products will be fetched
    useEffect(() => {
      if (token) {
        fetchProducts(0); // Initial load
      }
    }, [token]);

    const handleLoadMore = () => {
      fetchProducts(lastMarketplaceId);
    };

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
        onSearch={(productsArray) => setProducts(productsArray)}
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
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            products={products}
          />
            {hasMore && !isLoading && (
              <div className="flex justify-center my-8">
                <button
                  onClick={handleLoadMore}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Load More
                </button>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-center my-8">
                <span>Loading...</span>
              </div>
            )}
              </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketPage;