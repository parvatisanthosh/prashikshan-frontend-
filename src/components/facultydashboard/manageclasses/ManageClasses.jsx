import React, { useState, useMemo } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  AcademicCapIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/solid";
import CreateClass from "./CreateClass.jsx";

/**
 * ManageClasses.jsx
 *
 * Props:
 *  - classList: Array of class objects { id, name, section, students, logsPending, status }
 *  - setClassList: setter function from parent state
 *
 * Behavior:
 *  - Shows the list of classes (searchable)
 *  - Clicking "Create New Class" opens the CreateClass form (inline)
 *  - CreateClass must call onClassCreated(newClass) to add the created class
 */

export default function ManageClasses({ classList = [], setClassList }) {
  const [isCreating, setIsCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name"); // 'name' or 'students' or 'status'
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Filtered + sorted results (memoized)
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = classList.slice();

    if (q) {
      items = items.filter(
        (c) =>
          (c.name || "").toLowerCase().includes(q) ||
          (c.section || "").toLowerCase().includes(q) ||
          (c.id || "").toLowerCase().includes(q)
      );
    }

    if (sortBy === "name") {
      items.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "students") {
      items.sort((a, b) => (b.students || 0) - (a.students || 0));
    } else if (sortBy === "status") {
      items.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
    }

    return items;
  }, [classList, query, sortBy]);

  // Handler: when CreateClass finishes and returns newClass
  const handleClassCreated = (newClass) => {
    if (!newClass || !newClass.id) {
      console.warn("ManageClasses: onClassCreated called without valid newClass", newClass);
      setIsCreating(false);
      return;
    }

    // Prevent duplicate id
    setClassList((prev) => {
      const exists = prev.some((c) => c.id === newClass.id);
      if (exists) return prev.concat(); // no change
      return [...prev, newClass];
    });

    // Return to list view
    setIsCreating(false);
  };

  // Delete flow (shows simple confirm)
  const handleRequestDelete = (id) => {
    setSelectedIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (selectedIdToDelete) {
      setClassList((prev) => prev.filter((c) => c.id !== selectedIdToDelete));
    }
    setSelectedIdToDelete(null);
    setShowConfirmDelete(false);
  };

  const handleCancelDelete = () => {
    setSelectedIdToDelete(null);
    setShowConfirmDelete(false);
  };

  // Placeholder edit and view actions - integrate with modals/routes as needed
  const handleEdit = (id) => {
    console.log("Edit class", id);
    // TODO: open edit modal or route to edit page
  };

  const handleView = (id) => {
    console.log("View class roster/details", id);
    // TODO: route to Class Details / Roster page
  };

  // Render create form
  if (isCreating) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsCreating(false)}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Class List
          </button>

          <h2 className="text-2xl font-bold text-slate-800">Create Class</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6">
          {/* CreateClass accepts onClassCreated(newClass) */}
          <CreateClass onClassCreated={handleClassCreated} />
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800">Manage Classes</h1>
          <p className="text-slate-500 mt-1">View, search, edit, or create classes.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, id or section..."
              className="pl-9 pr-3 py-2 rounded-full border border-slate-200 w-56 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-white text-sm"
          >
            <option value="name">Sort: Name</option>
            <option value="students">Sort: Students (desc)</option>
            <option value="status">Sort: Status</option>
          </select>

          {/* Create button */}
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-md"
          >
            <PlusIcon className="h-4 w-4" />
            Create New
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow border text-slate-500">
            No classes match your search. Click <strong>Create New</strong> to add one.
          </div>
        ) : (
          filtered.map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl shadow-xl border p-6 flex flex-col">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 rounded-full text-indigo-600 shadow-sm">
                  <AcademicCapIcon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                  <p className="text-sm text-slate-500">Section {cls.section}</p>
                  <p className="text-xs text-slate-400 mt-2">{cls.id}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 border-y py-3">
                <div className="text-sm">
                  <div className="font-semibold">Students: {cls.students ?? 0}</div>
                  <div className="text-xs text-slate-500">Logs Pending: {cls.logsPending ?? 0}</div>
                </div>

                <div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      cls.status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {cls.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => handleView(cls.id)}
                  className="text-indigo-600 font-semibold"
                >
                  View Roster
                </button>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleEdit(cls.id)}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-slate-600"
                    title="Edit Class"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </button>

                  <button
                    onClick={() => handleRequestDelete(cls.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-600"
                    title="Delete Class"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Confirm delete modal (simple inline dialog) */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={handleCancelDelete} />
          <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold">Delete class?</h3>
            <p className="text-slate-600 mt-2">This will permanently remove the class. Are you sure?</p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
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
