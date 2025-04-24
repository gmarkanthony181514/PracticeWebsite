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
            className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold hover:bg-gray-100 transition text-lg"
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

        {/* Google Map Section (50% width) */}
        <div className="w-full md:w-1/2 mt-4 md:mt-0 p-4 flex-1">
          <p className="text-sm text-gray-600 mb-2">Delivery Address Location:</p>
          <div className="rounded-lg overflow-hidden h-full">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1930.6366264600496!2d120.9842194928566!3d14.599512379105352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ca22a5e19121%3A0x5515d1cf47b41e99!2sManila%2C%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1713084170293!5m2!1sen!2sph"
              width="100%"
              height="100%"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full border-0 rounded-lg"
            ></iframe>
          </div>
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
