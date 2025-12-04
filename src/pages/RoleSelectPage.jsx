import React from "react";
import { useNavigate } from "react-router-dom";

// --- Custom Icon Components (Increased size to w-7 h-7) ---
const StudentIcon = (props) => (
  <svg {...props} className="w-7 h-7 mr-4 text-indigo-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
    <path d="M12 2l8 4v8l-8 4-8-4V6l8-4zM4 6l8 4 8-4M12 10v10"></path>
  </svg>
);
const FacultyIcon = (props) => (
  <svg {...props} className="w-7 h-7 mr-4 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>
  </svg>
);
const CompanyIcon = (props) => (
  <svg {...props} className="w-7 h-7 mr-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
    <path d="M16 20V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v16m2 0v2m0-2h4m-4 0h-4m4-4h4m-4 0V4"></path>
  </svg>
);
const AdminIcon = (props) => (
  <svg {...props} className="w-7 h-7 mr-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}>
    <path d="M12.22 2h-.44a2 2 0 00-1.57.87 2 2 0 01-2.45 1.15 2 2 0 00-2.43 2.1 2 2 0 01-1.15 2.45A2 2 0 002 12a2 2 0 00.87 1.57 2 2 0 011.15 2.45A2 2 0 006.55 18a2 2 0 012.45 1.15 2 2 0 001.57.87h.44a2 2 0 001.57-.87 2 2 0 012.45-1.15 2 2 0 002.43-2.1 2 2 0 011.15-2.45A2 2 0 0022 12a2 2 0 00-.87-1.57 2 2 0 01-1.15-2.45A2 2 0 0017.45 6a2 2 0 01-2.45-1.15A2 2 0 0013.33 2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const roles = [
  { name: "Student", label: "Continue as Student", path: "/studentlogin", color: "indigo", Icon: StudentIcon },
  { name: "Faculty", label: "Continue as Faculty", path: "/facultylogin", color: "sky", Icon: FacultyIcon },
  { name: "Company", label: "Continue as Company", path: "/companylogin", color: "emerald", Icon: CompanyIcon },
  { name: "Admin", label: "Continue as Admin", path: "/adminlogin", color: "gray", Icon: AdminIcon },
];

export default function RoleSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      {/* --- White Card with Shadow + Black Border --- */}
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-black">

        <h2 className="text-3xl font-semibold mb-2 text-gray-900 text-center">
          Select Your Role
        </h2>
        <p className="mb-8 text-center text-gray-500 text-lg">
          Choose your account type to proceed or return home.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4 w-full">
          {roles.map((role) => (
            <button
              key={role.name}
              className={`
                flex items-center justify-start py-4 px-5 rounded-full font-medium text-lg
                text-gray-900 bg-white border border-gray-300 
                shadow-sm 
                hover:border-${role.color}-500 hover:shadow-md 
                transition
              `}
              onClick={() => navigate(role.path)}
            >
              <role.Icon />
              <span className="flex-grow">{role.label}</span>
            </button>
          ))}
        </div>

        {/* OR Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Blue Return Button */}
        <button
          className="w-full py-4 rounded-full font-semibold text-white bg-blue-600 hover:bg-blue-700 transition text-lg"
          onClick={() => navigate("/")}
        >
          Return to Home Page
        </button>
      </div>

    </div>
  );
}