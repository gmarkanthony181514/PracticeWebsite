import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//Importing Icons
import { ChevronLeft } from "lucide-react";
//Importing Files
import ProductCard from "../MarketplacePage/Productcard";
import SectionTitle from "../MarketplacePage/ExtraIdeas/SectionTitle";
import Alertmessage from "../AlertModalNotif/Alertmessage";
//Backend Calling
import { API_BACKENDAPI_URL, API_BACKENDAPI2_URL } from '../BackendConnector/apiRoutes';
//Installed Notification
import { toast } from 'react-hot-toast';

const AddingItem = ({ addToCart, isSidebarOpen }) => {
  const [localProducts, setLocalProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [selectedFilter, setSelectedFilter] = useState("Active"); // New state for filter
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({});
  const [fileName, setFileName] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    category: "",
    quantity: "",
    price: "",
  });

  
  //Fetching Products
    const fetchItems = async (lastItemId = 0) => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error(" ⚠️ No token found. User must Sign in first.")
          return;
        }

  //API Calling Endpoints
        const response = await fetch(`${API_BACKENDAPI2_URL}/api/item/loadmore`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
           },
           body: JSON.stringify({ lastItemId }),
          });
  
        if (!response.ok) {
          throw new Error(`⚠️ Failed to fetch items. Status: ${response.status}`);
        }
        
        console.log("ViewItem Response Status", response.status);
        const data = await response.json();
        console.log("ViewItem Response Data", data);

        // Ensure `result.data` is an array before appending
        if (Array.isArray(data.data)) {
          setItems((prevItems) => [...prevItems, ...data.data]);
          setLocalProducts((prevProducts) => [...prevProducts, ...data.data]);
        } else {
          console.error("⚠️ Unexpected data format:", data);
          toast.error("⚠️ Unexpected data format received from the server.");
        }
      } catch (error) {
        toast.error(`⚠️ Error fetching items: ${error.message}`);
      }
    };
  
    useEffect(() => {
      fetchItems(0);
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

      // Validate Input Fields
        const { title, description, category, quantity, price } = newProduct;
          if (!title || !description || !category || !quantity || !price) {
            toast.error("⚠️ All fields are required.");
          return;
          }
      
          if (isNaN(quantity) || parseInt(quantity) <= 0) {
            toast.error("⚠️ Quantity must be a positive integer.");
          return;
          }
      
          if (isNaN(price) || parseFloat(price) <= 0) {
            toast.error("⚠️ Price must be a positive number.");
          return;
          }

      //For Creating New Item
      const creatingItem = {
        title,
        description,
        category,
        quantity: parseInt(quantity),
        price: parseFloat(price),
      };

      const response = await fetch(`${API_BACKENDAPI2_URL}/api/item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(creatingItem),
      });

      console.log("API Response", response.status);
      const data = await response.json();
      console.log("Backend Item", data);

      if (data === "Item created successfully") {
        toast.success("🎉 Item created successfully!");
        setShowAddItemModal(false);
        setNewProduct({ title: "", description: "", category: "", quantity: "", price: "" });
        fetchItems();
      } else {
        toast.error(`⚠️ ${data}`);
      }
    } catch (error) {
      toast.error(`⚠️ Error creating item: ${error.message}`);
    }
  };
  
  const handleLoadMore = () => {
    if (items.length > 0) {
      const lastItemId = items[items.length - 1].item_id;
      fetchItems(lastItemId);
    } else {
      fetchItems(0);
    }
  };
  
    //List in Marketplace button Function
    const handleListItem = (productId) => {
      const productToList = localProducts.find((item) => item.item_id === productId);
      if (!productToList) {
        toast.error("⚠️ Item not found or missing required data.");
        return;
      }
    
      setAlertConfig({
        title: "List Item in Marketplace",
        message: "Are you sure you want to list this item in the marketplace?",
        onConfirm: async () => {
          try {
            const token = sessionStorage.getItem("token");
            if (!token) {
              toast.error("⚠️ No token found. User must sign in.");
              return;
            }
    
            // Validate Input Fields
            if (productToList.quantity <= 0 || productToList.price <= 0) {
              toast.error("⚠️ Quantity and price must be greater than 0.");
              return;
            }
    
            // API Call to List Item
            const response = await fetch(`${API_BACKENDAPI2_URL}/api/marketplace/add`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                item_id: productToList.item_id,
                quantity: productToList.quantity,
                price: productToList.price,
              }),
            });
    
            const responseText = await response.text();
            console.log("List Item API Response:", responseText);
    
            if (response.ok) {
              toast.success("🎉 Item successfully listed in the marketplace.");
            } else {
              console.error("⚠️ Error listing item:", responseText);
              toast.error(`⚠️ Failed to list item: ${responseText}`);
            }
          } catch (error) {
            console.error("⚠️ Error listing item:", error);
            toast.error(`⚠️ Error listing item: ${error.message}`);
          }
    
          setShowAlert(false);
        },
        onCancel: () => setShowAlert(false),
      });
    
      setShowAlert(true);
    };
  
  //Delete button Function
    const handleDeleteItem = (itemId) => {
      setAlertConfig({
        title: "Delete Item",
        message: "Are you sure you want to delete this item?",
        onConfirm: async () => {
          if (!itemId) {
            console.error("⚠️ No itemId provided.");
            toast.error("⚠️ No itemId provided.");
            return;
          }
    
          try {
            const token = sessionStorage.getItem("token");
            if (!token) {
              toast.error("⚠️ No token found. User must sign in.");
              return;
            }
    
            // API Call to Delete Item
            const response = await fetch(`${API_BACKENDAPI2_URL}/api/Deleteitem`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ item_id: itemId }), // Match the API request body
            });
    
            const responseText = await response.text();
            console.log("Delete Item API Response:", responseText);
    
            if (response.ok) {
              toast.success("🎉 Successfully deleted the item.");
              setLocalProducts((prevProducts) =>
                prevProducts.filter((product) => product.item_id !== itemId)
              );
            } else {
              console.error("⚠️ Error deleting item:", responseText);
              toast.error(`⚠️ Failed to delete item: ${responseText}`);
            }
          } catch (error) {
            console.error("⚠️ Error deleting item:", error);
            toast.error(`⚠️ Error deleting item: ${error.message}`);
          }
    
          setShowAlert(false);
        },
        onCancel: () => setShowAlert(false),
      });
    
      setShowAlert(true);
    };

const filteredProducts = localProducts.filter(
  (product) => product.status.toLowerCase() === selectedFilter.toLowerCase()
);

  return (
    <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-64 w-[calc(100%-16rem)]" : "w-full"}`}>
    {/* Back Button */}
      <button
        onClick={() => navigate("/marketplace")} // Navigate to marketplace
        className="absolute top-4 left-4 z-30 p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <SectionTitle title="My Items" mb="mb-11" />
      <br />
        <div className="flex justify-center mb-6">
          <button
            className={`px-4 py-2 rounded-l-lg ${selectedFilter === "Active" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
            onClick={() => setSelectedFilter("Active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${selectedFilter === "Inactive" ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
            onClick={() => setSelectedFilter("Inactive")}
          >
            Inactive
          </button>
        </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      <div className="flex items-center justify-center h-screen">
        <div
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-6 cursor-pointer hover:bg-gray-100 transition-all duration-200 md:w-[500px] md:h-[350px]"
          onClick={() => setShowAddItemModal(true)}
        >
          <div className="text-6xl text-gray-400">+</div>
          <p className="mt-2 text-gray-600">Add New Item</p>
        </div>
      </div>
      {filteredProducts.slice(0, visibleProducts).map((product) => (
        <div key={product.item_id} className="relative">
          <ProductCard
            product={{ ...product, status: product.status }}
            addToCart={(item) => toast.success(`Added ${item.title} to cart!`)}
            addToWishlist={(item) => toast.success(`Added ${item.title} to wishlist!`)}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleListItem(product.item_id)}
              className="w-full bg-green-500 text-white py-2 rounded"
            >
              List in Marketplace
            </button>
            <button
              onClick={() => handleDeleteItem(product.item_id)}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {showAlert && (
        <Alertmessage
          title={alertConfig.title}
          message={alertConfig.message}
          onConfirm={alertConfig.onConfirm}
          onCancel={alertConfig.onCancel}
        />
      )}
      </div>

      {/* Render "Load More" button only once */}
      {visibleProducts < localProducts.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all"
          >
            Load More
          </button>
        </div>
      )}

      {showAddItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 text-white p-8 rounded-2xl shadow-xl w-full md:h-full max-w-full relative">
            <button
              className="absolute top-4 right-6 text-white-900 text-4xl font-bold hover:text-gray-200"
              onClick={() => setShowAddItemModal(false)}
            >
              &times; 
            </button>
            <h2 className="text-3xl font-bold text-white mb-6">Create New Product</h2>
            <form className="flex flex-col md:flex-row gap-8">

          {/* Left Section: File Upload */}
          <div className="flex flex-col md:flex-row gap-50">
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-2 border-dashed border-gray-500 rounded-lg p-6">
              <label className="block text-gray-300 font-medium mb-4 text-center">
                Drag or choose your file to upload
              </label>
              <div className="flex flex-col items-center justify-center">
                <div className="text-6xl text-gray-400 mb-4">
                  <i className="fas fa-upload"></i>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileUpload"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFileName(file.name); // Update the file name state
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setNewProduct((prev) => ({
                          ...prev,
                          image: reader.result, // Base64 string
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label
                  htmlFor="fileUpload"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-all"
                >
                  Choose a File
                </label>
                {fileName && ( // Display the file name if a file is selected
                  <p className="text-gray-400 mt-4 text-sm">
                    Selected File: <span className="text-white">{fileName}</span>
                  </p>
                )}
                <p className="text-gray-400 mt-4 text-sm">
                  PNG, JPG, SVG, MP4 or MP3. Max 1MB.
                </p>
              </div>
            </div>

            {/* Right Section: Form Fields */}
            <div className="w-full md:w-1/2 space-y-4">
              <div>
                <label className="block text-gray-300 font-medium mb-2">Product Name</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Digital Awesome Game"
                  className="w-full border border-gray-500 bg-gray-800 text-white p-3 rounded-lg"
                  onChange={handleInputChange}
                  value={newProduct.title}
                />
              </div>
              <div>
                <label className="block text-gray-300 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  placeholder="e.g. After purchasing the product you can get item..."
                  className="w-full border border-gray-500 bg-gray-800 text-white p-3 rounded-lg h-24"
                  onChange={handleInputChange}
                  value={newProduct.description}
                ></textarea>
              </div>
              <div>
              <label className="block text-gray-300 font-medium mb-2">Category</label>
              <input
                type="text"
                name="category"
                placeholder="e.g. Electronics, Books, Clothing"
                className="w-full border border-gray-500 bg-gray-800 text-white p-3 rounded-lg"
                onChange={handleInputChange}
                value={newProduct.category}
              />
            </div>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-gray-300 font-medium mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 20$"
                    className="w-full border border-gray-500 bg-gray-800 text-white p-3 rounded-lg"
                    onChange={handleInputChange}
                    value={newProduct.price}
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-gray-300 font-medium mb-2">Quantity</label>
                  <input
                    type="text"
                    name="quantity"
                    placeholder="e.g. 5"
                    className="w-full border border-gray-500 bg-gray-800 text-white p-3 rounded-lg"
                    onChange={handleInputChange}
                    value={newProduct.quantity}
                  />
                </div>
              </div>
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition-all duration-300 hover:bg-blue-700"
                onClick={handleAddItem}
              >
                Create Item
              </button>
            </div>
          </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddingItem;