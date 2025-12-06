import React, { useState } from "react";
import {
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  AcademicCapIcon,
  IdentificationIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

export default function AddFaculty({ addFaculty, setActivePage }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    facultyId: "",
    department: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    "Computer Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Electrical",
    "Chemical",
    "Information Technology",
    "Biotechnology",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    if (success) setSuccess("");
  };

  const validate = () => {
    const err = {};
    
    if (!formData.firstName.trim()) {
      err.firstName = "First name is required";
    } else if (formData.firstName.length < 2) {
      err.firstName = "First name must be at least 2 characters";
    }
    
    if (!formData.lastName.trim()) {
      err.lastName = "Last name is required";
    } else if (formData.lastName.length < 2) {
      err.lastName = "Last name must be at least 2 characters";
    }
    
    if (!formData.email) {
      err.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      err.email = "Please enter a valid email address";
    }
    
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      err.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!formData.department) {
      err.department = "Department is required";
    }
    
    if (!formData.password) {
      err.password = "Password is required";
    } else if (formData.password.length < 8) {
      err.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      err.password = "Password must contain uppercase, lowercase, and number";
    }
    
    if (!formData.confirmPassword) {
      err.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      err.confirmPassword = "Passwords don't match";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/faculty/add', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      // const data = await response.json();

      await new Promise(resolve => setTimeout(resolve, 1000));

      addFaculty({
        id: Date.now(),
        name: `Dr. ${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        dept: formData.department,
        phone: formData.phone,
        facultyId: formData.facultyId,
        specialization: formData.specialization,
      });

      setSuccess(`✓ ${formData.firstName} ${formData.lastName} has been successfully added as faculty member!`);
      
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        facultyId: "",
        department: "",
        specialization: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => setSuccess(""), 5000);

    } catch (error) {
      console.error('Error adding faculty:', error);
      setErrors({ submit: 'Failed to add faculty. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      facultyId: "",
      department: "",
      specialization: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setSuccess("");
  };

  const handleCancel = () => {
    if (setActivePage) {
      setActivePage("managefaculty");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 sm:p-3 bg-indigo-100 rounded-xl flex-shrink-0">
            <UserPlusIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 truncate">Add New Faculty</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 line-clamp-2">Fill in the details to register a new faculty member</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 flex items-start sm:items-center gap-3 sm:gap-4 shadow-md">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-green-800 font-semibold text-sm sm:text-lg break-words">{success}</p>
            <p className="text-green-600 text-xs sm:text-sm mt-1">You can view them in the Manage Faculty section</p>
          </div>
          <button 
            onClick={() => setSuccess("")}
            className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-green-100 rounded-lg transition-colors"
          >
            <XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-5 mb-4 sm:mb-6 flex items-center gap-3 sm:gap-4 shadow-md">
          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
            <XCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
          </div>
          <p className="text-red-800 font-semibold flex-1 text-sm sm:text-base">{errors.submit}</p>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white shadow-xl rounded-xl sm:rounded-2xl border border-gray-100 sm:border-2 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Faculty Information</h2>
          <p className="text-indigo-100 text-sm sm:text-base mt-1">All fields marked with * are required</p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <IdentificationIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input 
                label="First Name" 
                name="firstName" 
                error={errors.firstName} 
                value={formData.firstName} 
                onChange={handleChange}
                required
                placeholder="Enter first name"
              />
              <Input 
                label="Last Name" 
                name="lastName" 
                error={errors.lastName} 
                value={formData.lastName} 
                onChange={handleChange}
                required
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
              <span>Contact Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                error={errors.email}
                onChange={handleChange}
                icon={<EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                required
                placeholder="example@college.edu"
              />
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                error={errors.phone}
                onChange={handleChange}
                icon={<PhoneIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                placeholder="1234567890"
              />
            </div>
          </div>

          {/* Professional Information Section */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <AcademicCapIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
              <span>Professional Information</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              <Input
                label="Faculty ID"
                name="facultyId"
                value={formData.facultyId}
                onChange={handleChange}
                icon={<BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                placeholder="FAC-2025-001"
              />
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departments}
                error={errors.department}
                required
              />
            </div>
            <Input
              label="Specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="e.g., Machine Learning, Data Structures"
            />
          </div>

          {/* Account Security Section */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <KeyIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0" />
              <span>Account Security</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  error={errors.password}
                  value={formData.password}
                  onChange={handleChange}
                  icon={<KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  required
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              <div className="relative">
                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  error={errors.confirmPassword}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<KeyIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />}
                  required
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Password must contain at least 8 characters with uppercase, lowercase, and numbers
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 sm:gap-4 pt-4 sm:pt-6 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-base sm:text-lg active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                  <span>Adding Faculty...</span>
                </>
              ) : (
                <>
                  <UserPlusIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Add Faculty Member</span>
                </>
              )}
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-all duration-200 font-semibold active:scale-[0.98]"
              >
                Clear Form
              </button>

              {setActivePage && (
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-all duration-200 font-semibold active:scale-[0.98]"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 sm:mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5">
        <p className="text-blue-800 text-xs sm:text-sm leading-relaxed">
          <span className="font-semibold">💡 Tip:</span> After adding a faculty member, they will receive an email with their login credentials. Make sure the email address is correct.
        </p>
      </div>
    </div>
  );
}

/* REUSABLE COMPONENTS */
function Input({ label, error, icon, required, ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">{icon}</div>}
        <input
          {...props}
          className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm transition-all duration-200 text-sm sm:text-base
          focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
          ${icon ? "pl-10 sm:pl-12" : ""}
          ${error ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500" : "border-gray-300 hover:border-gray-400"}`}
        />
      </div>
      {error && (
        <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center gap-1">
          <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </p>
      )}
    </div>
  );
}

function Select({ label, options, error, required, ...props }) {
  return (
    <div>
      <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        {...props}
        className={`w-full rounded-lg sm:rounded-xl border-2 px-3 sm:px-4 py-2.5 sm:py-3 shadow-sm transition-all duration-200 cursor-pointer text-sm sm:text-base
        focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white
        ${error ? "border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500" : "border-gray-300 hover:border-gray-400"}`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
          paddingRight: '2.5rem',
        }}
      >
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      {error && (
        <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2 flex items-center gap-1">
          <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </p>
      )}
    </div>
  );
}