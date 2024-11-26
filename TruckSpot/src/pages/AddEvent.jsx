import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import axios from "axios";
import { useState, useEffect } from "react";

const CreateEvent = () => {
  const storedUserID = sessionStorage.getItem("userID");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [values, setValues] = useState({
    strEventName: "",
    strDescription: "",
    intOrganizerID: storedUserID || "",
    dtDateOfEvent: "",
    dtSetUpTime: "",
    strLocation: "",
    intTotalSpaces: "",
    intExpectedGuests: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
      intOrganizerID: storedUserID,
    }));
    console.log(value);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    console.log("Form Values:", values);

    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    if (logoFile) {
      formData.append("logo", logoFile);
      console.log("Logo File:", {
        name: logoFile.name,
        size: logoFile.size,
        type: logoFile.type,
      });
    }

    for (let pair of formData.entries()) {
      console.log("FormData Entry:", pair[0], pair[1]);
    }

    console.log("Form values before submission:", values);
    try {
      console.log("Sending request to server...");
      const response = await axios.post(
        "http://localhost:5000/addevent",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Server response:", response.data);
      if (response.data.success) {
        alert("Event added successfully");
        console.log("Saved logo path:", response.data.data.strLogoFilePath);
      } else {
        alert(response.data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error details:", error);
      alert("Error adding event. Please try again.");
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
          <div className="rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Add an Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Upload Section - Left Side */}
                <div className="w-full md:w-1/4">
                  <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Event Logo Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-500">No logo selected</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="file-input file-input-bordered w-full"
                  />
                </div>

                {/* Form Fields - Right Side */}
                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Event Name</p>
                    <input
                      type="text"
                      name="strEventName"
                      value={values.strEventName}
                      onChange={handleInput}
                      placeholder="Enter event name"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <textarea
                      name="strDescription"
                      value={values.strDescription}
                      onChange={handleInput}
                      placeholder="Enter event description"
                      className="textarea textarea-bordered w-full h-24"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Event Date</p>
                      <input
                        type="datetime-local"
                        name="dtDateOfEvent"
                        value={values.dtDateOfEvent}
                        onChange={handleInput}
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">Setup Time</p>
                      <input
                        type="datetime-local"
                        name="dtSetUpTime"
                        value={values.dtSetUpTime}
                        onChange={handleInput}
                        className="input input-bordered w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <input
                      type="text"
                      name="strLocation"
                      value={values.strLocation}
                      onChange={handleInput}
                      placeholder="Enter location"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Total Spaces</p>
                      <input
                        type="number"
                        name="intTotalSpaces"
                        value={values.intTotalSpaces}
                        onChange={handleInput}
                        placeholder="Enter total spaces"
                        className="input input-bordered w-full"
                      />
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Expected Guests
                      </p>
                      <input
                        type="number"
                        name="intExpectedGuests"
                        value={values.intExpectedGuests}
                        onChange={handleInput}
                        placeholder="Enter expected guests"
                        className="input input-bordered w-full"
                      />
                    </div>
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
  );
};

function AddEvent() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <CreateEvent />
      </div>
    </>
  );
}

export default AddEvent;
