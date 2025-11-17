import React from "react";

const feedbacks = [
  {
    name: "Priya S.",
    role: "Student, IIT Delhi",
    rating: 5,
    quote: "EduSphere helped me land my dream internship! The mentorship and courses are top-notch.",
    img: "https://randomuser.me/api/portraits/women/65.jpg"
  },
  {
    name: "Dr. Ramesh K.",
    role: "Dean, ABC College",
    rating: 4,
    quote: "Our students are now industry-ready. The NEP compliance and analytics are a game changer.",
    img: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    name: "Sonal T.",
    role: "HR, TechCorp",
    rating: 5,
    quote: "Hiring interns has never been easier. The platform is intuitive and efficient.",
    img: "https://randomuser.me/api/portraits/women/45.jpg"
  }
];

export default function Feedback() {
  return (
    <section className="px-10 py-20 bg-slate-50 transition-colors">
      <h2 className="text-3xl font-bold text-black mb-8 text-center">Feedback Corner</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {feedbacks.map((f, i) => (
          <div key={i} className="bg-blue-50 p-6 rounded-xl shadow text-center">
            <img src={f.img} alt={f.name} className="w-16 h-16 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-700">{f.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{f.role}</p>
            <div className="flex justify-center mb-2">
              {Array.from({ length: f.rating }).map((_, idx) => (
                <span key={idx} className="text-yellow-400 text-xl">★</span>
              ))}
            </div>
            <blockquote className="italic text-gray-700">“{f.quote}”</blockquote>
          </div>
        ))}
      </div>
    </section>
  );
}
