import React, { useState } from "react";
import ClassForm from "./ClassForm.jsx";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

export default function CreateClass({ onBack, onClassCreated }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (formData) => {
    setLoading(true);

    setTimeout(() => {
      const newClass = {
        id: "CLS" + Math.floor(Math.random() * 9000),
        className: formData.className,
        classCode: formData.classCode,
        department: formData.department,
        section: formData.section,
        startDate: formData.startDate,
        endDate: formData.endDate,
        description: formData.description,
        maxStudents: formData.maxStudents,

        // IMPORTANT defaults
        studentCount: 0,
        logsPending: 0,
        status: "Active",
      };

      onClassCreated(newClass);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-indigo-600 font-semibold mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" /> Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <ClassForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
