import React, { useState, useEffect } from "react";
import facultyService from "../../../services/Facultyservice";

/**
 * AssignedStudents (API integrated)
 *
 * Features:
 * - Fetches students from backend via facultyService
 * - Add/remove student functionality integrated with API
 * - Loading states and error handling
 * - Progress shown with a visual bar and percentage
 * - Modal details on row click and delete student action
 */

export default function AssignedStudents({ selectedClassId }) {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [classes, setClasses] = useState([]);
  const [currentClassId, setCurrentClassId] = useState(selectedClassId || null);

  // form state
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingStudents, setFetchingStudents] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (currentClassId) {
      fetchStudents();
    }
  }, [currentClassId]);

  const fetchClasses = async () => {
    try {
      const classesData = await facultyService.getClasses();
      setClasses(classesData);
      if (classesData.length > 0 && !currentClassId) {
        setCurrentClassId(classesData[0].id || classesData[0]._id);
      }
    } catch (err) {
      console.error("Error fetching classes:", err);
    }
  };

  const fetchStudents = async () => {
    if (!currentClassId) return;
    
    try {
      setFetchingStudents(true);
      const studentsData = await facultyService.getStudentsInClass(currentClassId);
      setStudents(studentsData);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to load students");
    } finally {
      setFetchingStudents(false);
    }
  };

  // add student handler
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentClassId) {
      setError("Please select a class first");
      return;
    }

    const trimmedName = name.trim();
    const trimmedRoll = roll.trim().toUpperCase();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedRoll) {
      setError("Name and roll number are required.");
      return;
    }

    setLoading(true);
    try {
      const newStudent = await facultyService.addStudentToClass(currentClassId, {
        name: trimmedName,
        rollNumber: trimmedRoll,
        email: trimmedEmail
      });
      
      setStudents((prev) => [newStudent, ...prev]);
      setName("");
      setRoll("");
      setEmail("");
    } catch (err) {
      console.error("Error adding student:", err);
      setError(err.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (studentId, rollToDelete) => {
    if (!currentClassId) return;
    
    try {
      await facultyService.removeStudentFromClass(currentClassId, studentId);
      setStudents((prev) => prev.filter((s) => (s.id || s._id) !== studentId));
      if (selected && (selected.id === studentId || selected._id === studentId)) {
        setSelected(null);
      }
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to remove student. Please try again.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Assigned Students</h1>

      {/* Class Selector */}
      {classes.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Class</label>
          <select
            value={currentClassId || ""}
            onChange={(e) => setCurrentClassId(e.target.value)}
            className="w-full md:w-1/3 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">-- Select a class --</option>
            {classes.map((cls) => (
              <option key={cls.id || cls._id} value={cls.id || cls._id}>
                {cls.className || cls.name} ({cls.classCode || cls.code})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow p-5">
          <h2 className="text-lg font-semibold mb-3">Add Student</h2>

          <form onSubmit={handleAdd} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aman Kumar"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                disabled={loading}
                aria-label="Student name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Roll No</label>
              <input
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
                placeholder="e.g. CS201"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                disabled={loading}
                aria-label="Roll number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email (optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. student@example.com"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                disabled={loading}
                aria-label="Student email"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading || !currentClassId}
                className={`flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-2 rounded-md font-medium transition-opacity disabled:opacity-60`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Adding student...
                  </>
                ) : (
                  "Add Student"
                )}
              </button>

              <button
                type="button"
                onClick={() => { setName(""); setRoll(""); setEmail(""); setError(""); }}
                disabled={loading}
                className="px-3 py-2 border rounded-md"
              >
                Reset
              </button>
            </div>

            {!currentClassId && (
              <p className="text-xs text-amber-600">Please select a class first</p>
            )}
          </form>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Students ({students.length})</h2>
            <div className="text-sm text-slate-500">Click a row for details</div>
          </div>

          {fetchingStudents ? (
            <div className="py-10 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-2 text-slate-500">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="py-10 text-center text-slate-500">
              {currentClassId ? "No students assigned yet." : "Please select a class to view students."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3 hidden md:table-cell">Roll No</th>
                    <th className="p-3 w-48">Progress</th>
                    <th className="p-3 w-24 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => {
                    const studentId = s.id || s._id;
                    const studentName = s.name || s.studentName;
                    const studentRoll = s.roll || s.rollNumber;
                    const studentProgress = s.progress || s.completionPercentage || 0;
                    
                    return (
                      <tr
                        key={studentId}
                        className="hover:bg-indigo-50 cursor-pointer"
                        onClick={() => setSelected(s)}
                      >
                        <td className="p-3 align-middle">
                          <div className="font-medium">{studentName}</div>
                          <div className="text-xs text-slate-500 md:hidden">{studentRoll}</div>
                        </td>

                        <td className="p-3 align-middle hidden md:table-cell">{studentRoll}</td>

                        <td className="p-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${studentProgress}%`,
                                    background:
                                      studentProgress >= 85
                                        ? "linear-gradient(90deg,#059669,#10b981)"
                                        : studentProgress >= 60
                                        ? "linear-gradient(90deg,#f59e0b,#f97316)"
                                        : "linear-gradient(90deg,#ef4444,#f97316)",
                                  }}
                                />
                              </div>
                            </div>
                            <div className="w-12 text-right font-medium">{studentProgress}%</div>
                          </div>
                        </td>

                        <td className="p-3 text-right align-middle">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Delete ${studentName} (${studentRoll})?`)) {
                                handleDelete(studentId, studentRoll);
                              }
                            }}
                            className="px-2 py-1 text-sm border rounded-md hover:bg-red-50"
                            title="Delete student"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (() => {
        const studentId = selected.id || selected._id;
        const studentName = selected.name || selected.studentName;
        const studentRoll = selected.roll || selected.rollNumber;
        const studentProgress = selected.progress || selected.completionPercentage || 0;
        const studentEmail = selected.email || "";
        
        return (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{studentName}</h3>
                  <div className="text-sm text-slate-500">Roll: {studentRoll}</div>
                  {studentEmail && (
                    <div className="text-sm text-slate-500">Email: {studentEmail}</div>
                  )}
                </div>
                <div className="text-sm text-slate-500">{studentProgress}%</div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-600 mb-2">Progress overview</div>
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${studentProgress}%`,
                      background:
                        studentProgress >= 85
                          ? "linear-gradient(90deg,#059669,#10b981)"
                          : studentProgress >= 60
                          ? "linear-gradient(90deg,#f59e0b,#f97316)"
                          : "linear-gradient(90deg,#ef4444,#f97316)",
                    }}
                  />
                </div>
                <p className="mt-3 text-sm text-slate-600">
                  Student progress and performance metrics.
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
                <button
                  className="px-3 py-2 border rounded-md hover:bg-red-50"
                  onClick={() => {
                    if (confirm(`Delete ${studentName} (${studentRoll})?`)) {
                      handleDelete(studentId, studentRoll);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
