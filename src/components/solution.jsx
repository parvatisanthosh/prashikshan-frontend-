import React from "react";

export default function Solution() {
  return (
  <section className="px-10 py-20 bg-blue-50 transition-colors">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        EduSphere — The NEP-Compliant Internship Grid
      </h2>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Student Section */}
        <div>
          <h3 className="font-bold text-xl text-blue-600">Students</h3>
          <ul className="mt-3 text-gray-700 space-y-2">
            <li>✔ Verified internships</li>
            <li>✔ Logbook + proof uploads</li>
            <li>✔ Skill badges & resume builder</li>
          </ul>
        </div>

        {/* Faculty Section */}
        <div>
          <h3 className="font-bold text-xl text-blue-600">Faculty</h3>
          <ul className="mt-3 text-gray-700 space-y-2">
            <li>✔ Rubric-based evaluations</li>
            <li>✔ NEP report generation</li>
            <li>✔ Institution analytics</li>
          </ul>
        </div>

        {/* Industry Section */}
        <div>
          <h3 className="font-bold text-xl text-blue-600">Industry</h3>
          <ul className="mt-3 text-gray-700 space-y-2">
            <li>✔ Post internships easily</li>
            <li>✔ Applicant dashboard</li>
            <li>✔ API for bulk hiring</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
