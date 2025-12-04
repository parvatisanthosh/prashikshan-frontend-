import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper component for menu items
  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className="block text-base font-medium text-slate-600 py-2 md:py-1 px-3 rounded-full hover:bg-indigo-50 hover:text-indigo-700 transition duration-200"
    >
      {children}
    </Link>
  );

  return (
    // Outer container: Fixed, sleek background with blur and distinct shadow
    <nav className="w-full fixed top-0 left-0 z-50 bg-white/80 backdrop-filter backdrop-blur-md shadow-lg shadow-indigo-100/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center py-3 md:py-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold tracking-tighter text-indigo-700">
                Prashikshan
            </h1>
          </Link>

          {/* Primary Menu (Desktop) */}
          <div className="hidden md:flex md:space-x-4 lg:space-x-6 items-center">
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/colleges">Colleges</NavLink>
            <NavLink to="/industry">Industry Partners</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </div>

          {/* Right Section: Actions */}
          <div className="hidden md:flex gap-3 items-center">
            
            {/* Login Button: Link updated to /roleselect */}
            <Link to="/roleselect"> 
              <button 
                className="px-5 py-2.5 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-full hover:border-indigo-400 hover:bg-indigo-50 transition duration-200 active:scale-[0.98]"
              >
                Sign In
              </button>
            </Link>
            
            {/* Register Button (Primary CTA): Link updated to /roleselect */}
            <Link to="/roleselect"> 
              <button 
                className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-full shadow-lg shadow-indigo-500/40 hover:bg-indigo-700 transition duration-200 active:scale-[0.98]"
              >
                Register
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-filter backdrop-blur-sm border-t border-slate-100 py-3">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/students">Students</NavLink>
            <NavLink to="/colleges">Colleges</NavLink>
            <NavLink to="/industry">Industry Partners</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-100 space-y-2 px-4">
            {/* Login Button: Link updated to /roleselect */}
            <Link to="/roleselect">
              <button className="w-full text-center py-2 text-sm font-semibold text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50">
                Sign In
              </button>
            </Link>
            {/* Register Button: Link updated to /roleselect */}
            <Link to="/roleselect">
              <button className="w-full text-center py-2 text-sm font-bold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
                Register
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}