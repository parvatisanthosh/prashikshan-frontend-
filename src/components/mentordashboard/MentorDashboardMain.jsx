import React, { useState, useEffect } from 'react';
import { 
    ClockIcon, 
    CalendarDaysIcon, 
    UserGroupIcon, 
    BellIcon, 
    ChatBubbleLeftRightIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/solid';

// Import feature components
import SetAvailability from './SetAvailability';
import BookingCalendar from './BookingCalendar';
import AssignedStudents from './AssignedStudents';
import Notifications from './Notifications';
import ChatMentorStudents from './ChatMentorStudents';

// Import API service from centralized services
import mentorService from '../../services/mentorService';

// Placeholder for features under construction
const MissingTabUI = ({ tabName }) => (
    <div className="p-10 max-w-7xl mx-auto space-y-8 text-center bg-white rounded-xl shadow-lg mt-8">
        <h2 className="text-3xl font-bold text-blue-600">Module Under Construction</h2>
        <p className="text-xl text-slate-600">The **{tabName}** module is being built!</p>
        <p className="text-sm text-slate-500">Coming soon with full functionality.</p>
    </div>
);

// -------------------- OVERVIEW UI (Default Dashboard) --------------------
function OverviewUI() {
    const [stats, setStats] = useState({ totalStudents: 0, upcomingSessions: 0, pendingRequests: 0, monthlyHours: 0 });
    const [upcomingSessions, setUpcomingSessions] = useState([]);
    const [assignedStudents, setAssignedStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDashboardData() {
            setLoading(true);
            try {
                const [statsData, sessionsData, studentsData] = await Promise.all([
                    mentorService.getDashboardStats(),
                    mentorService.getUpcomingSessions(),
                    mentorService.getAssignedStudents()
                ]);
                
                setStats(statsData);
                setUpcomingSessions(sessionsData);
                setAssignedStudents(studentsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Mentor Dashboard</h2>
                <p className="text-slate-500 mt-1">Welcome back! Here's your mentorship overview for today.</p>
            </div>

            {/* SECTION A: STATS CARDS */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <UserGroupIcon className="h-8 w-8 opacity-80" />
                        <span className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Students</span>
                    </div>
                    <h3 className="text-4xl font-extrabold mb-1">{stats.totalStudents}</h3>
                    <p className="text-blue-100 text-sm">Assigned Students</p>
                </div>

                {/* Upcoming Sessions */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <CalendarDaysIcon className="h-8 w-8 opacity-80" />
                        <span className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Today</span>
                    </div>
                    <h3 className="text-4xl font-extrabold mb-1">{stats.upcomingSessions}</h3>
                    <p className="text-blue-100 text-sm">Sessions Scheduled</p>
                </div>

                {/* Pending Requests */}
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <BellIcon className="h-8 w-8 opacity-80" />
                        <span className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <h3 className="text-4xl font-extrabold mb-1">{stats.pendingRequests}</h3>
                    <p className="text-amber-100 text-sm">Booking Requests</p>
                </div>

                {/* Hours This Month */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <ClockIcon className="h-8 w-8 opacity-80" />
                        <span className="text-xs font-bold uppercase bg-white/20 px-2 py-1 rounded-full">Hours</span>
                    </div>
                    <h3 className="text-4xl font-extrabold mb-1">{stats.monthlyHours}</h3>
                    <p className="text-green-100 text-sm">Mentoring Hours</p>
                </div>
            </section>

            {/* SECTION B: UPCOMING SESSIONS */}
            <section className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming Sessions List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-800">Upcoming Sessions</h3>
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">View All →</button>
                    </div>

                    <div className="space-y-4">
                        {upcomingSessions.map((session) => (
                            <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                        {session.student.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">{session.student}</p>
                                        <p className="text-sm text-slate-500">{session.topic}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-slate-700">{session.time}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${session.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {session.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions Card */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg font-medium transition flex items-center justify-between">
                            <span>Set Availability</span>
                            <ClockIcon className="h-5 w-5" />
                        </button>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg font-medium transition flex items-center justify-between">
                            <span>View Calendar</span>
                            <CalendarDaysIcon className="h-5 w-5" />
                        </button>
                        <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 px-4 rounded-lg font-medium transition flex items-center justify-between">
                            <span>Message Students</span>
                            <ChatBubbleLeftRightIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </section>

            {/* SECTION C: ASSIGNED STUDENTS PREVIEW */}
            <section className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-800">Assigned Students</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-semibold">View All →</button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {assignedStudents.map((student) => (
                        <div key={student.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm text-slate-800">{student.name}</p>
                                    <p className="text-xs text-slate-500">{student.course}</p>
                                </div>
                            </div>
                            <div className="mb-2">
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-slate-600">Progress</span>
                                    <span className="font-bold text-blue-600">{student.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                                </div>
                            </div>
                            <p className="text-xs text-slate-400">Last contact: {student.lastContact}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// -------------------- MAIN ROUTER --------------------
export default function MentorDashboardMain({ activeTab }) {
    switch (activeTab) {
        case "Dashboard":
            return <OverviewUI />;
        
        case "Set Availability":
            return <SetAvailability />;
        
        case "Booking Calendar":
            return <BookingCalendar />;
        
        case "Assigned Students":
            return <AssignedStudents />;
        
        case "Notifications":
            return <Notifications />;
        
        case "Chat Mentor Students":
            return <ChatMentorStudents />;
        
        default:
            return <MissingTabUI tabName={activeTab} />;
    }
}

