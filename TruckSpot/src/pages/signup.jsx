import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Validation from "./SignupValidation";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

const SignUpForm = () => {
  // Fixed typo in firstname
  const [values, setValues] = useState({
    firstname: "", // Changed from fistname to firstname
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "", // New field added
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsLoading(true);
        setSubmitError("");

        const response = await axios.post(
          "http://localhost:5000/api/signup",
          values
        );

        console.log("Registration successful:", response.data);
        alert("Registration successful!"); // Change to login page after
      } catch (error) {
        console.error("Registration error:", error);
        setSubmitError(
          error.response?.data?.error ||
            "Registration failed. Please try again."
        );
      } finally {
        setIsLoading(false);
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
          {/* Loading and Error States */}
          {isLoading && (
            <div className="absolute top-4 right-4 text-yellow-400">
              Registering...
            </div>
          )}

          {submitError && (
            <div className="absolute top-4 right-4 text-red-500">
              {submitError}
            </div>
          )}
          {/* Form Start Here */}
          <form onSubmit={handleSubmit} class="max-w-lg w-full mx-auto">
            <div class="mb-12">
              <h3 class="text-3xl font-bold text-yellow-400">
                Create an account
              </h3>
            </div>

            <div>
              <label class="text-white text-xs block mb-2">First Name</label>
              <div class="relative flex items-center">
                <input
                  name="firstname"
                  type="text"
                  onChange={handleInput}
                  class="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter first name"
                />
              </div>
              {errors.firstname && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.firstname}
                </span>
              )}
            </div>

            <div class="mt-8">
              <label class="text-white text-xs block mb-2">Last Name</label>
              <div class="relative flex items-center">
                <input
                  name="lastname"
                  type="text"
                  onChange={handleInput}
                  class="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter last name"
                />
              </div>
              {errors.lastname && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.lastname}
                </span>
              )}
            </div>

            <div class="mt-8">
              <label class="text-white text-xs block mb-2">Phone Number</label>
              <div class="relative flex items-center">
                <input
                  name="phone"
                  type="text"
                  onChange={handleInput}
                  class="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter phone number"
                />
              </div>
              {errors.phone && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.phone}
                </span>
              )}
            </div>

            <div class="mt-8">
              <label class="text-white text-xs block mb-2">Email</label>
              <div class="relative flex items-center">
                <input
                  name="email"
                  type="text"
                  onChange={handleInput}
                  class="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter email"
                />
              </div>
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.email}
                </span>
              )}
            </div>

            <div class="mt-8">
              <label class="text-white text-xs block mb-2">Password</label>
              <div class="relative flex items-center">
                <input
                  name="password"
                  type="password"
                  onChange={handleInput}
                  class="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Enter password"
                />
              </div>
              {errors.password && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.password}
                </span>
              )}
            </div>

            <div class="mt-8">
              <label class="text-white text-xs block mb-2">
                Confirm Password
              </label>
              <div class="relative flex items-center">
                <input
                  name="confirmPassword"
                  type="password"
                  onChange={handleInput}
                  class="w-full bg-transparent text-sm text-white border-b border-gray-300 focus:border-yellow-400 px-2 py-3 outline-none"
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <div class="mt-12">
              <button
                type="submit"
                class="w-max shadow-xl py-3 px-6 text-sm text-gray-800 font-semibold rounded-md bg-transparent bg-yellow-400 hover:bg-yellow-500 focus:outline-none"
              >
                Register
              </button>
              <p class="text-sm text-white mt-8">
                Already have an account?{" "}
                <a
                  href="/login"
                  class="text-yellow-400 font-semibold hover:underline ml-1"
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
