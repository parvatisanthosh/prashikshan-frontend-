import React from 'react';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

export default function Navbar({ user, onToggleSidebar, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b border-slate-200 shadow-sm z-30 h-20 px-4 md:px-8 flex items-center justify-between">
      
      {/* Left: Brand & Toggle */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg md:hidden"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-2">
             <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
             </div>
             <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight hidden sm:block">
                Prashikshan <span className="text-indigo-600 font-medium text-sm ml-1">Faculty</span>
             </h1>
        </div>
      </div>

      {/* Center: Search (Optional) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search students, logs, or courses..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
        </div>
      </div>

      {/* Right: Profile & Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-indigo-600 transition rounded-full hover:bg-indigo-50 relative">
          <BellIcon className="h-6 w-6" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-slate-700">{user.name}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md cursor-pointer hover:ring-2 hover:ring-indigo-300 transition">
                {user.name.charAt(0)}
            </div>
        </div>
      </div>
    </nav>
  );
}