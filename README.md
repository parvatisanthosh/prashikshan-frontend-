# Prashikshan - Internship Management Platform

A comprehensive digital platform bridging the gap between academia and industry through seamless internship management and career development.

**Smart India Hackathon 2025**

---

## Table of Contents

- [About](#about)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Team](#team)
- [License](#license)

---

## About

Prashikshan is an internship management platform developed for Smart India Hackathon 2025. The platform addresses the critical need for structured, accessible, and efficient internship management aligned with NEP 2020 guidelines, with special focus on accessibility for rural and underserved students.

### Vision

Create an inclusive digital ecosystem that empowers every student—regardless of their geographical location or economic background—with equal access to quality internship opportunities and career development resources.

### Target Users

- Students seeking internship opportunities
- Educational institutions managing internship programs
- Faculty and academic mentors
- Companies offering internships
- Government bodies for policy implementation and monitoring

---

## Problem Statement

Current internship management systems face several challenges:

- Fragmented systems with no centralized platform
- Limited access for rural students due to connectivity issues
- Poor tracking and monitoring of student progress
- Communication gaps between stakeholders
- Time-consuming manual processes
- Lack of standardized evaluation
- Geographic and language barriers
- Inefficient matching between student skills and internship requirements
- No personalized career guidance or learning paths

Prashikshan addresses these challenges through an inclusive, accessible platform with offline-first architecture, multilingual support, multi-channel communication (SMS, WhatsApp, voice), and AI/ML-powered intelligent matching and recommendation systems.

---

## Key Features

### For Students
- Profile management with skills and achievements
- Smart internship search and application
- Offline capability for limited connectivity areas
- Multilingual voice interface (12+ Indian languages)
- Real-time chat with mentors and companies
- Activity tracking and digital logbook
- Multi-channel notifications (SMS, WhatsApp, Email)

### For Faculty
- Student progress monitoring
- Application approval workflows
- Performance analytics and reporting
- Batch communication tools
- Standardized evaluation forms

### For Companies
- Internship posting and management
- Candidate review and shortlisting
- Direct communication with applicants
- Performance tracking and feedback system

### For Government/Administration
- State-wide dashboard and analytics
- Institution performance monitoring
- NEP 2020 compliance tracking
- Data-driven policy insights
- Automated report generation

### AI/ML Powered Features

**Intelligent Skill Matching**
- AI algorithm matches student skills with internship requirements
- Analyzes student profile, academic performance, and project history
- Recommends internships based on skill gap analysis
- Provides match percentage for each opportunity

**Personalized Learning Roadmaps**
- GitHub integration to analyze student repositories and coding patterns
- Generates customized learning paths based on current skills and career goals
- Suggests relevant courses, projects, and resources
- Tracks progress and adjusts roadmap dynamically

**Automated Resume Screening**
- ML model screens and ranks applications for companies
- Extracts key information from resumes automatically
- Identifies best-fit candidates based on job requirements
- Reduces manual screening time by 80%

**Predictive Analytics**
- Predicts internship success probability for student-company pairs
- Forecasts placement trends and demand for specific skills
- Identifies at-risk students who need additional support
- Provides insights on emerging industry skill requirements

**Large Dataset Integration**
- Comprehensive internship database with 10,000+ opportunities
- Historical placement data for pattern recognition
- Industry skill requirement trends across sectors
- Student performance metrics for benchmarking

---

## Technology Stack

**Frontend**
- React.js 18.x
- React Router DOM
- Tailwind CSS
- Socket.io-client
- Axios

**Backend**
- Node.js 20.x
- Express.js 4.x
- Prisma ORM 5.x
- Socket.io
- JWT Authentication
- Bcrypt

**AI/ML Stack**
- Python 3.11
- TensorFlow / PyTorch
- Scikit-learn
- Natural Language Processing (NLP) libraries
- GitHub API integration
- Pandas & NumPy for data processing

**Database**
- PostgreSQL 15.x
- Large-scale dataset storage for training models

**External Services**
- Twilio (SMS & WhatsApp)
- AWS S3 / Cloudinary (File storage)
- SendGrid / AWS SES (Email)
- GitHub API (Repository analysis)

**DevOps**
- Docker & Docker Compose
- Git & GitHub

---

## Repositories

This project is organized into separate repositories for frontend and backend:

- **Backend:** [prashikshan-backend](https://github.com/parvatisanthosh/prashikshan-backend)
- **Frontend:** [prashikshan-frontend](https://github.com/parvatisanthosh/prashikshan-frontend-)

---

## Installation

### Prerequisites

- Node.js >= 20.x
- PostgreSQL >= 15.x
- Git
- Docker (optional, recommended)

### Quick Start with Docker

```bash
# Clone repository
git clone --recurse-submodules https://github.com/parvatisanthosh/GapBridgers-Prashikshan
cd GapBridgers-Prashikshan

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate dev

# Seed database (optional)
docker-compose exec backend npm run seed

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

### Manual Installation

**Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file
npx prisma migrate dev
npx prisma generate
npm run dev
```

**Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env file
npm start
```

---

## Configuration

Copy the `.env.example` files to `.env` in both frontend and backend directories and configure with your credentials:

**Backend:** Database URL, JWT secret, Twilio credentials, Email service, File storage  
**Frontend:** Backend API URL

Refer to `.env.example` files for all required variables.

---

## Usage

### Test Credentials

```
Student: arjun.patel@student.com / password123
Faculty: rajesh.verma@faculty.com / password123
Company: admin@prashikshan.com / password123
Admin: admin@test.com / password123
Company: careers@innovatelabs.com /password123
```

### API Documentation

For complete API documentation including all endpoints, refer to the Postman collection in `/docs` folder.

---

## Team

**Smart India Hackathon 2025**

| Role | Name | Contact |
|------|------|---------|
| Team Lead | Divyam Gupta | https://github.com/Divyam-Gupta2006 
| Team member | Vedant Sahu | https://github.com/vedantsahu06
| Team member | Prayag Srivastava | https://github.com/Prayag-Srivastava
| Team member | Suryansh Verma | https://github.com/suryansh030
| Team member | Parvati Santhosh | https://github.com/parvatisanthosh
| Team member | Tarush Verma | https://github.com/Tarush-Verma

**Organization:** Indian Institute of Information Technology Nagpur



## Contact

- contact-no: 9435141224 
- Project Repository: https://github.com/parvatisanthosh/GapBridgers_Prashikshan



Made with dedication for Smart India Hackathon 2025
