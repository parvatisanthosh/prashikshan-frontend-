// src/pages/GovPortal.jsx
import React, { useEffect, useState } from "react";
import csvService from "../services/csvService";

/* -------------------- Main Component -------------------- */
export default function GovPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");

  // Login Form State
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  // Use CSV login route for government admin authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Using the existing CSV login endpoint
      const response = await csvService.login({
        email: loginForm.username, // Treat username as email
        password: loginForm.password
      });

      if (response.data.success) {
        // Only allow admin users to access portal
        if (response.data.user.role?.toLowerCase() === 'admin') {
          // Store token in localStorage for API calls
          localStorage.setItem('token', response.data.token);
          
          setUser({
            name: response.data.user.name,
            email: response.data.user.email,
            role: "Government Administrator",
            token: response.data.token
          });
          await fetchData();
        } else {
          setError("Access denied. Only admin users can access this portal.");
          setLoading(false);
        }
      } else {
        setError(response.data.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || 
        "Invalid credentials. Please try again."
      );
      setLoading(false);
    }
  };

  async function fetchData() {
    setLoading(true);
    try {
      // Since we don't have specific government analytics endpoints,
      // we'll use mock data for the dashboard
      // In a real implementation, you would have dedicated endpoints
      
      await new Promise(r => setTimeout(r, 800)); // Simulate API call
      
      setData({
        overview: {
          totalStudents: 145000,
          totalColleges: 85,
          placedStudents: 98000,
          avgPackage: "6.5 LPA",
          placementRate: 68,
          topSkill: "React.js",
          studentGrowth: "+4.5%",
          newColleges: "+2 New",
          placementGrowth: "+1.2%",
          packageGrowth: "+0.5 LPA"
        },
        placementTrend: [
          { year: 2020, rate: 55 },
          { year: 2021, rate: 60 },
          { year: 2022, rate: 58 },
          { year: 2023, rate: 65 },
          { year: 2024, rate: 68 },
        ],
        colleges: [
          { id: "c1", name: "IIIT Nagpur", city: "Nagpur", type: "Govt", students: 1200, placed: 950, avgPackage: 12.5, status: "Excellent" },
          { id: "c2", name: "Govt Engineering College", city: "Pune", type: "Govt", students: 3000, placed: 1800, avgPackage: 5.5, status: "Average" },
          { id: "c3", name: "City Tech Institute", city: "Mumbai", type: "Private", students: 800, placed: 300, avgPackage: 4.2, status: "Critical" },
          { id: "c4", name: "National Science Univ", city: "Delhi", type: "Govt", students: 4500, placed: 4100, avgPackage: 9.8, status: "Excellent" },
          { id: "c5", name: "Rural Polytech", city: "Amravati", type: "Private", students: 600, placed: 150, avgPackage: 3.5, status: "Critical" },
        ],
        skillGap: [
          { skill: "Cloud Computing", demand: 90, supply: 45 },
          { skill: "Data Science", demand: 85, supply: 60 },
          { skill: "React/Node", demand: 80, supply: 95 },
          { skill: "Cybersecurity", demand: 95, supply: 30 },
        ],
        alerts: [
          { id: 1, type: "critical", msg: "City Tech Institute: Placement < 40% for 2 years." },
          { id: 2, type: "warning", msg: "Rural Polytech: Curriculum outdated (Last update: 2019)." },
          { id: 3, type: "info", msg: "New NEP Guidelines applied in 45 colleges." },
        ],
        studentDemographics: {
          male: 60,
          female: 40,
          undergrad: 85,
          postgrad: 15,
          totalStudents: 145000
        },
        topRecruiters: [
          { name: "TCS", hires: 12000 },
          { name: "Infosys", hires: 10500 },
          { name: "Accenture", hires: 9000 },
          { name: "Wipro", hires: 8500 },
          { name: "Google", hires: 150 },
        ],
        reports: [
          { id: "r1", title: "Annual Education Report 2024", date: "Jan 15, 2025", size: "2.4 MB" },
          { id: "r2", title: "Q4 Placement Audit", date: "Dec 10, 2024", size: "1.1 MB" },
          { id: "r3", title: "NEP Compliance Status", date: "Nov 05, 2024", size: "0.8 MB" },
        ]
      });
    } catch (e) {
      console.error("Failed to load gov data", e);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    setUser(null);
    setData(null);
    setLoginForm({ username: "", password: "" });
    setError("");
  };

  // Bulk Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      alert("Please select a CSV file");
      return;
    }

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('csvFile', uploadFile);

      // Token is automatically added by api interceptor from localStorage
      const response = await csvService.bulkRegister(formData);
      
      setUploadResult(response.data);
      setUploadFile(null);
    } catch (err) {
      console.error("Bulk upload error:", err);
      setUploadResult({
        success: false,
        error: err.response?.data?.error || "Upload failed"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await csvService.downloadTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student-bulk-upload-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download template error:", err);
      alert("Failed to download template");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <svg className="w-8 h-8 text-slate-800" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10.496 2.132a1 1 0 00-.992 0l-7 4A1 1 0 003 8v7a1 1 0 100 2h14a1 1 0 100-2V8a1 1 0 00.496-1.868l-7-4zM6 9a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1zm3 1a1 1 0 012 0v3a1 1 0 11-2 0v-3zm5-1a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">GovPortal Login</h1>
            <p className="text-sm text-slate-500">Centralized Education & Placement Monitoring</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Email</label>
              <input 
                type="email" 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                value={loginForm.username}
                onChange={e => setLoginForm({...loginForm, username: e.target.value})}
                disabled={loading}
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
              <input 
                type="password" 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-slate-500 outline-none transition-all"
                value={loginForm.password}
                onChange={e => setLoginForm({...loginForm, password: e.target.value})}
                disabled={loading}
              />
            </div>
            {error && <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded">{error}</p>}
            <button 
              type="submit" 
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Access Dashboard"}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Login using admin credentials from the system
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
             <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
             <div className="w-48 h-4 bg-slate-200 rounded"></div>
             <p className="text-sm text-slate-500">Loading dashboard data...</p>
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
       
       {/* Sidebar */}
       <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen">
          <div className="p-6 border-b border-slate-800">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                   <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
                </div>
                <span className="font-bold text-lg tracking-tight">GovPortal</span>
             </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
             {["Overview", "Institutes", "Students", "Placements", "Reports", "Bulk Upload"].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                   {tab}
                </button>
             ))}
          </nav>
          <div className="p-6 border-t border-slate-800">
             <div className="text-xs text-slate-500 mb-1">Logged in as</div>
             <div className="font-bold">{user.name}</div>
             <div className="text-xs text-slate-400 mt-1">{user.role}</div>
             <button 
               onClick={handleLogout} 
               className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
             >
               Sign Out
             </button>
          </div>
       </aside>

       {/* Main Content */}
       <main className="flex-1 min-w-0">
          
          <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-20 flex justify-between items-center">
             <div>
                <h2 className="text-xl font-bold text-slate-900">{activeTab}</h2>
                <p className="text-xs text-slate-500">National Education & Placement Analytics</p>
             </div>
             <div className="flex gap-3">
                <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Notifications
                  {data.alerts?.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                      {data.alerts.length}
                    </span>
                  )}
                </button>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">Settings</button>
             </div>
          </header>

          <div className="p-8 max-w-[1600px] mx-auto space-y-8">
             
             {/* Content Switching */}
             {activeTab === "Overview" && <OverviewView data={data} />}
             {activeTab === "Institutes" && <InstitutesView colleges={data.colleges} />}
             {activeTab === "Students" && <StudentsView demo={data.studentDemographics} />}
             {activeTab === "Placements" && <PlacementsView trend={data.placementTrend} recruiters={data.topRecruiters} />}
             {activeTab === "Reports" && <ReportsView reports={data.reports} />}
             {activeTab === "Bulk Upload" && (
               <BulkUploadView 
                 onUpload={handleBulkUpload}
                 onDownloadTemplate={handleDownloadTemplate}
                 uploadFile={uploadFile}
                 setUploadFile={setUploadFile}
                 uploading={uploading}
                 uploadResult={uploadResult}
               />
             )}

          </div>
       </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* SUB-VIEWS                                   */
/* -------------------------------------------------------------------------- */

// BULK UPLOAD VIEW (Uses existing CSV routes)
function BulkUploadView({ onUpload, onDownloadTemplate, uploadFile, setUploadFile, uploading, uploadResult }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-bold text-slate-900 mb-4">Bulk Student Registration</h3>
        <p className="text-sm text-slate-600 mb-6">
          Upload a CSV file to register multiple students at once. Each student will receive their credentials via SMS.
        </p>
        
        <div className="mb-6">
          <button 
            onClick={onDownloadTemplate}
            className="px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors"
          >
            📥 Download CSV Template
          </button>
        </div>

        <form onSubmit={onUpload} className="space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
            <input 
              type="file"
              accept=".csv"
              onChange={e => setUploadFile(e.target.files[0])}
              className="hidden"
              id="csvFile"
            />
            <label htmlFor="csvFile" className="cursor-pointer">
              <div className="mb-3">
                <svg className="w-12 h-12 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-sm font-bold text-slate-700">
                {uploadFile ? uploadFile.name : "Click to upload CSV file"}
              </p>
              <p className="text-xs text-slate-500 mt-1">CSV files only</p>
            </label>
          </div>

          <button 
            type="submit"
            disabled={!uploadFile || uploading}
            className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Upload & Register Students"}
          </button>
        </form>

        {uploadResult && (
          <div className={`mt-6 p-4 rounded-lg ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <h4 className="font-bold mb-2 text-sm">
              {uploadResult.success ? '✓ Upload Complete' : '✗ Upload Failed'}
            </h4>
            
            {uploadResult.success && uploadResult.summary && (
              <div className="text-sm space-y-1 mb-3">
                <p>Total Rows: {uploadResult.summary.total}</p>
                <p className="text-green-700">Successful: {uploadResult.summary.successful}</p>
                {uploadResult.summary.failed > 0 && (
                  <p className="text-red-700">Failed: {uploadResult.summary.failed}</p>
                )}
              </div>
            )}

            {uploadResult.successfulRegistrations && uploadResult.successfulRegistrations.length > 0 && (
              <div className="mt-4 max-h-64 overflow-y-auto">
                <h5 className="font-bold text-xs mb-2">Registered Students:</h5>
                <div className="space-y-2">
                  {uploadResult.successfulRegistrations.map((student, idx) => (
                    <div key={idx} className="text-xs bg-white p-2 rounded border border-green-200">
                      <div className="font-bold">{student.name}</div>
                      <div className="text-slate-600">{student.email}</div>
                      <div className="text-slate-500">
                        Temp Password: <span className="font-mono">{student.tempPassword}</span>
                        {student.smsSent ? ' ✓ SMS Sent' : ' ✗ SMS Failed'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="mt-4 max-h-64 overflow-y-auto">
                <h5 className="font-bold text-xs mb-2 text-red-700">Errors:</h5>
                <div className="space-y-2">
                  {uploadResult.errors.map((err, idx) => (
                    <div key={idx} className="text-xs bg-white p-2 rounded border border-red-200">
                      <div className="font-bold">Row {err.row}:</div>
                      <div className="text-red-600">{err.error}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!uploadResult.success && uploadResult.error && (
              <p className="text-sm text-red-700">{uploadResult.error}</p>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-sm text-blue-900 mb-2">📋 CSV Format Requirements</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Required columns: name, enrollmentNumber, branch, email, phoneNumber, instituteName</li>
          <li>• Email must be unique for each student</li>
          <li>• Phone numbers will receive SMS with login credentials</li>
          <li>• Students will be assigned temporary passwords</li>
          <li>• Students must change password on first login</li>
        </ul>
      </div>
    </div>
  );
}

// 1. OVERVIEW VIEW
function OverviewView({ data }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          label="Total Enrolled Students" 
          value={data.overview.totalStudents?.toLocaleString() || "0"} 
          trend={data.overview.studentGrowth || "+4.5%"} 
          positive={true} 
        />
        <KPICard 
          label="Registered Institutes" 
          value={data.overview.totalColleges || "0"} 
          trend={data.overview.newColleges || "+2 New"} 
          positive={true} 
        />
        <KPICard 
          label="Placement Rate" 
          value={(data.overview.placementRate || 0) + "%"} 
          trend={data.overview.placementGrowth || "+1.2%"} 
          positive={true} 
        />
        <KPICard 
          label="Average Package" 
          value={data.overview.avgPackage || "0 LPA"} 
          trend={data.overview.packageGrowth || "+0.5 LPA"} 
          positive={true} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900">Placement Trends (5 Years)</h3>
                  <select className="text-xs border-slate-200 rounded-lg bg-slate-50">
                    <option>National Average</option>
                  </select>
              </div>
              <div className="h-64 w-full">
                  {data.placementTrend && data.placementTrend.length > 0 ? (
                    <SimpleLineChart data={data.placementTrend} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      No trend data available
                    </div>
                  )}
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-900">Top Performing Institutes</h3>
                  <button className="text-xs text-blue-600 hover:underline">View All</button>
               </div>
               <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                     <tr>
                        <th className="px-6 py-3">Institute</th>
                        <th className="px-6 py-3 text-right">Placed %</th>
                        <th className="px-6 py-3 text-right">Avg Pkg</th>
                        <th className="px-6 py-3 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {data.colleges && data.colleges.slice(0, 3).map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                           <td className="px-6 py-3 font-medium text-slate-900">{c.name}</td>
                           <td className="px-6 py-3 text-right font-bold text-blue-600">
                             {Math.round((c.placed/c.students)*100)}%
                           </td>
                           <td className="px-6 py-3 text-right">{c.avgPackage} LPA</td>
                           <td className="px-6 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.status === 'Excellent' ? 'bg-green-100 text-green-700' : c.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                 {c.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
        </div>

        <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Compliance Alerts</h3>
              <div className="space-y-3">
                  {data.alerts && data.alerts.length > 0 ? (
                    data.alerts.map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border-l-4 text-xs ${alert.type === 'critical' ? 'bg-red-50 border-red-500 text-red-800' : alert.type === 'warning' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-blue-50 border-blue-500 text-blue-800'}`}>
                          <div className="font-bold uppercase mb-1">{alert.type}</div>
                          {alert.msg || alert.message}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-4">No alerts</div>
                  )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Skill Gap Analysis</h3>
              <div className="space-y-4">
                  {data.skillGap && data.skillGap.length > 0 ? (
                    data.skillGap.map((item) => (
                      <div key={item.skill}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-bold text-slate-700">{item.skill}</span>
                            <span className={item.supply < item.demand ? "text-red-500" : "text-green-500"}>
                              {item.supply < item.demand ? "Undersupply" : "Good"}
                            </span>
                          </div>
                          <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="absolute top-0 left-0 h-full bg-slate-300 w-[90%] opacity-30"></div> 
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full ${item.supply < item.demand ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${item.supply}%` }}
                            ></div>
                          </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-400 py-4">No skill gap data</div>
                  )}
              </div>
            </div>
        </div>
      </div>
    </>
  );
}

// 2. INSTITUTES VIEW
function InstitutesView({ colleges }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const filteredColleges = colleges?.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || c.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-bold text-slate-900">Registered Institutes</h3>
        <div className="flex gap-2">
          <input 
            placeholder="Search..." 
            className="text-xs px-3 py-1.5 border rounded-lg w-48"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select 
            className="text-xs border rounded-lg px-2 py-1.5"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="govt">Govt</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-3">Institute Name</th>
              <th className="px-6 py-3">City</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3 text-right">Students</th>
              <th className="px-6 py-3 text-right">Avg Package</th>
              <th className="px-6 py-3 text-center">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-6 py-3 text-slate-500">{c.city}</td>
                    <td className="px-6 py-3 text-slate-500">{c.type}</td>
                    <td className="px-6 py-3 text-right">{c.students}</td>
                    <td className="px-6 py-3 text-right">{c.avgPackage} LPA</td>
                    <td className="px-6 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${c.status === 'Excellent' ? 'bg-green-100 text-green-700' : c.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="text-xs text-blue-600 font-bold hover:underline">View Audit</button>
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                  No institutes found
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}

// 3. STUDENTS VIEW
function StudentsView({ demo }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <h4 className="text-slate-500 text-xs uppercase font-bold mb-2">Gender Ratio</h4>
            <div className="flex items-center justify-center gap-4">
               <div>
                 <span className="text-2xl font-bold text-blue-600">{demo?.male || 0}%</span>
                 <div className="text-xs">Male</div>
               </div>
               <div className="h-8 w-px bg-slate-200"></div>
               <div>
                 <span className="text-2xl font-bold text-pink-500">{demo?.female || 0}%</span>
                 <div className="text-xs">Female</div>
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <h4 className="text-slate-500 text-xs uppercase font-bold mb-2">Course Level</h4>
            <div className="flex items-center justify-center gap-4">
               <div>
                 <span className="text-2xl font-bold text-indigo-600">{demo?.undergrad || 0}%</span>
                 <div className="text-xs">Undergrad</div>
               </div>
               <div className="h-8 w-px bg-slate-200"></div>
               <div>
                 <span className="text-2xl font-bold text-purple-500">{demo?.postgrad || 0}%</span>
                 <div className="text-xs">Postgrad</div>
               </div>
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
            <h4 className="text-slate-500 text-xs uppercase font-bold mb-2">Total Active Students</h4>
            <div className="text-3xl font-black text-slate-800">
              {demo?.totalStudents?.toLocaleString() || "0"}
            </div>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
         <h3 className="font-bold text-slate-900 mb-4">Student Database Access</h3>
         <p className="text-sm text-slate-600 mb-4">
           Student data is managed through the bulk registration system. Use the "Bulk Upload" tab to register new students.
         </p>
         <div className="bg-slate-50 p-4 rounded-lg">
           <p className="text-xs text-slate-500">
             Note: Individual student search and management features require additional API endpoints for government analytics.
           </p>
         </div>
      </div>
    </div>
  );
}

// 4. PLACEMENTS VIEW
function PlacementsView({ trend, recruiters }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Placement Rate Trend</h3>
            <div className="h-64">
              {trend && trend.length > 0 ? (
                <SimpleLineChart data={trend} />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No trend data available
                </div>
              )}
            </div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Top Recruiters</h3>
            <div className="space-y-3">
               {recruiters && recruiters.length > 0 ? (
                 recruiters.map((r, i) => (
                    <div key={r.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold border border-slate-200">
                            {i+1}
                          </div>
                          <span className="font-semibold text-slate-700">{r.name}</span>
                       </div>
                       <span className="text-sm font-bold text-slate-900">
                         {r.hires?.toLocaleString() || 0} Hires
                       </span>
                    </div>
                 ))
               ) : (
                 <div className="text-center text-slate-400 py-4">No recruiter data available</div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}

// 5. REPORTS VIEW
function ReportsView({ reports }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
       <h3 className="font-bold text-slate-900 mb-6">Available Reports</h3>
       <div className="space-y-4">
          {reports && reports.length > 0 ? (
            reports.map(r => (
               <div key={r.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:border-blue-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800">{r.title}</h4>
                        <p className="text-xs text-slate-500">
                          Generated: {r.date} • Size: {r.size}
                        </p>
                     </div>
                  </div>
                  <button className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    Download
                  </button>
               </div>
            ))
          ) : (
            <div className="text-center text-slate-400 py-8">No reports available</div>
          )}
       </div>
    </div>
  );
}

/* ---------------- Utilities & Charts ---------------- */

function KPICard({ label, value, trend, positive }) {
   return (
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-28">
         <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</div>
         <div className="flex items-end justify-between">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className={`text-xs font-bold px-2 py-1 rounded-full ${positive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
               {trend}
            </div>
         </div>
      </div>
   );
}

function SimpleLineChart({ data }) {
   const height = 200;
   const width = 600;
   const max = Math.max(...data.map(d => d.rate)) + 10;
   
   const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.rate / max) * height;
      return `${x},${y}`;
   }).join(" ");

   return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
         <line x1="0" y1="0" x2={width} y2="0" stroke="#f1f5f9" strokeWidth="1" />
         <line x1="0" y1={height/2} x2={width} y2={height/2} stroke="#f1f5f9" strokeWidth="1" />
         <line x1="0" y1={height} x2={width} y2={height} stroke="#f1f5f9" strokeWidth="1" />
         <polyline fill="none" stroke="#2563EB" strokeWidth="3" points={points} strokeLinecap="round" strokeLinejoin="round" />
         {data.map((d, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - (d.rate / max) * height;
            return (
               <g key={i}>
                  <circle cx={x} cy={y} r="4" fill="#2563EB" stroke="white" strokeWidth="2" />
                  <text x={x} y={y - 12} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="bold">{d.rate}%</text>
                  <text x={x} y={height + 20} textAnchor="middle" fontSize="12" fill="#94a3b8">{d.year}</text>
               </g>
            );
         })}
      </svg>
   );
}