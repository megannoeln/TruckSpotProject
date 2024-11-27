import React, { useState, useEffect } from "react";
import axios from "axios";

const MenuCategoryCard = ({ title, items }) => (
  <div className="bg-white p-4 rounded-lg shadow border">
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    {items.length > 0 ? (
      items.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center mb-2 p-2 border-b last:border-0"
        >
          <span className="font-medium">{item.strItem}</span>
          <span className="text-gray-600">${item.monPrice}</span>
        </div>
      ))
    ) : (
      <p className="text-gray-500 text-sm">No items available</p>
    )}
  </div>
);

const VendorProfileModal = ({ vendor, onClose, show }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState(null);
  const [hasMenu, setHasMenu] = useState(true);

  useEffect(() => {
    if (!show) {
      setMenuItems([]);
      setError(null);
      setHasMenu(true);
    }
  }, [show]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      if (vendor && show) {
        setError(null);
        setHasMenu(true);

        try {
          const response = await axios.get(
            "http://localhost:5000/api/getitem",
            {
              params: {
                intVendorID: vendor.intVendorID,
              },
            }
          );

          if (response.data.success) {
            setMenuItems(response.data.data);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            setHasMenu(false);
          } else {
            setError("An error occurred while loading the menu");
          }
        }
      }
    };

    fetchMenuItems();
  }, [vendor, show]);

  const categorizedItems = {
    Appetizer: menuItems.filter((item) => item.strCategory === "Appetizer"),
    Entree: menuItems.filter((item) => item.strCategory === "Entree"),
    Dessert: menuItems.filter((item) => item.strCategory === "Dessert"),
    Drink: menuItems.filter((item) => item.strCategory === "Drink"),
  };

  if (!show || !vendor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-50 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {vendor.FoodTruckName}
            </h2>
            <p className="text-gray-600 mt-1">Vendor: {vendor.VendorName}</p>
            <p className="text-gray-600">Cuisine Type: {vendor.FoodType}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Contact Information
            </h3>
            <div className="space-y-1 text-gray-600">
              <p>Phone: {vendor.VendorPhone}</p>
              <p>Email: {vendor.VendorEmail}</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Menu</h3>
            {error ? (
              <div className="text-center py-4 text-red-600">{error}</div>
            ) : !hasMenu ? (
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-gray-600">
                  This vendor hasn't added any menu items yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(categorizedItems).map(([category, items]) => (
                  <MenuCategoryCard
                    key={category}
                    title={category}
                    items={items}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfileModal;
