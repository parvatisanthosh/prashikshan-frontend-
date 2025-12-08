import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from '../services/authService';

export default function MentorLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    if (!email.trim()) return "Enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "Enter a valid email address.";
    if (!password.trim()) return "Enter your password.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      console.log('🔵 Attempting mentor login...');
      
      // Call backend API
      const response = await authService.mentorLogin(email, password);
      
      console.log('✅ Login successful:', response);
      console.log('📦 Token saved:', !!localStorage.getItem('token'));
      console.log('👤 User saved:', !!localStorage.getItem('user'));
      
      const user = JSON.parse(localStorage.getItem('user'));
      console.log('🔑 User role:', user.role);
      
      // Force redirect using window.location
      console.log('🚀 Redirecting to mentor dashboard...');
      setTimeout(() => {
        window.location.href = '/mentordashboard';
      }, 100);

    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
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
                  required
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
                    required
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
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-lg shadow-blue-500/30 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
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