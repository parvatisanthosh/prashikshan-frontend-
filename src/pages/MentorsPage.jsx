// src/pages/MentorsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";


// ------------------------------------------------------------------
// UTILITIES
const formatCurrency = (price) => 
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(price);

// ------------------------------------------------------------------
// MOCK DATA
const MOCK_MENTORS = [
  {
    id: "m1",
    name: "Aisha Khan",
    title: "Senior Product Manager",
    company: "Google",
    companyLogo: "G",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&fit=crop&q=80",
    skills: ["Product Strategy", "Roadmapping", "Interview Prep"],
    languages: ["English", "Hindi"],
    rating: 4.9,
    reviewsCount: 128,
    pricePerSession: 1500,
    sessionDurations: [30, 60],
    timezone: "Asia/Kolkata",
    availabilitySlots: [
      { id: "s1", start: "2026-01-12T09:00:00", label: "Tue, 9:00 AM" },
      { id: "s2", start: "2026-01-12T10:00:00", label: "Tue, 10:00 AM" },
    ],
    bio: "I help early-career PMs land their first product job. Ex-Microsoft, now leading growth at Google. Let's work on your resume and mock interviews.",
    metrics: { sessions: 356, acceptance: 98 },
    verified: true,
    superMentor: true,
    domain: "Product",
    availableToday: true
  },
  {
    id: "m2",
    name: "Rohit Gupta",
    title: "Staff Software Engineer",
    company: "Netflix",
    companyLogo: "N",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80",
    skills: ["React", "System Design", "Frontend"],
    languages: ["English"],
    rating: 4.8,
    reviewsCount: 84,
    pricePerSession: 2000,
    sessionDurations: [45],
    timezone: "US/Pacific",
    availabilitySlots: [
      { id: "s3", start: "2026-01-13T20:00:00", label: "Wed, 8:00 PM" },
    ],
    bio: "Frontend infrastructure expert. I can help you master React performance, advanced hooks, and crack system design rounds.",
    metrics: { sessions: 120, acceptance: 90 },
    verified: true,
    superMentor: false,
    domain: "Engineering",
    availableToday: false
  },
  {
    id: "m3",
    name: "Dr. Neha Rao",
    title: "AI Researcher",
    company: "OpenAI",
    companyLogo: "O",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&fit=crop&q=80",
    skills: ["Machine Learning", "LLMs", "Python"],
    languages: ["English", "Kannada"],
    rating: 5.0,
    reviewsCount: 210,
    pricePerSession: 3500,
    sessionDurations: [60],
    timezone: "Asia/Kolkata",
    availabilitySlots: [
      { id: "s4", start: "2026-01-15T11:00:00", label: "Fri, 11:00 AM" },
    ],
    bio: "Transitioning into AI? I guide engineers on building their first LLM applications and understanding the math behind transformers.",
    metrics: { sessions: 500, acceptance: 95 },
    verified: true,
    superMentor: true,
    domain: "Data Science",
    availableToday: true
  },
  {
    id: "m4",
    name: "Vikram Singh",
    title: "Design Lead",
    company: "Airbnb",
    companyLogo: "A",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&fit=crop&q=80",
    skills: ["UI/UX", "Figma", "Portfolio Review"],
    languages: ["English", "Punjabi"],
    rating: 4.7,
    reviewsCount: 65,
    pricePerSession: 1200,
    sessionDurations: [30, 60],
    timezone: "Europe/London",
    availabilitySlots: [],
    bio: "Design is about solving problems. I help designers build portfolios that get hired by top tech companies.",
    metrics: { sessions: 85, acceptance: 88 },
    verified: false,
    superMentor: false,
    domain: "Design",
    availableToday: false
  },
  {
    id: "m5",
    name: "Anjali Mehta",
    title: "Marketing Manager",
    company: "Spotify",
    companyLogo: "S",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80",
    skills: ["Brand Strategy", "Social Media", "Growth"],
    languages: ["English", "Hindi"],
    rating: 4.6,
    reviewsCount: 42,
    pricePerSession: 900,
    sessionDurations: [45],
    timezone: "Asia/Kolkata",
    availabilitySlots: [
        { id: "s5", start: "2026-01-12T16:00:00", label: "Tue, 4:00 PM" }
    ],
    bio: "Growth marketer with 7 years of experience. I can help you understand the modern marketing landscape.",
    metrics: { sessions: 60, acceptance: 92 },
    verified: true,
    superMentor: false,
    domain: "Marketing",
    availableToday: true
  }
];

export default function MentorsPage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) {
    window.location.hash = `#/${route}`;
  }

  // --- Filter State ---
  const [query, setQuery] = useState("");
  const [selectedDomains, setSelectedDomains] = useState(new Set());
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [maxPrice, setMaxPrice] = useState(5000);
  const [availableToday, setAvailableToday] = useState(false);
  
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [selectedMentor, setSelectedMentor] = useState(null); // Profile Modal
  const [bookingMentor, setBookingMentor] = useState(null); // Booking Modal

  const debounceRef = useRef(null);

  // --- Helpers ---
  const toggleSet = (setState, val) => {
    setState(prev => {
      const next = new Set(prev);
      if(next.has(val)) next.delete(val); else next.add(val);
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setSelectedDomains(new Set());
    setSelectedCompanies(new Set());
    setMaxPrice(5000);
    setAvailableToday(false);
    fetchMentors();
  };

  const fetchMentors = () => {
    setLoading(true);
    if(debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      let filtered = MOCK_MENTORS;
      
      // Text Search
      if(query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(m => (m.name + m.company + m.title + m.skills.join(' ')).toLowerCase().includes(q));
      }

      // Domain Filter
      if(selectedDomains.size > 0) filtered = filtered.filter(m => selectedDomains.has(m.domain));
      
      // Company Filter
      if(selectedCompanies.size > 0) filtered = filtered.filter(m => selectedCompanies.has(m.company));

      // Price & Availability
      filtered = filtered.filter(m => m.pricePerSession <= maxPrice);
      if(availableToday) filtered = filtered.filter(m => m.availableToday);

      setMentors(filtered);
      setLoading(false);
    }, 300);
  };

  useEffect(() => { fetchMentors(); }, [query, selectedDomains, selectedCompanies, maxPrice, availableToday]);

  const handleBookingConfirm = (details) => {
    alert(`Booking Confirmed!\nMentor: ${details.mentorName}\nSlot: ${details.slot}\nDuration: ${details.duration}min`);
    setBookingMentor(null);
  };

  // --- CONSTANTS ---
  const DOMAINS = ["Engineering", "Product", "Data Science", "Design", "Marketing"];
  const COMPANIES = ["Google", "Netflix", "Airbnb", "Spotify", "Microsoft", "Amazon"];

  return (
   <div>
    {/* 1. Global Navigation (Fixed) */}
          <div className="sticky top-0 z-50 bg-white shadow-sm">
            <Navbar
              user={{ name: "Asha Verma" }}
              onToggleSidebar={() => setSidebarOpen(true)}
              onSearch={(q) => console.log("Search: " + q)}
              onNavigate={(r) => handleNavigate(r)}
            />
          </div>
    
          {/* Mobile Sidebar */}
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onNavigate={(route) => handleNavigate(route)}
          />
     <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">

      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
          
          {/* --- LEFT SIDEBAR (Filters) --- */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-7rem)] flex flex-col">
              
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" /></svg>
                  <span>Filters</span>
                </div>
                <button onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide">RESET</button>
              </div>

              <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Availability Toggle */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                   <span className="text-sm font-semibold text-blue-800">Available Today</span>
                   <div 
                     onClick={() => setAvailableToday(!availableToday)}
                     className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${availableToday ? 'bg-blue-600' : 'bg-gray-300'}`}
                   >
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${availableToday ? 'left-6' : 'left-1'}`}></div>
                   </div>
                </div>

                <FilterSection title="Domain" defaultOpen={true}>
                   <div className="space-y-2 mt-2">
                      {DOMAINS.map(d => (
                        <CustomCheckbox key={d} label={d} checked={selectedDomains.has(d)} onChange={() => toggleSet(setSelectedDomains, d)} />
                      ))}
                   </div>
                </FilterSection>

                <FilterSection title="Price Per Session">
                   <div className="mt-4 px-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>₹0</span>
                        <span className="font-bold text-blue-600">₹{maxPrice}</span>
                      </div>
                      <input 
                        type="range" min="0" max="10000" step="500" 
                        value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                   </div>
                </FilterSection>

                <FilterSection title="Company" isLast={true}>
                   <div className="space-y-2 mt-2">
                      {COMPANIES.map(c => (
                        <CustomCheckbox key={c} label={c} checked={selectedCompanies.has(c)} onChange={() => toggleSet(setSelectedCompanies, c)} />
                      ))}
                   </div>
                </FilterSection>

              </div>
            </div>
          </aside>

          {/* --- CENTER FEED (Grid) --- */}
          <main className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
               <div>
                 <h1 className="text-2xl font-bold text-gray-900">Find a Mentor</h1>
                 <p className="text-sm text-gray-500">Book 1:1 sessions with industry experts.</p>
               </div>
               
               {/* Search Bar */}
               <div className="relative group">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                  <input 
                    value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search name, role, company..." 
                    className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
                  />
               </div>
            </div>

            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="bg-white h-80 rounded-xl border border-gray-200" />)}
               </div>
            ) : mentors.length === 0 ? (
               <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                  <div className="text-gray-400 mb-2 font-medium">No mentors found</div>
                  <button onClick={clearFilters} className="text-blue-600 hover:underline text-sm font-semibold">Clear Filters</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {mentors.map(mentor => (
                     <MentorCard 
                        key={mentor.id} 
                        mentor={mentor} 
                        onView={() => setSelectedMentor(mentor)}
                        onBook={() => setBookingMentor(mentor)}
                     />
                  ))}
               </div>
            )}
          </main>

          {/* --- RIGHT SIDEBAR (Widgets) --- */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24">
             <div className="space-y-5 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar pb-4">
                
                {/* Upcoming Sessions Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900 text-sm">Upcoming Sessions</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">2</span>
                   </div>
                   <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                         <div className="text-center bg-white rounded border border-gray-200 p-1 min-w-[40px]">
                            <div className="text-[10px] text-gray-500 uppercase font-bold">JAN</div>
                            <div className="text-lg font-bold text-gray-900">14</div>
                         </div>
                         <div>
                            <div className="text-xs font-bold text-gray-900">Mock Interview</div>
                            <div className="text-[11px] text-gray-500">with Rohit Gupta</div>
                            <div className="text-[10px] text-blue-600 mt-1 font-medium">2:00 PM - 2:30 PM</div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Top Mentors Widget */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                   <h3 className="font-bold text-gray-900 mb-4 text-sm">Mentors of the Week</h3>
                   <div className="space-y-4">
                      {[MOCK_MENTORS[0], MOCK_MENTORS[2]].map((m, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <img src={m.image} alt={m.name} className="w-10 h-10 rounded-full object-cover" />
                           <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-gray-900 truncate">{m.name}</div>
                              <div className="text-[10px] text-gray-500 truncate">{m.title}</div>
                           </div>
                           <button onClick={() => setSelectedMentor(m)} className="text-blue-600 text-xs font-bold hover:bg-blue-50 px-2 py-1 rounded">View</button>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Promo Card */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white shadow-lg">
                   <h3 className="font-bold text-base mb-1">Become a Mentor</h3>
                   <p className="text-gray-300 text-xs mb-3">Share your expertise and earn while guiding the next generation.</p>
                   <button className="w-full py-2 bg-white text-gray-900 font-bold rounded-lg text-xs hover:bg-gray-100 transition-colors">Apply Now</button>
                </div>

             </div>
          </aside>

        </div>
      </div>

      {/* Modals */}
      {selectedMentor && (
        <MentorProfileModal 
          mentor={selectedMentor} 
          onClose={() => setSelectedMentor(null)} 
          onBook={(m) => { setSelectedMentor(null); setBookingMentor(m); }}
        />
      )}

      {bookingMentor && (
        <BookingModal 
          mentor={bookingMentor} 
          onClose={() => setBookingMentor(null)}
          onConfirm={handleBookingConfirm}
        />
      )}

    </div>
   ]
   </div>
  );
}

/* ---------------------------------------------------------------------
   COMPONENTS
--------------------------------------------------------------------- */

// 1. Sidebar Components
function FilterSection({ title, children, defaultOpen = false, isLast = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`py-3 ${!isLast ? 'border-b border-gray-50' : ''}`}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full group py-1">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-600 transition-colors">{title}</span>
        <svg className={`w-3.5 h-3.5 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>{children}</div>
    </div>
  );
}

function CustomCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group select-none">
      <div className="relative flex items-center mt-0.5">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
        <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
          <svg className={`w-2.5 h-2.5 text-white transform ${checked ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
    </label>
  );
}

// 2. Mentor Card
function MentorCard({ mentor, onView, onBook }) {
  return (
    <div onClick={onView} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:border-blue-200 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden relative">
      
      {/* Banner Background */}
      <div className="h-20 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
         {mentor.superMentor && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
               SUPER MENTOR
            </div>
         )}
      </div>

      <div className="px-5 pb-5 flex-1 flex flex-col">
         {/* Profile Pic overlapping banner */}
         <div className="flex justify-between items-end -mt-8 mb-3 z-5">
            <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full border-4 border-white object-cover shadow-sm bg-white" />
            <div className="text-right">
               <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-sm pt-10">
                  <span>{mentor.rating}</span>
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
               </div>
               <div className="text-[10px] text-gray-400">{mentor.reviewsCount} Reviews</div>
            </div>
         </div>

         {/* Info */}
         <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{mentor.name}</h3>
         <p className="text-sm text-gray-600 mb-1">{mentor.title}</p>
         <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <span className="font-semibold text-gray-700">@ {mentor.company}</span>
            {mentor.verified && <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
         </div>

         <div className="flex flex-wrap gap-1.5 mb-4">
            {mentor.skills.slice(0,3).map(s => (
               <span key={s} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] font-medium rounded border border-gray-100">{s}</span>
            ))}
         </div>

         {/* Footer */}
         <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">{formatCurrency(mentor.pricePerSession)}<span className="text-xs font-normal text-gray-400">/session</span></span>
            <button 
               onClick={(e) => { e.stopPropagation(); onBook(mentor); }}
               className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
            >
               Book Now
            </button>
         </div>
      </div>
    </div>
  );
}

// 3. Mentor Profile Modal
function MentorProfileModal({ mentor, onClose, onBook }) {
  const [tab, setTab] = useState("overview");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
         
         {/* Left Side: Profile Info */}
         <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
            {/* Header Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600">
               <button onClick={onClose} className="absolute top-4 left-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors md:hidden z-20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
               </button>
            </div>
            
            <div className="px-8 pb-8">
               <div className="flex justify-between items-end -mt-12 mb-6 ">
                  <img src={mentor.image} alt={mentor.name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                  <div className="flex gap-2 mb-2">
                     <a href="#" className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-50 hover:text-blue-600"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></a>
                  </div>
               </div>

               <h2 className="text-3xl font-bold text-gray-900">{mentor.name}</h2>
               <p className="text-lg text-gray-600 mb-4">{mentor.title} at <span className="font-semibold text-gray-800">{mentor.company}</span></p>

               {/* Tabs */}
               <div className="flex gap-6 border-b border-gray-200 mb-6">
                  <button onClick={() => setTab("overview")} className={`pb-3 text-sm font-bold ${tab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Overview</button>
                  <button onClick={() => setTab("reviews")} className={`pb-3 text-sm font-bold ${tab === "reviews" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-800"}`}>Reviews ({mentor.reviewsCount})</button>
               </div>

               {tab === "overview" ? (
                  <div className="space-y-6">
                     <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">About</h4>
                        <p className="text-gray-600 leading-relaxed text-sm">{mentor.bio} I have over 10 years of experience in the industry and have mentored 500+ students. My sessions are interactive and tailored to your specific needs.</p>
                     </section>

                     <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                           {mentor.skills.map(s => <span key={s} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{s}</span>)}
                        </div>
                     </section>

                     <section>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Fluent In</h4>
                        <div className="flex gap-2">
                           {mentor.languages.map(l => <span key={l} className="text-gray-600 text-sm">• {l}</span>)}
                        </div>
                     </section>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {/* Mock Reviews */}
                     {[1,2,3].map(i => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl">
                           <div className="flex justify-between items-start mb-2">
                              <div className="font-bold text-gray-900 text-sm">Student Name</div>
                              <div className="text-xs text-gray-500">2 days ago</div>
                           </div>
                           <div className="text-amber-500 text-xs mb-2">★★★★★</div>
                           <p className="text-gray-600 text-sm">Great session! Very helpful feedback on my resume.</p>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Right Side: Booking Panel */}
         <div className="w-full md:w-96 bg-gray-50 border-l border-gray-200 p-6 flex flex-col shrink-0">
            <div className="flex justify-between items-start mb-6">
               <h3 className="font-bold text-gray-900">Book a Session</h3>
               <button onClick={onClose} className="hidden md:block text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 text-sm">Price per session</span>
                  <span className="text-xl font-bold text-gray-900">{formatCurrency(mentor.pricePerSession)}</span>
               </div>
               <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> {mentor.sessionDurations.join(" / ")} min duration</div>
                  <div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg> 1:1 Video Call</div>
               </div>
            </div>

            <h4 className="font-bold text-gray-900 text-sm mb-3">Available Slots</h4>
            <div className="flex-1 overflow-y-auto custom-scrollbar mb-4 space-y-2">
               {mentor.availabilitySlots && mentor.availabilitySlots.length > 0 ? (
                  mentor.availabilitySlots.map(slot => (
                     <button key={slot.id} className="w-full text-left p-3 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:ring-1 hover:ring-blue-500 transition-all group">
                        <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">{slot.label}</div>
                     </button>
                  ))
               ) : (
                  <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">No slots available right now.</div>
               )}
            </div>

            <button 
               onClick={() => onBook(mentor)}
               className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all transform active:scale-95"
            >
               Book Now
            </button>
         </div>

      </div>
    </div>
  );
}

// 4. Booking Flow Modal
function BookingModal({ mentor, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [note, setNote] = useState("");

  const handleConfirm = () => {
    onConfirm({
       mentorName: mentor.name,
       slot: selectedSlot.label,
       duration: mentor.sessionDurations[0],
       note
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl p-6">
         <h2 className="text-xl font-bold text-gray-900 mb-1">Book Session</h2>
         <p className="text-sm text-gray-500 mb-6">with {mentor.name}</p>

         {step === 1 ? (
            <div className="space-y-4">
               <label className="block text-sm font-bold text-gray-700">Select a time slot</label>
               <div className="grid grid-cols-2 gap-3">
                  {mentor.availabilitySlots.map(slot => (
                     <button 
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${selectedSlot?.id === slot.id ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-300'}`}
                     >
                        {slot.label}
                     </button>
                  ))}
               </div>
               <div className="flex justify-end mt-6">
                  <button 
                     disabled={!selectedSlot}
                     onClick={() => setStep(2)}
                     className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     Next
                  </button>
               </div>
            </div>
         ) : (
            <div className="space-y-4">
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
                  <div className="flex justify-between text-sm mb-1"><span>Date</span><span className="font-bold">{selectedSlot.label}</span></div>
                  <div className="flex justify-between text-sm"><span>Duration</span><span className="font-bold">{mentor.sessionDurations[0]} mins</span></div>
               </div>
               
               <label className="block text-sm font-bold text-gray-700">Add a note (Optional)</label>
               <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  placeholder="What do you want to discuss?"
               />

               <div className="flex justify-end gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-50 rounded-lg">Back</button>
                  <button onClick={handleConfirm} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md">Confirm Booking</button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}