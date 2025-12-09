// src/pages/company/CreateOpening.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompany } from "../../context/CompanyContext";
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

export default function CreateOpening() {
  const nav = useNavigate();
  const { addJobOpening, getActiveJobs } = useCompany();

  const [form, setForm] = useState({
    title: "",
    description: "",
    skills: "",
    stipend: "",
    duration: "3 months",
    mode: "Remote",
    location: "",
  });

  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [publishedJob, setPublishedJob] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      alert("Please fill in the title and description");
      return;
    }

    setIsPublishing(true);

    setTimeout(() => {
      const newJob = addJobOpening({
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });

      setIsPublishing(false);
      setPublishedJob(newJob);
      setShowSuccess(true);
    }, 1500);
  };

  const handleCreateAnother = () => {
    setForm({
      title: "",
      description: "",
      skills: "",
      stipend: "",
      duration: "3 months",
      mode: "Remote",
      location: "",
    });
    setShowSuccess(false);
    setPublishedJob(null);
  };

  // Success State
  if (showSuccess && publishedJob) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          {/* Success Animation */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-bounce-slow">
            <CheckCircleIcon className="w-10 h-10 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Published Successfully! 🎉
          </h2>
          <p className="text-gray-500 mb-6">
            Your job opening is now live and visible to all students
          </p>

          {/* Published Job Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 text-left border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                <BriefcaseIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{publishedJob.title}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{publishedJob.description}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-blue-600 border border-blue-200">
                    {publishedJob.mode}
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-green-600 border border-green-200">
                    {publishedJob.stipend}
                  </span>
                  <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-purple-600 border border-purple-200">
                    {publishedJob.duration}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Active
                  </span>
                  <span className="text-xs text-gray-500">
                    {publishedJob.applicants} applicants
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => nav("/company/overview")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              View in Dashboard
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleCreateAnother}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Create Another
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">{getActiveJobs().length}</p>
            <p className="text-sm text-gray-500">Active Openings</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">24h</p>
            <p className="text-sm text-gray-500">Avg. Response Time</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-2xl font-bold text-gray-900">92%</p>
            <p className="text-sm text-gray-500">Match Rate</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
          <BriefcaseIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Internship Opening</h2>
          <p className="text-gray-500">Fill in the details and publish your job</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="e.g. Frontend Developer Intern"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            required
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            placeholder="Describe the role, responsibilities, and requirements..."
          ></textarea>
        </div>

        {/* Skills & Stipend */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="React, JavaScript, CSS"
            />
            <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stipend
            </label>
            <input
              name="stipend"
              value={form.stipend}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="e.g. ₹15,000/month"
            />
          </div>
        </div>

        {/* Duration & Mode */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <select
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option>1 month</option>
              <option>2 months</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>1 year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Mode
            </label>
            <select
              name="mode"
              value={form.mode}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            placeholder="e.g. Bangalore, India"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPublishing}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50"
          >
            {isPublishing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Publishing...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Publish Opening
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => nav("/company/overview")}
            className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}