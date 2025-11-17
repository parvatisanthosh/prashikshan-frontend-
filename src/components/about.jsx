import React from "react";

export default function About() {
  return (
    <section className="px-10 py-20 bg-white transition-colors">
      <h2 className="text-3xl font-bold text-blue-700 mb-8 text-center">About EduSphere</h2>
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-lg text-gray-700 mb-6">
          EduSphere is on a mission to modernize internships, mentorship, and skill-building for students, colleges, and companies. Our NEP-compliant platform connects all stakeholders in a seamless, verified ecosystem.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Mission</h3>
            <p className="text-gray-700">Empower every student to become industry-ready through real internships, mentorship, and skill pathways.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-blue-700 mb-2">Our Vision</h3>
            <p className="text-gray-700">Build India's largest verified internship and mentorship network, driving NEP compliance and innovation in education.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
