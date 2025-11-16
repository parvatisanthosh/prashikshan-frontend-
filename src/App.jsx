import React from "react";  

import Navbar from "./components/Navbar";
import Hero from "./components/hero";
import Problem from "./components/problem";
import Solution from "./components/Solution";
import Features from "./components/features";
import HowItWorks from "./components/Howitworks";
import Screens from "./components/screen";
import Benefits from "./components/benifits";
import CTA from "./components/CTA";
import Footer from "./components/footer";

export default function App() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Features />
      <HowItWorks />
      <Screens />
      <Benefits />
      <CTA />
      <Footer />
    </div>
  );
}
