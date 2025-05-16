import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
//Importing files
import Alertmessage from "../AlertModalNotif/Alertmessage";
//Package UI Icons
import { Search, ShoppingCart, User, Heart } from "lucide-react";
//Installed Notification for Error Handling
import { toast } from 'react-hot-toast';
//useContext
import { AppContext } from "../Context/AppContext";
//Backend Connector
import { API_BACKENDRICOAPI_URL } from "../BackendConnector/apiRoutes";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);
  const [username, setUsername] = useState(null);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [viewOrders, setViewOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const navigate = useNavigate();
  //useContext for cartItems & setCartItems purpose ( just removing duplication error when applying on many files)
  const { cartItems, wishlistItems } = useContext(AppContext);
  
  //Username on Account Function
  useEffect(() => {
    try {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername && typeof storedUsername === "string") {
        setUsername(storedUsername);
      } else {
        throw new Error(" ⚠️ Slow connection detected!")
      }
    } catch (error) {
      setUsername(null);
      toast.error(" ⚠️ Connection error! ")
    }
  }, []);

  //Search bar function
    const handleSearch = async (query) => {
      try {
        setSearchQuery(query || "");

        // Get the JWT token from sessionStorage
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("⚠️ You must be logged in to search.");
          return;
        }

        // Prepare the request body
        const requestBody = {
          lastMarketplaceId: 0,
          title: query || "",
        };

        // Make the API call
        const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/marketplace/search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        if (response.ok) {

          console.log("API Response Status:", response.status);
          const data = await response.json();
          console.log("Search Results:", data);

          const searchProducts = Array.isArray(data.data)
            ? data.data.map(product => ({
                ...product,
                id: product.marketplace_id,
                image: product.image_base64,
                dateListed: product.date_created,
              }))
            : [];
          if (searchProducts.length > 0) {
            onSearch(searchProducts);
          } else {
            toast.error("⚠️ No products found.");
          }
        } else {
          const errorText = await response.text();
          toast.error(`⚠️ Failed to search: ${errorText}`);
        }
      } catch (error) {
        toast.error("⚠️ Slow connection detected! Please try again.");
        console.error("Search Error:", error);
      }
    };
  
      useEffect(() => {
      const delayDebounce = setTimeout(() => {
        if (searchQuery.trim() !== "") {
          handleSearch(searchQuery);
        }
      }, 1000);

      return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

  // Log out function
  const handleLogout = () => {
    setShowSignoutConfirm(true);
  };

    const fetchViewOrders = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("⚠️ You need to be logged in to view orders.");
      return;
    }
    setIsLoadingOrders(true);
    try {
      const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/order/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ lastOrderId: "" }),
      });
      const data = await response.json();
      setViewOrders(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      toast.error("⚠️ Unable to fetch orders.");
    } finally {
      setIsLoadingOrders(false);
    }
  };

    // Handler for View Orders click
  const handleViewOrders = async () => {
    await fetchViewOrders();
    setShowOrdersModal(true);
  };

  const confirmSignout = () => { 
    try {
      sessionStorage.removeItem("username");
      setUsername(null);
      toast.success("🎉 Your account has been sign out! Redirecting to Landing Page...");
      setTimeout(() => {
        navigate("/landingpage");
      }, 1000);
    } catch (error) {
      toast.error("⚠️ Connection error! Please wait...");
    } finally {
      setShowSignoutConfirm(false);
    }
  };

  const cancelSignout = () => {
    setShowSignoutConfirm(false);
  };

  //Dropdown Function
  const handleClickOutside = (event) => {
    if (!event.target.closest(".dropdown")) {
      setIsAccountOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div className="navbar_middle flex items-center justify-center bg-[#f0f2f3] h-[84px] w-full z-50 relative">
          <div className="lg:container flex justify-between items-center">
              <div className="flex items-center gap-6">
            <Link
              to="/landingpage"
               className="text-3xl flex items-center gap-2 font-medium">
               𝑭𝒂𝒌𝒆 𝑺𝒕𝒐𝒓𝒆
            </Link>
          </div>
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="   Search products here..."
              className="w-full h-[44px] pl-6 pr-10 py-2 rounded-lg shadow-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update the state
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2"
              onClick={() => handleSearch(searchQuery)} // Trigger the search
            >
              <Search size="22px" color="#272343" />
            </button>
          </div>
        <div className="relative">
          <Link 
            to="/addtocart" 
              className="relative flex items-center gap-2">
            <div className="relative">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </div>
              <span> Shopping Cart </span>
          </Link>
        </div>
      <div className="relative">
          <Link 
            to="/wishlist" 
              className="relative flex items-center gap-2">
            <div className="relative">
              <Heart size={24} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistItems.length}
                  </span>
                )}
            </div>
              <span> Wish List </span>
          </Link>
        </div>
      <div className="relative dropdown">
          <button
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                  setIsAccountOpen(!isAccountOpen);
                }}
              >
            <User className="w-6 h-6" />
              {username ? username : "Guest Account"}
            </button>
        {isAccountOpen && (
          <ul className="absolute right-0 top-[60px] mt-2 w-52 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50 transition-all duration-200">
            {username ? (
              <>
            <li className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
              <Link 
                to="/viewaccount" 
                  className="block px-4 py-2 text-gray-700">
                    View Account
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
              <Link 
                to="/additem" 
                  className="block px-4 py-2 text-gray-700">
                    Add Item
              </Link>
            </li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
              <button
                type="button"
                onClick={handleViewOrders}
                className="block w-full text-left px-4 py-2 text-gray-700"
              >
                View Orders
              </button>
            </li>
            <li 
              className="p-2 hover:bg-red-100 cursor-pointer"
               onClick={handleLogout}>
              <button 
                className="block w-full text-left px-4 py-2 text-red-500">
                  Logout
              </button>
            </li>
            </>
            ) : (
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                <Link 
                  to="/loginregister" 
                    className="block px-4 py-2 text-gray-700">
                      SIGN IN
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>

    {/* Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-6 relative">
            <button
              className="absolute top-2 right-4 text-2xl text-gray-500 hover:text-gray-700"
              onClick={() => setShowOrdersModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Your Orders</h2>
            {isLoadingOrders ? (
              <p>Loading...</p>
            ) : viewOrders.length > 0 ? (
              <div className="max-h-[400px] overflow-auto">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">Order ID</th>
                      <th className="border px-2 py-1">Image</th>
                      <th className="border px-2 py-1">Title</th>
                      <th className="border px-2 py-1">Category</th>
                      <th className="border px-2 py-1">Price</th>
                      <th className="border px-2 py-1">Quantity</th>
                      <th className="border px-2 py-1">Status</th>
                      <th className="border px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewOrders.map((order) => (
                      <tr key={`${order.order_id}-${order.marketplace_id}`}>
                        <td className="border px-2 py-1">{order.order_id}</td>
                        <td className="border px-2 py-1">
                          {order.image_base64 ? (
                            <img
                              src={
                                order.image_base64.startsWith("data:image/")
                                  ? order.image_base64
                                  : `data:image/jpeg;base64,${order.image_base64}`
                              }
                              alt={order.title}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="border px-2 py-1">{order.title}</td>
                        <td className="border px-2 py-1">{order.category}</td>
                        <td className="border px-2 py-1">${order.price_at_purchase}</td>
                        <td className="border px-2 py-1">{order.quantity}</td>
                        <td className="border px-2 py-1">{order.status}</td>
                        <td className="border px-2 py-1">{order.date_created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        </div>
      )}


          {/* Alertmessage Component */}
          {showSignoutConfirm && (
        <Alertmessage
          title="Confirm sign out"
          message="Are you sure you want to sign out?"
          onConfirm={confirmSignout}
          onCancel={cancelSignout}
        />
      )}
  </div>
</div>
  );
    };


export default Navbar;
