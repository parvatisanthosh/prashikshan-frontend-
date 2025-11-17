import React from "react";

export default function JoinCollege() {
  return (
    <section className="px-6 md:px-10 py-16 bg-white transition-colors">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Bring Your College to EduSphere
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-6">
          Register your institution to connect with top companies, streamline internships, 
          assign faculty mentors, and ensure NEP-compliant tracking for all students.
        </p>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Verified Company Tie-ups
            </h3>
            <p className="text-gray-600 mt-2">
              Connect with industry partners and bring internship opportunities directly to students.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Digital Logbooks & Reports
            </h3>
            <p className="text-gray-600 mt-2">
              Automate NEP-compliant logbooks, assessments, and evaluation workflows.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold text-gray-900">
              Faculty Monitoring Dashboard
            </h3>
            <p className="text-gray-600 mt-2">
              Assign mentors, track progress, verify tasks, and approve credits in real time.
            </p>
          </div>
        </div>
  <button className="mt-10 px-8 py-3 bg-[#1877F2] text-white font-semibold text-lg rounded-md hover:bg-[#1456b8] transition">
          Register Your College
        </button>
      </div>
    </section>
  );
}
