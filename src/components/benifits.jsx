import React from "react";

export default function Benefits() {
  return (
  <section className="px-10 py-20 bg-blue-50 transition-colors">
      <h2 className="text-3xl font-bold text-blue-700 mb-10">
        Why EduSphere?
      </h2>
      <div className="grid md:grid-cols-3 gap-10 text-lg">
        {/* Students */}
        <div>
          <h3 className="font-bold text-xl text-blue-600">Students</h3>
          <p className="mt-2 text-gray-700">
            Real internships, verified certificates, skill pathways,
            and NEP-compliant reporting.
          </p>
        </div>
        {/* Colleges */}
        <div>
          <h3 className="font-bold text-xl text-blue-600">Colleges</h3>
          <p className="mt-2 text-gray-700">
            Accurate logbooks, analytics dashboards, and complete NEP compliance
            with reduced admin workload.
          </p>
        </div>
        {/* Industry */}
        <div>
          <h3 className="font-bold text-xl text-blue-600">Industry</h3>
          <p className="mt-2 text-gray-700">
            Access pre-screened talent, post micro-internships,
            and streamline your hiring pipeline.
          </p>
        </div>
      </div>
    </section>
  );
}
