// FILE: StudentProfile.jsx
import React from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function StudentProfile({ onBack }) {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <button
        onClick={onBack}
        className="flex items-center text-indigo-600 gap-2 font-semibold"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        Back
      </button>

      <div className="bg-white p-6 rounded-2xl shadow-xl border">
        <h1 className="text-3xl font-bold text-slate-800">Student Profile</h1>

        <p className="text-sm text-slate-600 mt-2">More student data coming…</p>
      </div>
    </div>
  );
}
