import React, { useState, useMemo, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  XMarkIcon,
  AcademicCapIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

// ------------------------------------------------------------------
// MOCK API DATA & HOOK (Backend-Ready Structure)
// Replace all MOCK API CALL sections with actual axios/fetch calls.
// ------------------------------------------------------------------

const initialData = [
    { id: 1, name: "Aarav Sharma", email: "aarav.s@edu.com", major: "CS", year: 3, status: "Active" },
    { id: 2, name: "Priya Verma", email: "priya.v@edu.com", major: "EC", year: 4, status: "Active" },
    { id: 3, name: "Rohan Gupta", email: "rohan.g@edu.com", major: "ME", year: 2, status: "On Leave" },
    { id: 4, name: "Sneha Reddy", email: "sneha.r@edu.com", major: "CE", year: 1, status: "Active" },
    { id: 5, name: "Vikram Singh", email: "vikram.s@edu.com", major: "IT", year: 4, status: "Graduated" },
    { id: 6, name: "Neha Patel", email: "neha.p@edu.com", major: "CS", year: 3, status: "Active" },
];

function useStudentsData() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Core Fetch Function (GET Request Pattern) ---
    const fetchStudents = async () => {
        setLoading(true);
        setError(null);
        try {
            // ❌ REPLACE HERE: ACTUAL API CALL (e.g., const response = await axios.get('/api/students');)
            
            // ✅ MOCK API CALL: Simulate network delay and data response
            await new Promise(resolve => setTimeout(resolve, 800)); 
            const fetchedData = initialData; 

            setStudents(fetchedData);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch student data. Please check the network connection.");
            setLoading(false);
            // console.error(err); // Log real errors here
        }
    };
    
    // Initial Data Fetch on Mount
    useEffect(() => {
        fetchStudents();
    }, []);

    // --- CRUD Operation Functions (POST/PUT/DELETE Request Patterns) ---

    const addStudent = async (student) => {
        try {
            // ❌ REPLACE HERE: ACTUAL API CALL (e.g., const response = await axios.post('/api/students', student);)
            
            // ✅ MOCK API CALL: Simulate POST success
            await new Promise(resolve => setTimeout(resolve, 300));
            const newStudent = { ...student, id: Date.now() }; // In real backend, the server assigns ID

            setStudents((prev) => [...prev, newStudent]);
        } catch (err) {
            setError("Failed to add student. Please retry.");
            // console.error(err);
        }
    };

    const updateStudent = async (editedStudent) => {
        try {
            // ❌ REPLACE HERE: ACTUAL API CALL (e.g., await axios.put(`/api/students/${editedStudent.id}`, editedStudent);)

            // ✅ MOCK API CALL: Simulate PUT success
            await new Promise(resolve => setTimeout(resolve, 300));

            // Optimistic UI update based on successful server response
            setStudents((prev) =>
                prev.map((s) => (s.id === editedStudent.id ? editedStudent : s))
            );
        } catch (err) {
            setError("Failed to update student details.");
            // console.error(err);
        }
    };

    const deleteStudent = async (id) => {
        // Optimistic UI Update: Update state before API call (for speed)
        const originalStudents = students;
        setStudents((prev) => prev.filter((s) => s.id !== id));
        
        try {
            // ❌ REPLACE HERE: ACTUAL API CALL (e.g., await axios.delete(`/api/students/${id}`);)

            // ✅ MOCK API CALL: Simulate DELETE success
            await new Promise(resolve => setTimeout(resolve, 300));

        } catch (err) {
            setError("Failed to delete student. Reverting changes.");
            setStudents(originalStudents); // Revert UI on API failure
            // console.error(err);
        }
    };

    return { students, loading, error, addStudent, updateStudent, deleteStudent, refetch: fetchStudents };
}

// ------------------------------------------------------------------
// REUSABLE COMPONENTS
// ------------------------------------------------------------------

function Input({ label, error, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input
                {...props}
                className={`w-full border px-4 py-2 rounded-lg transition-colors 
                    ${error 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
            />
            {error && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{error}</p>}
        </div>
    );
}

function Select({ label, options, error, ...props }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <select
                {...props}
                className={`w-full border px-4 py-2 rounded-lg appearance-none bg-white transition-colors
                    ${error 
                        ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                    }`}
            >
                {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600 flex items-center gap-1"><ExclamationCircleIcon className="w-4 h-4" />{error}</p>}
        </div>
    );
}

const StatusBadge = ({ status }) => {
  const colors = {
    Active: "bg-green-100 text-green-700 border-green-200",
    "On Leave": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Graduated: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium border ${
        colors[status] || "bg-gray-100 text-gray-700 border-gray-200"
      }`}
    >
      {status}
    </span>
  );
};

const StudentModal = ({ student, onClose, onSubmit, title }) => {
    const initialForm = student || { name: "", email: "", major: "", year: "", status: "Active" };
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!form.name.trim()) newErrors.name = "Full Name is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Valid Email is required.";
        if (!form.major.trim()) newErrors.major = "Major is required.";
        const year = parseInt(form.year);
        if (isNaN(year) || year < 1 || year > 5) newErrors.year = "Year must be a number between 1 and 5.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit({
                ...form,
                year: parseInt(form.year)
            });
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative animate-fade-in-up">
                
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-black p-1 transition-colors"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>

                <form onSubmit={submit} className="space-y-5">
                    
                    <Input 
                        label="Full Name" 
                        value={form.name} 
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        error={errors.name}
                        required
                    />
                    <Input 
                        label="Email" 
                        type="email" 
                        value={form.email} 
                        onChange={e => setForm({ ...form, email: e.target.value })} 
                        error={errors.email}
                        required
                    />
                    <Input 
                        label="Major/Department" 
                        value={form.major} 
                        onChange={e => setForm({ ...form, major: e.target.value })}
                        error={errors.major}
                        required 
                    />
                    <Input 
                        label="Academic Year (1-5)" 
                        type="number" 
                        value={form.year} 
                        onChange={e => setForm({ ...form, year: e.target.value })}
                        error={errors.year}
                        min="1"
                        max="5"
                        required
                    />
                    <Select 
                        label="Status" 
                        value={form.status} 
                        onChange={e => setForm({ ...form, status: e.target.value })}
                        options={["Active", "On Leave", "Graduated"]}
                    />

                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md mt-6"
                    >
                        {student ? "Save Changes" : "Add Student"}
                    </button>

                </form>
            </div>
        </div>
    );
};


// ------------------------------------------------------------------
// MAIN STUDENT MANAGEMENT UI (Phone Responsive)
// ------------------------------------------------------------------

export default function ManageStudentsUI() {
  const { students, loading, error, addStudent, updateStudent, deleteStudent, refetch } = useStudentsData();

  const [searchTerm, setSearchTerm] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const filtered = useMemo(() => {
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.major.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* ---------- HEADER AND ADD BUTTON ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3 text-gray-900">
            <AcademicCapIcon className="w-8 h-8 text-indigo-600" />
            Student Directory
          </h1>
          <p className="text-gray-600 mt-1">
            View, edit, and manage all student data.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="w-full sm:w-auto mt-4 sm:mt-0 bg-indigo-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-md"
        >
          <UserPlusIcon className="w-5 h-5" />
          Add New Student
        </button>
      </div>

      {/* ---------- SEARCH AND REFETCH BUTTON (Responsive) ---------- */}
      <div className="flex flex-col sm:flex-row gap-4 items-center mb-6">
        <div className="relative w-full sm:w-80">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
            className="w-full border border-gray-300 rounded-xl py-2.5 pl-10 pr-4 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition-shadow"
            placeholder="Search name, email, or major..."
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search students"
            />
        </div>
        <button
            onClick={refetch}
            disabled={loading}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2
                        ${loading 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        }`}
        >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refetch Data'}
        </button>
      </div>

      {/* Conditional UI based on API state */}
      {loading && (
          <div className="text-center py-12 text-gray-500">
              <div className="animate-spin inline-block w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"></div>
              <p>Loading student data...</p>
          </div>
      )}

      {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3 shadow-md">
              <ExclamationCircleIcon className="w-6 h-6" />
              <p className="font-medium">Error: {error}</p>
          </div>
      )}

      {/* ---------- TABLE (Responsive with horizontal scroll) ---------- */}
      {!loading && !error && (
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
          {/* Add overflow-x-auto for phone responsiveness */}
          <div className="overflow-x-auto"> 
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  {/* Min widths ensure columns are usable on small screens */}
                  <th className="px-6 py-4 text-left min-w-[150px]">Name</th>
                  <th className="px-6 py-4 text-left hidden sm:table-cell min-w-[200px]">Email</th>
                  <th className="px-6 py-4 text-left hidden md:table-cell min-w-[120px]">Major</th>
                  <th className="px-6 py-4 text-left hidden md:table-cell min-w-[80px]">Year</th>
                  <th className="px-6 py-4 text-left min-w-[100px]">Status</th>
                  <th className="px-6 py-4 text-right min-w-[100px]">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-indigo-50/20 transition-colors">
                    {/* Name column (always visible) */}
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {s.name}
                      {/* Mobile View Enhancement: show email/major under name on smallest screens */}
                      <div className="text-xs text-gray-500 sm:hidden mt-0.5 truncate">{s.email}</div>
                    </td>
                    
                    {/* Email column (hidden on smallest screens) */}
                    <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell whitespace-nowrap">{s.email}</td>
                    
                    {/* Major/Year (hidden on tablet/phone screens) */}
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">{s.major}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell whitespace-nowrap">{s.year}</td>
                    
                    {/* Status column (always visible) */}
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <StatusBadge status={s.status} />
                    </td>

                    {/* Actions column (always visible) */}
                    <td className="px-6 py-4 text-right flex justify-end gap-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setEditingStudent(s)}
                        className="p-2 text-indigo-600 hover:text-white hover:bg-indigo-600 rounded-full transition-colors"
                        title="Edit Student"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => {
                            if (window.confirm(`Are you sure you want to delete ${s.name}? This action cannot be undone.`)) {
                                deleteStudent(s.id);
                            }
                        }}
                        className="p-2 text-red-600 hover:text-white hover:bg-red-600 rounded-full transition-colors"
                        title="Delete Student"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-lg text-gray-500">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAdd && (
        <StudentModal 
            onClose={() => setShowAdd(false)} 
            onSubmit={addStudent} 
            title="Add New Student"
        />
      )}
      {editingStudent && (
        <StudentModal
          onClose={() => setEditingStudent(null)}
          onSubmit={updateStudent}
          student={editingStudent}
          title={`Edit ${editingStudent.name}`}
        />
      )}
    </div>
  );
}