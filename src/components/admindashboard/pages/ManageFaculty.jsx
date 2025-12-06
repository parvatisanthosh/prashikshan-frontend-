import React, { useState } from "react";
import { 
  TrashIcon, 
  UserIcon, 
  EnvelopeIcon, 
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  FunnelIcon,
  PencilSquareIcon,
  EyeIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/solid";
import { UserPlusIcon } from "@heroicons/react/24/outline";

export default function ManageFaculty({ facultyList, removeFaculty, setActivePage }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [sortBy, setSortBy] = useState("name");

  // Get unique departments from faculty list
  const departments = ["all", ...new Set(facultyList.map(f => f.dept))];

  // Filter and sort faculty
  const filteredFaculty = facultyList
    .filter((faculty) => {
      const matchesSearch = 
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.dept.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === "all" || faculty.dept === selectedDept;
      return matchesSearch && matchesDept;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "dept") return a.dept.localeCompare(b.dept);
      if (sortBy === "email") return a.email.localeCompare(b.email);
      return 0;
    });

  const handleDelete = (id) => {
    removeFaculty(id);
    setDeleteConfirm(null);
  };

  // Delete Confirmation Modal
  const DeleteModal = ({ faculty }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-[scale-in_0.2s_ease-out]">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
          <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 text-center mb-6">
          Are you sure you want to remove <span className="font-semibold text-gray-900">{faculty.name}</span>? This action cannot be undone.
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(faculty.id)}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // View Details Modal
  const DetailsModal = ({ faculty }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-[scale-in_0.2s_ease-out]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Faculty Details</h3>
          <button
            onClick={() => setViewDetails(null)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {faculty.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{faculty.name}</h4>
              <p className="text-sm text-gray-600">Faculty Member</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <EnvelopeIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Email Address</p>
                <p className="text-gray-900 font-medium">{faculty.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <BuildingOffice2Icon className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Department</p>
                <p className="text-gray-900 font-medium">{faculty.dept}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <UserIcon className="w-5 h-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500 mb-1">Faculty ID</p>
                <p className="text-gray-900 font-medium">#{faculty.id}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setViewDetails(null)}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          <button
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <PencilSquareIcon className="w-5 h-5" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Faculty</h1>
        <p className="text-gray-600">View, search, and manage all faculty members in your institution</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-indigo-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Total Faculty</p>
              <p className="text-4xl font-bold text-gray-900">{facultyList.length}</p>
            </div>
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-purple-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Departments</p>
              <p className="text-4xl font-bold text-gray-900">{departments.length - 1}</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <BuildingOffice2Icon className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-pink-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Active Results</p>
              <p className="text-4xl font-bold text-gray-900">{filteredFaculty.length}</p>
            </div>
            <div className="w-14 h-14 bg-pink-100 rounded-xl flex items-center justify-center">
              <MagnifyingGlassIcon className="w-8 h-8 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Department Filter */}
          <div className="relative lg:w-64">
            <FunnelIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white cursor-pointer transition-all text-gray-900 font-medium"
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== "all").map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-5 border-t border-gray-200">
          <span className="text-sm text-gray-600 font-semibold">Sort by:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "name", label: "Name" },
              { value: "dept", label: "Department" },
              { value: "email", label: "Email" }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  sortBy === option.value
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Faculty List */}
      {filteredFaculty.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-xl shadow-sm border border-gray-200">
          <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            {searchTerm || selectedDept !== "all" ? (
              <MagnifyingGlassIcon className="w-10 h-10 text-gray-400" />
            ) : (
              <UserPlusIcon className="w-10 h-10 text-gray-400" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm || selectedDept !== "all" ? "No results found" : "No faculty added yet"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm || selectedDept !== "all" 
              ? "Try adjusting your search or filter criteria" 
              : "Start by adding your first faculty member to the system"}
          </p>
          {!searchTerm && selectedDept === "all" && setActivePage && (
            <button 
              onClick={() => setActivePage("addfaculty")}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <UserPlusIcon className="w-5 h-5" />
              Add First Faculty
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFaculty.map((faculty, index) => (
            <div
              key={faculty.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Faculty Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                    {faculty.name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      {faculty.name}
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                        #{faculty.id}
                      </span>
                    </h2>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{faculty.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BuildingOffice2Icon className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{faculty.dept}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => setViewDetails(faculty)}
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2"
                  >
                    <EyeIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  
                  <button
                    className="px-4 py-2 bg-gray-50 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  
                  <button
                    onClick={() => setDeleteConfirm(faculty)}
                    className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <TrashIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {deleteConfirm && <DeleteModal faculty={deleteConfirm} />}
      {viewDetails && <DetailsModal faculty={viewDetails} />}
    </div>
  );
}