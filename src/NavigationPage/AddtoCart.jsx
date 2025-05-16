import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from "lucide-react";
//Backend Calling
import { API_BACKENDMATTAPI_URL, API_BACKENDRICOAPI_URL } from "../BackendConnector/apiRoutes";
//Installed Notification
import { toast } from 'react-hot-toast';
//Syncing with another files
import Alertmessage from "../AlertModalNotif/Alertmessage";
import SectionTitle from "../MarketplacePage/ExtraIdeas/SectionTitle";

const AddtoCart = ({ onCartSync }) => {
  const [cartItems, setCartItems] = useState([]);
  const [inputValues, setInputValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [editQuantity, setEditQuantity] = useState(null);
  const [editItem, setEditItem] = useState(null);
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
  
        const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/cart/loadmore`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch cart");
        }
  
        console.log("API Response Status:", response.status);
        const data = await response.json();
        console.log("API Response Data:", data);

        //Making the situation not to be confusing
        const addToCartFetch = data.data;

      // Access the `data` property of the API response
        if (Array.isArray(data.data)) {
          const updatedCartItems = addToCartFetch.map((item) => ({
            ...item,
            quantity: item.quantity > 0 ? item.quantity : 1,
          }));

          setCartItems(updatedCartItems);
          console.log("Updated Cart Items:", updatedCartItems);

        } else {
          console.error("Unexpected API response format:", data);
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

    const updateQuantity = async (marketplace_id, change) => {
      try {

        const numericId = parseInt(marketplace_id);
        const cartItem = cartItems.find((item) => item.marketplace_id === numericId);

        if (!cartItem) {
          toast.error("⚠️ Invalid cart item. Please try again.");
          return;
        }

        const newQuantity = cartItem.quantity + change;
        if (newQuantity < 1) {
          toast.error("⚠️ Quantity cannot be less than 1.");
          return;
        }

        const token = sessionStorage.getItem("token");
        if (!token) {
          toast.error("⚠️ You need to be signed in.");
          return;
        }

        // Try sending cart_id instead of marketplace_id if your backend expects it
        const requestBody = {
          marketplace_id: numericId,
          quantity: newQuantity,
        };

        const response = await fetch(`${API_BACKENDRICOAPI_URL}/Cart/update`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.text();
        console.log("Update quantity response:", data);

        if (response.ok && data === "Item removed from cart.") {
          setCartItems((prevCart) =>
            prevCart.filter((item) => item.marketplace_id !== numericId)
          );
          toast.success("Item removed from cart.");
        } else if (response.ok) {
          setCartItems((prevCart) =>
            prevCart.map((cartItem) =>
              cartItem.marketplace_id === item.marketplace_id
                ? { ...cartItem, quantity: parsed } // <-- use lowercase 'quantity'
                : cartItem
            )
          );
          toast.success("Cart updated successfully!");
        } else {
          toast.error(`⚠️ ${data}`);
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
        toast.error("⚠️ Unable to update cart. Please try again.");
      }
    };

  //API RemoveFromCart
  const removeFromCart = async (cart_id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ You need to be logged in to remove items from your cart.");
        return;
      }

      const requestBody = {
        cart_id,
      }
  
      const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/Cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("API Response Status:", response.status);
      const data = await response.text();
      console.log("API Response Data:", data);
  
      if (response.ok && data === "Item removed") {
        setCartItems((prevCart) => prevCart.filter((item) => item.cart_id !== cart_id));
        toast.success("An item has been removed from your cart!");
      } else {
        toast.error(`⚠️ ${data}`);
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("⚠️ Unable to remove item from cart. Please try again.");
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
    updateQuantity(editItem.marketplace_id, editQuantity - editItem.quantity);
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
        <SectionTitle title="Your Cart" mb="mb-12" />
          <div className="flex-1 overflow-y-auto pr-4">
            <div className="max-h-[calc(100vh-200px)]">
            {cartItems.map((item) => (
              <div key={`${item.cart_id}-${item.marketplace_id}`} className="flex items-center border-b py-5 space-x-6">
                <img 
                  src={item.image_base64
                        ? item.image_base64.startsWith("data:image/")
                        ? item.image_base64
                        : `data:image/jpeg;base64,${item.image_base64}`
                      : "defaultImage.jpg"
                  } 
                  alt={item.title} 
                  className="w-24 h-24 rounded-md object-cover" 
                />
                <div className="flex-1">
                <p className="text-lg font-medium">{item.title}</p>
                  <p className="text-lg font-medium">{item.category}</p>
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
            setShowCheckoutModal(true)
          }
          className="py-4 px-10 bg-red-600 text-white font-bold rounded-lg text-3xl hover:bg-red-700 transition"
        >
          CHECK OUT
        </button>
        </div>
      </div>

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <Alertmessage
            title="Checkout"
            message="Are you sure you want to proceed to checkout?"
            onConfirm={() => {
              navigate("/checkout", { state: { cartItems, total } });
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