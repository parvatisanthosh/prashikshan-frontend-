import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const courses = [
  {
    id: 1,
    title: "Frontend Web Development (React)",
    duration: "6 weeks",
    price: 0,
    rating: 4.6,
    students: 1240,
    tag: "Free",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    duration: "8 weeks",
    price: 499,
    rating: 4.8,
    students: 2150,
    tag: "Paid",
  },
  {
    id: 3,
    title: "Machine Learning Basics",
    duration: "10 weeks",
    price: 799,
    rating: 4.7,
    students: 980,
    tag: "Paid",
  },
  {
    id: 4,
    title: "UI/UX Design Foundations",
    duration: "4 weeks",
    price: 0,
    rating: 4.5,
    students: 720,
    tag: "Free",
  },
];

function Price({ price }) {
  return price === 0 ? (
    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
      Free
    </span>
  ) : (
    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
      ₹{price}
    </span>
  );
}

export default function Trending() {
  return (
    <section className="px-6 md:px-10 py-16 bg-slate-50 transition-colors">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Trending Now — Learn In-Demand Skills
        </h2>
        <p className="text-gray-600 mb-6">
          Popular courses — paid & free — to make you internship-ready.
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-xl transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {c.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {c.duration}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    c.tag === "Free"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {c.tag}
                </span>
              </div>
              <div className="flex items-center gap-1 mt-4">
                <StarIcon className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-900">
                  {c.rating}
                </span>
                <span className="text-xs text-gray-500">
                  • {c.students} students
                </span>
              </div>
              <div className="flex justify-between items-center mt-6">
                <Price price={c.price} />
                <button className="px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#1456b8] transition">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
