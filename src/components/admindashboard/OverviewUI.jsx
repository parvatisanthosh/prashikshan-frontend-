import React, { useState, useEffect } from "react";
import {
  UserGroupIcon,
  AcademicCapIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  ClockIcon,
  BellAlertIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ArrowTrendingUpIcon,
  XMarkIcon,
  CalendarIcon,
  UserIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import { ArrowUpIcon, ArrowDownIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function OverviewUI() {
  const [facultyCount] = useState(142);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [loading, setLoading] = useState(true);
  const [exportingPDF, setExportingPDF] = useState(false);

  // State for API data
  const [stats, setStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);
  
  // Chart and Filter States
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [chartType, setChartType] = useState("trend");
  const [placementChartData, setPlacementChartData] = useState([]);
  const [departmentStats, setDepartmentStats] = useState({});

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- Backend-Ready API Simulation (GET Request Pattern) ---
  const fetchDashboardData = async () => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual API calls when backend is ready
      // Example API integration:
      // const [statsRes, activitiesRes, analyticsRes, placementRes] = await Promise.all([
      //   fetch('/api/dashboard/stats'),
      //   fetch('/api/dashboard/activities'),
      //   fetch('/api/dashboard/analytics'),
      //   fetch('/api/placements/chart-data')
      // ]);
      // const statsData = await statsRes.json();
      // setStats(statsData.data);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mock data - Replace these with actual API responses
      const mockStats = [
        { label: "Total Faculty", value: facultyCount || 0, change: "+12%", isPositive: true, icon: UserGroupIcon, gradient: "from-indigo-500 to-purple-600", bgColor: "bg-indigo-50", textColor: "text-indigo-600" },
        { label: "Total Students", value: "1,280", change: "+8%", isPositive: true, icon: AcademicCapIcon, gradient: "from-green-500 to-emerald-600", bgColor: "bg-green-50", textColor: "text-green-600" },
        { label: "Partner Companies", value: "63", change: "+5", isPositive: true, icon: BuildingOffice2Icon, gradient: "from-amber-500 to-orange-600", bgColor: "bg-amber-50", textColor: "text-amber-600" },
        { label: "Active Placements", value: "24", change: "+18%", isPositive: true, icon: ChartBarIcon, gradient: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50", textColor: "text-blue-600" },
      ];

      const mockActivities = [
        { id: 1, title: "New faculty member added", description: "Dr. Rajesh Kumar joined Computer Science dept", time: "2 hours ago", date: "Dec 06, 2025", user: "Admin", icon: CheckCircleIcon, iconColor: "text-green-600", iconBg: "bg-green-100" },
        { id: 2, title: "Placement drive scheduled", description: "Tech Corp visiting campus on Dec 15", time: "5 hours ago", date: "Dec 06, 2025", user: "Placement Officer", icon: ClockIcon, iconColor: "text-blue-600", iconBg: "bg-blue-100" },
        { id: 3, title: "New partnership MoU signed", description: "Agreement finalized with Innovation Labs", time: "1 day ago", date: "Dec 05, 2025", user: "Director", icon: BuildingOffice2Icon, iconColor: "text-amber-600", iconBg: "bg-amber-100" },
        { id: 4, title: "System notification", description: "Monthly report generation completed", time: "2 days ago", date: "Dec 04, 2025", user: "System", icon: BellAlertIcon, iconColor: "text-purple-600", iconBg: "bg-purple-100" },
        { id: 5, title: "Student batch registered", description: "120 new students enrolled for 2025 batch", time: "3 days ago", date: "Dec 03, 2025", user: "Admission Officer", icon: AcademicCapIcon, iconColor: "text-indigo-600", iconBg: "bg-indigo-100" },
        { id: 6, title: "Faculty training session", description: "AI/ML workshop completed successfully", time: "4 days ago", date: "Dec 02, 2025", user: "Training Dept", icon: UserGroupIcon, iconColor: "text-pink-600", iconBg: "bg-pink-100" },
      ];

      const mockAnalytics = [
        { category: "Placement Statistics", metrics: [{ label: "Total Students Eligible", value: "850", icon: UserGroupIcon }, { label: "Students Placed", value: "744", icon: CheckCircleIcon }, { label: "Placement Rate", value: "87.5%", icon: ArrowTrendingUpIcon }, { label: "Average Package", value: "₹6.2L", icon: ChartBarIcon }, { label: "Highest Package", value: "₹28L", icon: SparklesIcon }, { label: "Companies Visited", value: "156", icon: BuildingOffice2Icon }] },
        { category: "Department-wise Placement", metrics: [{ label: "Computer Science", value: "95%", icon: AcademicCapIcon }, { label: "Electronics", value: "92%", icon: AcademicCapIcon }, { label: "Mechanical", value: "85%", icon: AcademicCapIcon }, { label: "Civil Engineering", value: "78%", icon: AcademicCapIcon }, { label: "Information Technology", value: "94%", icon: AcademicCapIcon }, { label: "Electrical", value: "88%", icon: AcademicCapIcon }] },
        { category: "Recruitment Timeline", metrics: [{ label: "Q1 Placements", value: "156", icon: CalendarIcon }, { label: "Q2 Placements", value: "198", icon: CalendarIcon }, { label: "Q3 Placements", value: "234", icon: CalendarIcon }, { label: "Q4 Placements (Projected)", value: "156", icon: CalendarIcon }, { label: "Total Offers", value: "892", icon: CheckCircleIcon }, { label: "Multiple Offers", value: "148", icon: SparklesIcon }] },
      ];

      // Mock placement chart data - structured for API response
      const mockPlacementData = {
        trend: [
          { month: "Jan", CS: 45, IT: 38, ECE: 32, Mech: 28, Civil: 22, Electrical: 30 },
          { month: "Feb", CS: 52, IT: 44, ECE: 35, Mech: 30, Civil: 25, Electrical: 33 },
          { month: "Mar", CS: 58, IT: 50, ECE: 40, Mech: 35, Civil: 28, Electrical: 38 },
          { month: "Apr", CS: 65, IT: 55, ECE: 45, Mech: 38, Civil: 30, Electrical: 42 },
          { month: "May", CS: 72, IT: 62, ECE: 48, Mech: 42, Civil: 35, Electrical: 45 },
          { month: "Jun", CS: 78, IT: 68, ECE: 52, Mech: 45, Civil: 38, Electrical: 48 },
        ],
        departmentStats: {
          "All Departments": {
            totalStudents: 850,
            placed: 744,
            placementRate: 87.5,
            avgPackage: 6.2,
            medianPackage: 5.8,
            highestPackage: 28.0,
            lowestPackage: 3.5
          },
          "Computer Science": {
            totalStudents: 180,
            placed: 171,
            placementRate: 95.0,
            avgPackage: 8.5,
            medianPackage: 7.8,
            highestPackage: 28.0,
            lowestPackage: 4.5
          },
          "Information Technology": {
            totalStudents: 150,
            placed: 141,
            placementRate: 94.0,
            avgPackage: 7.8,
            medianPackage: 7.2,
            highestPackage: 24.0,
            lowestPackage: 4.2
          },
          "Electronics & Communication": {
            totalStudents: 140,
            placed: 129,
            placementRate: 92.0,
            avgPackage: 6.5,
            medianPackage: 6.0,
            highestPackage: 18.0,
            lowestPackage: 3.8
          },
          "Mechanical": {
            totalStudents: 160,
            placed: 136,
            placementRate: 85.0,
            avgPackage: 5.5,
            medianPackage: 5.2,
            highestPackage: 15.0,
            lowestPackage: 3.5
          },
          "Civil Engineering": {
            totalStudents: 120,
            placed: 94,
            placementRate: 78.0,
            avgPackage: 4.8,
            medianPackage: 4.5,
            highestPackage: 12.0,
            lowestPackage: 3.5
          },
          "Electrical": {
            totalStudents: 100,
            placed: 88,
            placementRate: 88.0,
            avgPackage: 6.0,
            medianPackage: 5.6,
            highestPackage: 16.5,
            lowestPackage: 3.8
          }
        }
      };

      setStats(mockStats);
      setRecentActivities(mockActivities);
      setAnalyticsData(mockAnalytics);
      setPlacementChartData(mockPlacementData.trend);
      setDepartmentStats(mockPlacementData.departmentStats);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- Utility Functions ---

  // Get chart data based on selected department
  const getFilteredChartData = () => {
    if (selectedDepartment === "All Departments") {
      return placementChartData;
    }
    
    const deptKeyMap = {
      "Computer Science": "CS",
      "Information Technology": "IT",
      "Electronics & Communication": "ECE",
      "Mechanical": "Mech",
      "Civil Engineering": "Civil",
      "Electrical": "Electrical"
    };
    
    const key = deptKeyMap[selectedDepartment];
    return placementChartData.map(item => ({
      month: item.month,
      placements: item[key]
    }));
  };

  // Get comparison chart data for all departments
  const getComparisonChartData = () => {
    return placementChartData;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-4 py-3 rounded-lg shadow-xl border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value}</span> students
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Export to PDF functionality
  const exportToPDF = async () => {
    setExportingPDF(true);
    
    try {
      const pdfContent = generatePDFContent();
      const printWindow = window.open('', '_blank');
      printWindow.document.write(pdfContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.print();
        setExportingPDF(false);
      }, 500);
      
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
      setExportingPDF(false);
    }
  };

  const generatePDFContent = () => {
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    return `
       <!DOCTYPE html>
       <html>
       <head>
         <title>Analytics Report - ${currentDate}</title>
         <style>
           body {
             font-family: Arial, sans-serif;
             padding: 40px;
             color: #333;
           }
           .header {
             text-align: center;
             margin-bottom: 40px;
             border-bottom: 3px solid #4f46e5;
             padding-bottom: 20px;
           }
           .header h1 {
             color: #4f46e5;
             margin: 0;
             font-size: 32px;
           }
           .header p {
             color: #666;
             margin: 10px 0 0 0;
           }
           .section {
             margin-bottom: 40px;
             page-break-inside: avoid;
           }
           .section h2 {
             color: #4f46e5;
             border-bottom: 2px solid #e5e7eb;
             padding-bottom: 10px;
             margin-bottom: 20px;
           }
           .metrics-grid {
             display: grid;
             grid-template-columns: repeat(3, 1fr);
             gap: 20px;
             margin-bottom: 20px;
           }
           .metric-card {
             border: 1px solid #e5e7eb;
             padding: 15px;
             border-radius: 8px;
             background: #f9fafb;
           }
           .metric-card .label {
             font-size: 12px;
             color: #666;
             margin-bottom: 5px;
           }
           .metric-card .value {
             font-size: 24px;
             font-weight: bold;
             color: #111;
           }
           .footer {
             margin-top: 60px;
             text-align: center;
             color: #999;
             font-size: 12px;
             border-top: 1px solid #e5e7eb;
             padding-top: 20px;
           }
           @media print {
             body { padding: 20px; }
             .section { page-break-inside: avoid; }
           }
         </style>
       </head>
       <body>
         <div class="header">
           <h1>📊 Full Analytics Dashboard Report</h1>
           <p>Institute Performance Metrics and Insights</p>
           <p><strong>Generated on:</strong> ${currentDate}</p>
         </div>

         ${analyticsData.map(section => `
           <div class="section">
             <h2>${section.category}</h2>
             <div class="metrics-grid">
               ${section.metrics.map(metric => `
                 <div class="metric-card">
                   <div class="label">${metric.label}</div>
                   <div class="value">${metric.value}</div>
                 </div>
               `).join('')}
             </div>
           </div>
         `).join('')}

         <div class="footer">
           <p>This report was automatically generated by the Institute Management System</p>
           <p>© ${new Date().getFullYear()} - Confidential Information</p>
         </div>
       </body>
       </html>
     `;
  };

  // --- Modals ---

  const AllActivitiesModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Activities</h2>
            <p className="text-gray-600 text-sm mt-1">Complete activity log and system events</p>
          </div>
          <button
            onClick={() => setShowAllActivities(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close activity log"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-4 p-5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200"
              >
                <div className={`flex-shrink-0 w-12 h-12 ${activity.iconBg} rounded-xl flex items-center justify-center`}>
                  <activity.icon className={`w-6 h-6 ${activity.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-1">
                    <p className="text-base font-semibold text-gray-900">
                      {activity.title}
                    </p>
                    <span className="text-xs text-gray-500 whitespace-nowrap sm:ml-4 mt-1 sm:mt-0">
                      {activity.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {activity.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {activity.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <UserIcon className="w-4 h-4" />
                      {activity.user}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={() => setShowAllActivities(false)}
            className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const AnalyticsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Full Analytics Dashboard</h2>
            <p className="text-gray-600 text-sm mt-1">Comprehensive performance metrics and insights</p>
          </div>
          <button
            onClick={() => setShowAnalytics(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close analytics dashboard"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {analyticsData.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ChartBarIcon className="w-6 h-6 text-indigo-600" />
                  {section.category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {section.metrics.map((metric, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <metric.icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mt-2">
                        {metric.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowAnalytics(false)}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
            <button
              onClick={exportToPDF}
              disabled={exportingPDF}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exportingPDF ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  Export as PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Main Render ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Fetching dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      
      {/* 1. PAGE HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 to-purple-800 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-1 leading-snug">
              Welcome back, Admin! <span className="inline-block transform transition-transform">👋</span>
            </h1>
            <p className="text-indigo-200 text-md sm:text-lg">
              Executive overview of your institute's operations.
            </p>
          </div>
          <WrenchScrewdriverIcon className="w-12 h-12 opacity-70 text-indigo-300 hidden sm:block" />
        </div>
      </div>

      {/* 2. STAT CARDS */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-white shadow-lg border border-gray-100 rounded-2xl p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.01] cursor-pointer relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient}`}></div>
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-xl ${item.bgColor} transition-transform duration-300`}>
                  <item.icon className={`w-8 h-8 ${item.textColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                    item.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.isPositive ? (
                    <ArrowUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3" />
                  )}
                  {item.change}
                </div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">
                  {item.value}
                </div>
                <div className="text-gray-500 text-base font-medium">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. PERFORMANCE OVERVIEW & CHART */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Overview 📈</h2>
            <p className="text-gray-600 text-base mt-1">Department-wise placement analytics and trends.</p>
          </div>
          <button 
            onClick={() => setShowAnalytics(true)}
            className="mt-4 md:mt-0 px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 shadow-sm"
          >
            <ChartBarIcon className="w-5 h-5" />
            View Full Analytics
          </button>
        </div>
        
        {/* Chart Filters and Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" />
              Filter by Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium"
            >
              <option>All Departments</option>
              <option>Computer Science</option>
              <option>Information Technology</option>
              <option>Electronics & Communication</option>
              <option>Mechanical</option>
              <option>Civil Engineering</option>
              <option>Electrical</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4" />
              Chart Type
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm font-medium"
            >
              <option value="trend">Trend View</option>
              <option value="comparison">Department Comparison</option>
            </select>
          </div>
        </div>

        {/* Department Statistics Cards */}
        {departmentStats[selectedDepartment] && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200">
              <div className="text-xs font-medium text-indigo-700 mb-1">Total Students</div>
              <div className="text-2xl font-bold text-indigo-900">{departmentStats[selectedDepartment].totalStudents}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <div className="text-xs font-medium text-green-700 mb-1">Placed</div>
              <div className="text-2xl font-bold text-green-900">{departmentStats[selectedDepartment].placed}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
              <div className="text-xs font-medium text-purple-700 mb-1">Placement %</div>
              <div className="text-2xl font-bold text-purple-900">{departmentStats[selectedDepartment].placementRate}%</div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <div className="text-xs font-medium text-blue-700 mb-1">Avg Package</div>
              <div className="text-2xl font-bold text-blue-900">₹{departmentStats[selectedDepartment].avgPackage}L</div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-xl border border-cyan-200">
              <div className="text-xs font-medium text-cyan-700 mb-1">Median</div>
              <div className="text-2xl font-bold text-cyan-900">₹{departmentStats[selectedDepartment].medianPackage}L</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
              <div className="text-xs font-medium text-amber-700 mb-1">Highest</div>
              <div className="text-2xl font-bold text-amber-900">₹{departmentStats[selectedDepartment].highestPackage}L</div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <div className="text-xs font-medium text-gray-700 mb-1">Lowest</div>
              <div className="text-2xl font-bold text-gray-900">₹{departmentStats[selectedDepartment].lowestPackage}L</div>
            </div>
          </div>
        )}

        {/* Interactive Chart */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
          <ResponsiveContainer width="100%" height={400}>
            {chartType === "trend" && selectedDepartment !== "All Departments" ? (
              <LineChart data={getFilteredChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
                <Line 
                  type="monotone" 
                  dataKey="placements" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', r: 6 }}
                  activeDot={{ r: 8 }}
                  name={selectedDepartment}
                />
              </LineChart>
            ) : (
              <BarChart data={getComparisonChartData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '14px', fontWeight: 600 }} />
                <Bar dataKey="CS" fill="#6366f1" name="Computer Science" />
                <Bar dataKey="IT" fill="#10b981" name="Information Technology" />
                <Bar dataKey="ECE" fill="#f59e0b" name="Electronics" />
                <Bar dataKey="Mech" fill="#ef4444" name="Mechanical" />
                <Bar dataKey="Civil" fill="#8b5cf6" name="Civil" />
                <Bar dataKey="Electrical" fill="#06b6d4" name="Electrical" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Cards below chart */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <ArrowTrendingUpIcon className="w-6 h-6 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-700">Placement Rate</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">87.5%</div>
            <div className="text-sm text-green-600 font-medium mt-2">↑ 5.2% from last year</div>
          </div>
          <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Average Package</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">₹6.2L</div>
            <div className="text-sm text-green-600 font-medium mt-2">↑ 12% from last year</div>
          </div>
          <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <BuildingOffice2Icon className="w-6 h-6 text-amber-600" />
              <span className="text-sm font-semibold text-gray-700">Active Recruiters</span>
            </div>
            <div className="text-4xl font-bold text-gray-900">45</div>
            <div className="text-sm text-green-600 font-medium mt-2">↑ 8 new this month</div>
          </div>
        </div>
      </div>

      {/* 4. RECENT ACTIVITIES */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Activity 🕒</h2>
          <button 
            onClick={() => setShowAllActivities(true)}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold transition-colors flex items-center gap-1"
          >
            View All →
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-3">
          {recentActivities.slice(0, 5).map((activity) => (
            <div
              key={activity.id}
              className="flex gap-3 p-3 hover:bg-indigo-50/50 rounded-xl transition-colors cursor-pointer border-l-4 border-transparent hover:border-indigo-500"
            >
              <div className={`flex-shrink-0 w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center`}>
                <activity.icon className={`w-4 h-4 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 truncate mt-0.5">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      {showAllActivities && <AllActivitiesModal />}
      {showAnalytics && <AnalyticsModal />}
    </div>
  );
}