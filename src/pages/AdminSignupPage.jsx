import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
    ArrowLeftIcon, 
    UserCircleIcon, 
    ShieldCheckIcon,
    EnvelopeIcon,
    BuildingOffice2Icon,
    PhoneIcon
} from '@heroicons/react/24/solid';

// --- Authorization URLs (Unchanged) ---
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?...`
const MICROSOFT_AUTH_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...`

// --- Admin-Specific Fields ---
const ADMIN_ORGANIZATION = "Prashikshan Platform Management";


export default function AdminSignupPage() {
    const navigate = useNavigate();
    
    // --- Form State: Password and OrganizationCode fields REMOVED ---
    const [formData, setFormData] = useState({
        adminName: '',
        systemEmail: '',
        phoneCode: '+91',
        phoneNumber: '',
        justification: '', // New field for request justification
    });
    
    // --- UI State ---
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (success) setSuccess(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        // Basic Check
        if (!formData.adminName || !formData.systemEmail || !formData.justification) {
            setError('Please fill in all required fields, including justification for access.');
            setLoading(false);
            return;
        }

        // --- REQUEST SUBMISSION Logic ---
        console.log('Admin Access Request SUBMITTED:', {
            ...formData,
            status: 'Pending Review',
        });
        
        // Simulation: Wait, then confirm request submission
        setTimeout(() => {
            setSuccess(true);
            setLoading(false);
            
            // Do NOT automatically redirect to login. The user must wait for an email.
            // A redirect can be added after a delay only if the app has a dedicated 'waiting' page.

        }, 2000); 
    };
    
    // --- Render Helpers ---
    const InputLabel = ({ children }) => (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
            {children}
        </label>
    );
        
    // Google/Microsoft Icons (Unchanged)
    const GoogleIcon = () => (
        <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
    );

    const MicrosoftIcon = () => (
        <svg className="w-5 h-5 text-[#00a4ef]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                
                {/* --- LEFT PANEL: Branding & Visuals (Admin Theme) --- */}
                <div className="hidden md:flex w-5/12 bg-gradient-to-br from-cyan-700 to-indigo-700 relative p-12 text-white">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">
                        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Prashikshan</h1>
                        <p className="text-cyan-200 font-medium mb-10 text-lg">System Control Panel Access.</p>
                        <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                            <ShieldCheckIcon className="h-6 w-6" /> Admin Access Request
                        </h3>
                        <p className="text-cyan-200 text-base font-light max-w-xs">
                            Secure access required to manage platform-level configurations.
                        </p>
                    </div>
                    {/* Background Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                        <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                    </div>
                    <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-cyan-300">
                        © 2025 Prashikshan Inc.
                    </div>
                </div>

                {/* --- RIGHT PANEL: Form Area --- */}
                <div className="w-full md:w-7/12 p-8 md:p-10 lg:p-12 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200">
                    
                    <div className="max-w-md mx-auto">
                        
                        <div className="mb-4">
                            <button 
                                onClick={() => navigate('/roleselect')} 
                                className="text-slate-500 hover:text-cyan-700 transition-colors flex items-center text-sm font-medium"
                            >
                                <ArrowLeftIcon className="w-4 h-4 mr-1" />
                                Back to Role Selection
                            </button>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request System Administrator Access</h2>
                        <p className="text-slate-500 mb-8">Submit your details for manual review by the Super Admin team.</p>

                        <div className="mb-8">
                            <p className="text-center text-sm text-slate-500 font-medium">SSO disabled for privileged accounts.</p>
                        </div>

                        <div className="relative flex py-2 items-center mb-6">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase font-semibold">Required Information</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>
                        
                        {/* Status Message */}
                        {(error || success) && (
                            <div className={`p-3 rounded-xl text-sm font-medium text-center mb-5 ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {error || "Request submitted! Access status and temporary login details will be sent to your email after manual review."}
                            </div>
                        )}


                        <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                          
                            {/* Admin Organization (Fixed) */}
                            <div>
                                <InputLabel>System Organization</InputLabel>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <BuildingOffice2Icon className="w-4 h-4 text-cyan-500" />
                                    </div>
                                    <input
                                        readOnly
                                        value={ADMIN_ORGANIZATION}
                                        className="w-full pl-10 bg-cyan-50 border border-cyan-300 text-slate-900 font-semibold text-sm rounded-xl block w-full p-3"
                                    />
                                </div>
                            </div>

                            {/* Admin Name */}
                            <div>
                                <InputLabel>Full Name</InputLabel>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <UserCircleIcon className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <input
                                        name="adminName"
                                        value={formData.adminName}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3 transition-all"
                                        placeholder="e.g. Jane Doe (System Manager)"
                                    />
                                </div>
                            </div>

                            {/* System Email */}
                            <div>
                                <InputLabel>System Email (Will receive login credentials)</InputLabel>
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
                          
                            {/* Grid: Phone Code + Phone Number */}
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-3">
                                    <InputLabel>Code</InputLabel>
                                    <select
                                        name="phoneCode"
                                        value={formData.phoneCode}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3 transition-all"
                                    >
                                        <option value="+91">+91</option>
                                        <option value="+1">+1</option>
                                    </select>
                                </div>
                                <div className="col-span-9">
                                    <InputLabel>Phone Number</InputLabel>
                                    <div className="relative">
                                        <input
                                            name="phoneNumber"
                                            type="tel"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3 transition-all"
                                            placeholder="Contact Mobile Number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Justification for Access (Crucial for Admin) */}
                            <div>
                                <InputLabel>Justification for Access</InputLabel>
                                <textarea
                                    name="justification"
                                    value={formData.justification}
                                    onChange={handleChange}
                                    rows="3"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 block w-full p-3 transition-all"
                                    placeholder="Briefly explain your role and why administrator access is required."
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading || success}
                                    className="w-full bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                           <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                           Submitting Request...
                                        </span>
                                    ) : (success ? "Request Submitted!" : "Submit Access Request")}
                                </button>
                            </div>

                            <div className="text-center">
                                <p className="text-sm text-slate-500">
                                    Already have approved credentials?{" "}
                                    <Link to="/adminlogin" className="text-cyan-700 font-bold hover:underline">
                                        Sign in
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