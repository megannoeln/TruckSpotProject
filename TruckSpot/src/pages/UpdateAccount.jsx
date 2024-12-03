import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function UpdateAccount() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    selectedAvatar: 0,
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const avatars = [
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sophie`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Alex`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Luna`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Max`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Zoe`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Mia`,
    `https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sam`,
  ];

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userID = sessionStorage.getItem("userID");
        const userType = sessionStorage.getItem("userType");

        if (!userID || !userType) {
          setStatusMessage("User session not found.");
          return;
        }
        const endpoint = `http://localhost:5000/api/user-details?userID=${userID}&userType=${userType}`;
        const response = await axios.get(endpoint);

        if (response.data.success) {
          const { userName, phoneNumber, email, strPictureFilePath } =
            response.data;
          const [firstName, lastName] = userName.split(" ");
          const formattedPhone = phoneNumber.replace(/-/g, "");
          const avatarIndex = avatars.findIndex(
            (avatar) => avatar === strPictureFilePath
          );

          setFormData({
            firstName: firstName || "",
            lastName: lastName || "",
            phone: formattedPhone || "",
            email: email || "",
            selectedAvatar: avatarIndex !== -1 ? avatarIndex : 0,
          });
        } else {
          setStatusMessage("Failed to load user details.");
        }
      } catch (error) {
        console.error("Error details:", error);
        setStatusMessage("An error occurred while loading user details.");
      }
    };

    fetchUserDetails();
  }, []);

  const handleAvatarSelect = (index) => {
    setFormData((prev) => ({ ...prev, selectedAvatar: index }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) {
      setStatusMessage("Please fill out all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setStatusMessage("Please enter a valid email address.");
      return;
    }

    if (!formData.phone.match(/^\d+$/)) {
      setStatusMessage("Phone number should contain only digits.");
      return;
    }

    setStatusMessage("Submitting...");
    setLoading(true);

    try {
      const userID = sessionStorage.getItem("userID");
      const userType = sessionStorage.getItem("userType");

      const payload = {
        userID,
        userType,
        ...formData,
        avatarUrl: avatars[formData.selectedAvatar],
        phone: formData.phone.replace(/-/g, ""),
      };

      const response = await axios.post(
        "http://localhost:5000/api/update-user",
        payload
      );

      if (response.data.success) {
        setStatusMessage("User updated successfully!");
        navigate("/myaccount");
      } else {
        setStatusMessage("Failed to update user: " + response.data.message);
      }
    } catch (error) {
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
      <div className="min-h-screen text-gray-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-3">
              <SideBar />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-100">
                  Personal Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="flex gap-8">
                    <div>
                      <div className="w-32 h-32 rounded-lg overflow-hidden">
                        <img
                          src={avatars[formData.selectedAvatar]}
                          alt="Selected Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-4">
                        {avatars.map((avatar, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAvatarSelect(index)}
                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                              formData.selectedAvatar === index
                                ? "border-blue-500"
                                : "border-gray-600"
                            }`}
                          >
                            <img
                              src={avatar}
                              alt={`Avatar ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 flex-1 max-w-sm">
                      <div>
                        <label className="text-sm text-gray-400">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full border border-gray-700 rounded-lg px-3 py-1 mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full border border-gray-700 rounded-lg px-3 py-1 mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full border border-gray-700 rounded-lg px-3 py-1 mt-1"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full border border-gray-700 rounded-lg px-3 py-1 mt-1"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-500 text-white px-6 py-1.5 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </button>
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
      </div>
    </>
  );
}

export default UpdateAccount;
