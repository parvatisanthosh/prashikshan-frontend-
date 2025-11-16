import React from "react";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-10 flex flex-col md:flex-row items-center gap-10 bg-gray-50">
      <div className="md:w-1/2">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 leading-tight">
          NEP-Ready Internships & Skill Development
        </h1>

        <p className="mt-4 text-lg text-gray-700">
          One platform to discover verified internships, track NEP logbooks,
          generate reports, and build job-ready skills.
        </p>

        <div className="flex gap-4 mt-6">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700">
            Get Started — Students
          </button>

          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md text-lg hover:bg-blue-50">
            Book Demo — College
          </button>
        </div>
      </div>

      <div className="md:w-1/2">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/job-interview-illustration-download-in-svg-png-gif-file-formats--candidate-employee-post-employment-business-pack-people-illustrations-7363736.png"
          alt="EduSphere Hero"
          className="w-full"
        />
      </div>
    </section>
  );
}

