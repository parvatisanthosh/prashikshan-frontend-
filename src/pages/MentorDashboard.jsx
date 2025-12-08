import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import authService from '../services/authService';
import Navbar from "../components/mentordashboard/Navbar.jsx";
import Sidebar from "../components/mentordashboard/Sidebar.jsx";
import MentorDashboardMain from "../components/mentordashboard/MentorDashboardMain.jsx";
import Footer from "../components/mentordashboard/Footer.jsx";

export default function MentorDashboard() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    console.log('🔍 MentorDashboard: Checking authentication...');
    
    if (!authService.isAuthenticated()) {
      console.log('❌ Not authenticated - redirecting to login');
      navigate('/mentorlogin', { replace: true });
      return;
    }

    const currentUser = authService.getCurrentUser();
    console.log('👤 Current user:', currentUser);

    // Check if user has INDUSTRY role
    if (!currentUser || currentUser.role !== 'INDUSTRY') {
      console.log('❌ Wrong role - expected INDUSTRY, got:', currentUser?.role);
      navigate('/mentorlogin', { replace: true });
      return;
    }

    console.log('✅ Authentication successful - role: INDUSTRY');
    setUser(currentUser);
    setLoading(false);
  }, [navigate]);

  // Navigation handler
  function handleNavigate(route) {
    if (route.startsWith("/")) {
      navigate(route);
    } else {
      setActiveTab(route);
    }
    setSidebarOpen(false);
  }

  // Logout handler
  function handleLogout() {
    console.log('🔓 Logging out...');
    authService.logout();
    navigate('/');
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render if no user (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">

      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar
          user={{ 
            name: user.name || "Mentor", 
            role: "Senior Mentor" 
          }}
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
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
          <MentorDashboardMain activeTab={activeTab} />
          <Footer />
        </main>
      </div>
    </div>
  );
}