import React from "react";

export default function Features() {
  const features = [
    "Credit Integration System",
    "Automatic Logbook & GPS Verification",
    "NEP Report Generator",
    "Micro-Internships Marketplace",
    "Mentor Booking System",
    "Verifiable Digital Credentials",
  ];

  return (
    <section className="px-10 py-20 bg-gray-100">
      <h2 className="text-3xl font-bold text-blue-700 mb-10">
        Built for NEP, Built for Scale
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-md text-lg font-medium hover:shadow-lg transition"
          >
            {feature}
          </div>
        ))}
      </div>
    </section>
  );
}
