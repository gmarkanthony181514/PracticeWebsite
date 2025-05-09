import {  useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_BACKENDAPI_URL, API_BACKENDAPI2_URL } from '../BackendConnector/apiRoutes';

const Checkout = () => {
  const location = useLocation();
  const { cartItems = [], total = 0, cartSessionId } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const deliveryFee = 9.99;
  const vat = total * 0.00;
  const grandTotal = total + vat + deliveryFee;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('customerDetails');

  
  const getSessionData = () => {
    const token = sessionStorage.getItem("token");
    // const cartSession = sessionStorage.getItem("cartSessionId");
  
    if (!token) {
      toast.error("⚠️ You need to be logged in to place an order.");
      return null;
    }
  
    // if (!cartSession || cartSession === "No ID") {
    //   toast.error("⚠️ Invalid cart session ID detected.");
    //   return null;
    // }
  
    return { token };
  };
  
  const handlePlaceOrder = async () => {
    const sessionData = getSessionData();
    if (!sessionData) return;
  
    // if (!cartSessionId) {
    //   toast.error("⚠️ Invalid cart session. Please try again.");
    //   return;
    // }

    const { token } = sessionData;

    // const { cartSession } = sessionData;
    const requestBody = {
      cartItems,
    };
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${API_BACKENDAPI2_URL}/api/order/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("API Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);
  
      if (data === "Order placed successfully" || data.message === "Order placed successfully") {
        toast.success("🎉 Order placed successfully! Redirecting to Marketplace...");
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
  
  //NO API YET FOR THIS
  const handleCancelOrder = async () => {
    const sessionData = getSessionData();
    if (!sessionData) return;
  
    const { token, cartSession } = sessionData;
  
    const requestBody = {
      token,
      cartsession: cartSession,
    };
  
    console.log("Request Body:", requestBody);
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/CancelOrder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      console.log("API Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);
  
      if (data === "cancelled order" || data.message === "cancelled order") {
        toast.success('🎉 Order successfully canceled!');
        sessionStorage.removeItem("cartSessionId"); // Clear cart session after cancellation
        navigate('/marketplace'); // Redirect to marketplace or another page
      } else if (data === "cartsession not found" || data.message === "cartsession not found") {
        toast.error("Cart session not found or not checked out.");
      } else if (data === "Error: Cannot Validate User" || data.message === "Error: Cannot Validate User") {
        toast.error("Session expired. Please log in again.");
      } else if (data === "Cannot cancel order" || data.message === "Cannot cancel order") {
        toast.error("Failed to cancel the order. Please try again.");
      } else {
        toast.error("Cancellation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during order cancellation:", error);
      toast.error("Error processing cancellation. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  //NO API YET FOR THIS
  const handleViewTransactionHistory = async () => {
    console.log("View Transaction History button clicked");

    const token = sessionStorage.getItem("token");
    if (!token || token.trim() === "") {
      toast.error("⚠️ Invalid or missing token. Please log in again.");
      return;
    }

    const requestBody = {
      token,
    };

    console.log("Request Body:", requestBody);

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/ViewTransactionHistory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log("API Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);

      if (Array.isArray(data)) {
        setTransactionHistory(data);
        setShowTransactionHistory(true);
        toast.success("🎉 Transaction history retrieved successfully!");
      } else if (data === "Cannot get transaction history") {
        toast.error("⚠️ Unable to retrieve transaction history.");
      } else {
        toast.error("⚠️ Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      toast.error("⚠️ Error processing transaction history. Please try again.");
    } finally {
      setIsLoading(false);
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
            cartItems.map((item) => (
              <div key={`${item.marketplace_id}`} className="w-full space-y-2">
                <div className="flex">
                  <img src={item.image} 
                  alt={item.title} 
                  className="w-[30%] rounded" />
                  <div className="pl-4">
                    <p className="font-medium text-lg">{item.title}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right text-blue-600 font-semibold text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <div className="w-full h-px bg-gray-300"></div>
              </div>
            ))
          ) : (
            <p>No items in cart.</p>
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
          <button 
            onClick={handleCancelOrder}
            disabled={isLoading}
            className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition text-lg mt-4"
          >
            {isLoading ? 'Processing...' : 'Cancel Order'}
          </button>
          <button 
            onClick={handleViewTransactionHistory}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition text-lg mt-4"
          >
            {isLoading ? 'Loading...' : 'View Transaction History'}
          </button>
        </div>
      </div>

       {/* Transaction History Modal */}
       {showTransactionHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-6">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full md:w-[600px] max-w-full relative">
            <button
              className="absolute top-4 right-6 text-gray-500 text-4xl font-bold hover:text-gray-700"
              onClick={() => setShowTransactionHistory(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
            {transactionHistory.length > 0 ? (
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Cart ID</th>
                    <th className="border border-gray-300 px-4 py-2">Item</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionHistory.map((transaction) => (
                    <tr key={transaction.cartid}>
                      <td className="border border-gray-300 px-4 py-2">{transaction.cartid}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.item}</td>
                      <td className="border border-gray-300 px-4 py-2">{transaction.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transaction history found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
