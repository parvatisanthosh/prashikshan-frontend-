// ClassManager.jsx (The Parent Component)

import React, { useState } from 'react';
import ManageClasses from './ManageClasses'; // Adjust path as needed

// Initial dummy data for demonstration
const initialClasses = [
  { id: 1, className: 'Advanced Algebra', classCode: 'MA101', studentCount: 25 },
  { id: 2, className: 'Web Development Basics', classCode: 'CS205', studentCount: 42 },
  { id: 3, className: 'Literary Analysis', classCode: 'EN300', studentCount: 18 },
];

export default function ClassManager() {
  const [classList, setClassList] = useState(initialClasses);
  const [nextId, setNextId] = useState(4); // Simple ID tracking

  // --- HANDLER FUNCTIONS PASSED TO CHILD COMPONENT ---

  // 1. CREATE
  const handleCreateClass = () => {
    const newClass = {
      id: nextId,
      className: `New Class ${nextId}`,
      classCode: `NC${nextId}`,
      studentCount: 0,
    };
    setClassList([...classList, newClass]);
    setNextId(nextId + 1);
    console.log("Class Created:", newClass.className);
    alert(`Created Class: ${newClass.className}`);
  };

  // 2. DELETE
  const handleDeleteClass = (clsToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${clsToDelete.className}?`)) {
      const updatedList = classList.filter(cls => cls.id !== clsToDelete.id);
      setClassList(updatedList);
      console.log("Class Deleted:", clsToDelete.className);
    }
  };

  // 3. EDIT (Placeholder for opening a modal or navigating)
  const handleEditClass = (clsToEdit) => {
    // In a real app, this would open a form/modal pre-filled with class data
    console.log("Editing Class:", clsToEdit.className);
    alert(`Editing Class: ${clsToEdit.className} (Check console for details)`);
    
    // Example of actual update logic (e.g., changing the name)
    const newName = prompt(`Enter new name for ${clsToEdit.className}:`, clsToEdit.className);
    if (newName && newName !== clsToEdit.className) {
        setClassList(classList.map(cls => 
            cls.id === clsToEdit.id ? { ...cls, className: newName } : cls
        ));
    }
  };

  // 4. VIEW STUDENT WORK (Placeholder for navigation)
  const handleViewStudentWork = (clsToView) => {
    // In a real app, this would use a router (like React Router) to navigate
    console.log("Viewing Student Work for:", clsToView.className);
    alert(`Navigating to student work view for: ${clsToView.className}`);
  };

  // 5. GENERATE LINK
  const handleGenerateLink = (classId) => {
    // This function returns the actual link string that the child copies
    return `https://yourschoolportal.com/join/class/${classId}`; 
  };


  return (
    <ManageClasses
      classList={classList}
      onCreate={handleCreateClass}
      onEdit={handleEditClass}
      onView={handleViewStudentWork}
      onDelete={handleDeleteClass}
      onGenerateLink={handleGenerateLink}
    />
  );
}