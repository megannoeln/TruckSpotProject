import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { Link } from 'react-router-dom'
import axios from "axios";

function FoodMenu() {

    const [foodItems,setFoodItems] = useState([{
        strItem : "",
        monPrice : "",
        strCategory : ""
      }]);
    
      const fetchMenuDetails = async () => {
        const storeUserID = sessionStorage.getItem("userID");
        try{
          const response = await axios.get(
            "http://localhost:5000/api/getitem",
            {
              params: {
                intVendorID: storeUserID,
              }
            }
          );
          console.log("Received menu items:", response.data);
          if (response.data.success){
            setFoodItems(response.data.data);
            console.log("FoodItem", foodItems)
          }
        } catch (error)
        {
          console.error("Error details:" , {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config,
          })
        }
      }

      useEffect(() => {
        fetchMenuDetails();
      }, []);

      useEffect(() => {
        console.log("Current foodItems state:", foodItems);
    console.log("foodItems length:", foodItems.length);
    console.log("Is foodItems an array?", Array.isArray(foodItems));
      }, [foodItems]);


    return (
        <>
            <Navbar/>
                <div className="container mx-auto px-4 py-8 gap-40">
                    <div className="grid grid-cols-12 gap-8">
                    {/* Sidebar */}
                        <div className="col-span-12 md:col-span-3">
                            <SideBar/>
                        </div>
                        <div className="menu-container">
      <h2>Menu Items</h2>
      {foodItems && foodItems.length > 0 ? (
        <div className="menu-items">
          {foodItems.map((item, index) => (
            <div key={index} className="menu-item">
              <h1>{item.strCategory}</h1>
              <h3>{item.strItem}</h3>
              <p>Price: ${item.monPrice}</p>
              
            </div>
          ))}
        </div>
      ) : (
        <p>No menu items available</p>
      )}
    </div>
                        <Link to="/additem" >
                        <button className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Add Item
                  </button>
                  </Link>
                        </div>
                        
                </div>

        </>
      )
}

export default FoodMenu
