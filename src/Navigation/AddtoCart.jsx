import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from "lucide-react";
//Backend Calling
import { API_BACKENDAPI_URL, API_BACKENDAPI2_URL } from "../BackendConnector/apiRoutes";
//Installed Notification
import { toast } from 'react-hot-toast';
import Alertmessage from "../AlertModalNotif/Alertmessage";

const AddtoCart = ({ onCartSync }) => {
  const [cartSessionId, setCartSessionId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("⚠️ You need to be signed in to view your cart.");
          return;
        }
  
        const response = await fetch(`${API_BACKENDAPI2_URL}/api/Cart/Get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
  
        console.log("API Response Status:", response.status);
        const data = await response.json();
        console.log("API Response Data:", data);
  
        if (Array.isArray(data)) {
          // Ensure quantity starts at 1 for each item
          const updatedCartItems = data.map((item) => ({
            ...item,
            quantity: item.quantity > 0 ? item.quantity : 1, // Default to 1 if quantity is not valid
          }));
  
          setCartItems(updatedCartItems);
  
          if (data.length > 0) {
            const sessionId = data[0].CartSessionID || "No ID";
            setCartSessionId(sessionId);
            sessionStorage.setItem("cartSessionId", sessionId);
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        toast.error("⚠️ Unable to fetch cart. Please try again.");
      }
    };
  
    fetchCart();
  }, []);
    
  const total = cartItems.reduce((sum, item) => {
    const quantity = parseInt(item.quantity);
    const validQty = !isNaN(quantity) && quantity > 0 ? quantity : 0;
    return sum + item.price * validQty;
  }, 0);

  const updateQuantity = async (id, change) => {
    try {
      const numericId = parseInt(id); // Parse id as a number if possible
      const cartItem = cartItems.find((item) => item.marketplace_id === numericId);
  
      if (!cartItem || !cartItem.CartID) {
        toast.error("⚠️ Invalid cart item. Please try again.");
        return;
      }

      const newQuantity = cartItem.quantity + change;
      if (newQuantity < 1) {
        toast.error("⚠️ Quantity cannot be less than 1.");
        return;
      }

      const token = sessionStorage.getItem("token");
      const payload = {
        token,
        cartid: cartItem.CartID,
        quantity: Math.abs(change),
        add: change > 0 ? true : null,
        minus: change < 0 ? true : null,
      };
  
      const response = await fetch(`${API_BACKENDAPI_URL}/api/EditCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.text();
      console.log(data);
  
      if (data === "Cart edited") {
        setCartItems((prevCart) =>
          prevCart.map((item) =>
            item.marketplace_id === numericId
              ? { ...item, Quantity: newQuantity }
              : item
          )
        );
        onCartSync(cartItems);
        toast.success("Cart updated successfully!");
      } else {
        toast.error(`⚠️ ${data}`);
      }
    } catch {
      console.error("Error updating quantity:", error);
      toast.error("⚠️ Unable to update cart. Please try again.");
    }
  };

  //API RemoveFromCart
  const removeFromCart = async (cartId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ You need to be logged in to remove items from your cart.");
        return;
      }
  
      const requestBody = {
        cart_id: cartId,
      };
  
      const response = await fetch(`${API_BACKENDAPI2_URL}/api/Cart/Remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("API Response Status:", response.status);
      const data = await response.text();
      console.log("API Response Data:", data);
  
      if (response.ok && data === "Item removed from cart.") {
        setCartItems((prevCart) => prevCart.filter((item) => item.cart_id !== cartId));
        toast.success("Item removed from cart successfully!");
      } else {
        toast.error(`⚠️ ${data}`);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("⚠️ Unable to remove item from cart. Please try again.");
    }
  };

  //API RemoveAllFromCart
  const removeAllFromCart = async () => {
    const token = sessionStorage.getItem("token");
    const cartSessionId = sessionStorage.getItem("cartSessionId");
  
    if (!cartSessionId || cartSessionId === "No ID") {
      toast.error("⚠️ Invalid cart session. Please try again.");
      return;
    }
  
    if (!token) {
      toast.error("⚠️ You need to be logged in to remove all items from your cart.");
      return;
    }
  
    const requestBody = {
      token,
      cartsession: cartSessionId,
    };
  
    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/RemoveAllFromCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.text();
      if (data === "All cart item has been removed") {
        setCartItems([]);
        onCartSync([]);
        sessionStorage.removeItem("cartSessionId");
        setCartSessionId(null);
        toast.success("All items have been removed from your cart!");
      } else {
        toast.error(`⚠️ Unexpected error: ${data}`);
      }
    } catch (error) {
      console.error("Error removing all items from cart:", error);
      toast.error("⚠️ Unable to remove all items from cart. Please try again.");
    }
  };

  // Open modal to edit quantity
  const openEditModal = (item) => {
    setEditItem(item);
    setEditQuantity(item.quantity);
    setShowModal(true);
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Handle quantity change in the modal
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setEditQuantity(value === "" ? "" : parseInt(value));
    }
  };

  // Submit edited quantity
  const submitEditedQuantity = () => {
    if (editQuantity !== "" && editQuantity > 0) {
      setCartItems((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.marketID === editItem.marketID
            ? { ...cartItem, quantity: editQuantity }
            : cartItem
        )
      );
      setInputValues((prev) => ({
        ...prev,
        [editItem.marketID]: editQuantity.toString(),
      }));
      closeModal();
    } else {
      toast.error(" ⚠️ Please enter quantity.");
    }
  };

  return (
    <div>
      {/* Back Button */}
        <button
        onClick={() => navigate("/marketplace")} // Navigate to marketplace
        className="absolute top-4 left-4 z-30 p-3 bg-gray-800/50 rounded-full backdrop-blur hover:bg-purple-600 transition"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <div className="w-full min-h-screen bg-gray-100 p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 border-b pb-3 text-center">MY CART</h2>
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="max-h-[calc(100vh-200px)]">
            {cartItems.map((item) => (
              <div key={`${item.cart_id}-${item.marketplace_id}`} className="flex items-center border-b py-5 space-x-6">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-24 h-24 rounded-md object-cover" 
                />
                <div className="flex-1">
                <p className="text-lg font-medium">{item.title || "No Title"}</p>
                  <p className="text-lg font-medium">{item.description || "No Description"}</p>
                  <p className="text-xl font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.marketplace_id, -1)}
                  className="w-14 h-10 bg-red-500 text-white rounded-md text-2xl font-bold transition duration-300 ease-in-out hover:bg-red-600 active:bg-red-700"
                >
                  -
                </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    value={inputValues[item.marketplace_id] !== undefined ? inputValues[item.marketplace_id] : item.quantity}
                    onClick={() => openEditModal(item)}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (/^\d*$/.test(newValue)) {
                        const parsed = newValue === "" ? "" : parseInt(newValue);
                        if (parsed < 1) {
                          toast.error("⚠️ Quantity cannot be less than 1.");
                          return;
                        }
                        setInputValues((prev) => ({
                          ...prev,
                          [item.marketplace_id]: newValue,
                        }));
                        setCartItems((prevCart) =>
                          prevCart.map((cartItem) =>
                            cartItem.marketplace_id === item.marketplace_id
                              ? { ...cartItem, Quantity: parsed }
                              : cartItem
                          )
                        );
                      }
                    }}
                    onBlur={() => {
                      const numericId = item.marketplace_id;
                      const cartItem = cartItems.find((item) => item.marketplace_id === numericId);
                      const newQuantity = parseInt(inputValues[numericId]);
                  
                      if (newQuantity && newQuantity !== cartItem.quantity) {
                        updateQuantity(numericId, newQuantity - cartItem.quantity);
                      }
                    }}
                    className="w-20 h-10 text-center text-xl font-medium rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                  />
              <button
                onClick={() => updateQuantity(item.marketplace_id, 1)}
                className="w-14 h-10 bg-green-500 text-white rounded-md text-2xl font-bold transition duration-300 ease-in-out hover:bg-green-600 active:bg-green-700"
              >
                +
              </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.cart_id)}
                  className="w-14 h-10 bg-red-500 text-white rounded-md text-2xl font-bold transition duration-300 ease-in-out hover:bg-gray-600 active:bg-gray-700"
                >
                  🗑
                </button>
              </div>
            ))}

          </div>
        </div>
      <div className="w-full bg-white shadow-lg p-6 flex justify-between items-center border-t mt-auto">
        <span className="text-3xl font-bold">Total: ${total.toFixed(2)}</span>
        <button
          onClick={() =>
             setShowRemoveAllModal(true)
            }
          className="py-4 px-10 bg-gray-600 text-white font-bold rounded-lg text-3xl hover:bg-gray-700 transition"
        >
          CLEAR CART
        </button>
        <button
          onClick={() => 
            setShowCheckoutModal(true)
          }
          className="py-4 px-10 bg-red-600 text-white font-bold rounded-lg text-3xl hover:bg-red-700 transition"
        >
          CHECK OUT
        </button>
        </div>
      </div>

      {/* Remove All Cart Modal */}
        {showRemoveAllModal && (
          <Alertmessage
            title="Remove All Cart"
            message="Are you sure you want to remove all items from your cart?"
            onConfirm={() => {
              removeAllFromCart(); // Call the removeAllFromCart function
              setShowRemoveAllModal(false); // Close the modal
            }}
            onCancel={() => setShowRemoveAllModal(false)} // Close the modal
          />
        )}

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <Alertmessage
            title="Checkout"
            message="Are you sure you want to proceed to checkout?"
            onConfirm={() => {
              navigate("/checkout", { state: { cartItems, total, cartSessionId } }); // Navigate to checkout
              setShowCheckoutModal(false); // Close the modal
            }}
            onCancel={() => setShowCheckoutModal(false)} // Close the modal
          />
        )}

    {/* Modal for editing quantity */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-2xl text-center font-bold mb-4">Edit Quantity</h3>
            <input
              type="number"
              value={editQuantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={submitEditedQuantity}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddtoCart;