import React, { useState } from 'react';

// Custom Check Icon SVG (simulating lucide-react for single-file environment)
const CheckCircle = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

// Enhanced Mentor Data
const mentors = [
  {
    id: 1,
    name: "Aarav Sharma",
    role: "Frontend Architect",
    tagline: "Building scalable and beautiful user experiences.",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    experience: "5+ years",
    rate: 150,
    img: "https://placehold.co/100x100/7c3aed/ffffff?text=AS", // Updated to placeholder for better consistency
  },
  {
    id: 2,
    name: "Diya Verma",
    role: "Lead Data Scientist",
    tagline: "Solving complex problems with machine learning and Python.",
    skills: ["Python", "TensorFlow", "Pandas", "Cloud ML"],
    experience: "7+ years",
    rate: 180,
    img: "https://placehold.co/100x100/10b981/ffffff?text=DV",
  },
  {
    id: 3,
    name: "Rishi Raj",
    role: "Principal Cloud Engineer",
    tagline: "Expert in resilient and cost-effective cloud infrastructure.",
    skills: ["AWS", "Kubernetes", "DevOps", "Terraform"],
    experience: "8+ years",
    rate: 200,
    img: "https://placehold.co/100x100/f59e0b/ffffff?text=RR",
  },
  {
    id: 4,
    name: "Priya Singh",
    role: "Full-stack Developer",
    tagline: "From database design to responsive frontend development.",
    skills: ["Node.js", "MongoDB", "Express", "Next.js"],
    experience: "4+ years",
    rate: 140,
    img: "https://placehold.co/100x100/ef4444/ffffff?text=PS",
  },

];

// Reusable Mentor Card Component
const MentorCard = ({ mentor }) => {
    // Fallback for image loading errors
    const handleError = (e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = `https://placehold.co/100x100/4f46e5/ffffff?text=${mentor.name.split(' ').map(n => n[0]).join('')}`;
    };

    return (
        <div
            className="group bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.02] border border-gray-100 flex flex-col items-center text-center"
        >
            <div className="relative mb-6">
                <img
                    src={mentor.img}
                    alt={mentor.name}
                    className="w-24 h-24 object-cover rounded-full border-4 border-indigo-500/50 transition-all group-hover:border-indigo-500 shadow-lg"
                    onError={handleError}
                />
                <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-pulse" title="Available Online"></span>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {mentor.name}
            </h3>
            <p className="text-md font-medium text-indigo-600 mb-2">
                {mentor.role}
            </p>
            <p className="text-sm text-gray-500 italic mb-4 max-w-[250px]">
                "{mentor.tagline}"
            </p>

            <div className="flex flex-wrap justify-center gap-2 mt-2 w-full">
                {mentor.skills.map((skill, index) => (
                    <span
                        key={index}
                        className="flex items-center text-xs font-medium px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-200 shadow-sm"
                    >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {skill}
                    </span>
                ))}
            </div>

            <div className="mt-6 flex justify-between items-center w-full">
                 <p className="text-lg font-bold text-gray-800">
                    ${mentor.rate}<span className="text-sm font-normal text-gray-500">/hr</span>
                </p>
                <p className="text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {mentor.experience}
                </p>
            </div>


            <button
                className="w-full mt-6 bg-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 active:bg-indigo-800 transition duration-300 transform hover:-translate-y-0.5"
            >
                Book Session
            </button>
        </div>
    );
};


export default function App() {
  return (
    <div className="min-h-screen font-sans bg-gray-50 flex flex-col">
        {/* Header Section (for context) */}
        <header className="bg-white border-b border-gray-100 shadow-sm py-4">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                <h1 className="text-2xl font-extrabold text-indigo-600">MentorConnect</h1>
            </div>
        </header>

        {/* Mentorship Section */}
        <section className="px-6 md:px-10 py-16 flex-grow bg-gradient-to-br from-indigo-50 to-white">
            <div className="max-w-7xl mx-auto">
                {/* Headline Area */}
                <div className="text-center mb-12">
                    <span className="inline-block px-4 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full mb-3 shadow-md">
                        Expert Guidance
                    </span>
                    <h2 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        1:1 Mentorship — Learn From The Best
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Book personalized sessions with vetted industry leaders, transforming your potential into performance.
                    </p>
                </div>

                {/* Mentor Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mentors.map((m) => (
                        <MentorCard key={m.id} mentor={m} />
                    ))}
                </div>

                {/* Call to Action Footer */}
                <div className="text-center mt-16 p-8 bg-white rounded-2xl shadow-inner border border-indigo-100">
                    <p className="text-2xl font-semibold text-gray-800 mb-3">Ready to accelerate your career?</p>
                    <button className="px-8 py-3 bg-green-500 text-white font-bold rounded-full text-lg shadow-xl hover:bg-green-600 transition duration-300 transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-green-300">
                        View All 50+ Mentors
                    </button>
                </div>
            </div>
        </section>

      
    </div>
  );
}