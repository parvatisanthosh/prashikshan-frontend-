// src/components/companydashboard/Layout/DashboardLayout.jsx
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="flex">
        {/* Sidebar with smooth transition */}
        <div className="fixed left-0 top-0 h-full z-30">
          <Sidebar open={sidebarOpen} />
        </div>

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
            sidebarOpen ? "ml-64" : "ml-20"
          }`}
        >
          <Topbar onToggleSidebar={() => setSidebarOpen((s) => !s)} />

          <main className="flex-1 p-6">
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          </main>

          <footer className="text-center text-xs text-gray-400 py-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
            <p>© {new Date().getFullYear()} Prashikshan Inc. All rights reserved.</p>
            <p className="mt-1">Made with ❤️ for better education</p>
          </footer>
        </div>
      </div>
    </div>
  );
}