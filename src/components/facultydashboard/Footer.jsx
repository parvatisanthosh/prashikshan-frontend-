import React from "react";

export default function Footer() {
  return (
    <footer className="w-full py-6 bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-xs text-slate-400 font-medium">
          &copy; 2025 Prashikshan Inc. All rights reserved. | 
          <a href="#" className="hover:text-indigo-600 ml-1 transition">Help Center</a> | 
          <a href="#" className="hover:text-indigo-600 ml-1 transition">Privacy Policy</a>
        </p>
      </div>
    </footer>
  );
}