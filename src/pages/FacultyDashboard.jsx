// FILE: pages/FacultyDashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/facultydashboard/Navbar.jsx";
import Sidebar from "../components/facultydashboard/Sidebar.jsx";
import FacultyDashboardMain from "../components/facultydashboard/FacultyDashboardMain.jsx";
import Footer from "../components/facultydashboard/Footer.jsx";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  const [classList, setClassList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // IMPORTANT: keep activeTab AND setter so children can switch tabs
  const [activeTab, setActiveTab] = useState("Dashboard");

  function handleNavigate(route) {
    if (route.startsWith("/")) {
      navigate(route);
    } else {
      setActiveTab(route);
    }
    setSidebarOpen(false);
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar
          user={{ name: "Dr. Sharma", role: "Senior Faculty" }}
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={() => navigate("/")}
        />
      </div>

      <div className="flex flex-1 pt-20 overflow-hidden">
        <Sidebar
          open={sidebarOpen}
          activeTab={activeTab}
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 ml-0 md:ml-64">
          {/* Pass setActiveTab along with activeTab + classList */}
          <FacultyDashboardMain
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            classList={classList}
            setClassList={setClassList}
          />

         
        </main>
      </div>
    </div>
  );
}
