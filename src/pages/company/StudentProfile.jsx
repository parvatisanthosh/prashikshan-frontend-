// src/pages/company/StudentProfile.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCompany } from '../../context/CompanyContext';
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Download,
  MessageSquare,
  Star,
  ExternalLink,
  FileText,
  Award,
  Github,
  Linkedin,
  Globe,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applicants, selectedStudents, rejectedStudents, recruitedStudents, selectStudent, rejectStudent } = useCompany();

  // Find student from all lists
  const student = 
    applicants?.find(a => a.id === id) ||
    selectedStudents?.find(s => s.id === id) ||
    rejectedStudents?.find(r => r.id === id) ||
    recruitedStudents?.find(r => r.id === id);

  if (!student) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Student not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  // Determine student status
  const isSelected = selectedStudents?.some(s => s.id === id);
  const isRejected = rejectedStudents?.some(r => r.id === id);
  const isRecruited = recruitedStudents?.some(r => r.id === id);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-500">View complete profile details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-start gap-6">
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-gray-100">
                  {student.name?.charAt(0) || 'U'}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                    <p className="text-blue-600 font-medium">{student.position}</p>
                    
                    {/* Status Badge */}
                    <div className="mt-2">
                      {isRecruited && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full inline-flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          Recruited
                        </span>
                      )}
                      {isSelected && !isRecruited && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full inline-flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Selected
                        </span>
                      )}
                      {isRejected && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full inline-flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          Rejected
                        </span>
                      )}
                      {!isSelected && !isRejected && !isRecruited && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full inline-flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Under Review
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold">{student.rating || '4.5'}</span>
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {student.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    {student.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {student.location || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate(`/company/chat?student=${student.id}`)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                Send Message
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Download Resume
              </button>
              {!isSelected && !isRejected && !isRecruited && (
                <>
                  <button
                    onClick={() => selectStudent(student.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Select
                  </button>
                  <button
                    onClick={() => rejectStudent(student.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Education
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{student.education || 'B.Tech Computer Science'}</h4>
                  <p className="text-gray-500">{student.college || 'University Name'}</p>
                  <p className="text-sm text-gray-400">{student.graduationYear || '2024'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(student.skills || ['React', 'JavaScript', 'Node.js', 'Python', 'SQL', 'Git']).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Experience
            </h3>
            <div className="space-y-4">
              {(student.experience || [
                {
                  title: 'Software Development Intern',
                  company: 'Tech Company',
                  duration: 'Jun 2023 - Aug 2023',
                  description: 'Worked on building web applications using React and Node.js'
                }
              ]).map((exp, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{exp.title}</h4>
                    <p className="text-gray-500">{exp.company}</p>
                    <p className="text-sm text-gray-400">{exp.duration}</p>
                    <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Applied For</span>
                <span className="font-medium text-gray-900">{student.position}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Applied On</span>
                <span className="font-medium text-gray-900">{student.appliedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Experience</span>
                <span className="font-medium text-gray-900">{student.experienceYears || '1 year'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Expected CTC</span>
                <span className="font-medium text-gray-900">{student.expectedSalary || '₹8-10 LPA'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Notice Period</span>
                <span className="font-medium text-gray-900">{student.noticePeriod || 'Immediate'}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
            <div className="space-y-3">
              <a
                href={student.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Linkedin className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">LinkedIn Profile</span>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </a>
              <a
                href={student.github || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Github className="w-5 h-5 text-gray-900" />
                <span className="text-gray-700">GitHub Profile</span>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </a>
              <a
                href={student.portfolio || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Globe className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Portfolio</span>
                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
              </a>
              <button className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full">
                <FileText className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">Resume</span>
                <Download className="w-4 h-4 text-gray-400 ml-auto" />
              </button>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
            <div className="space-y-2">
              {(student.documents || [
                { name: 'Resume.pdf', size: '245 KB' },
                { name: 'Cover_Letter.pdf', size: '128 KB' },
                { name: 'Certificates.pdf', size: '512 KB' }
              ]).map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size}</p>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;