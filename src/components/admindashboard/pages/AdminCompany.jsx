import React, { useState } from 'react';
import { 
  MapPinIcon, 
  CurrencyRupeeIcon, 
  XMarkIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  BuildingOffice2Icon,
  UsersIcon,
  FolderOpenIcon,
  PaperAirplaneIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  EllipsisVerticalIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  BellIcon
} from "@heroicons/react/24/outline";

const AdminCompanyPanel = () => {
  // --- STATE ---
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showOpenModal, setShowOpenModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- MOCK DATA ---
  const companies = [
    { id: 1, name: 'Tech Innovations Pvt Ltd', status: 'Active', openings: 5, students: 12, avgPackage: '8.5L', location: 'Mumbai', lastActive: '2 days ago' },
    { id: 2, name: 'Digital Solutions Inc', status: 'Active', openings: 3, students: 8, avgPackage: '7.2L', location: 'Bangalore', lastActive: '1 week ago' },
    { id: 3, name: 'CloudTech Systems', status: 'Pending', openings: 2, students: 0, avgPackage: '9.0L', location: 'Pune', lastActive: '3 days ago' },
    { id: 4, name: 'AI Robotics Corp', status: 'Active', openings: 4, students: 15, avgPackage: '12.5L', location: 'Hyderabad', lastActive: '5 days ago' },
    { id: 5, name: 'FinTech Solutions', status: 'Inactive', openings: 0, students: 3, avgPackage: '6.8L', location: 'Delhi', lastActive: '2 months ago' },
    { id: 6, name: 'Green Energy Ltd', status: 'Active', openings: 6, students: 4, avgPackage: '7.5L', location: 'Chennai', lastActive: '1 day ago' },
  ];

  const notifications = [
    { id: 1, type: 'Application', message: '8 new applications from students', time: '2 hours ago' },
    { id: 2, type: 'Opening', message: 'Tech Innovations posted 2 new openings', time: '5 hours ago' },
    { id: 3, type: 'Partnership', message: 'New company registration pending approval', time: '1 day ago' },
  ];

  // --- HANDLERS ---
  const toggleCompanySelection = (id) => {
    setSelectedCompanies(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCompanies(companies.map(c => c.id));
    } else {
      setSelectedCompanies([]);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: "bg-green-100 text-green-700 border-green-200",
      Pending: "bg-amber-100 text-amber-700 border-amber-200",
      Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    };
    const icons = {
      Active: CheckCircleIcon,
      Pending: ClockIcon,
      Inactive: ExclamationCircleIcon,
    };
    const Icon = icons[status] || ExclamationCircleIcon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- HORIZONTAL NAVBAR --- */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left: Logo & Title */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <BuildingOffice2Icon className="text-indigo-600 w-8 h-8" />
                <div>
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">Prashikshan</h2>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Admin Console</p>
                </div>
              </div>

              {/* Center: Main Navigation Tabs */}
              <div className="hidden md:flex space-x-1 h-full items-center">
                <button 
                  onClick={() => setActiveSection('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeSection === 'dashboard' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveSection('companies')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeSection === 'companies' 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  All Companies
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all">
                  Analytics
                </button>
              </div>
            </div>

            {/* Right: Quick Actions & Profile */}
            <div className="flex items-center gap-4">
              {/* Quick Action Buttons */}
              <div className="hidden lg:flex items-center gap-2 pr-4 border-r border-gray-200">
                <button 
                  onClick={() => setShowOpenModal(true)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                  title="Open Portals"
                >
                  <FolderOpenIcon className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setShowSendModal(true)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                  title="Send Messages"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
                <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative">
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
              </div>

              {/* Profile Dropdown Trigger */}
              <div className="flex items-center gap-3 pl-2">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-700">Admin User</span>
                  <span className="text-xs text-gray-500">Super Admin</span>
                </div>
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm cursor-pointer hover:bg-indigo-700 transition-colors">
                  AU
                </div>
              </div>
            </div>

          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          
          {/* DASHBOARD VIEW */}
          {activeSection === 'dashboard' && (
            <div className="animate-fade-in space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
                  <p className="text-gray-500 mt-1">Overview of company activities and status.</p>
                </div>
                <div className="text-sm text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                  Last updated: <span className="font-semibold text-gray-800">Just now</span>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Companies</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">{companies.length}</p>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <BuildingOffice2Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-4 flex items-center font-medium">
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 mr-1" /> +3 this month
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Openings</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">28</p>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                      <FolderOpenIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-4 flex items-center font-medium">
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 mr-1" /> +5 added today
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Students Placed</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">156</p>
                    </div>
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                      <UsersIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-4 flex items-center font-medium">
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 mr-1" /> +12% growth
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Avg Package</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">₹8.2L</p>
                    </div>
                    <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                      <CurrencyRupeeIcon className="w-6 h-6" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 mt-4 flex items-center font-medium">
                    <ArrowTrendingUpIcon className="w-3.5 h-3.5 mr-1" /> +8% vs last year
                  </p>
                </div>
              </div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Companies List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800">Recent Activities</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {companies.slice(0, 4).map(company => (
                      <div key={company.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold text-lg">
                            {company.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{company.name}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPinIcon className="w-3.5 h-3.5" />
                                {company.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                           {getStatusBadge(company.status)}
                           <p className="text-xs text-gray-500 mt-1">{company.openings} openings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Notifications</h3>
                  <div className="space-y-6">
                    {notifications.map((notif, idx) => (
                      <div key={notif.id} className="relative pl-6 border-l-2 border-indigo-100">
                         <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${
                             notif.type === 'Application' ? 'bg-blue-500' : 
                             notif.type === 'Opening' ? 'bg-green-500' : 'bg-orange-500'
                         }`}></div>
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{notif.type}</p>
                         <p className="text-sm text-gray-900 font-medium mb-1">{notif.message}</p>
                         <p className="text-xs text-gray-400">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ALL COMPANIES VIEW */}
          {activeSection === 'companies' && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Companies</h1>
                    <p className="text-gray-500 mt-1">Manage partnership details and status.</p>
                </div>
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-colors">
                    <FunnelIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Filter</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">
                    <BuildingOffice2Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">Add Company</span>
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mb-6 relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by company name, location..."
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700"
                />
              </div>

              {/* Companies Table */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                        <th className="text-left p-4 w-12">
                            <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                        </th>
                        <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Company</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Openings</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Students</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Package</th>
                        <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Active</th>
                        <th className="text-right p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {companies
                        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.location.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(company => (
                        <tr key={company.id} className="hover:bg-gray-50 transition-colors group">
                            <td className="p-4">
                            <input 
                                type="checkbox" 
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                                checked={selectedCompanies.includes(company.id)}
                                onChange={() => toggleCompanySelection(company.id)}
                            />
                            </td>
                            <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-bold">
                                {company.name.charAt(0)}
                                </div>
                                <div>
                                <p className="font-semibold text-gray-800 text-sm">{company.name}</p>
                                <p className="text-xs text-gray-500">{company.location}</p>
                                </div>
                            </div>
                            </td>
                            <td className="p-4">
                                {getStatusBadge(company.status)}
                            </td>
                            <td className="p-4 text-sm font-medium text-gray-700">{company.openings}</td>
                            <td className="p-4 text-sm font-medium text-gray-700">{company.students}</td>
                            <td className="p-4 text-sm font-medium text-gray-700">{company.avgPackage}</td>
                            <td className="p-4 text-sm text-gray-500">{company.lastActive}</td>
                            <td className="p-4 text-right">
                            <button className="p-2 hover:bg-gray-200 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
                                <EllipsisVerticalIcon className="w-5 h-5" />
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                {companies.length === 0 && (
                    <div className="p-12 text-center text-gray-500">No companies found.</div>
                )}
              </div>
            </div>
          )}
      </main>

      {/* OPEN PORTAL MODAL */}
      {showOpenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all scale-100">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Open Company Portal</h3>
                <p className="text-sm text-gray-500 mt-1">Select companies to enable student applications.</p>
              </div>
              <button onClick={() => setShowOpenModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
                {/* Select All Bar */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                            onChange={handleSelectAll}
                            checked={selectedCompanies.length === companies.length && companies.length > 0}
                        />
                        <span className="text-sm font-semibold text-gray-700">Select All Companies</span>
                    </label>
                    <span className="text-sm text-indigo-600 font-medium">{selectedCompanies.length} selected</span>
                </div>

              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                {companies.map(company => (
                  <label key={company.id} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedCompanies.includes(company.id) 
                      ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                      : 'bg-white border-gray-200 hover:border-indigo-200 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-5 h-5"
                      checked={selectedCompanies.includes(company.id)}
                      onChange={() => toggleCompanySelection(company.id)}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                          <p className={`font-semibold ${selectedCompanies.includes(company.id) ? 'text-indigo-900' : 'text-gray-800'}`}>
                              {company.name}
                          </p>
                          {getStatusBadge(company.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{company.openings} openings available • {company.location}</p>
                    </div>
                  </label>
                ))}
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowOpenModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => {
                    alert(`Opening portals for ${selectedCompanies.length} companies`);
                    setShowOpenModal(false);
                    setSelectedCompanies([]);
                  }}
                  disabled={selectedCompanies.length === 0}
                >
                  Confirm Open Portals ({selectedCompanies.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEND MESSAGE MODAL */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Broadcast Message</h3>
                <p className="text-sm text-gray-500 mt-1">Send updates, requests, or notifications to companies.</p>
              </div>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message Type</label>
                    <div className="relative">
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-gray-700">
                        <option>Announcement</option>
                        <option>Student Profiles</option>
                        <option>Event Invitation</option>
                        <option>Document Request</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                    <div className="relative">
                        <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none text-gray-700">
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                        </select>
                        <div className="absolute right-3 top-3 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  placeholder="E.g., Updated Placement Policy 2025"
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                <textarea 
                  rows="4"
                  placeholder="Type your message here..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400 resize-none"
                ></textarea>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Recipients</label>
                <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto bg-gray-50">
                  <div className="space-y-2">
                    {companies.map(company => (
                      <label key={company.id} className="flex items-center gap-3 p-2 hover:bg-white rounded cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                          checked={selectedCompanies.includes(company.id)}
                          onChange={() => toggleCompanySelection(company.id)}
                        />
                        <span className="text-sm text-gray-700 font-medium">{company.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">
                    {selectedCompanies.length > 0 ? `${selectedCompanies.length} companies selected` : 'No companies selected'}
                </p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  disabled={selectedCompanies.length === 0}
                  onClick={() => {
                    alert(`Sending message to ${selectedCompanies.length} companies`);
                    setShowSendModal(false);
                    setSelectedCompanies([]);
                  }}
                >
                  <PaperAirplaneIcon className="w-5 h-5" />
                  Send Broadcast
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCompanyPanel;