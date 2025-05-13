import { Route, Routes } from 'react-router-dom';
//Online Fonts Package
import '@fortawesome/fontawesome-free/css/all.min.css';
//Tailwind CSS
import '../../tailwind.config.js';
//StartingPage Folder
import LandingPage from "../StartingPage/LandingPage.jsx"; 
import LogInRegister from "../StartingPage/LogInRegister.jsx";
//StartingPage/StaringNavigation Folder
import MarketPlace from "../StartingPage/StartingNavigation/MarketPage.jsx"; 
import NewsFeed from "../StartingPage/StartingNavigation/NewsFeed.jsx";
//CarouselUIDesign Folder
import Carousel from "../CarouselUIDesign/Carousel.jsx";
//MarketplacePage Folder
import Checkout from "../MarketplacePage/Checkout.jsx";
//Navigation Folder
import Viewaccount from "../NavigationPage/ViewAccount.jsx";
import Additem from "../NavigationPage/AddingItem.jsx";
import AddtoCart from "../NavigationPage/AddtoCart.jsx";
//FooterPage Folder
import AboutUs from "../FooterPages/AboutUs.jsx";
import Contacts from "../FooterPages/Contact.jsx";
import PrivacyPolicy from "../FooterPages/PrivacyPolicy.jsx";

  const App = () => {
    return (
      <Routes>
        {/* Default Path */}
          <Route path="/" element={<LandingPage />} />
        {/* StartingPage Path */}
          <Route path="/landingpage" element={<LandingPage />} />
          <Route path="/loginregister" element={<LogInRegister />} />
        {/* StartingPage/StartingNavigation Path */}
          <Route path="/marketplace" element={<MarketPlace />} />
          <Route path="/newsfeed" element={<NewsFeed />} />
        {/* CarouselUIDesign Path */}
        <Route path="/carousel" element={<Carousel />} />
        {/* MarketplacePage Path */}
        <Route path="/checkout" element={<Checkout />} />
        {/* Navigation Path */}
        <Route path="/viewaccount" element={<Viewaccount />} />
        <Route path="/additem" element={<Additem />} />
        <Route path="/addtocart" element={<AddtoCart />} />
        {/* FooterPage Path */}
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/contact" element={<Contacts />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
      </Routes>
  );
};

export default App;