import { useState, useEffect } from "react";
//Importing Files
import ProductCard from "./Productcard";
import SectionTitle from "./SectionTitle";
//BackEnd Calling
import {API_BACKENDAPI_URL } from '../../varConstant';
//Installed Notification
import { toast } from 'react-hot-toast';

const ProductGrid = ({ searchQuery, selectedCategory, addToCart, addToWishlist, isSidebarOpen }) => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [lastMarketId, setLastMarketId] = useState(null);
  const [loading, setLoading] = useState(false);

  //Fetching Products
  const fetchProducts = async () => {
    setLoading(true);

  //API Calling Endpoints
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${API_BACKENDAPI_URL}/api/ViewMarket`, {
        method: "POST",
        //Required based on Matt documentation
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          last_market_id: lastMarketId,
          search: searchQuery,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (Array.isArray(data)) {
        const formattedProducts = data.map((product) => ({
          marketID: `market-${product.MarketID || "No ID"}-${product.ItemID || "No ID"}-${product.UserID || "No ID"}`,
          status: product.Status,
          title: `${product.Brand || "No details"} ${product.Model || "No details"}`,
          dateListed: product.DateListed,
          quantity: product.Quantity,
          price: product.Price,
          rating: product.Rating || 0,
          description: product.Description || "No description available",
          image: product.Image ? `data:image/jpeg;base64,${product.Image}` : "/default.jpg",
          username: product.Username,
          userRating: product.UserRating || 0,
          ItemID: product.ItemID,
        }));
      
        setProducts(formattedProducts);
        setDisplayedProducts(formattedProducts);
      
        //MarketID
        if (formattedProducts.length > 0) {
          setLastMarketId(formattedProducts[formattedProducts.length - 1].marketID);
        }
          toast.success(" 🎉 Products loaded successfully!")
      } else {
         throw new Error(" ⚠️ Invalid response format from API ")
      }
    } catch (error) {
       toast.error(` ⚠️ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]);
    setLastMarketId(null);
    fetchProducts();
  }, [searchQuery]);
  
  //Search Filter
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setDisplayedProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"}`}>      
      <SectionTitle title="All Products" mb="mb-11" />
      <br />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {displayedProducts.length > 0 ? (
        displayedProducts.map((product) => (
          <ProductCard
            key={product.marketID}
              product={product}
               addToCart={addToCart}
                addToWishlist={addToWishlist}
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