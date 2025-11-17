import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Problem from "./components/problem";
import Solution from "./components/solution";
import Features from "./components/features";
import HowItWorks from "./components/howitworks";
import Screens from "./components/screen";
import Benefits from "./components/benifits";
import CTA from "./components/cta";
import Footer from "./components/footer";
import Trending from "./components/trending";
import Mentorship from "./components/mentorship";
import Internships from "./components/internships";
import JoinCollege from "./components/joincollege";
import Freshers from "./components/freshers";
import Feedback from "./components/feedback";
import Companies from "./components/companies";
import About from "./components/about";
import LandingPage from "./pages/LandingPage.jsx";
import StudentSignUpPage from "./pages/StudentSignupPage.jsx";
import StudentLoginPage from "./pages/StudentLoginPage.jsx";





export default function App() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      <Hero />
      <Trending />
      <Mentorship />
      <Internships />
      <JoinCollege />
      <Freshers />
      <Feedback />
    <Companies />
    <About />
    <Footer />
    <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/studentsignup" element={<StudentSignUpPage />} />
        <Route path="/studentlogin" element={<StudentLoginPage />} />
    </Routes>
    </div>
  );
}

