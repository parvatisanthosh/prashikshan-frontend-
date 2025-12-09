// src/components/companydashboard/Layout/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ChartBarIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ open }) {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path);

  const menuItems = [
    { path: "/company/overview", icon: HomeIcon, label: "Overview", color: "blue" },
    { path: "/company/create-opening", icon: PlusCircleIcon, label: "Create Opening", color: "green" },
    { path: "/company/applicants", icon: UserGroupIcon, label: "Applicants", color: "purple" },
    { path: "/company/analytics", icon: ChartBarIcon, label: "Analytics", color: "orange" },
    { path: "/company/chat", icon: ChatBubbleOvalLeftEllipsisIcon, label: "Messages", color: "pink", badge: 3 },
  ];

  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    pink: "from-pink-500 to-pink-600",
  };

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-white border-r h-screen flex flex-col transition-all duration-300 ease-in-out`}
      style={{ borderColor: "var(--border)" }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/25">
            P
          </div>
          {open && (
            <div className="transition-opacity duration-300">
              <h2 className="font-bold text-gray-900">Prashikshan</h2>
              <p className="text-xs text-gray-500">Company Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className={`${open ? "block" : "hidden"} text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3`}>
          Main Menu
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {/* Active Indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
              )}

              {/* Icon with gradient background on active */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-br ${colorClasses[item.color]} text-white shadow-md`
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>

              {/* Label */}
              {open && (
                <span
                  className={`font-medium transition-all duration-200 ${
                    active ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {item.badge && open && (
                <div className="ml-auto w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-semibold">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Tooltip for collapsed state */}
              {!open && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          to="/company/settings"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-all duration-200">
            <Cog6ToothIcon className="w-5 h-5" />
          </div>
          {open && <span className="font-medium">Settings</span>}
        </Link>

        <Link
          to="/company/help"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-gray-200 transition-all duration-200">
            <QuestionMarkCircleIcon className="w-5 h-5" />
          </div>
          {open && <span className="font-medium">Help Center</span>}
        </Link>

        {/* User Card */}
        {open && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                T
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">TechCorp Inc.</p>
                <p className="text-xs text-gray-500 truncate">Enterprise Plan</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}