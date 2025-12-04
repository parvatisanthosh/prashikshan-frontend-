import React from 'react';
import { 
  HomeIcon, 
  UserGroupIcon, // For Assigned Students
  ClipboardDocumentCheckIcon, // For Pending Reviews
  ChatBubbleLeftRightIcon, // For Chat
  DocumentCheckIcon, // For Assessments
  DocumentChartBarIcon, // For Reports
  AcademicCapIcon, // For Manage Classes
  XMarkIcon
} from '@heroicons/react/24/solid';

// Updated NAV_ITEMS strictly according to your Flowchart
const NAV_ITEMS = [
  { name: 'Dashboard', icon: HomeIcon }, // Root "Faculty Dashboard" node
  { name: 'Manage Classes', icon: AcademicCapIcon },
  { name: 'Assigned Students', icon: UserGroupIcon },
  { name: 'Pending Reviews', icon: ClipboardDocumentCheckIcon, badge: 3 },
  { name: 'Assessments', icon: DocumentCheckIcon },
  { name: 'Reports and Signoff', icon: DocumentChartBarIcon },
  { name: 'Chat Faculty Student', icon: ChatBubbleLeftRightIcon },
];

export default function Sidebar({ open, activeTab, onClose, onNavigate }) {
  return (
    <>
      {/* Mobile Overlay - Clicking outside closes menu */}
      {open && (
        <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
            onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
  className={`
    fixed top-20 left-0
    h-[calc(100vh-80px)]
    w-64 bg-white border-r border-slate-200 z-50
    transform transition-transform duration-300 ease-in-out
    ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    flex flex-col
  `}
      >
        {/* Mobile Header Area (Logo/Close) inside sidebar 
           This element is used to push the navigation down visually on mobile.
        */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-slate-100">
             <span className="font-bold text-indigo-700 text-lg">Menu</span>
            <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"
            >
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>

        <div className="p-4 space-y-1 mt-2 flex-1 overflow-y-auto"> {/* Added flex-1 and overflow-y-auto */}
            <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 hidden md:block">Menu</p>
            
            {NAV_ITEMS.map((item) => (
                <button
                    key={item.name}
                    onClick={() => onNavigate(item.name)}
                    className={`
                        group flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                        ${activeTab === item.name 
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                    `}
                >
                    <div className="flex items-center">
                        <item.icon 
                            className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${activeTab === item.name ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'}`} 
                        />
                        {item.name}
                    </div>
                    {item.badge && (
                        <span className="bg-red-100 text-red-600 py-0.5 px-2.5 rounded-full text-xs font-bold">
                        {item.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
        
        {/* Bottom Section */}
        <div className="w-full p-4 border-t border-slate-100 bg-slate-50/50">
            <button 
                onClick={() => onNavigate('/')}
                className="w-full py-2 px-4 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
            >
                Sign Out
            </button>
        </div>
      </aside>
    </>
  );
}