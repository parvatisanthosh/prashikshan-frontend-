import React, { useState, useRef, useEffect } from 'react';
import { 
    ChatBubbleLeftRightIcon, 
    MagnifyingGlassIcon, 
    PaperAirplaneIcon,
    PaperClipIcon,
    FaceSmileIcon
} from '@heroicons/react/24/solid';
import mentorService from '../../services/mentorService';

export default function ChatMentorStudents() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Fetch contacts on mount
    useEffect(() => {
        async function fetchContacts() {
            setLoading(true);
            try {
                const data = await mentorService.getChatContacts();
                setContacts(data);
            } catch (error) {
                console.error('Error fetching contacts:', error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchContacts();
    }, []);

    // Load messages when contact is selected
    useEffect(() => {
        async function fetchMessages() {
            if (selectedContact && !messages[selectedContact.id]) {
                try {
                    const data = await mentorService.getChatMessages(selectedContact.id);
                    setMessages(prev => ({
                        ...prev,
                        [selectedContact.id]: data
                    }));
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            }
        }
        
        fetchMessages();
    }, [selectedContact]);

    // Scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, selectedContact]);

    // Filter contacts
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Send message
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        try {
            const result = await mentorService.sendChatMessage(selectedContact.id, newMessage);
            
            setMessages(prev => ({
                ...prev,
                [selectedContact.id]: [...(prev[selectedContact.id] || []), result.message]
            }));

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (loading) {
        return (
            <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading chat...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">Chat with Students</h2>
                <p className="text-slate-500 mt-1">Communicate with your assigned students in real-time.</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ height: '600px' }}>
                <div className="flex h-full">
                    {/* CONTACTS SIDEBAR */}
                    <div className="w-80 border-r border-slate-200 flex flex-col">
                        {/* Search Bar */}
                        <div className="p-4 border-b border-slate-200">
                            <div className="relative">
                                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="flex-1 overflow-y-auto">
                            {filteredContacts.map(contact => (
                                <div
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition ${
                                        selectedContact?.id === contact.id
                                            ? 'bg-blue-50 border-l-4 border-blue-600'
                                            : 'hover:bg-slate-50 border-l-4 border-transparent'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                            {contact.avatar}
                                        </div>
                                        {contact.online && (
                                            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                                        )}
                                    </div>

                                    {/* Contact Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h4 className="font-semibold text-slate-800 truncate">{contact.name}</h4>
                                            <span className="text-xs text-slate-500">{contact.timestamp}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 truncate">{contact.lastMessage}</p>
                                    </div>

                                    {/* Unread Badge */}
                                    {contact.unread > 0 && (
                                        <span className="bg-blue-600 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center">
                                            {contact.unread}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CHAT AREA */}
                    {selectedContact ? (
                        <div className="flex-1 flex flex-col">
                            {/* Chat Header */}
                            <div className="p-4 border-b border-slate-200 flex items-center gap-3">
                                <div className="relative">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-pink-500 flex items-center justify-center text-white font-bold">
                                        {selectedContact.avatar}
                                    </div>
                                    {selectedContact.online && (
                                        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-800">{selectedContact.name}</h3>
                                    <p className="text-xs text-slate-500">
                                        {selectedContact.online ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                                {(messages[selectedContact.id] || []).map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                                message.sender === 'mentor'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-slate-800 border border-slate-200'
                                            }`}
                                        >
                                            <p className="text-sm">{message.text}</p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    message.sender === 'mentor' ? 'text-blue-200' : 'text-slate-400'
                                                }`}
                                            >
                                                {message.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-200 bg-white">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="p-2 text-slate-400 hover:text-blue-600 transition"
                                        title="Attach file"
                                    >
                                        <PaperClipIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        className="p-2 text-slate-400 hover:text-blue-600 transition"
                                        title="Add emoji"
                                    >
                                        <FaceSmileIcon className="h-5 w-5" />
                                    </button>
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-2 rounded-lg transition"
                                        title="Send message"
                                    >
                                        <PaperAirplaneIcon className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-slate-50">
                            <div className="text-center">
                                <ChatBubbleLeftRightIcon className="h-20 w-20 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-600 mb-2">No Chat Selected</h3>
                                <p className="text-slate-500">Select a student from the list to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

