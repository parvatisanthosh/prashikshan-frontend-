import React from "react";
// Assuming @heroicons/react/24/solid is available
// Added CodeBracketIcon, CubeTransparentIcon, CpuChipIcon, PaintBrushIcon for course categorization
import { 
  StarIcon, 
  ClockIcon, 
  UsersIcon, 
  CodeBracketIcon, 
  CubeTransparentIcon, 
  CpuChipIcon, 
  PaintBrushIcon 
} from "@heroicons/react/24/solid"; 
// Import useNavigate for routing functionality
import { useNavigate } from "react-router-dom";

const courses = [
  {
    id: 1,
    title: "Frontend Web Development (React)",
    duration: "6 weeks",
    price: 0,
    rating: 4.6,
    students: 1240,
    tag: "Free",
    icon: CodeBracketIcon, // Replaced '💻' with CodeBracketIcon
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    duration: "8 weeks",
    price: 499,
    rating: 4.8,
    students: 2150,
    tag: "Paid",
    icon: CubeTransparentIcon, // Replaced '🧠' with CubeTransparentIcon
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    duration: "10 weeks",
    price: 799,
    rating: 4.7,
    students: 980,
    tag: "Paid",
    icon: CpuChipIcon, // Replaced '🤖' with CpuChipIcon
  },
  {
    id: 4,
    title: "UI/UX Design Foundations",
    duration: "4 weeks",
    price: 0,
    rating: 4.5,
    students: 720,
    tag: "Free",
    icon: PaintBrushIcon, // Replaced '🎨' with PaintBrushIcon
  },
];

function Price({ price }) {
  return price === 0 ? (
    <span className="text-xl font-extrabold text-green-600">
      Free
    </span>
  ) : (
    <span className="text-xl font-extrabold text-slate-800">
      ₹{price}
    </span>
  );
}

export default function Trending() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  return (
    // Section background: Subtle off-white to contrast with cards
    <section className="px-4 md:px-16 lg:px-24 py-16 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
          Trending Now — Learn In-Demand Skills
        </h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl">
          Popular courses — paid & free — to make you internship-ready. Verified by industry experts.
        </p>
        
        {/* Course Grid: 2 columns on tablet, 4 columns on large desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((c) => (
            <div
              key={c.id}
              // Professional Card Styling: Subtle shadow, border, and reduced hover lift
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 
                         transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              
              {/* Icon Container & Tag */}
              <div className="flex justify-between items-center mb-4">
                
                {/* Professional Icon Badge (Now renders the SVG component) */}
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm">
                    {/* Render the SVG component passed in the data */}
                    <c.icon className="w-6 h-6 text-indigo-700" /> 
                </div>
                
                {/* Subtle Tag Design */}
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${
                    // Using a cleaner border-based tag design
                    c.tag === "Free"
                      ? "border-green-300 text-green-700 bg-white"
                      : "border-indigo-300 text-indigo-700 bg-white"
                  }`}
                >
                  {c.tag}
                </span>
              </div>
              
              {/* Title & Metadata */}
              <h3 className="text-lg font-bold text-slate-900 min-h-[50px] mb-2">
                {c.title}
              </h3>
              
              {/* Stats Row */}
              <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
                
                {/* Duration */}
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4 text-indigo-500" />
                  {c.duration}
                </span>

                {/* Students */}
                <span className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4 text-indigo-500" />
                  {Math.round(c.students / 100) / 10}K students
                </span>
              </div>

              {/* Rating & Price/CTA Footer */}
              <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-bold text-slate-800">
                    {c.rating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({c.students})
                  </span>
                </div>

                {/* Price */}
                <Price price={c.price} />
              </div>
              
              {/* Enroll Button (Refined Shadow) */}
              <button 
                onClick={() => navigate(`/courses/${c.id}`)} // Redirects to the specific course detail page
                className="mt-4 w-full px-4 py-2.5 
                           bg-indigo-600 text-white font-semibold 
                           rounded-xl shadow-md shadow-indigo-500/20 
                           hover:bg-indigo-700 transition-all active:scale-[0.99]"
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
        
        {/* Call to action footer */}
        <div className="mt-12 text-center">
            <button 
                onClick={() => navigate('/courses')} // Redirects to the main course catalog
                className="px-8 py-3 text-lg font-semibold text-indigo-700 border border-indigo-300 bg-white rounded-full transition-all duration-300 shadow-md hover:bg-indigo-50"
            >
                View All 50+ Courses
            </button>
        </div>
      </div>
    </section>
  );
}