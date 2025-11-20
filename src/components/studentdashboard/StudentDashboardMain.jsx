// src/pages/StudentDashboardMain.jsx
import React, { useState } from "react";
import Internships from "../studentdashboard/Internships.jsx";
import Courses from "./Courses.jsx";
import Trending from "../landingpage/trending.jsx";

/**
 * StudentDashboardMain.jsx
 * - Donut charts (SVG)
 * - CGPA / Credits
 * - Courses completed visual
 * - Recent activities & logs (3 shown, show more -> navigates to dedicated page)
 * - Browse internships (3 cards)
 * - View courses (3 cards)
 * - Active mentor + Classes
 *
 * Frontend-only. Replace mock data with API calls later.
 */

function sanitizeId(s) {
  return String(s || "").replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-").toLowerCase();
}

function Donut({
  size = 120,
  stroke = 14,
  value = 0,
  max = 100,
  label,
  color = "#2563EB",
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = Math.max(0, Math.min(1, value / max));
  const dash = circumference * percent;
  const dashOffset = circumference - dash;
  const id = `g-${sanitizeId(label)}`;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={id} x1="0" x2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>

        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {/* background ring */}
          <circle r={radius} fill="none" stroke="#e6eef9" strokeWidth={stroke} />
          {/* progress ring */}
          <circle
            r={radius}
            fill="none"
            stroke={`url(#${id})`}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circumference}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90)"
          />
        </g>
      </svg>
      <div className="mt-2 text-center">
        <div className="text-lg font-semibold">{Math.round(percent * 100)}%</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function SmallCard({ title, value, hint, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold text-gray-900">{value}</div>
          {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

function ItemRow({ title, meta, onView }) {
  return (
    <div className="flex items-start justify-between p-2 rounded hover:bg-gray-50">
      <div>
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">{meta}</div>
      </div>
      <button onClick={onView} className="text-sm text-gray-400">
        ›
      </button>
    </div>
  );
}

export default function StudentDashboardMain({ onNavigate }) {
  // mock data
  const [activitiesDone] = useState({ value: 18, max: 30 }); // e.g., 18/30 activities
  const [logsCreated] = useState({ value: 12, max: 20 }); // 12/20 logs
  const [cgpa] = useState({ cgpa: 8.21, creditsEarned: 72, creditsTotal: 120 });
  const [coursesCompleted] = useState({
    percent: 55,
    list: [
      { id: "cc1", title: "Intro to React", provider: "Coursera", progress: 100 },
      { id: "cc2", title: "Data Analysis Basics", provider: "NPTEL", progress: 80 },
      { id: "cc3", title: "Soft Skills Workshop", provider: "Institute", progress: 40 },
    ],
  });

  const [recentActivities] = useState([
    { id: "ra1", title: "AI seminar", meta: "Oct 10 · Dept. CS" },
    { id: "ra2", title: "React workshop", meta: "Sep 25 · TechCell" },
    { id: "ra3", title: "Hackathon participation", meta: "Aug 12 · Campus" },
    { id: "ra4", title: "Web accessibility meet", meta: "Jul 20 · WebClub" },
  ]);

  const [recentLogs] = useState([
    { id: "rl1", title: "Project X - Requirement gathering", meta: "2h · Oct 22" },
    { id: "rl2", title: "UI: Login page", meta: "3h · Oct 18" },
    { id: "rl3", title: "Backend: auth design", meta: "4h · Oct 12" },
    { id: "rl4", title: "Deployment prep", meta: "1h · Oct 05" },
  ]);

  const [internships] = useState([
    { id: "i1", title: "Frontend Intern", org: "Startup A", stipend: "10k/mo", remote: true },
    { id: "i2", title: "Data Intern", org: "Corp B", stipend: "12k/mo", remote: false },
    { id: "i3", title: "QA Intern", org: "SoftX", stipend: "8k/mo", remote: true },
    { id: "i4", title: "Research Intern", org: "Lab Y", stipend: "15k/mo", remote: false },
  ]);

  const [courses] = useState([
    { id: "c1", title: "Intro to React", provider: "Coursera", price: "Free" },
    { id: "c2", title: "Data Science Basics", provider: "NPTEL", price: "Free" },
    { id: "c3", title: "Advanced JS", provider: "Udemy", price: "Paid" },
    { id: "c4", title: "Professional Skills", provider: "Institute", price: "Govt" },
  ]);

  const [mentor] = useState({ name: "Dr. R. Sharma", role: "Industry Mentor", nextSession: "No upcoming sessions" });
  const [classes] = useState([{ id: "cls1", name: "DSA - CS101" }, { id: "cls2", name: "OS - CS201" }]);

  const nav = (route, payload) => {
    if (typeof onNavigate === "function") return onNavigate(route, payload);
    window.location.hash = `#/${route}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT column: Donuts + CGPA */}
        <div className="lg:col-span-2 space-y-6">
          {/* Donuts row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-center">
              <Donut size={120} stroke={14} value={activitiesDone.value} max={activitiesDone.max} label="Activities Done" color="#10B981" />
            </div>
            <div className="bg-white rounded-xl shadow p-4 flex items-center justify-center">
              <Donut size={120} stroke={14} value={logsCreated.value} max={logsCreated.max} label="Logs Created" color="#3B82F6" />
            </div>

            <div className="bg-white rounded-xl shadow p-4 flex flex-col justify-center">
              <div className="text-sm text-gray-500">CGPA</div>
              <div className="mt-2 text-3xl font-semibold">{cgpa.cgpa}</div>
              <div className="text-xs text-gray-500 mt-1">{cgpa.creditsEarned} / {cgpa.creditsTotal} credits</div>
              <div className="mt-3">
                <div className="h-2 bg-gray-100 rounded overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${(cgpa.creditsEarned / cgpa.creditsTotal) * 100}%` }} />
                </div>
                <div className="text-xs text-gray-400 mt-2">Progress to degree</div>
              </div>
            </div>
          </div>

          {/* Courses completed visual */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Courses Completed</h3>
              <div className="text-xs text-gray-500">{coursesCompleted.percent}% complete</div>
            </div>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              {coursesCompleted.list.map((c) => (
                <div key={c.id} className="border rounded p-3">
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500">{c.provider}</div>
                  <div className="mt-2">
                    <div className="h-2 bg-gray-100 rounded overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${c.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{c.progress}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities and Logs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Recent Activities</h4>
                <button onClick={() => nav('activities')} className="text-sm text-blue-600">Show more</button>
              </div>
              <div className="space-y-2">
                {recentActivities.slice(0, 3).map((a) => (
                  <ItemRow key={a.id} title={a.title} meta={a.meta} onView={() => nav("activities", { id: a.id })} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">Recent Logs</h4>
                <button onClick={() => nav('logbook')} className="text-sm text-blue-600">Show more</button>
              </div>
              <div className="space-y-2">
                {recentLogs.slice(0, 3).map((l) => (
                  <ItemRow key={l.id} title={l.title} meta={l.meta} onView={() => nav("logbook", { id: l.id })} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT column: Mentor, Classes, Quick stats */}
        <aside className="space-y-6">
          <SmallCard title="Active Mentor" value={mentor.name} hint={mentor.role}>
            <div className="text-right">
              <button onClick={() => nav("mentor")} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Book</button>
            </div>
          </SmallCard>

          <SmallCard title="Classes" value={`${classes.length} joined`} hint="Join using a code">
            <div className="text-right">
              <button onClick={() => nav("classes")} className="px-3 py-1 rounded bg-gray-100 text-sm">Open</button>
            </div>
          </SmallCard>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Quick Stats</h4>
            <div className="text-sm text-gray-600">Total internships applied: <span className="font-medium">3</span></div>
            <div className="text-sm text-gray-600 mt-1">Certificates earned: <span className="font-medium">2</span></div>
            <div className="text-sm text-gray-600 mt-1">Badges: <span className="font-medium">4</span></div>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Classes (quick)</h4>
            <div className="space-y-2">
              {classes.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div className="text-sm text-gray-800">{c.name}</div>
                  <button onClick={() => nav("classes", { id: c.id })} className="text-sm text-gray-400">›</button>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button onClick={() => nav("classes")} className="w-full px-3 py-2 rounded bg-blue-600 text-white text-sm">Join class</button>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-3">
        <Internships />
      </div>

      <div className="px-6 md:px-10 py-16 bg-white transition-colors rounded-xl shadow-md mt-6">
        <Courses />
      </div>
      
    </div>
  );
}
