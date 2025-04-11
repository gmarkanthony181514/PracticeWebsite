import { useEffect, useState } from "react";
//Backend Calling
import { API_BACKENDAPI_URL } from "../../varConstant";
//Installed Notification
import { toast } from 'react-hot-toast';


const AddtoCart = ({ cartItems = [], setCartItems }) => {
  const [token, setToken] = useState(null);

//Getting user token used on Sign In
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token"); 
    if (storedToken) {
      setToken(storedToken);
    } else {
       toast.error(" ⚠️ No token receive from the API server.");
       return;
      }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserCart();
    } else {
        toast.error(" ⚠️ No token found from your sign-in session.");
        return;
      }
  }, [token]);

  const fetchUserCart = async () => {
    if (!token) {
      toast.error(" ⚠️ Please sign in to add products to your cart!");
      return;
    }

  //API calling Endpoints
    try {
      const requestBody = { token };
      const response = await fetch(`${API_BACKENDAPI_URL}/api/ViewUserCart`, {
        method: "POST",
        //Required based on Matt documentation
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(" ⚠️ Failed to load your cart. Check your internet connection.");
      }

      const data = await response.json();
      if (data === "No cart") {
        toast.error(" ⚠️ You don't have any items in your cart yet. Try adding something.");
        return;
      } else {
        setCartItems(data);  // Assuming 'data' is an array of items
      }
    } catch (error) {
      console.error(" ⚠️ Error fetching user cart:", error);
      toast.error(" ⚠️ Fetching cart is unavailable. Please check your internet connection.");
      return;
    }
  };

//Add to cart function
  const addToCart = async (product) => {
    try {
      const requestBody = {
        token,
        marketid: product.item_id,
        quantity: 1,
      };

    //API Calling Endpoints
      const response = await fetch(`${API_BACKENDAPI_URL}/api/AddToCart`, {
        method: "POST",
        //Required based on Matt documentation
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(" ⚠️ Failed to add product in your cart.");
      }

      const data = await response.json();
      if (data === "Added to cart") {
        setCartItems((prevCart) => [...prevCart, product]);
        toast.success(" 🎉 Product has been added to your cart!");
      } else {
         toast.error(data);
          return;
      }
    } catch (error) {
      console.error(" ⚠️ Error adding product to cart:", error);
       toast.error(" ⚠️ Network error or server unavailable. Please try again.");
        return;
    }
  };

//Quantity functionality
  const updateQuantity = (id, change) => {
    setCartItems((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );
      return updatedCart;
    });
  };

//Total functionality
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 border-b pb-3">MY CART</h2>
        <div className="flex-1 overflow-y-auto pr-4">
          <div className="max-h-[calc(100vh-200px)]">
            {cartItems.map((item, index) => (
              <div key={item.item_id || index} className="flex items-center border-b py-5 space-x-6">
                <img 
                  src={item.image || "default-image.png"} 
                    alt={item.title} 
                      className="w-24 h-24 rounded-md object-cover" />
                    <div className="flex-1">
                      <p className="text-lg font-medium">{item.title || "No details provided"}</p>
                        <p className="text-xl font-bold">${(item.price * item.quantity || 0).toFixed(2)}</p>
                    </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)} 
                      className="w-14 h-10 bg-red-500 text-white rounded-md text-2xl font-bold transition duration-300 ease-in-out hover:bg-red-600 active:bg-red-700"
                        >
                      -
                    </button>
                  <div className="w-14 h-10 bg-gray-200 text-center text-xl font-medium flex items-center justify-center rounded-md">
                    {item.quantity || 0}
                  </div>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                        className="w-14 h-10 bg-green-500 text-white rounded-md text-2xl font-bold transition duration-300 ease-in-out hover:bg-green-600 active:bg-green-700"
                      >
                    +
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    <div className="w-full bg-white shadow-lg p-6 flex justify-between items-center border-t mt-auto">
      <span className="text-3xl font-bold">Total: ${total.toFixed(2)}</span>
        <button className="py-4 px-10 bg-red-600 text-white font-bold rounded-lg text-3xl hover:bg-red-700 transition">
          CHECK OUT
        </button>
      </div>
    </div>
  );
};

export default AddtoCart;
