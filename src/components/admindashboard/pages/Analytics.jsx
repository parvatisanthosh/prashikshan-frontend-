import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Building2, Briefcase, IndianRupee, Download, Calendar, Award, Target, Activity, BarChart3, PieChart as PieChartIcon, Filter, ChevronDown, FileText } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [loading, setLoading] = useState(false);
  
  // States for API data - will be fetched from backend later
  const [keyMetrics, setKeyMetrics] = useState(null);
  const [placementTrends, setPlacementTrends] = useState([]);
  const [companyDistribution, setCompanyDistribution] = useState([]);
  const [packageDistribution, setPackageDistribution] = useState([]);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);

  // Simulate API call - Replace with actual API calls later
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    
    // TODO: Replace with actual API calls
    // Example: const response = await fetch(`/api/analytics?range=${timeRange}`);
    // const data = await response.json();
    
    // Simulated data - will be replaced with API response
    setTimeout(() => {
      // Key Metrics
      setKeyMetrics({
        totalStudents: 180,
        studentsChange: 12,
        placementRate: 95,
        placementRateChange: 5.2,
        avgPackage: 8.5,
        avgPackageChange: 8,
        highestPackage: 28,
        highestPackageChange: 15,
        totalCompanies: 45,
        companiesChange: 8,
        activeOpenings: 28,
        openingsChange: 5
      });

      // Placement Trends
      setPlacementTrends([
        { month: 'Jan', placed: 45, target: 50 },
        { month: 'Feb', placed: 52, target: 55 },
        { month: 'Mar', placed: 58, target: 60 },
        { month: 'Apr', placed: 65, target: 68 },
        { month: 'May', placed: 78, target: 75 },
        { month: 'Jun', placed: 85, target: 80 }
      ]);

      // Company Type Distribution
      setCompanyDistribution([
        { name: 'IT Services', value: 35, color: '#6366f1' },
        { name: 'Product Based', value: 25, color: '#8b5cf6' },
        { name: 'Consulting', value: 20, color: '#ec4899' },
        { name: 'Startups', value: 15, color: '#f59e0b' },
        { name: 'Others', value: 5, color: '#10b981' }
      ]);

      // Package Distribution
      setPackageDistribution([
        { range: '0-5L', count: 25, percentage: 16 },
        { range: '5-8L', count: 45, percentage: 29 },
        { range: '8-12L', count: 58, percentage: 37 },
        { range: '12-15L', count: 20, percentage: 13 },
        { range: '15L+', count: 8, percentage: 5 }
      ]);

      // Department-wise Stats
      setDepartmentStats([
        { dept: 'Computer Science', students: 85, placed: 82, avgPackage: 9.2 },
        { dept: 'Electronics', students: 45, placed: 41, avgPackage: 7.8 },
        { dept: 'Mechanical', students: 35, placed: 30, avgPackage: 6.5 },
        { dept: 'Civil', students: 15, placed: 12, avgPackage: 5.8 }
      ]);

      // Top Companies
      setTopCompanies([
        { name: 'Tech Innovations Pvt Ltd', students: 28, package: 12.5, growth: 15 },
        { name: 'AI Robotics Corp', students: 24, package: 11.8, growth: 22 },
        { name: 'Digital Solutions Inc', students: 22, package: 10.2, growth: 8 },
        { name: 'CloudTech Systems', students: 18, package: 9.5, growth: 12 },
        { name: 'FinTech Solutions', students: 15, package: 8.8, growth: 5 }
      ]);

      // Monthly Growth
      setMonthlyGrowth([
        { month: 'Jan', companies: 8, openings: 12, applications: 145 },
        { month: 'Feb', companies: 10, openings: 15, applications: 178 },
        { month: 'Mar', companies: 12, openings: 18, applications: 205 },
        { month: 'Apr', companies: 15, openings: 22, applications: 245 },
        { month: 'May', companies: 18, openings: 28, applications: 298 },
        { month: 'Jun', companies: 20, openings: 32, applications: 342 }
      ]);

      setLoading(false);
    }, 500);
  };

  const exportReport = () => {
    // TODO: Implement export functionality
    // This will call backend API to generate and download report
    alert('Export functionality will be implemented with backend API');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Institute Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive placement and recruitment insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <button 
            onClick={exportReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Students</p>
            <Users className="text-blue-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{keyMetrics?.totalStudents}</p>
          <p className="text-xs text-green-600 mt-1">↑ {keyMetrics?.studentsChange}% from last period</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Placement %</p>
            <Award className="text-green-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{keyMetrics?.placementRate}%</p>
          <p className="text-xs text-green-600 mt-1">↑ {keyMetrics?.placementRateChange}% from last year</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Avg Package</p>
            <IndianRupee className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{keyMetrics?.avgPackage}L</p>
          <p className="text-xs text-green-600 mt-1">↑ {keyMetrics?.avgPackageChange}% from last year</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Highest</p>
            <Target className="text-orange-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">₹{keyMetrics?.highestPackage}L</p>
          <p className="text-xs text-green-600 mt-1">↑ {keyMetrics?.highestPackageChange}% improvement</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-pink-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Companies</p>
            <Building2 className="text-pink-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{keyMetrics?.totalCompanies}</p>
          <p className="text-xs text-green-600 mt-1">↑ {keyMetrics?.companiesChange} new this period</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-cyan-500">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Openings</p>
            <Briefcase className="text-cyan-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-800">{keyMetrics?.activeOpenings}</p>
          <p className="text-xs text-green-600 mt-1">↑ {keyMetrics?.openingsChange} added recently</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Placement Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Placement Trends</h3>
            <Activity className="text-indigo-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={placementTrends}>
              <defs>
                <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="placed" stroke="#6366f1" fillOpacity={1} fill="url(#colorPlaced)" name="Placed Students" />
              <Area type="monotone" dataKey="target" stroke="#10b981" fillOpacity={1} fill="url(#colorTarget)" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Company Type Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Company Type Distribution</h3>
            <PieChartIcon className="text-indigo-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={companyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
              >
                {companyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Package Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Package Distribution</h3>
            <BarChart3 className="text-indigo-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={packageDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Growth Metrics */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Growth Metrics</h3>
            <TrendingUp className="text-indigo-500" size={20} />
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="companies" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Companies" />
              <Line type="monotone" dataKey="openings" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Openings" />
              <Line type="monotone" dataKey="applications" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} name="Applications" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Stats and Top Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Department-wise Statistics */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Department-wise Statistics</h3>
          <div className="space-y-4">
            {departmentStats.map((dept, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">{dept.dept}</h4>
                  <span className="text-sm font-semibold text-indigo-600">
                    {((dept.placed / dept.students) * 100).toFixed(1)}% Placed
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{dept.placed} / {dept.students} Students</span>
                  <span>Avg: ₹{dept.avgPackage}L</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(dept.placed / dept.students) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Companies */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Companies</h3>
          <div className="space-y-4">
            {topCompanies.map((company, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{company.name}</p>
                    <p className="text-sm text-gray-500">{company.students} students placed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">₹{company.package}L</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    ↑ {company.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Applications</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
          </div>
          <p className="text-sm opacity-90">Across all companies this period</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Award size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Offers Received</p>
              <p className="text-2xl font-bold">892</p>
            </div>
          </div>
          <p className="text-sm opacity-90">71.5% conversion rate</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
              <Target size={24} />
            </div>
            <div>
              <p className="text-sm opacity-90">Placement Goal</p>
              <p className="text-2xl font-bold">98%</p>
            </div>
          </div>
          <p className="text-sm opacity-90">3% away from target</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;