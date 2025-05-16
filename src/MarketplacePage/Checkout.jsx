import {  useState, useEffect} from 'react';
//useLocation for Online GoogleMap
import { useLocation, useNavigate } from 'react-router-dom';
//Package Notication
import { toast } from 'react-hot-toast';
//Backend Connector
import { API_BACKENDRICOAPI_URL } from '../BackendConnector/apiRoutes';

  const Checkout = () => {
    const location = useLocation();
    const { cartItems = [], total = 0 } = location.state || {};
    const [isLoading, setIsLoading] = useState(false);
    const deliveryFee = 9.99;
    const vat = total * 0.00;
    const grandTotal = total + vat + deliveryFee;
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('customerDetails');

    //Checking if there is token receive from the sessionStorage
      const getSessionData = () => {
        const token = sessionStorage.getItem("token");
    
          if (!token) {
            toast.error("⚠️ Before ording please sign in first! ");
              setTimeout(() => {
                navigate("/loginregister");
                }, 2500); 
            return null;
          }
          return { token };
        };

  const handlePlaceOrder = async () => {
    const sessionData = getSessionData();
      if (!sessionData) {
        toast.error(" ⚠️ Your sign in has been expired! Please sign in again...")
          setTimeout(() => {
            navigate("/loginregister");
          }, 2500); 
      return;
      }

  //Extracting the token
  const { token } = sessionData;
  const cart_ids = cartItems.map(item => item.cart_id);

    setIsLoading(true);
  
  //Rico API Endpoint for api/order/checkout
    try {
      const response = await fetch(`${API_BACKENDRICOAPI_URL}/api/order/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({cart_ids}),
      });
  
      console.log("API Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);
  
      if (data === "Order placed successfully.") {
        toast.success("🎉 Your order has been placed successfully!");
        setTimeout(() => {
          navigate("/marketplace");
        }, 1500);
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Error processing checkout. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (order_id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("⚠️ You need to be logged in to cancel an order.");
        return;
      }

      const response = await fetch(`${API_BACKENDRICOAPI_URL}/order/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ order_id }),
      });

      const data = await response.text();
      if (response.ok && data === "Order cancelled") {
        toast.success("Order cancelled successfully!");
        setTransactionHistory((prev) =>
          prev.filter((t) => t.order_id !== order_id)
        );
      } else {
        toast.error(`⚠️ ${data}`);
      }
    } catch (error) {
      toast.error("⚠️ Unable to cancel order. Please try again.");
      console.error("Cancel Order Error:", error);
    }
  };

  return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#c9e5e9] to-[#ccddf9] px-4 py-8">
      <div className="flex flex-col md:flex-row w-full max-w-[1400px] bg-white rounded-[30px] shadow-[0px_15px_50px_10px_rgba(0,0,0,0.2)] overflow-hidden h-full">

      {/* Shipping Details Section */}
    <div className="flex flex-col w-full md:w-1/2 h-full p-12 space-y-6">
      <h2 className="text-center text-xl font-semibold">CHECKOUT</h2>
      <div className="w-full h-px bg-gray-300"></div>
      <form className="space-y-4">

    {/* Shipping Country Dropdown */}
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700"> Payment Methods:</label>
      <select
        className="w-full border border-gray-300 rounded-lg p-3"
        defaultValue="XurePay"
      >
        <option value="XurePay Balance"> XurePay </option>
        <option value="G-Cash"> G-Cash </option>
        <option value="credit Card"> Credit Card </option>
        <option value="E-Wallet"> E-Wallet </option>
      </select>
    </div>

    <div className="space-y-4">
      <div className="space-y-2">

        {/* Delivery Address Tabs */}
      <div className="flex justify-between border-b border-gray-300 mb-4">
        <button
          className={`w-1/2 py-3 text-center font-medium ${
            activeTab === 'customerDetails' ? 'text-gray-700 border-b-2 border-black' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('customerDetails')}
        >
          Customer Details
        </button>
        <button
          className={`w-1/2 py-3 text-center font-medium ${
            activeTab === 'shippingAddress' ? 'text-gray-700 border-b-2 border-black' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('shippingAddress')}
        >
          Shipping Address
        </button>
      </div>
        
      {/* Conditionally Render Fields Based on Active Tab */}
      {activeTab === 'customerDetails' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="First Name"
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-500">+63</span>
            <input
              type="text"
              placeholder="Mobile Number"
              className="w-full border border-gray-300 rounded-lg p-3 pl-12"
              required
            />
          </div>
        </div>
      )}

      {activeTab === 'shippingAddress' && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Street/Building Name"
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />
          <input
            type="text"
            placeholder="Region/City/District"
            className="w-full border border-gray-300 rounded-lg p-3"
            required
          />
          <input
            type="text"
            placeholder="Building Unit/Floor (Optional)"
            className="w-full border border-gray-300 rounded-lg p-3"
          />
        </div>
      )}
    </div>
    </div>

        {/* Buy Now Button with Terms */}
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        By filling up your information, you agree to our{" "}
        <a href="#" className="text-blue-600 underline">
          Terms & Conditions
        </a>
        ,{" "}
        <a href="#" className="text-blue-600 underline">
          Privacy Policy
        </a>
        , and{" "}
        <a href="#" className="text-blue-600 underline">
          Returns Policy
        </a>
        .
      </p>
      <button 
            onClick={handlePlaceOrder}
            disabled={isLoading}
             className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition text-lg mt-4"
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
    </div>
      </form>
    </div>

        {/* Order Summary Section (50% width) */}
        <div className="flex flex-col justify-center w-full md:w-1/2 h-full p-12 space-y-6">
          <h2 className="text-center text-xl font-semibold">Order Summary</h2>
          <div className="w-full h-px bg-gray-300"></div>

            {cartItems.length > 0 ? (
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Image</th>
                    <th className="border border-gray-300 px-4 py-2">Title</th>
                    <th className="border border-gray-300 px-4 py-2">Price</th>
                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  </tr>
                </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={`${item.cart_id}`}>
                        <td className="border border-gray-300 px-4 py-2">
                          <img
                            src={
                              item.image_base64
                                ? item.image_base64.startsWith("data:image/")
                                  ? item.image_base64
                                  : `data:image/jpeg;base64,${item.image_base64}`
                                : "defaultImage.jpg"
                            }
                            alt={item.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{item.title}</td>
                        <td className="border border-gray-300 px-4 py-2">${item.price}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            ) : (
              <p>No products to checkout.</p>
            )}

          <div className="flex justify-between text-sm text-gray-600 pt-2">
            <div className="space-y-1">
              <p className="font-medium">Subtotal w/ VAT 12%</p>
              <p className="font-medium">Delivery Charge</p>
              <p className="font-medium text-lg">TOTAL</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-medium">${vat.toFixed(2)}</p>
              <p className="font-medium">${deliveryFee.toFixed(2)}</p>
              <p className="font-bold text-xl text-black">${grandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
