// src/pages/company/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  DocumentIcon,
  XMarkIcon,
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import { useCompany } from "../../context/CompanyContext";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Chat() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { applicants = [], selectedStudents = [], chatMessages, sendMessage } =
    useCompany();

  // Combine all students for chat contacts
  const allStudents = [...applicants, ...selectedStudents];

  // Create contacts from students
  const contacts = allStudents.map((student, index) => ({
    id: student.id,
    name: student.name,
    avatar: student.avatar,
    role: student.position || "Applicant",
    email: student.email,
    lastMessage:
      chatMessages[student.id]?.slice(-1)[0]?.text ||
      "Start a conversation...",
    time: chatMessages[student.id]?.slice(-1)[0]?.time || "",
    online: index < 3,
    unread: index === 0 ? 2 : index === 2 ? 1 : 0,
  }));

  // Get student from URL params if provided
  const studentIdFromUrl = searchParams.get("student");
  const initialContact = studentIdFromUrl
    ? contacts.find((c) => c.id === studentIdFromUrl) || contacts[0]
    : contacts[0];

  const [selectedContact, setSelectedContact] = useState(initialContact);
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isMobileContactsVisible, setIsMobileContactsVisible] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentMessages = selectedContact
    ? chatMessages[selectedContact.id] || []
    : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedContact]);

  useEffect(() => {
    if (studentIdFromUrl) {
      const contact = contacts.find((c) => c.id === studentIdFromUrl);
      if (contact) {
        setSelectedContact(contact);
        setIsMobileContactsVisible(false); // show chat directly on mobile
      }
    }
  }, [studentIdFromUrl]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview({ type: "image", url: reader.result, name: file.name });
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview({
          type: "file",
          name: file.name,
          size: formatFileSize(file.size),
        });
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = () => {
    if (input.trim() === "" && !selectedFile) return;
    if (!selectedContact) return;

    const messageData = {
      text: input || (selectedFile ? `Sent a file: ${selectedFile.name}` : ""),
      file: selectedFile
        ? {
            name: selectedFile.name,
            type: selectedFile.type,
            size: formatFileSize(selectedFile.size),
            preview: filePreview,
          }
        : null,
    };

    sendMessage(selectedContact.id, messageData);
    setInput("");
    removeFile();
    // typing simulation removed
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ContactInfoContent = () => {
    if (!selectedContact) return null;
    return (
      <>
        {/* Close button for mobile bottom sheet */}
        <div className="md:hidden flex justify-end mb-2">
          <button
            onClick={() => setShowContactInfo(false)}
            className="p-1.5 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
            {selectedContact.name.charAt(0)}
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">
            {selectedContact.name}
          </h3>
          <p className="text-blue-600 font-medium">{selectedContact.role}</p>
          <p className="text-gray-500 text-sm mt-1">{selectedContact.email}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() =>
              navigate(`/company/student/${selectedContact.id}`)
            }
            className="w-full py-2.5 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            View Full Profile
          </button>
          <button className="w-full py-2.5 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
            Schedule Interview
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">Shared Files</h4>
          <p className="text-sm text-gray-500">No files shared yet</p>
        </div>
      </>
    );
  };

  if (!selectedContact) {
    return (
      <div
        className="
          px-3 py-3 sm:p-6 max-w-7xl mx-auto
          h-[calc(100vh-120px)] sm:h-[calc(100vh-150px)] lg:h-[calc(100vh-180px)]
          flex items-center justify-center
        "
      >
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <PaperAirplaneIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No conversations yet
          </h3>
          <p className="text-gray-500 mb-4">Start chatting with applicants</p>
          <button
            onClick={() => navigate("/company/applicants")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Applicants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        px-3 py-3 sm:p-6 max-w-7xl mx-auto
        h-[calc(100vh-120px)] sm:h-[calc(100vh-150px)] lg:h-[calc(100vh-180px)]
        flex flex-col
      "
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Chat with applicants and candidates
        </p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        {/* Contacts Sidebar */}
        <div
          className={`${
            isMobileContactsVisible ? "flex" : "hidden"
          } md:flex w-full md:w-80 md:border-r border-gray-100 flex-col bg-gradient-to-b from-gray-50 to-white`}
        >
          {/* Search */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <MagnifyingGlassIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          {/* Contact List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.length > 0 ? (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => {
                    setSelectedContact(contact);
                    setIsMobileContactsVisible(false); // mobile: go to chat
                  }}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-200 border-l-4 ${
                    selectedContact.id === contact.id
                      ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-l-blue-500"
                      : "border-l-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ${
                        selectedContact.id === contact.id
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                          : "bg-gradient-to-br from-gray-400 to-gray-500"
                      }`}
                    >
                      {contact.name.charAt(0)}
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex itemsCenter justify-between">
                      <h4
                        className={`font-semibold truncate ${
                          selectedContact.id === contact.id
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {contact.name}
                      </h4>
                      <span className="text-xs text-gray-400">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 truncate mt-0.5 font-medium">
                      {contact.role}
                    </p>
                    <p className="text-sm text-gray-500 truncate mt-1">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unread > 0 && (
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-xs text-white font-bold">
                        {contact.unread}
                      </span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">No contacts found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex-col ${
            isMobileContactsVisible ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Chat Header */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Back button on mobile */}
              <button
                className="md:hidden mr-1 p-1.5 rounded-full hover:bg-gray-100"
                onClick={() => setIsMobileContactsVisible(true)}
              >
                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
              </button>

              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                  {selectedContact.name.charAt(0)}
                </div>
                {selectedContact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {selectedContact.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {selectedContact.online ? (
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                      Active now
                    </span>
                  ) : (
                    "Last seen recently"
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
                <PhoneIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
              <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors group">
                <VideoCameraIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
              <button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors group"
              >
                <InformationCircleIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-gray-50/80 to-white">
            {/* Date Divider */}
            <div className="flex items-center justify-center">
              <span className="px-4 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-500 font-medium shadow-sm">
                Today
              </span>
            </div>

            {currentMessages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex ${
                  msg.from === "company" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] sm:max-w-md rounded-2xl shadow-sm ${
                    msg.from === "company"
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                  }`}
                >
                  {/* File Attachment */}
                  {msg.file && (
                    <div
                      className={`p-3 ${
                        msg.text ? "border-b border-white/20" : ""
                      }`}
                    >
                      {msg.file.preview?.type === "image" ? (
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={msg.file.preview.url}
                            alt={msg.file.name}
                            className="max-w-full h-auto max-h-48 object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            msg.from === "company"
                              ? "bg-white/10"
                              : "bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              msg.from === "company"
                                ? "bg-white/20"
                                : "bg-blue-100"
                            }`}
                          >
                            <DocumentIcon
                              className={`w-5 h-5 ${
                                msg.from === "company"
                                  ? "text-white"
                                  : "text-blue-600"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">
                              {msg.file.name}
                            </p>
                            <p
                              className={`text-xs ${
                                msg.from === "company"
                                  ? "text-blue-100"
                                  : "text-gray-500"
                              }`}
                            >
                              {msg.file.size}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Message Text */}
                  {msg.text && !msg.file && (
                    <div className="px-4 py-3">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  )}

                  {msg.text && msg.file && (
                    <div className="px-4 py-2">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  )}

                  {/* Time & Read Status */}
                  <div
                    className={`flex items-center justify-end gap-1.5 px-4 pb-2.5 ${
                      msg.from === "company"
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    <span className="text-xs">{msg.time}</span>
                    {msg.from === "company" && (
                      <div className="flex -space-x-1">
                        <CheckIcon className="w-3.5 h-3.5" />
                        <CheckIcon className="w-3.5 h-3.5 text-blue-200" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* typing indicator removed */}

            <div ref={messagesEndRef} />
          </div>

          {/* File Preview */}
          {filePreview && (
            <div className="px-4 sm:px-6 py-3 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                {filePreview.type === "image" ? (
                  <img
                    src={filePreview.url}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <DocumentIcon className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {filePreview.name}
                  </p>
                  {filePreview.size && (
                    <p className="text-sm text-gray-500">
                      {filePreview.size}
                    </p>
                  )}
                </div>
                <button
                  onClick={removeFile}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* File Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-xl transition-colors group relative"
              >
                <PaperClipIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-600" />
              </button>

              {/* Message Input */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() && !selectedFile}
                className={`p-2.5 sm:p-3 rounded-xl transition-all duration-200 ${
                  input.trim() || selectedFile
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-105"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info Sidebar – desktop */}
        {showContactInfo && (
          <div className="hidden md:block w-80 border-l border-gray-100 bg-white p-6 overflow-y-auto">
            <ContactInfoContent />
          </div>
        )}
      </div>

      {/* Contact Info – mobile bottom sheet */}
      {showContactInfo && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/30 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto">
            <ContactInfoContent />
          </div>
        </div>
      )}
    </div>
  );
}