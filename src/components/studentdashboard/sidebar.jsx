// Sidebar.jsx
import React, { useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Sidebar (slides in from right)
 *
 * Props:
 * - open: boolean
 * - onClose: () => void
 * - onNavigate: (route: string) => void   (optional; defaults to react-router navigate)
 * - user: { name: string, avatarUrl?: string } (optional)
 *
 * Notes:
 * - Uses your app paths (/, /logbook, /activitytracker, /studentdashboard, etc).
 * - nav items that point to subsections of dashboard use hash fragments.
 */
export default function Sidebar({
  open,
  onClose,
  onNavigate: onNavigateProp,
  user = { name: "Student Name", avatarUrl: "" },
}) {
  // router hooks (used only if onNavigate prop not provided)
  const navigate = useNavigate();
  const location = useLocation();

  // chosen navigation function
  const navigateFn = useMemo(() => {
    if (typeof onNavigateProp === "function") return (to) => onNavigateProp(to);
    return (to) => {
      // support absolute path strings and hash fragments
      if (typeof to === "string") {
        navigate(to);
      } else if (typeof to === "object" && to !== null) {
        navigate(to);
      }
    };
  }, [onNavigateProp, navigate]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // helper to render nav item and mark active if location matches
  const navItem = (label, to, opts = {}) => {
    const isActive =
      typeof to === "string"
        ? // active if same pathname (ignoring trailing slash) or hash matches
          (() => {
            try {
              const url = new URL(to, window.location.origin);
              const pathMatches =
                (location.pathname || "/").replace(/\/+$/, "") ===
                url.pathname.replace(/\/+$/, "");
              const hashMatches = url.hash ? location.hash === url.hash : false;
              return pathMatches || hashMatches;
            } catch {
              // if 'to' is a hash-only string like "#section" or "/dashboard#x"
              if (to.startsWith("#")) return location.hash === to;
              return location.pathname === to;
            }
          })()
        : false;

    return (
      <button
        key={label}
        onClick={() => {
          navigateFn(to);
          onClose && onClose();
        }}
        className={`w-full text-left flex items-center gap-3 py-3 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400
          ${isActive ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50 text-gray-800"}`}
        aria-current={isActive ? "page" : undefined}
      >
        <span className="font-medium">{label}</span>
        {opts.badge && <span className="ml-auto text-xs text-gray-500">{opts.badge}</span>}
      </button>
    );
  };

  return (
    <div
      aria-hidden={!open}
      className={`fixed inset-0 z-50 pointer-events-none ${open ? "" : ""}`}
    >
      {/* overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        aria-hidden="true"
      />

      {/* panel */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`absolute right-0 top-0 h-full w-[20rem] max-w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}`}
      >
        <div className="h-full flex flex-col">
          {/* header */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold text-blue-600">Prashikshan</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigateFn("/studentdashboard");
                  onClose && onClose();
                }}
                className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-gray-50"
                aria-label="Open profile"
                title="Profile"
              >
                <img
                  src={
                    user.avatarUrl ||
                    `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(user.name)}`
                  }
                  alt={`${user.name} avatar`}
                  className="w-8 h-8 rounded-full border"
                />
                <span className="hidden md:inline-block text-sm text-gray-700">{user.name.split(" ")[0]}</span>
              </button>

              <button
                onClick={onClose}
                aria-label="Close sidebar"
                className="p-2 rounded-md hover:bg-gray-100"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* content */}
          <nav className="px-3 py-4 space-y-1 overflow-auto">
            {navItem("Home", "/")}
            {navItem("Profile", "/studentdashboard")}
            {navItem("Logbook", "/logbook")}
            {navItem("Activity Feed", "/activitytracker")}
            {navItem("Academics", "/studentdashboard#academics")}
            {navItem("Certifications", "/studentdashboard#certifications")}
            {navItem("Courses", "/studentdashboard#courses")}
            {navItem("Mentors", "/studentdashboard#mentors")}
            {navItem("Internships", "/studentdashboard#internships")}
          </nav>

          {/* footer / quick actions */}
          <div className="mt-auto px-4 py-4 border-t">
            <button
              onClick={() => {
                navigateFn("/studentdashboard#help");
                onClose && onClose();
              }}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-50"
            >
              Help & Support
            </button>
            <button
              onClick={() => {
                // sign out -> go to login page by default; if you want full signout flow, pass onNavigate prop
                navigateFn("/studentlogin");
                onClose && onClose();
              }}
              className="mt-2 w-full text-left py-2 px-3 rounded-md text-red-600 hover:bg-red-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
