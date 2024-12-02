import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

const EditEvent = () => {
  const location = useLocation();
  const eventId = location.pathname.split("/").pop();
  const storedUserID = sessionStorage.getItem("userID");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [values, setValues] = useState({
    strEventName: "",
    strDescription: "",
    intOrganizerID: storedUserID,
    dtDateOfEvent: "",
    timeOfEvent: "",
    strLocation: "",
    intTotalSpaces: "",
    intExpectedGuests: "",
    monPricePerSpace: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/updateevent/${eventId}`
        );
        const event = response.data;

        const eventDate = new Date(event.dtDateOfEvent);
        const date = eventDate.toISOString().split("T")[0];
        const time = eventDate.toTimeString().slice(0, 5);

        setValues({
          strEventName: event.strEventName,
          strDescription: event.strDescription,
          intOrganizerID: event.intOrganizerID,
          dtDateOfEvent: date,
          timeOfEvent: time,
          strLocation: event.strLocation,
          intTotalSpaces: event.intTotalSpaces,
          intExpectedGuests: event.intExpectedGuests,
          monPricePerSpace: event.monPricePerSpace,
        });

        if (event.strLogoFilePath) {
          setLogoPreview(`http://localhost:5000${event.strLogoFilePath}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
      intOrganizerID: storedUserID,
    }));
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    const eventDateTime =
      values.dtDateOfEvent && values.timeOfEvent
        ? `${values.dtDateOfEvent}T${values.timeOfEvent}`
        : null;

    const finalData = {
      ...values,
      dtDateOfEvent: eventDateTime,
    };

    Object.keys(finalData).forEach((key) => {
      if (key !== "timeOfEvent") {
        formData.append(key, finalData[key]);
      }
    });

    if (logoFile) {
      formData.append("logo", logoFile);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/updateevent/${eventId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        alert("Event updated successfully");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating event");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 gap-40">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-3">
          <SideBar />
        </div>

        <div className="col-span-12 md:col-span-9">
          <div className="rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Add an Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Upload Section */}
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

                {/* Form Fields */}
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Event Name</p>
                      <input
                        type="text"
                        name="strEventName"
                        value={values.strEventName}
                        onChange={handleInput}
                        placeholder="Enter event name"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Price Per Space
                      </p>
                      <input
                        type="number"
                        name="monPricePerSpace"
                        value={values.monPricePerSpace}
                        onChange={handleInput}
                        placeholder="Enter price per space"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Description</p>
                    <textarea
                      name="strDescription"
                      value={values.strDescription}
                      onChange={handleInput}
                      placeholder="Enter event description"
                      className="textarea textarea-bordered w-full h-24"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Event Date</p>
                      <input
                        type="date"
                        name="dtDateOfEvent"
                        value={values.dtDateOfEvent}
                        onChange={handleInput}
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Event Time</p>
                      <input
                        type="time"
                        name="timeOfEvent"
                        value={values.timeOfEvent}
                        onChange={handleInput}
                        className="input input-bordered w-full"
                        required
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
                      required
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
                        min="1"
                        required
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
                        min="1"
                        required
                      />
                    </div>
                  </div>

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

function UpdateEvent() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <EditEvent />
      </div>
    </>
  );
}

export default UpdateEvent;
