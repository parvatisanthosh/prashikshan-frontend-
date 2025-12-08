import React, { useState, useEffect } from 'react';
import { BellIcon, EnvelopeIcon, CheckCircleIcon, XMarkIcon, ClockIcon } from '@heroicons/react/24/solid';
import mentorService from '../../services/mentorService';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [filter, setFilter] = useState('All'); // All, Unread, Action Required

    useEffect(() => {
        async function fetchNotifications() {
            setLoading(true);
            try {
                const data = await mentorService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchNotifications();
    }, []);

    // Filter notifications
    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'Unread') return !notif.read;
        if (filter === 'Action Required') return notif.actionRequired;
        return true;
    });

    // Mark as read
    const markAsRead = async (id) => {
        try {
            await mentorService.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    // Mark all as read
    const markAllAsRead = async () => {
        try {
            await mentorService.markAllNotificationsAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    // Delete notification
    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (selectedNotification?.id === id) {
            setSelectedNotification(null);
        }
    };

    // Get icon based on notification type
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'booking_request':
            case 'booking_confirmed':
            case 'booking_cancelled':
                return <ClockIcon className="h-6 w-6" />;
            case 'message':
                return <EnvelopeIcon className="h-6 w-6" />;
            case 'session_reminder':
                return <BellIcon className="h-6 w-6" />;
            default:
                return <BellIcon className="h-6 w-6" />;
        }
    };

    // Get color based on type
    const getTypeColor = (type) => {
        switch (type) {
            case 'booking_request': return 'bg-blue-100 text-blue-600';
            case 'session_reminder': return 'bg-blue-100 text-blue-600';
            case 'message': return 'bg-green-100 text-green-600';
            case 'booking_confirmed': return 'bg-emerald-100 text-emerald-600';
            case 'booking_cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Notifications</h2>
                    <p className="text-slate-500 mt-1">
                        Stay updated with all your mentorship activities
                        {unreadCount > 0 && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                {unreadCount} unread
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={markAllAsRead}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2"
                >
                    <CheckCircleIcon className="h-4 w-4" />
                    Mark All as Read
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-md p-2 flex gap-2">
                {['All', 'Unread', 'Action Required'].map(status => (
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

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Notifications List */}
                <div className="lg:col-span-2 space-y-3">
                    {filteredNotifications.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <BellIcon className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No notifications</p>
                            <p className="text-slate-400 text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        filteredNotifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => {
                                    setSelectedNotification(notification);
                                    markAsRead(notification.id);
                                }}
                                className={`bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition ${
                                    !notification.read ? 'border-l-4 border-blue-500' : ''
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeColor(notification.type)}`}>
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-1">
                                            <h3 className="font-bold text-slate-800">{notification.title}</h3>
                                            {!notification.read && (
                                                <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-1.5"></span>
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{notification.message}</p>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span>{notification.timestamp}</span>
                                            {notification.actionRequired && (
                                                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                                                    Action Required
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNotification(notification.id);
                                        }}
                                        className="text-slate-400 hover:text-red-600 transition"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Notification Detail Panel */}
                <div className="lg:col-span-1">
                    {selectedNotification ? (
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Details</h3>
                                <button
                                    onClick={() => setSelectedNotification(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className={`h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 ${getTypeColor(selectedNotification.type)}`}>
                                {getNotificationIcon(selectedNotification.type)}
                            </div>

                            <h4 className="font-bold text-center text-slate-800 mb-2">{selectedNotification.title}</h4>
                            <p className="text-sm text-slate-600 text-center mb-4">{selectedNotification.message}</p>

                            {selectedNotification.relatedContext && (
                                <div className="bg-slate-50 rounded-lg p-4 mb-4 space-y-2">
                                    {Object.entries(selectedNotification.relatedContext).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm">
                                            <span className="text-slate-500 capitalize">{key.replace(/_/g, ' ')}:</span>
                                            <span className="font-semibold text-slate-800">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-slate-400 text-center mb-4">{selectedNotification.timestamp}</p>

                            {selectedNotification.actionRequired && (
                                <div className="space-y-2">
                                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition">
                                        Take Action
                                    </button>
                                    <button className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold transition">
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <BellIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">Select a notification to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

