// src/pages/company/Overview.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import {
  Briefcase,
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  Bell,
  Calendar,
  MapPin,
  DollarSign,
  UserCheck,
  UserX,
  Award,
  ChevronRight,
  MoreVertical,
  Trash2,
  Edit,
  Pause,
  Play,
  Search,
  RefreshCw,
  FileText,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';

const Overview = () => {
  const navigate = useNavigate();
  const {
    activeOpenings,
    applicants,
    selectedStudents,
    rejectedStudents,
    recruitedStudents,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteOpening,
    toggleOpeningStatus,
    recentActivity,
    getUnreadCount
  } = useCompany();

  const [showAllOpenings, setShowAllOpenings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOpeningMenu, setShowOpeningMenu] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const totalApplicants = applicants?.length || 0;
  const totalSelected = selectedStudents?.length || 0;
  const totalRejected = rejectedStudents?.length || 0;
  const totalRecruited = recruitedStudents?.length || 0;
  const totalActiveOpenings = activeOpenings?.filter(o => o.status === 'active').length || 0;

  const stats = [
    {
      id: 'openings',
      title: 'Active Openings',
      value: totalActiveOpenings,
      change: '+2 this week',
      changeType: 'positive',
      icon: Briefcase,
      lightBg: 'bg-blue-50',
      textColor: 'text-blue-600',
      onClick: () => navigate('/company/create-opening')
    },
    {
      id: 'applicants',
      title: 'Total Applicants',
      value: totalApplicants,
      change: `+${Math.min(totalApplicants, 5)} this week`,
      changeType: 'positive',
      icon: Users,
      lightBg: 'bg-purple-50',
      textColor: 'text-purple-600',
      onClick: () => navigate('/company/applicants')
    },
    {
      id: 'selected',
      title: 'Students Selected',
      value: totalSelected,
      change: `+${totalSelected} this week`,
      changeType: 'positive',
      icon: CheckCircle,
      lightBg: 'bg-green-50',
      textColor: 'text-green-600',
      onClick: () => navigate('/company/selected-students')
    },
    {
      id: 'rejected',
      title: 'Students Rejected',
      value: totalRejected,
      change: `${totalRejected} this week`,
      changeType: 'neutral',
      icon: XCircle,
      lightBg: 'bg-red-50',
      textColor: 'text-red-600',
      onClick: () => navigate('/company/rejected-students')
    },
    {
      id: 'recruited',
      title: 'Students Recruited',
      value: totalRecruited,
      change: `+${totalRecruited} total`,
      changeType: 'positive',
      icon: Award,
      lightBg: 'bg-amber-50',
      textColor: 'text-amber-600',
      onClick: () => navigate('/company/analytics')
    }
  ];

  const filteredOpenings =
    activeOpenings?.filter(opening => {
      const matchesStatus = filterStatus === 'all' || opening.status === filterStatus;
      const matchesSearch =
        opening.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opening.department?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    }) || [];

  const displayedOpenings = showAllOpenings ? filteredOpenings : filteredOpenings.slice(0, 4);

  const handleDeleteOpening = openingId => {
    if (window.confirm('Are you sure you want to delete this opening?')) {
      deleteOpening(openingId);
    }
    setShowOpeningMenu(null);
  };

  const handleToggleStatus = openingId => {
    toggleOpeningStatus(openingId);
    setShowOpeningMenu(null);
  };

  const handleViewApplicants = openingId => {
    navigate(`/company/applicants?opening=${openingId}`);
  };

  const handleNotificationClick = notification => {
    markNotificationAsRead(notification.id);
    switch (notification.type) {
      case 'application':
        navigate(`/company/student/${notification.referenceId}`);
        break;
      case 'message':
        navigate(`/company/chat?student=${notification.referenceId}`);
        break;
      case 'selected':
        navigate('/company/selected-students');
        break;
      case 'rejected':
        navigate('/company/rejected-students');
        break;
      default:
        break;
    }
    setShowNotifications(false);
  };

  const recentApplicants = applicants?.slice(0, 5) || [];
  const unreadCount = getUnreadCount ? getUnreadCount() : 0;

  return (
    <div className="px-3 py-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Welcome back! Here's what's happening with your recruitment.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap justify-end">
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div
                  className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 max-h-[70vh] overflow-hidden"
                >
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
                    <div>
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">{unreadCount} unread</p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="overflow-y-auto max-h-[60vh]">
                    {notifications && notifications.length > 0 ? (
                      notifications.slice(0, 10).map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-full ${
                                notification.type === 'application'
                                  ? 'bg-blue-100 text-blue-600'
                                  : notification.type === 'interview'
                                  ? 'bg-purple-100 text-purple-600'
                                  : notification.type === 'message'
                                  ? 'bg-green-100 text-green-600'
                                  : notification.type === 'selected'
                                  ? 'bg-emerald-100 text-emerald-600'
                                  : notification.type === 'rejected'
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {notification.type === 'application' && (
                                <FileText className="w-4 h-4" />
                              )}
                              {notification.type === 'interview' && (
                                <Calendar className="w-4 h-4" />
                              )}
                              {notification.type === 'message' && (
                                <MessageSquare className="w-4 h-4" />
                              )}
                              {notification.type === 'selected' && (
                                <UserCheck className="w-4 h-4" />
                              )}
                              {notification.type === 'rejected' && (
                                <UserX className="w-4 h-4" />
                              )}
                              {notification.type === 'job' && (
                                <Briefcase className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm ${
                                  !notification.read
                                    ? 'font-semibold text-gray-900'
                                    : 'text-gray-700'
                                }`}
                              >
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => navigate('/company/create-opening')}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/25"
          >
            <Briefcase className="w-4 h-4" />
            <span className="font-medium text-sm sm:text-base">Post New Job</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              onClick={stat.onClick}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.lightBg} group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-[11px] sm:text-xs font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : stat.changeType === 'negative'
                      ? 'text-red-600'
                      : 'text-gray-500'
                  }`}
                >
                  {stat.changeType === 'positive' && (
                    <ArrowUpRight className="w-3 h-3" />
                  )}
                  {stat.changeType === 'negative' && (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <div className="mt-3 flex items-center text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
                <span>View details</span>
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Openings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-4 sm:p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Active Job Openings
                </h2>
                <p className="text-sm text-gray-500">
                  Manage your published positions ({filteredOpenings.length} total)
                </p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search openings..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-48"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-auto"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {displayedOpenings.length > 0 ? (
              <div className="space-y-4">
                {displayedOpenings.map(opening => (
                  <div
                    key={opening.id}
                    className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div
                          className={`p-3 rounded-xl ${
                            opening.status === 'active'
                              ? 'bg-green-100'
                              : opening.status === 'paused'
                              ? 'bg-yellow-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          <Briefcase
                            className={`w-5 h-5 ${
                              opening.status === 'active'
                                ? 'text-green-600'
                                : opening.status === 'paused'
                                ? 'text-yellow-600'
                                : 'text-gray-600'
                            }`}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                              {opening.title}
                            </h3>
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                opening.status === 'active'
                                  ? 'bg-green-100 text-green-700'
                                  : opening.status === 'paused'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {opening.status === 'active'
                                ? 'Published'
                                : opening.status === 'paused'
                                ? 'Paused'
                                : 'Closed'}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {opening.department || 'Engineering'}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {opening.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {opening.stipend || opening.salary}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {opening.duration || opening.type}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs sm:text-sm">
                            <span className="flex items-center gap-1 text-gray-600">
                              <Users className="w-4 h-4 text-blue-500" />
                              {opening.applicants || 0} applicants
                            </span>
                            <span className="flex items-center gap-1 text-gray-600">
                              <Eye className="w-4 h-4 text-purple-500" />
                              {opening.views || 0} views
                            </span>
                            <span className="text-gray-400">
                              Posted {opening.postedDate}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:self-start md:flex-shrink-0 mt-2 md:mt-0">
                        <button
                          onClick={() => handleViewApplicants(opening.id)}
                          className="px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          View Applicants
                        </button>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setShowOpeningMenu(
                                showOpeningMenu === opening.id ? null : opening.id
                              )
                            }
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {showOpeningMenu === opening.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowOpeningMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-44 sm:w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
                                <button
                                  onClick={() =>
                                    navigate(
                                      `/company/create-opening?edit=${opening.id}`
                                    )
                                  }
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit Opening
                                </button>
                                <button
                                  onClick={() => handleToggleStatus(opening.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  {opening.status === 'active' ? (
                                    <>
                                      <Pause className="w-4 h-4" />
                                      Pause Opening
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4" />
                                      Activate Opening
                                    </>
                                  )}
                                </button>
                                <hr className="my-1" />
                                <button
                                  onClick={() => handleDeleteOpening(opening.id)}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Opening
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No openings found
                </h3>
                <p className="text-gray-500 mb-4 text-sm sm:text-base">
                  {searchQuery || filterStatus !== 'all'
                    ? 'Try adjusting your search or filter'
                    : 'Create your first job opening to start recruiting'}
                </p>
                <button
                  onClick={() => navigate('/company/create-opening')}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  Post New Job
                </button>
              </div>
            )}

            {filteredOpenings.length > 4 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowAllOpenings(!showAllOpenings)}
                  className="w-full py-2 text-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  {showAllOpenings
                    ? 'Show Less'
                    : `View All ${filteredOpenings.length} Openings`}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Recent Applicants */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Applicants
                </h2>
                <p className="text-sm text-gray-500">Latest applications</p>
              </div>
              <button
                onClick={() => navigate('/company/applicants')}
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </button>
            </div>

            <div className="p-3 sm:p-4">
              {recentApplicants.length > 0 ? (
                <div className="space-y-3">
                  {recentApplicants.map(applicant => (
                    <div
                      key={applicant.id}
                      onClick={() => navigate(`/company/student/${applicant.id}`)}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                    >
                      <div className="relative">
                        {applicant.avatar ? (
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                            {applicant.name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            applicant.status === 'active'
                              ? 'bg-blue-500'
                              : applicant.status === 'selected'
                              ? 'bg-green-500'
                              : applicant.status === 'recruited'
                              ? 'bg-amber-500'
                              : applicant.status === 'rejected'
                              ? 'bg-red-500'
                              : 'bg-gray-400'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {applicant.name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {applicant.position}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400">
                        {applicant.appliedDate}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No applicants yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/company/create-opening')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-left transition-colors group"
              >
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Post New Job</h4>
                  <p className="text-sm text-gray-500">Create a job opening</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/company/applicants')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 text-left transition-colors group"
              >
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Review Applicants</h4>
                  <p className="text-sm text-gray-500">Manage applications</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/company/chat')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 text-left transition-colors group"
              >
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Messages</h4>
                  <p className="text-sm text-gray-500">Chat with candidates</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/company/analytics')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-amber-50 text-left transition-colors group"
              >
                <div className="p-2 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">View Analytics</h4>
                  <p className="text-sm text-gray-500">Track performance</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 sm:p-5 border-b border-gray-100">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="p-3 sm:p-4">
              {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          activity.type === 'application'
                            ? 'bg-blue-100 text-blue-600'
                            : activity.type === 'interview'
                            ? 'bg-purple-100 text-purple-600'
                            : activity.type === 'selected'
                            ? 'bg-green-100 text-green-600'
                            : activity.type === 'rejected'
                            ? 'bg-red-100 text-red-600'
                            : activity.type === 'message'
                            ? 'bg-amber-100 text-amber-600'
                            : activity.type === 'job'
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {activity.type === 'application' && (
                          <FileText className="w-4 h-4" />
                        )}
                        {activity.type === 'interview' && (
                          <Calendar className="w-4 h-4" />
                        )}
                        {activity.type === 'selected' && (
                          <UserCheck className="w-4 h-4" />
                        )}
                        {activity.type === 'rejected' && (
                          <UserX className="w-4 h-4" />
                        )}
                        {activity.type === 'message' && (
                          <MessageSquare className="w-4 h-4" />
                        )}
                        {activity.type === 'job' && (
                          <Briefcase className="w-4 h-4" />
                        )}
                        {!['application', 'interview', 'selected', 'rejected', 'message', 'job'].includes(
                          activity.type
                        ) && <Activity className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => navigate('/company/selected-students')}
          className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 sm:p-6 text-white cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-2">{totalSelected}</h3>
          <p className="text-green-100 mb-4 text-sm sm:text-base">
            Students Selected
          </p>
          <div className="flex items-center text-sm text-green-100 group-hover:text-white transition-colors">
            <span>View all selected</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => navigate('/company/rejected-students')}
          className="bg-gradient-to-br from-red-500 to-rose-600 rounded-xl p-5 sm:p-6 text-white cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <UserX className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
              This Month
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-2">{totalRejected}</h3>
          <p className="text-red-100 mb-4 text-sm sm:text-base">
            Students Rejected
          </p>
          <div className="flex items-center text-sm text-red-100 group-hover:text-white transition-colors">
            <span>View all rejected</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => navigate('/company/analytics')}
          className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 sm:p-6 text-white cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm bg-white/20 px-3 py-1 rounded-full">
              Total
            </span>
          </div>
          <h3 className="text-3xl sm:text-4xl font-bold mb-2">{totalRecruited}</h3>
          <p className="text-amber-100 mb-4 text-sm sm:text-base">
            Students Recruited
          </p>
          <div className="flex items-center text-sm text-amber-100 group-hover:text-white transition-colors">
            <span>View analytics</span>
            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;