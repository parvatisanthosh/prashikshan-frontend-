import React from "react";

export default function HowItWorks() {
  return (
  <section className="px-10 py-20 bg-blue-50 transition-colors">
      <h2 className="text-3xl font-bold text-blue-700 mb-10">
        Start to Finish — 3 Simple Steps
      </h2>

      <div className="grid md:grid-cols-3 gap-10 text-lg">
        <div>
          <h3 className="font-bold text-xl text-blue-600">1. Sign Up</h3>
          <p className="text-gray-700 mt-2">
            Create your profile and connect your college.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl text-blue-600">2. Apply & Track</h3>
          <p className="text-gray-700 mt-2">
            Apply to internships and maintain your daily logbook.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-xl text-blue-600">3. Verify & Credit</h3>
          <p className="text-gray-700 mt-2">
            Faculty reviews your work and credits are assigned automatically.
          </p>
        </div>
      </div>
    </section>
  );
}
