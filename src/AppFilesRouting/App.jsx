import { Route, Routes } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../tailwind.config.js';
//Starting Page
import LandingPage from "../StartingPage/LandingPage.jsx"; 
import LogInRegister from "../StartingPage/LogInRegister.jsx"; 
import MarketPlace from "../StartingPage/StartingNavigation/MarketPage.jsx"; 
import NewsFeed from "../StartingPage/StartingNavigation/NewsFeed.jsx";
//Carousel UI Design (NO API)
import Carousel from "../CarouselUIDesign/Carousel.jsx";
//Marketplace Page
import Checkout from "../MarketplacePage/Checkout.jsx";
//Navigation Page
import Viewaccount from "../Navigation/ViewAccount.jsx";
import Additem from "../Navigation/AddingItem.jsx";
import AddtoCart from "../Navigation/AddtoCart.jsx";
//Footer Page
import AboutUs from "../FooterPages/AboutUs.jsx";
import Contact from "../FooterPages/Contact.jsx";
import PrivacyPolicy from "../FooterPages/PrivacyPolicy.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landingpage" element={<LandingPage />} />
      <Route path="/loginregister" element={<LogInRegister />} />
      <Route path="/marketplace" element={<MarketPlace />} />
      <Route path="/newsfeed" element={<NewsFeed />} />
      <Route path="/carousel" element={<Carousel />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/viewaccount" element={<Viewaccount />} />
      <Route path="/additem" element={<Additem />} />
      <Route path="/addtocart" element={<AddtoCart />} />
      <Route path="/aboutus" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacypolicy" element={<PrivacyPolicy />} />
    </Routes>
  );
};

export default App;