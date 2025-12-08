import React, { useState, useEffect } from "react";
import facultyService from "../../services/Facultyservice";

// MAIN COMPONENT IMPORTS
import ManageClasses from "./manageclasses/ManageClasses.jsx";
import CreateClass from "./manageclasses/CreateClass.jsx";
import OverviewUI from "./OverviewUI.jsx";
import AssignedStudentsUI from "./assignedstudents/AssignedStudents.jsx";
import PendingReviews from "./pendingreviews/PendingReviews.jsx";
import Assessments from "./assessments/Assessments.jsx";
import ChatFacultyStudent from "./chat/ChatFacultyStudent.jsx";
import ReportsAndSignoff from "./reports/ReportsAndSignoff.jsx";   // ✅ NEW REPORTS PAGE

// TEMP UI (if anything missing)
const MissingTabUI = ({ tabName }) => (
  <div className="p-10 text-center">
    <h1 className="text-2xl font-bold">{tabName} Coming Soon</h1>
  </div>
);

export default function FacultyDashboardMain({
  activeTab,
  classList,
  setClassList,
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch classes on component mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const classes = await facultyService.getClasses();
      setClassList(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------ CLASS ACTION HANDLERS -------------------------

  const handleCreate = () => setIsCreating(true);

  const handleClassCreated = (newClass) => {
    setClassList((prev) => [...prev, newClass]);
    setIsCreating(false);
  };

  const handleDelete = async (cls) => {
    if (window.confirm(`Delete ${cls.className}?`)) {
      try {
        await facultyService.deleteClass(cls.id || cls._id);
        setClassList((prev) => prev.filter((c) => c.id !== cls.id && c._id !== cls._id));
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Failed to delete class. Please try again.");
      }
    }
  };

  const handleEdit = async (cls) => {
    const newName = prompt("New class name:", cls.className);
    if (newName && newName.trim()) {
      try {
        const updated = await facultyService.updateClass(cls.id || cls._id, { className: newName.trim() });
        setClassList((prev) =>
          prev.map((c) =>
            (c.id === cls.id || c._id === cls._id) ? { ...c, className: newName.trim() } : c
          )
        );
      } catch (error) {
        console.error("Error updating class:", error);
        alert("Failed to update class. Please try again.");
      }
    }
  };

  const handleView = (cls) => {
    alert(`View Student Work for: ${cls.className}`);
  };

  const handleGenerateLink = (classId) => {
    return `${window.location.origin}/join/${classId}`;
  };

  // ------------------------ ROUTING SYSTEM --------------------------

  switch (activeTab) {
    case "Dashboard":
    case "Overview":
      return <OverviewUI />;

    case "Manage Classes":
      return isCreating ? (
        <CreateClass
          onBack={() => setIsCreating(false)}
          onClassCreated={handleClassCreated}
        />
      ) : (
        <ManageClasses
          classList={classList}
          onCreate={handleCreate}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onGenerateLink={handleGenerateLink}
        />
      );

    case "Assigned Students":
      return <AssignedStudentsUI />;

    case "Pending Reviews":
      return <PendingReviews />;

    case "Assessments":
      return <Assessments />;

    case "Reports and Signoff":
      return <ReportsAndSignoff />; // ✅ FULL PAGE ADDED

    case "Chat Faculty Student":
      return <ChatFacultyStudent />; // ✅ CHAT CONNECTED

    default:
      return <OverviewUI />;
  }
}
