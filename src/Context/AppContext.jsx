import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);

  return (
  <AppContext.Provider
     value= {{
        cartItems,
        setCartItems,
        wishlistItems,
        setWishlistItems,
      }}>
    {children}
  </AppContext.Provider>
  );
};