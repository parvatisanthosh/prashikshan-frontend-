// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";


const USE_MOCK = true;

const MOCK_PROFILE_DATA = {
  id: "u1001",
  name: "Divyam Gupta",
  roll: "CS2026-101",
  role: "CS Undergrad",
  pronouns: "He/Him",
  bio: "3rd year Computer Science student passionate about Fullstack Development and AI. Building scalable web apps and exploring LLMs.",
  email: "divyam.gupta@example.com",
  collegeEmail: "divyam@iiitn.ac.in",
  collegeEmailVerified: false,
  phone: "+91 98765 43210",
  location: "Nagpur, Maharashtra",
  avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60",
  coverUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=60",
  skills: ["React", "Node.js", "Python", "MongoDB", "Tailwind CSS", "Git"],
  social: {
    linkedin: "linkedin.com/in/divyam",
    github: "github.com/divyam",
    website: "divyam.dev"
  },
  stats: {
    level: 5,
    xp: 2450,
    nextLevelXp: 3000,
    profileStrength: 85,
    badges: ["Scholar", "Coder", "Contributor"]
  },
  resume: {
    url: "#",
    name: "Divyam_Gupta_Resume.pdf",
    lastUpdated: "2024-10-15"
  },
  activity: [
    { id: 1, text: "Completed 'Advanced React' course", date: "2 days ago", type: "course" },
    { id: 2, text: "Earned 'Backend Master' badge", date: "1 week ago", type: "badge" },
    { id: 3, text: "Applied to Google Internship", date: "2 weeks ago", type: "job" }
  ]
};

export default function ProfilePage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) {
    window.location.hash = `#/${route}`;
  }
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  
  // UI State for Modals
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  
  const [toast, setToast] = useState(null);

  // Refs for file uploads
  const bannerInputRef = useRef(null);
  const avatarInputRef = useRef(null);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        if (USE_MOCK) {
          await new Promise(r => setTimeout(r, 800));
          const localData = localStorage.getItem("sih_profile_data");
          setProfile(localData ? JSON.parse(localData) : MOCK_PROFILE_DATA);
        }
      } catch (e) {
        console.error("Failed to fetch profile", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile && USE_MOCK) {
      localStorage.setItem("sih_profile_data", JSON.stringify(profile));
    }
  }, [profile]);

  // --- Handlers ---

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveProfile = (updatedProfile) => {
    setProfile(updatedProfile);
    setEditModalOpen(false);
    showToast("Profile updated successfully!");
  };

  const handleVerifyEmail = (email) => {
    setProfile(prev => ({ ...prev, collegeEmail: email, collegeEmailVerified: true }));
    setVerifyModalOpen(false);
    showToast("College email verified!");
  };

  const handleShareProfile = () => {
    const url = `${window.location.origin}/u/${profile.id}`;
    navigator.clipboard.writeText(url);
    showToast("Public profile link copied to clipboard!");
  };

  // Image Upload Handlers
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, coverUrl: url }));
      showToast("Cover photo updated!");
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatarUrl: url }));
      showToast("Profile picture updated!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-16 w-16 bg-blue-200 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

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
      
      <div className="sticky top-0 z-50 bg-white shadow-sm">
       
      </div>

      

      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
          
          {/* --- LEFT SIDEBAR (Quick Nav & Badges) --- */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24 space-y-6">
            
            {/* Gamification Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-5">
                  <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>
               </div>
               <div className="relative z-10">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Level {profile.stats.level}</h3>
                  <div className="flex items-end gap-2 mb-3">
                     <span className="text-3xl font-black text-blue-600">{profile.stats.xp}</span>
                     <span className="text-sm font-medium text-gray-400 mb-1">/ {profile.stats.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
                     <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${(profile.stats.xp / profile.stats.nextLevelXp) * 100}%` }}></div>
                  </div>
                  
                  <h4 className="text-xs font-bold text-gray-900 mb-2">Earned Badges</h4>
                  <div className="flex flex-wrap gap-2">
                     {profile.stats.badges.map(b => (
                        <span key={b} className="px-2 py-1 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded text-[10px] font-bold uppercase tracking-wide">{b}</span>
                     ))}
                  </div>
               </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
               {[
                  { label: "Edit Profile", action: () => setEditModalOpen(true) },
                  { label: "Resume", action: () => setResumeModalOpen(true) },
                  { label: "Account Settings", action: () => setSettingsModalOpen(true) },
                  { label: "Privacy", action: () => setPrivacyModalOpen(true) }
               ].map((item) => (
                  <button 
                     key={item.label}
                     onClick={item.action}
                     className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors flex justify-between items-center"
                  >
                     {item.label}
                     <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </button>
               ))}
            </div>

          </aside>

          {/* --- CENTER CONTENT (Profile Main) --- */}
          <main className="flex-1 min-w-0 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               {/* Cover Image */}
               <div className="h-48 bg-gray-200 w-full relative group">
                  <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover transition-opacity group-hover:opacity-90" />
                  
                  {/* Hidden Input for Banner */}
                  <input 
                     type="file" 
                     ref={bannerInputRef} 
                     onChange={handleBannerUpload} 
                     accept="image/*" 
                     className="hidden" 
                  />
                  
                  <button 
                     onClick={() => bannerInputRef.current.click()}
                     className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
                     title="Change Cover Photo"
                  >
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  </button>
               </div>

               <div className="px-8 pb-8">
                  <div className="flex flex-col md:flex-row justify-between items-end -mt-16 mb-6">
                     <div className="relative group">
                        <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                        
                        {/* Hidden Input for Avatar */}
                        <input 
                           type="file" 
                           ref={avatarInputRef} 
                           onChange={handleAvatarUpload} 
                           accept="image/*" 
                           className="hidden" 
                        />

                        <button 
                           onClick={() => avatarInputRef.current.click()}
                           className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full shadow-sm hover:bg-blue-700 transition-colors border-2 border-white"
                           title="Change Profile Picture"
                        >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        </button>
                     </div>
                     <div className="flex gap-3 mt-4 md:mt-0">
                        <button onClick={() => setEditModalOpen(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">Edit Profile</button>
                        <button onClick={handleShareProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                           Share Profile
                        </button>
                     </div>
                  </div>

                  <div>
                     <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                        <span className="text-sm bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">{profile.pronouns}</span>
                        {profile.collegeEmailVerified && (
                           <span className="text-green-600" title="Verified Student">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                           </span>
                        )}
                     </div>
                     <p className="text-gray-600 font-medium mb-4">{profile.role} • {profile.roll}</p>
                     <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">{profile.bio}</p>

                     <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                           {profile.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                           {profile.email}
                        </div>
                        {!profile.collegeEmailVerified && (
                           <button onClick={() => setVerifyModalOpen(true)} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                              Verify College Email
                           </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Skills & Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               {/* Skills */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-900">Skills</h3>
                     <button onClick={() => setEditModalOpen(true)} className="text-blue-600 text-sm font-bold hover:underline">Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                     {profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                           {skill}
                        </span>
                     ))}
                  </div>
               </div>

               {/* Activity Heatmap (Mock) */}
               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Activity</h3>
                  <div className="flex gap-1 h-20 items-end">
                     {Array.from({length: 30}).map((_, i) => (
                        <div 
                           key={i} 
                           className={`flex-1 rounded-sm ${Math.random() > 0.5 ? 'bg-blue-500' : 'bg-gray-100'}`}
                           style={{ height: `${Math.random() * 100}%` }}
                        ></div>
                     ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">Last 30 days activity</p>
               </div>
            </div>

            {/* Recent Activity List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">Recent History</h3>
               </div>
               <div className="divide-y divide-gray-100">
                  {profile.activity.map(act => (
                     <div key={act.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.type === 'course' ? 'bg-purple-100 text-purple-600' : act.type === 'badge' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                           {act.type === 'course' ? '📚' : act.type === 'badge' ? '🏆' : '💼'}
                        </div>
                        <div className="flex-1">
                           <p className="text-sm font-medium text-gray-900">{act.text}</p>
                           <p className="text-xs text-gray-500">{act.date}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>

          </main>

          {/* --- RIGHT SIDEBAR (Resume & Social) --- */}
          <aside className="hidden xl:block w-80 shrink-0 sticky top-24 space-y-6">
            
            {/* Resume Widget */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-900 mb-4 text-sm">Resume</h3>
               <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 border-dashed text-center mb-4 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setResumeModalOpen(true)}>
                  <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  <p className="text-sm font-medium text-gray-700 truncate">{profile.resume.name}</p>
                  <p className="text-xs text-gray-500">Updated: {profile.resume.lastUpdated}</p>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => alert("Downloaded Resume!")} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">Download</button>
                  <button onClick={() => setResumeModalOpen(true)} className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors">Update</button>
               </div>
            </div>

            {/* Profile Strength */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-900 text-sm">Profile Strength</h3>
                  <span className="text-xs font-bold text-green-600">{profile.stats.profileStrength}%</span>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${profile.stats.profileStrength}%` }}></div>
               </div>
               <p className="text-xs text-gray-500">Add a project to reach 100%</p>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
               <h3 className="font-bold text-gray-900 mb-4 text-sm">Social Profiles</h3>
               <div className="space-y-3">
                  {Object.entries(profile.social).map(([platform, link]) => (
                     <a key={platform} href={`https://${link}`} target="_blank" rel="noreferrer" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors group">
                        <span className="text-sm font-medium text-gray-700 capitalize">{platform}</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                     </a>
                  ))}
               </div>
            </div>

          </aside>

        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
           {toast}
        </div>
      )}

      {/* Modals */}
      {editModalOpen && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setEditModalOpen(false)} 
          onSave={handleSaveProfile} 
        />
      )}

      {verifyModalOpen && (
        <VerifyCollegeEmailModal 
          profile={profile} 
          onClose={() => setVerifyModalOpen(false)} 
          onVerified={handleVerifyEmail} 
        />
      )}

      {settingsModalOpen && (
         <SettingsModal onClose={() => setSettingsModalOpen(false)} />
      )}

      {privacyModalOpen && (
         <PrivacyModal onClose={() => setPrivacyModalOpen(false)} />
      )}

      {resumeModalOpen && (
         <ResumeModal 
           resume={profile.resume} 
           onClose={() => setResumeModalOpen(false)}
           onUpdate={(newResume) => {
              setProfile(prev => ({...prev, resume: newResume}));
              showToast("Resume updated successfully!");
              setResumeModalOpen(false);
           }} 
         />
      )}

    </div>
    </div>
  );
}

/* -------------------- Sub-components -------------------- */

function EditProfileModal({ profile, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState({ ...profile });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-2xl p-0 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <h2 className="text-lg font-bold text-gray-900">Edit Profile</h2>
           <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
           {["Personal", "Social", "Skills"].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                 {tab}
              </button>
           ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1">
           {activeTab === "personal" && (
              <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                       <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Pronouns</label>
                       <input value={form.pronouns} onChange={e => setForm({...form, pronouns: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Bio</label>
                    <textarea rows="3" value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                       <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                       <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                       <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                 </div>
              </div>
           )}

           {activeTab === "social" && (
              <div className="space-y-4">
                 {Object.keys(profile.social).map(key => (
                    <div key={key}>
                       <label className="block text-xs font-bold text-gray-700 mb-1 capitalize">{key}</label>
                       <input 
                         value={form.social[key]} 
                         onChange={e => setForm({...form, social: {...form.social, [key]: e.target.value}})} 
                         className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                       />
                    </div>
                 ))}
              </div>
           )}

           {activeTab === "skills" && (
              <div>
                 <label className="block text-xs font-bold text-gray-700 mb-2">Skills (Comma separated)</label>
                 <textarea 
                    rows="4" 
                    value={form.skills.join(", ")} 
                    onChange={e => setForm({...form, skills: e.target.value.split(",").map(s => s.trim())})} 
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                 />
                 <div className="mt-4 flex flex-wrap gap-2">
                    {form.skills.map((s, i) => <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{s}</span>)}
                 </div>
              </div>
           )}
        </form>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
           <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100">Cancel</button>
           <button onClick={handleSubmit} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-md">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

function VerifyCollegeEmailModal({ profile, onClose, onVerified }) {
  const [email, setEmail] = useState(profile.collegeEmail || "");
  const [step, setStep] = useState("email"); // email, otp
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => {
     if(email) setStep("otp");
  };

  const handleVerify = () => {
     if(otp === "1234") onVerified(email); // Mock OTP
     else alert("Invalid OTP (Hint: use 1234)");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
         <h2 className="text-xl font-bold text-gray-900 mb-2">Verify College Email</h2>
         <p className="text-sm text-gray-500 mb-6">Unlock exclusive student features by verifying your institute email.</p>
         
         {step === "email" ? (
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">College Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="student@college.edu" />
               </div>
               <button onClick={handleSendOtp} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Send OTP</button>
            </div>
         ) : (
            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Enter OTP</label>
                  <input value={otp} onChange={e => setOtp(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest font-mono text-lg" maxLength={4} placeholder="XXXX" />
                  <p className="text-xs text-center text-gray-400 mt-2">Sent to {email}</p>
               </div>
               <button onClick={handleVerify} className="w-full py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">Verify</button>
            </div>
         )}
      </div>
    </div>
  );
}

function SettingsModal({ onClose }) {
   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
         <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
            
            <div className="space-y-4">
               <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Password</h3>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 w-full text-left">Change Password</button>
               </div>
               
               <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-2">Preferences</h3>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                     <span className="text-sm text-gray-600">Email Notifications</span>
                     <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between py-2">
                     <span className="text-sm text-gray-600">SMS Alerts</span>
                     <input type="checkbox" className="toggle" />
                  </div>
               </div>

               <div>
                  <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                  <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 w-full text-left">Delete Account</button>
               </div>
            </div>

            <div className="mt-6 text-right">
               <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black">Close</button>
            </div>
         </div>
      </div>
   );
}

function PrivacyModal({ onClose }) {
   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
         <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy Settings</h2>
            
            <div className="space-y-4">
               <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                     <span className="block text-sm font-bold text-gray-800">Public Profile</span>
                     <span className="text-xs text-gray-500">Allow others to see your profile</span>
                  </div>
                  <input type="checkbox" defaultChecked />
               </div>

               <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div>
                     <span className="block text-sm font-bold text-gray-800">Show Email</span>
                     <span className="text-xs text-gray-500">Display email on public profile</span>
                  </div>
                  <input type="checkbox" />
               </div>

               <div className="flex items-center justify-between py-2">
                  <div>
                     <span className="block text-sm font-bold text-gray-800">Allow Messages</span>
                     <span className="text-xs text-gray-500">Let recruiters message you</span>
                  </div>
                  <input type="checkbox" defaultChecked />
               </div>
            </div>

            <div className="mt-6 text-right">
               <button onClick={onClose} className="px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg hover:bg-black">Done</button>
            </div>
         </div>
      </div>
   );
}

function ResumeModal({ resume, onClose, onUpdate }) {
   const [file, setFile] = useState(null);
   
   const handleUpload = () => {
      if(!file) return;
      onUpdate({
         name: file.name,
         lastUpdated: new Date().toLocaleDateString(),
         url: URL.createObjectURL(file)
      });
   };

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
         <div className="bg-white rounded-2xl w-full max-w-lg relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Manage Resume</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer relative mb-4">
               <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
               <div className="text-sm text-gray-500">
                  {file ? <span className="text-blue-600 font-semibold">{file.name}</span> : <span>Click to upload new PDF</span>}
               </div>
            </div>

            <div className="flex justify-between items-center mb-4">
               <div className="text-sm text-gray-600">Current: <span className="font-bold">{resume.name}</span></div>
               <div className="text-xs text-gray-400">{resume.lastUpdated}</div>
            </div>

            <div className="flex justify-end gap-3">
               <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100">Cancel</button>
               <button onClick={handleUpload} disabled={!file} className={`px-6 py-2 text-white font-bold text-sm rounded-lg shadow-md transition-colors ${file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}>Update Resume</button>
            </div>
         </div>
      </div>
   );
}