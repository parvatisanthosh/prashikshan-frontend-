import React, { useState, useEffect } from 'react';
import { UserGroupIcon, MagnifyingGlassIcon, ChatBubbleLeftRightIcon, ChartBarIcon, EnvelopeIcon } from '@heroicons/react/24/solid';
import mentorService from '../../services/mentorService';

// This component will fetch data from API and fallback to mock data if unavailable
export default function AssignedStudents() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        async function fetchStudents() {
            setLoading(true);
            try {
                const data = await mentorService.getAssignedStudents();
                setStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchStudents();
    }, []);

    // Filter students based on search
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.course.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'Excelling': return 'bg-green-100 text-green-700';
            case 'Active': return 'bg-blue-100 text-blue-700';
            case 'Needs Attention': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading students...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Assigned Students</h2>
                <p className="text-slate-500 mt-1">View and manage all students assigned to you for mentorship.</p>
            </div>
            {/* Stats Overview */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <UserGroupIcon className="h-8 w-8 mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold mb-1">{students.length}</h3>
                    <p className="text-blue-100 text-sm">Total Students</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <ChartBarIcon className="h-8 w-8 mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold mb-1">
                        {students.filter(s => s.status === 'Excelling').length}
                    </h3>
                    <p className="text-green-100 text-sm">Excelling</p>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold mb-1">
                        {students.reduce((sum, s) => sum + s.sessionsCompleted, 0)}
                    </h3>
                    <p className="text-blue-100 text-sm">Total Sessions</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-6">
                    <EnvelopeIcon className="h-8 w-8 mb-2 opacity-80" />
                    <h3 className="text-3xl font-bold mb-1">
                        {students.filter(s => s.status === 'Needs Attention').length}
                    </h3>
                    <p className="text-amber-100 text-sm">Need Follow-up</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-md p-4">
                <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or course..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Students List */}
            <div className="grid md:grid-cols-2 gap-6">
                {filteredStudents.map(student => (
                    <div
                        key={student.id}
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition cursor-pointer"
                        onClick={() => setSelectedStudent(student)}
                    >
                        <div className="flex items-start gap-4 mb-4">
                            {/* Avatar */}
                            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {student.name.charAt(0)}
                            </div>

                            {/* Student Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                    <h3 className="font-bold text-lg text-slate-800">{student.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(student.status)}`}>
                                        {student.status}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600">{student.course} • {student.year}</p>
                                <p className="text-xs text-slate-500 mt-1">{student.email}</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-600 font-medium">Overall Progress</span>
                                <span className="font-bold text-blue-600">{student.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${student.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                                <p className="text-xl font-bold text-slate-800">{student.sessionsCompleted}</p>
                                <p className="text-xs text-slate-500">Sessions Done</p>
                            </div>
                            <div className="text-center border-x border-slate-200">
                                <p className="text-xl font-bold text-slate-800">{student.upcomingSessions}</p>
                                <p className="text-xs text-slate-500">Upcoming</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-slate-800">{student.lastContact}</p>
                                <p className="text-xs text-slate-500">Last Contact</p>
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-600 mb-2">Interests:</p>
                            <div className="flex flex-wrap gap-2">
                                {student.interests.map((interest, idx) => (
                                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStudent(student);
                                    alert(`Viewing profile for ${student.name}`);
                                }}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold transition"
                            >
                                View Profile
                            </button>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = '/mentordashboard/chat';
                                }}
                                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
                            >
                                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                Message
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-md">
                    <UserGroupIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg">No students found</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search</p>
                </div>
            )}
        </div>
    );
}

