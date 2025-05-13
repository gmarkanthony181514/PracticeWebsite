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
    const fetchProducts = async (lastMarketplaceId = null) => {
      try {
        const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/marketplace/loadmore`, {
          method: "POST",
          headers: {
            //To accept the string error response I got
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });
  
        if (!response.ok) {
          throw new Error("⚠️ Failed to fetch products. Contact us to fix this.");
        }

        console.log("API Response Status:", response.status);
        const responseData = await response.json();
        console.log("Backend Data:", responseData);

        //Extracting the data from the response into Array
        const fetchingProducts = responseData.data;
        //Mapping the productsData
        const filteredProducts = fetchingProducts.map((product) => ({
          id: product.item_id,
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
        
        setProducts((filteredProducts));
      } catch (error) {
        toast.error("⚠️ Failed to retrieve products in marketplace items.");
      }
    };
  
    //if there is token detected the products will be fetched
    useEffect(() => {
      if (token) {
        fetchProducts();
      }
    }, [token]);

      // Filter products based on searchQuery and selectedCategory
        const filteredProducts = products.filter((product) => {
          const query = searchQuery || ""; // Ensure searchQuery is a string
          const title = product.title || ""; // Ensure product.title is a string
          const matchesSearch = title.toLowerCase().includes(query.toLowerCase());
          const matchesCategory =
            !selectedCategory || product.category === selectedCategory;
          return matchesSearch && matchesCategory;
        });

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
            // selectedCategory={selectedCategory}
            addToCart={addToCart}
            addToWishlist={addToWishlist}
            // isSidebarOpen={isSidebarOpen}
            products={products}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MarketPage;