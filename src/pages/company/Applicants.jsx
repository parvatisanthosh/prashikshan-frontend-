// src/pages/company/Applicants.jsx
import React, { useState } from "react";
import { useCompany } from "../../context/CompanyContext";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

export default function Applicants() {
  const navigate = useNavigate();
  const { applicants, selectStudent, rejectStudent, getStats } = useCompany();
  const stats = getStats();
  
  const [filters, setFilters] = useState({ q: "", status: "all", position: "all" });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Get unique positions for filter
  const positions = [...new Set(applicants.map(a => a.position))];

  const handleSelect = (id, name) => {
    selectStudent(id);
    setSuccessMessage(`${name} has been selected! 🎉`);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReject = (id, name) => {
    if (window.confirm(`Are you sure you want to reject ${name}?`)) {
      rejectStudent(id);
      setSuccessMessage(`${name} has been rejected`);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const filtered = applicants.filter((a) => {
    const matchesSearch = 
      a.name.toLowerCase().includes(filters.q.toLowerCase()) ||
      a.email.toLowerCase().includes(filters.q.toLowerCase()) ||
      a.position.toLowerCase().includes(filters.q.toLowerCase());
    const matchesStatus = filters.status === "all" || a.status === filters.status;
    const matchesPosition = filters.position === "all" || a.position === filters.position;
    return matchesSearch && matchesStatus && matchesPosition;
  });

  const statusColors = {
    new: "bg-blue-100 text-blue-700 border-blue-200",
    reviewed: "bg-yellow-100 text-yellow-700 border-yellow-200",
    shortlisted: "bg-green-100 text-green-700 border-green-200",
    interview: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const statusLabels = {
    new: "New",
    reviewed: "Reviewed",
    shortlisted: "Shortlisted",
    interview: "Interview"
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-24 right-6 z-50 animate-slideIn">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">All Applicants</h2>
          <p className="text-gray-500 mt-1">Review and manage student applications</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium">
            {applicants.length} Total
          </span>
          <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full font-medium">
            {stats.totalSelected} Selected
          </span>
          <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full font-medium">
            {stats.totalRecruited} Recruited
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">{applicants.filter(a => a.status === 'new').length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">New</p>
              <p className="text-lg font-semibold text-gray-900">Applications</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-bold">{applicants.filter(a => a.status === 'reviewed').length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Under</p>
              <p className="text-lg font-semibold text-gray-900">Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-bold">{applicants.filter(a => a.status === 'shortlisted').length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Shortlisted</p>
              <p className="text-lg font-semibold text-gray-900">Candidates</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-bold">{applicants.filter(a => a.status === 'interview').length}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interview</p>
              <p className="text-lg font-semibold text-gray-900">Scheduled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="Search by name, email, or position..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview</option>
          </select>

          {/* Position Filter */}
          <select
            value={filters.position}
            onChange={(e) => setFilters({ ...filters, position: e.target.value })}
            className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Positions</option>
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors">
            <ArrowDownTrayIcon className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Applicants List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {filtered.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filtered.map((applicant) => (
              <div
                key={applicant.id}
                className="p-5 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    onClick={() => navigate(`/company/student/${applicant.id}`)}
                    className="cursor-pointer"
                  >
                    {applicant.avatar ? (
                      <img
                        src={applicant.avatar}
                        alt={applicant.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 hover:ring-blue-200 transition-all"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-lg font-semibold ring-2 ring-gray-100 hover:ring-blue-200 transition-all">
                        {applicant.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3
                          onClick={() => navigate(`/company/student/${applicant.id}`)}
                          className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"
                        >
                          {applicant.name}
                          {applicant.rating && (
                            <span className="flex items-center gap-0.5 text-sm text-amber-500">
                              <StarIcon className="w-4 h-4" />
                              {applicant.rating}
                            </span>
                          )}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">{applicant.position}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[applicant.status]}`}>
                          {statusLabels[applicant.status] || applicant.status}
                        </span>
                        <span className="text-xs text-gray-400">{applicant.appliedDate}</span>
                      </div>
                    </div>

                    {/* Contact & Details */}
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{applicant.email}</span>
                      <span>•</span>
                      <span>{applicant.phone}</span>
                      <span>•</span>
                      <span>{applicant.location}</span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {applicant.skills?.slice(0, 4).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {applicant.skills?.length > 4 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                          +{applicant.skills.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Education */}
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                      <span>{applicant.education}</span>
                      <span>•</span>
                      <span>{applicant.college}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/company/student/${applicant.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={() => navigate(`/company/chat?student=${applicant.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <ChatBubbleLeftIcon className="w-4 h-4" />
                        Message
                      </button>
                      <button
                        onClick={() => handleSelect(applicant.id, applicant.name)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Select
                      </button>
                      <button
                        onClick={() => handleReject(applicant.id, applicant.name)}
                        className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applicants found</h3>
            <p className="text-gray-500">
              {filters.q || filters.status !== "all" || filters.position !== "all"
                ? "Try adjusting your search or filters"
                : "New applications will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}