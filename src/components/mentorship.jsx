import React from "react";

const mentors = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend Engineer",
    skills: ["React", "JavaScript", "UI/UX"],
    experience: "3+ years",
    img: "https://randomuser.me/api/portraits/men/51.jpg",
  },
  {
    id: 2,
    name: "Diya Verma",
    role: "Data Scientist",
    skills: ["Python", "ML", "Pandas"],
    experience: "4+ years",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Rishi Raj",
    role: "Cloud Engineer",
    skills: ["AWS", "DevOps", "Docker"],
    experience: "5+ years",
    img: "https://randomuser.me/api/portraits/men/33.jpg",
  },
];

export default function Mentorship() {
  return (
    <section className="px-6 md:px-10 py-16 bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          1:1 Mentorship — Learn From Experts
        </h2>
        <p className="text-gray-600 mb-6">
          Book sessions with top mentors from the industry.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-24 h-24 object-cover rounded-full mx-auto"
              />
              <h3 className="text-xl font-semibold text-center text-gray-900 mt-4">
                {m.name}
              </h3>
              <p className="text-center text-sm text-gray-600">
                {m.role}
              </p>
              <p className="text-center text-sm text-gray-500 mt-1">
                Experience: {m.experience}
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {m.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <button className="w-full mt-6 bg-[#1877F2] text-white py-2 rounded-md hover:bg-[#1456b8] transition">
                Book Session
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
