/**
 * Shared Mock Data for Courses
 * Used by both CoursesPage and Trending components
 * Backend will replace this data later
 */

export const COURSES_MOCK_DATA = [
  {
    id: "yt001",
    title: "CS50's Introduction to Computer Science",
    type: "youtube",
    provider: "Harvard University",
    author: "David J. Malan",
    description: "An introduction to the intellectual enterprises of computer science and the art of programming. Covers C, Python, SQL, and more.",
    numVideos: 11,
    estimatedHours: 25,
    price: 0,
    currency: "INR",
    level: "Beginner",
    language: "English",
    tags: ["CS50", "Computer Science", "C", "Python"],
    rating: 4.9,
    reviewsCount: 15000,
    enrolledCount: 5000000,
    lastUpdated: "2024-01-01",
    hasCertificate: false,
    hasLifetimeAccess: true,
    image: "https://i.ytimg.com/vi/8mAITcNt710/maxresdefault.jpg",

    category: "Development",
    externalUrl: "https://www.youtube.com/playlist?list=PLhQjrBD2T382_R182iC2gNZI9HzWFMC_8",
    duration: "25 hours",
    students: 5000000,
    roadmap: [{ module: "Week 0: Scratch", lessons: 1, hours: 2 }, { module: "Week 1: C", lessons: 1, hours: 3 }]
  },
  {
    id: "yt002",
    title: "React JS - Full Course for Beginners",
    type: "youtube",
    provider: "freeCodeCamp",
    author: "Bob Ziroll",
    description: "Learn React JS from scratch in this full course. You will learn about components, props, state, hooks, and build a project.",
    numVideos: 1,
    estimatedHours: 12,
    price: 0,
    currency: "INR",
    level: "Intermediate",
    language: "English",
    tags: ["React", "JavaScript", "Frontend"],
    rating: 4.8,
    reviewsCount: 8500,
    enrolledCount: 2100000,
    lastUpdated: "2023-12-10",
    hasCertificate: false,
    hasLifetimeAccess: true,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Development",
    externalUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
    duration: "12 hours",
    students: 2100000,
    roadmap: [{ module: "React Basics", lessons: 1, hours: 12 }]
  },
  {
    id: "yt003",
    title: "Python for Beginners - Full Course",
    type: "youtube",
    provider: "Programming with Mosh",
    author: "Mosh Hamedani",
    description: "Python tutorial for beginners. Learn Python programming for a career in machine learning, data science, and web development.",
    numVideos: 1,
    estimatedHours: 6,
    price: 0,
    currency: "INR",
    level: "Beginner",
    language: "English",
    tags: ["Python", "Coding", "Backend"],
    rating: 4.9,
    reviewsCount: 45000,
    enrolledCount: 3500000,
    lastUpdated: "2024-02-15",
    hasCertificate: false,
    hasLifetimeAccess: true,
    image: "https://images.unsplash.com/photo-1649180556628-9ba704115795?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Development",
    externalUrl: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
    duration: "6 hours",
    students: 3500000,
    roadmap: [{ module: "Python Essentials", lessons: 1, hours: 6 }]
  },
  {
    id: "yt004",
    title: "Figma UI Design Tutorial",
    type: "youtube",
    provider: "Envato Tuts+",
    author: "Daniel White",
    description: "Learn UI Design using Figma. This comprehensive course covers design principles, wireframing, prototyping, and more.",
    numVideos: 1,
    estimatedHours: 8,
    price: 0,
    currency: "INR",
    level: "Beginner",
    language: "English",
    tags: ["Figma", "UI Design", "Design"],
    rating: 4.7,
    reviewsCount: 5600,
    enrolledCount: 980000,
    lastUpdated: "2024-01-20",
    hasCertificate: false,
    hasLifetimeAccess: true,
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Design",
    externalUrl: "https://www.youtube.com/watch?v=jxlpSynICKs",
    duration: "8 hours",
    students: 980000,
    roadmap: [{ module: "Figma Basics", lessons: 1, hours: 8 }]
  },
  {
    id: "yt005",
    title: "Data Science with Python",
    type: "youtube",
    provider: "Simplilearn",
    author: "Simplilearn Team",
    description: "Complete Data Science course covering pandas, NumPy, matplotlib, machine learning, and real-world projects.",
    numVideos: 1,
    estimatedHours: 15,
    price: 499,
    currency: "INR",
    level: "Intermediate",
    language: "English",
    tags: ["Data Science", "Python", "Analytics"],
    rating: 4.6,
    reviewsCount: 3200,
    enrolledCount: 450000,
    lastUpdated: "2024-02-01",
    hasCertificate: true,
    hasLifetimeAccess: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Development",
    externalUrl: "https://www.youtube.com/watch?v=BBMdWJVwFI4",
    duration: "15 hours",
    students: 450000,
    roadmap: [
      { module: "Python Basics", lessons: 1, hours: 3 },
      { module: "Data Analysis", lessons: 1, hours: 6 },
      { module: "Machine Learning", lessons: 1, hours: 6 }
    ]
  },
  {
    id: "yt006",
    title: "Web Development with Node.js",
    type: "youtube",
    provider: "The Net Ninja",
    author: "Shaun Pelling",
    description: "Build modern web applications with Node.js and Express. Learn REST APIs, databases, and deployment.",
    numVideos: 1,
    estimatedHours: 18,
    price: 299,
    currency: "INR",
    level: "Intermediate",
    language: "English",
    tags: ["Node.js", "Backend", "Web Development"],
    rating: 4.8,
    reviewsCount: 6800,
    enrolledCount: 1800000,
    lastUpdated: "2024-02-10",
    hasCertificate: true,
    hasLifetimeAccess: true,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "Development",
    externalUrl: "https://www.youtube.com/watch?v=qPHpmvvfSDc",
    duration: "18 hours",
    students: 1800000,
    roadmap: [
      { module: "Node.js Basics", lessons: 1, hours: 4 },
      { module: "Express.js", lessons: 1, hours: 6 },
      { module: "Databases", lessons: 1, hours: 8 }
    ]
  }
];

/**
 * Get limited courses for Trending section (show first 4)
 */
export const getTrendingCourses = () => {
  return COURSES_MOCK_DATA.slice(0, 4);
};

/**
 * Get all courses for CoursesPage
 */
export const getAllCourses = () => {
  return COURSES_MOCK_DATA;
};
