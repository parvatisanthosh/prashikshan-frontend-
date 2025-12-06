import React, { useState } from "react";
import {
  BookOpenIcon,
  HashtagIcon,
  BuildingLibraryIcon,
  UserGroupIcon,
  CalendarIcon,
  PencilSquareIcon,
  SquaresPlusIcon
} from "@heroicons/react/24/outline";

// ✅ RESPONSIVE UPDATE: Text size adjusted for mobile to prevent zooming (text-base)
const InputField = ({ label, icon: Icon, name, type = "text", value, onChange, ...props }) => (
  <div className="space-y-1">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
      {label}
    </label>

    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-200" />
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
        className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg leading-5 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-base sm:text-sm shadow-sm"
      />
    </div>
  </div>
);

export default function ClassFormPolished({ onSubmit }) {
  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    section: "",
    department: "",
    days: [],
    maxStudents: 50,
    description: "",
  });

  const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  return (
    // ✅ RESPONSIVE UPDATE: Changed padding p-6 to p-4 for mobile, md:p-6 for desktop
    <div className="flex justify-center items-center min-h-screen md:min-h-[600px] p-4 md:p-6 bg-slate-100">
      
      {/* Card Container */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        
        {/* Bold Header */}
        {/* ✅ RESPONSIVE UPDATE: p-6 mobile, p-8 desktop */}
        <div className="bg-indigo-600 p-6 md:p-8 text-white flex items-start justify-between relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute -top-10 -right-10 w-32 h-32 md:w-40 md:h-40 bg-indigo-500 rounded-full opacity-50"></div>
          
          <div className="relative z-10 pr-4">
            {/* ✅ RESPONSIVE UPDATE: text-2xl mobile, text-3xl desktop */}
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Create Class</h2>
            <p className="text-indigo-100 mt-2 text-sm">
              Configure details for your new session.
            </p>
          </div>
          <div className="relative z-10 bg-indigo-500 p-2 md:p-3 rounded-xl shadow-lg shrink-0">
            <SquaresPlusIcon className="h-6 w-6 md:h-8 md:w-8 text-white" />
          </div>
        </div>

        {/* Form Body */}
        {/* ✅ RESPONSIVE UPDATE: Reduced padding and gap for mobile */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
          className="p-5 md:p-8 space-y-6 md:space-y-8"
        >
          {/* Row 1: Name & Code */}
          {/* ✅ RESPONSIVE UPDATE: Stack on mobile (grid-cols-1), side-by-side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             <InputField 
                label="Class Name" 
                name="className" 
                icon={BookOpenIcon} 
                placeholder="e.g. Adv. Algorithms" 
                required
                value={formData.className}
                onChange={handleChange}
             />
             <InputField 
                label="Class Code" 
                name="classCode" 
                icon={HashtagIcon} 
                placeholder="e.g. CS-404" 
                required
                value={formData.classCode}
                onChange={handleChange}
             />
          </div>

          {/* Row 2: Dept, Section, Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <InputField 
                label="Department" 
                name="department" 
                icon={BuildingLibraryIcon} 
                placeholder="CSE"
                value={formData.department}
                onChange={handleChange}
             />
             {/* Section and Capacity can share a row on mobile to save height */}
             <div className="grid grid-cols-2 gap-4 md:contents">
                <InputField 
                    label="Section" 
                    name="section" 
                    icon={PencilSquareIcon} 
                    placeholder="A"
                    value={formData.section}
                    onChange={handleChange}
                />
                <InputField 
                    label="Capacity" 
                    name="maxStudents" 
                    type="number" 
                    icon={UserGroupIcon}
                    value={formData.maxStudents}
                    onChange={handleChange}
                />
             </div>
          </div>

          {/* Schedule */}
          <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Weekly Schedule
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`
                    flex-1 min-w-[3rem] py-2 rounded-lg text-sm font-semibold transition-all shadow-sm
                    ${
                      formData.days.includes(day)
                        ? "bg-indigo-600 text-white shadow-indigo-200 transform -translate-y-0.5"
                        : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-100"
                    }
                  `}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">
                Description
              </label>
             <textarea
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief course overview..."
                className="block w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-sm text-base sm:text-sm"
             />
          </div>

          {/* Footer Action */}
          <div className="pt-2 md:pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full md:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Create Class</span>
              <SquaresPlusIcon className="w-5 h-5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}