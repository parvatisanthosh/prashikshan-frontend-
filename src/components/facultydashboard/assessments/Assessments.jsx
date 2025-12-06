// FILE: Assessments.jsx
import React, { useState, useMemo } from "react";
import {
  PlusCircleIcon,
  DocumentTextIcon,
  XMarkIcon,
  CheckCircleIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  CalendarIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentPlusIcon
} from "@heroicons/react/24/outline";

/* -----------------------------------------------------------------------
   MOCK DATA
------------------------------------------------------------------------ */
const SAMPLE_ASSIGNMENTS = [
  {
    id: 1,
    title: "Weekly Log – Module 3",
    category: "Log",
    due: "2025-02-10",
    status: "Published",
    pdf: "/sample.pdf",
    rubrics: [
      { criteria: "Code Quality", max: 20 },
      { criteria: "Documentation", max: 10 },
      { criteria: "Logic", max: 30 },
    ],
  },
  {
    id: 2,
    title: "Final Capstone Project",
    category: "Capstone",
    due: "2025-03-15",
    status: "Draft",
    pdf: "/sample.pdf",
    rubrics: [
      { criteria: "Innovation", max: 50 },
      { criteria: "Execution", max: 50 },
    ],
  },
  {
    id: 3,
    title: "Database Design Quiz",
    category: "Quiz",
    due: "2025-02-20",
    status: "Published",
    pdf: null,
    rubrics: [{ criteria: "Correct Answers", max: 100 }],
  },
];

/* -----------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------------ */
export default function Assessments() {
  const [assignments, setAssignments] = useState(SAMPLE_ASSIGNMENTS);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  
  // Search & Filter State
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");

  // Derived State (Filtering Logic)
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCat === "All" || a.category === filterCat;
      return matchesSearch && matchesCategory;
    });
  }, [assignments, search, filterCat]);

  // Derived Stats
  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'Draft').length,
    active: assignments.filter(a => a.status === 'Published').length
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assessments</h1>
            <p className="text-slate-500 mt-1">Manage, track, and grade student assignments.</p>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="group flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 hover:shadow-md active:transform active:scale-95 transition-all duration-200 font-medium"
          >
            <PlusCircleIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Create Assignment
          </button>
        </div>

        {/* --- STATS DASHBOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            label="Total Assignments" 
            value={stats.total} 
            icon={DocumentTextIcon} 
            color="indigo" 
          />
          <StatCard 
            label="Pending Review" 
            value={stats.pending} 
            icon={ClockIcon} 
            color="orange" 
          />
          <StatCard 
            label="Active Published" 
            value={stats.active} 
            icon={CheckCircleIcon} 
            color="emerald" 
          />
        </div>

        {/* --- CONTROLS (Search & Filter) --- */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {/* Search */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search assignments..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="relative min-w-[200px]">
            <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <select 
              className="w-full pl-10 pr-8 py-2 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-lg text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Project">Project</option>
              <option value="Log">Log</option>
              <option value="Quiz">Quiz</option>
              <option value="Capstone">Capstone</option>
            </select>
          </div>
        </div>

        {/* --- GRID LIST --- */}
        {filteredAssignments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((a) => (
              <div
                key={a.id}
                onClick={() => setSelected(a)}
                className="group cursor-pointer bg-white rounded-xl p-6 shadow-sm ring-1 ring-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Decorative top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-lg ${
                      a.category === 'Capstone' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <DocumentTextIcon className="w-6 h-6" />
                  </div>
                  
                  {/* Status Badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                    a.status === 'Published' 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'Published' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                    {a.status}
                  </span>
                </div>

                <h2 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {a.title}
                </h2>
                
                <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{a.due}</span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-slate-300"></div>
                  <span>{a.category}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* --- EMPTY STATE --- */
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DocumentPlusIcon className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No assignments found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
              We couldn't find anything matching "{search}". Try adjusting your filters or create a new one.
            </p>
            <button onClick={() => setCreateOpen(true)} className="text-indigo-600 font-medium hover:underline">
              Create new assignment &rarr;
            </button>
          </div>
        )}

        {/* --- MODALS --- */}
        {createOpen && (
          <CreateAssignmentModal
            onClose={() => setCreateOpen(false)}
            onCreate={(assignment) => {
              setAssignments((p) => [...p, { ...assignment, status: "Draft" }]); // Default to Draft
              setCreateOpen(false);
            }}
          />
        )}

        {selected && (
          <AssignmentViewer
            assignment={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   SUB-COMPONENT: STAT CARD
------------------------------------------------------------------------ */
function StatCard({ label, value, icon: Icon, color }) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    orange: "bg-orange-50 text-orange-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm ring-1 ring-slate-200 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorStyles[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   CREATE ASSIGNMENT MODAL (Polished)
------------------------------------------------------------------------ */
function CreateAssignmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    category: "Project",
    due: "",
    pdf: "",
    rubrics: [],
  });

  const [newRubric, setNewRubric] = useState({ criteria: "", max: "" });

  const addRubric = () => {
    if (newRubric.criteria && newRubric.max) {
      setForm({ ...form, rubrics: [...form.rubrics, newRubric] });
      setNewRubric({ criteria: "", max: "" });
    }
  };

  const removeRubric = (index) => {
    const updated = form.rubrics.filter((_, i) => i !== index);
    setForm({ ...form, rubrics: updated });
  };

  const inputClass = "w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all placeholder:text-slate-400";

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create Assignment</h2>
            <p className="text-sm text-slate-500">Set up details and evaluation criteria.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
             <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 space-y-6">
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Assignment Title</label>
                <input
                  placeholder="e.g., Mid-Term Capstone Report"
                  className={inputClass}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Category</label>
                    <select
                        className={inputClass}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                    >
                        {["Project", "Log", "Report", "Quiz", "Capstone", "Custom"].map((c) => (
                        <option key={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Due Date</label>
                    <input
                        type="date"
                        className={inputClass}
                        onChange={(e) => setForm({ ...form, due: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Reference Document (PDF)</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition cursor-pointer group">
                    <DocumentTextIcon className="w-8 h-8 text-slate-400 mb-2 group-hover:text-indigo-500 transition-colors" />
                    <input
                        type="file"
                        className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        onChange={(e) => setForm({ ...form, pdf: URL.createObjectURL(e.target.files[0]) })}
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Rubric Criteria</h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Total: {form.rubrics.length}</span>
                </div>
                
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                    {form.rubrics.length > 0 && (
                        <div className="divide-y divide-slate-200">
                            {form.rubrics.map((r, i) => (
                                <div key={i} className="flex justify-between items-center p-3 text-sm bg-white">
                                    <span className="font-medium text-slate-700">{r.criteria}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-slate-500">{r.max} pts</span>
                                        <button onClick={() => removeRubric(i)} className="text-red-400 hover:text-red-600">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="p-3 bg-slate-50 flex gap-3 border-t border-slate-200">
                        <input
                            placeholder="Criteria Name"
                            className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newRubric.criteria}
                            onChange={(e) => setNewRubric({ ...newRubric, criteria: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            className="w-20 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={newRubric.max}
                            onChange={(e) => setNewRubric({ ...newRubric, max: e.target.value })}
                        />
                        <button
                            className="bg-indigo-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700"
                            onClick={addRubric}
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
             <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={() => onCreate({ id: Date.now(), ...form })}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-indigo-700 hover:shadow-md transition-all"
            >
                Create Assignment
            </button>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   ASSIGNMENT VIEWER (Polished)
------------------------------------------------------------------------ */
function AssignmentViewer({ assignment, onClose }) {
  const [feedback, setFeedback] = useState("");
  const [marks, setMarks] = useState({});

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[90vh] overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-white z-10">
          <div>
            <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900">{assignment.title}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                    assignment.status === 'Published' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                    {assignment.status}
                </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Due Date: {assignment.due} • {assignment.category}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition">
             <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            <div className="flex-1 bg-slate-50 p-6 overflow-y-auto border-r border-slate-200">
                <div className="bg-white border border-slate-200 rounded-xl h-full min-h-[400px] flex items-center justify-center shadow-sm relative overflow-hidden">
                    {assignment.pdf ? (
                        <iframe src={assignment.pdf} className="w-full h-full" title="PDF Viewer" />
                    ) : (
                        <div className="text-center text-slate-400">
                            <DocumentTextIcon className="w-16 h-16 mx-auto mb-2 opacity-50"/>
                            <p>No document attached</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full lg:w-[400px] flex flex-col bg-white h-full">
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Grading Rubric</h3>
                        <div className="space-y-4">
                            {assignment.rubrics.map((r, i) => (
                            <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-slate-700 text-sm">{r.criteria}</span>
                                    <span className="text-xs font-semibold text-slate-500">Max: {r.max}</span>
                                </div>
                                <input
                                    type="number"
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                    placeholder="Score"
                                    onChange={(e) => setMarks({ ...marks, [r.criteria]: e.target.value })}
                                />
                            </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">Instructor Feedback</h3>
                        <textarea
                            rows={4}
                            placeholder="Enter detailed feedback..."
                            className="w-full bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                    <button
                        className="flex-1 bg-white border border-red-200 text-red-600 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition"
                        onClick={() => { alert("Changes Requested"); onClose(); }}
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                        Request Changes
                    </button>

                    <button
                        className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 shadow-sm transition"
                        onClick={() => { alert("Approved"); onClose(); }}
                    >
                        <CheckCircleIcon className="w-5 h-5" />
                        Approve
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}