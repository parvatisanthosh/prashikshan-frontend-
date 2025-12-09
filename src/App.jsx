// FILE: src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Landing + Role Select
import LandingPage from "./pages/LandingPage.jsx";
import RoleSelectPage from "./pages/RoleSelectPage.jsx";

import Gov from "../src/pages/GovPortal.jsx"

// Student Pages
import StudentSignUpPage from "./pages/StudentSignupPage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LogbookPage from "./pages/LogBook.jsx";
import ActivityTrackerPage from "./pages/StudentActivityTracker.jsx";
import Internships from "./pages/InternshipsPage.jsx";
import Courses from "./pages/CoursesPage.jsx";
import Mentors from "./pages/MentorsPage.jsx";
import Certificates from "./pages/Certificates.jsx";
import ProfilePage from "./pages/StudentProfile.jsx";
// import ChatStudent from "./components/studentdashboard/StudentChat.jsx";
import InternshipReport from "./pages/InternshipReport.jsx";

// Faculty Pages
import FacultyLoginPage from "./pages/FacultyLoginPage.jsx";
import FacultySignupPage from "./pages/FacultySignupPage.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import AcademicDashboard from "./pages/AcademicDashboard.jsx";

// Mentor Pages
import MentorLoginPage from "./pages/MentorLoginPage.jsx";
import MentorSignupPage from "./pages/MentorSignupPage.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";

// Company Pages
import CompanySignupPage from "./pages/CompanySignupPage.jsx";
import CompanyLoginPage from "./pages/CompanyLoginPage.jsx";
// Company-related pages removed: folder `pages/company` and `context/CompanyContext` not present.

// Admin Pages
import AdminSignupPage from "./pages/AdminSignupPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Chatbot
// ChatbotFlow not present in `src/components`, removed.

// Company dashboard wrapper removed because company context and pages are not available.
import { CompanyProvider } from "./context/CompanyContext";
import DashboardLayout from "./components/companydashboard/Layout/DashboardLayout";
import Overview from "./pages/company/Overview";
import CreateOpening from "./pages/company/CreateOpening";
import Applicants from "./pages/company/Applicants";
import Analytics from "./pages/company/Analytics";
import Chat from "./pages/company/Chat";
import StudentProfile from "./pages/company/StudentProfile";
import SelectedStudents from "./pages/company/SelectedStudents";
import RejectedStudents from "./pages/company/RejectedStudents";
import RecruitedStudents from "./pages/company/RecruitedStudents";
import UnderMaintenance from "./pages/company/UnderMaintenance";
// Company Layout Wrapper Component
const CompanyDashboardWrapper = () => {
return (
<CompanyProvider>
<DashboardLayout />
</CompanyProvider>
);
};
export default function App() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      {/* Chatbot removed (component not found) */}

      <Routes>
        {/* ==================== PUBLIC ROUTES ==================== */}
        
        {/* Landing + Role Selection */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/roleselect" element={<RoleSelectPage />} />

        {/* Auth Routes - Signup/Login */}
        <Route path="/studentsignup" element={<StudentSignUpPage />} />
        <Route path="/studentlogin" element={<StudentLoginPage />} />
        <Route path="/facultylogin" element={<FacultyLoginPage />} />
        <Route path="/facultysignup" element={<FacultySignupPage />} />
        <Route path="/mentorlogin" element={<MentorLoginPage />} />
        <Route path="/mentorsignup" element={<MentorSignupPage />} />
        <Route path="/companysignup" element={<CompanySignupPage />} />
        <Route path="/companylogin" element={<CompanyLoginPage />} />
        <Route path="/adminsignup" element={<AdminSignupPage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/govportal" element={<Gov />} />
        
        <Route path="/company" element={<CompanyDashboardWrapper />}>
          <Route index element={<Overview />} />
          <Route path="overview" element={<Overview />} />
          <Route path="create-opening" element={<CreateOpening />} />
          <Route path="applicants" element={<Applicants />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="selected-students" element={<SelectedStudents />} />
          <Route path="rejected-students" element={<RejectedStudents />} />
          <Route path="recruited-students" element={<RecruitedStudents />} />
          <Route path="chat" element={<Chat />} />
          <Route path="student/:id" element={<StudentProfile />} />
          <Route path="settings" element={<UnderMaintenance />} />
        
          <Route path="help" element={<UnderMaintenance />} />
          
        </Route>
        {/* ==================== STUDENT PROTECTED ROUTES ==================== */}
        
        <Route 
          path="/studentdashboard" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />

        

        
        <Route 
          path="/logbook" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <LogbookPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/activitytracker" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ActivityTrackerPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/internships" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Internships />
            </ProtectedRoute>
          } 
        />
        
        {/* Student chat route removed (component not found) */}
        
        {/* Skill gap route removed (component not found) */}
        
        <Route 
          path="/courses" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Courses />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/mentors" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Mentors />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/certificates" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <Certificates />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/studentprofile" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/internship-report" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <InternshipReport />
            </ProtectedRoute>
          } 
        />

        {/* ==================== FACULTY PROTECTED ROUTES ==================== */}
        
        <Route 
          path="/faculty/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <FacultyDashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/academicdashboard" 
          element={
            <ProtectedRoute allowedRoles={['FACULTY']}>
              <AcademicDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ==================== MENTOR PROTECTED ROUTES ==================== */}
        
        <Route 
          path="/mentordashboard" 
          element={
            <ProtectedRoute allowedRoles={['INDUSTRY']}>
              <MentorDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Company routes removed: company dashboard/pages not present in this workspace */}

        {/* ==================== ADMIN PROTECTED ROUTES ==================== */}
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ==================== 404 CATCH ALL ==================== */}
        
        <Route 
          path="*" 
          element={
            <div className="h-screen flex items-center justify-center bg-slate-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-slate-800 mb-4">404</h1>
                <p className="text-xl text-slate-600 mb-8">Page not found</p>
                <a 
                  href="/" 
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                >
                  Go Home
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </div>
  );
}