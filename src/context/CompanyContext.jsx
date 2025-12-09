// src/context/CompanyContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within CompanyProvider");
  }
  return context;
};

export function CompanyProvider({ children }) {
  // Load from localStorage or use defaults
  const loadFromStorage = (key, defaultValue) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // ==================== APPLICANTS / STUDENTS ====================
  const [applicants, setApplicants] = useState(() =>
    loadFromStorage("company_applicants", [
      {
        id: "1",
        name: "Aditi Verma",
        email: "aditi@example.com",
        phone: "9876543210",
        roll: "CS101",
        skills: ["React", "JavaScript", "CSS", "Tailwind"],
        progress: 85,
        status: "new",
        avatar: null,
        position: "Frontend Developer Intern",
        appliedDate: "2 days ago",
        department: "Engineering",
        education: "B.Tech Computer Science",
        college: "IIT Delhi",
        graduationYear: "2024",
        location: "Delhi, India",
        expectedSalary: "₹8-10 LPA",
        noticePeriod: "Immediate",
        experienceYears: "1 year",
        linkedin: "https://linkedin.com/in/aditiverma",
        github: "https://github.com/aditiverma",
        portfolio: "https://aditiverma.dev",
        resumeUrl: "#",
        rating: 4.8,
        experience: [
          {
            title: "Frontend Intern",
            company: "StartupXYZ",
            duration: "Jun 2023 - Aug 2023",
            description: "Built responsive web applications using React and Tailwind CSS"
          }
        ],
        documents: [
          { name: "Resume.pdf", size: "245 KB" },
          { name: "Cover_Letter.pdf", size: "128 KB" }
        ]
      },
      {
        id: "2",
        name: "Rahul Singh",
        email: "rahul@example.com",
        phone: "9876543211",
        roll: "CS102",
        skills: ["Node.js", "Python", "MongoDB", "Express"],
        progress: 72,
        status: "reviewed",
        avatar: null,
        position: "Backend Developer Intern",
        appliedDate: "3 days ago",
        department: "Engineering",
        education: "B.Tech Information Technology",
        college: "NIT Trichy",
        graduationYear: "2024",
        location: "Chennai, India",
        expectedSalary: "₹10-12 LPA",
        noticePeriod: "2 weeks",
        experienceYears: "1.5 years",
        linkedin: "https://linkedin.com/in/rahulsingh",
        github: "https://github.com/rahulsingh",
        portfolio: null,
        resumeUrl: "#",
        rating: 4.5,
        experience: [
          {
            title: "Backend Developer",
            company: "TechCorp",
            duration: "Jan 2023 - Present",
            description: "Developed REST APIs using Node.js and MongoDB"
          }
        ],
        documents: [
          { name: "Resume.pdf", size: "312 KB" }
        ]
      },
      {
        id: "3",
        name: "Sneha Patel",
        email: "sneha@example.com",
        phone: "9876543212",
        roll: "CS103",
        skills: ["Figma", "UI/UX", "Adobe XD", "Sketch"],
        progress: 90,
        status: "shortlisted",
        avatar: null,
        position: "UI/UX Designer Intern",
        appliedDate: "1 day ago",
        department: "Design",
        education: "B.Des Visual Communication",
        college: "NID Ahmedabad",
        graduationYear: "2024",
        location: "Ahmedabad, India",
        expectedSalary: "₹6-8 LPA",
        noticePeriod: "Immediate",
        experienceYears: "6 months",
        linkedin: "https://linkedin.com/in/snehapatel",
        github: null,
        portfolio: "https://snehapatel.design",
        resumeUrl: "#",
        rating: 4.9,
        experience: [
          {
            title: "UI/UX Intern",
            company: "DesignStudio",
            duration: "Jul 2023 - Sep 2023",
            description: "Created user interfaces and conducted user research"
          }
        ],
        documents: [
          { name: "Resume.pdf", size: "189 KB" },
          { name: "Portfolio.pdf", size: "2.1 MB" }
        ]
      },
      {
        id: "4",
        name: "Arjun Kumar",
        email: "arjun@example.com",
        phone: "9876543213",
        roll: "CS104",
        skills: ["React", "Node.js", "AWS", "Docker"],
        progress: 88,
        status: "new",
        avatar: null,
        position: "Full Stack Developer Intern",
        appliedDate: "5 hours ago",
        department: "Engineering",
        education: "B.Tech Computer Science",
        college: "BITS Pilani",
        graduationYear: "2024",
        location: "Hyderabad, India",
        expectedSalary: "₹12-15 LPA",
        noticePeriod: "1 month",
        experienceYears: "2 years",
        linkedin: "https://linkedin.com/in/arjunkumar",
        github: "https://github.com/arjunkumar",
        portfolio: "https://arjun.dev",
        resumeUrl: "#",
        rating: 4.7,
        experience: [
          {
            title: "Full Stack Developer",
            company: "WebTech Solutions",
            duration: "Jun 2022 - Present",
            description: "Built and maintained full-stack web applications"
          }
        ],
        documents: [
          { name: "Resume.pdf", size: "278 KB" },
          { name: "Certificates.zip", size: "1.5 MB" }
        ]
      },
      {
        id: "5",
        name: "Priya Sharma",
        email: "priya@example.com",
        phone: "9876543214",
        roll: "CS105",
        skills: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
        progress: 78,
        status: "reviewed",
        avatar: null,
        position: "Data Science Intern",
        appliedDate: "1 week ago",
        department: "Data Science",
        education: "M.Tech Data Science",
        college: "IISc Bangalore",
        graduationYear: "2024",
        location: "Bangalore, India",
        expectedSalary: "₹15-18 LPA",
        noticePeriod: "Immediate",
        experienceYears: "1 year",
        linkedin: "https://linkedin.com/in/priyasharma",
        github: "https://github.com/priyasharma",
        portfolio: null,
        resumeUrl: "#",
        rating: 4.6,
        experience: [
          {
            title: "ML Research Intern",
            company: "AI Labs",
            duration: "May 2023 - Aug 2023",
            description: "Worked on NLP models and data analysis"
          }
        ],
        documents: [
          { name: "Resume.pdf", size: "298 KB" }
        ]
      }
    ])
  );

  // ==================== SELECTED STUDENTS ====================
  const [selectedStudents, setSelectedStudents] = useState(() =>
    loadFromStorage("company_selected", [
      {
        id: "s1",
        name: "Vikram Mehta",
        email: "vikram@example.com",
        phone: "9876543220",
        skills: ["React", "TypeScript", "GraphQL"],
        avatar: null,
        position: "Frontend Developer Intern",
        department: "Engineering",
        education: "B.Tech Computer Science",
        college: "VIT Vellore",
        selectedDate: "Jan 15, 2024",
        location: "Mumbai, India",
        expectedSalary: "₹10-12 LPA",
        linkedin: "https://linkedin.com/in/vikrammehta",
        github: "https://github.com/vikrammehta",
        rating: 4.7
      },
      {
        id: "s2",
        name: "Neha Gupta",
        email: "neha@example.com",
        phone: "9876543221",
        skills: ["Python", "Django", "PostgreSQL"],
        avatar: null,
        position: "Backend Developer Intern",
        department: "Engineering",
        education: "B.Tech IT",
        college: "DTU Delhi",
        selectedDate: "Jan 18, 2024",
        location: "Delhi, India",
        expectedSalary: "₹9-11 LPA",
        linkedin: "https://linkedin.com/in/nehagupta",
        github: "https://github.com/nehagupta",
        rating: 4.5
      },
      {
        id: "s3",
        name: "Amit Patel",
        email: "amit@example.com",
        phone: "9876543222",
        skills: ["UI/UX", "Figma", "Prototyping"],
        avatar: null,
        position: "UI/UX Designer Intern",
        department: "Design",
        education: "B.Des",
        college: "NIFT Mumbai",
        selectedDate: "Jan 20, 2024",
        location: "Mumbai, India",
        expectedSalary: "₹7-9 LPA",
        linkedin: "https://linkedin.com/in/amitpatel",
        github: null,
        rating: 4.8
      }
    ])
  );

  // ==================== REJECTED STUDENTS ====================
  const [rejectedStudents, setRejectedStudents] = useState(() =>
    loadFromStorage("company_rejected", [
      {
        id: "r1",
        name: "Rohan Roy",
        email: "rohan@example.com",
        phone: "9876543230",
        skills: ["Java", "Spring Boot"],
        avatar: null,
        position: "Java Developer Intern",
        department: "Engineering",
        education: "B.Tech CSE",
        college: "SRM University",
        rejectedDate: "Jan 10, 2024",
        rejectionReason: "Insufficient experience",
        location: "Chennai, India",
        linkedin: "https://linkedin.com/in/rohanroy",
        rating: 3.5
      },
      {
        id: "r2",
        name: "Megha Singh",
        email: "megha@example.com",
        phone: "9876543231",
        skills: ["Python", "Data Analysis"],
        avatar: null,
        position: "Data Analyst Intern",
        department: "Data Science",
        education: "BCA",
        college: "Christ University",
        rejectedDate: "Jan 12, 2024",
        rejectionReason: "Skills mismatch",
        location: "Bangalore, India",
        linkedin: "https://linkedin.com/in/meghasingh",
        rating: 3.2
      }
    ])
  );

  // ==================== RECRUITED STUDENTS ====================
  const [recruitedStudents, setRecruitedStudents] = useState(() =>
    loadFromStorage("company_recruited", [
      {
        id: "rec1",
        name: "Kavya Nair",
        email: "kavya@example.com",
        phone: "9876543240",
        skills: ["React", "Node.js", "MongoDB", "AWS"],
        avatar: null,
        position: "Full Stack Developer",
        department: "Engineering",
        education: "B.Tech Computer Science",
        college: "IIT Madras",
        recruitedDate: "Dec 15, 2023",
        startDate: "Feb 1, 2024",
        salary: "₹12 LPA",
        location: "Bangalore, India",
        linkedin: "https://linkedin.com/in/kavyanair",
        github: "https://github.com/kavyanair",
        rating: 4.9
      },
      {
        id: "rec2",
        name: "Sanjay Krishnan",
        email: "sanjay@example.com",
        phone: "9876543241",
        skills: ["Machine Learning", "Python", "TensorFlow"],
        avatar: null,
        position: "ML Engineer",
        department: "Data Science",
        education: "M.Tech AI",
        college: "IIT Bombay",
        recruitedDate: "Dec 20, 2023",
        startDate: "Jan 15, 2024",
        salary: "₹18 LPA",
        location: "Mumbai, India",
        linkedin: "https://linkedin.com/in/sanjaykrishnan",
        github: "https://github.com/sanjaykrishnan",
        rating: 4.8
      },
      {
        id: "rec3",
        name: "Ananya Reddy",
        email: "ananya@example.com",
        phone: "9876543242",
        skills: ["UI/UX", "Product Design", "Figma"],
        avatar: null,
        position: "Senior UI Designer",
        department: "Design",
        education: "M.Des",
        college: "NID Ahmedabad",
        recruitedDate: "Jan 5, 2024",
        startDate: "Feb 15, 2024",
        salary: "₹10 LPA",
        location: "Hyderabad, India",
        linkedin: "https://linkedin.com/in/ananyareddy",
        portfolio: "https://ananyareddy.design",
        rating: 4.7
      }
    ])
  );

  // ==================== JOB OPENINGS ====================
  const [activeOpenings, setActiveOpenings] = useState(() =>
    loadFromStorage("company_openings", [
      {
        id: "job1",
        title: "Frontend Developer Intern",
        description: "Looking for a passionate frontend developer with React experience...",
        skills: ["React", "JavaScript", "CSS", "Tailwind"],
        stipend: "₹15,000/month",
        salary: "₹15,000/month",
        duration: "3 months",
        mode: "Remote",
        type: "Internship",
        location: "Bangalore",
        department: "Engineering",
        applicants: 24,
        views: 156,
        status: "active",
        postedDate: "2 days ago",
        createdAt: new Date().toISOString()
      },
      {
        id: "job2",
        title: "Backend Developer Intern",
        description: "Join our backend team to build scalable APIs...",
        skills: ["Node.js", "Python", "MongoDB", "Express"],
        stipend: "₹18,000/month",
        salary: "₹18,000/month",
        duration: "6 months",
        mode: "Hybrid",
        type: "Internship",
        location: "Mumbai",
        department: "Engineering",
        applicants: 18,
        views: 132,
        status: "active",
        postedDate: "5 days ago",
        createdAt: new Date().toISOString()
      },
      {
        id: "job3",
        title: "UI/UX Designer Intern",
        description: "Design beautiful user interfaces and experiences...",
        skills: ["Figma", "Adobe XD", "UI/UX", "Prototyping"],
        stipend: "₹12,000/month",
        salary: "₹12,000/month",
        duration: "3 months",
        mode: "Remote",
        type: "Internship",
        location: "Delhi",
        department: "Design",
        applicants: 31,
        views: 245,
        status: "active",
        postedDate: "1 week ago",
        createdAt: new Date().toISOString()
      },
      {
        id: "job4",
        title: "Data Science Intern",
        description: "Work on ML models and data analysis...",
        skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
        stipend: "₹20,000/month",
        salary: "₹20,000/month",
        duration: "6 months",
        mode: "On-site",
        type: "Internship",
        location: "Hyderabad",
        department: "Data Science",
        applicants: 42,
        views: 312,
        status: "active",
        postedDate: "3 days ago",
        createdAt: new Date().toISOString()
      },
      {
        id: "job5",
        title: "DevOps Engineer Intern",
        description: "Learn and implement CI/CD pipelines...",
        skills: ["Docker", "Kubernetes", "AWS", "Linux"],
        stipend: "₹22,000/month",
        salary: "₹22,000/month",
        duration: "6 months",
        mode: "Hybrid",
        type: "Internship",
        location: "Pune",
        department: "DevOps",
        applicants: 15,
        views: 98,
        status: "paused",
        postedDate: "2 weeks ago",
        createdAt: new Date().toISOString()
      }
    ])
  );

  // ==================== NOTIFICATIONS ====================
  const [notifications, setNotifications] = useState(() =>
    loadFromStorage("company_notifications", [
      {
        id: "n1",
        type: "application",
        title: "New Application",
        message: "Aditi Verma applied for Frontend Developer Intern",
        time: "2 minutes ago",
        read: false,
        referenceId: "1"
      },
      {
        id: "n2",
        type: "interview",
        title: "Interview Scheduled",
        message: "Rahul Singh confirmed for 3 PM today",
        time: "1 hour ago",
        read: false,
        referenceId: "2"
      },
      {
        id: "n3",
        type: "message",
        title: "New Message",
        message: "You have a new message from Sneha Patel",
        time: "3 hours ago",
        read: false,
        referenceId: "3"
      },
      {
        id: "n4",
        type: "selected",
        title: "Student Selected",
        message: "Vikram Mehta has been selected for Frontend Developer role",
        time: "Yesterday",
        read: true,
        referenceId: "s1"
      },
      {
        id: "n5",
        type: "application",
        title: "New Application",
        message: "Arjun Kumar applied for Full Stack Developer Intern",
        time: "5 hours ago",
        read: false,
        referenceId: "4"
      }
    ])
  );

  // ==================== CHAT MESSAGES ====================
  const [chatMessages, setChatMessages] = useState(() =>
    loadFromStorage("company_chats", {
      "1": [
        { id: 1, from: "student", text: "Hello sir, I have applied for the Frontend Developer internship.", time: "10:30 AM", read: true },
        { id: 2, from: "company", text: "Hello Aditi! Yes, we received your application. Your profile looks impressive!", time: "10:45 AM", read: true },
        { id: 3, from: "student", text: "Thank you! When can I expect to hear about the next steps?", time: "10:48 AM", read: true },
        { id: 4, from: "company", text: "We'll be conducting interviews next week. We'll send you the schedule soon.", time: "11:00 AM", read: true },
      ],
      "2": [
        { id: 1, from: "student", text: "Good morning! I wanted to follow up on my application for Backend Developer position.", time: "9:00 AM", read: true },
        { id: 2, from: "company", text: "Hi Rahul, we're currently reviewing applications. You'll hear from us by end of this week.", time: "9:30 AM", read: true },
        { id: 3, from: "student", text: "Great, looking forward to it!", time: "9:35 AM", read: true },
      ],
      "3": [
        { id: 1, from: "student", text: "Hi! I'm excited about the UI/UX Designer role.", time: "2:00 PM", read: true },
        { id: 2, from: "company", text: "Hi Sneha! We loved your portfolio. Would you be available for a design challenge?", time: "2:15 PM", read: true },
        { id: 3, from: "student", text: "Absolutely! I'd love to participate.", time: "2:18 PM", read: false },
      ],
    })
  );

  // ==================== RECENT ACTIVITY ====================
  const [recentActivity, setRecentActivity] = useState(() =>
    loadFromStorage("company_activity", [
      { type: "application", description: "Aditi Verma applied for Frontend Developer", time: "2 min ago" },
      { type: "selected", description: "Vikram Mehta was selected for the role", time: "1 hour ago" },
      { type: "interview", description: "Interview scheduled with Rahul Singh", time: "3 hours ago" },
      { type: "message", description: "New message from Sneha Patel", time: "5 hours ago" },
      { type: "rejected", description: "Rohan Roy's application was rejected", time: "Yesterday" },
    ])
  );

  // ==================== SAVE TO LOCALSTORAGE ====================
  useEffect(() => {
    localStorage.setItem("company_applicants", JSON.stringify(applicants));
  }, [applicants]);

  useEffect(() => {
    localStorage.setItem("company_selected", JSON.stringify(selectedStudents));
  }, [selectedStudents]);

  useEffect(() => {
    localStorage.setItem("company_rejected", JSON.stringify(rejectedStudents));
  }, [rejectedStudents]);

  useEffect(() => {
    localStorage.setItem("company_recruited", JSON.stringify(recruitedStudents));
  }, [recruitedStudents]);

  useEffect(() => {
    localStorage.setItem("company_openings", JSON.stringify(activeOpenings));
  }, [activeOpenings]);

  useEffect(() => {
    localStorage.setItem("company_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("company_chats", JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem("company_activity", JSON.stringify(recentActivity));
  }, [recentActivity]);

  // ==================== APPLICANT ACTIONS ====================
  const getStudentById = (id) => {
    return applicants.find(a => a.id === id) ||
           selectedStudents.find(s => s.id === id) ||
           rejectedStudents.find(r => r.id === id) ||
           recruitedStudents.find(r => r.id === id);
  };

  const updateApplicantStatus = (id, status) => {
    setApplicants(prev => prev.map(a => 
      a.id === id ? { ...a, status } : a
    ));
  };

  const selectStudent = (id) => {
    const student = applicants.find(a => a.id === id);
    if (student) {
      const selectedStudent = {
        ...student,
        selectedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setSelectedStudents(prev => [...prev, selectedStudent]);
      setApplicants(prev => prev.filter(a => a.id !== id));
      addNotification({
        type: "selected",
        title: "Student Selected",
        message: `${student.name} has been selected for ${student.position}`,
        referenceId: id
      });
      addActivity({
        type: "selected",
        description: `${student.name} was selected for ${student.position}`
      });
    }
  };

  const rejectStudent = (id) => {
    const student = applicants.find(a => a.id === id);
    if (student) {
      const rejectedStudent = {
        ...student,
        rejectedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        rejectionReason: "Did not meet requirements"
      };
      setRejectedStudents(prev => [...prev, rejectedStudent]);
      setApplicants(prev => prev.filter(a => a.id !== id));
      addNotification({
        type: "rejected",
        title: "Student Rejected",
        message: `${student.name}'s application has been rejected`,
        referenceId: id
      });
      addActivity({
        type: "rejected",
        description: `${student.name}'s application was rejected`
      });
    }
  };

  const recruitStudent = (id) => {
    const student = selectedStudents.find(s => s.id === id);
    if (student) {
      const recruitedStudent = {
        ...student,
        recruitedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        startDate: "TBD",
        salary: student.expectedSalary || "As discussed"
      };
      setRecruitedStudents(prev => [...prev, recruitedStudent]);
      setSelectedStudents(prev => prev.filter(s => s.id !== id));
      addNotification({
        type: "recruited",
        title: "Student Recruited",
        message: `${student.name} has been recruited for ${student.position}`,
        referenceId: id
      });
      addActivity({
        type: "recruited",
        description: `${student.name} was recruited for ${student.position}`
      });
    }
  };

  // ==================== JOB OPENING ACTIONS ====================
  const addJobOpening = (job) => {
    const newJob = {
      ...job,
      id: `job${Date.now()}`,
      applicants: 0,
      views: 0,
      status: "active",
      postedDate: "Just now",
      createdAt: new Date().toISOString(),
      salary: job.stipend,
      type: "Internship"
    };
    setActiveOpenings(prev => [newJob, ...prev]);
    addNotification({
      type: "job",
      title: "New Job Published",
      message: `${job.title} is now live`,
      referenceId: newJob.id
    });
    addActivity({
      type: "job",
      description: `New job opening: ${job.title} was published`
    });
    return newJob;
  };

  const deleteOpening = (id) => {
    setActiveOpenings(prev => prev.filter(j => j.id !== id));
  };

  const toggleOpeningStatus = (id) => {
    setActiveOpenings(prev => prev.map(j => 
      j.id === id ? { ...j, status: j.status === "active" ? "paused" : "active" } : j
    ));
  };

  const getActiveJobs = () => {
    return activeOpenings.filter(j => j.status === "active");
  };

  // ==================== NOTIFICATION ACTIONS ====================
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: `n${Date.now()}`,
      time: "Just now",
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  // ==================== ACTIVITY ACTIONS ====================
  const addActivity = (activity) => {
    const newActivity = {
      ...activity,
      time: "Just now"
    };
    setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);
  };

  // ==================== CHAT ACTIONS ====================
  const sendMessage = (contactId, message) => {
    const newMessage = {
      id: Date.now(),
      from: "company",
      text: message.text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      read: false,
      file: message.file || null
    };
    setChatMessages(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), newMessage]
    }));
  };

  const getMessagesForContact = (contactId) => {
    return chatMessages[contactId] || [];
  };

  // ==================== STATS HELPERS ====================
  const getStats = () => {
    return {
      totalApplicants: applicants.length,
      totalSelected: selectedStudents.length,
      totalRejected: rejectedStudents.length,
      totalRecruited: recruitedStudents.length,
      activeOpeningsCount: activeOpenings.filter(j => j.status === "active").length,
      totalOpenings: activeOpenings.length,
      unreadNotifications: notifications.filter(n => !n.read).length
    };
  };

  const value = {
    // Applicants
    applicants,
    setApplicants,
    getStudentById,
    updateApplicantStatus,
    selectStudent,
    rejectStudent,
    recruitStudent,
    
    // Selected/Rejected/Recruited
    selectedStudents,
    rejectedStudents,
    recruitedStudents,
    
    // Job Openings
    activeOpenings,
    jobOpenings: activeOpenings, // Alias for backward compatibility
    addJobOpening,
    deleteOpening,
    toggleOpeningStatus,
    getActiveJobs,
    
    // Notifications
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getUnreadCount,
    
    // Activity
    recentActivity,
    addActivity,
    
    // Chat
    chatMessages,
    sendMessage,
    getMessagesForContact,
    
    // Stats
    getStats
  };

  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}