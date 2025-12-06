import React from "react";
import {
    ClipboardDocumentCheckIcon,
    UsersIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/solid";

export default function OverviewUI() {
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
                    <p className="text-4xl font-extrabold text-slate-900">3</p>
                    <p className="text-sm text-slate-500 mt-2">logs need your attention</p>
                </div>

                {/* Total Students */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Total Students</p>
                        <UsersIcon className="h-8 w-8 text-green-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">142</p>
                    <p className="text-sm text-slate-500 mt-2">across all classes</p>
                </div>

                {/* Active Classes */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Active Classes</p>
                        <AcademicCapIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">6</p>
                    <p className="text-sm text-slate-500 mt-2">currently running</p>
                </div>

                {/* Attendance */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 hover:shadow-xl transition">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-slate-500 font-medium">Avg Attendance</p>
                        <CheckCircleIcon className="h-8 w-8 text-emerald-500" />
                    </div>
                    <p className="text-4xl font-extrabold text-slate-900">92%</p>
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
                        {[
                            { name: "Aditi Verma", task: "Python Log #4", time: "2 hrs ago" },
                            { name: "Rahul Singh", task: "Internship Week 3", time: "5 hrs ago" },
                            { name: "Sneha P", task: "Capstone Proposal", time: "1 day ago" },
                        ].map((item, i) => (
                            <div key={i} className="p-4 hover:bg-indigo-50 cursor-pointer transition">
                                <p className="font-semibold text-slate-900">{item.task}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {item.name} • {item.time}
                                </p>
                            </div>
                        ))}
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
                        {[
                            { name: "Aditi Verma", roll: "CS21-045", status: "Active" },
                            { name: "Rahul Singh", roll: "CS21-012", status: "Behind" },
                            { name: "Sneha P", roll: "CS21-033", status: "Excelled" },
                            { name: "Vikram R", roll: "CS21-055", status: "Active" },
                        ].map((s, i) => (
                            <div key={i} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition cursor-pointer">
                                <div>
                                    <p className="font-semibold text-slate-900">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.roll}</p>
                                </div>

                                <span className={`px-3 py-1 text-xs font-medium rounded-full
                                    ${s.status === "Behind" ? "bg-red-100 text-red-700" : ""}
                                    ${s.status === "Excelled" ? "bg-yellow-100 text-yellow-700" : ""}
                                    ${s.status === "Active" ? "bg-green-100 text-green-700" : ""}
                                `}>
                                    {s.status}
                                </span>
                            </div>
                        ))}
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
