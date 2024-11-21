
import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { useState, useEffect } from "react";
import axios from 'axios';


function AddItem() {
    const storedUserID = sessionStorage.getItem("userID");
    const [values, setValues] = useState({
        strItem: "",
        monPrice: "",
        intVendorID: storedUserID || ""
    });

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues((prev) => ({
            ...prev,
            [name]: value,
            intVendorID: storedUserID
        }));
        console.log(value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Form values before submission:", values);
        try {
            console.log('Sending request to server with value: ', values);
            const response = await axios.post(
              "http://localhost:5000/api/additem",
              values,
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("Server response:", response.data);
            if (response.data.success) {
                alert("Event added successfully");
            } else {
                alert(response.data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error details:", error);
            alert("Error adding event. Please try again.");
        }
      };

    return (
        <><Navbar/>
        <div className="container mx-auto px-4 py-8 gap-40">
            
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <div className="rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Add an item to menu</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Upload Section - Left Side */}
   
                {/* Form Fields - Right Side */}
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <input
                      type="text"
                      name="strItem"
                      value={values.strItem}
                      onChange={handleInput}
                      placeholder="Enter name of the item"
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Price</p>
                    <input
                      type="text"
                      name="monPrice"
                      value={values.monPrice}
                      onChange={handleInput}
                      placeholder="Enter price"
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full md:w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
      )
}

export default AddItem