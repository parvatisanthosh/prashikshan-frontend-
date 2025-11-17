// StudentLoginCard.jsx
import React, { useState } from "react";
import {Link} from "react-router-dom";

/**
 * Props:
 * - onSignUpClick?: () => void   // optional callback for "Sign up instead"
 */
export default function StudentLoginCard({ onSignUpClick } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  function validate() {
    if (!email.trim()) return "Enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email.";
    if (!password.trim()) return "Enter your password.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError(null);

    alert("Login validated — backend will be connected later.");
  }

  function handleSignUp(e) {
    e.preventDefault();
    if (typeof onSignUpClick === "function") return onSignUpClick();

    window.location.hash = "#/signup"; // fallback
  }

  function handleForgotPassword() {
    alert("Forgot password flow will be added later.");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      {/* OUTER BIG CARD */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center items-center p-12 bg-white">
          <h1 className="text-7xl font-extrabold text-blue-600 leading-tight text-center">
            EduSphere
          </h1>
          <p className="mt-4 text-gray-600 text-lg font-medium text-center max-w-xs">
            Your Gateway to Internships & Skill Development
          </p>
        </div>

        {/* RIGHT SIDE — LOGIN CARD */}
        <div className="p-8 md:p-12 bg-white flex justify-center items-center">

          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Student Login
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="example@college.edu"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full border px-3 py-2 pr-12 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-3 text-sm text-gray-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Errors */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Sign In */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
              >
                Sign In
              </button>

              {/* Forgot password */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-gray-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign up instead */}
              <div className="mt-2 text-center">
                <Link to="/studentsignup">
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Don’t have an account?
                    <span className="text-blue-600 font-medium"> Sign up instead</span>
                  </button>
                </Link>

              </div>

            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
