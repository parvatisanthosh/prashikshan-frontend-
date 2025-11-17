// StudentSignupCard.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {Link} from "react-router-dom";

/* sample colleges - replace with your real list/API later */
const SAMPLE_INSTITUTIONS = [
  { id: "inst_iiitn", name: "IIIT Nagpur", domain: "iiitn.ac.in" },
  { id: "inst_iitb", name: "IIT Bombay", domain: "iitb.ac.in" },
  { id: "inst_nitw", name: "NIT Warangal", domain: "nitw.ac.in" },
  { id: "inst_sample", name: "Sample State Univ", domain: "sample.edu" },
];

/**
 * Props:
 * - onSignInClick?: () => void    // optional callback when user clicks "Sign in instead"
 */
export default function StudentSignupCard({ onSignInClick } = {}) {
  // Form state
  const [fullName, setFullName] = useState("");
  const [institutionQuery, setInstitutionQuery] = useState("");
  const [institutions] = useState(SAMPLE_INSTITUTIONS);
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [collegeEmail, setCollegeEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // UI state
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const suggestionsRef = useRef(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  // suggestions outside click
  useEffect(() => {
    function handleClick(e) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setSuggestionsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filteredInstitutions = useMemo(() => {
    const q = institutionQuery.trim().toLowerCase();
    if (!q) return institutions;
    return institutions.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.domain || "").toLowerCase().includes(q)
    );
  }, [institutionQuery, institutions]);

  function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }
  function isValidPhone(p) {
    return /^(\+?\d{7,15})$/.test(p.trim());
  }

  function validate() {
    if (!fullName.trim()) return "Enter your full name.";
    if (!selectedInstitution) return "Select your college.";
    if (!collegeEmail.trim()) return "Enter your college email ID.";
    if (!isValidEmail(collegeEmail.trim())) return "Enter a valid college email.";
    // optional: check domain matches selected institution (soft)
    if (selectedInstitution && selectedInstitution.domain) {
      const domain = collegeEmail.split("@")[1]?.toLowerCase();
      if (domain && domain !== selectedInstitution.domain.toLowerCase()) {
        return `College email domain should match ${selectedInstitution.domain}`;
      }
    }
    if (!phone.trim()) return "Enter your phone number.";
    if (!isValidPhone(phone)) return "Enter a valid phone number (digits, include +country if possible).";
    if (!gradYear.trim()) return "Enter graduating year.";
    const gy = Number(gradYear);
    if (!Number.isInteger(gy) || gy < currentYear || gy > currentYear + 10)
      return `Graduating year must be between ${currentYear} and ${currentYear + 10}.`;
    if (!password) return "Enter a password.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  }

  function handleSelectInstitution(inst) {
    setSelectedInstitution(inst);
    setInstitutionQuery(inst.name);
    setSuggestionsOpen(false);
  }

  function clearForm() {
    setFullName("");
    setInstitutionQuery("");
    setSelectedInstitution(null);
    setCollegeEmail("");
    setPhone("");
    setGradYear("");
    setPassword("");
    setConfirmPassword("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setLoading(true);

    // frontend-only: simulate brief feedback and show success message
    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Signup validated on client — ready to connect backend.");
      clearForm();
    }, 500);
  }

  // new: sign-in handler (callback if provided, else fallback to hash navigation)
  function handleSignInInstead(e) {
    e.preventDefault();
    if (typeof onSignInClick === "function") {
      onSignInClick();
      return;
    }
    // fallback: change hash (no router required). You can remove this if undesired.
    try {
      window.location.hash = "#/login";
    } catch (err) {
      // no-op
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT: Title + Tagline */}
        <div className="flex flex-col justify-center items-center p-12 bg-white">
          <h1 className="text-7xl font-extrabold text-blue-600 leading-tight text-center">EduSphere</h1>
          <p className="mt-4 text-gray-600 text-lg font-medium text-center max-w-xs">
            Your Gateway to Internships & Skill Development
          </p>
        </div>

        {/* RIGHT: INNER SMALL CARD containing Signup form */}
        <div className="p-8 md:p-12 bg-gray-50 flex justify-center items-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Student Signup</h2>

            <form onSubmit={handleSubmit} className="space-y-3" ref={suggestionsRef} noValidate>
              {/* Full name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Full name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>

              {/* College selector */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">College</label>
                <input
                  value={institutionQuery}
                  onChange={(e) => {
                    setInstitutionQuery(e.target.value);
                    setSelectedInstitution(null);
                    setSuggestionsOpen(true);
                  }}
                  onFocus={() => setSuggestionsOpen(true)}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Search your college"
                />
                {suggestionsOpen && (
                  <div className="absolute z-30 w-full bg-white border mt-1 rounded-md shadow max-h-40 overflow-auto">
                    {filteredInstitutions.length === 0 ? (
                      <div className="p-3 text-sm text-gray-500">No matches</div>
                    ) : (
                      filteredInstitutions.map((inst) => (
                        <button
                          key={inst.id}
                          type="button"
                          onClick={() => handleSelectInstitution(inst)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                        >
                          <div className="font-medium">{inst.name}</div>
                          {inst.domain && <div className="text-xs text-gray-500">{inst.domain}</div>}
                        </button>
                      ))
                    )}
                  </div>
                )}
                {selectedInstitution && <p className="text-xs text-green-600 mt-1">Selected: {selectedInstitution.name}</p>}
              </div>

              {/* College Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700">College Email ID</label>
                <input
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="you@college.edu"
                  autoComplete="email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="+9198xxxxxxxx"
                />
              </div>

              {/* Graduating year */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Graduating year</label>
                <input
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="mt-1 w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={`e.g. ${currentYear + 1}`}
                />
                <p className="text-xs text-gray-500 mt-1">Valid range: {currentYear} - {currentYear + 10}</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full border border-gray-300 px-3 py-2 pr-12 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Create password (min 8 chars)"
                    autoComplete="new-password"
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

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full border border-gray-300 px-3 py-2 pr-12 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-3 text-sm text-gray-600"
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Error & Success */}
              {error && <div className="text-sm text-red-600">{error}</div>}
              {successMsg && <div className="text-sm text-green-600">{successMsg}</div>}

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60"
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>
              </div>

              {/* Sign in instead link */}
              <div className="mt-3 text-center">
                <Link to="/studentlogin">
                <button
                  type="button"
                  
                  className="text-sm text-gray-600 hover:underline"
                >
                  Already have an account? <span className="text-blue-600 font-medium">Sign in instead</span>
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
