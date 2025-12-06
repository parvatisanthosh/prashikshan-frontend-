import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
    ArrowLeftIcon, 
    ShieldCheckIcon,
    EnvelopeIcon,
    LockClosedIcon
} from '@heroicons/react/24/solid';

export default function AdminLoginPage() {
    const navigate = useNavigate();
    
    // --- Form State ---
    const [formData, setFormData] = useState({
        systemEmail: '',
        password: '',
    });
    
    // --- UI State ---
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic validation
        if (!formData.systemEmail || !formData.password) {
            setError('Please enter both system email and password.');
            setLoading(false);
            return;
        }
        
        // --- Login Logic Placeholder ---
        console.log('Attempting Admin Login with:', formData);
        
        // Simulation: Wait and either succeed or fail
        setTimeout(() => {
            if (formData.systemEmail === "admin@prashikshan.com" && formData.password === "Secure123!") { // Mock success condition
                console.log('Admin Login successful');
                // navigate('/admin/dashboard'); // Redirect to Admin dashboard
            } else {
                setError("Invalid system email or password. Access Denied.");
            }
            setLoading(false);
        }, 1500); 
    };
    
    // --- Render Helpers ---
    const InputLabel = ({ children }) => (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            {children}
        </label>
    );

    return (
        // 1. Background & Centering
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
            
            {/* 2. Card Container */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                
                {/* --- LEFT PANEL: Branding & Visuals (Admin Theme) --- */}
                <div className="hidden md:flex w-5/12 bg-gradient-to-br from-cyan-700 to-indigo-700 relative p-12 text-white">

                    {/* Center Content Wrapper */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">

                        <h1 className="text-4xl font-extrabold tracking-tight mb-3">
                            Prashikshan
                        </h1>

                        <p className="text-cyan-200 font-medium mb-10 text-lg">
                            System Control Panel Access.
                        </p>

                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <ShieldCheckIcon className="h-6 w-6" /> Administrator Login
                        </h3>

                        <p className="text-cyan-200 text-base font-light max-w-xs">
                            Access is restricted to approved credentials only.
                        </p>

                    </div>

                    {/* Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-cyan-300">
                        © 2025 Prashikshan Inc.
                    </div>

                </div>

                {/* --- RIGHT PANEL: Form Area --- */}
                <div className="w-full md:w-7/12 p-8 md:p-10 lg:p-12 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200">
                    
                    <div className="max-w-md mx-auto">
                        
                        {/* Back to Role Select */}
                        <div className="mb-4">
                            <button 
                                onClick={() => navigate('/roleselect')} 
                                className="text-slate-500 hover:text-cyan-700 transition-colors flex items-center text-sm font-medium"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                Back to Role Selection
                            </button>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign in to Admin Console</h2>
                        <p className="text-slate-500 mb-8">Enter the credentials emailed to you by the Super Admin.</p>

                        {/* Note: SSO remains disabled for Admin login */}
                        <div className="mb-8">
                            <p className="text-center text-sm text-slate-500 font-medium">Authentication via manual credentials only.</p>
                        </div>
                        
                        {/* Status Message */}
                        {error && (
                            <div className="p-3 rounded-xl text-sm font-medium text-center mb-5 bg-red-50 text-red-600">
                                {error}
                            </div>
                        )}


                        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                          
                          {/* System Email */}
                          <div>
                            <InputLabel>System Email</InputLabel>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                  name="systemEmail"
                                  type="email"
                                  value={formData.systemEmail}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3 transition-all"
                                  placeholder="admin@prashikshan.com"
                                />
                            </div>
                          </div>

                          {/* Password */}
                          <div>
                            <InputLabel>Password</InputLabel>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <LockClosedIcon className="w-4 h-4 text-slate-400" />
                                </div>
                                <input
                                  name="password"
                                  type={showPassword ? "text" : "password"}
                                  value={formData.password}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3 pr-16 transition-all"
                                  placeholder="Enter your master password"
                                />
                                {/* Styled Text Show/Hide Toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 bottom-0 px-4 text-xs font-bold text-cyan-600 hover:text-cyan-800 transition uppercase"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            <div className="flex justify-between mt-2">
                                <Link to="/adminsignup" className="text-xs font-medium text-slate-500 hover:text-cyan-600 hover:underline">
                                    Need Access? Request Registration
                                </Link>
                                <Link to="/forgot-password" className="text-xs font-medium text-slate-500 hover:text-cyan-600 hover:underline">
                                    Forgot Password?
                                </Link>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                       <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                       Authenticating...
                                    </span>
                                ) : "Sign In to Console"}
                            </button>
                          </div>

                          <div className="text-center">
                              <p className="text-sm text-slate-500">
                                  Having trouble? <Link to="/contact-support" className="text-cyan-700 font-bold hover:underline">
                                      Contact Support
                                  </Link>
                              </p>
                          </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}