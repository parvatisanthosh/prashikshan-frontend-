import React from "react";

const internships = [
  {
    id: 1,
    role: "Frontend Developer Intern",
    company: "Google",
    stipend: "₹25,000/month",
    location: "Remote",
    duration: "3 months",
    logo: "https://www.logo.wine/a/logo/Google/Google-Logo.wine.svg",
  },
  {
    id: 2,
    role: "Data Analyst Intern",
    company: "Microsoft",
    stipend: "₹20,000/month",
    location: "Hybrid — Bangalore",
    duration: "2 months",
    logo: "https://www.logo.wine/a/logo/Microsoft/Microsoft-Logo.wine.svg",
  },
  {
    id: 3,
    role: "Cloud Intern",
    company: "Amazon AWS",
    stipend: "₹30,000/month",
    location: "On-site — Hyderabad",
    duration: "6 months",
    logo: "https://www.logo.wine/a/logo/Amazon_Web_Services/Amazon_Web_Services-Logo.wine.svg",
  },
];

export default function Internships() {
  return (
    <section className="px-6 md:px-10 py-16 bg-white transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Internship Openings — Start Your Career
        </h2>
        <p className="text-gray-600 mb-6">
          Verified internships from trusted companies. Apply today.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {internships.map((item) => (
            <div
              key={item.id}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition"
            >
              <img
                src={item.logo}
                alt={item.company}
                className="h-12 object-contain mx-auto"
              />
              <h3 className="text-xl font-semibold text-center text-gray-900 mt-4">
                {item.role}
              </h3>
              <p className="text-center text-sm text-gray-500">
                {item.company}
              </p>
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><strong>Stipend:</strong> {item.stipend}</p>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Duration:</strong> {item.duration}</p>
              </div>
              <button className="w-full mt-6 bg-[#1877F2] text-white py-2 rounded-md hover:bg-[#1456b8] transition">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
