// FILE: StudentCard.jsx
import React from "react";

export default function StudentCard({ student, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl shadow-md p-5 border hover:shadow-xl transition"
    >
      <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
      <p className="text-sm text-slate-500">{student.roll}</p>

      <div className="mt-3">
        <p className="text-xs text-slate-400">Progress</p>
        <div className="w-full bg-slate-200 h-2 rounded-full mt-1">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${student.progress}%` }}
          ></div>
        </div>
      </div>

      <p className="text-sm text-indigo-600 mt-3 font-semibold">View Profile →</p>
    </div>
  );
}
