import React from "react";
import heroImage from "../assets/heroImage.jpg";

export default function Hero() {
  return (
    <section className="w-full min-h-[100vh] pt-36 pb-28 px-8 md:px-24 flex flex-col md:flex-row items-center gap-12 bg-white transition-all">
      
      {/* LEFT SIDE */}
      <div className="md:w-1/2">
        <h1 className="text-5xl md:text-7xl font-extrabold text-blue-700 leading-tight">
          Find Internships, Courses & Mentors — All in One Place.
        </h1>

        <p className="mt-4 text-lg text-black-700">
          EduSphere connects students, colleges, and companies with
          verified internships, trending courses, and 1:1 mentorship under
          a NEP-ready ecosystem.
        </p>

        {/* BUTTON ROW */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button className="px-6 py-3 bg-blue text-white rounded-md text-lg font-semibold hover:bg-blue-700 hover:opacity-80 transition">
            Login
          </button>

          <button className="px-6 py-3 border border-blue-600 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 hover:opacity-80 transition">
            Register
          </button>

          <button className="px-6 py-3 bg-blue-600 text-white border border-blue-600 rounded-md text-lg font-semibold hover:bg-blue-700 hover:opacity-80 transition">
            Explore Internships
          </button>
        </div>
      </div>

      {/* RIGHT SIDE — IMAGE */}
      <div className="md:w-1/2 flex justify-center bg-white">
        <img
          src={heroImage}
          alt="Students collaborating"
          className="w-full max-w-xl object-contain drop-shadow-2xl"
        />
      </div>

    </section>
  );
}
