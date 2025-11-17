import React from "react";

export default function Freshers() {
  return (
    <section className="px-10 py-20 bg-slate-50 transition-colors">
      <h2 className="text-3xl font-bold text-black-700 mb-8 text-center">
        Looking for Interns / Freshers?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Post Internship Openings</h3>
          <p className="text-gray-700 mb-4">Reach thousands of students instantly.</p>
          <button className="px-6 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1456b8] hover:opacity-80">Post Now</button>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Bulk Hiring API</h3>
          <p className="text-gray-700 mb-4">Integrate with your HR system for seamless hiring.</p>
          <button className="px-6 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1456b8] hover:opacity-80">Get API Access</button>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Connect with Colleges</h3>
          <p className="text-gray-700 mb-4">Find top talent from verified institutions.</p>
          <button className="px-6 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1456b8] hover:opacity-80">Contact Us</button>
        </div>
      </div>
    </section>
  );
}
