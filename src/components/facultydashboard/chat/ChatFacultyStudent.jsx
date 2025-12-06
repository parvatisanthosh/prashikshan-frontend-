import React, { useState, useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  MagnifyingGlassIcon,
  EllipsisVerticalIcon,
  DocumentIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  UserGroupIcon,
  PlusCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/solid";

// ----------------------------------------------------------------------
// SUB-COMPONENT: Message Bubble
// ----------------------------------------------------------------------
const MessageBubble = ({ msg, isMe }) => {
  return (
    <div className={`flex w-full mb-4 ${isMe ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div className={`max-w-[85%] md:max-w-[70%] flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white shadow-sm ${isMe ? "bg-indigo-600" : "bg-slate-400"}`}>
          {isMe ? "Me" : msg.sender[0]}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          <div
            className={`px-4 py-3 shadow-sm text-sm relative ${
              isMe
                ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm"
                : "bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-sm"
            }`}
          >
            {/* SENDER NAME (For Groups) */}
            {!isMe && msg.senderName && (
               <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">{msg.senderName}</p>
            )}

            {/* FILE ATTACHMENT */}
            {msg.type === "file" && (
              <div className={`flex items-center gap-3 p-3 rounded-xl mb-2 border ${isMe ? "bg-white/10 border-white/20" : "bg-slate-50 border-slate-200"}`}>
                <div className={`p-2 rounded-lg ${isMe ? "bg-white/20" : "bg-white"}`}>
                  <DocumentIcon className={`w-6 h-6 ${isMe ? "text-white" : "text-indigo-500"}`} />
                </div>
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-semibold truncate max-w-[140px]">{msg.fileName}</p>
                  <p className={`text-xs ${isMe ? "text-indigo-100" : "text-slate-500"}`}>{msg.fileSize}</p>
                </div>
                <button className={`p-1.5 rounded-full transition ${isMe ? "hover:bg-white/20" : "hover:bg-slate-200"}`}>
                  <ArrowDownTrayIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TEXT */}
            {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
          </div>

          <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium">
            {msg.time}
          </span>
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// MAIN COMPONENT
// ----------------------------------------------------------------------
export default function ChatSystem() {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);
  
  // GROUP CREATION STATE
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedStudentsForGroup, setSelectedStudentsForGroup] = useState([]);

  // FILE UPLOAD STATE
  const [stagedFile, setStagedFile] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // DATA: Unified 'chats' list (contains both students and groups)
  const [chats, setChats] = useState([
    { id: 1, type: "student", name: "Aditi Verma", rollNo: "CS21045", online: true, lastMsg: "Sent the PDF", unread: 2 },
    { id: 2, type: "student", name: "Rahul Singh", rollNo: "CS21088", online: false, lastMsg: "Okay sir", unread: 0 },
    { id: 3, type: "student", name: "Sneha Patel", rollNo: "CS21012", online: true, lastMsg: "Query regarding...", unread: 0 },
  ]);
  
  const [activeChat, setActiveChat] = useState(null);

  // MESSAGES
  const [messages, setMessages] = useState([
    { id: 1, type: "text", text: "Please submit your logs by EOD.", sender: "Me", time: "10:00 AM" },
    { id: 2, type: "text", text: "Sure sir, uploading it now.", sender: "Aditi", time: "10:05 AM" },
  ]);

  // SCROLL & INIT
  useEffect(() => {
    if (window.innerWidth >= 768 && !activeChat) {
      setActiveChat(chats[0]);
      setShowMobileList(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat, stagedFile]);


  // ------------------------------------------------
  // HANDLERS
  // ------------------------------------------------
  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedStudentsForGroup.length === 0) return;

    const newGroup = {
      id: Date.now(),
      type: "group",
      name: newGroupName,
      members: selectedStudentsForGroup, // Array of student IDs
      lastMsg: "Group created",
      unread: 0,
      online: false // Groups don't have online status usually
    };

    setChats([newGroup, ...chats]);
    setIsGroupModalOpen(false);
    setNewGroupName("");
    setSelectedStudentsForGroup([]);
    setActiveChat(newGroup); // Switch to new group immediately
    setShowMobileList(false); // Go to chat view (mobile)
    
    // Add system message
    setMessages([{ id: Date.now(), type: "text", text: `Group "${newGroupName}" created.`, sender: "Me", time: "Now" }]);
  };

  const toggleStudentSelection = (id) => {
    if (selectedStudentsForGroup.includes(id)) {
      setSelectedStudentsForGroup(selectedStudentsForGroup.filter(sid => sid !== id));
    } else {
      setSelectedStudentsForGroup([...selectedStudentsForGroup, id]);
    }
  };

  const handleSend = () => {
    if (!input.trim() && !stagedFile) return;
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMsgs = [];

    if (stagedFile) {
      newMsgs.push({
        id: Date.now() + 1,
        type: "file",
        fileName: stagedFile.name,
        fileSize: stagedFile.size,
        sender: "Me",
        time: time,
      });
    }

    if (input.trim()) {
      newMsgs.push({
        id: Date.now(),
        type: "text",
        text: input,
        sender: "Me",
        time: time,
      });
    }

    setMessages([...messages, ...newMsgs]);
    setInput("");
    setStagedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStagedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB",
        type: file.type,
      });
    }
    e.target.value = null;
  };

  return (
    <div className="flex flex-col md:flex-row h-[85vh] bg-white md:rounded-2xl md:shadow-2xl md:border md:border-slate-200 overflow-hidden font-sans relative">
      
      {/* HIDDEN INPUTS */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />

      {/* ------------------------------------------------ */}
      {/* GROUP CREATION MODAL */}
      {/* ------------------------------------------------ */}
      {isGroupModalOpen && (
        <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-bold text-slate-800">Create New Group</h2>
              <button onClick={() => setIsGroupModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Group Name */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Group Name</label>
                <input 
                  className="w-full mt-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Final Year Project"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                />
              </div>

              {/* Member Selection */}
              <div>
                 <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Add Members</label>
                 <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                    {chats.filter(c => c.type === 'student').map(student => (
                      <div 
                        key={student.id}
                        onClick={() => toggleStudentSelection(student.id)}
                        className={`flex items-center justify-between p-3 cursor-pointer hover:bg-slate-50 transition
                          ${selectedStudentsForGroup.includes(student.id) ? 'bg-indigo-50' : ''}
                        `}
                      >
                         <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                              ${[1,4,7].includes(student.id % 9) ? "bg-indigo-500" : "bg-emerald-500"}
                           `}>
                              {student.name[0]}
                           </div>
                           <div>
                              <p className="text-sm font-semibold text-slate-800">{student.name}</p>
                              <p className="text-xs text-slate-500">{student.rollNo}</p>
                           </div>
                         </div>
                         {selectedStudentsForGroup.includes(student.id) ? (
                            <CheckCircleIcon className="w-6 h-6 text-indigo-600" />
                         ) : (
                            <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                         )}
                      </div>
                    ))}
                 </div>
                 <p className="text-xs text-slate-400 mt-2 text-right">{selectedStudentsForGroup.length} selected</p>
              </div>

              <button 
                onClick={handleCreateGroup}
                disabled={!newGroupName.trim() || selectedStudentsForGroup.length === 0}
                className={`w-full py-3 rounded-lg font-bold text-white transition-all
                  ${(!newGroupName.trim() || selectedStudentsForGroup.length === 0) 
                    ? "bg-slate-300 cursor-not-allowed" 
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"}
                `}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}


      {/* ---------------- SIDEBAR ---------------- */}
      <div className={`
        w-full md:w-80 bg-white border-r border-slate-100 flex flex-col
        ${showMobileList ? "flex" : "hidden md:flex"} 
      `}>
        {/* Header with Add Group Button */}
        <div className="p-4 border-b border-slate-100 bg-white z-10">
          <div className="flex justify-between items-center mb-4">
             <h1 className="text-xl font-bold text-slate-800">Messages</h1>
             <button 
               onClick={() => setIsGroupModalOpen(true)}
               className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-full transition tooltip"
               title="Create Group"
             >
                <PlusCircleIcon className="w-6 h-6" />
             </button>
          </div>

          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-0 ring-1 ring-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" 
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {chats.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(chat => (
            <div 
              key={chat.id} 
              onClick={() => { setActiveChat(chat); setShowMobileList(false); }}
              className={`flex items-center gap-4 p-4 cursor-pointer transition border-b border-slate-50 hover:bg-slate-50
                ${activeChat?.id === chat.id ? "bg-indigo-50/60" : ""}
              `}
            >
              {/* Avatar Logic */}
              <div className="relative shrink-0">
                {chat.type === 'group' ? (
                   <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <UserGroupIcon className="w-6 h-6" />
                   </div>
                ) : (
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white shadow-sm
                      ${chat.id === 1 ? "bg-indigo-500" : chat.id === 2 ? "bg-purple-500" : "bg-emerald-500"}
                   `}>
                      {chat.name[0]}
                   </div>
                )}
                {chat.online && <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <h3 className={`font-semibold truncate text-base ${activeChat?.id === chat.id ? "text-indigo-900" : "text-slate-900"}`}>
                    {chat.name}
                    {chat.type === 'student' && <span className="ml-2 text-xs font-normal text-slate-400">({chat.rollNo})</span>}
                  </h3>
                  <span className="text-xs text-slate-400">10:23 AM</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className={`text-sm truncate ${chat.unread > 0 ? "font-semibold text-slate-700" : "text-slate-500"}`}>
                    {chat.type === 'group' ? <span className="text-indigo-500 mr-1">Group:</span> : null}
                    {chat.lastMsg}
                  </p>
                  {chat.unread > 0 && (
                    <span className="bg-indigo-600 text-white text-[10px] h-5 min-w-[1.25rem] px-1 rounded-full flex items-center justify-center font-bold">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- CHAT AREA ---------------- */}
      <div className={`
        flex-1 flex flex-col bg-[#F8FAFC] relative
        ${!showMobileList ? "flex" : "hidden md:flex"}
      `}>
        
        {activeChat ? (
          <>
            {/* CHAT HEADER */}
            <div className="bg-white p-3 md:p-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-20">
              <div className="flex items-center gap-3">
                <button onClick={() => setShowMobileList(true)} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-full">
                  <ArrowLeftIcon className="w-6 h-6" />
                </button>
                
                <div className={`w-10 h-10 flex items-center justify-center font-bold shrink-0
                   ${activeChat.type === 'group' ? "rounded-xl bg-indigo-100 text-indigo-600" : "rounded-full bg-indigo-100 text-indigo-600"}
                `}>
                  {activeChat.type === 'group' ? <UserGroupIcon className="w-6 h-6" /> : activeChat.name[0]}
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 leading-tight">
                    {activeChat.name}
                    {activeChat.type === 'student' && <span className="ml-2 text-sm font-medium text-slate-400">({activeChat.rollNo})</span>}
                  </h2>
                  {activeChat.type === 'group' ? (
                     <p className="text-xs text-slate-500">{activeChat.members.length} members</p>
                  ) : (
                     <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        {activeChat.online ? "Online" : "Offline"}
                     </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-400">
                <button className="p-2 hover:bg-slate-100 rounded-full"><EllipsisVerticalIcon className="w-6 h-6" /></button>
              </div>
            </div>

            {/* MESSAGES LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50/50">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} msg={msg} isMe={msg.sender === "Me"} />
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* FOOTER / INPUT */}
            <div className="bg-white p-3 md:p-4 border-t border-slate-200 relative">
              
              {/* STAGED FILE PREVIEW */}
              {stagedFile && (
                <div className="absolute bottom-full left-0 right-0 p-3 mx-4 mb-2 bg-white rounded-xl shadow-lg border border-indigo-100 flex items-center gap-3 animate-in slide-in-from-bottom-2">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <DocumentIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-slate-800">{stagedFile.name}</p>
                    <p className="text-xs text-slate-500">{stagedFile.size} • Ready to send</p>
                  </div>
                  <button onClick={() => setStagedFile(null)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}

              <div className="flex items-end gap-2 max-w-4xl mx-auto">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                >
                  <PaperClipIcon className="w-6 h-6" />
                </button>
                
                <div className="flex-1 bg-slate-100 rounded-2xl border border-transparent focus-within:border-indigo-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all flex items-center">
                  <textarea 
                    rows={1}
                    className="w-full bg-transparent px-4 py-3 outline-none text-slate-800 placeholder-slate-400 resize-none max-h-32"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if(e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                </div>

                <button 
                  onClick={handleSend}
                  disabled={!input.trim() && !stagedFile}
                  className={`p-3 rounded-full shadow-sm flex items-center justify-center transition-all duration-200
                    ${(input.trim() || stagedFile)
                      ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md transform active:scale-95" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"}
                  `}
                >
                  <PaperAirplaneIcon className="w-5 h-5 -ml-0.5 mt-0.5 -rotate-45" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* EMPTY STATE (Desktop) */
          <div className="hidden md:flex flex-col items-center justify-center h-full text-center p-8 bg-slate-50">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <PaperAirplaneIcon className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Your Messages</h2>
            <p className="text-slate-500 max-w-sm mt-2">
              Select a student from the sidebar to start chatting, or create a new group.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}