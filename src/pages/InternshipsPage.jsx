// src/pages/InternshipsPage.jsx
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";

const USE_MOCK = true;

const MOCK_DATA = [
  {
    id: "m1",
    title: "Frontend Developer Intern",
    company: "BrightApps Pvt Ltd",
    tagline: "Building the next gen SaaS",
    location: "Hyderabad",
    stipendMin: 15000,
    stipendMax: 20000,
    durationText: "3 Months",
    description: "Build responsive UI components, collaborate with designers and backend engineers to ship features. Experience with React and Tailwind CSS is mandatory.",
    skills: ["React", "Tailwind", "TypeScript", "Redux"],
    postedAgo: "3 days ago",
    feature: "Fast response",
    applicants: 120,
    category: "Engineering",
    workMode: "On-site",
    startDate: "2023-12-15",
    badge: "Hiring",
    logoColor: "bg-teal-100 text-teal-600"
  },
  {
    id: "m2",
    title: "Product Design Intern",
    company: "Creo Studio",
    tagline: "Design that speaks",
    location: "Bangalore",
    stipendMin: 10000,
    stipendMax: 15000,
    durationText: "6 Months",
    description: "Work closely with the product team to design user flows and wireframes. Proficiency in Figma and Adobe Creative Suite is required.",
    skills: ["Figma", "UI/UX", "Prototyping", "Wireframing"],
    postedAgo: "5 hours ago",
    feature: "Early Applicant",
    applicants: 45,
    category: "Design",
    workMode: "Hybrid",
    startDate: "2024-01-10",
    badge: "New",
    logoColor: "bg-purple-100 text-purple-600"
  },
  {
    id: "m3",
    title: "Backend Engineer Intern",
    company: "DataFlow Systems",
    tagline: "Scalable backend solutions",
    location: "Pune",
    stipendMin: 20000,
    stipendMax: 30000,
    durationText: "6 Months",
    description: "Assist in developing and maintaining server-side logic. You will work with Node.js and MongoDB to build scalable APIs.",
    skills: ["Node.js", "Express", "MongoDB", "AWS"],
    postedAgo: "1 week ago",
    feature: "PPO Available",
    applicants: 210,
    category: "Engineering",
    workMode: "Remote",
    startDate: "2024-01-05",
    badge: "Hot",
    logoColor: "bg-blue-100 text-blue-600"
  },
  {
    id: "m4",
    title: "Digital Marketing Intern",
    company: "Growth Hacking Co.",
    tagline: "Accelerating brand growth",
    location: "Gurgaon",
    stipendMin: 8000,
    stipendMax: 12000,
    durationText: "2 Months",
    description: "Manage social media accounts, create engaging content, and analyze marketing campaigns. Strong communication skills are a plus.",
    skills: ["SEO", "Social Media", "Google Analytics", "Canva"],
    postedAgo: "2 days ago",
    feature: "Certificate",
    applicants: 85,
    category: "Marketing",
    workMode: "Remote",
    startDate: "2023-12-20",
    badge: "Active",
    logoColor: "bg-pink-100 text-pink-600"
  },
  {
    id: "m5",
    title: "Data Science Intern",
    company: "Insight Analytics",
    tagline: "Turning data into decisions",
    location: "Mumbai",
    stipendMin: 25000,
    stipendMax: 35000,
    durationText: "6 Months",
    description: "Analyze large datasets to extract meaningful insights. Experience with Python, Pandas, and machine learning libraries is preferred.",
    skills: ["Python", "Machine Learning", "SQL", "Pandas"],
    postedAgo: "1 day ago",
    feature: "High Stipend",
    applicants: 350,
    category: "Data Science",
    workMode: "Hybrid",
    startDate: "2024-02-01",
    badge: "Popular",
    logoColor: "bg-green-100 text-green-600"
  },
  {
    id: "m6",
    title: "Content Writer Intern",
    company: "StoryTeller Media",
    tagline: "Weaving words",
    location: "Noida",
    stipendMin: 5000,
    stipendMax: 8000,
    durationText: "3 Months",
    description: "Write creative blogs and articles for our clients. Must have impeccable grammar and a flair for storytelling.",
    skills: ["Creative Writing", "Blogging", "Research", "Copywriting"],
    postedAgo: "4 hours ago",
    feature: "Flexible Hours",
    applicants: 60,
    category: "Content",
    workMode: "Remote",
    startDate: "Immediate",
    badge: "Urgent",
    logoColor: "bg-yellow-100 text-yellow-600"
  },
  {
    id: "m7",
    title: "HR Operations Intern",
    company: "People First",
    tagline: "Employees are our asset",
    location: "Chennai",
    stipendMin: 10000,
    stipendMax: 12000,
    durationText: "4 Months",
    description: "Assist the HR team in recruitment, onboarding, and employee engagement activities.",
    skills: ["Communication", "MS Office", "Recruitment", "Management"],
    postedAgo: "3 days ago",
    feature: "Letter of Rec",
    applicants: 30,
    category: "HR",
    workMode: "On-site",
    startDate: "2024-01-15",
    badge: "Hiring",
    logoColor: "bg-indigo-100 text-indigo-600"
  },
  {
    id: "m8",
    title: "Business Analyst Intern",
    company: "FinTech Corp",
    tagline: "Simplifying finance",
    location: "Bangalore",
    stipendMin: 18000,
    stipendMax: 25000,
    durationText: "6 Months",
    description: "Bridge the gap between IT and business using data analytics. Assess processes and determine requirements.",
    skills: ["Excel", "SQL", "Business Analysis", "Documentation"],
    postedAgo: "6 days ago",
    feature: "PPO Available",
    applicants: 150,
    category: "Business",
    workMode: "Hybrid",
    startDate: "2024-01-01",
    badge: "Featured",
    logoColor: "bg-orange-100 text-orange-600"
  },
  {
    id: "m9",
    title: "React Native Developer",
    company: "Appify Mobile",
    tagline: "Apps for everyone",
    location: "Remote",
    stipendMin: 15000,
    stipendMax: 22000,
    durationText: "3 Months",
    description: "Develop cross-platform mobile applications. Must be familiar with React Native and mobile UI paradigms.",
    skills: ["React Native", "JavaScript", "Mobile Dev", "API Integration"],
    postedAgo: "2 days ago",
    feature: "Remote",
    applicants: 95,
    category: "Engineering",
    workMode: "Remote",
    startDate: "2023-12-25",
    badge: "Active",
    logoColor: "bg-red-100 text-red-600"
  },
  {
    id: "m10",
    title: "Video Editor Intern",
    company: "Streamline Studios",
    tagline: "Visual storytelling",
    location: "Mumbai",
    stipendMin: 12000,
    stipendMax: 18000,
    durationText: "4 Months",
    description: "Edit high-quality video content for YouTube and social media. Proficiency in Premiere Pro or After Effects is essential.",
    skills: ["Premiere Pro", "After Effects", "Video Editing", "Color Grading"],
    postedAgo: "1 week ago",
    feature: "Creative Freedom",
    applicants: 70,
    category: "Design",
    workMode: "On-site",
    startDate: "2024-01-05",
    badge: "Hiring",
    logoColor: "bg-gray-100 text-gray-700"
  }
];

export default function InternshipsPage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) {
    window.location.hash = `#/${route}`;
  }

  // --- Filter State ---
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
   
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedLocations, setSelectedLocations] = useState(new Set());
  const [selectedWorkModes, setSelectedWorkModes] = useState(new Set());
  const [minStipend, setMinStipend] = useState(0);
  const [startDateAfter, setStartDateAfter] = useState("");
  const [selectedDurations, setSelectedDurations] = useState(new Set());
  const [selectedSpecial, setSelectedSpecial] = useState(new Set());
   
  const [selectedInternship, setSelectedInternship] = useState(null);
  const debounceRef = useRef(null);

  // --- HELPERS ---
  function toggleInSet(setState, value) {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategories(new Set());
    setSelectedLocations(new Set());
    setSelectedWorkModes(new Set());
    setMinStipend(0);
    setStartDateAfter("");
    setSelectedDurations(new Set());
    setSelectedSpecial(new Set());
    fetchInternships();
  }

  function fetchInternships() {
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    debounceRef.current = setTimeout(() => {
      let filtered = MOCK_DATA;

      // 1. Text Search
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(it => (it.title + it.company + it.description).toLowerCase().includes(q));
      }
      
      // 2. Filters
      if (selectedCategories.size > 0) filtered = filtered.filter(it => selectedCategories.has(it.category));
      if (selectedLocations.size > 0) {
        filtered = filtered.filter(it => {
          let match = false;
          selectedLocations.forEach(loc => { if(it.location.includes(loc)) match = true; });
          return match;
        });
      }
      if (selectedWorkModes.size > 0) filtered = filtered.filter(it => selectedWorkModes.has(it.workMode));
      if (minStipend > 0) filtered = filtered.filter(it => (it.stipendMax || 0) >= minStipend);
      if (startDateAfter) filtered = filtered.filter(it => it.startDate >= startDateAfter);
      if (selectedDurations.size > 0) filtered = filtered.filter(it => selectedDurations.has(it.durationText));
      
      if (selectedSpecial.size > 0) {
        filtered = filtered.filter(it => {
          let matches = false;
          selectedSpecial.forEach(tag => {
            const combined = (it.feature || "") + (it.badge || "");
            if (tag === "job_offer" && combined.toLowerCase().includes("job offer")) matches = true;
            if (tag === "fast_response" && combined.toLowerCase().includes("fast response")) matches = true;
            if (tag === "early_applicant" && combined.toLowerCase().includes("early")) matches = true;
            if (tag === "women" && combined.toLowerCase().includes("women")) matches = true;
            if (tag === "part_time" && combined.toLowerCase().includes("part time")) matches = true;
          });
          return matches;
        });
      }

      setItems(filtered);
      setLoading(false);
    }, 400);
  }

  useEffect(() => { fetchInternships(); }, [query, selectedCategories, selectedLocations, selectedWorkModes, minStipend, startDateAfter, selectedDurations, selectedSpecial]);

  // --- CONSTANTS ---
  const CATEGORY_OPTIONS = ["Engineering", "Marketing", "Sales", "Design", "Operations"];
  const LOCATION_OPTIONS = ["Delhi", "Gurgaon", "Remote", "Bangalore", "Hyderabad"];
  const WORK_MODE_OPTIONS = ["Remote", "In-office", "Hybrid"];
  const DURATION_OPTIONS = ["1 month", "2 months", "3 months", "4 months", "6 months"];
  const SPECIAL_OPTIONS = [
    { key: "job_offer", label: "Job Offer" },
    { key: "fast_response", label: "Fast Response" },
    { key: "early_applicant", label: "Early Applicant" },
    { key: "women", label: "For Women" },
    { key: "part_time", label: "Part Time" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      
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

      {/* 2. Main Page Content - 3 Column Layout */}
      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
        
          {/* =========================================
             LEFT SIDEBAR (Filters) - FIXED
             ========================================= */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24">
             {/* sticky top-24: Sticks 6rem from top (below navbar)
                 h-[calc(100vh-7rem)]: Height fills remaining screen
                 overflow-hidden: Prevents double scrollbars
             */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-7rem)] flex flex-col">
              
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-2 text-gray-900 font-bold text-base">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                  <span>Filters</span>
                </div>
                <button onClick={clearFilters} className="text-xs font-bold text-blue-600 hover:text-blue-800 tracking-wide uppercase">RESET</button>
              </div>

              {/* Scrollable Filters */}
              <div className="p-5 space-y-2 overflow-y-auto custom-scrollbar flex-1">
                
                {/* Profile */}
                <FilterSection title="Profile" defaultOpen={true}>
                  <div className="space-y-2 mt-2">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <CustomCheckbox 
                        key={cat} label={cat} checked={selectedCategories.has(cat)} 
                        onChange={() => toggleInSet(setSelectedCategories, cat)} 
                      />
                    ))}
                  </div>
                </FilterSection>

                {/* Location */}
                <FilterSection title="Location" defaultOpen={true}>
                   <div className="relative mb-3">
                     <input placeholder="Search city..." className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-8 pr-3 text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all" />
                     <svg className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                   </div>
                   <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {LOCATION_OPTIONS.map((loc) => (
                      <CustomCheckbox 
                        key={loc} label={loc} checked={selectedLocations.has(loc)} 
                        onChange={() => toggleInSet(setSelectedLocations, loc)} 
                      />
                    ))}
                   </div>
                </FilterSection>

                {/* Work Mode */}
                <FilterSection title="Work Mode" defaultOpen={true}>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {WORK_MODE_OPTIONS.map((mode) => (
                       <PillSelector 
                         key={mode} label={mode} selected={selectedWorkModes.has(mode)}
                         onClick={() => toggleInSet(setSelectedWorkModes, mode)}
                       />
                    ))}
                  </div>
                </FilterSection>

                {/* Stipend */}
                <FilterSection title="Min Stipend">
                  <div className="mt-4 px-1">
                    <div className="flex justify-between items-end mb-3">
                      <span className="text-xs font-medium text-gray-500">₹0</span>
                      <span className="text-sm font-bold text-blue-600">₹{minStipend.toLocaleString()}</span>
                    </div>
                    <input
                      type="range" min="0" max="30000" step="1000" value={minStipend}
                      onChange={(e) => setMinStipend(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>
                </FilterSection>

                {/* Start Date */}
                <FilterSection title="Start Date">
                   <div className="mt-2 relative">
                      <input 
                        type="date" 
                        value={startDateAfter}
                        onChange={(e) => setStartDateAfter(e.target.value)}
                        className="w-full border border-gray-200 text-gray-600 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                   </div>
                </FilterSection>

                {/* Duration */}
                <FilterSection title="Duration">
                  <div className="flex flex-wrap gap-2 mt-2">
                    {DURATION_OPTIONS.map((dur) => (
                       <PillSelector 
                         key={dur} label={dur} selected={selectedDurations.has(dur)}
                         onClick={() => toggleInSet(setSelectedDurations, dur)}
                       />
                    ))}
                  </div>
                </FilterSection>

                {/* More Filters */}
                <FilterSection title="Preferences" isLast={true}>
                  <div className="space-y-2 mt-2">
                    {SPECIAL_OPTIONS.map((opt) => (
                      <CustomCheckbox 
                        key={opt.key} label={opt.label} checked={selectedSpecial.has(opt.key)} 
                        onChange={() => toggleInSet(setSelectedSpecial, opt.key)} 
                      />
                    ))}
                  </div>
                </FilterSection>

              </div>
            </div>
          </aside>

          {/* =========================================
             CENTER FEED (Main Content)
             ========================================= */}
          <main className="flex-1 min-w-0">
            
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Recommended Internships</h1>
            <p className="text-sm text-gray-500 mb-6">Explore opportunities tailored to your skills.</p>

            {/* Sticky Search Bar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 mb-6 sticky top-20 z-20">
              <div className="flex-1 flex items-center gap-3 px-2">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                 <input 
                    value={query} onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by role, company, skills..." 
                    className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
                 />
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md shadow-blue-100">
                Find
              </button>
            </div>

            {/* Card List */}
            {loading ? (
               <div className="space-y-4 animate-pulse">
                  {[1,2,3].map(i => <div key={i} className="bg-white h-64 rounded-xl border border-gray-200" />)}
               </div>
            ) : items.length === 0 ? (
               <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                  <div className="text-gray-400 mb-2 font-medium">No internships found</div>
                  <button onClick={clearFilters} className="text-blue-600 hover:underline text-sm font-semibold">Clear Filters</button>
               </div>
            ) : (
               <div className="space-y-5">
                  {items.map(item => (
                     <LargeInternshipCard key={item.id} data={item} onApply={() => setSelectedInternship(item)} />
                  ))}
               </div>
            )}
          </main>

          {/* =========================================
             RIGHT SIDEBAR (Widgets)
             ========================================= */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24">
             <div className="space-y-5 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar pb-4">
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">Profile Strength</h3>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                </div>
                <p className="text-xs text-gray-500 mb-4">Intermediate (70%)</p>
                <button className="w-full py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">Complete Profile</button>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                 <h3 className="font-bold text-gray-900 mb-4 text-sm">Top Recruiters</h3>
                 <div className="space-y-4">
                    {['Google', 'Microsoft', 'Amazon'].map((company, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">{company[0]}</div>
                        <div>
                          <div className="text-xs font-bold text-gray-800">{company}</div>
                          <div className="text-[10px] text-gray-500">4 new roles</div>
                        </div>
                        <button className="ml-auto text-blue-600 text-[10px] font-bold hover:underline">Follow</button>
                      </div>
                    ))}
                 </div>
              </div>



            </div>
          </aside>

        </div>
      </div>

      {selectedInternship && <ApplyModal internship={selectedInternship} onClose={() => setSelectedInternship(null)} />}
    </div>
  );
}


/* ---------------------------------------------------------------------
   SUB-COMPONENTS
--------------------------------------------------------------------- */

// 1. Accordion Section
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

// 2. Custom Blue Checkbox
function CustomCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group select-none">
      <div className="relative flex items-center mt-0.5">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={onChange} />
        <div className={`w-4 h-4 rounded border transition-all duration-200 flex items-center justify-center ${checked ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
          <svg className={`w-2.5 h-2.5 text-white transform transition-transform ${checked ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
        </div>
      </div>
      <span className={`text-sm transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{label}</span>
    </label>
  );
}

// 3. Pill Selector
function PillSelector({ label, selected, onClick }) {
  return (
    <button onClick={onClick} className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${selected ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-gray-900"}`}>
      {label}
    </button>
  );
}

// 4. Large Card
function LargeInternshipCard({ data, onApply }) {
  return (
    <div 
      onClick={onApply}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer group relative"
    >
      <div className="flex items-start gap-5">
        <div className={`w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-xl font-bold shadow-sm ${data.logoColor}`}>
          {data.company.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <div className="pr-2">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate leading-tight">{data.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="font-semibold text-gray-700">{data.company}</span>
                <span className="text-gray-300">•</span>
                <span className="italic truncate">{data.tagline}</span>
              </div>
            </div>
            {data.badge && <span className="shrink-0 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{data.badge}</span>}
          </div>

          <div className="h-px bg-gray-100 w-full my-3"></div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mb-3">
             <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {data.location}
             </div>
             <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span className="font-semibold text-gray-900">₹{data.stipendMin.toLocaleString()} - {data.stipendMax.toLocaleString()}</span>
             </div>
             <div className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100">
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {data.durationText}
             </div>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{data.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {data.skills.map(s => <span key={s} className="px-2.5 py-1 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">{s}</span>)}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
             <div className="flex items-center gap-3">
               {data.feature && (
                 <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                   {data.feature}
                 </span>
               )}
               <span className="text-[11px] text-gray-400 font-medium">{data.applicants} applicants</span>
             </div>
             <div className="text-[11px] font-medium text-gray-400">{data.postedAgo}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Apply Modal (Detailed View)
function ApplyModal({ internship, onClose }) {
  // Prevent click bubbling to backdrop
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        onClick={handleModalClick}
        className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between bg-white">
          <div className="flex items-center gap-4">
             <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm ${internship.logoColor}`}>
                {internship.company.charAt(0)}
             </div>
             <div>
               <h2 className="text-xl font-bold text-gray-900 leading-tight">{internship.title}</h2>
               <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span className="font-semibold text-gray-700">{internship.company}</span>
                  <span>•</span>
                  <span>{internship.location}</span>
               </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div className="text-xs text-gray-500 mb-1">Stipend</div>
               <div className="font-semibold text-gray-800 text-sm">₹{internship.stipendMin / 1000}k - {internship.stipendMax / 1000}k</div>
             </div>
             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div className="text-xs text-gray-500 mb-1">Duration</div>
               <div className="font-semibold text-gray-800 text-sm">{internship.durationText}</div>
             </div>
             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div className="text-xs text-gray-500 mb-1">Start Date</div>
               <div className="font-semibold text-gray-800 text-sm">{internship.startDate}</div>
             </div>
             <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
               <div className="text-xs text-gray-500 mb-1">Applicants</div>
               <div className="font-semibold text-gray-800 text-sm">{internship.applicants}</div>
             </div>
          </div>

          <h3 className="font-bold text-gray-900 mb-2">About the internship</h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {internship.description}
            <br /><br />
            As a {internship.title}, you will be responsible for key deliverables and working with cross-functional teams. We are looking for someone with a passion for {internship.category} and a drive to learn.
          </p>

          <h3 className="font-bold text-gray-900 mb-2">Skills required</h3>
          <div className="flex flex-wrap gap-2 mb-6">
             {internship.skills.map(s => (
               <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                 {s}
               </span>
             ))}
          </div>

          <h3 className="font-bold text-gray-900 mb-2">Perks</h3>
          <div className="flex gap-4 text-sm text-gray-600">
             <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Certificate</span>
             <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Letter of Recommendation</span>
             {internship.workMode === 'Remote' && <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Flexible Hours</span>}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
           <button onClick={onClose} className="px-5 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-sm">
             Close
           </button>
           <button onClick={() => {alert("Application Submitted!"); onClose();}} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md text-sm">
             Apply Now
           </button>
        </div>
      </div>
    </div>
  );
}