//This file is for training purpose, future idea will be added

import { useEffect, useState } from "react";
import { API_BACKENDAPI_URL, API_FAKESTORE_URL } from '../../BackendConnector/apiRoutes';

const Sidebar = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_FAKESTORE_URL}/products`);
        const data = await response.json();

        // Extract unique categories
        const uniqueCategories = [...new Set(data.map((product) => product.category))];

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
      <div
        className="fixed left-0 top-0 h-full z-50 transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >

        
      {/* Sidebar */}

          <aside
              className={`bg-gray-200 h-screen p-4 shadow-2xl border-r border-gray-400 transition-all duration-500 ease-in-out overflow-y-auto z-50 ${
                isSidebarOpen ? "w-64" : "w-20"
              }`}
          >

          <h2 className={`text-lg font-semibold text-gray-800 mb-4 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0"}`}>
            Category Items
          </h2>
          <ul>
            <li
              className="p-3 hover:bg-gray-500 text-gray-900 font-semibold text-lg cursor-pointer rounded-md transition-all duration-300"
              onClick={() => onCategorySelect(null)}
            >
              All
            </li>
            {categories.map((category, index) => (
              <li
                key={index}
                className="p-3 hover:bg-gray-500 text-gray-900 font-semibold text-lg cursor-pointer capitalize rounded-md transition-all duration-300"
                onClick={() => onCategorySelect(category)}
              >
                {category}
              </li>
            ))}
          </ul>

        </aside>


      {/* Invisible hover area to trigger sidebar */}
      <div className="w-3 h-screen bg-transparent absolute left-0 top-0"></div>
    </div>
  );
};

export default Sidebar;
