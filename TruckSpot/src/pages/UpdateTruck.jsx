import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateTruckForm = () => {
  const navigate = useNavigate();
  const storedUserID = sessionStorage.getItem("userID");
  const [cuisineTypes, setCuisineTypes] = useState([]);


  const [values, setValues] = useState({
    strTruckName: "",
    intCuisineTypeID: "",
    intVendorID: storedUserID || "",
    strOperatingLicense: ""
  });

  const [error, setError] = useState("");

  // Fetch existing truck data
  useEffect(() => {
    const fetchTruckData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/foodtruck", {
          params: {
            intVendorID: storedUserID
          }
        });
        if (response.data.success) {
          setValues({
            strTruckName: response.data.data.strTruckName || "",
            intCuisineTypeID: response.data.data.intCuisineTypeID || "",
            intVendorID: storedUserID,
            strOperatingLicense: response.data.data.strOperatingLicense || ""
          });
        }
      } catch (error) {
        console.error("Error fetching truck data:", error);
        setError("Failed to load truck data");
      }
    };

    fetchTruckData();
  }, [storedUserID]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/updatetruck",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.data.success) {
        alert("Truck updated successfully!");
        navigate("/trucks");
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error updating the truck:", err);
      if (err.response) {
        setError(err.response.data.message || "Server error occurred.");
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    }
  };

  return (
    <div className=" rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Update Truck</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Photo Section */}
        <div className="flex items-start gap-8">
          <div>
            <div className="w-48 h-64 bg-gray-200 rounded-lg mb-2 overflow-hidden">
              <img
                src="/placeholder-profile.jpg"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-10">
            <div>
              <p className="text-sm text-gray-500 mb-3">Truck Name</p>
              <input
                type="text"
                name="strTruckName"
                value={values.strTruckName}
                onChange={handleInput}
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs mb-5"
              />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-3">Type of Cuisine</p>
              <select
                name="intCuisineTypeID"
                value={values.intCuisineTypeID}
                onChange={handleInput}
                className="select select-bordered w-full max-w-xs mb-5"
              >
                <option value="" disabled>Select cuisine type</option>
                <option value="1">Italian</option>
                <option value="2">Mexican</option>
                <option value="3">American</option>
                <option value="4">Indian</option>
                <option value="5">Asian</option>
                <option value="6">Bakery/Desserts</option>
                <option value="7">Other</option>
              </select>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-3">Operating License</p>
              <input
                type="text"
                name="strOperatingLicense"
                value={values.strOperatingLicense}
                onChange={handleInput}
                placeholder="Type here"
                className="input input-bordered w-full max-w-xs"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit Button */}
        <div className="space-y-6">
          <button
            type="submit"
            className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

function UpdateTruck() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 gap-40">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <SideBar />
          </div>
          <div className="col-span-12 md:col-span-9">
            <UpdateTruckForm />
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateTruck;