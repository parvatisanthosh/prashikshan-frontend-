import React, { useState } from "react";

/**
 * AssignedStudents (improved)
 *
 * Features:
 * - Cleaner card layout, responsive.
 * - Inline add-student form (name + roll). Submit triggers a simulated "fetch" for progress.
 * - Deterministic progress calculation based on roll (so same roll => same progress).
 * - Loading state with spinner while "fetching".
 * - Validation (required fields + duplicate roll prevention).
 * - Progress shown with a visual bar and percentage.
 * - Modal details on row click and delete student action.
 */

const INITIAL_STUDENTS = [
  { name: "Aditi Verma", roll: "CS101", progress: 80 },
  { name: "Rahul Singh", roll: "CS102", progress: 60 },
  { name: "Sneha P", roll: "CS103", progress: 92 },
];

// deterministic "fetch" for progress from roll string (so it feels like fetch but reproducible)
function computeProgressFromRoll(roll) {
  if (!roll) return 0;
  let sum = 0;
  for (let i = 0; i < roll.length; i++) sum += roll.charCodeAt(i) * (i + 1);
  // map sum to a 40-98 range
  const pct = 40 + (sum % 59); // 40..98
  return pct;
}

export default function AssignedStudents() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [selected, setSelected] = useState(null);

  // form state
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // add student handler (simulates fetching progress)
  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const trimmedRoll = roll.trim().toUpperCase();

    if (!trimmedName || !trimmedRoll) {
      setError("Both name and roll number are required.");
      return;
    }

    // prevent duplicate roll
    if (students.some((s) => s.roll.toUpperCase() === trimmedRoll)) {
      setError("A student with this roll number already exists.");
      return;
    }

    setLoading(true);
    // simulate network delay
    setTimeout(() => {
      const progress = computeProgressFromRoll(trimmedRoll);
      const newStudent = {
        name: trimmedName,
        roll: trimmedRoll,
        progress,
      };
      setStudents((prev) => [newStudent, ...prev]);
      setName("");
      setRoll("");
      setLoading(false);
    }, 700);
  };

  const handleDelete = (rollToDelete) => {
    setStudents((prev) => prev.filter((s) => s.roll !== rollToDelete));
    if (selected && selected.roll === rollToDelete) setSelected(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Assigned Students</h1>

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

            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
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
                    Fetching progress...
                  </>
                ) : (
                  "Add & Fetch Progress"
                )}
              </button>

              <button
                type="button"
                onClick={() => { setName(""); setRoll(""); setError(""); }}
                disabled={loading}
                className="px-3 py-2 border rounded-md"
              >
                Reset
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Progress is automatically computed from the roll number (deterministic).
            </p>
          </form>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Students ({students.length})</h2>
            <div className="text-sm text-slate-500">Click a row for details</div>
          </div>

          {students.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No students assigned yet.</div>
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
                  {students.map((s) => (
                    <tr
                      key={s.roll}
                      className="hover:bg-indigo-50 cursor-pointer"
                      onClick={() => setSelected(s)}
                    >
                      <td className="p-3 align-middle">
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-slate-500 md:hidden">{s.roll}</div>
                      </td>

                      <td className="p-3 align-middle hidden md:table-cell">{s.roll}</td>

                      <td className="p-3 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${s.progress}%`,
                                  background:
                                    s.progress >= 85
                                      ? "linear-gradient(90deg,#059669,#10b981)"
                                      : s.progress >= 60
                                      ? "linear-gradient(90deg,#f59e0b,#f97316)"
                                      : "linear-gradient(90deg,#ef4444,#f97316)",
                                }}
                              />
                            </div>
                          </div>
                          <div className="w-12 text-right font-medium">{s.progress}%</div>
                        </div>
                      </td>

                      <td className="p-3 text-right align-middle">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete ${s.name} (${s.roll})?`)) handleDelete(s.roll);
                          }}
                          className="px-2 py-1 text-sm border rounded-md"
                          title="Delete student"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selected && (
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
                <h3 className="text-xl font-bold">{selected.name}</h3>
                <div className="text-sm text-slate-500">Roll: {selected.roll}</div>
              </div>
              <div className="text-sm text-slate-500">{selected.progress}%</div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-slate-600 mb-2">Progress overview</div>
              <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${selected.progress}%`,
                    background:
                      selected.progress >= 85
                        ? "linear-gradient(90deg,#059669,#10b981)"
                        : selected.progress >= 60
                        ? "linear-gradient(90deg,#f59e0b,#f97316)"
                        : "linear-gradient(90deg,#ef4444,#f97316)",
                  }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                This progress value is computed from the student's roll number deterministically.
                Use the "Add Student" card to add another student.
              </p>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                className="flex-1 bg-indigo-600 text-white py-2 rounded-md"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
              <button
                className="px-3 py-2 border rounded-md"
                onClick={() => {
                  if (confirm(`Delete ${selected.name} (${selected.roll})?`)) {
                    handleDelete(selected.roll);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
