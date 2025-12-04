import React, { useState } from 'react';

// Icons used across the dashboard 
import { 
    ClipboardDocumentCheckIcon, 
    ArrowRightIcon, 
    CheckCircleIcon, 
    MagnifyingGlassIcon,
    PlusIcon, 
    PencilSquareIcon, 
    TrashIcon, 
    AcademicCapIcon, 
    UsersIcon, 
    CalendarIcon, 
    HashtagIcon 
} from '@heroicons/react/24/solid';

// Mock UI for other missing tabs
const MissingTabUI = ({ tabName }) => (
    <div className="p-10 max-w-7xl mx-auto space-y-8 text-center bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-3xl font-bold text-red-600">Module Under Construction</h2>
        <p className="text-xl text-slate-600">The **{tabName}** module is being built next!</p>
        <p className="text-sm text-slate-500">Please select 'Dashboard' or 'Manage Classes'.</p>
    </div>
);

// Mock Data
const PENDING_REVIEWS = [
    { id: 1, student: "Aditi Verma", task: "Python Project Log #4", date: "2 hrs ago", status: "Pending" },
    { id: 2, student: "Rahul Singh", task: "Internship Week 3 Report", date: "5 hrs ago", status: "Pending" },
    { id: 3, student: "Sneha P.", task: "Capstone Proposal", date: "1 day ago", status: "Urgent" },
];

const RECENT_STUDENTS = [
    { id: 101, name: "Aditi Verma", roll: "CS-21-045", progress: 75, status: "Active" },
    { id: 102, name: "Rahul Singh", roll: "CS-21-012", progress: 40, status: "Behind" },
    { id: 103, name: "Sneha P.", roll: "CS-21-033", progress: 90, status: "Excelled" },
    { id: 104, name: "Vikram R.", roll: "CS-21-055", progress: 60, status: "Active" },
];

const SAMPLE_CLASSES = [
  {
    id: "CSE101",
    name: "CSE101 - Introduction to Programming",
    section: "A",
    students: 32,
    logsPending: 5,
    status: "Active",
  },
  {
    id: "CSE202",
    name: "CSE202 - Data Structures",
    section: "B",
    students: 28,
    logsPending: 0,
    status: "Active",
  },
  {
    id: "CSE301",
    name: "CSE301 - Operating Systems",
    section: "A",
    students: 41,
    logsPending: 0,
    status: "Completed",
  },
];


// -------------------- 1. OVERVIEW UI (The Default Dashboard View) --------------------
function OverviewUI() {
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Dashboard Overview</h2>
                <p className="text-slate-500 mt-1">Welcome back. Get a quick summary of pending tasks and class performance.</p>
            </div>

            {/* SECTION A: ACTION CENTER AND STATS */}
            <section className="grid lg:grid-cols-3 gap-6">
                
                {/* 1. Pending Logs Card (Primary Action) */}
                <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-2xl p-8 relative overflow-hidden shadow-2xl shadow-indigo-500/30">
                    
                    <div className="flex justify-between items-start mb-6">
                        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/50">
                            Urgent Review
                        </span>
                        <ClipboardDocumentCheckIcon className="h-10 w-10 opacity-70" />
                    </div>

                    <h3 className="text-5xl font-extrabold mb-1">3 Logs Pending</h3>
                    <p className="text-indigo-100 mb-8 leading-normal">
                        Review logs submitted by students to keep their evaluation on track.
                    </p>
                    <button className="bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-3.5 rounded-full font-bold flex items-center shadow-lg transition-all active:scale-95">
                        Review Now <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                </div>

                {/* 2. Attendance Stats Card */}
                <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                    <CheckCircleIcon className="h-14 w-14 text-green-600 mb-3" />
                    <h4 className="text-5xl font-extrabold text-slate-900">92%</h4>
                    <p className="text-slate-500 font-medium mt-1">Average Attendance</p>
                    <p className="text-xs text-green-700 mt-3 bg-green-50 px-3 py-1 rounded-full font-semibold">
                        On track
                    </p>
                </div>

            </section>

            {/* SECTION B: REVIEW QUEUE AND STUDENTS LISTS */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* 1. Review Queue List */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800">Recent Review Submissions</h3>
                    </div>

                    {PENDING_REVIEWS.map((item) => (
                        <div key={item.id} className="p-4 flex justify-between items-center border-b border-slate-50 last:border-b-0 hover:bg-indigo-50/50 transition cursor-pointer">
                            <div>
                                <p className="font-semibold text-slate-900">{item.task}</p>
                                <p className="text-xs text-slate-500">{item.student} • {item.date}</p>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                item.status === 'Urgent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                                {item.status}
                            </span>
                        </div>
                    ))}
                    <div className="p-4 text-center border-t border-slate-100">
                         <button className="text-sm text-indigo-600 font-semibold hover:underline">View All Logs</button>
                    </div>
                </div>

                {/* 2. Students List Snippet */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-100">
                        <h3 className="font-bold text-lg text-slate-800">Assigned Student Snapshot</h3>
                    </div>

                    {RECENT_STUDENTS.slice(0, 4).map((s) => (
                        <div key={s.id} className="p-4 flex justify-between items-center border-b border-slate-50 last:border-b-0 hover:bg-indigo-50/50 transition cursor-pointer">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">{s.name.charAt(0)}</div>
                                <div>
                                    <p className="font-semibold text-slate-900">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.roll}</p>
                                </div>
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                s.status === 'Behind' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                            }`}>
                                {s.status}
                            </span
                        ></div>
                    ))}
                    <div className="p-4 text-center border-t border-slate-100">
                        <button className="text-sm text-indigo-600 font-semibold hover:underline">View Full Roster</button>
                    </div>
                </div>

            </div>
        </div>
    );
}

// -------------------- MANAGE CLASSES UI (Consolidated) --------------------
function ManageClassesConsolidatedUI() {
    // We use local state (useState) here to manage the view switch within this single tab content.
    const [isCreating, setIsCreating] = useState(false);
    const [creationStatus, setCreationStatus] = useState({ loading: false, error: null, success: false, classId: null });

    // --- Create Class Form Handlers (Internal Logic) ---
    const [formData, setFormData] = useState({}); // Simple form state

    const handleFormChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        setCreationStatus({ loading: true, error: null, success: false });

        // Basic validation check
        if (!formData.className || !formData.classCode) {
             setCreationStatus({ loading: false, error: 'Name and Code are required.', success: false });
             return;
        }

        // Simulate API call and success callback
        setTimeout(() => {
            setCreationStatus({ 
                loading: false, 
                error: null, 
                success: true, 
                classId: 'CLASS_CSE321_2025'
            });
        }, 1500);
    };

    // Handler to switch back to the list view after success/cancellation
    const handleBackToList = () => {
        setIsCreating(false);
        setCreationStatus({ loading: false, error: null, success: false }); // Reset status
        setFormData({}); // Clear form data
    };
    
    // --- List View Handlers ---
    const handleEdit = (id) => console.log(`Editing class ${id}`);
    const handleDelete = (id) => console.log(`Deleting class ${id}`);
    const handleView = (id) => console.log(`Viewing class details ${id}`);

    // --- Render View Switch ---
    if (isCreating) {
        
        const status = creationStatus;
        
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="flex justify-start mb-6">
                    <button 
                        onClick={handleBackToList} 
                        className="flex items-center text-indigo-600 hover:text-indigo-800 transition font-semibold"
                    >
                        <ArrowRightIcon className="h-4 w-4 mr-1 transform rotate-180" />
                        Back to Class List
                    </button>
                </div>
                
                {/* --- CREATE CLASS FORM --- */}
                <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
                    
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8">
                        
                        {status.error && (
                            <div className="p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 rounded-lg border border-red-200">
                                Error: {status.error}
                            </div>
                        )}
                        
                        {status.success ? (
                            /* SUCCESS STATE */
                            <div className="p-6 bg-green-50 rounded-xl border border-green-200 space-y-4 text-center">
                                <h3 className="text-xl font-bold text-green-700">Class Created Successfully!</h3>
                                <p className="text-sm text-green-600">Share this link for student enrollment:</p>
                                
                                <input readOnly value={`[Your App URL]/enroll/${status.classId}`} className="w-full text-center px-4 py-2 bg-white border border-green-300 rounded-lg font-mono text-sm shadow-inner" />

                                <div className="flex gap-4 justify-center pt-2">
                                    <button
                                        type="button"
                                        onClick={handleBackToList}
                                        className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition"
                                    >
                                        Done (Go to List)
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* FORM FIELDS */
                            <form onSubmit={handleCreateSubmit} className="space-y-6">
                                
                                <h3 className="text-xl font-bold text-indigo-600 border-b border-indigo-100 pb-2">1. Class Identity</h3>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {/* Class Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Name *</label>
                                        <input name="className" onChange={handleFormChange} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g. Data Structures & Algorithms" />
                                    </div>
                                    {/* Class Code */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Course Code (Unique) *</label>
                                        <div className="relative">
                                            <HashtagIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                            <input name="classCode" onChange={handleFormChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" placeholder="e.g. CSE321" />
                                        </div>
                                    </div>
                                    {/* Department (Dropdown) */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                        <div className="relative">
                                            <AcademicCapIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                            <select name="department" onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-indigo-500 transition">
                                                <option value="">Select Department</option>
                                                <option value="CSE">Computer Science</option>
                                                <option value="ECE">Electronics & Comm.</option>
                                                <option value="MECH">Mechanical</option>
                                                <option value="HSS">Humanities</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* Section */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                                        <input name="section" onChange={handleFormChange} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" placeholder="A, B, C, or leave blank" />
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-indigo-600 border-b border-indigo-100 pb-2 pt-4">2. Scheduling & Capacity</h3>
                                
                                <div className="grid md:grid-cols-3 gap-4">
                                    {/* Start Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                                        <div className="relative">
                                            <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                            <input name="startDate" type="date" onChange={handleFormChange} required className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
                                        </div>
                                    </div>
                                    {/* End Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                        <div className="relative">
                                            <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                            <input name="endDate" type="date" onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" />
                                        </div>
                                    </div>
                                    {/* Max Students */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Max Students</label>
                                        <div className="relative">
                                            <UsersIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                            <input name="maxStudents" type="number" min="1" onChange={handleFormChange} className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" defaultValue={50} />
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea name="description" onChange={handleFormChange} rows="3" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition" placeholder="Briefly describe the course objectives, requirements, or focus areas." />
                                </div>
                                
                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button type="submit" disabled={creationStatus.loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transition-all active:scale-[0.98] disabled:opacity-50">
                                        {creationStatus.loading ? "Creating Class..." : "Create Class & Get Enrollment Link"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    
    // --- Render List View ---
    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Manage Classes</h1>
                <p className="text-slate-500 mt-1">View, edit, or create new class and mentorship groups.</p>
                </div>
                <button 
                onClick={() => setIsCreating(true)} // Toggles to the creation form
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition transform active:scale-98 text-sm"
                >
                <PlusIcon className="h-5 w-5" />
                Create New Class
                </button>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SAMPLE_CLASSES.map((cls) => (
                <div 
                    key={cls.id} 
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col gap-4 transition hover:shadow-2xl hover:-translate-y-0.5"
                >
                    
                    {/* Title & Icon */}
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 shadow-sm">
                            <AcademicCapIcon className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{cls.name}</h2>
                            <p className="text-sm text-slate-500">Section {cls.section}</p>
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="flex justify-between items-center border-y border-slate-100 py-3">
                        <span className="text-sm font-semibold text-slate-700">
                            Total Students: {cls.students}
                        </span>

                        {cls.logsPending > 0 ? (
                            <span className="text-sm font-bold px-3 py-1 rounded-full bg-red-100 text-red-700 shadow-sm animate-pulse">
                            {cls.logsPending} Pending Logs
                            </span>
                        ) : (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                cls.status === "Active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-slate-200 text-slate-700"
                                }`}>
                                {cls.status}
                            </span>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex justify-between items-center pt-2">
                        
                        <button 
                            onClick={() => handleView(cls.id)}
                            className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition"
                        >
                            View Roster
                        </button>

                        <div className="flex gap-3">
                            {/* Edit Button */}
                            <button 
                                onClick={() => handleEdit(cls.id)}
                                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                title="Edit Class Details"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>

                            {/* Delete Button */}
                            <button 
                                onClick={() => handleDelete(cls.id)}
                                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete Class"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </div>

                    </div>

                </div>
                ))}
            </div>

            {/* Empty State (if no classes exist) */}
            {SAMPLE_CLASSES.length === 0 && (
                <div className="text-center text-slate-500 py-16 bg-white rounded-xl shadow-lg border border-slate-100 mt-8">
                <p className="text-lg">No classes assigned yet.</p>
                <p className="mt-2 text-sm">Use the "Create New Class" button to get started.</p>
                </div>
            )}

        </div>
    );
}


// -------------------- MAIN SWITCH --------------------
export default function FacultyDashboardMain({ 
    activeTab, 
    classList, 
    setClassList 
}) {

    switch (activeTab) {

        case "Dashboard":
        case "Overview":
            return <OverviewUI />;

        case "Manage Classes":
            // Pass the dynamic class list to the UI
            return <ManageClassesConsolidatedUI classList={classList} />;

        case "Create Class":
            // Needed so CreateClass can push new class into list
            return <CreateClass setClassList={setClassList} />;

        case "Assigned Students":
            return <MissingTabUI tabName="Assigned Students" />;

        case "Pending Reviews":
            return <MissingTabUI tabName="Pending Reviews" />;

        case "Assessments":
            return <MissingTabUI tabName="Assessments" />;

        case "Reports and Signoff":
            return <MissingTabUI tabName="Reports and Signoff" />;

        case "Chat Faculty Student":
            return <MissingTabUI tabName="Chat Faculty Student" />;

        default:
            return <OverviewUI />;
    }
}
