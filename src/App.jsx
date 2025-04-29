//React Imports
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../tailwind.config.js';
//pureReactViteUI Imports
import LandingPage from "./pureReactViteUI/LandingPage"; 
import LogInRegister from "./pureReactViteUI/LogInRegister"; 
//Pages Import
import MarketPlace from "./pages/MarketPage";  
import NewsFeed from "./pages/NewsFeed";
import Viewaccount from "./pages/Viewaccount";
import Additem from "./pages/Additem";
import AddtoCart from "./pages/AddtoCart";
import Checkout from "./pages/Checkout";
import Carousel from "./CarouselDesign/Carousel";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/loginregister" element={<LogInRegister />} />
      <Route path="/marketplace" element={<MarketPlace />} />
      <Route path="/viewaccount" element={<Viewaccount />} />
      <Route path="/additem" element={<Additem />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/addtocart" element={<AddtoCart />} />
      <Route path="/newsfeed" element={<NewsFeed />} />
      <Route path="/carousel" element={<Carousel />} />
    </Routes>
  );

};

export default App;