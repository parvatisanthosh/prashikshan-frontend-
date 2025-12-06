import React from "react";
import { BellIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md h-16 flex items-center justify-between px-6 border-b border-gray-200">

      {/* LEFT: PAGE TITLE */}
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">
        Admin Console
      </h1>

      {/* RIGHT: ICONS */}
      <div className="flex items-center gap-6">

        {/* Notification Icon */}
        <button className="relative hover:text-indigo-600 transition">
          <BellIcon className="w-6 h-6 text-gray-500" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-600 rounded-full"></span>
        </button>

        {/* Profile Icon */}
        <button className="flex items-center gap-2 hover:text-indigo-600 transition">
          <UserCircleIcon className="w-8 h-8 text-gray-600" />
          <span className="text-sm font-semibold text-gray-700">Admin</span>
        </button>

      </div>

    </nav>
  );
}
