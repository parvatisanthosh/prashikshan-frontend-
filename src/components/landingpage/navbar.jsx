import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 transition group"
    >
      {children}
      {/* underline animation */}
      <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-xl bg-white/80 shadow-[0_2px_20px_rgba(0,0,0,0.05)] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center h-16 md:h-20">

          {/* --- LOGO --- */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <h1 className="hidden sm:block text-2xl font-extrabold text-gray-900">
              Prashikshan
            </h1>
          </Link>

          {/* --- CENTER MENU (DESKTOP) --- */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/colleges">Colleges</NavLink>
            <NavLink to="/industry">Industry Partners</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </div>

          {/* --- RIGHT SECTION BUTTONS (DESKTOP) --- */}
          <div className="hidden md:flex gap-3 items-center">
            <Link to="/roleselect">
              <button className="px-6 py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-lg bg-white hover:bg-indigo-50 active:scale-95 transition">
                Sign In
              </button>
            </Link>

            <Link to="/roleselect">
              <button className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow hover:bg-indigo-700 active:scale-95 transition">
                Register
              </button>
            </Link>
          </div>

          {/* --- MOBILE MENU TOGGLE --- */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/roleselect">
              <button className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
                Sign Up
              </button>
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              {isMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-fadeIn">
          <div className="px-4 pt-3 pb-3 space-y-1">
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/colleges">Colleges</NavLink>
            <NavLink to="/industry">Industry Partners</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </div>

          <div className="px-4 pt-3 pb-4 border-t border-gray-200 space-y-3">
            <Link to="/roleselect">
              <button className="w-full py-2 text-sm font-semibold text-indigo-600 border border-indigo-300 rounded-lg hover:bg-indigo-50 transition">
                Sign In
              </button>
            </Link>

            <Link to="/roleselect">
              <button className="w-full py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow transition">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
