// src/pages/StudentDashboardMain.jsx
import React, { useEffect, useState } from "react";
import studentService from "../../services/studentService";

/**
 * StudentDashboardMain.jsx
 * - Central Hub for the student.
 * - Agregates data from Academics, Internships, and Courses.
 * - Tabbed Interface for sub-sections.
 */

/* -------------------- Main Component -------------------- */
export default function StudentDashboardMain() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview"); // Tabs: Overview, Academics, My Applications, Learning, Schedule, Settings

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all data in parallel
        const [statsResponse, profileResponse, coursesResponse, applicationsResponse, scheduleResponse, avatarResponse] = await Promise.all([
          studentService.getDashboardStats(),
          studentService.getProfile(),
          studentService.getCourses(),
          studentService.getMyApplications(),
          studentService.getSchedule(),
          studentService.getAvatarUrl()
        ]);

        const profile = profileResponse.profile || {};
        const courses = coursesResponse.courses || [];
        const applications = applicationsResponse.applications || [];
        const schedule = scheduleResponse.schedule || { assignments: [], sessions: [] };
        const avatarURL = avatarResponse.avatarURL || null;

        // Transform data to match component structure
        setData({
          user: {
            name: profile.displayName || "Student",
            role: profile.department || "Student",
            email: profile.email || "",
            semester: profile.semester || 1,
            resumeScore: 72, // TODO: Calculate from profile completeness
            avatarURL: avatarURL,
          },
          stats: {
            cgpa: statsResponse.cgpa || 0,
            creditsEarned: 94, // TODO: Add to backend
            totalCredits: 160, // TODO: Add to backend
            applied: applications.length,
            shortlisted: applications.filter(a => a.status === 'SHORTLISTED' || a.status === 'INTERVIEWING').length,
            coursesActive: courses.length,
            attendance: statsResponse.attendance || 0,
          },
          academicHistory: [
            { semester: 1, gpa: 7.3 },
            { semester: 2, gpa: 7.8 },
            { semester: 3, gpa: 8.1 },
            { semester: 4, gpa: 8.0 },
            { semester: 5, gpa: statsResponse.cgpa || 0 },
          ],
          currentSubjects: courses.slice(0, 4).map(course => ({
            code: course.code || course.id?.substring(0, 8).toUpperCase(),
            title: course.name,
            grade: "A",
            attendance: 85
          })),
          todaysSchedule: schedule.assignments?.slice(0, 2).map((item, idx) => ({
            id: item.id || idx,
            time: new Date(item.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            title: item.title,
            type: "Assignment",
            room: "Online"
          })) || [],
          weeklySchedule: [
            { day: "Mon", classes: 3 },
            { day: "Tue", classes: 4 },
            { day: "Wed", classes: 2 },
            { day: "Thu", classes: 4 },
            { day: "Fri", classes: 1 },
          ],
          activeCourses: courses.slice(0, 2).map(course => ({
            id: course.id,
            title: course.name,
            progress: course.progress || 0,
            nextLesson: "Continue Learning",
            thumbnailColor: "bg-blue-600"
          })),
          internshipApplications: applications.map(app => ({
            id: app.id,
            company: app.company,
            role: app.title,
            status: app.status === 'APPLIED' ? 'Applied' : 
                   app.status === 'SHORTLISTED' ? 'Interviewing' : 
                   app.status === 'REJECTED' ? 'Rejected' : 
                   app.status === 'ACCEPTED' ? 'Accepted' : 'Applied',
            date: new Date(app.appliedDate).toLocaleDateString(),
            logo: app.company?.charAt(0) || "?"
          })),
          recommendedInternships: [
            { id: "i1", company: "Amazon", role: "SDE Intern", stipend: "₹40k/mo", type: "Remote" },
            { id: "i2", company: "Cred", role: "Product Design", stipend: "₹25k/mo", type: "Bangalore" },
          ]
        });
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-12 w-12 bg-blue-200 rounded-full"></div>
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load dashboard</h2>
          <p className="text-gray-600 mb-4">{error || "Please try again later"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- TAB RENDERERS ---

  const renderOverview = () => (
    <div className="space-y-6">
       {/* Hero Stats */}
       <section>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
             <StatCard title="CGPA" value={data.stats.cgpa} icon={<span className="text-lg font-bold">🎓</span>} color="indigo" />
             <StatCard title="Credits" value={`${data.stats.creditsEarned}/${data.stats.totalCredits}`} icon={<span className="text-lg font-bold">📚</span>} color="blue" />
             <StatCard title="Applied" value={data.stats.applied} icon={<span className="text-lg font-bold">💼</span>} color="purple" />
             <StatCard title="Shortlisted" value={data.stats.shortlisted} icon={<span className="text-lg font-bold">⭐</span>} color="green" />
             <StatCard title="Attendance" value={`${data.stats.attendance}%`} icon={<span className="text-lg font-bold">📅</span>} color="amber" />
          </div>
       </section>

       {/* Continue Learning */}
       <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-lg font-bold text-gray-900">Continue Learning</h2>
             <button onClick={() => setActiveTab("Learning")} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {data.activeCourses.map(course => (
                <CourseProgressCard key={course.id} course={course} />
             ))}
          </div>
       </section>

       {/* Application Tracker Preview */}
       <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
             <h2 className="font-bold text-gray-900">Recent Applications</h2>
             <button onClick={() => setActiveTab("My Applications")} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded font-medium transition-colors">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
             {data.internshipApplications.slice(0, 3).map(app => (
                <ApplicationRow key={app.id} app={app} />
             ))}
          </div>
       </section>
    </div>
  );

  const renderAcademics = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
       <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold text-gray-900">Academic Performance</h1>
          <button className="text-sm text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">Download Transcript</button>
       </div>

       {/* GPA Chart Placeholder */}
       <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-4">CGPA Progression</h3>
          <div className="h-40 flex items-end justify-between gap-2 px-4">
             {data.academicHistory.map((sem, i) => (
                <div key={sem.semester} className="flex flex-col items-center gap-2 w-full group relative">
                   <div 
                      className="w-full bg-indigo-100 rounded-t-lg transition-all duration-500 group-hover:bg-indigo-200 relative" 
                      style={{ height: `${(sem.gpa / 10) * 100}%` }}
                   >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                         {sem.gpa}
                      </span>
                   </div>
                   <span className="text-xs font-bold text-gray-500">Sem {sem.semester}</span>
                </div>
             ))}
          </div>
       </div>

       {/* Current Subjects */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.currentSubjects.map((sub) => (
             <div key={sub.code} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                   <div>
                      <span className="text-xs font-bold text-gray-400 uppercase">{sub.code}</span>
                      <h4 className="font-bold text-gray-900">{sub.title}</h4>
                   </div>
                   <div className="text-xl font-bold text-indigo-600">{sub.grade}</div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
                   <div className={`h-1.5 rounded-full ${sub.attendance >= 75 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${sub.attendance}%` }}></div>
                </div>
                <div className="flex justify-between text-xs mt-1">
                   <span className="text-gray-500">Attendance</span>
                   <span className={`font-bold ${sub.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>{sub.attendance}%</span>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderApplications = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
           <div className="grid grid-cols-1 divide-y divide-gray-100">
              {data.internshipApplications.map(app => (
                 <div key={app.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200 text-xl">
                          {app.logo}
                       </div>
                       <div>
                          <h4 className="text-lg font-bold text-gray-900">{app.role}</h4>
                          <p className="text-sm text-gray-500">{app.company} • Applied {app.date}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                       <StatusBadge status={app.status} />
                       <button className="text-gray-400 hover:text-gray-600 px-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  const renderLearning = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900">My Learning</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {data.activeCourses.map(course => (
              <CourseProgressCard key={course.id} course={course} />
           ))}
           {/* Add New Course Placeholder */}
           <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer h-full min-h-[160px]">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
              </div>
              <h3 className="font-bold text-gray-900">Explore Courses</h3>
              <p className="text-xs text-gray-500 mt-1">Find new skills to learn</p>
           </div>
        </div>
     </div>
  );

  const renderSchedule = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
           <div className="grid grid-cols-5 gap-4 text-center mb-6">
              {data.weeklySchedule.map(day => (
                 <div key={day.day} className={`p-3 rounded-lg border ${day.day === 'Tue' ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-100' : 'border-gray-100'}`}>
                    <div className="text-xs font-bold text-gray-500 uppercase mb-1">{day.day}</div>
                    <div className="text-lg font-bold text-gray-900">{day.classes}</div>
                    <div className="text-[10px] text-gray-400">Classes</div>
                 </div>
              ))}
           </div>
           <h3 className="font-bold text-gray-900 mb-4">Today's Classes</h3>
           <div className="space-y-4">
              {data.todaysSchedule.map((item, idx) => (
                 <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-20 text-sm font-bold text-gray-900 pt-1">{item.time}</div>
                    <div className="flex-1 border-l-2 border-blue-500 pl-4">
                       <h4 className="font-bold text-gray-900">{item.title}</h4>
                       <p className="text-xs text-gray-500 mt-1">{item.type} • Room {item.room}</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
     </div>
  );

  const renderSettings = () => (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 max-w-2xl">
           <h3 className="font-bold text-gray-900 mb-6">Profile Details</h3>
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Full Name</label>
                    <input type="text" value={data.user.name} readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                    <input type="text" value={data.user.role} readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none" />
                 </div>
              </div>
              <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Email Address</label>
                 <input type="email" value={data.user.email} readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none" />
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                 <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save Changes</button>
              </div>
           </div>
        </div>
     </div>
  );

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">

      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
          
          {/* --- LEFT SIDEBAR (Navigation & Quick Stats) --- */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="text-center mb-6">
                   <div className="relative inline-block">
                      <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                         {data.user.name.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                   </div>
                   <h3 className="font-bold text-gray-900">{data.user.name}</h3>
                   <p className="text-xs text-gray-500">{data.user.role}</p>
                </div>

                <div className="space-y-1">
                   {["Overview", "Academics", "My Applications", "Learning", "Schedule", "Settings"].map((item) => (
                      <button 
                         key={item} 
                         onClick={() => setActiveTab(item)}
                         className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                         {item}
                      </button>
                   ))}
                </div>
             </div>

             {/* Resume Score Widget */}
             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-5 text-white relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="text-sm font-bold opacity-90 mb-1">Resume Score</h4>
                   <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-black">{data.user.resumeScore}</span>
                      <span className="text-sm mb-1 opacity-75">/ 100</span>
                   </div>
                   <div className="w-full bg-white/20 rounded-full h-1.5 mb-3">
                      <div className="bg-white h-1.5 rounded-full" style={{ width: `${data.user.resumeScore}%` }}></div>
                   </div>
                   <button className="w-full py-2 bg-white text-indigo-700 font-bold text-xs rounded-lg hover:bg-indigo-50 transition-colors">
                      Improve Resume
                   </button>
                </div>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
             </div>
          </aside>

          {/* --- CENTER CONTENT AREA (Switches based on activeTab) --- */}
          <main className="flex-1 min-w-0">
             {activeTab === "Overview" && renderOverview()}
             {activeTab === "Academics" && renderAcademics()}
             {activeTab === "My Applications" && renderApplications()}
             {activeTab === "Learning" && renderLearning()}
             {activeTab === "Schedule" && renderSchedule()}
             {activeTab === "Settings" && renderSettings()}
          </main>

          {/* --- RIGHT SIDEBAR (Contextual - Always visible for Overview, optional for others) --- */}
          <aside className="hidden xl:block w-80 shrink-0 sticky top-24 space-y-6">
            
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-900 text-sm">Today's Schedule</h3>
                  <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</span>
               </div>
               
               <div className="relative space-y-0">
                  {data.todaysSchedule.map((item, idx) => (
                     <div key={item.id} className="flex gap-3 pb-6 last:pb-0 relative">
                        {idx !== data.todaysSchedule.length - 1 && (
                           <div className="absolute left-[27px] top-8 bottom-0 w-0.5 bg-gray-100"></div>
                        )}
                        <div className="w-14 text-xs font-medium text-gray-500 pt-1">{item.time}</div>
                        <div className="flex-1">
                           <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 relative">
                              <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${item.type === 'Lab' ? 'bg-purple-500' : 'bg-blue-500'}`}></div>
                              <h4 className="text-xs font-bold text-gray-900 pl-2">{item.title}</h4>
                              <p className="text-[10px] text-gray-500 pl-2 mt-0.5">{item.type} • Room {item.room}</p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Recommended Internships */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-900 text-sm mb-4">Recommended For You</h3>
               <div className="space-y-3">
                  {data.recommendedInternships.map(job => (
                     <div key={job.id} className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all group cursor-pointer bg-white">
                        <div className="flex justify-between items-start mb-1">
                           <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600">{job.role}</h4>
                           <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">{job.stipend}</span>
                        </div>
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                           <span>{job.company}</span>
                           <span>{job.type}</span>
                        </div>
                     </div>
                  ))}
               </div>
               <button className="w-full mt-4 py-2 text-xs font-bold text-blue-600 border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors">
                  Explore All Internships
               </button>
            </div>

          </aside>

        </div>
      </div>
      
    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
       <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colors[color]}`}>
          {icon}
       </div>
       <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
       </div>
    </div>
  );
}

function CourseProgressCard({ course }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-blue-300 transition-all">
       <div className={`w-16 h-16 rounded-lg ${course.thumbnailColor} shrink-0 flex items-center justify-center text-white font-bold text-xl`}>
          {course.title.charAt(0)}
       </div>
       <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{course.title}</h3>
          <p className="text-xs text-gray-500 mb-2 truncate">Next: {course.nextLesson}</p>
          <div className="flex items-center gap-3">
             <div className="flex-1 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: `${course.progress}%` }}></div>
             </div>
             <span className="text-xs font-bold text-blue-600">{course.progress}%</span>
          </div>
       </div>
       <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
       </button>
    </div>
  );
}

function ApplicationRow({ app }) {
  return (
    <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 border border-gray-200 text-xl">
            {app.logo}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">{app.role}</h4>
            <p className="text-xs text-gray-500">{app.company} • {app.date}</p>
          </div>
      </div>
      <StatusBadge status={app.status} />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "Applied": "bg-gray-100 text-gray-600",
    "Interviewing": "bg-amber-100 text-amber-700",
    "Rejected": "bg-red-50 text-red-600",
    "Accepted": "bg-green-100 text-green-700"
  };
  
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${styles[status] || styles["Applied"]}`}>
       {status}
    </span>
  );
}