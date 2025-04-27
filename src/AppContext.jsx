import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companyName, setCompanyName] = useState("API Fake Store");
  const [username, setUsername] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);


  return (
    <AppContext.Provider
     value=
     {{
      companyName,
      setCompanyName,
      username,
      setUsername,
      cartItems,
      setCartItems,
      wishlistItems,
      setWishlistItems,
      }}>
      {children}
    </AppContext.Provider>
  );
};