import React, { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  FunnelIcon,
  ArrowPathIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

// --- MODAL COMPONENT (Outside to prevent typing bugs) ---
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  student, 
  driveId, 
  drivesList, 
  reason, 
  setReason, 
  onConfirm, 
  submitting 
}) => {
  if (!isOpen) return null;

  const selectedDriveData = drivesList.find(d => d.id === driveId);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
              <ShieldExclamationIcon className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Confirm Force Add</h3>
              <p className="text-sm text-gray-600">Review details before proceeding</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Student Info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <AcademicCapIcon className="w-4 h-4" />
              Student Details
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Name:</span>
                <p className="text-blue-900 font-semibold">{student?.name}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Roll No:</span>
                <p className="text-blue-900 font-semibold">{student?.rollNo}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">CGPA:</span>
                <p className="text-blue-900 font-semibold">{student?.cgpa}</p>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Backlogs:</span>
                <p className="text-blue-900 font-semibold">{student?.backlogs}</p>
              </div>
            </div>
          </div>

          {/* Drive Info */}
          {selectedDriveData && (
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                <BuildingOffice2Icon className="w-4 h-4" />
                Placement Drive
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Company:</span>
                  <span className="text-green-900 font-semibold">{selectedDriveData.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Position:</span>
                  <span className="text-green-900 font-semibold">{selectedDriveData.position}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600 font-medium">Package:</span>
                  <span className="text-green-900 font-semibold">{selectedDriveData.package}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-1">Override Warning</p>
                <p className="text-sm text-amber-700">
                  This action will bypass eligibility criteria: <span className="font-semibold">{student?.reason}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Override Reason */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Override Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a detailed reason for this override..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting || !reason.trim()}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <UserPlusIcon className="w-5 h-5" />
                Confirm Force Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ForceAddUI() {
  // State Management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Filter States
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedDrive, setSelectedDrive] = useState("");
  const [overrideReason, setOverrideReason] = useState("");
  
  // Data States
  const [allStudents, setAllStudents] = useState([]); // Master list for filtering
  const [students, setStudents] = useState([]); // Displayed list
  const [placementDrives, setPlacementDrives] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Filter effect
  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedDepartment, allStudents]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockStudents = [
        { id: "STU001", name: "Rahul Sharma", rollNo: "2021CS101", department: "Computer Science", cgpa: 5.8, backlogs: 2, email: "rahul.sharma@college.edu", phone: "+91 98765 43210", reason: "CGPA below 6.0", status: "ineligible" },
        { id: "STU002", name: "Priya Patel", rollNo: "2021IT205", department: "Information Technology", cgpa: 6.2, backlogs: 3, email: "priya.patel@college.edu", phone: "+91 98765 43211", reason: "Active backlogs > 2", status: "ineligible" },
        { id: "STU003", name: "Amit Kumar", rollNo: "2021EC301", department: "Electronics", cgpa: 5.5, backlogs: 1, email: "amit.kumar@college.edu", phone: "+91 98765 43212", reason: "CGPA below threshold", status: "ineligible" },
        { id: "STU004", name: "Sneha Gupta", rollNo: "2021ME401", department: "Mechanical", cgpa: 7.8, backlogs: 0, email: "sneha.gupta@college.edu", phone: "+91 98765 43213", reason: "Registration deadline passed", status: "missed_deadline" },
      ];
      const mockDrives = [
        { id: "DRV001", company: "Tech Corp India", position: "Software Engineer", date: "2025-12-15", package: "8 LPA", eligibilityCriteria: "CGPA ≥ 6.0, No backlogs", status: "active" },
        { id: "DRV002", company: "Innovation Labs", position: "Data Analyst", date: "2025-12-20", package: "6 LPA", eligibilityCriteria: "CGPA ≥ 5.5, Max 2 backlogs", status: "active" },
        { id: "DRV003", company: "Global Solutions", position: "Product Manager", date: "2025-12-25", package: "12 LPA", eligibilityCriteria: "CGPA ≥ 7.0, No backlogs", status: "active" },
      ];
      const mockDepartments = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil Engineering", "Electrical"];
      
      setAllStudents(mockStudents); // Save master copy
      setStudents(mockStudents);    // Save display copy
      setPlacementDrives(mockDrives);
      setDepartments(mockDepartments);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...allStudents];

    // Search Filter (Name or Roll No)
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(lowerTerm) || 
        student.rollNo.toLowerCase().includes(lowerTerm)
      );
    }

    // Department Filter
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(student => student.department === selectedDepartment);
    }

    setStudents(filtered);
  };

  const handleForceAdd = async () => {
    if (!selectedStudent || !selectedDrive || !overrideReason.trim()) {
      alert("Please select a student, placement drive, and provide a reason for override.");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccessMessage(`Successfully added ${selectedStudent.name} to the placement drive!`);
      setShowConfirmModal(false);
      setSelectedStudent(null);
      setSelectedDrive("");
      setOverrideReason("");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      console.error("Error force adding student:", error);
      alert("Failed to add student. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <ShieldExclamationIcon className="w-8 h-8 text-amber-600" />
              Force Add Students
            </h1>
            <p className="text-gray-600 mt-1">Override eligibility criteria and add students to placement drives</p>
          </div>
        </div>
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex gap-3">
            <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Important Notice</p>
              <p>Force Add allows you to bypass eligibility criteria for special cases. All actions are logged.</p>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">{successMessage}</p>
          <button onClick={() => setSuccessMessage("")} className="ml-auto p-1 hover:bg-green-100 rounded-lg transition-colors">
            <XMarkIcon className="w-5 h-5 text-green-600" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Student</label>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or roll number..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" /> Filter by Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Ineligible Students</h2>
          <p className="text-sm text-gray-600 mt-1">
            {students.length} {students.length === 1 ? 'student' : 'students'} found
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {students.map((student) => (
            <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">{student.name.split(" ").map(n => n[0]).join("")}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">{student.rollNo} • {student.department}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-xs text-gray-600">CGPA</span>
                      <p className="text-sm font-bold text-gray-900">{student.cgpa}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <span className="text-xs text-gray-600">Backlogs</span>
                      <p className="text-sm font-bold text-gray-900">{student.backlogs}</p>
                    </div>
                    <div className="col-span-2 bg-red-50 rounded-lg p-2 border border-red-200">
                      <span className="text-xs text-red-600 font-medium">Reason</span>
                      <p className="text-sm font-semibold text-red-900">{student.reason}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">📧 {student.email}</span>
                    <span className="flex items-center gap-1">📱 {student.phone}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 lg:w-64">
                  <select
                    value={selectedStudent?.id === student.id ? selectedDrive : ""}
                    onChange={(e) => {
                      setSelectedStudent(student);
                      setSelectedDrive(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Placement Drive</option>
                    {placementDrives.map(drive => (
                      <option key={drive.id} value={drive.id}>{drive.company} - {drive.position}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      if (!selectedDrive) {
                        alert("Please select a placement drive first");
                        return;
                      }
                      setShowConfirmModal(true);
                    }}
                    disabled={!selectedDrive || selectedStudent?.id !== student.id}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <UserPlusIcon className="w-5 h-5" />
                    Force Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {students.length === 0 && (
          <div className="p-12 text-center">
            <ClipboardDocumentCheckIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">No students match your criteria</p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedDepartment("all");}}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold mt-2"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        student={selectedStudent}
        driveId={selectedDrive}
        drivesList={placementDrives}
        reason={overrideReason}
        setReason={setOverrideReason}
        onConfirm={handleForceAdd}
        submitting={submitting}
      />
    </div>
  );
}