import React from "react";
// Assuming you might use some icons, let's pretend to import them for structure
// For example: import { Search, Plus, Users, Edit, Trash, Link2 } from 'lucide-react';

export default function ManageClasses({ 
  classList, 
  onCreate, 
  onEdit, 
  onView, 
  onDelete,
  onGenerateLink // New prop for generating or copying the link
}) {

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredClassList = classList.filter(cls =>
    cls.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.classCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = (classId) => {
    // This is where you would call your actual link generation/copy logic
    const link = onGenerateLink(classId); // Assume this function returns the link string
    navigator.clipboard.writeText(link).then(() => {
      // Add a simple alert or toast notification for user feedback
      alert(`Class link copied: ${link}`);
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* 🚀 Header and Primary Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 md:mb-0">
          Class Dashboard
        </h1>

        <button
          onClick={onCreate}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-200"
        >
          {/* <Plus className="w-5 h-5" /> */}
          <span>Create New Class</span>
        </button>
      </div>

      <hr className="mb-8 border-gray-200" />
      
      {/* 🔍 Search and Filter */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by class name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150"
        />
      </div>

      {/* 📚 Class List Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClassList.length === 0 && (
          <p className="text-slate-500 col-span-full py-10 text-center text-lg">
            {searchTerm 
              ? `No classes found matching "${searchTerm}".` 
              : "No classes yet. Use the button above to create one!"}
          </p>
        )}

        {filteredClassList.map((cls, index) => (
          // Card for each Class
          <div 
            key={cls.id || index} // Use unique ID if available, otherwise index
            className="flex flex-col p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100"
          >
            {/* Class Info */}
            <h2 className="text-xl font-bold text-slate-900 truncate mb-1" title={cls.className}>
              {cls.className}
            </h2>
            <p className="text-sm font-medium text-indigo-600 mb-4">
              Code: <span className="font-semibold">{cls.classCode}</span>
            </p>

            {/* Quick Stats */}
            <div className="flex items-center text-sm text-slate-600 mb-4 space-x-2">
                {/* <Users className="w-4 h-4 text-indigo-500" /> */}
                <span>{cls.studentCount || 0} Students</span>
            </div>
            
            {/* 🔗 Generate/Copy Link Button (New Feature) */}
            <button 
                onClick={() => handleCopyLink(cls.id)} 
                className="flex items-center justify-center space-x-2 w-full py-2 mb-4 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 transition duration-200"
            >
                {/* <Link2 className="w-4 h-4" /> */}
                <span>Copy Class Link</span>
            </button>


            {/* 🎯 Action Buttons (Updated/Grouped) */}
            <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col space-y-3">
              
              {/* View Student Work */}
              <button 
                onClick={() => onView && onView(cls)} 
                className="w-full py-2 text-sm text-white bg-green-500 rounded-lg hover:bg-green-600 transition duration-200"
              >
                View Student Work
              </button>
              
              <div className="flex space-x-2">
                {/* Edit Class */}
                <button 
                  onClick={() => onEdit && onEdit(cls)}
                  className="w-1/2 py-2 text-sm text-slate-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition duration-200 flex items-center justify-center space-x-1"
                >
                  {/* <Edit className="w-4 h-4" /> */}
                  <span>Edit</span>
                </button>
                
                {/* Delete Class */}
                <button 
                  onClick={() => onDelete && onDelete(cls)}
                  className="w-1/2 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition duration-200 flex items-center justify-center space-x-1"
                >
                  {/* <Trash className="w-4 h-4" /> */}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}