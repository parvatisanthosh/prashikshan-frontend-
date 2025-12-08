import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon, CheckCircleIcon, XCircleIcon, ClockIcon, UserIcon } from '@heroicons/react/24/solid';
import mentorService from '../../services/mentorService';


function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString; // Fallback to original string if parsing fails
    }
}
export default function BookingCalendar() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // All, Pending, Confirmed
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        async function fetchBookings() {
            setLoading(true);
            try {
                const data = await mentorService.getBookings();
                setBookings(data);
            } catch (error) {
                console.error('Error fetching bookings:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchBookings();
    }, []);

    // Filter bookings based on status
    const filteredBookings = bookings.filter(booking => {
        if (filter === 'All') return true;
        return booking.status === filter;
    });

    // Handle booking actions
    const handleConfirm = async (bookingId) => {
        try {
            await mentorService.confirmBooking(bookingId);
            setBookings(prev => prev.map(b => 
                b.id === bookingId ? { ...b, status: 'Confirmed' } : b
            ));
        } catch (error) {
            console.error('Error confirming booking:', error);
        }
    };

    const handleCancel = async (bookingId) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await mentorService.cancelBooking(bookingId);
                setBookings(prev => prev.filter(b => b.id !== bookingId));
            } catch (error) {
                console.error('Error cancelling booking:', error);
            }
        }
    };

    // Group bookings by date
    const groupedBookings = filteredBookings.reduce((acc, booking) => {
        if (!acc[booking.date]) {
            acc[booking.date] = [];
        }
        acc[booking.date].push(booking);
        return acc;
    }, {});

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Booking Calendar</h2>
                <p className="text-slate-500 mt-1">View and manage all your upcoming mentoring sessions and booking requests.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <CalendarDaysIcon className="h-8 w-8 opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">{bookings.length}</h3>
                    <p className="text-blue-100 text-sm">Total Bookings</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircleIcon className="h-8 w-8 opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">
                        {bookings.filter(b => b.status === 'Confirmed').length}
                    </h3>
                    <p className="text-green-100 text-sm">Confirmed Sessions</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <ClockIcon className="h-8 w-8 opacity-80" />
                    </div>
                    <h3 className="text-3xl font-bold mb-1">
                        {bookings.filter(b => b.status === 'Pending').length}
                    </h3>
                    <p className="text-amber-100 text-sm">Pending Requests</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
                {['All', 'Pending', 'Confirmed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                            filter === status
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-2xl shadow-md p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Upcoming Sessions</h3>

                {Object.keys(groupedBookings).length === 0 ? (
                    <div className="text-center py-12">
                        <CalendarDaysIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 text-lg">No bookings found</p>
                        <p className="text-slate-400 text-sm">Your schedule is clear for now</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedBookings).map(([date, dateBookings]) => (
                            <div key={date}>
                                {/* Date Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-1 flex-1 bg-slate-200 rounded"></div>
                                    <h4 className="text-sm font-bold text-slate-600 uppercase">
                                        {formatDate(date)}
                                    </h4>
                                    <div className="h-1 flex-1 bg-slate-200 rounded"></div>
                                </div>

                                {/* Bookings for this date */}
                                <div className="space-y-3">
                                    {dateBookings.map(booking => (
                                        <div
                                            key={booking.id}
                                            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Student Avatar */}
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                                        {booking.student.charAt(0)}
                                                    </div>

                                                    {/* Booking Details */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h5 className="font-bold text-slate-800">{booking.student}</h5>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                booking.status === 'Confirmed'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                                {booking.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-slate-600 font-medium">{booking.topic}</p>
                                                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                            <span className="flex items-center gap-1">
                                                                <ClockIcon className="h-4 w-4" />
                                                                {booking.time}
                                                            </span>
                                                        </div>
                                                        {booking.notes && (
                                                            <p className="text-sm text-slate-500 mt-2 italic">
                                                                "{booking.notes}"
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2">
                                                    {booking.status === 'Pending' && (
                                                        <button
                                                            onClick={() => handleConfirm(booking.id)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
                                                            title="Confirm Booking"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleCancel(booking.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                                                        title="Cancel Booking"
                                                    >
                                                        <XCircleIcon className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

