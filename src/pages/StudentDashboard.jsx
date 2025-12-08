// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import StudentDashboardMain from "../components/studentdashboard/StudentDashboardMain.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";
import studentService from "../services/studentService";

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ name: "Student", avatarUrl: "" });

  // Fetch user data for Navbar and Sidebar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profileResponse, avatarResponse] = await Promise.all([
          studentService.getProfile(),
          studentService.getAvatarUrl()
        ]);
        
        const profile = profileResponse.profile || {};
        setUser({
          name: profile.displayName || "Student",
          avatarUrl: avatarResponse.avatarURL || ""
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();
  }, []);

  function handleNavigate(route) {
    // wire to your router here. Example: react-router -> navigate(`/${route}`)
    // For now we use hash-nav fallback:
    window.location.hash = `#/${route}`;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onToggleSidebar={() => setSidebarOpen(true)}
        onSearch={(q) => alert("Search: " + q)}
        onNavigate={(r) => handleNavigate(r)}
      />

      {/* IMPORTANT: add top padding so fixed navbar doesn't cover content */}
      <div className="">

      </div>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(route) => handleNavigate(route)}
        user={user}
      />

      <StudentDashboardMain />

    </div>
  );
}
