// FILE: PendingReviews.jsx
import React, { useState } from "react";
import {
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

// Mock Data
const PENDING_LOGS = [
  {
    id: 1,
    student: "Aditi Verma",
    title: "Python Log – Week 4",
    description: "Added threading module + CSV parser",
    submitted: "2 hrs ago",
    urgency: "Urgent",
  },
  {
    id: 2,
    student: "Rahul Singh",
    title: "Internship Report – Week 3",
    description: "Worked on backend APIs & caching layer",
    submitted: "5 hrs ago",
    urgency: "Pending",
  },
  {
    id: 3,
    student: "Sneha Patel",
    title: "Capstone Proposal",
    description: "AI-powered attendance tracker drafted",
    submitted: "1 day ago",
    urgency: "Pending",
  },
];

// --------------------------------------------------
// ACTION MODAL (Responsive Updates)
// --------------------------------------------------
function ActionModal({ review, type, onClose, onSubmit }) {
  if (!review) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      {/* RESPONSIVE: Width and padding adjustments */}
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 space-y-6 relative animate-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          {type === "approve" ? (
            <CheckCircleIcon className="w-7 h-7 text-green-600" />
          ) : (
            <ChatBubbleLeftRightIcon className="w-7 h-7 text-red-600" />
          )}
          {type === "approve" ? "Approve Submission" : "Request Changes"}
        </h2>

        <p className="text-slate-600 text-sm leading-relaxed">
          {type === "approve"
            ? `Are you sure you want to approve the submission from ${review.student}?`
            : `What specific changes should ${review.student} make before re-submitting?`}
        </p>

        {type === "changes" && (
          <textarea
            rows={4}
            className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            placeholder="Describe required changes..."
          />
        )}

        {/* RESPONSIVE: Stack buttons on mobile, row on desktop */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium shadow-sm flex justify-center items-center gap-2 ${
              type === "approve"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            } transition`}
          >
            {type === "approve" ? "Confirm Approval" : "Submit Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------
// REVIEW ITEM COMPONENT (Responsive Updates)
// --------------------------------------------------
function ReviewItem({ log, onApprove, onRequestChanges }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 p-4 md:p-6 transition-all duration-200">
      {/* Header - Click to expand */}
      <div 
        className="flex justify-between items-start gap-4 cursor-pointer select-none" 
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0"> {/* min-w-0 ensures text truncation works if needed */}
          <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-center gap-2 flex-wrap">
            <DocumentTextIcon className="w-5 h-5 text-indigo-500 shrink-0" />
            <span className="break-words">{log.title}</span>
          </h3>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            <span className="font-medium text-slate-700">{log.student}</span> • {log.submitted}
          </p>
        </div>

        <div className="bg-slate-50 p-1.5 rounded-full shrink-0">
            {expanded ? (
            <ChevronUpIcon className="w-5 h-5 text-slate-400" />
            ) : (
            <ChevronDownIcon className="w-5 h-5 text-slate-400" />
            )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
          <p className="text-slate-600 text-sm md:text-base mb-6 leading-relaxed">
            {log.description}
          </p>

          {/* RESPONSIVE ACTION BAR: Stacks on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Urgency Badge */}
            <span
              className={`inline-flex self-start items-center px-3 py-1 text-xs font-semibold rounded-full border ${
                log.urgency === "Urgent"
                  ? "bg-red-50 text-red-700 border-red-100"
                  : "bg-amber-50 text-amber-700 border-amber-100"
              }`}
            >
              Status: {log.urgency}
            </span>

            {/* Buttons: Full width on mobile, auto on desktop */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={(e) => { e.stopPropagation(); onApprove(); }}
                className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 text-sm font-medium shadow-sm"
              >
                <CheckCircleIcon className="w-4 h-4" /> 
                Approve
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); onRequestChanges(); }}
                className="flex-1 sm:flex-none w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 hover:text-red-600 transition flex items-center justify-center gap-2 text-sm font-medium"
              >
                <ChatBubbleLeftRightIcon className="w-4 h-4" /> 
                Request Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// MAIN COMPONENT (Responsive Updates)
// --------------------------------------------------
export default function PendingReviews() {
  const [logs, setLogs] = useState(PENDING_LOGS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedReview, setSelectedReview] = useState(null);
  const [actionType, setActionType] = useState(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.student.toLowerCase().includes(search.toLowerCase()) ||
      log.title.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || log.urgency.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  return (
    // RESPONSIVE: p-4 mobile, p-10 desktop
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Pending Reviews</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Review and respond to student submissions.</p>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by student or title..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters - Horizontal scroll on very small screens if needed, or wrap */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {["All", "Urgent", "Pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-600 ring-offset-1"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Review Items */}
        <div className="space-y-4">
          {filteredLogs.map((log) => (
            <ReviewItem
              key={log.id}
              log={log}
              onApprove={() => {
                setSelectedReview(log);
                setActionType("approve");
              }}
              onRequestChanges={() => {
                setSelectedReview(log);
                setActionType("changes");
              }}
            />
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-300">
                <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                    <DocumentTextIcon className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No matching reviews found.</p>
                <button 
                    onClick={() => {setSearch(''); setFilter('All');}}
                    className="text-indigo-600 text-sm mt-2 hover:underline"
                >
                    Clear filters
                </button>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedReview && (
          <ActionModal
            review={selectedReview}
            type={actionType}
            onClose={() => {
              setSelectedReview(null);
              setActionType(null);
            }}
            onSubmit={() => {
              alert(
                `${actionType === "approve" ? "Approved" : "Requested changes for"} ${
                  selectedReview.student
                }`
              );
              setSelectedReview(null);
              setActionType(null);
            }}
          />
        )}
      </div>
    </div>
  );
}