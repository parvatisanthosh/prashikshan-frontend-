import React from "react";
import { Routes, Route } from "react-router-dom";
// Adding .jsx extensions back to fix file resolution errors
import LandingPage from "./pages/LandingPage.jsx";
import StudentSignUpPage from "./pages/StudentSignupPage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LogbookPage from "./pages/LogBook.jsx";
import ActivityTrackerPage from "./pages/StudentActivityTracker.jsx";
import Internships from "../src/pages/InternshipsPage.jsx";
import Courses from "../src/pages/CoursesPage.jsx";



import RoleSelectPage from "./pages/RoleSelectPage.jsx";
import FacultyLoginPage from "./pages/FacultyLoginPage.jsx"; 
import FacultySignupPage from "./pages/FacultySignupPage.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx"; 

export default function App() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/roleselect" element={<RoleSelectPage />} />
        
        {/* Student Routes */}
        <Route path="/studentsignup" element={<StudentSignUpPage />} />
        <Route path="/studentlogin" element={<StudentLoginPage />} />
        <Route path="/studentdashboard" element={<StudentDashboard />} />
        <Route path="/logbook" element={<LogbookPage />} />
        <Route path="/activitytracker" element={<ActivityTrackerPage />} />
        <Route path="/facultylogin" element={<FacultyLoginPage />} /> 
        <Route path="/facultysignup" element={<FacultySignupPage />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} /> 
        <Route path="/internships" element={<Internships />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>
    </div>
  );
}
