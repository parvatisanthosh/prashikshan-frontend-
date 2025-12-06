import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 h-14 flex items-center justify-center text-gray-500 text-sm">
      © {new Date().getFullYear()} Prashikshan • Institute Admin Panel
    </footer>
  );
}
