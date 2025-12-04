import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/heroImage.jpg"; 

export default function Hero() {
  const navigate = useNavigate();

  // Calculate the height needed to subtract the navbar (approx 80px in this design)
  const heroHeightClass = "h-[calc(100vh-80px)]"; 

  return (
    // 1. Overall Container: Using calculated height for maximum screen utilization. 
    <section className={`relative w-full ${heroHeightClass} pt-18 pb-8 px-4 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-center overflow-hidden bg-white font-sans text-slate-900 mb-15`}>
      
      {/* --- BACKGROUND ELEMENTS (Retained for visual interest) --- */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-indigo-50/50 via-white to-white z-0"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl animate-blob-slow animation-delay-4000 z-0 opacity-70"></div>
      
      {/* --- CONTENT LAYOUT --- */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        
        {/* LEFT SIDE: Text and CTAs (Font sizes significantly reduced) */}
        <div className="md:w-3/5 text-center md:text-left">
          
          {/* Tagline/Pre-Title */}
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600 mb-1">
            The Future of Internships
          </p>

          {/* Title: Aggressively reduced font size for desktop and mobile */}
          <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold leading-tight text-slate-900 mb-3">
            Find Internships, Courses & Mentors — 
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700"> All in One Place.</span>
          </h1>

          {/* Subtitle: Reduced font size */}
          <p className="mt-2 text-base text-slate-600 max-w-xl mx-auto md:mx-0">
            **Prashikshan** connects students, colleges, and companies with
            verified opportunities and 1:1 mentorship under a NEP-ready ecosystem.
          </p>

          {/* BUTTON ROW: Interactive CTAs (Vertical margin reduced) */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-6">
            
            {/* Primary CTA - Links to /roleselect */}
            <button 
              onClick={() => navigate("/roleselect")} 
              className="px-5 py-2.5 text-base font-bold text-white bg-indigo-600 rounded-full shadow-xl shadow-indigo-500/50 hover:bg-indigo-700 transition-all duration-300 active:scale-[0.98]"
            >
              Start Your Journey Now
            </button>

            {/* Secondary CTA - Links to /roleselect */}
            <button 
              onClick={() => navigate("/roleselect")}
              className="px-5 py-2.5 text-base font-semibold text-indigo-700 border border-indigo-200 bg-white rounded-full transition-all duration-300 active:scale-[0.98] shadow-md hover:bg-indigo-50"
            >
              Explore Opportunities
            </button>
            
          </div>
        </div>

        {/* RIGHT SIDE — IMAGE/VISUAL (Size reduced for better fit) */}
        <div className="md:w-2/5 flex justify-center py-4 md:py-0">
          
          <div 
            // Aggressively reduced image card size to prevent overflow
            className="w-[280px] h-[280px] lg:w-[320px] lg:h-[320px] rounded-3xl shadow-2xl bg-white border border-slate-100 p-3 
            transform rotate-3 translate-x-3 transition-all duration-500 hover:rotate-0 hover:translate-x-0"
          >
              <img
                src={heroImage}
                alt="Abstract representation of career growth"
                className="w-full h-full object-cover rounded-2xl shadow-xl"
              />
          </div>
        </div>

      </div>
    </section>
  );
}