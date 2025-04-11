import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
//Package Icons
import { Store, Search, ShoppingCart, User, Heart } from "lucide-react";
//Installed Notification
import { toast } from 'react-hot-toast';

const Navbar = ({ onSearch, cartItems = [], wishlistItems= [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  //Username Function
  useEffect(() => {
    try {
      const storedUsername = sessionStorage.getItem("username");
      if (storedUsername && typeof storedUsername === 'string') {
      setUsername(storedUsername);
      } else {
        throw new Error(" ⚠️ Invalid session data.")
      }
    } catch (error) {
      setUsername(null);
      toast.error(" ⚠️ Failed to retrieve your account please Sign in.")
    }
  }, []);

  //Search bar function
  const handleSearch = (query) => {
    try {
      setSearchQuery(query);
      onSearch(query);
    } catch (error) {
        toast.error(" ⚠️ There was an issue with your search. Please try again.");
    }
  };

  //Log out function
  const handleLogout = () => {
    try {
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("password");
      sessionStorage.removeItem("token");
      setUsername(null);
      toast.success(" 🎉 Logged out successfully.", {
        position: "top-center", 
        autoClose: 3000, // auto close after 3 seconds
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
      });
      navigate("/landingpage");
    } catch (error) {
        toast.error(" ⚠️ There was an issue logging you out. Please try again.")
    }
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
            <Link to="/landingpage" className="text-3xl flex items-center gap-2 font-mediu1m">
              <Store size='2rem' color="#029fae" /> 𝑭𝒂𝒌𝒆 𝑺𝒕𝒐𝒓𝒆
                </Link>
              </div>
            <div className="relative w-1/3">
              <input
                type="text"
                  placeholder="   Search products..."
                    className="w-full h-[44px] pl-6 pr-10 py-2 rounded-lg shadow-md"
                      value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                      />
                  <button 
                    className="absolute right-4 top-1/2 -translate-y-1/2" 
                      onClick={() => {
                    try {
                      handleSearch(searchQuery);
                        } catch (error) {
                          toast.error(" ⚠️ There was an issue with your search. Please try again.");
                        }
                      }}>
                  <Search size='22px' color="#272343" />
              </button>
           </div>
        <div className="relative">
          <Link to="/addtocart" className="relative flex items-center gap-2">
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
          <Link to="/wishlist" className="relative flex items-center gap-2">
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
              <Link to="/myaccount" className="block px-4 py-2 text-gray-700">View Account</Link>
            </li>
            <li className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100">
              <Link to="/additem" className="block px-4 py-2 text-gray-700">Add Item</Link>
            </li>
            <li className="p-2 hover:bg-red-100 cursor-pointer" onClick={handleLogout}>
              <button className="block w-full text-left px-4 py-2 text-red-500">Logout</button>
            </li>
            </>
            ) : (
              <li className="p-2 hover:bg-gray-100 cursor-pointer">
                <Link to="/loginregister" className="block px-4 py-2 text-gray-700">SIGN UP</Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  </div>
</div>
  );
    };
export default Navbar;
