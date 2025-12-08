// FILE: pages/FacultyDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/facultydashboard/Navbar.jsx";
import Sidebar from "../components/facultydashboard/Sidebar.jsx";
import FacultyDashboardMain from "../components/facultydashboard/FacultyDashboardMain.jsx";
import Footer from "../components/facultydashboard/Footer.jsx";
import authService from "../services/authService";
import api from "../config/api";

export default function FacultyDashboard() {
  const navigate = useNavigate();

  // ==================== STATE MANAGEMENT ====================
  const [classList, setClassList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  // Authentication & User State
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard Data State
  const [dashboardStats, setDashboardStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    pendingAssignments: 0,
    upcomingClasses: 0
  });

  // ==================== AUTHENTICATION CHECK ====================
  useEffect(() => {
    checkAuthentication();
  }, []);

  async function checkAuthentication() {
    try {
      // Check if user is authenticated
      if (!authService.isAuthenticated()) {
        navigate('/facultylogin');
        return;
      }

      // Get user from localStorage
      const currentUser = authService.getCurrentUser();
      
      // Verify user is faculty
      if (!currentUser || currentUser.role !== 'FACULTY') {
        authService.logout();
        navigate('/facultylogin');
        return;
      }

      setUser(currentUser);
      
      // Fetch dashboard data
      await fetchDashboardData();
      
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication failed. Please login again.');
      authService.logout();
      navigate('/facultylogin');
    } finally {
      setLoading(false);
    }
  }

  // ==================== DATA FETCHING ====================
  
  async function fetchDashboardData() {
    try {
      // Fetch classes
      const classesResponse = await api.get('/faculty/classes');
      if (classesResponse.data.success) {
        setClassList(classesResponse.data.classes || []);
      }

      // Fetch dashboard statistics
      const statsResponse = await api.get('/faculty/dashboard/stats');
      if (statsResponse.data.success) {
        setDashboardStats({
          totalClasses: statsResponse.data.totalClasses || 0,
          totalStudents: statsResponse.data.totalStudents || 0,
          pendingAssignments: statsResponse.data.pendingAssignments || 0,
          upcomingClasses: statsResponse.data.upcomingClasses || 0
        });
      }

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Don't show error for data fetch failures, just log them
      if (err.response?.status === 401) {
        // Token expired
        authService.logout();
        navigate('/facultylogin');
      }
    }
  }

  // ==================== HANDLERS ====================

  function handleNavigate(route) {
    if (route.startsWith("/")) {
      navigate(route);
    } else {
      setActiveTab(route);
    }
    setSidebarOpen(false);
  }

  function handleLogout() {
    authService.logout();
    navigate('/facultylogin');
  }

  async function handleRefreshData() {
    setLoading(true);
    await fetchDashboardData();
    setLoading(false);
  }

  // ==================== LOADING STATE ====================
  
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ==================== ERROR STATE ====================
  
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-800 mb-2">Authentication Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/facultylogin')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN RENDER ====================
  
  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar
          user={{
            name: user?.profile?.firstName && user?.profile?.lastName 
              ? `${user.profile.firstName} ${user.profile.lastName}`
              : user?.email || "Faculty",
            role: user?.profile?.designation || "Faculty Member",
            email: user?.email
          }}
          onToggleSidebar={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 pt-20 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          open={sidebarOpen}
          activeTab={activeTab}
          onClose={() => setSidebarOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 bg-slate-50 ml-0 md:ml-64">
          <FacultyDashboardMain
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            classList={classList}
            setClassList={setClassList}
            dashboardStats={dashboardStats}
            user={user}
            onRefresh={handleRefreshData}
          />
        </main>
      </div>
    </div>
  );
}