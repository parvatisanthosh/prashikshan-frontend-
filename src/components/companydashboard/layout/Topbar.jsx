// src/components/companydashboard/Layout/Topbar.jsx
import React, { useState } from "react";
import {
  BellIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Topbar({ onToggleSidebar }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, title: "New Application", message: "Aditi Verma applied for Frontend Developer", time: "2m ago", unread: true },
    { id: 2, title: "Interview Scheduled", message: "Rahul Singh confirmed for 3 PM", time: "1h ago", unread: true },
    { id: 3, title: "Message Received", message: "You have a new message from Sneha", time: "3h ago", unread: false },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
          >
            <Bars3Icon className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <h1 className="text-lg font-bold text-gray-900">Company Dashboard</h1>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              All systems operational
            </div>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative group">
            <input
              className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Search applicants, openings, or analytics..."
            />
            <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-mono bg-gray-100 text-gray-400 rounded border border-gray-200">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
            >
              <BellIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Mark all read</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notif.unread ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                          <p className="text-gray-500 text-sm truncate">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-200"></div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md shadow-blue-500/25">
                D
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold text-gray-900">Dr. Sharma</div>
                <div className="text-xs text-gray-500">HR Manager</div>
              </div>
              <ChevronDownIcon className="w-4 h-4 text-gray-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-semibold text-gray-900">Dr. Sharma</p>
                  <p className="text-sm text-gray-500">sharma@techcorp.com</p>
                </div>
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    <UserCircleIcon className="w-5 h-5 text-gray-400" />
                    View Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                    <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                    Settings
                  </button>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 text-red-600 rounded-xl hover:bg-red-50 transition-colors text-sm">
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}