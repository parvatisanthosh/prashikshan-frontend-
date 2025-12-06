import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeftIcon, 
  UserCircleIcon, 
  BuildingOffice2Icon, // Used for Company Name
  EnvelopeIcon,
  GlobeAltIcon, // For Company Website
  LockClosedIcon // For Password fields
} from '@heroicons/react/24/solid';

// --- Placeholder for Company Data (Used for Autocomplete) ---
const SAMPLE_COMPANIES = [
  { id: "C101", name: "Tech Solutions Pvt. Ltd.", domain: "techsolutions.com" },
  { id: "C102", name: "Global Innovations Inc.", domain: "globalinnovations.net" },
  { id: "C103", name: "Prashikshan Labs", domain: "prashikshan.com" },
  { id: "C104", name: "Future Systems", domain: "futuresys.io" },
  { id: "C105", name: "InfyTech Services", domain: "infytech.co.in" },
];


// --- Authorization URL Construction (Unchanged) ---
const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?
    client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID || '[YOUR_GOOGLE_CLIENT_ID]'}&
    redirect_uri=${import.meta.env.VITE_GOOGLE_REDIRECT_URI || '[YOUR_GOOGLE_REDIRECT_URI]'}&
    response_type=code&
    scope=profile%20email&
    prompt=select_account`

const MICROSOFT_AUTH_URL = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
    client_id=${import.meta.env.VITE_MICROSOFT_CLIENT_ID || '[YOUR_MICROSOFT_CLIENT_ID]'}&
    redirect_uri=${import.meta.env.VITE_MICROSOFT_REDIRECT_URI || '[YOUR_MICROSOFT_REDIRECT_URI]'}&
    response_type=code&
    scope=openid%20profile%20email&
    prompt=select_account`


export default function CompanySignupPage() {
  const navigate = useNavigate();
  
  // --- Form State ---
  const [formData, setFormData] = useState({
    companyName: '',
    companyWebsite: '',
    officialEmail: '',
    contactName: '',
    phoneCode: '+91',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  
  // --- UI State ---
  const [companyQuery, setCompanyQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const suggestionsRef = useRef(null);

  // --- Computed Values ---
  const filteredCompanies = useMemo(() => {
    const q = companyQuery.toLowerCase().trim();
    if (!q) return [];
    return SAMPLE_COMPANIES.filter(c => 
      c.name.toLowerCase().includes(q) || c.domain.includes(q)
    );
  }, [companyQuery]);
  
  const passwordStrength = useMemo(() => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; 
  }, [formData.password]);


  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSelectCompany = (comp) => {
    setSelectedCompany(comp);
    setCompanyQuery(comp.name);
    setSuggestionsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    if (!selectedCompany) {
        setError('Please select your Company/Organization from the suggestions.');
        setLoading(false);
        return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    if (passwordStrength < 3) {
      setError("Password is too weak. Please use a stronger combination.");
      setLoading(false);
      return;
    }

    // --- Registration Logic Placeholder ---
    console.log('Attempting Company Registration with:', {
        ...formData,
        companyId: selectedCompany.id,
        registeredCompanyName: selectedCompany.name,
    });
    
    // Simulation: Wait and show success message
    setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
        // Navigate to login page after 2 seconds to confirm success
        setTimeout(() => {
            navigate('/companylogin'); 
        }, 2000); 

    }, 1500); 
  };
  
  // Close suggestions on click outside (Unchanged)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Render Helpers ---
  const InputLabel = ({ children }) => (
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
      {children}
    </label>
  );
    
  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  );

  const MicrosoftIcon = () => (
    <svg className="w-5 h-5 text-[#00a4ef]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>
  );

  return (
    // 1. Background & Centering
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-slate-900">
      
      {/* 2. Card Container */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
        
        {/* --- LEFT PANEL: Branding & Visuals (Company Theme) --- */}
        <div className="hidden md:flex w-5/12 bg-gradient-to-br from-slate-800 to-gray-900 relative p-12 text-white">

          {/* Center Content Wrapper */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 z-10">

            <h1 className="text-4xl font-extrabold tracking-tight mb-3">
              Prashikshan
            </h1>

            <p className="text-slate-300 font-medium mb-10 text-lg">
              Partnering for future talent.
            </p>

            <h3 className="text-xl font-bold text-white mb-1">
              Company Registration
            </h3>

            <p className="text-slate-400 text-base font-light max-w-xs">
              Manage student talent acquisition and mentorship programs seamlessly.
            </p>

          </div>

          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400">
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
                  className="text-slate-500 hover:text-slate-800 transition-colors flex items-center text-sm font-medium"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-1" />
                  Back to Role Selection
                </button>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Company Account</h2>
            <p className="text-slate-500 mb-8">Register your organization and official contact.</p>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <a
                    href={GOOGLE_AUTH_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <GoogleIcon />
                    Google SSO
                </a>
                <a 
                    href={MICROSOFT_AUTH_URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <MicrosoftIcon />
                    Microsoft SSO
                </a>
            </div>

            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase font-semibold">Or register with email</span>
                <div className="flex-grow border-t border-slate-200"></div>
            </div>
            
            {/* Status Message */}
            {(error || success) && (
                <div className={`p-3 rounded-xl text-sm font-medium text-center mb-5 ${error ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                    {error || "Registration successful! Check your official email for a verification link."}
                </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              
              {/* Company Autocomplete */}
              <div className="relative" ref={suggestionsRef}>
                <InputLabel>Company / Organization Name</InputLabel>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <BuildingOffice2Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      value={companyQuery}
                      onChange={(e) => {
                          setCompanyQuery(e.target.value);
                          setSelectedCompany(null); 
                          setSuggestionsOpen(true);
                          if (error) setError(null);
                      }}
                      onFocus={() => setSuggestionsOpen(true)}
                      required
                      className={`w-full pl-10 bg-slate-50 border text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all ${!selectedCompany && companyQuery ? 'border-red-400' : 'border-slate-200'}`}
                      placeholder="Search and select your company..."
                    />
                </div>
                {/* Custom Suggestions Dropdown */}
                {suggestionsOpen && companyQuery && filteredCompanies.length > 0 && (
                   <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      {filteredCompanies.map((comp) => (
                          <div 
                            key={comp.id}
                            onClick={() => handleSelectCompany(comp)}
                            className="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b border-slate-50 last:border-0"
                          >
                            <p className="text-sm font-medium text-slate-800">{comp.name}</p>
                            <p className="text-xs text-slate-500">{comp.domain}</p>
                          </div>
                      ))}
                   </div>
                )}
                {/* Visual Feedback */}
                {companyQuery && !selectedCompany && filteredCompanies.length === 0 && (
                    <p className="mt-1 text-xs text-red-500 font-medium">Company not found. Please check spelling or contact support.</p>
                )}
              </div>

              {/* Company Website */}
              <div>
                <InputLabel>Company Website (For verification link generation)</InputLabel>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <GlobeAltIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      name="companyWebsite"
                      type="url"
                      value={formData.companyWebsite}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                      placeholder="https://www.company.com"
                    />
                </div>
              </div>
              
              {/* Official Contact Name */}
              <div>
                <InputLabel>Official Contact Person Name</InputLabel>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserCircleIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                      placeholder="e.g. Ms. Priya Das (HR Manager)"
                    />
                </div>
              </div>

              {/* Official Email */}
              <div>
                <InputLabel>Official Email (Used for verification and login)</InputLabel>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <EnvelopeIcon className="w-4 h-4 text-slate-400" />
                    </div>
                    <input
                      name="officialEmail"
                      type="email"
                      value={formData.officialEmail}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                      placeholder="hr@company.com or priya.das@company.com"
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
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
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                      placeholder="Company/Contact Mobile Number"
                    />
                  </div>
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
                    className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 pr-16 transition-all"
                    placeholder="Create password (min 8 chars)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition uppercase"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                
                {/* Visual Password Strength Meter */}
                <div className="flex gap-1 mt-2 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div 
                      key={level} 
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${passwordStrength >= level ? 
                      (passwordStrength < 2 ? 'bg-red-400' : passwordStrength < 4 ? 'bg-yellow-400' : 'bg-green-500') 
                      : 'bg-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <InputLabel>Confirm Password</InputLabel>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <LockClosedIcon className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full p-3 transition-all"
                      placeholder="Repeat password"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-500/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                           <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                           Registering...
                        </span>
                    ) : "Create Company Account"}
                </button>
              </div>

              <div className="text-center">
                  <p className="text-sm text-slate-500">
                      Already have an account?{" "}
                      <Link to="/companylogin" className="text-slate-800 font-bold hover:underline">
                          Login
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