// src/pages/ActivityTrackerPage.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";
import studentService from "../services/studentService";

/**
 * ActivityTrackerPage.jsx
 * - Architecture: API-first with studentService backend integration.
 * - Features: Gamification (XP/Levels), Certificate Vault, Advanced Filtering.
 */

const DEFAULT_USER = {
  id: "",
  name: "Student",
  roll: "",
  level: 1,
  xp: 0,
  nextLevelXp: 500
};

/* -------------------- Main Component -------------------- */
export default function ActivityTrackerPage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) {
    window.location.hash = `#/${route}`;
  }

  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(DEFAULT_USER);
  const [activities, setActivities] = useState([]);
  
  // --- UI State ---
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterTime, setFilterTime] = useState("All Time");
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [selectedActivity, setSelectedActivity] = useState(null); // For detail view

  // --- Initial Load from API ---
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch activity logs and profile from API
        const [activitiesResponse, profileResponse] = await Promise.all([
          studentService.getActivityLogs(),
          studentService.getProfile()
        ]);

        const logs = activitiesResponse.logs || activitiesResponse.activities || [];
        const profile = profileResponse.profile || {};

        // Transform backend data to our format
        const transformedActivities = logs.map(log => ({
          id: log.id,
          title: log.title || log.activityName,
          date: log.date || log.activityDate,
          type: log.type || log.category || "Workshop",
          tags: log.tags || [],
          points: log.points || log.xpEarned || 100,
          organiser: log.organizer || log.organizerName,
          description: log.description,
          attachments: log.attachments || [],
          createdAt: log.createdAt
        }));

        // Calculate XP from activities
        const totalXp = transformedActivities.reduce((sum, a) => sum + (a.points || 0), 0);

        setActivities(transformedActivities);
        setUser({
          id: profile.id || profile.userId || "",
          name: profile.displayName || "Student",
          roll: profile.enrollmentNumber || "",
          level: Math.floor(totalXp / 500) + 1,
          xp: totalXp,
          nextLevelXp: (Math.floor(totalXp / 500) + 1) * 500
        });
      } catch (e) {
        console.error("Failed to load data", e);
        setError(e.message || "Failed to load activity data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // --- Derived State ---
  const filteredActivities = useMemo(() => {
    let result = [...activities];

    // 1. Search
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.organiser?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 2. Type Filter
    if (filterType !== "All") {
      result = result.filter(a => a.type === filterType);
    }

    // 3. Time Filter
    const now = new Date();
    if (filterTime === "This Month") {
      result = result.filter(a => new Date(a.date).getMonth() === now.getMonth() && new Date(a.date).getFullYear() === now.getFullYear());
    } else if (filterTime === "Last 3 Months") {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(now.getMonth() - 3);
      result = result.filter(a => new Date(a.date) >= threeMonthsAgo);
    }

    // Sort by date desc
    return result.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activities, query, filterType, filterTime]);

  // --- Actions ---
  const handleSaveActivity = async (activity) => {
    try {
      if (activity.id) {
        // Update existing activity
        await studentService.updateActivityLog(activity.id, {
          title: activity.title,
          date: activity.date,
          type: activity.type,
          description: activity.description,
          tags: activity.tags
        });
        setActivities(prev => prev.map(a => a.id === activity.id ? activity : a));
      } else {
        // Create new activity
        const response = await studentService.createActivityLog({
          title: activity.title,
          date: activity.date,
          type: activity.type,
          description: activity.description,
          tags: activity.tags
        });
        
        const newActivity = { 
          ...activity, 
          id: response.log?.id || `act_${Date.now()}`, 
          createdAt: new Date().toISOString(),
          points: 100
        };
        setActivities(prev => [newActivity, ...prev]);
        
        // Gamification: Add XP
        setUser(prev => ({ 
          ...prev, 
          xp: prev.xp + 100,
          level: Math.floor((prev.xp + 100) / 500) + 1
        }));
      }
      setShowModal(false);
      setEditingActivity(null);
    } catch (err) {
      console.error("Error saving activity:", err);
      alert(err.message || "Failed to save activity");
    }
  };

  const handleDeleteActivity = async (id) => {
    if(confirm("Are you sure you want to delete this activity?")) {
      try {
        await studentService.deleteActivityLog(id);
        setActivities(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        console.error("Error deleting activity:", err);
        alert(err.message || "Failed to delete activity");
      }
    }
  };

  // --- Constants ---
  const ACTIVITY_TYPES = ["Workshop", "Seminar", "Competition", "Certification", "Project", "Volunteering"];
  const TIME_FILTERS = ["All Time", "This Month", "Last 3 Months"];

  if (loading) {
    return (
       <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
             <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
             <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
       </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading activities</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

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
      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
          
          {/* ======================= 
              LEFT SIDEBAR (Profile & Stats) 
             ======================= */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24 space-y-6">
            
            {/* Gamification Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-5 relative">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                  <svg className="w-24 h-24 text-blue-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
               </div>
               <div className="relative z-10">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Current Level</h3>
                  <div className="flex items-end gap-2 mb-3">
                     <span className="text-4xl font-black text-blue-600">{Math.floor(user.xp / 500) + 1}</span>
                     <span className="text-sm font-medium text-gray-600 mb-1">Scholar</span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                     <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${(user.xp % 500) / 5}%` }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                     <span>{user.xp} XP</span>
                     <span>{Math.ceil(user.xp / 500) * 500} XP</span>
                  </div>
               </div>
            </div>

            {/* Filters Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                  <button onClick={() => { setFilterType("All"); setFilterTime("All Time"); }} className="text-xs text-blue-600 hover:underline">Reset</button>
               </div>
               
               <div className="space-y-4">
                  <div>
                     <label className="text-xs font-bold text-gray-500 mb-2 block">Time Range</label>
                     <div className="flex flex-wrap gap-2">
                        {TIME_FILTERS.map(t => (
                           <button 
                              key={t}
                              onClick={() => setFilterTime(t)}
                              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${filterTime === t ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'}`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div>
                     <label className="text-xs font-bold text-gray-500 mb-2 block">Activity Type</label>
                     <div className="flex flex-wrap gap-2">
                        <button onClick={() => setFilterType("All")} className={`px-3 py-1.5 text-xs rounded-lg border ${filterType === "All" ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}>All</button>
                        {ACTIVITY_TYPES.map(t => (
                           <button 
                              key={t}
                              onClick={() => setFilterType(t)}
                              className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${filterType === t ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-slate-50'}`}
                           >
                              {t}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

          </aside>

          {/* ======================= 
              CENTER (Activity Feed) 
             ======================= */}
          <main className="flex-1 min-w-0">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Activity Tracker</h1>
                  <p className="text-sm text-gray-500">Log your achievements and extracurriculars.</p>
               </div>
               <button 
                  onClick={() => { setEditingActivity(null); setShowModal(true); }}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2"
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  Add Activity
               </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 mb-6 sticky top-20 z-30">
               <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
               <input 
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by title, organizer, or tags..." 
                  className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
               />
            </div>

            {/* Activity List */}
            <div className="space-y-4">
               {filteredActivities.length > 0 ? (
                  filteredActivities.map(activity => (
                     <ActivityCard 
                        key={activity.id} 
                        activity={activity} 
                        onView={() => setSelectedActivity(activity)}
                        onEdit={() => { setEditingActivity(activity); setShowModal(true); }}
                        onDelete={() => handleDeleteActivity(activity.id)}
                     />
                  ))
               ) : (
                  <div className="bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
                     <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400 text-3xl">🏆</div>
                     <h3 className="text-gray-900 font-medium">No activities found</h3>
                     <p className="text-gray-500 text-sm mt-1">Start logging your achievements to build your portfolio.</p>
                  </div>
               )}
            </div>

          </main>

          {/* ======================= 
              RIGHT SIDEBAR (Certificates & Stats) 
             ======================= */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24 space-y-6">
             
             {/* Quick Stats */}
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                   <div className="text-2xl font-bold text-gray-900">{activities.length}</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Total Logs</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                   <div className="text-2xl font-bold text-blue-600">{activities.filter(a=>a.attachments?.length > 0).length}</div>
                   <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Verified</div>
                </div>
             </div>

             {/* Certificate Vault Widget */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-sm">Certificate Vault</h3>
                   <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">View All</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                   {activities.filter(a => a.attachments && a.attachments.length > 0).slice(0, 6).map(a => (
                      <div key={a.id} className="aspect-square bg-slate-50 rounded-lg border border-gray-200 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors relative group" title={a.title}>
                         {/* Using mock thumbnail if available, else icon */}
                         <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                   ))}
                   {/* Placeholder for empty slots */}
                   {Array.from({length: Math.max(0, 6 - activities.filter(a => a.attachments?.length).length)}).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square bg-white rounded-lg border border-dashed border-gray-200"></div>
                   ))}
                </div>
             </div>

             {/* Export Tools */}
             <div className="bg-blue-600 rounded-xl p-5 text-white shadow-lg">
                <h3 className="font-bold text-sm mb-2">Export Portfolio</h3>
                <p className="text-slate-300 text-xs mb-4">Download your activity report for resume or placements.</p>
                <div className="flex gap-2">
                   <button className="flex-1 py-2 bg-white/10 border border-white/20 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">PDF</button>
                   <button className="flex-1 py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">CSV</button>
                </div>
             </div>

          </aside>

        </div>
      </div>

      {/* Modals */}
      {showModal && (
        <ActivityFormModal 
          activity={editingActivity} 
          onClose={() => setShowModal(false)} 
          onSave={handleSaveActivity} 
          types={ACTIVITY_TYPES}
        />
      )}

      {selectedActivity && (
        <ActivityDetailsModal 
           activity={selectedActivity} 
           onClose={() => setSelectedActivity(null)} 
        />
      )}

    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function ActivityCard({ activity, onView, onEdit, onDelete }) {
  // Determine badge color based on type - ALL BLUE VARIATIONS
  const getTypeColor = (type) => {
     switch(type) {
        case 'Competition': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Workshop': return 'bg-sky-100 text-sky-800 border-sky-200';
        case 'Certification': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
        default: return 'bg-slate-100 text-slate-700 border-slate-200';
     }
  };

  return (
    <div onClick={onView} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative">
       <div className="flex justify-between items-start mb-2">
          <div>
             <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getTypeColor(activity.type)} uppercase tracking-wide`}>
                   {activity.type}
                </span>
                <span className="text-xs text-gray-400 font-medium">{activity.date}</span>
             </div>
             <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{activity.title}</h3>
          </div>
          
          {/* Edit/Delete actions appear on hover */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
             <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
             </button>
             <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
             </button>
          </div>
       </div>

       <div className="text-sm text-gray-600 mb-3">
          <span className="font-medium text-gray-800">{activity.organiser}</span> • {activity.location}
       </div>

       <p className="text-sm text-gray-500 line-clamp-2 mb-4">{activity.notes}</p>

       <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex flex-wrap gap-1">
             {activity.tags && activity.tags.map(t => (
                <span key={t} className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">#{t}</span>
             ))}
          </div>
          {activity.attachments && activity.attachments.length > 0 && (
             <div className="flex items-center gap-1 text-xs text-gray-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                {activity.attachments.length}
             </div>
          )}
       </div>
    </div>
  );
}

function TodoWidget({ todos, onAdd, onToggle, onDelete }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if(input.trim()) {
      onAdd(input);
      setInput("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-[300px]">
       <h3 className="font-bold text-gray-900 mb-4 text-sm">To-Do List</h3>
       
       <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add task..." 
            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button type="submit" className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black">+</button>
       </form>

       <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {todos.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">No tasks yet.</p>}
          {todos.map(t => (
             <div key={t.id} className="group flex items-start gap-2 p-2 hover:bg-slate-50 rounded border border-transparent hover:border-gray-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={t.completed} 
                  onChange={() => onToggle(t.id)}
                  className="mt-1 cursor-pointer accent-blue-600" 
                />
                <span className={`text-sm flex-1 ${t.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{t.text}</span>
                <button onClick={() => onDelete(t.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">×</button>
             </div>
          ))}
       </div>
    </div>
  );
}

function ActivityFormModal({ activity, onClose, onSave, types }) {
  const [form, setForm] = useState({
    title: activity?.title || "",
    date: activity?.date || new Date().toISOString().split('T')[0],
    type: activity?.type || "Workshop",
    organiser: activity?.organiser || "",
    location: activity?.location || "",
    notes: activity?.notes || "",
    tags: activity?.tags?.join(", ") || ""
  });
  
  const [files, setFiles] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock File Upload Processing
    const newAttachments = Array.from(files).map(f => ({
       id: Date.now() + Math.random(),
       name: f.name,
       url: URL.createObjectURL(f) // Temporary blob URL for preview
    }));

    onSave({
      ...activity, // Keep ID if editing
      ...form,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      attachments: [...(activity?.attachments || []), ...newAttachments]
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
           <h2 className="text-xl font-bold text-gray-900">{activity ? "Edit Activity" : "Log New Activity"}</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                 <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Event Name" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                 <input type="date" required value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                 <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Organiser</label>
                 <input value={form.organiser} onChange={e => setForm({...form, organiser: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Club / Organization" />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Auditorium / Online" />
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Notes / Key Takeaways</label>
              <textarea rows="4" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="What did you learn?" />
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tags (comma separated)</label>
              <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Leadership, Coding, Teamwork" />
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Attachments</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                 <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFiles(e.target.files)} />
                 <div className="text-sm text-gray-500">
                    {files.length > 0 ? <span className="text-blue-600 font-semibold">{files.length} files selected</span> : <span>Click to upload certificates or photos</span>}
                 </div>
              </div>
           </div>

           <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors">Save Log</button>
           </div>
        </form>
      </div>
    </div>
  );
}

function ActivityDetailsModal({ activity, onClose }) {
   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
         <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            
            {/* Header */}
            <div className="bg-slate-900 text-white p-6">
               <div className="flex justify-between items-start">
                  <div>
                     <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-wide">{activity.type}</span>
                     <h2 className="text-2xl font-bold mt-3 mb-1">{activity.title}</h2>
                     <p className="text-gray-300 text-sm">{activity.date} • {activity.location}</p>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-white"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
               </div>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
               <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Organiser</h4>
                  <p className="text-gray-700">{activity.organiser}</p>
               </div>

               <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Notes</h4>
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{activity.notes || "No additional notes."}</p>
               </div>

               {activity.tags && activity.tags.length > 0 && (
                  <div className="mb-6">
                     <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Tags</h4>
                     <div className="flex flex-wrap gap-2">
                        {activity.tags.map(t => <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">#{t}</span>)}
                     </div>
                  </div>
               )}

               <div>
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Attachments</h4>
                  {activity.attachments && activity.attachments.length > 0 ? (
                     <div className="grid grid-cols-2 gap-3">
                        {activity.attachments.map((att, i) => (
                           <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => window.open(att.url, '_blank')}>
                              <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
                              </div>
                              <span className="text-sm text-gray-700 font-medium truncate">{att.name}</span>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <p className="text-sm text-gray-400 italic">No attachments.</p>
                  )}
               </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-slate-50 text-right">
               <button onClick={onClose} className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-100">Close</button>
            </div>

         </div>
      </div>
   );
}