import React, { useState, useEffect } from "react";
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UserIcon,
  DocumentArrowUpIcon,
  BanknotesIcon, // Added missing import
} from "@heroicons/react/24/solid";
import { InformationCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function PartnershipsUI() {
  // State Management
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);

  // Data States
  const [allPartnerships, setAllPartnerships] = useState([]); // Master Data List
  const [partnerships, setPartnerships] = useState([]); // Filtered/Displayed List
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    expired: 0,
    totalStudentsPlaced: 0,
  });

  // Form State
  const [formData, setFormData] = useState({
    companyName: "",
    type: "placement",
    status: "active",
    startDate: "",
    endDate: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    website: "",
    description: "",
    benefits: "",
    mouDocument: null,
  });

  // Fetch data on mount
  useEffect(() => {
    fetchPartnerships();
  }, []);

  // Filter partnerships whenever filters or master data changes
  useEffect(() => {
    filterPartnerships();
  }, [searchTerm, statusFilter, typeFilter, allPartnerships]);

  // Update stats whenever the master list changes
  useEffect(() => {
    calculateStats(allPartnerships);
  }, [allPartnerships]);

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      active: data.filter((p) => p.status === "active").length,
      pending: data.filter((p) => p.status === "pending").length,
      expired: data.filter((p) => p.status === "expired").length,
      totalStudentsPlaced: data.reduce((sum, p) => sum + (p.studentsPlaced || 0), 0),
    });
  };

  // --- API CALLS ---
  const fetchPartnerships = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock Data
      const mockPartnerships = [
        {
          id: "PT001",
          companyName: "Tech Corp India",
          logo: "🏢",
          type: "placement",
          status: "active",
          startDate: "2024-01-15",
          endDate: "2026-01-15",
          contactPerson: "Rajesh Kumar",
          contactEmail: "rajesh@techcorp.com",
          contactPhone: "+91 98765 43210",
          address: "Bangalore, Karnataka",
          website: "https://techcorp.com",
          description: "Leading technology company specializing in software development and IT services.",
          benefits: "Campus placements, internships, training programs",
          studentsPlaced: 45,
          averagePackage: "8 LPA",
          mouDocument: "mou_techcorp_2024.pdf",
          createdAt: "2024-01-10",
          lastUpdated: "2024-11-20",
        },
        {
          id: "PT002",
          companyName: "Innovation Labs",
          logo: "💡",
          type: "internship",
          status: "active",
          startDate: "2024-03-01",
          endDate: "2025-12-31",
          contactPerson: "Priya Sharma",
          contactEmail: "priya@innovationlabs.in",
          contactPhone: "+91 98765 43211",
          address: "Mumbai, Maharashtra",
          website: "https://innovationlabs.in",
          description: "Innovation-driven company focused on AI and machine learning solutions.",
          benefits: "Summer internships, research collaboration, stipend programs",
          studentsPlaced: 28,
          averagePackage: "6 LPA",
          mouDocument: "mou_innovation_2024.pdf",
          createdAt: "2024-02-20",
          lastUpdated: "2024-10-15",
        },
        {
          id: "PT003",
          companyName: "Global Solutions Pvt Ltd",
          logo: "🌐",
          type: "training",
          status: "active",
          startDate: "2024-06-01",
          endDate: "2026-05-31",
          contactPerson: "Amit Patel",
          contactEmail: "amit@globalsolutions.com",
          contactPhone: "+91 98765 43212",
          address: "Pune, Maharashtra",
          website: "https://globalsolutions.com",
          description: "Global consulting firm providing enterprise solutions and training.",
          benefits: "Faculty training, student workshops, certification programs",
          studentsPlaced: 0,
          averagePackage: "N/A",
          mouDocument: "mou_global_2024.pdf",
          createdAt: "2024-05-15",
          lastUpdated: "2024-09-10",
        },
        {
          id: "PT004",
          companyName: "StartUp Hub Inc",
          logo: "🚀",
          type: "placement",
          status: "pending",
          startDate: "2025-01-01",
          endDate: "2027-01-01",
          contactPerson: "Neha Gupta",
          contactEmail: "neha@startuphub.co",
          contactPhone: "+91 98765 43213",
          address: "Hyderabad, Telangana",
          website: "https://startuphub.co",
          description: "Innovative startup incubator and accelerator program.",
          benefits: "Entrepreneurship programs, mentorship, seed funding guidance",
          studentsPlaced: 0,
          averagePackage: "7 LPA",
          mouDocument: "mou_startup_pending.pdf",
          createdAt: "2024-11-01",
          lastUpdated: "2024-12-01",
        },
        {
          id: "PT005",
          companyName: "DataTech Analytics",
          logo: "📊",
          type: "research",
          status: "expired",
          startDate: "2022-01-01",
          endDate: "2024-12-31",
          contactPerson: "Suresh Reddy",
          contactEmail: "suresh@datatech.com",
          contactPhone: "+91 98765 43214",
          address: "Chennai, Tamil Nadu",
          website: "https://datatech.com",
          description: "Data analytics and business intelligence company.",
          benefits: "Research collaboration, data science projects, publications",
          studentsPlaced: 32,
          averagePackage: "9 LPA",
          mouDocument: "mou_datatech_2022.pdf",
          createdAt: "2021-12-15",
          lastUpdated: "2024-12-01",
        },
      ];

      setAllPartnerships(mockPartnerships); // Set Master List
      setPartnerships(mockPartnerships);    // Set View List
      calculateStats(mockPartnerships);
      
    } catch (error) {
      console.error("Error fetching partnerships:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPartnerships = () => {
    let result = [...allPartnerships];

    // Search Filter
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.companyName.toLowerCase().includes(lowerTerm) ||
          p.contactPerson.toLowerCase().includes(lowerTerm) ||
          p.address.toLowerCase().includes(lowerTerm)
      );
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((p) => p.status === statusFilter);
    }

    // Type Filter
    if (typeFilter !== "all") {
      result = result.filter((p) => p.type === typeFilter);
    }

    setPartnerships(result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create new object
      const newPartnership = {
        ...formData,
        id: "PT" + Date.now(),
        logo: "🏢", // Default logo for new entries
        studentsPlaced: 0,
        averagePackage: "N/A",
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      // Update State
      const updatedList = [newPartnership, ...allPartnerships];
      setAllPartnerships(updatedList);
      
      alert("Partnership added successfully!");
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      console.error("Error adding partnership:", error);
      alert("Failed to add partnership. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update object in list
      const updatedList = allPartnerships.map((p) => 
        p.id === selectedPartnership.id ? { ...p, ...formData, lastUpdated: new Date().toISOString() } : p
      );

      setAllPartnerships(updatedList);
      
      alert("Partnership updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating partnership:", error);
      alert("Failed to update partnership. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this partnership? This action cannot be undone.")) {
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // Remove from list
      const updatedList = allPartnerships.filter((p) => p.id !== id);
      setAllPartnerships(updatedList);
      
      alert("Partnership deleted successfully!");
    } catch (error) {
      console.error("Error deleting partnership:", error);
      alert("Failed to delete partnership. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: "",
      type: "placement",
      status: "active",
      startDate: "",
      endDate: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      website: "",
      description: "",
      benefits: "",
      mouDocument: null,
    });
  };

  const openEditModal = (partnership) => {
    setSelectedPartnership(partnership);
    setFormData({
      companyName: partnership.companyName,
      type: partnership.type,
      status: partnership.status,
      startDate: partnership.startDate,
      endDate: partnership.endDate,
      contactPerson: partnership.contactPerson,
      contactEmail: partnership.contactEmail,
      contactPhone: partnership.contactPhone,
      address: partnership.address,
      website: partnership.website,
      description: partnership.description,
      benefits: partnership.benefits,
      mouDocument: null,
    });
    setShowEditModal(true);
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      expired: "bg-red-100 text-red-700 border-red-200",
    };
    const icons = {
      active: CheckCircleIcon,
      pending: ClockIcon,
      expired: ExclamationCircleIcon,
    };
    const Icon = icons[status] || CheckCircleIcon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        <Icon className="w-3.5 h-3.5" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const styles = {
      placement: "bg-blue-100 text-blue-700",
      internship: "bg-purple-100 text-purple-700",
      training: "bg-cyan-100 text-cyan-700",
      research: "bg-pink-100 text-pink-700",
    };
    return (
      <span className={`px-2 py-1 rounded-md text-xs font-medium ${styles[type]}`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // --- MODALS ---

  const AddEditModal = ({ isEdit = false }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit Partnership" : "Add New Partnership"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {isEdit ? "Update partnership details" : "Create a new partnership or MoU"}
            </p>
          </div>
          <button
            onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={isEdit ? handleUpdate : handleSubmit} className="p-6 space-y-6">
          {/* Company Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BuildingOffice2Icon className="w-5 h-5 text-indigo-600" />
              Company Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="placement">Placement</option>
                  <option value="internship">Internship</option>
                  <option value="training">Training</option>
                  <option value="research">Research Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-indigo-600" />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="email@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="City, State"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-indigo-600" />
              Additional Information
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief description about the company..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Opportunities
                </label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="List the benefits students/faculty will receive..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <DocumentArrowUpIcon className="w-4 h-4" />
                  MoU Document (PDF)
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFormData({ ...formData, mouDocument: e.target.files[0] })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  {isEdit ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  {isEdit ? "Update Partnership" : "Add Partnership"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const ViewModal = () => {
    if (!selectedPartnership) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{selectedPartnership.logo}</div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedPartnership.companyName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(selectedPartnership.status)}
                  {getTypeBadge(selectedPartnership.type)}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowViewModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Contact Info */}
            <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
              <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-indigo-800">
                  <UserIcon className="w-4 h-4" />
                  <span className="font-medium">{selectedPartnership.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-800">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span>{selectedPartnership.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-800">
                  <PhoneIcon className="w-4 h-4" />
                  <span>{selectedPartnership.contactPhone}</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-800">
                  <MapPinIcon className="w-4 h-4" />
                  <span>{selectedPartnership.address}</span>
                </div>
              </div>
              {selectedPartnership.website && (
                <a
                  href={selectedPartnership.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm text-indigo-700 hover:text-indigo-900 font-medium underline"
                >
                  Visit Website →
                </a>
              )}
            </div>

            {/* Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase">Start Date</span>
                </div>
                <p className="text-lg font-bold text-green-900">
                  {new Date(selectedPartnership.startDate).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <div className="flex items-center gap-2 text-red-700 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span className="text-xs font-semibold uppercase">End Date</span>
                </div>
                <p className="text-lg font-bold text-red-900">
                  {new Date(selectedPartnership.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedPartnership.description && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedPartnership.description}</p>
              </div>
            )}

            {/* Benefits */}
            {selectedPartnership.benefits && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Benefits & Opportunities</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{selectedPartnership.benefits}</p>
              </div>
            )}

            {/* Stats */}
            {selectedPartnership.type === "placement" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 ">
                  <div className="flex items-center gap-2 text-blue-700 mb-2">
                    <UserIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Students Placed</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{selectedPartnership.studentsPlaced}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center gap-2 text-purple-700 mb-2">
                    <BanknotesIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase">Avg Package</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{selectedPartnership.averagePackage}</p>
                </div>
              </div>
            )}

            {/* MoU Document */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white p-2 rounded-lg border border-gray-200">
                  <DocumentTextIcon className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Memorandum of Understanding</p>
                  <p className="text-xs text-gray-500">{selectedPartnership.mouDocument?.name || selectedPartnership.mouDocument || "No document uploaded"}</p>
                </div>
              </div>
              <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download
              </button>
            </div>

            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
              <span>Created: {new Date(selectedPartnership.createdAt).toLocaleDateString()}</span>
              <span>Last Updated: {new Date(selectedPartnership.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 rounded-b-2xl">
            <button
              onClick={() => setShowViewModal(false)}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowViewModal(false);
                openEditModal(selectedPartnership);
              }}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <PencilSquareIcon className="w-4 h-4" />
              Edit Partnership
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- MAIN RENDER ---

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ArrowPathIcon className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading partnerships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BuildingOffice2Icon className="w-8 h-8 text-indigo-600" />
              Industry Partnerships
            </h1>
            <p className="text-gray-600 mt-1">
              Manage MoUs, corporate relations, and placement partners
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md"
          >
            <PlusIcon className="w-5 h-5" />
            Add Partnership
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Partners</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-green-600">Active MoUs</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-amber-600">Pending Renewal</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm font-medium text-indigo-600">Students Placed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudentsPlaced}</p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 sticky top-4 z-20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies, contact persons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
            <div className="relative min-w-[150px]">
              <FunnelIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div className="relative min-w-[150px]">
              <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="placement">Placement</option>
                <option value="internship">Internship</option>
                <option value="training">Training</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {partnerships.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <BuildingOffice2Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No partnerships found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your search or filters</p>
          <button 
            onClick={() => {setSearchTerm(""); setStatusFilter("all"); setTypeFilter("all");}}
            className="mt-4 text-indigo-600 font-medium hover:text-indigo-800"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerships.map((partnership) => (
            <div
              key={partnership.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-2xl border border-gray-100">
                    {partnership.logo}
                  </div>
                  {getStatusBadge(partnership.status)}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                  {partnership.companyName}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="line-clamp-1">{partnership.address}</span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    {getTypeBadge(partnership.type)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-medium text-gray-900">
                      {new Date(partnership.startDate).getFullYear()} - {new Date(partnership.endDate).getFullYear()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Contact</span>
                    <span className="font-medium text-gray-900 truncate max-w-[120px]">
                      {partnership.contactPerson}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPartnership(partnership);
                    setShowViewModal(true);
                  }}
                  className="flex-1 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <EyeIcon className="w-4 h-4" />
                  View
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  onClick={() => openEditModal(partnership)}
                  className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(partnership.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Modals */}
      {showAddModal && <AddEditModal />}
      {showEditModal && <AddEditModal isEdit={true} />}
      {showViewModal && <ViewModal />}
    </div>
  );
}