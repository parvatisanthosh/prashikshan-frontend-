import React, { useState } from "react";
import {
  AcademicCapIcon,
  CalendarIcon,
  HashtagIcon,
  UsersIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";

/**
 * CreateClass.jsx
 *
 * Props:
 *   onClassCreated(newClass) → callback to push class into ManageClasses list
 *
 */

export default function CreateClass({ onClassCreated }) {
  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    section: "A",
    department: "",
    classType: "Course",
    startDate: "",
    endDate: "",
    description: "",
    maxStudents: 50,
  });

  const [status, setStatus] = useState({
    loading: false,
    error: null,
    success: false,
    classId: null,
  });

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null, success: false });

    if (!formData.className || !formData.classCode || !formData.startDate) {
      return setStatus({
        loading: false,
        error: "Please fill Class Name, Class Code, and Start Date.",
      });
    }

    setTimeout(() => {
      // Construct new class as ManageClasses expects
      const newClass = {
        id: formData.classCode,
        name: formData.className,
        section: formData.section || "A",
        students: 0,
        logsPending: 0,
        status: "Active",
      };

      // Send new class back to ManageClasses
      if (onClassCreated) onClassCreated(newClass);

      setStatus({
        loading: false,
        error: null,
        success: true,
        classId: formData.classCode,
      });
    }, 1200);
  };

  return (
    <div className="space-y-10">

      {/* Success Message */}
      {status.success ? (
        <div className="p-8 bg-green-50 border border-green-200 rounded-2xl text-center shadow">
          <h2 className="text-2xl font-bold text-green-700">Class Created Successfully!</h2>

          <p className="text-sm text-green-700 mt-2">Share this enrollment link:</p>

          <input
            readOnly
            value={`https://your-app.com/enroll/${status.classId}`}
            className="w-full mt-3 px-4 py-2 border bg-white rounded-lg font-mono text-sm"
          />

          <button
            onClick={() =>
              navigator.clipboard.writeText(`https://your-app.com/enroll/${status.classId}`)
            }
            className="mt-4 px-6 py-2 border border-indigo-600 text-indigo-700 rounded-full hover:bg-indigo-50"
          >
            Copy Link
          </button>
        </div>
      ) : (
        <>
          {/* FORM TITLE */}
          <h2 className="text-3xl font-extrabold text-slate-800">Create New Class</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl p-8 shadow-xl border">

            {/* Error Alert */}
            {status.error && (
              <div className="p-3 text-red-700 bg-red-100 border border-red-300 rounded-lg text-sm font-medium">
                {status.error}
              </div>
            )}

            {/* Section 1 */}
            <h3 className="text-lg font-bold text-indigo-700">1. Class Identity</h3>

            <div className="grid md:grid-cols-2 gap-6">

              {/* Class Name */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Class Name *
                </label>
                <input
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                  placeholder="Data Structures"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Class Code */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Class Code *
                </label>
                <div className="relative">
                  <HashtagIcon className="h-5 w-5 absolute text-slate-400 left-3 top-1/2 -translate-y-1/2" />
                  <input
                    name="classCode"
                    value={formData.classCode}
                    onChange={handleChange}
                    placeholder="CSE321"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Department
                </label>
                <div className="relative">
                  <AcademicCapIcon className="h-5 w-5 absolute text-slate-400 left-3 top-1/2 -translate-y-1/2" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  >
                    <option value="">Select department</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="MECH">Mechanical</option>
                    <option value="HSS">Humanities</option>
                  </select>
                </div>
              </div>

              {/* Section */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Section
                </label>
                <input
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Section 2 */}
            <h3 className="text-lg font-bold text-indigo-700">2. Schedule & Capacity</h3>

            <div className="grid md:grid-cols-3 gap-6">

              {/* Start Date */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Start Date *
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/* Max Students */}
              <div>
                <label className="text-sm font-medium text-slate-600 mb-1 block">
                  Max Students
                </label>
                <input
                  type="number"
                  min="1"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium text-slate-600 mb-1 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Write a short course description..."
              />
            </div>

            {/* Submit */}
            <button
              disabled={status.loading}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
            >
              {status.loading ? "Creating Class..." : "Create Class"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
