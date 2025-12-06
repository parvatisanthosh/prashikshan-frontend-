import React from "react";
import { Routes, Route } from "react-router-dom";

// Adding .jsx extensions back to fix file resolution errors
import LandingPage from "./pages/LandingPage.jsx";
import StudentSignUpPage from "./pages/StudentSignupPage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import LogbookPage from "./pages/LogBook.jsx";
import ActivityTrackerPage from "./pages/StudentActivityTracker.jsx";
import Internships from "./pages/InternshipsPage.jsx";
import Courses from "./pages/CoursesPage.jsx";
import Mentors from "./pages/MentorsPage.jsx";
import Certificates from "./pages/Certificates.jsx";
import MentorLoginPage from "./pages/MentorLoginPage.jsx";
import MentorSignupPage from "./pages/MentorSignupPage.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";

import RoleSelectPage from "./pages/RoleSelectPage.jsx";
import FacultyLoginPage from "./pages/FacultyLoginPage.jsx";
import FacultySignupPage from "./pages/FacultySignupPage.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import AcademicDashboard from "./pages/AcademicDashboard.jsx";

/* NEW: Internship Report page */
import InternshipReport from "./pages/InternshipReport.jsx";

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

        {/* Faculty Routes */}
        <Route path="/facultylogin" element={<FacultyLoginPage />} />
        <Route path="/facultysignup" element={<FacultySignupPage />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />

        {/* Other student resources */}
        <Route path="/internships" element={<Internships />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/academicdashboard" element={<AcademicDashboard />} />
        <Route path="/certificates" element={<Certificates />} />

        {/* Mentor Routes */}
        <Route path="/mentorlogin" element={<MentorLoginPage />} />
        <Route path="/mentorsignup" element={<MentorSignupPage />} />
        <Route path="/mentordashboard" element={<MentorDashboard />} />

        {/* NEW: Internship Report Generator */}
        <Route path="/internship-report" element={<InternshipReport />} />
      </Routes>
    </div>
  );
}