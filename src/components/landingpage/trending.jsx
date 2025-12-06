import React from "react";
import { 
  StarIcon, 
  ClockIcon, 
  UsersIcon 
} from "@heroicons/react/24/solid"; 
import { useNavigate } from "react-router-dom";
import { getTrendingCourses } from "../../mockData/coursesMockData";

function Price({ price }) {
  return price === 0 ? (
    <span className="text-xl font-extrabold text-green-600">Free</span>
  ) : (
    <span className="text-xl font-extrabold text-slate-800">₹{price}</span>
  );
}

export default function Trending() {
  const navigate = useNavigate();
  const courses = getTrendingCourses(); 

  const handleCourseClick = (course) => {
    if (course.type === "youtube") {
      if (course.externalUrl) {
        window.open(course.externalUrl, "_blank");
      } else {
        alert("YouTube link not available for this course");
      }
    } else {
      navigate(`/courses/${course.id}`);
    }
  };

  return (
    <section className="px-4 md:px-16 lg:px-24 py-16 bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <h2 className="text-4xl font-extrabold text-slate-900 mb-2">
          Trending Now — Learn In-Demand Skills
        </h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl">
          Popular courses — paid & free — to make you internship-ready. Verified by industry experts.
        </p>
        
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl border border-slate-100 
                         transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            >
              
              {/* IMAGE */}
              <div className="mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 h-40">
                <img
                  src={
                    c.image ||
                    "https://via.placeholder.com/400x225?text=Course+Thumbnail"
                  }
                  alt={c.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  
                  // Fallback if image fails
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x225?text=Course+Thumbnail";
                  }}
                />
              </div>
              
              {/* TAG */}
              <span
                className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border mb-3 ${
                  c.price === 0
                    ? "border-green-300 text-green-700 bg-white"
                    : "border-indigo-300 text-indigo-700 bg-white"
                }`}
              >
                {c.price === 0 ? "Free" : "Paid"}
              </span>
              
              {/* TITLE */}
              <h3 className="text-lg font-bold text-slate-900 min-h-[50px] mb-2 line-clamp-2">
                {c.title}
              </h3>

              {/* PROVIDER */}
              <p className="text-sm text-slate-500 mb-2">{c.provider}</p>
              
              {/* STATS */}
              <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6">
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-4 h-4 text-indigo-500" />
                  {c.duration}
                </span>

                <span className="flex items-center gap-1">
                  <UsersIcon className="w-4 h-4 text-indigo-500" />
                  {(c.students / 1000000).toFixed(1)}M
                </span>
              </div>

              {/* FOOTER */}
              <div className="border-t border-slate-100 pt-5 flex justify-between items-center">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg font-bold text-slate-800">
                    {c.rating}
                  </span>
                </div>

                {/* Price */}
                <Price price={c.price} />
              </div>
              
              {/* BUTTON */}
              <button
                onClick={() => handleCourseClick(c)}
                className="mt-4 w-full px-4 py-2.5 
                           bg-indigo-600 text-white font-semibold 
                           rounded-xl shadow-md shadow-indigo-500/20 
                           hover:bg-indigo-700 transition-all active:scale-[0.98]"
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>
        
        {/* CTA FOOTER */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/courses")}
            className="px-8 py-3 text-lg font-semibold text-indigo-700 border border-indigo-300 bg-white rounded-full 
                       transition-all duration-300 shadow-md hover:bg-indigo-50"
          >
            View All 50+ Courses
          </button>
        </div>
      </div>
    </section>
  );
}
