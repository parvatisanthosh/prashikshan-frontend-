import React, { useState, useEffect } from 'react';
import { ClockIcon, PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import mentorService from '../../services/mentorService';

// Days of the week
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Time slots (can be generated dynamically)
const TIME_SLOTS = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

export default function SetAvailability() {
    // State to manage availability slots
    const [availability, setAvailability] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [selectedStartTime, setSelectedStartTime] = useState('09:00 AM');
    const [selectedEndTime, setSelectedEndTime] = useState('10:00 AM');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    // Fetch availability on mount
    useEffect(() => {
        async function fetchAvailability() {
            setLoading(true);
            try {
                const data = await mentorService.getAvailability();
                setAvailability(data);
            } catch (error) {
                console.error('Error fetching availability:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchAvailability();
    }, []);

    // Add time slot to selected day
    const addTimeSlot = async () => {
        const newSlot = {
            id: Date.now(),
            start: selectedStartTime,
            end: selectedEndTime
        };

        const updatedAvailability = {
            ...availability,
            [selectedDay]: [...availability[selectedDay], newSlot]
        };

        setAvailability(updatedAvailability);

        // Save to backend
        try {
            await mentorService.saveAvailability(updatedAvailability);
            // Show success message
            setShowSuccessMessage(true);
            setTimeout(() => setShowSuccessMessage(false), 3000);
        } catch (error) {
            console.error('Error saving availability:', error);
        }
    };

    // Remove time slot
    const removeTimeSlot = async (day, slotId) => {
        const updatedAvailability = {
            ...availability,
            [day]: availability[day].filter(slot => slot.id !== slotId)
        };

        setAvailability(updatedAvailability);

        // Save to backend
        try {
            await mentorService.saveAvailability(updatedAvailability);
        } catch (error) {
            console.error('Error saving availability:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading availability...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Set Your Availability</h2>
                <p className="text-slate-500 mt-1">Manage your weekly schedule and let students know when you're available for mentoring sessions.</p>
            </div>

            {/* Success Message */}
            {showSuccessMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    <p className="text-green-800 font-medium">Availability updated successfully!</p>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* ADD AVAILABILITY FORM */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <PlusIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Add Time Slot</h3>
                    </div>

                    <div className="space-y-4">
                        {/* Select Day */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Day</label>
                            <select 
                                value={selectedDay}
                                onChange={(e) => setSelectedDay(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {DAYS.map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>

                        {/* Start Time */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
                            <select 
                                value={selectedStartTime}
                                onChange={(e) => setSelectedStartTime(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {TIME_SLOTS.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        {/* End Time */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
                            <select 
                                value={selectedEndTime}
                                onChange={(e) => setSelectedEndTime(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {TIME_SLOTS.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>

                        {/* Add Button */}
                        <button 
                            onClick={addTimeSlot}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <PlusIcon className="h-5 w-5" />
                            Add Time Slot
                        </button>
                    </div>
                </div>

                {/* WEEKLY AVAILABILITY OVERVIEW */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ClockIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">Weekly Schedule</h3>
                    </div>

                    <div className="space-y-4">
                        {DAYS.map(day => (
                            <div key={day} className="border border-slate-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-slate-800">{day}</h4>
                                    <span className="text-sm text-slate-500">
                                        {availability[day].length} slot{availability[day].length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {availability[day].length === 0 ? (
                                    <p className="text-sm text-slate-400 italic">No availability set for this day</p>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {availability[day].map(slot => (
                                            <div 
                                                key={slot.id}
                                                className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
                                            >
                                                <span className="text-sm font-medium text-blue-700">
                                                    {slot.start} - {slot.end}
                                                </span>
                                                <button 
                                                    onClick={() => removeTimeSlot(day, slot.id)}
                                                    className="text-red-500 hover:text-red-700 transition"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-bold text-blue-900 mb-2">💡 Tips for Setting Availability</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Set consistent hours to help students plan their sessions</li>
                    <li>• Include buffer time between sessions for breaks</li>
                    <li>• You can always update your availability as needed</li>
                    <li>• Students will only see your available slots when booking</li>
                </ul>
            </div>
        </div>
    );
}

