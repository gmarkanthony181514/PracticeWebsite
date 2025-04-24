import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [companyName, setCompanyName] = useState("API Fake Store");
  const [username, setUsername] = useState(null); // Add username state
  const [cartItems, setCartItems] = useState([]); // Add cartItems state
  const [wishlistItems, setWishlistItems] = useState([]); // Add wishlistItems state


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