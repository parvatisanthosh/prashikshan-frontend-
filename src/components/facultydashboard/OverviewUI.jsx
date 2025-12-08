import React, { useState, useEffect } from "react";
import {
    ClipboardDocumentCheckIcon,
    UsersIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/solid";
import facultyService from "../../services/Facultyservice";

export default function OverviewUI() {
    const [stats, setStats] = useState({
        pendingReviews: 0,
        totalStudents: 0,
        activeClasses: 0,
        avgAttendance: 0
    });
    const [recentReviews, setRecentReviews] = useState([]);
    const [studentSnapshot, setStudentSnapshot] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const data = await facultyService.getDashboardStats();
            
            setStats({
                pendingReviews: data.pendingReviews || 0,
                totalStudents: data.totalStudents || 0,
                activeClasses: data.activeClasses || 0,
                avgAttendance: data.avgAttendance || 0
            });
            
            setRecentReviews(data.recentReviews || []);
            setStudentSnapshot(data.studentSnapshot || []);
        } catch (err) {
            console.error("Error fetching dashboard stats:", err);
            setError(err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                    <p className="font-semibold">Error loading dashboard</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button 
                        onClick={fetchDashboardData}
                        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">

            {/* HEADER */}
            <div>
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Faculty Dashboard
                </h2>
                <p className="text-slate-500 mt-2 text-lg">
                    Welcome back! Here's a quick overview of your classes, students, and pending work.
                </p>
            </div>

            {/* TOP STATS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Pending Reviews */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Pending Reviews</p>
                        <ClipboardDocumentCheckIcon className="h-8 w-8 text-indigo-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">{stats.pendingReviews}</p>
                    <p className="text-sm text-slate-500 mt-2">logs need your attention</p>
                </div>

                {/* Total Students */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Total Students</p>
                        <UsersIcon className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">{stats.totalStudents}</p>
                    <p className="text-sm text-slate-500 mt-2">across all classes</p>
                </div>

                {/* Active Classes */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Active Classes</p>
                        <AcademicCapIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">{stats.activeClasses}</p>
                    <p className="text-sm text-slate-500 mt-2">currently running</p>
                </div>

                {/* Attendance */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Avg Attendance</p>
                        <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">{stats.avgAttendance}%</p>
                    <p className="text-sm text-slate-500 mt-2">overall attendance</p>
                </div>

            </div>

            {/* RECENT ACTIVITY + STUDENTS */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/* Recent Reviews Section */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 bg-slate-50 border-b">
                        <h3 className="font-bold text-lg text-slate-800">
                            Recent Review Submissions
                        </h3>
                    </div>

                    <div className="divide-y">
                        {recentReviews.length > 0 ? (
                            recentReviews.slice(0, 3).map((item, i) => (
                                <div key={i} className="p-4 hover:bg-indigo-50 cursor-pointer transition">
                                    <p className="font-semibold text-slate-900">{item.task || item.title}</p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {item.studentName || item.name} • {item.time || item.submittedAt}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <p>No pending reviews</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 text-center bg-slate-50">
                        <button className="text-indigo-600 hover:underline font-semibold text-sm">
                            View All Reviews
                        </button>
                    </div>
                </div>

                {/* Students Snapshot */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 bg-slate-50 border-b">
                        <h3 className="font-bold text-lg text-slate-800">Student Snapshot</h3>
                    </div>

                    <div className="divide-y">
                        {studentSnapshot.length > 0 ? (
                            studentSnapshot.slice(0, 4).map((s, i) => (
                                <div key={i} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition cursor-pointer">
                                    <div>
                                        <p className="font-semibold text-slate-900">{s.name || s.studentName}</p>
                                        <p className="text-xs text-slate-500">{s.roll || s.rollNumber}</p>
                                    </div>

                                    <span className={`px-3 py-1 text-xs font-medium rounded-full
                                        ${s.status === "Behind" ? "bg-red-100 text-red-700" : ""}
                                        ${s.status === "Excelled" ? "bg-yellow-100 text-yellow-700" : ""}
                                        ${s.status === "Active" ? "bg-green-100 text-green-700" : ""}
                                    `}>
                                        {s.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <p>No students yet</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 text-center bg-slate-50">
                        <button className="text-indigo-600 hover:underline font-semibold text-sm">
                            View Full Roster
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
