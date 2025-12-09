// src/pages/StudentDashboard.jsx
import React, { useState, useEffect } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import StudentDashboardMain from "../components/studentdashboard/StudentDashboardMain.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";
import studentService from "../services/studentService";
import socketService from '../services/socketService';
import LanguageBridgeChat from '../components/LanguageBridgeChat';

export default function StudentDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({ id: "", name: "Student", avatarUrl: "" });
  const [showChat, setShowChat] = useState(false);

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
          id: profile.id || profile.userId || "",
          name: profile.displayName || "Student",
          avatarUrl: avatarResponse.avatarURL || ""
        });

        // Connect to WebSocket after user data is loaded
        socketService.connect();
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };
    
    loadUserData();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  function handleNavigate(route) {
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

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={(route) => handleNavigate(route)}
        user={user}
      />

      <StudentDashboardMain />

      {/* CHAT BUTTON */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition flex items-center justify-center z-40 text-2xl"
      >
        🌍
      </button>

      {/* CHAT POPUP */}
      {showChat && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] shadow-2xl z-50 rounded-lg overflow-hidden">
          <LanguageBridgeChat
            roomId="student-chat"
            currentUser={{ id: user.id, name: user.name }}
            recipientName="Global Chat"
          />
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}