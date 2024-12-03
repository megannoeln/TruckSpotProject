import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateTruck = () => {
  const navigate = useNavigate();
  const storedUserID = sessionStorage.getItem("userID");

  const [values, setValues] = useState({
    strTruckName: "",
    intCuisineTypeID: "",
    intVendorID: storedUserID || "",
    strOperatingLicense: ""
  });

  const [error, setError] = useState("");

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
      intVendorID: storedUserID,
    }));
    console.log(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Clear previous error

    console.log("Form values before submission:", values);
    try {
      const response = await axios.post(
        "http://localhost:5000/addtruck",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Server response:", response.data);
      if (response.data.success) {
        alert("Truck added successfully!");
        navigate("/trucks"); // Redirect to Truck List page afterwards
        console.log("4. API Response:", response.data);
      } else {
        setError(response.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Error submitting the form:", err);
      if (err.response) {
        setError(err.response.data.message || "Server error occurred.");
      } else {
        setError("Unable to connect to the server. Please try again.");
      }
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 gap-40">
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <SideBar />
        </div>
        {/* Main Content */}
        <div className="col-span-12 md:col-span-9">
          <div className=" rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Add a truck</h2>
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
                    <p className="text-sm text-gray-500 mb-3">
                      Type of Cuisine
                    </p>
                    <select
                      name="intCuisineTypeID"
                      value={values.intCuisineTypeID}
                      onChange={handleInput}
                      className="select select-bordered w-full max-w-xs mb-5"
                    >
                      <option value="" disabled>
                        Select cuisine type
                      </option>
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
                      name="strTruckName"
                      value={values.operatingLicense}
                      onChange={handleInput}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Details Grid */}
              <div className="space-y-6">
                <button
                  type="submit"
                  className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

function AddTruck() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <CreateTruck />
      </div>
    </>
  );
}

export default AddTruck;
