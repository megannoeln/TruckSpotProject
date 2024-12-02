import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import axios from "axios";

function UpdateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      console.log("Fetching user details...");
      try {
        const userID = sessionStorage.getItem("userID");
        const userType = sessionStorage.getItem("userType");

        console.log("userID:", userID);
        console.log("userType:", userType);

        if (!userID || !userType) {
          console.log("User session not found. Missing userID or userType.");
          setStatusMessage("User session not found.");
          return;
        }
        const endpoint = `http://localhost:5000/api/user-details?userID=${userID}&userType=${userType}`;
        const response = await axios.get(endpoint);

        if (response.data.success) {
          const { userName, phoneNumber, email } = response.data;
          const [firstName, lastName] = userName.split(" ");
          const formattedPhone = phoneNumber.replace(/-/g, ""); // Remove dashes

          setFormData({
            firstName: firstName || "",
            lastName: lastName || "",
            phone: formattedPhone || "",
            email: email || "",
          });

          console.log("User details loaded:", response.data);
        } else {
          console.log("API failed response:", response.data);
          setStatusMessage("Failed to load user details.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        setStatusMessage("An error occurred while loading user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName) {
      console.log("Validation failed: Missing firstName or lastName.");
      setStatusMessage("Please fill out all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      console.log("Validation failed: Invalid email address.");
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.phone.match(/^\d+$/)) {
      console.log(
        "Validation failed: Phone number contains non-numeric characters."
      );
      setStatusMessage("Phone number should contain only digits.");
      return;
    }

    console.log("Submitting form data:", formData);
    setStatusMessage("Submitting...");
    setLoading(true);

    try {
      const userID = sessionStorage.getItem("userID");
      const userType = sessionStorage.getItem("userType");

      console.log("Submitting with userID:", userID);
      console.log("Submitting with userType:", userType);

      const payload = {
        userID,
        userType,
        ...formData,
        phone: formData.phone.replace(/-/g, ""), // Ensure no dashes in phone
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        "http://localhost:5000/api/update-user",
        payload
      );

      console.log("API response:", response);

      if (response.data.success) {
        setStatusMessage("User updated successfully!");
        console.log("User update successful.");
      } else {
        console.log("API failed response:", response.data);
        setStatusMessage("Failed to update user: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      console.log("Error details:", error.response || error.message);
      setStatusMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 gap-40">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <SideBar />
          </div>
          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
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
                      <p className="text-sm text-gray-500 mb-1">First Name</p>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        required
                      />
                    </div>
                    <div>
                      <br></br>
                      <p className="text-sm text-gray-500 mb-1">Last Name</p>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Type here"
                        className="input input-bordered w-full max-w-xs"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold pt-4 mb-6">
                    Contact Details
                  </h2>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Type here"
                      className="input input-bordered w-full max-w-xs"
                      required
                    />
                  </div>
                  <br />
                  <button
                    type="submit"
                    className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
                </div>
              </form>
              {statusMessage && (
                <p
                  className={`mt-4 ${
                    loading ? "text-blue-500" : "text-red-500"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateAccount;
