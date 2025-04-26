import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { API_BACKENDAPI_URL, API_FAKESTORE_URL } from '../../varConstant';

const Checkout = () => {
  const location = useLocation();
  const { cartItems = [], total = 0, cartSessionId } = location.state || {};
  const [isLoading, setIsLoading] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const deliveryFee = 9.99;
  const vat = total * 0.09;
  const grandTotal = total + vat + deliveryFee;
  const navigate = useNavigate();

  const getSessionData = () => {
    const token = sessionStorage.getItem("token");
    const cartSession = sessionStorage.getItem("cartSessionId");
  
    if (!token || token.trim() === "") {
      toast.error("⚠️ Invalid or missing token. Please log in again.");
      return null;
    }
  
    if (!cartSession || cartSession === "No ID") {
      toast.error("⚠️ Invalid cart session. Please try again.");
      return null;
    }
  
    return { token, cartSession };
  };
  
  const handlePlaceOrder = async () => {
    const sessionData = getSessionData();
    if (!sessionData) return;
  
    const { token, cartSession } = sessionData;
  
    const requestBody = {
      token,
      cartsession: cartSession,
    };
  
    setIsLoading(true);
  
    try {
      const response = await fetch(`${API_BACKENDAPI_URL}/api/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
          console.log("Request Body:", requestBody);
  
      console.log("API Response Status:", response.status);
      const data = await response.json();
      console.log("API Response Data:", data);
  
      if (data === "Checked out" || data.message === "Checked out") {
        toast.success('🎉 Order sent successfully to the seller! Redirecting now on Marketplace...');
        setTimeout(() => {
          navigate('/marketplace');
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
      const response = await fetch(`${API_BACKENDAPI_URL}/ViewTransactionHistory`, {
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
      <h2 className="text-center text-xl font-semibold">Add Shipping Details</h2>
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
        <input
          type="text"
          placeholder="Mobile Number (For delivery call)"
          className="w-full border border-gray-300 rounded-lg p-3"
          required
        />
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
      </div>
    </div>

        {/* Buy Now Button with Terms */}
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        By saving your information, you agree to our{" "}
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
        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition text-lg mt-4"
      >
        Save
      </button>
    </div>
      </form>
    </div>

        {/* Order Summary Section (50% width) */}
        <div className="flex flex-col justify-center w-full md:w-1/2 h-full p-12 space-y-6">
          <h2 className="text-center text-xl font-semibold">Order Summary</h2>
          <div className="w-full h-px bg-gray-300"></div>

          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={`${item.marketID}-${index}`} className="w-full space-y-2">
                <div className="flex">
                  <img src={item.image || "https://via.placeholder.com/150"} alt={item.title} className="w-[30%] rounded" />
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
              <p className="font-medium">VAT 12%</p>
              <p className="font-medium">Delivery</p>
              <p className="font-medium text-lg">TOTAL</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-medium">${vat.toFixed(2)}</p>
              <p className="font-medium">${deliveryFee.toFixed(2)}</p>
              <p className="font-bold text-xl text-black">${grandTotal.toFixed(2)}</p>
            </div>
          </div>
          <button 
            onClick={handlePlaceOrder}
            disabled={isLoading}
             className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition text-lg mt-4"
          >
            {isLoading ? 'Processing...' : 'Place Order'}
          </button>
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
