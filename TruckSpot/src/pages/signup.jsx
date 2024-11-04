import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";
import Validation from "./SignupValidation";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const SignUpForm = () => {
  const [values, setValues] = useState({
    strFirstName: "",
    strLastName: "",
    strEmail: "",
    strPhone: "",
    strPassword: "",
    confirmPassword: "",
    accountType: ""
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    console.log("Form values before submission:", values);
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/signup",
          values,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Server response:", response.data);
        if (response.data.success) {
          alert("Registration successful! Redirecting to Login..."); // Change to login page after
          // Navigate to Login Page on Success
          window.location.href = '/login';
        } else {
          alert(response.data.message || "Something went wrong");
        }
      } catch (error) {
        console.error("Error details:", error);
        if (error.response) {
          // Server responded with error
          console.log("Error response:", error.response.data);
          alert(error.response.data.message || "Server error occurred");
        } else if (error.request) {
          // Request made but no response
          console.log("No response received");
          alert("No response from server. Please try again.");
        } else {
          // Error in request setup
          console.log("Error setting up request:", error.message);
          alert("Error setting up request. Please try again.");
        }

      }
    }
  };

  return (
    
    <div className="font-[sans-serif] bg-white md:h-screen">
      <div className="grid md:grid-cols-2 items-center gap-8 h-full">
        <div className="max-md:order-1 p-4">
          <img
            src="https://readymadeui.com/signin-image.webp"
            className="lg:max-w-[85%] w-full h-full object-contain block mx-auto"
            alt="login-image"
          />
        </div>

        <div className="flex items-center md:p-8 p-6 bg-[#0C172C] h-full lg:w-11/12 lg:ml-auto">
          {/* Form Start Here */}
          <form onSubmit={handleSubmit} className="max-w-lg w-full mx-auto">
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-yellow-400">
                Create an account
              </h3>
            </div>

            {/* Radio */}
            <div className="mt-8 mb-2">
            <label className="text-white text-xs block mb-2">Account Type</label>
            <div className="flex gap-6 mt-2">
            <div className="flex items-center">
              <input
                type="radio"
                name="accountType"
                value="vendor"
                id="vendor"
                onChange={handleInput}
                className="w-4 h-4 text-yellow-400 bg-transparent border-gray-300 focus:ring-yellow-400"
              />
              <label htmlFor="vendor" className="text-white text-sm ml-2">
                Vendor
              </label>
            </div>
    
            <div className="flex items-center mb-2">
              <input
                type="radio"
                name="accountType"
                value="organizer"
                id="organizer"
                onChange={handleInput}
                className="w-4 h-4 text-yellow-400 bg-transparent border-gray-300 focus:ring-yellow-400"
              />
              <label htmlFor="organizer" className="text-white text-sm ml-2">
                Organizer
              </label>
            </div>
          </div>
        </div>
            <div>
              <label className="text-white text-xs block mb-2">
                First Name
              </label>
              <div className="relative flex items-center">
                <input
                  name="strFirstName"
                  type="text"
                  onChange={handleInput}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter first name"
                />
              </div>
              {errors.firstname && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.firstname}
                </span>
              )}
            </div>

            <div className="mt-8">
              <label className="text-white text-xs block mb-2">Last Name</label>
              <div className="relative flex items-center">
                <input
                  name="strLastName"
                  type="text"
                  onChange={handleInput}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter last name"
                />
              </div>
              {errors.lastname && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.lastname}
                </span>
              )}
            </div>

            <div className="mt-8">
              <label className="text-white text-xs block mb-2">
                Phone Number
              </label>
              <div className="relative flex items-center">
                <input
                  name="strPhone"
                  type="text"
                  onChange={handleInput}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="mt-8">
              <label className="text-white text-xs block mb-2">Email</label>
              <div className="relative flex items-center">
                <input
                  name="strEmail"
                  type="text"
                  onChange={handleInput}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter email"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="mt-8">
              <label className="text-white text-xs block mb-2">Password</label>
              <div className="relative flex items-center">
                <input
                  name="strPassword"
                  type="password"
                  onChange={handleInput}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="mt-8">
              <label className="text-white text-xs block mb-2">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <input
                  name="confirmPassword"
                  type="password"
                  onChange={handleInput}
                  className="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div className="mt-12">
              <button
                type="submit"
                className="w-max shadow-xl py-3 px-6 text-sm text-gray-800 font-semibold rounded-md bg-transparent bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Register
              </button>
              <p className="text-sm text-white mt-8">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-yellow-400 font-semibold hover:underline ml-1"
                >
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

function Signup() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <SignUpForm />
      </div>
    </>
  );
}

export default Signup;
