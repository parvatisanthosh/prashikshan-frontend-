// src/pages/CoursesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";
import { getAllCourses } from "../mockData/coursesMockData.js";

/**
 * CoursesPage.jsx
 * - Features: Courses from shared mock data, Real Images, YouTube Links, Advanced Filtering
 */

const USE_MOCK = true;
// MOCK DATA - Using shared courses data
const MOCK_COURSES = getAllCourses();

export default function CoursesPage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) { window.location.hash = `#/${route}`; }

  // --- Filter State ---
  const [query, setQuery] = useState("");
  
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [selectedLevels, setSelectedLevels] = useState(new Set());
  const [selectedLanguages, setSelectedLanguages] = useState(new Set());
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minRating, setMinRating] = useState(0); 
  const [selectedDurations, setSelectedDurations] = useState(new Set()); 
  const [selectedFeatures, setSelectedFeatures] = useState(new Set()); 
  const [typeFilter, setTypeFilter] = useState("all");

  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [openCourse, setOpenCourse] = useState(null);
  const debounceRef = useRef(null);

  // --- Helpers ---
  function toggleSet(setState, value) {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setSelectedCategories(new Set());
    setSelectedLevels(new Set());
    setSelectedLanguages(new Set());
    setMaxPrice(15000);
    setMinRating(0);
    setSelectedDurations(new Set());
    setSelectedFeatures(new Set());
    setTypeFilter("all");
    fetchCourses();
  }

  function fetchCourses() {
    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      let filtered = MOCK_COURSES;
      
      // 1. Text Search
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(c => (c.title + c.author + c.tags.join(" ")).toLowerCase().includes(q));
      }
      
      // 2. Filters
      if (typeFilter !== "all") {
        filtered = filtered.filter(c => c.type === typeFilter);
      }

      if (selectedCategories.size > 0) filtered = filtered.filter(c => selectedCategories.has(c.category));
      if (selectedLevels.size > 0) filtered = filtered.filter(c => selectedLevels.has(c.level));
      if (selectedLanguages.size > 0) filtered = filtered.filter(c => selectedLanguages.has(c.language));
      
      filtered = filtered.filter(c => c.price <= maxPrice);
      if (minRating > 0) filtered = filtered.filter(c => c.rating >= minRating);

      if (selectedDurations.size > 0) {
        filtered = filtered.filter(c => {
          let match = false;
          if (selectedDurations.has("short") && c.estimatedHours < 5) match = true;
          if (selectedDurations.has("medium") && c.estimatedHours >= 5 && c.estimatedHours <= 20) match = true;
          if (selectedDurations.has("long") && c.estimatedHours > 20) match = true;
          return match;
        });
      }

      if (selectedFeatures.size > 0) {
        filtered = filtered.filter(c => {
          if (selectedFeatures.has("certificate") && !c.hasCertificate) return false;
          if (selectedFeatures.has("lifetime") && !c.hasLifetimeAccess) return false;
          return true;
        });
      }

      setCourses(filtered);
      setLoading(false);
    }, 400);
  }

  useEffect(() => { 
    fetchCourses(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedCategories, selectedLevels, selectedLanguages, maxPrice, minRating, selectedDurations, selectedFeatures, typeFilter]);

  const handleEnroll = (course) => {
    if (course.type === 'youtube') {
      if (course.externalUrl) {
        window.open(course.externalUrl, '_blank');
      } else {
        alert('YouTube link not available for this course');
      }
    } else {
      alert(`Successfully enrolled in ${course.title}!`);
      setEnrolledIds(prev => new Set([...prev, course.id]));
    }
  };

  const handleViewDetails = (course) => {
    setOpenCourse(course);
  };

  // --- UI Constants ---
  const CATEGORY_OPTIONS = ["Development", "Data Science", "Design", "Business", "Marketing"];
  const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];
  const LANGUAGE_OPTIONS = ["English", "Hindi"];
  const FEATURE_OPTIONS = [
    { key: "certificate", label: "Certificate Included" },
    { key: "lifetime", label: "Lifetime Access" }
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      
      {/* 1. Global Navigation */}
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar user={{ name: "Asha Verma" }} onToggleSidebar={() => setSidebarOpen(true)} onSearch={() => {}} onNavigate={handleNavigate} />
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={handleNavigate} />

      {/* 2. Main Layout */}
      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
          
          {/* =========================================
             LEFT SIDEBAR (Filters) - FIXED
             ========================================= */}
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
                
                {/* 0. Course Type */}
                <FilterSection title="Course Type" defaultOpen={true}>
                   <div className="space-y-2 mt-2">
                      {[
                        { id: 'all', label: 'All Courses' },
                        { id: 'free', label: 'Free' },
                        { id: 'paid', label: 'Paid' },
                        { id: 'youtube', label: 'YouTube' }
                      ].map((type) => (
                        <label key={type.id} className="flex items-center gap-3 cursor-pointer group select-none">
                           <div className="relative flex items-center mt-0.5">
                              <input 
                                type="radio" 
                                name="course_type"
                                checked={typeFilter === type.id} 
                                onChange={() => setTypeFilter(type.id)}
                                className="peer sr-only"
                              />
                              <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${typeFilter === type.id ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'}`}>
                                 <div className={`w-2 h-2 rounded-full bg-blue-600 transition-transform ${typeFilter === type.id ? 'scale-100' : 'scale-0'}`}></div>
                              </div>
                           </div>
                           <span className={`text-sm transition-colors ${typeFilter === type.id ? 'text-gray-900 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>{type.label}</span>
                        </label>
                      ))}
                   </div>
                </FilterSection>

                {/* 1. Subject */}
                <FilterSection title="Subject" defaultOpen={true}>
                  <div className="space-y-2 mt-2">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <CustomCheckbox key={cat} label={cat} checked={selectedCategories.has(cat)} onChange={() => toggleSet(setSelectedCategories, cat)} />
                    ))}
                  </div>
                </FilterSection>

                {/* 2. Rating */}
                <FilterSection title="Ratings" defaultOpen={true}>
                   <div className="space-y-2 mt-2">
                      {[4.5, 4.0, 3.5, 3.0].map(r => (
                        <label key={r} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded -ml-1">
                           <input type="radio" name="rating" checked={minRating === r} onChange={() => setMinRating(r)} className="text-blue-600 focus:ring-blue-500 cursor-pointer" />
                           <div className="flex items-center text-amber-400 text-sm">
                              {Array.from({length: 5}).map((_, i) => (
                                 <svg key={i} className={`w-4 h-4 ${i < Math.floor(r) ? 'fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                              ))}
                              <span className="ml-2 text-gray-600 font-medium text-xs">& up</span>
                           </div>
                        </label>
                      ))}
                   </div>
                </FilterSection>

                {/* 3. Price */}
                <FilterSection title="Price Range">
                   <div className="mt-4 px-1">
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>Free</span>
                        <span className="font-bold text-blue-600">₹{maxPrice.toLocaleString()}</span>
                      </div>
                      <input 
                        type="range" min="0" max="15000" step="1000" 
                        value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                   </div>
                </FilterSection>

                {/* 4. Duration */}
                <FilterSection title="Video Duration">
                   <div className="space-y-2 mt-2">
                      <CustomCheckbox label="Short (< 5 Hours)" checked={selectedDurations.has("short")} onChange={() => toggleSet(setSelectedDurations, "short")} />
                      <CustomCheckbox label="Medium (5 - 20 Hours)" checked={selectedDurations.has("medium")} onChange={() => toggleSet(setSelectedDurations, "medium")} />
                      <CustomCheckbox label="Long (20+ Hours)" checked={selectedDurations.has("long")} onChange={() => toggleSet(setSelectedDurations, "long")} />
                   </div>
                </FilterSection>

                {/* 5. Features */}
                <FilterSection title="Features">
                   <div className="space-y-2 mt-2">
                      {FEATURE_OPTIONS.map(opt => (
                        <CustomCheckbox key={opt.key} label={opt.label} checked={selectedFeatures.has(opt.key)} onChange={() => toggleSet(setSelectedFeatures, opt.key)} />
                      ))}
                   </div>
                </FilterSection>

                {/* 6. Level */}
                <FilterSection title="Level">
                   <div className="space-y-2 mt-2">
                      {LEVEL_OPTIONS.map(lvl => (
                        <CustomCheckbox key={lvl} label={lvl} checked={selectedLevels.has(lvl)} onChange={() => toggleSet(setSelectedLevels, lvl)} />
                      ))}
                   </div>
                </FilterSection>

                {/* 7. Language */}
                <FilterSection title="Language" isLast={true}>
                   <div className="space-y-2 mt-2">
                      {LANGUAGE_OPTIONS.map(l => (
                        <CustomCheckbox key={l} label={l} checked={selectedLanguages.has(l)} onChange={() => toggleSet(setLanguageFilter, l)} />
                      ))}
                   </div>
                </FilterSection>

              </div>
            </div>
          </aside>

          {/* =========================================
             CENTER FEED (Course Grid)
             ========================================= */}
          <main className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Explore Courses</h1>
            <p className="text-sm text-gray-500 mb-6">Upgrade your skills with our curated learning paths.</p>

            {/* Sticky Search Bar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 mb-6 sticky top-20 z-20">
               <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
               <input 
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search Python, React, Data Science..." 
                  className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
               />
               <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all">Search</button>
            </div>

            {/* Grid */}
            {loading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
                  {[1,2,3,4].map(i => <div key={i} className="bg-white h-80 rounded-xl border border-gray-200" />)}
               </div>
            ) : courses.length === 0 ? (
               <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
                  <div className="text-gray-400 mb-2 font-medium">No courses match your filters</div>
                  <button onClick={clearFilters} className="text-blue-600 hover:underline text-sm font-semibold">Clear Filters</button>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map(course => (
                     <CourseCard 
                       key={course.id} 
                       course={course} 
                       isEnrolled={enrolledIds.has(course.id)}
                       onView={() => handleViewDetails(course)}
                       onEnroll={() => handleEnroll(course)}
                     />
                  ))}
               </div>
            )}
          </main>

          {/* =========================================
             RIGHT SIDEBAR (Widgets)
             ========================================= */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24">
             <div className="space-y-5 h-[calc(100vh-7rem)] overflow-y-auto custom-scrollbar pb-4">
                
                {/* Widget 1: My Learning */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                   <h3 className="font-bold text-gray-900 mb-3 text-sm">My Learning</h3>
                   {enrolledIds.size === 0 ? (
                     <p className="text-xs text-gray-500 italic">No active courses yet.</p>
                   ) : (
                     <div className="space-y-3">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">JS</div>
                           <div className="flex-1">
                              <div className="text-xs font-bold text-gray-800">Advanced React</div>
                              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '40%'}}></div>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}
                </div>

                {/* Widget 2: Popular Tags */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                   <h3 className="font-bold text-gray-900 mb-3 text-sm">Popular Topics</h3>
                   <div className="flex flex-wrap gap-2">
                      {['Python', 'Web Dev', 'Machine Learning', 'Design', 'Marketing'].map(tag => (
                        <span key={tag} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-100 cursor-pointer hover:bg-gray-100">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>


             </div>
          </aside>

        </div>
      </div>

      {/* Course Modal */}
      {openCourse && (
        <CourseDetailModal 
          course={openCourse} 
          onClose={() => setOpenCourse(null)} 
          onEnroll={() => handleEnroll(openCourse)}
          isEnrolled={enrolledIds.has(openCourse.id)}
        />
      )}

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

// 2. Custom Checkbox
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

// 3. Course Card (Image Card for Grid)
function CourseCard({ course, isEnrolled, onView, onEnroll }) {
  return (
    <div onClick={onView} className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden h-full">
      
      {/* Thumbnail Area - Now using Image */}
      <div className="h-44 w-full relative overflow-hidden bg-gray-100">
         <img 
           src={course.image} 
           alt={course.title} 
           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
           onError={(e) => {
             e.target.onerror = null; 
             e.target.src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500"; // Fallback image
           }}
         />
         
         {/* Youtube Overlay Icon */}
         {course.type === 'youtube' && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
               <svg className="w-14 h-14 text-white drop-shadow-lg opacity-90 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
            </div>
         )}

         {/* Type Badge */}
         <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-gray-800 shadow-sm border border-gray-100">
            {course.type}
         </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
         {/* Meta */}
         <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{course.level}</span>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
               <span>★ {course.rating}</span>
               <span className="text-gray-400 font-normal">({course.reviewsCount})</span>
            </div>
         </div>

         {/* Title */}
         <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
            {course.title}
         </h3>
         <p className="text-xs text-gray-500 mb-4">{course.provider}</p>

         {/* Stats */}
         <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> {course.numVideos} Videos</span>
            <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> {course.estimatedHours}h</span>
         </div>

         {/* Footer */}
         <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
               {course.price > 0 ? (
                  <div className="flex flex-col">
                     <span className="text-xs text-gray-400 line-through">₹{course.price + 2000}</span>
                     <span className="font-bold text-gray-900 text-base">₹{course.price}</span>
                  </div>
               ) : (
                  <span className="font-bold text-green-600 text-base">Free</span>
               )}
            </div>
            
            <button 
               onClick={(e) => { e.stopPropagation(); onEnroll(); }}
               className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${isEnrolled ? 'bg-green-100 text-green-700 cursor-default' : 'bg-gray-900 text-white hover:bg-blue-600'}`}
            >
               {isEnrolled ? 'Enrolled' : course.type === 'youtube' ? 'Watch' : 'Enroll'}
            </button>
         </div>
      </div>
    </div>
  );
}

// 4. Detailed Modal
function CourseDetailModal({ course, onClose, onEnroll, isEnrolled }) {
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div 
        onClick={handleModalClick}
        className="bg-white rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header - Now includes image banner */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
           <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
           <button onClick={onClose} className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors backdrop-blur-md">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
           <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex gap-2 mb-2">
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white uppercase">{course.level}</span>
                 <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/20 backdrop-blur-md text-white uppercase">{course.language}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold leading-tight mb-1">{course.title}</h2>
              <p className="text-sm text-gray-200">By <span className="font-semibold text-white">{course.author}</span> • {course.provider}</p>
           </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
           <div className="flex gap-4 md:gap-10 mb-8 border-b border-gray-100 pb-6 flex-wrap">
              <div>
                 <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Rating</div>
                 <div className="text-lg font-bold text-gray-900 flex items-center gap-1">4.8 <span className="text-amber-500">★</span></div>
              </div>
              <div>
                 <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Students</div>
                 <div className="text-lg font-bold text-gray-900">{course.enrolledCount.toLocaleString()}</div>
              </div>
              <div>
                 <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Duration</div>
                 <div className="text-lg font-bold text-gray-900">{course.estimatedHours} Hours</div>
              </div>
              <div>
                 <div className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-1">Last Updated</div>
                 <div className="text-lg font-bold text-gray-900">{course.lastUpdated}</div>
              </div>
           </div>

           <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 text-sm leading-7">{course.description} This comprehensive course is designed to take you from basics to advanced concepts. You will learn through hands-on projects and real-world examples.</p>
           </div>

           <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Course Curriculum</h3>
              <div className="space-y-3">
                 {course.roadmap && course.roadmap.map((module, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{i+1}</div>
                          <span className="font-semibold text-gray-700 text-sm">{module.module}</span>
                       </div>
                       <div className="text-xs text-gray-400 font-medium">
                          {module.lessons} Lessons • {module.hours}h
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
           <div>
              <span className="text-xs text-gray-500 block">Total Price</span>
              {course.price > 0 ? <span className="text-xl font-bold text-gray-900">₹{course.price}</span> : <span className="text-xl font-bold text-green-600">Free</span>}
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button 
                onClick={onEnroll} 
                disabled={isEnrolled}
                className={`px-8 py-2.5 text-white font-bold rounded-lg text-sm shadow-md transition-all ${isEnrolled ? 'bg-green-500 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isEnrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}