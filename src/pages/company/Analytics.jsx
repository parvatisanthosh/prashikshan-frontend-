// src/pages/company/Analytics.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import {
  Award,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Star,
  Building,
  FileText,
  RefreshCw,
  MoreVertical,
  UserCheck,
  UserX,
  UserPlus
} from 'lucide-react';

const Analytics = () => {
  const navigate = useNavigate();
  const {
    recruitedStudents,
    selectedStudents,
    rejectedStudents,
    applicants,
    activeOpenings
  } = useCompany();

  // State for active tab/section
  const [activeSection, setActiveSection] = useState('overview'); // 'overview', 'recruited', 'selected', 'rejected'
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [expandedCard, setExpandedCard] = useState(null);

  // Calculate stats
  const totalApplicants = applicants?.length || 0;
  const totalRecruited = recruitedStudents?.length || 0;
  const totalSelected = selectedStudents?.length || 0;
  const totalRejected = rejectedStudents?.length || 0;

  // Conversion rate
  const conversionRate = totalApplicants > 0 
    ? ((totalRecruited / totalApplicants) * 100).toFixed(1) 
    : 0;

  // Selection rate
  const selectionRate = totalApplicants > 0 
    ? ((totalSelected / totalApplicants) * 100).toFixed(1) 
    : 0;

  // Filter students based on search
  const filterStudents = (students) => {
    if (!students) return [];
    return students.filter(student => {
      const matchesSearch = 
        student.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.position?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredRecruited = filterStudents(recruitedStudents);
  const filteredSelected = filterStudents(selectedStudents);
  const filteredRejected = filterStudents(rejectedStudents);

  // Main stat cards
  const mainStats = [
    {
      id: 'recruited',
      title: 'Students Recruited',
      value: totalRecruited,
      icon: Award,
      color: 'amber',
      bgGradient: 'from-amber-500 to-orange-600',
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-200',
      change: '+2 this month',
      changeType: 'positive',
      description: 'Successfully hired candidates',
      onClick: () => setActiveSection('recruited')
    },
    {
      id: 'selected',
      title: 'Students Selected',
      value: totalSelected,
      icon: CheckCircle,
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-600',
      lightBg: 'bg-green-50',
      textColor: 'text-green-600',
      borderColor: 'border-green-200',
      change: '+5 this week',
      changeType: 'positive',
      description: 'Candidates cleared all rounds',
      onClick: () => setActiveSection('selected')
    },
    {
      id: 'rejected',
      title: 'Students Rejected',
      value: totalRejected,
      icon: XCircle,
      color: 'red',
      bgGradient: 'from-red-500 to-rose-600',
      lightBg: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-200',
      change: '3 this week',
      changeType: 'neutral',
      description: 'Candidates not selected',
      onClick: () => setActiveSection('rejected')
    }
  ];

  // Additional stats
  const additionalStats = [
    {
      title: 'Total Applicants',
      value: totalApplicants,
      icon: Users,
      color: 'blue',
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Active Openings',
      value: activeOpenings?.filter(o => o.status === 'active').length || 0,
      icon: Briefcase,
      color: 'purple',
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      icon: Target,
      color: 'indigo',
      lightBg: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Selection Rate',
      value: `${selectionRate}%`,
      icon: TrendingUp,
      color: 'cyan',
      lightBg: 'bg-cyan-50',
      textColor: 'text-cyan-600'
    }
  ];

  // Student Card Component
  const StudentCard = ({ student, type }) => {
    const getStatusColor = () => {
      switch (type) {
        case 'recruited':
          return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'selected':
          return 'bg-green-100 text-green-700 border-green-200';
        case 'rejected':
          return 'bg-red-100 text-red-700 border-red-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    };

    const getStatusIcon = () => {
      switch (type) {
        case 'recruited':
          return <Award className="w-3.5 h-3.5" />;
        case 'selected':
          return <CheckCircle className="w-3.5 h-3.5" />;
        case 'rejected':
          return <XCircle className="w-3.5 h-3.5" />;
        default:
          return null;
      }
    };

    const getStatusText = () => {
      switch (type) {
        case 'recruited':
          return 'Recruited';
        case 'selected':
          return 'Selected';
        case 'rejected':
          return 'Rejected';
        default:
          return '';
      }
    };

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg hover:border-gray-200 transition-all group">
        <div className="flex items-start gap-4">
          {/* Avatar - Clickable */}
          <div
            onClick={() => navigate(`/company/student/${student.id}`)}
            className="cursor-pointer relative"
          >
            {student.avatar ? (
              <img
                src={student.avatar}
                alt={student.name}
                className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all"
              />
            ) : (
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${
                type === 'recruited' ? 'from-amber-500 to-orange-600' :
                type === 'selected' ? 'from-green-500 to-emerald-600' :
                'from-red-500 to-rose-600'
              } flex items-center justify-center text-white text-lg font-semibold ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all`}>
                {student.name?.charAt(0) || 'U'}
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                {/* Name - Clickable */}
                <h3
                  onClick={() => navigate(`/company/student/${student.id}`)}
                  className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors flex items-center gap-2"
                >
                  {student.name}
                  <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-sm text-blue-600 font-medium">{student.position}</p>
              </div>
              
              {/* Status Badge */}
              <span className={`px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1 border ${getStatusColor()}`}>
                {getStatusIcon()}
                {getStatusText()}
              </span>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {student.email}
              </span>
              {student.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  {student.phone}
                </span>
              )}
            </div>

            {/* Additional Info */}
            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
              {student.department && (
                <span className="flex items-center gap-1">
                  <Building className="w-3.5 h-3.5" />
                  {student.department}
                </span>
              )}
              {student.education && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {student.education}
                </span>
              )}
              {type === 'recruited' && student.recruitedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Recruited: {student.recruitedDate}
                </span>
              )}
              {type === 'selected' && student.selectedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Selected: {student.selectedDate}
                </span>
              )}
              {type === 'rejected' && student.rejectedDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Rejected: {student.rejectedDate}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => navigate(`/company/student/${student.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                View Profile
              </button>
              <button
                onClick={() => navigate(`/company/chat?student=${student.id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="w-3.5 h-3.5" />
                Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Student List Section Component
  const StudentListSection = ({ title, students, type, icon: Icon, emptyMessage, bgColor, textColor }) => {
    if (students.length === 0) {
      return (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No {title}</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className={`w-5 h-5 ${textColor}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">{students.length} students</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (type === 'recruited') navigate('/company/recruited-students');
              else if (type === 'selected') navigate('/company/selected-students');
              else if (type === 'rejected') navigate('/company/rejected-students');
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {students.slice(0, 6).map((student) => (
            <StudentCard key={student.id} student={student} type={type} />
          ))}
        </div>

        {/* Show More Button */}
        {students.length > 6 && (
          <div className="text-center pt-4">
            <button
              onClick={() => {
                if (type === 'recruited') navigate('/company/recruited-students');
                else if (type === 'selected') navigate('/company/selected-students');
                else if (type === 'rejected') navigate('/company/rejected-students');
              }}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              View All {students.length} Students
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Recruitment Analytics</h1>
          <p className="text-gray-500 mt-1">Track your recruitment performance and student status</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors border border-gray-200"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Main Stats Cards - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mainStats.map((stat) => {
          const Icon = stat.icon;
          const isActive = activeSection === stat.id;
          
          return (
            <div
              key={stat.id}
              onClick={stat.onClick}
              className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-xl ${
                isActive 
                  ? `bg-gradient-to-br ${stat.bgGradient} text-white shadow-lg` 
                  : 'bg-white border-2 border-gray-100 hover:border-gray-200'
              }`}
            >
              {/* Background Pattern */}
              <div className={`absolute top-0 right-0 w-32 h-32 ${isActive ? 'opacity-20' : 'opacity-5'}`}>
                <Icon className="w-full h-full" />
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-white/20' : stat.lightBg}`}>
                    <Icon className={`w-6 h-6 ${isActive ? 'text-white' : stat.textColor}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isActive ? 'text-white/80' :
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-500'
                  }`}>
                    {stat.changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
                    {stat.changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
                    {stat.change}
                  </div>
                </div>

                <h3 className={`text-4xl font-bold mb-2 ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </h3>
                <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                  {stat.title}
                </p>
                <p className={`text-sm mt-1 ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                  {stat.description}
                </p>

                <div className={`mt-4 pt-4 border-t ${isActive ? 'border-white/20' : 'border-gray-100'} flex items-center justify-between`}>
                  <span className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    Click to view details
                  </span>
                  <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {additionalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.lightBg}`}>
                  <Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-100 p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('overview')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeSection === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveSection('recruited')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeSection === 'recruited'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Award className="w-4 h-4" />
              Recruited ({totalRecruited})
            </div>
          </button>
          <button
            onClick={() => setActiveSection('selected')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeSection === 'selected'
                ? 'bg-green-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Selected ({totalSelected})
            </div>
          </button>
          <button
            onClick={() => setActiveSection('rejected')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
              activeSection === 'rejected'
                ? 'bg-red-500 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({totalRejected})
            </div>
          </button>
        </div>
      </div>

      {/* Search Bar - Show when viewing specific section */}
      {activeSection !== 'overview' && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      )}

      {/* Content Based on Active Section */}
      {activeSection === 'overview' && (
        <div className="space-y-8">
          {/* Recruited Students Preview */}
          {totalRecruited > 0 && (
            <StudentListSection
              title="Recently Recruited"
              students={filteredRecruited}
              type="recruited"
              icon={Award}
              emptyMessage="No students have been recruited yet"
              bgColor="bg-amber-100"
              textColor="text-amber-600"
            />
          )}

          {/* Selected Students Preview */}
          {totalSelected > 0 && (
            <StudentListSection
              title="Recently Selected"
              students={filteredSelected}
              type="selected"
              icon={CheckCircle}
              emptyMessage="No students have been selected yet"
              bgColor="bg-green-100"
              textColor="text-green-600"
            />
          )}

          {/* Rejected Students Preview */}
          {totalRejected > 0 && (
            <StudentListSection
              title="Recently Rejected"
              students={filteredRejected}
              type="rejected"
              icon={XCircle}
              emptyMessage="No students have been rejected"
              bgColor="bg-red-100"
              textColor="text-red-600"
            />
          )}

          {/* Empty State */}
          {totalRecruited === 0 && totalSelected === 0 && totalRejected === 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Yet</h3>
              <p className="text-gray-500 mb-6">Start reviewing applicants to see analytics data here</p>
              <button
                onClick={() => navigate('/company/applicants')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Applicants
              </button>
            </div>
          )}
        </div>
      )}

      {activeSection === 'recruited' && (
        <StudentListSection
          title="Recruited Students"
          students={filteredRecruited}
          type="recruited"
          icon={Award}
          emptyMessage="No students have been recruited yet. Start the recruitment process from the applicants page."
          bgColor="bg-amber-100"
          textColor="text-amber-600"
        />
      )}

      {activeSection === 'selected' && (
        <StudentListSection
          title="Selected Students"
          students={filteredSelected}
          type="selected"
          icon={CheckCircle}
          emptyMessage="No students have been selected yet. Review applicants and select candidates."
          bgColor="bg-green-100"
          textColor="text-green-600"
        />
      )}

      {activeSection === 'rejected' && (
        <StudentListSection
          title="Rejected Students"
          students={filteredRejected}
          type="rejected"
          icon={XCircle}
          emptyMessage="No students have been rejected. All rejected candidates will appear here."
          bgColor="bg-red-100"
          textColor="text-red-600"
        />
      )}

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recruited Card */}
        <div
          onClick={() => navigate('/company/recruited-students')}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              View All →
            </span>
          </div>
          <h3 className="text-5xl font-bold mb-2">{totalRecruited}</h3>
          <p className="text-amber-100 text-lg">Students Recruited</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-amber-100">
              <TrendingUp className="w-4 h-4" />
              <span>Click to view all recruited students</span>
            </div>
          </div>
        </div>

        {/* Selected Card */}
        <div
          onClick={() => navigate('/company/selected-students')}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              View All →
            </span>
          </div>
          <h3 className="text-5xl font-bold mb-2">{totalSelected}</h3>
          <p className="text-green-100 text-lg">Students Selected</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-green-100">
              <UserCheck className="w-4 h-4" />
              <span>Click to view all selected students</span>
            </div>
          </div>
        </div>

        {/* Rejected Card */}
        <div
          onClick={() => navigate('/company/rejected-students')}
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-6 text-white cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="p-3 bg-white/20 rounded-xl">
              <XCircle className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
              View All →
            </span>
          </div>
          <h3 className="text-5xl font-bold mb-2">{totalRejected}</h3>
          <p className="text-red-100 text-lg">Students Rejected</p>
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-red-100">
              <UserX className="w-4 h-4" />
              <span>Click to view all rejected students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;