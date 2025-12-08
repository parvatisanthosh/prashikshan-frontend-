import React, { useState } from "react";
import ClassForm from "./ClassForm.jsx";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import facultyService from "../../../services/Facultyservice";

export default function CreateClass({ onBack, onClassCreated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const newClass = await facultyService.createClass(formData);
      onClassCreated(newClass);
    } catch (err) {
      console.error("Error creating class:", err);
      setError(err.message || "Failed to create class");
      setLoading(false);
    }
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
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}
        <ClassForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}
