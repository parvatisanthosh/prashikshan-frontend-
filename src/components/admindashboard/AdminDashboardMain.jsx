import React, { useState } from "react";

// Layout Components
import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";
import OverviewUI from "./OverviewUI.jsx";
import Footer from "./Footer.jsx";

// Admin Pages
import ManageFaculty from "./pages/ManageFaculty.jsx";
import AddFaculty from "./pages/AddFaculty.jsx";
import ManageStudents from "./pages/ManageStudents.jsx";
import ForceAddStudent from "./pages/ForceAddStudent.jsx";
import Partnerships from "./pages/Partnerships.jsx";
import AdminCompany from "./pages/AdminCompany.jsx";
import Analytics from "./pages/Analytics.jsx";
import ExportData from "./pages/ExportData.jsx";   // ⭐ NEW IMPORT

export default function AdminDashboardMain() {
  const [activePage, setActivePage] = useState("overview");

  // ⭐ GLOBAL FACULTY DATA
  const [facultyList, setFacultyList] = useState([
    {
      id: 1,
      name: "Dr. Aditi Sharma",
      email: "aditi@college.edu",
      dept: "Computer Science",
    }
  ]);

  // ⭐ ADD FACULTY
  const addFaculty = (newFaculty) => {
    setFacultyList((prev) => [...prev, newFaculty]);
  };

  // ⭐ REMOVE FACULTY
  const removeFaculty = (id) => {
    setFacultyList((prev) => prev.filter((f) => f.id !== id));
  };

  // ⭐ PAGE SWITCH HANDLER
  const renderContent = () => {
    switch (activePage) {
      case "managefaculty":
        return (
          <ManageFaculty
            facultyList={facultyList}
            removeFaculty={removeFaculty}
          />
        );

      case "addfaculty":
        return <AddFaculty addFaculty={addFaculty} />;

      case "managestudents":
        return <ManageStudents />;

      case "forceadd":
        return <ForceAddStudent />;

      case "partnerships":
        return <Partnerships />;

      case "admincompany":
        return <AdminCompany />;

      case "analytics":
        return <Analytics />;

      case "exportdata":                     // ⭐ NEW PAGE HANDLER
        return <ExportData />;

      default:
        return <OverviewUI />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <div className="w-64 fixed left-0 top-0 h-full bg-white shadow-xl z-20">
        <Sidebar setActivePage={setActivePage} activePage={activePage} />
      </div>

      {/* MAIN AREA */}
      <div className="flex flex-col flex-1 ml-64">
        <Navbar />

        <main className="p-6 overflow-y-auto flex-1">
          {renderContent()}
        </main>

        <Footer />
      </div>

    </div>
  );
}
