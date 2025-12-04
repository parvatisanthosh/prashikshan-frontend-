import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/facultydashboard/Navbar.jsx";
import Sidebar from "../components/facultydashboard/Sidebar.jsx";
import FacultyDashboardMain from "../components/facultydashboard/FacultyDashboardMain.jsx";
import Footer from "../components/facultydashboard/Footer.jsx";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  // 🌟 PUT useState HERE — inside the component
  const [classList, setClassList] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Navigation handler
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

      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar
          user={{ name: "Dr. Sharma", role: "Senior Faculty" }}
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={() => navigate("/")}
        />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 pt-20 overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar
          open={sidebarOpen}
          activeTab={activeTab}
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 ml-0 md:ml-64">

          {/* PASS classList + setClassList TO MAIN ROUTER */}
          <FacultyDashboardMain 
            activeTab={activeTab}
            classList={classList}
            setClassList={setClassList}
          />

          <Footer />
        </main>
      </div>
    </div>
  );
}
