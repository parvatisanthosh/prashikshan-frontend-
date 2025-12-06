import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";
import heroImage from "../../assets/heroImage.jpg";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] pt-20 pb-16 px-6 md:px-10 lg:px-20 flex items-center bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 overflow-hidden">

      {/* Soft Background Blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-purple-300/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[30%] w-96 h-96 bg-pink-300/30 rounded-full blur-3xl animate-blob animation-delay-4000" />

        {/* Soft Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0001_1px,transparent_1px),linear-gradient(to_bottom,#0001_1px,transparent_1px)] bg-[size:22px_22px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* LEFT CONTENT */}
        <div className="flex-1 text-center lg:text-left space-y-7">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-50 border border-indigo-100 rounded-full shadow-sm animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-700 tracking-wide">
              India’s Smart Internship Hub
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight animate-fade-in-up animation-delay-100">
            Transform Your Career With
            <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
  Smarter Internships
</span>

          </h1>

          {/* Subheading */}
          <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200 leading-relaxed">
            Discover verified companies, take curated courses, and receive expert mentorship — all tailored to launch your professional journey.
          </p>

          {/* STATS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-2 animate-fade-in-up animation-delay-300">

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">10,000+</p>
                <p className="text-xs text-slate-500">Active Students</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">500+</p>
                <p className="text-xs text-slate-500">Partner Companies</p>
              </div>
            </div>

          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4 animate-fade-in-up animation-delay-400">

            {/* Primary CTA */}
            <button
              onClick={() => navigate("/roleselect")}
              className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => navigate("/roleselect")}
              className="px-8 py-4 bg-white border-2 border-indigo-200 text-indigo-700 font-semibold rounded-full hover:bg-indigo-50 transition-all duration-300 shadow-sm"
            >
              Explore Opportunities
            </button>
          </div>

          {/* TRUST INDICATORS */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-5 pt-6 text-sm text-slate-500 animate-fade-in-up animation-delay-500">
            {["Verified Companies", "Free to Join", "NEP 2020 Ready"].map((item) => (
              <div className="flex items-center gap-2" key={item}>
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.7-9.3a1 1 0 00-1.4-1.4L9 10.6 7.7 9.3a1 1 0 00-1.4 1.4l2 2a1 1 0 001.4 0l4-4z" />
                </svg>
                <span>{item}</span>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT CONTENT — Premium Image Card */}
        <div className="flex-1 animate-fade-in-up animation-delay-600 flex justify-center lg:justify-end">

          <div className="relative w-[340px] h-[420px] sm:w-[380px] sm:h-[460px] lg:w-[420px] lg:h-[500px]">
            
            {/* Background Layers */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-200 to-pink-200 rotate-3 blur-sm animate-float" />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-200 to-purple-200 rotate-6 blur-sm animate-float animation-delay-1000" />

            {/* Main Image */}
        <div className="relative w-[420px] h-[480px] rounded-3xl overflow-hidden shadow-xl bg-[#f8fafc] border border-slate-200">
  <img
    src={heroImage}
    alt="Students collaborating"
    className="w-full h-full object-cover"
  />

  {/* Subtle top fade for readable overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
</div>

            {/* Floating Stat Badge */}
 <div className="absolute -bottom-4 right-4 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl px-4 py-3 flex items-center gap-3 border border-slate-100">
  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 text-teal-700 font-bold border border-teal-100">
    95%
  </div>
  <div>
    <p className="text-xs font-medium text-slate-500">Success Rate</p>
    <p className="text-base font-bold text-slate-800">Placement Boost</p>
  </div>
</div>
          </div>
        </div>

      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-40px) scale(1.1); }
          66% { transform: translate(-20px,30px) scale(0.9); }
        }
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes bounce-slow {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-fade-in-up { animation: fade-in-up .9s ease-out forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animation-delay-100 { animation-delay: .1s; }
        .animation-delay-200 { animation-delay: .2s; }
        .animation-delay-300 { animation-delay: .3s; }
        .animation-delay-400 { animation-delay: .4s; }
        .animation-delay-500 { animation-delay: .5s; }
        .animation-delay-600 { animation-delay: .6s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

    </section>
  );
}
