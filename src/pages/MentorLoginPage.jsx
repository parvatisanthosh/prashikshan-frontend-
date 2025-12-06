import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function MentorLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

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
    
    // Mock login - Navigate to mentor dashboard
    navigate("/mentordashboard");
  }

  function handleForgotPassword() {
    alert("Forgot password flow will be added later.");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[500px]">

        {/* LEFT PANEL: Branding */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-blue-700 to-blue-500 relative p-12 text-white">

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">

            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                Prashikshan
            </h1>

            <p className="text-blue-100 font-medium mb-10 text-lg">
                Empowering Students Through Mentorship
            </p>

            <h3 className="text-xl font-bold text-white mb-1">
                Welcome Back, Mentor!
            </h3>

            <p className="text-blue-200 text-base font-light max-w-xs">
                Continue guiding students on their career journey.
            </p>

          </div>

          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-blue-300">
              © 2025 Prashikshan Inc.
          </div>

        </div>

        {/* RIGHT SIDE — LOGIN FORM */}
        <div className="w-full md:w-7/12 p-8 md:p-10 lg:p-12 bg-white flex justify-center items-center">

          <div className="w-full max-w-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">
              Mentor Login
            </h2>
            <p className="text-slate-500 mb-8 text-center">
                Sign in to access your mentor dashboard.
            </p>
            
            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <svg className="w-5 h-5 text-[#00a4ef]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>
                    Microsoft
                </button>
            </div>

            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-slate-400 text-xs uppercase">or continue with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900"
                  placeholder="you@mentor.com"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link to="/mentorsignup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up
              </Link>
            </p>

            {/* Back to Home */}
            <p className="mt-4 text-center text-xs text-slate-500">
              <Link to="/" className="hover:text-blue-600">
                ← Back to Home
              </Link>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

