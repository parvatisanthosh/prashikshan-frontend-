import React from "react";

export default function Screens() {
  return (
  <section className="px-10 py-20 bg-blue-50 transition-colors">
      <h2 className="text-3xl font-bold text-blue-700 mb-8">
        Platform Preview
      </h2>
      <div className="grid md:grid-cols-3 gap-10">
        <img
          src="https://dummyimage.com/600x400/cccccc/000000&text=Student+Dashboard"
          alt="Student Dashboard"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://dummyimage.com/600x400/cccccc/000000&text=Internship+Detail"
          alt="Internship Detail"
          className="rounded-lg shadow-md"
        />
        <img
          src="https://dummyimage.com/600x400/cccccc/000000&text=Faculty+Dashboard"
          alt="Faculty Dashboard"
          className="rounded-lg shadow-md"
        />
      </div>
    </section>
  );
}
