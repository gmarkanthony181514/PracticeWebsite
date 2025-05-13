import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
//Importing Files
import App from "./AppFilesRouting/App";
import './index.css';
import { AppProvider } from "./Context/AppContext";
//Package Notification
import { Toaster } from 'react-hot-toast';
import "keen-slider/keen-slider.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <AppProvider>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
    </AppProvider>
  </BrowserRouter>
);
