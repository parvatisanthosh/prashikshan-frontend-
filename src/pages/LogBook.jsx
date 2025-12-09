// src/pages/LogbookPage.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";
import studentService from "../services/studentService";

/**
 * LogbookPage.jsx
 * - Layout: 3-Column (Left: Stats/Tags | Center: Log Feed | Right: Todos/Activity)
 * - Features: API-based data fetching with studentService.
 */

/* -------------------- Utilities -------------------- */
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

/* -------------------- Main Component -------------------- */
export default function LogbookPage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) {
    window.location.hash = `#/${route}`;
  }

  // --- Data State ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalLogs: 0, totalHours: 0, currentStreak: 0 });
  const [logs, setLogs] = useState([]);
  const [todos, setTodos] = useState([]);

  // --- UI State ---
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [saving, setSaving] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch logbook entries and goals from API
        const [entriesResponse, goalsResponse, profileResponse] = await Promise.all([
          studentService.getLogbookEntries(),
          studentService.getLogbookGoals(),
          studentService.getProfile()
        ]);

        const entries = entriesResponse.entries || [];
        const goals = goalsResponse.goals || [];
        const profile = profileResponse.profile || {};

        // Transform entries to logs format
        const transformedLogs = entries.map(entry => ({
          id: entry.id,
          title: entry.title,
          body: entry.content,
          tags: entry.tags || [],
          hours: 1, // Default hours
          createdAt: entry.date,
          status: "published"
        }));

        // Transform goals to todos format
        const transformedTodos = goals.map(goal => ({
          id: goal.id,
          text: goal.text,
          completed: goal.completed
        }));

        // Calculate stats
        const totalHours = transformedLogs.reduce((sum, log) => sum + (log.hours || 0), 0);
        
        setUser({ name: profile.displayName || "Student", roll: profile.enrollmentNumber || "" });
        setStats({ 
          totalLogs: transformedLogs.length, 
          totalHours, 
          currentStreak: 5 // TODO: Calculate from backend
        });
        setLogs(transformedLogs);
        setTodos(transformedTodos);
      } catch (e) {
        console.error("Fetch error", e);
        setError(e.message || "Failed to load logbook data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Logic Helpers ---
  const filteredLogs = useMemo(() => {
    let result = logs;
    if (activeTag !== "All") {
      result = result.filter(l => l.tags.includes(activeTag) || l.project === activeTag);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(l => l.title.toLowerCase().includes(q) || l.body.toLowerCase().includes(q));
    }
    return result;
  }, [logs, activeTag, query]);

  const allTags = useMemo(() => {
    const tags = new Set(["All"]);
    logs.forEach(l => {
      l.tags.forEach(t => tags.add(t));
      if (l.project) tags.add(l.project);
    });
    return Array.from(tags);
  }, [logs]);

  // Actions
  const handleSaveLog = async (logData) => {
    setSaving(true);
    try {
      console.log('💾 Saving log entry:', logData);
      
      if (editingLog) {
        // Update existing entry
        console.log('Updating entry:', editingLog.id);
        const response = await studentService.updateLogbookEntry(editingLog.id, {
          title: logData.title,
          content: logData.body,
          tags: logData.tags,
          date: new Date().toISOString()
        });
        
        console.log('✓ Entry updated:', response);
        
        // Update local state
        setLogs(prev => prev.map(l => l.id === editingLog.id ? {
          ...l,
          title: logData.title,
          body: logData.body,
          tags: logData.tags,
          hours: logData.hours || 1
        } : l));
        
        alert('Log entry updated successfully! ✅');
      } else {
        // Create new entry
        console.log('Creating new entry...');
        const response = await studentService.createLogbookEntry({
          title: logData.title,
          content: logData.body,
          tags: logData.tags,
          date: new Date().toISOString()
        });
        
        console.log('✓ Entry created:', response);
        
        // Add to local state
        const newLog = {
          id: response.entry?.id || `new_${Date.now()}`,
          title: logData.title,
          body: logData.body,
          tags: logData.tags,
          hours: logData.hours || 1,
          createdAt: new Date().toISOString(),
          status: "published"
        };
        
        setLogs(prev => [newLog, ...prev]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalLogs: prev.totalLogs + 1,
          totalHours: prev.totalHours + (logData.hours || 1)
        }));
        
        alert('Log entry created successfully! ✅');
      }
      
      setIsModalOpen(false);
      setEditingLog(null);
    } catch (err) {
      console.error("❌ Error saving log:", err);
      alert(`Failed to save log entry: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if(confirm("Delete this log?")) {
      try {
        await studentService.deleteLogbookEntry(id);
        setLogs(prev => prev.filter(l => l.id !== id));
        setStats(prev => ({
          ...prev,
          totalLogs: prev.totalLogs - 1
        }));
        alert('Log entry deleted successfully! ✅');
      } catch (err) {
        console.error("Error deleting log:", err);
        alert(err.message || "Failed to delete log entry");
      }
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const todo = todos.find(t => t.id === id);
      await studentService.updateLogbookGoal(id, { completed: !todo.completed });
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error("Error toggling todo:", err);
      // Still update UI for better UX
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const handleAddTodo = async (text) => {
    try {
      const response = await studentService.createLogbookGoal({ text });
      const newTodo = { 
        id: response.goal?.id || `t_${Date.now()}`, 
        text, 
        completed: false 
      };
      setTodos(prev => [newTodo, ...prev]);
      alert('Goal added successfully! ✅');
    } catch (err) {
      console.error("Error adding todo:", err);
      alert(err.message || "Failed to add goal");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await studentService.deleteLogbookGoal(id);
      setTodos(prev => prev.filter(t => t.id !== id));
      alert('Goal deleted successfully! ✅');
    } catch (err) {
      console.error("Error deleting todo:", err);
      alert(err.message || "Failed to delete goal");
    }
  };

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

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      
    {/* 1. Global Navigation (Fixed) */}
                  <div className="sticky top-0 z-50 bg-white shadow-sm">
                    <Navbar
                      user={{ name: user?.name || "Student" }}
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
              LEFT SIDEBAR (Stats & Filters) 
             ======================= */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24 space-y-6">
            
            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-900 mb-4 text-sm">Your Progress</h3>
               
               <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                     <div className="text-2xl font-bold text-blue-600">{stats.totalLogs}</div>
                     <div className="text-xs text-blue-600 font-medium">Total Logs</div>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-lg text-center">
                     <div className="text-2xl font-bold text-indigo-600">{stats.totalHours}</div>
                     <div className="text-xs text-indigo-600 font-medium">Hours Logged</div>
                  </div>
               </div>

               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-xs font-medium text-gray-500">Current Streak</span>
                  <div className="flex items-center gap-1">
                     <span className="text-lg font-bold text-orange-500">🔥 {stats.currentStreak}</span>
                     <span className="text-xs text-gray-400">days</span>
                  </div>
               </div>
            </div>

            {/* Filters (Tags) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                  <button onClick={() => setActiveTag("All")} className="text-xs text-blue-600 hover:underline">Reset</button>
               </div>
               <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                     <button 
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${activeTag === tag ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                     >
                        {tag}
                     </button>
                  ))}
               </div>
            </div>

          </aside>

          {/* ======================= 
              CENTER (Log Feed) 
             ======================= */}
          <main className="flex-1 min-w-0">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
               <div>
                  <h1 className="text-2xl font-bold text-gray-900">Logbook</h1>
                  <p className="text-sm text-gray-500">Document your learning journey.</p>
               </div>
               <button 
                  onClick={() => { setEditingLog(null); setIsModalOpen(true); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2"
               >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                  New Entry
               </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 mb-6 sticky top-20 z-30">
               <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
               <input 
                  value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search logs..." 
                  className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
               />
            </div>

            {/* Logs List */}
            <div className="space-y-4">
               {filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                     <LogCard 
                        key={log.id} 
                        log={log} 
                        onEdit={() => { setEditingLog(log); setIsModalOpen(true); }} 
                        onDelete={() => handleDeleteLog(log.id)}
                     />
                  ))
               ) : (
                  <div className="bg-white rounded-xl p-10 text-center border border-gray-200">
                     <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-2xl">📝</div>
                     <h3 className="text-gray-900 font-medium">No logs found</h3>
                     <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or create a new entry.</p>
                  </div>
               )}
            </div>

          </main>

          {/* ======================= 
              RIGHT SIDEBAR (Todos & Activity) 
             ======================= */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24 space-y-6">
             
             {/* Activity Heatmap (Visual Mock) */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Activity Heatmap</h3>
                <div className="flex flex-wrap gap-1">
                   {/* Generating 4 weeks of boxes */}
                   {Array.from({length: 28}).map((_, i) => {
                      const isActive = i % 3 === 0 || i % 5 === 0; // Random mock data
                      return (
                         <div 
                           key={i} 
                           className={`w-8 h-8 rounded-md ${isActive ? 'bg-green-500' : 'bg-gray-100'}`}
                           title={`Day ${i+1}`}
                         />
                      )
                   })}
                </div>
                <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-400">
                   <span>Less</span>
                   <div className="flex gap-1">
                      <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
                   </div>
                   <span>More</span>
                </div>
             </div>

             {/* Todo Widget */}
             <TodoWidget todos={todos} onAdd={handleAddTodo} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />

          </aside>

        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <LogEntryModal 
          log={editingLog} 
          onClose={() => { setIsModalOpen(false); setEditingLog(null); }} 
          onSave={handleSaveLog}
          saving={saving}
        />
      )}
    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function LogCard({ log, onEdit, onDelete }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative">
       <div className="flex justify-between items-start mb-2">
          <div>
             <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1 block">{formatDate(log.createdAt)}</span>
             <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{log.title}</h3>
          </div>
          {log.project && (
             <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full border border-indigo-100">
                {log.project}
             </span>
          )}
       </div>

       <p className="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap line-clamp-3">
          {log.body}
       </p>

       <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex gap-2">
             {log.tags.slice(0,3).map(t => (
                <span key={t} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">#{t}</span>
             ))}
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs text-gray-400 font-medium">{log.hours}h logged</span>
             
             {/* Actions */}
             <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button onClick={onDelete} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
             </div>
          </div>
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
          <button type="submit" className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-black">+</button>
       </form>

       <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
          {todos.length === 0 && <p className="text-xs text-gray-400 text-center mt-4">No tasks yet.</p>}
          {todos.map(t => (
             <div key={t.id} className="group flex items-start gap-2 p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-100 transition-colors">
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

function LogEntryModal({ log, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    title: log?.title || "",
    body: log?.body || "",
    project: log?.project || "",
    hours: log?.hours || "",
    tags: log?.tags?.join(", ") || ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    if (!form.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!form.body.trim()) {
      alert('Please enter content');
      return;
    }
    
    console.log('📝 Form submitted:', form);
    
    // Call onSave with formatted data
    onSave({
      title: form.title.trim(),
      body: form.body.trim(),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      hours: Number(form.hours) || 1,
      project: form.project
    });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={saving ? null : onClose} />
      <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
           <h2 className="text-xl font-bold text-gray-900">{log ? "Edit Entry" : "New Log Entry"}</h2>
           <button onClick={onClose} disabled={saving} className="text-gray-400 hover:text-gray-600 disabled:opacity-50">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
           </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Title *</label>
              <input 
                required
                value={form.title}
                onChange={e => setForm({...form, title: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="What did you work on today?"
                disabled={saving}
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Project / Subject</label>
                 <select 
                   value={form.project}
                   onChange={e => setForm({...form, project: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                   disabled={saving}
                 >
                    <option value="">Select Project</option>
                    <option value="Capstone Project">Capstone Project</option>
                    <option value="Internship Task">Internship Task</option>
                    <option value="General">General</option>
                    <option value="Self Learning">Self Learning</option>
                 </select>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-1">Hours Spent</label>
                 <input 
                   type="number"
                   step="0.5"
                   value={form.hours}
                   onChange={e => setForm({...form, hours: e.target.value})}
                   className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="e.g. 2.5"
                   disabled={saving}
                 />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Description *</label>
              <textarea 
                required
                rows="6"
                value={form.body}
                onChange={e => setForm({...form, body: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe your progress, challenges, and learnings..."
                disabled={saving}
              />
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tags (comma separated)</label>
              <input 
                value={form.tags}
                onChange={e => setForm({...form, tags: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. React, Bugfix, Research"
                disabled={saving}
              />
           </div>

           <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={saving}
                className="px-5 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Entry'
                )}
              </button>
           </div>
        </form>
      </div>
    </div>
  );
}