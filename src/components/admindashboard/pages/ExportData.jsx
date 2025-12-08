import React, { useState, useEffect } from 'react';
import { Download, FileText, FileSpreadsheet, Calendar, Filter, Users, Building2, Briefcase, Award, Database, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import adminService from "../../../services/adminService";

const ExportDataPage = () => {
  const [selectedDataType, setSelectedDataType] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    department: '',
    status: '',
    company: ''
  });
  const [exportHistory, setExportHistory] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data export options - will fetch from backend
  const dataTypes = [
    {
      id: 'students',
      name: 'Student Data',
      icon: Users,
      description: 'Student profiles, academic records, and placement status',
      fields: ['Name', 'Roll No', 'Department', 'CGPA', 'Status', 'Contact']
    },
    {
      id: 'placements',
      name: 'Placement Records',
      icon: Award,
      description: 'Complete placement data with company and package details',
      fields: ['Student Name', 'Company', 'Package', 'Role', 'Location', 'Date']
    },
    {
      id: 'companies',
      name: 'Company Data',
      icon: Building2,
      description: 'Company profiles, partnerships, and recruitment history',
      fields: ['Company Name', 'Type', 'Contact', 'Openings', 'Students Hired']
    },
    {
      id: 'openings',
      name: 'Job Openings',
      icon: Briefcase,
      description: 'Active and past job openings with requirements',
      fields: ['Title', 'Company', 'Package', 'Location', 'Requirements', 'Status']
    },
    {
      id: 'applications',
      name: 'Applications',
      icon: FileText,
      description: 'Student applications and their current status',
      fields: ['Student', 'Company', 'Position', 'Status', 'Applied Date']
    },
    {
      id: 'analytics',
      name: 'Analytics Report',
      icon: Database,
      description: 'Comprehensive analytics with charts and statistics',
      fields: ['Metrics', 'Trends', 'Comparisons', 'Department Stats']
    }
  ];

  const exportFormats = [
    { id: 'excel', name: 'Excel (.xlsx)', icon: FileSpreadsheet, description: 'Recommended for data analysis' },
    { id: 'csv', name: 'CSV (.csv)', icon: FileText, description: 'Universal format, easy to import' },
    { id: 'pdf', name: 'PDF (.pdf)', icon: FileText, description: 'For reports and presentations' }
  ];

  // Fetch export history on mount
  useEffect(() => {
    fetchExportHistory();
  }, []);

  const fetchExportHistory = async () => {
    setLoading(true);
    try {
      const response = await adminService.getExportHistory({ limit: 10 });
      const history = (response.exports || []).map(exp => ({
        id: exp.id,
        type: exp.type || exp.dataType || 'Unknown',
        format: exp.format || 'CSV',
        date: exp.createdAt ? new Date(exp.createdAt).toLocaleString() : 'Unknown',
        records: exp.recordsCount || 0,
        status: exp.status || 'completed'
      }));
      setExportHistory(history);
    } catch (error) {
      console.error('Error fetching export history:', error);
      // Set default empty history on error
      setExportHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!selectedDataType || !selectedFormat) {
      alert('Please select data type and format');
      return;
    }

    setIsExporting(true);

    try {
      // Call backend API to export data
      const params = {
        format: selectedFormat,
        startDate: dateRange === 'custom' ? customStartDate : undefined,
        endDate: dateRange === 'custom' ? customEndDate : undefined,
        ...selectedFilters
      };

      const response = await adminService.exportData(selectedDataType, params);

      if (response.success) {
        // If CSV/Excel, download the file
        if (response.data && (selectedFormat === 'csv' || selectedFormat === 'excel')) {
          adminService.downloadExportFile(response.data, response.filename);
        }
        
        alert(`Export completed! ${selectedDataType} has been downloaded as ${selectedFormat.toUpperCase()}`);
        
        // Refresh export history
        await fetchExportHistory();
        
        // Reset form
        setSelectedDataType('');
        setSelectedFormat('');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      alert(error.message || 'Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Export Data</h1>
        <p className="text-gray-500 mt-1">Download and export institute data in various formats</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Export Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Data Type */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Database size={20} className="text-indigo-600" />
              Select Data Type
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedDataType(type.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDataType === type.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedDataType === type.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-1">{type.name}</h4>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                    {selectedDataType === type.id && (
                      <div className="mt-3 pt-3 border-t border-indigo-200">
                        <p className="text-xs text-gray-600 mb-1">Included fields:</p>
                        <div className="flex flex-wrap gap-1">
                          {type.fields.slice(0, 3).map((field, idx) => (
                            <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              {field}
                            </span>
                          ))}
                          {type.fields.length > 3 && (
                            <span className="text-xs text-gray-500">+{type.fields.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Select Format */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-indigo-600" />
              Select Export Format
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {exportFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedFormat === format.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={32} className={`mx-auto mb-2 ${
                      selectedFormat === format.id ? 'text-indigo-600' : 'text-gray-400'
                    }`} />
                    <h4 className="font-semibold text-gray-800 text-center mb-1">{format.name}</h4>
                    <p className="text-xs text-gray-500 text-center">{format.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Filter size={20} className="text-indigo-600" />
              Filters & Options
            </h3>
            
            {/* Date Range */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <select 
                  value={selectedFilters.department}
                  onChange={(e) => setSelectedFilters({...selectedFilters, department: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Departments</option>
                  <option value="cs">Computer Science</option>
                  <option value="ec">Electronics</option>
                  <option value="me">Mechanical</option>
                  <option value="ce">Civil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select 
                  value={selectedFilters.status}
                  onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="placed">Placed</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <select 
                  value={selectedFilters.company}
                  onChange={(e) => setSelectedFilters({...selectedFilters, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Companies</option>
                  <option value="tech">Tech Innovations</option>
                  <option value="digital">Digital Solutions</option>
                  <option value="cloud">CloudTech Systems</option>
                  <option value="ai">AI Robotics Corp</option>
                </select>
              </div>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={!selectedDataType || !selectedFormat || isExporting}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-3 ${
              !selectedDataType || !selectedFormat || isExporting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isExporting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download size={20} />
                <span>Export Data</span>
              </>
            )}
          </button>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Students</span>
                <span className="font-semibold text-gray-800">180</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Companies</span>
                <span className="font-semibold text-gray-800">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Placements</span>
                <span className="font-semibold text-gray-800">156</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Openings</span>
                <span className="font-semibold text-gray-800">28</span>
              </div>
            </div>
          </div>

          {/* Export History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock size={20} className="text-indigo-600" />
              Recent Exports
            </h3>
            <div className="space-y-3">
              {(exportHistory.length > 0 ? exportHistory : recentExports).slice(0, 5).map((exp) => (
                <div key={exp.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{exp.type}</p>
                      <p className="text-xs text-gray-500">{exp.date}</p>
                    </div>
                    <CheckCircle size={16} className="text-green-500 mt-0.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{exp.records} records</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{exp.format}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Export Tips</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• Excel format preserves data types and formulas</li>
                  <li>• CSV is best for importing into other systems</li>
                  <li>• PDF is ideal for reports and presentations</li>
                  <li>• Use filters to export specific data subsets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDataPage;