// StudentLoginCard.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Props:
 * - onSignUpClick?: () => void   // optional callback for "Sign up instead"
 */
export default function StudentLoginCard({ onSignUpClick } = {}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // --- Handlers & Validation ---

  function validate() {
    if (!email.trim()) return "Enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email address.";
    if (!password.trim()) return "Enter your password.";
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError(null);

    // This alert will only fire if validation passes.
    alert("Login validated — backend connection mock.");
  }

  function handleForgotPassword() {
    alert("Forgot password flow will be added later.");
  }
  
  // NOTE: I removed handleSignUp and replaced the button link with standard <Link to="/studentsignup">

  // --- Render ---

  return (
    // 1. Background & Centering (Updated to match signup background)
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
      
      {/* 2. Card Container (Updated styling) */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">

        {/* --- LEFT PANEL: Branding & Visuals (Copied from Signup) --- */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-indigo-700 to-indigo-500 relative p-12 text-white">

          {/* Center Content Wrapper */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">

            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                Prashikshan
            </h1>

            <p className="text-indigo-100 font-medium mb-10 text-lg">
                Your Gateway to Internships & Skill Development
            </p>

            <h3 className="text-xl font-bold text-white mb-1">
                Welcome Back!
            </h3>

            <p className="text-indigo-200 text-base font-light max-w-xs">
                Continue your career journey where you left off.
            </p>

          </div>

          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-indigo-300">
              © 2025 Prashikshan Inc.
          </div>

        </div>

        {/* --- RIGHT SIDE — LOGIN FORM --- */}
        <div className="w-full md:w-7/12 p-8 md:p-10 lg:p-12 bg-white flex justify-center items-center">

          <div className="w-full max-w-sm"> {/* Reduced max-width for better centering */}
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
              Student Login
            </h2>
            <p className="text-slate-500 mb-8 text-center">
                Sign in to access your dashboard.
            </p>
            
            {/* Social Logins: Added standard social login buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <a
                    href="[YOUR_GOOGLE_AUTH_URL]" // Placeholder
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                </a>
                <a 
                    href="[YOUR_MICROSOFT_AUTH_URL]" // Placeholder
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <svg className="w-5 h-5 text-[#00a4ef]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>
                    Microsoft
                </a>
            </div>

            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase font-semibold">Or log in with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 transition-all"
                  placeholder="example@college.edu"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block p-3 pr-16 transition-all"
                    placeholder="Enter password"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-0 top-0 bottom-0 px-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition uppercase"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Forgot password and Error */}
              <div className="flex justify-between items-center pt-1">
                  {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                  
                  {/* Keep "Forgot Password" to the right if there's no error */}
                  {!error && (
                      <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition ml-auto"
                      >
                          Forgot password?
                      </button>
                  )}
              </div>
              {error && (
                  <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline transition"
                  >
                      Forgot password?
                  </button>
              )}


              {/* Sign In Button */}
              {/* NOTE: We removed the outer <Link> tag around the button, as submitting the form should handle the logic/redirection after success. */}
              {/* For temporary front-end routing without proper auth, we wrap the button's behavior. */}
              
              <button
                // type="submit"
                // onClick={(e) => {
                //     e.preventDefault();
                //     // If validation passes (or we skip it for demo), navigate
                //     if (!validate()) { 
                //        // In a real app, this is where you'd call the API and on success, redirect.
                //        alert("Login validated — backend connection mock. Redirecting to Dashboard.");
                //        window.location.hash = "#/studentdashboard"; // Simple hash redirect for demo
                //        // Or if using React Router DOM: navigate('/studentdashboard');
                //     } else {
                //        // Run the validation check
                //        handleSubmit(e);
                //     }
                // }}
                link to="/studentdashboard" // Temporary front-end routing
                className="w-full bg-indigo-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] hover:bg-indigo-700 mt-2"
              >
                Sign In
              </button>
              
              {/* Sign up instead */}
              <div className="mt-6 text-center pt-2">
                <Link to="/studentsignup" className="text-sm text-slate-500">
                    Don’t have an account?
                    <span className="text-indigo-600 font-bold hover:underline ml-1">
                        Sign up instead
                    </span>
                </Link>
              </div>


            </form>
          </div>
        </div>
      </div>
    </div>
  );
}