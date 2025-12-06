import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowTopRightOnSquareIcon,
  DocumentTextIcon,
  TrashIcon,
  ArrowLeftIcon,
  ClockIcon,
  AcademicCapIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

// --- MOCK DATA ---
const MOCK_SUBMISSIONS = [
  {
    id: "R-001",
    student: "Aditi Verma",
    roll: "CS21045",
    assignment: "Research Paper: AI Ethics",
    type: "report",
    submittedAt: "10:30 AM",
    status: "Pending",
    pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    rubric: [
      { criteria: "Research Depth", max: 40, score: null },
      { criteria: "Citations", max: 10, score: null },
      { criteria: "Grammar", max: 20, score: null },
      { criteria: "Formatting", max: 10, score: null },
    ],
    feedback: "",
  },
  {
    id: "R-002",
    student: "Rahul Singh",
    roll: "CS21088",
    assignment: "Internship Log - Week 4",
    type: "report",
    submittedAt: "Yesterday",
    status: "Changes Requested",
    pdf: null, // No PDF test case
    rubric: [
      { criteria: "Daily Entries", max: 50, score: 30 },
      { criteria: "Supervisor Sign", max: 50, score: 50 },
    ],
    feedback: "Please attach the signed document.",
  },
  {
    id: "R-003",
    student: "Sneha Patel",
    roll: "CS21012",
    assignment: "Capstone Proposal",
    type: "report",
    submittedAt: "Feb 20",
    status: "Reviewed",
    pdf: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    rubric: [
      { criteria: "Novelty", max: 50, score: 45 },
      { criteria: "Feasibility", max: 50, score: 40 },
    ],
    feedback: "Excellent work.",
  },
];

export default function ReportsAndSignoff() {
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  // Filter Logic
  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (filter !== "All" && s.status !== filter) return false;
      return (
        s.student.toLowerCase().includes(query.toLowerCase()) ||
        s.assignment.toLowerCase().includes(query.toLowerCase())
      );
    });
  }, [submissions, query, filter]);

  // Handlers
  const handleUpdate = (updatedItem) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === updatedItem.id ? updatedItem : s))
    );
    setSelected(updatedItem);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete submission?")) {
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      setSelected(null);
    }
  };

  return (
    <div className="flex flex-col h-[90vh] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden font-sans relative">
      
      {/* --- TOP HEADER --- */}
      <div className="bg-white px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 z-20">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <DocumentTextIcon className="w-6 h-6 text-indigo-600" />
            Submissions & Reviews
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {submissions.filter(s => s.status === 'Pending').length} pending review
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          {["All", "Pending", "Reviewed", "Changes Requested"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === f
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTENT AREA (Split View) --- */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* LEFT: LIST VIEW */}
        <div
          className={`
            w-full md:w-1/3 border-r border-slate-100 bg-slate-50/50 flex flex-col
            ${selected ? "hidden md:flex" : "flex"} 
          `}
        >
          {/* Search */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Search students..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map((s) => (
              <div
                key={s.id}
                onClick={() => setSelected(s)}
                className={`
                  p-4 border-b border-slate-100 cursor-pointer transition-all hover:bg-white
                  ${selected?.id === s.id ? "bg-white border-l-4 border-l-indigo-600 shadow-sm" : "border-l-4 border-l-transparent"}
                `}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm ${selected?.id === s.id ? "text-indigo-900" : "text-slate-700"}`}>
                    {s.student}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">{s.submittedAt}</span>
                </div>
                
                <p className="text-xs text-slate-500 mb-2 truncate">{s.assignment}</p>
                
                <StatusBadge status={s.status} />
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">No submissions found.</div>
            )}
          </div>
        </div>

        {/* RIGHT: DETAIL VIEW */}
        <div
          className={`
            flex-1 bg-white flex flex-col h-full
            ${selected ? "flex absolute inset-0 md:static z-30" : "hidden md:flex"}
          `}
        >
          {selected ? (
            <EvaluatorPanel
              submission={selected}
              onClose={() => setSelected(null)}
              onUpdate={handleUpdate}
              onDelete={() => handleDelete(selected.id)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <AcademicCapIcon className="w-20 h-20 opacity-20 mb-4" />
              <p className="text-lg font-medium text-slate-400">Select a submission to evaluate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// COMPONENT: EVALUATOR PANEL (The "Right Side")
// --------------------------------------------------------
function EvaluatorPanel({ submission, onClose, onUpdate, onDelete }) {
  const [rubric, setRubric] = useState(submission.rubric);
  const [feedback, setFeedback] = useState(submission.feedback || "");

  // Stats
  const totalMax = rubric.reduce((acc, r) => acc + r.max, 0);
  const currentScore = rubric.reduce((acc, r) => acc + (Number(r.score) || 0), 0);
  const percentage = Math.round((currentScore / totalMax) * 100);

  const handleScoreChange = (index, val) => {
    const newRubric = [...rubric];
    let score = val === "" ? null : Number(val);
    if (score > newRubric[index].max) score = newRubric[index].max; // Cap score
    newRubric[index].score = score;
    setRubric(newRubric);
  };

  const handleSave = (status) => {
    onUpdate({ ...submission, status, rubric, feedback });
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right-4 duration-300">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-white">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="md:hidden p-1 -ml-2 text-slate-400">
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{submission.student}</h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">{submission.roll}</span>
              <span>•</span>
              <span>{submission.assignment}</span>
            </div>
          </div>
        </div>
        <button onClick={onDelete} className="text-slate-300 hover:text-red-500 transition">
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
        
        {/* 1. DOCUMENT PREVIEW */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-500 uppercase">Document Preview</span>
            {submission.pdf && (
              <a href={submission.pdf} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
                Open External <ArrowTopRightOnSquareIcon className="w-3 h-3" />
              </a>
            )}
          </div>
          
          <div className="h-80 w-full bg-slate-100 flex items-center justify-center relative">
            {submission.pdf ? (
              <iframe src={submission.pdf} className="w-full h-full" title="PDF" />
            ) : (
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                   <ExclamationTriangleIcon className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-slate-900 font-medium">No Document Attached</h3>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mt-1">
                  The student has not uploaded a file. You can still grade based on external observations.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 2. RUBRIC SCORING */}
        <div>
           <div className="flex justify-between items-end mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Grading Rubric</h3>
              <div className="text-right">
                 <span className={`text-2xl font-black ${percentage >= 50 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {currentScore}
                 </span>
                 <span className="text-sm text-slate-400 font-medium"> / {totalMax}</span>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-3">
              {rubric.map((r, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all">
                    <div>
                       <p className="font-bold text-slate-700">{r.criteria}</p>
                       <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 w-32">
                          <div 
                            className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${(r.score / r.max) * 100}%` }}
                          ></div>
                       </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <input
                          type="number"
                          className="w-16 h-10 text-center text-lg font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                          placeholder="0"
                          value={r.score === null ? "" : r.score}
                          onChange={(e) => handleScoreChange(i, e.target.value)}
                       />
                       <span className="text-xs text-slate-400 font-medium">/ {r.max}</span>
                    </div>
                 </div>
              ))}
           </div>
        </div>

        {/* 3. FEEDBACK */}
        <div>
           <h3 className="font-bold text-slate-900 text-lg mb-3">Feedback</h3>
           <textarea
              rows={4}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-sm shadow-sm"
              placeholder="Enter feedback for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
           />
        </div>

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
         <button
            onClick={() => handleSave("Changes Requested")}
            className="flex-1 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
         >
            Request Changes
         </button>
         <button
            onClick={() => handleSave("Reviewed")}
            className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
         >
            <CheckCircleIcon className="w-5 h-5" />
            Approve & Sign-off
         </button>
      </div>

    </div>
  );
}

// --------------------------------------------------------
// HELPER: STATUS BADGE
// --------------------------------------------------------
function StatusBadge({ status }) {
  const styles = {
    "Pending": "bg-amber-100 text-amber-700 border-amber-200",
    "Reviewed": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Changes Requested": "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}