//using this is to manage and solve the error of cartItems and setCartItems
//duplication error happening just to run the add to cart.jsx situation
//Reason: because of Navigation situation from Navbar -> Marketpage & Productgrid => AddtoCart.jsx
//Wishlist is just for future idea


import React, { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  
  return (
    <AppContext.Provider
     value=
     {{
      cartItems,
      setCartItems,
      wishlistItems,
      setWishlistItems,
      }}>
      {children}
    </AppContext.Provider>
  );
};