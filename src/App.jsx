import React from "react";
import { Routes, Route } from "react-router-dom";

// Landing + Role Select
import LandingPage from "./pages/LandingPage.jsx";
import RoleSelectPage from "./pages/RoleSelectPage.jsx";

// Student Pages
import StudentSignUpPage from "./pages/StudentSignupPage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LogbookPage from "./pages/LogBook.jsx";
import ActivityTrackerPage from "./pages/StudentActivityTracker.jsx";
import Internships from "../src/pages/InternshipsPage.jsx";
import Courses from "../src/pages/CoursesPage.jsx";
import Mentors from "../src/pages/MentorsPage.jsx";
import Certificates from "../src/pages/Certificates.jsx";
import MentorLoginPage from "./pages/MentorLoginPage.jsx";
import MentorSignupPage from "./pages/MentorSignupPage.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";

// Faculty Pages
import FacultyLoginPage from "./pages/FacultyLoginPage.jsx"; 
import FacultySignupPage from "./pages/FacultySignupPage.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import AcademicDashboard from "../src/pages/AcademicDashboard.jsx";

// Company Pages
import CompanySignupPage from "./pages/CompanySignupPage.jsx";
import CompanyLoginPage from "./pages/CompanyLoginPage.jsx"; 

// Admin Pages
import AdminSignupPage from "./pages/AdminSignupPage.jsx";
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";   // ✅ Correct Path

export default function App() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Routes>

        {/* Landing + Role Selection */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/roleselect" element={<RoleSelectPage />} />

        {/* ---------------- STUDENT ROUTES ---------------- */}
        <Route path="/studentsignup" element={<StudentSignUpPage />} />
        <Route path="/studentlogin" element={<StudentLoginPage />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/logbook" element={<LogbookPage />} />
        <Route path="/activitytracker" element={<ActivityTrackerPage />} />

        {/* ---------------- FACULTY ROUTES ---------------- */}
        <Route path="/facultylogin" element={<FacultyLoginPage />} /> 
        <Route path="/facultysignup" element={<FacultySignupPage />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
<Route path="/internships" element={<Internships />} />
        {/* ---------------- COMPANY ROUTES ---------------- */}
        <Route path="/companysignup" element={<CompanySignupPage />} />
        <Route path="/companylogin" element={<CompanyLoginPage />} /> 
                <Route path="/courses" element={<Courses />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/academicdashboard" element={<AcademicDashboard />} />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/mentorlogin" element={<MentorLoginPage />} />
        <Route path="/mentorsignup" element={<MentorSignupPage />} />
        <Route path="/mentordashboard" element={<MentorDashboard />} />

        {/* ---------------- ADMIN ROUTES ---------------- */}
        <Route path="/adminsignup" element={<AdminSignupPage />} />
        <Route path="/adminlogin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />  

      </Routes>
    </div>
  );
}
