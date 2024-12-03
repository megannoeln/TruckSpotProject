import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import { Link } from "react-router-dom";
import axios from "axios";
import UpdateUnitsModal from "../components/Modal/UpdateUnitsModal";

function FoodMenu() {
  const [foodItems, setFoodItems] = useState([
    {
      strItem: "",
      monPrice: "",
      strCategory: "",
    },
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");

  const fetchMenuDetails = async () => {
    const storeUserID = sessionStorage.getItem("userID");
    try {
      const response = await axios.get("http://localhost:5000/api/getitem", {
        params: {
          intVendorID: storeUserID,
        },
      });
      console.log("Received menu items:", response.data);
      if (response.data.success) {
        setFoodItems(response.data.data);
        console.log("FoodItem", foodItems);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    }
  };
  useEffect(() => {
    fetchMenuDetails();
  }, []);

  const categorizeItems = () => {
    return {
      Appetizer: foodItems.filter((item) => item.strCategory === "Appetizer"),
      Entree: foodItems.filter((item) => item.strCategory === "Entree"),
      Drink: foodItems.filter((item) => item.strCategory === "Drink"),
      Dessert: foodItems.filter((item) => item.strCategory === "Dessert"),
    };
  };

  const handleUpdateUnits = async (itemName, unitsSold) => {
    const userId = sessionStorage.getItem("userID");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/updateunits",
        {
          intVendorID: userId,
          strItem: itemName,
          intUnitsSold: unitsSold,
        }
      );
      if (response.data.success) {
        alert("Units updated successfully");
        fetchMenuDetails();
        setModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating units:", error);
      alert("Failed to update units");
    }
  };

  const CategoryBox = ({ title, items }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center mb-3 p-2 border-b"
          >
            <h3 className="font-medium">{item.strItem}</h3>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">${item.monPrice}</p>
              <button
                onClick={() => {
                  setSelectedItem(item.strItem);
                  setModalOpen(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(item.strItem)}
                className="text-red-500 hover:text-red-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No items available</p>
      )}
    </div>
  );

  const handleDelete = async (strItem) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const userID = sessionStorage.getItem("userID");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/deleteitem",
          {
            strItem: strItem,
            intVendorID: userID,
          }
        );
        if (response.data.success) {
          alert("Item deleted successfully");
          fetchMenuDetails();
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <SideBar />
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold mb-6">Menu</h1>
              <Link to="/additem">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                  Add Item
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(categorizeItems()).map(([category, items]) => (
                <CategoryBox
                  key={category}
                  title={category}
                  items={items}
                  onUpdate={handleUpdateUnits}
                />
              ))}
              <UpdateUnitsModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleUpdateUnits}
                itemName={selectedItem}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FoodMenu;
