import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'; // Ensure this import is present!
import { Toaster } from 'react-hot-toast';
import "keen-slider/keen-slider.min.css";
import { AppProvider } from "./AppContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <AppProvider>
    <App />
    <Toaster position="top-center" reverseOrder={false} />
    </AppProvider>
  </BrowserRouter>
);
