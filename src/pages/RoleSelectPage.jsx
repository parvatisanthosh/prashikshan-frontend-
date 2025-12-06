import React from "react";
import { useNavigate } from "react-router-dom";

// --- Custom Icon Components (Increased size to w-7 h-7) ---
// Using modern strokeWidth for a cleaner look
const StudentIcon = (props) => (
    <svg {...props} className="w-7 h-7 mr-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M12 2l8 4v8l-8 4-8-4V6l8-4zM4 6l8 4 8-4M12 10v10"></path>
    </svg>
);
const FacultyIcon = (props) => (
    <svg {...props} className="w-7 h-7 mr-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"></path>
    </svg>
);
const MentorIcon = (props) => (
  <svg {...props} className="w-7 h-7 mr-4 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 00-3-3.87"></path>
    <path d="M16 3.13a4 4 0 010 7.75"></path>
  </svg>
);
const CompanyIcon = (props) => (
    <svg {...props} className="w-7 h-7 mr-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M16 20V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v16m2 0v2m0-2h4m-4 0h-4m4-4h4m-4 0V4"></path>
    </svg>
);
const AdminIcon = (props) => (
    <svg {...props} className="w-7 h-7 mr-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
        <path d="M12.22 2h-.44a2 2 0 00-1.57.87 2 2 0 01-2.45 1.15 2 2 0 00-2.43 2.1 2 2 0 01-1.15 2.45A2 2 0 002 12a2 2 0 00.87 1.57 2 2 0 011.15 2.45A2 2 0 006.55 18a2 2 0 012.45 1.15 2 2 0 001.57.87h.44a2 2 0 001.57-.87 2 2 0 012.45-1.15 2 2 0 002.43-2.1 2 2 0 011.15-2.45A2 2 0 0022 12a2 2 0 00-.87-1.57 2 2 0 01-1.15-2.45A2 2 0 0017.45 6a2 2 0 01-2.45-1.15A2 2 0 0013.33 2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const roles = [
  { name: "Student", label: "Continue as Student", path: "/studentlogin", color: "indigo", Icon: StudentIcon },
  { name: "Faculty", label: "Continue as Faculty", path: "/facultylogin", color: "sky", Icon: FacultyIcon },
  { name: "Mentor", label: "Continue as Mentor", path: "/mentorlogin", color: "purple", Icon: MentorIcon },
  { name: "Company", label: "Continue as Company", path: "/companylogin", color: "emerald", Icon: CompanyIcon },
  { name: "Admin", label: "Continue as Admin", path: "/adminlogin", color: "gray", Icon: AdminIcon },
];

export default function RoleSelectPage() {
    const navigate = useNavigate();

    return (
        // Enhanced background: subtle gradient
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">

            {/* --- Elevated Card Design --- */}
            <div className="w-full max-w-lg bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-gray-100 transform hover:scale-[1.005] transition-all duration-300">

                <h2 className="text-4xl font-extrabold mb-4 text-gray-800 text-center">
                    Select Your Role
                </h2>
                <p className="mb-8 text-center text-gray-600 text-lg">
                    Choose your account type to proceed with access.
                </p>

                {/* Buttons with enhanced interactivity */}
                <div className="flex flex-col gap-5 w-full">
                    {roles.map((role) => (
                        <button
                            key={role.name}
                            className={`
                                flex items-center justify-start py-4 px-6 rounded-2xl font-semibold text-lg
                                text-gray-800 bg-white border border-gray-200 
                                shadow-md
                                transition-all duration-200 ease-out
                                transform
                                hover:scale-[1.01] hover:shadow-lg 
                                hover:border-${role.color}-300 hover:bg-${role.color}-50
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${role.color}-500
                            `}
                            onClick={() => navigate(role.path)}
                        >
                            <role.Icon /> {/* Icon color adjusted to 600 for consistency */}
                            <span className="flex-grow text-left">{role.label}</span>
                            {/* Optional: Add a subtle arrow icon for direction */}
                            <svg className={`w-6 h-6 ml-4 text-${role.color}-500 opacity-75 group-hover:opacity-100`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                            </svg>
                        </button>
                    ))}
                </div>

                {/* OR Divider - lighter and better spaced */}
                <div className="flex items-center my-8">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-gray-400 text-sm font-medium">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Return Button - consistent styling, subtle shadow */}
                <button
                    className="w-full py-4 rounded-2xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ease-out text-lg
                               shadow-lg hover:shadow-xl
                               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => navigate("/")}
                >
                    Return to Home Page
                </button>
            </div>

        </div>
    );
}