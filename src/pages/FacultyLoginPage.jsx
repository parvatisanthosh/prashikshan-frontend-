import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcademicCapIcon, KeyIcon, ArrowLeftIcon, UserCircleIcon, AcademicCapIcon as CollegeIcon } from '@heroicons/react/24/solid';

export default function FacultyLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facultyIdentifier: '', // Can be ID or Email
    password: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation placeholder
    if (!formData.facultyIdentifier || !formData.password) {
      setError('Please enter both your Faculty ID/Email and Password.');
      return;
    }

    // --- Authentication Logic Placeholder ---
    console.log('Attempting Faculty Login with:', formData);
    
    // Simulate successful login and redirect to the Faculty Dashboard
    navigate('/faculty/dashboard'); 
  };

  const handleSocialLogin = (platform) => {
    console.log(`Logging in via ${platform}`);
    // Placeholder for actual SSO/Social login logic
    setError(`Please set up institutional login for ${platform}. Using email/password for now.`);
  };

  // Google SVG Icon for reliable rendering
  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M44 24C44 27.561 43.141 30.938 41.517 33.911L33.743 27.994L31.393 25.962C30.638 25.32 29.822 24.811 28.981 24.577C27.97 24.28 26.96 24.18 26 24.18C25.04 24.18 24.03 24.28 23.019 24.577C22.178 24.811 21.362 25.32 20.607 25.962L18.257 27.994L10.483 33.911C8.859 30.938 8 27.561 8 24C8 13.912 16.912 5 28 5C33.473 5 38.293 7.039 41.83 10.457L35.794 16.493C33.344 14.197 30.73 13 28 13C22.477 13 18.064 17.066 18.064 24C18.064 30.934 22.477 35 28 35C31.545 35 34.025 33.64 35.253 32.484C36.48 31.328 37.28 29.742 37.28 28.025V24H26V21H44V24Z" fill="#EA4335"/>
      <path d="M8 24C8 27.561 8.859 30.938 10.483 33.911L18.257 27.994L20.607 25.962C21.362 25.32 22.178 24.811 23.019 24.577C24.03 24.28 25.04 24.18 26 24.18C26.96 24.18 27.97 24.28 28.981 24.577C29.822 24.811 30.638 25.32 31.393 25.962L33.743 27.994L41.517 33.911C43.141 30.938 44 27.561 44 24H26V21H44V24Z" fill="#4285F4"/>
      <path d="M41.83 10.457C38.293 7.039 33.473 5 28 5C16.912 5 8 13.912 8 24C8 34.088 16.912 43 28 43C33.473 43 38.293 40.961 41.83 37.543L35.794 31.507C33.344 33.803 30.73 35 28 35C22.477 35 18.064 30.934 18.064 24C18.064 17.066 22.477 13 28 13C30.73 13 33.344 14.197 35.794 16.493L41.83 10.457Z" fill="#FBBC04"/>
      <path d="M10.483 33.911C12.33 37.28 15.05 39.92 18.423 41.67L24.459 35.634C22.009 34.209 19.823 32.228 18.257 27.994L10.483 33.911Z" fill="#34A853"/>
    </svg>
  );

  // Microsoft Icon (simplified square)
  const MicrosoftIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="10" height="10" fill="#F25022"/>
      <rect x="12" y="2" width="10" height="10" fill="#7FBA00"/>
      <rect x="2" y="12" width="10" height="10" fill="#00A4EF"/>
      <rect x="12" y="12" width="10" height="10" fill="#FFB900"/>
    </svg>
  );

  return (
    // Main Container: Full viewport height, flex center, white background
    // Added sm:p-6 to keep padding on larger screens but tighter p-4 on mobile
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      
      {/* Two-Column Card Container */}
      {/* Set max-w-lg on mobile, max-w-4xl on desktop for better fit */}
      <div className="w-full max-w-lg md:max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
        
        {/* Left Column: Branding/Welcome (Gradient Sidebar) */}
        {/* Adjusted py-8 for mobile to be less tall than py-12 on desktop */}
        <div className="md:w-1/3 bg-gradient-to-br from-indigo-700 to-fuchsia-600 p-8 text-white flex flex-col justify-between">
          <div className="text-3xl font-extrabold mb-8">
            Prashikshan
          </div>
          {/* Adjusted padding: py-8 on mobile, py-12 on desktop */}
          <div className="py-8 md:py-12"> 
            <h2 className="text-3xl font-bold mb-3">
              Welcome Back!
            </h2>
            <p className="text-indigo-100/80 text-lg">
              Faculty Portal for managing students, courses, and internships.
            </p>
          </div>
          <div className="text-xs text-indigo-100/50">
            © 2025 Prashikshan Inc.
          </div>
        </div>

        {/* Right Column: Login Form */}
        {/* Adjusted padding: p-6 on mobile, sm:p-12 on desktop */}
        <div className="md:w-2/3 p-6 sm:p-12 flex flex-col justify-center">

          {/* Back Button */}
          <div className="mb-4">
            <button 
              onClick={() => navigate('/roleselect')} 
              className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center text-sm font-medium"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
              Back to Role Selection
            </button>
          </div>

          {/* Institutional Branding and Title */}
          <div className="flex items-center mb-2">
            {/* Mock Institution Logo */}
            <CollegeIcon className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              Faculty Login
            </h1>
          </div>
          
          <p className="text-gray-500 text-md mb-6">
            Sign in with your institutional credentials to access the dashboard.
          </p>

          {/* Social/Institutional Login Buttons */}
          {/* Reduced space-x to space-x-3 on mobile */}
          <div className="flex space-x-3 sm:space-x-4 mb-6">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition"
            >
              <GoogleIcon />
              Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Microsoft')}
              className="flex-1 flex items-center justify-center py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 transition"
            >
              <MicrosoftIcon />
              Microsoft
            </button>
          </div>

          {/* OR Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OR LOGIN WITH EMAIL</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Faculty Identifier (ID or Email) */}
            <div>
              <label 
                htmlFor="facultyIdentifier" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Faculty ID or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserCircleIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="facultyIdentifier"
                  name="facultyIdentifier"
                  type="text"
                  required
                  value={formData.facultyIdentifier}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                             focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-base"
                  placeholder="name@college.edu"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyIcon className="w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-20 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 
                             focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 text-base"
                  placeholder="••••••••"
                />
                 <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
              </div>
            </div>
            
            {/* Forgot Password Link */}
            <div className="text-right">
              <button 
                  type="button"
                  onClick={() => console.log("Forgot password clicked")}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot Password?
              </button>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200 active:scale-[0.99] mt-6"
            >
              Sign In
            </button>
          </form>

          {/* New Faculty Sign Up Option */}
          <div className="text-center mt-8 text-sm">
            <p className="text-gray-500">
              New faculty member? 
              <button 
                type="button"
                // Assuming a route /facultysignup will be created
                onClick={() => navigate('/facultysignup')} 
                className="ml-1 font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}