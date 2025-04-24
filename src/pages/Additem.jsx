import { useState, useEffect } from "react";
//Importing Files
import ProductCard from "../marketplace/Productcard";
import SectionTitle from "../marketplace/SectionTitle";
//Backend Calling
import { API_BACKENDAPI_URL } from '../../varConstant';
//Installed Notification
import { toast } from 'react-hot-toast';

const Additem = ({ addToCart, isSidebarOpen }) => {
  const [localProducts, setLocalProducts] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    token: "",
    title: "",
    description: "",
    quantity: "",
    price: "",
    image: "default.jpg",
  });
  
  //Fetching Products
    const fetchPrivateItems = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error(" ⚠️ No token found. User must Sign in first.")
          return;
        }

  //API Calling Endpoints
        const response = await fetch(`${API_BACKENDAPI_URL}/api/viewitem`, {
          method: "POST",
        //Required based on Matt documentation
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
           },
          body: JSON.stringify({ token }),
        });
  
        if (!response.ok) {
          const errorDetails = await response.text();
          throw new Error(` ⚠️ Failed to fetch items. Status: ${response.status}, Message: ${errorDetails}`);
        }
        
        console.log("ViewItem Response Status", response.status);
        const data = await response.json();


        if (Array.isArray(data) && data.length > 0) {
          const mappedProducts = data.map((item) => ({
            marketID: item.ItemID,
            title: item.Brand || "No details",
            description: item.Model || "No description available",
            quantity: item.Quantity || 0,
            price: item.Price || 0,
            image: item.Image || "default.jpg",
            rating: item.Rating || 0,
          }));
          setLocalProducts(mappedProducts);
        } else {
          toast.error("⚠️ No items found or data is missing.");
        }
      } catch (error) {
        toast.error(`⚠️ Error fetching private items: ${error.message}`);
      }
    };


  useEffect(() => {
    fetchPrivateItems();
  }, []);

  //Input Change Function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };
  
  // Add New Item Function
  const handleAddItem = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ No token found. User must Sign in first!");
        return;
      }

      const newItem = {
        token: token,
        title: newProduct.title,
        description: newProduct.description,
        quantity: parseInt(newProduct.quantity),
        image: "default.jpg",
        price: parseFloat(newProduct.price),
      };

      const response = await fetch(`${API_BACKENDAPI_URL}/api/CreateItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newItem),
      });

      console.log("CreaeItem API Status", response.status); // Log the response status\
      const data = await response.json();

      if (response.ok && data === "Created Item") {
        toast.success("🎉 Created Item successfully created!");
        setShowAddItemModal(false);
        setNewProduct({ token: "", title: "", description: "", quantity: "", price: "", image: "default.jpg" });
        fetchPrivateItems();
      } else {
        toast.error("⚠️ Failed to create an Item: " + JSON.stringify(data));
      }
    } catch (error) {
      toast.error(`⚠️ Error adding product to marketplace: ${error.message || '⚠️ An unknown error occurred.'}`);
    }
  };

  
  //List in Marketplace button Function
  const handleListItem = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("No token found. User must sign in.");
        return;
      }
  
      const productToList = localProducts.find((item) => item.marketID === productId);
      if (!productToList) {
        toast.error("⚠️ Item not found or missing required data.");
        return;
      }
  
      const marketplacePayload = {
        token: token,
        itemid: productToList.marketID,
        quantity: productToList.quantity,
        price: productToList.price,
        description: productToList.description || "No description available",
      };

      if (productToList.price <= 0) {
        toast.error("⚠️ Price must be greater than 0.");
        return;
      }
  
      console.log("Payload:", marketplacePayload);

      const response = await fetch(`${API_BACKENDAPI_URL}/api/CreateMarketListing`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(marketplacePayload),
      });
      
      const responseText = await response.text();
      
      if (!response.ok) {
        console.error("API Error:", responseText);
        toast.error(`⚠️ Failed to list item: ${responseText}`);
        return;
      }
  
      if (response.ok && responseText === "Posted Item in MarketPlace") {
        toast.success("🎉 Item successfully listed in the Marketplace");
        fetchPrivateItems();
      } else {
        toast.error(`⚠️ ${responseText}`);
      }
    } catch (error) {
      console.error("⚠️ Error listing item in marketplace:", error);
      toast.error(`⚠️ Error listing item: ${error.message}`);
    }
  };
  
  //Delete button Function
  const handleDeleteItem = async (itemId) => {
    if (!itemId) {
      console.error(" ⚠️ No itemId provided.");
      return;
    }

    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error(" ⚠️ No token found. User must sign in.");
      return;
    }
  
  //API Calling Enpoints
    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/deleteitem`, {
        method: "POST",
      //Required based on Matt Documentation
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token: token,
          itemid: itemId,
        }),
      });
  
      console.log("Delete Item API", response.status); // Log the response status
      const data = await response.json();

      if (response.status === 200) {
        toast.success (" 🎉 Successfully Deleted the Created Item.")
      } else {
        console.error(" ⚠️ Error deleting item:", data);
      }
    } catch (error) {
      toast.error(" ⚠️ Failed to delete item:", error);
    }
  };

  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"}`}>
      <SectionTitle title="My Items" mb="mb-11" />
      <br />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4">
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-all duration-200 h-[300px]"
          onClick={() => setShowAddItemModal(true)}
        >
          <div className="text-6xl text-gray-400">+</div>
          <p className="mt-2 text-gray-600">Add New Item</p>
        </div>
        {localProducts.map((product, index) => (
          <div key={product.marketID || `local-${index}`}>
            <ProductCard
              product={product}
              addToCart={addToCart}
              addToWishlist={(item) => toast.success(`Added ${item.title} to wishlist!`)}
            />
                        <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleListItem(product.marketID)}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              List in Marketplace
            </button>
              <button
                onClick={() => handleDeleteItem(product.marketID)}
                className="w-full bg-red-500 text-white py-2 rounded"
              >
                Delete
              </button>
              </div>
          </div>
        ))}
      </div>
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full md:w-[600px] max-w-full relative">
            <button
              className="absolute top-4 right-6 text-gray-500 text-4xl font-bold hover:text-gray-700"
              onClick={() => setShowAddItemModal(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h2>
            <form className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Product Title"
                className="w-full border p-3 rounded-lg"
                onChange={handleInputChange}
                value={newProduct.title}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="w-full border p-3 rounded-lg"
                onChange={handleInputChange}
                value={newProduct.price}
              />
              <input
                type="text"
                name="quantity"
                placeholder="Quantity"
                className="w-full border p-3 rounded-lg"
                onChange={handleInputChange}
                value={newProduct.quantity}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full border p-3 rounded-lg h-24"
                onChange={handleInputChange}
                value={newProduct.description}
              ></textarea>
              <button
                type="button"
                className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-orange-600"
                onClick={handleAddItem}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Additem;