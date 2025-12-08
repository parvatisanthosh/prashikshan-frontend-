// src/pages/CertificatesPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import Footer from "../components/studentdashboard/Footer.jsx";
import studentService from "../services/studentService";

/**
 * CertificatesPage.jsx
 * - Layout: 3-Column (Left: Filters | Center: Grid | Right: Skills & Share)
 * - Features: Credential Wallet, Skill Aggregation, Verification Badges.
 */

/* -------------------- Main Component -------------------- */
export default function CertificatesPage() {
  // --- Sidebar / Nav Logic ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function handleNavigate(route) {
    window.location.hash = `#/${route}`;
  }

  // --- State ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [certs, setCerts] = useState([]);
  
  // UI State
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedCert, setSelectedCert] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Fetch certificates and profile from API
        const [certsResponse, profileResponse] = await Promise.all([
          studentService.getCertificates(),
          studentService.getProfile()
        ]);

        const certificates = certsResponse.certificates || [];
        const profile = profileResponse.profile || {};

        // Transform backend data to our format
        const transformedCerts = certificates.map(cert => ({
          id: cert.id,
          title: cert.title || cert.name,
          issuer: cert.issuer || cert.issuingOrganization,
          issueDate: cert.issueDate || cert.issuedAt,
          skills: cert.skills || [],
          credentialId: cert.credentialId || cert.certificateId,
          verified: cert.verified || cert.isVerified || false,
          url: cert.url || cert.fileUrl || "#",
          previewImage: cert.previewImage || cert.imageUrl || null,
          type: cert.type || cert.category || "Certification"
        }));

        setUser({
          name: profile.displayName || "Student",
          roll: profile.enrollmentNumber || "",
          department: profile.department || ""
        });
        setCerts(transformedCerts);
      } catch (e) {
        console.error("Failed to fetch certificates", e);
        setError(e.message || "Failed to load certificates");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Handle Upload ---
  const handleUploadCertificate = async (certData) => {
    try {
      const response = await studentService.uploadCertificate(certData);
      const newCert = {
        id: response.certificate?.id || `c_${Date.now()}`,
        title: certData.title,
        issuer: certData.issuer,
        issueDate: certData.issueDate,
        verified: false,
        type: certData.type || "Certification",
        previewImage: certData.previewImage || null,
        url: response.certificate?.url || "#",
        skills: certData.skills || []
      };
      setCerts(prev => [newCert, ...prev]);
      setUploadModalOpen(false);
    } catch (err) {
      console.error("Error uploading certificate:", err);
      alert(err.message || "Failed to upload certificate");
    }
  };

  // --- Handle Delete ---
  const handleDeleteCertificate = async (id) => {
    if(confirm("Delete this certificate?")) {
      try {
        await studentService.deleteCertificate(id);
        setCerts(prev => prev.filter(c => c.id !== id));
        setSelectedCert(null);
      } catch (err) {
        console.error("Error deleting certificate:", err);
        alert(err.message || "Failed to delete certificate");
      }
    }
  };

  // --- Derived State ---
  const filteredCerts = useMemo(() => {
    let result = certs;
    if (typeFilter !== "All") {
      result = result.filter(c => c.type === typeFilter);
    }
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(c => c.title.toLowerCase().includes(q) || c.issuer.toLowerCase().includes(q));
    }
    return result;
  }, [certs, query, typeFilter]);

  const skillsWallet = useMemo(() => {
    const allSkills = new Set();
    certs.forEach(c => c.skills?.forEach(s => allSkills.add(s)));
    return Array.from(allSkills);
  }, [certs]);

  const types = ["Course", "Award", "Certification", "Workshop"];

  if (loading) {
    return (
       <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
             <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
             <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
       </div>
       
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading certificates</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans text-gray-800">
      
     {/* 1. Global Navigation (Fixed) */}
          <div className="sticky top-0 z-50 bg-white shadow-sm">
            <Navbar
              user={{ name: "Asha Verma" }}
              onToggleSidebar={() => setSidebarOpen(true)}
              onSearch={(q) => console.log("Search: " + q)}
              onNavigate={(r) => handleNavigate(r)}
            />
          </div>
    
          {/* Mobile Sidebar */}
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            onNavigate={(route) => handleNavigate(route)}
          />

      <div className="flex justify-center w-full px-4 pt-6 pb-12">
        <div className="flex w-full max-w-[1600px] gap-6 items-start">
          
          {/* ======================= 
              LEFT SIDEBAR (Filters) 
             ======================= */}
          <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 sticky top-24 space-y-6">
             
             {/* Summary Card */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-4 text-sm">Credential Overview</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                   <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{certs.length}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Total</div>
                   </div>
                   <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{certs.filter(c => c.verified).length}</div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase">Verified</div>
                   </div>
                </div>
             </div>

             {/* Filter Widget */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                   <button onClick={() => { setQuery(""); setTypeFilter("All"); }} className="text-xs text-blue-600 hover:underline">Reset</button>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-gray-500 mb-2 block">Credential Type</label>
                      <div className="flex flex-wrap gap-2">
                         <button onClick={() => setTypeFilter("All")} className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${typeFilter === "All" ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>All</button>
                         {types.map(t => (
                            <button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                               {t}
                            </button>
                         ))}
                      </div>
                   </div>
                </div>
             </div>

          </aside>

          {/* ======================= 
              CENTER (Certificates Grid) 
             ======================= */}
          <main className="flex-1 min-w-0">
             
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                   <h1 className="text-2xl font-bold text-gray-900">Certificates</h1>
                   <p className="text-sm text-gray-500">Your verified academic and extra-curricular credentials.</p>
                </div>
                <button 
                   onClick={() => setUploadModalOpen(true)}
                   className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                   Upload
                </button>
             </div>

             {/* Search */}
             <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-200 flex items-center gap-3 mb-6 sticky top-20 z-30">
                <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input 
                   value={query} onChange={(e) => setQuery(e.target.value)}
                   placeholder="Search certificates by title or issuer..." 
                   className="w-full text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-400"
                />
             </div>

             {/* Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCerts.length > 0 ? (
                   filteredCerts.map(cert => (
                      <CertificateCard 
                         key={cert.id} 
                         cert={cert} 
                         onClick={() => setSelectedCert(cert)} 
                      />
                   ))
                ) : (
                   <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400 text-3xl">📜</div>
                      <h3 className="text-gray-900 font-medium">No certificates found</h3>
                      <p className="text-gray-500 text-sm mt-1">Upload your first certificate to build your portfolio.</p>
                   </div>
                )}
             </div>

          </main>

          {/* ======================= 
              RIGHT SIDEBAR (Skills & Share) 
             ======================= */}
          <aside className="hidden xl:block w-80 flex-shrink-0 sticky top-24 space-y-6">
             
             {/* Skills Wallet */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Skills Wallet</h3>
                <p className="text-xs text-gray-500 mb-4">Skills verified through your certificates.</p>
                <div className="flex flex-wrap gap-2">
                   {skillsWallet.map(skill => (
                      <span key={skill} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium border border-indigo-100">
                         {skill}
                      </span>
                   ))}
                </div>
             </div>

             {/* Public Profile Link */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-bold text-gray-900 mb-2 text-sm">Public Profile</h3>
                <p className="text-xs text-gray-500 mb-4">Share your credentials with recruiters.</p>
                
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200 mb-3">
                   <span className="text-xs text-gray-600 truncate flex-1">student.edu/u/{user?.roll}</span>
                   <button className="text-blue-600 hover:text-blue-800 text-xs font-bold" onClick={() => alert("Link copied!")}>Copy</button>
                </div>
                
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm">
                   View Public Profile
                </button>
             </div>

          </aside>

        </div>
      </div>

      {/* Modals */}
      {uploadModalOpen && (
         <UploadCertificateModal 
            onClose={() => setUploadModalOpen(false)} 
            onUpload={handleUploadCertificate} 
         />
      )}

      {selectedCert && (
         <CertificateDetailModal 
            cert={selectedCert} 
            onClose={() => setSelectedCert(null)}
            onDelete={handleDeleteCertificate}
         />
      )}

      

    </div>

  );
}

/* -------------------- Sub-components -------------------- */

function CertificateCard({ cert, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden flex flex-col h-full">
       {/* Preview Area */}
       <div className="h-40 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {cert.previewImage ? (
             <img src={cert.previewImage} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
             <div className="text-gray-400 flex flex-col items-center">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                <span className="text-xs font-medium">No Preview</span>
             </div>
          )}
          {cert.verified && (
             <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-green-700 shadow-sm border border-green-100 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                VERIFIED
             </div>
          )}
       </div>

       <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
             <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wide">{cert.type}</span>
             <h3 className="text-lg font-bold text-gray-900 mt-2 leading-snug group-hover:text-blue-600 transition-colors">{cert.title}</h3>
             <p className="text-sm text-gray-500 mt-1">{cert.issuer}</p>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
             <span className="text-xs text-gray-400 font-medium">Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
             <button className="text-blue-600 text-xs font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">View</button>
          </div>
       </div>
    </div>
  );
}

function UploadCertificateModal({ onClose, onUpload }) {
   const [file, setFile] = useState(null);
   const [title, setTitle] = useState("");
   const [issuer, setIssuer] = useState("");
   const [date, setDate] = useState("");
   const [uploading, setUploading] = useState(false);
   
   const handleSubmit = async (e) => {
      e.preventDefault();
      setUploading(true);
      try {
        const certData = {
           title,
           issuer,
           issueDate: date,
           type: "Certification",
           previewImage: file ? URL.createObjectURL(file) : null,
           file: file
        };
        await onUpload(certData);
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
         <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-xl font-bold text-gray-900">Upload Certificate</h2>
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                  <div className="text-sm text-gray-500">
                     {file ? <span className="text-blue-600 font-semibold">{file.name}</span> : <span>Click to upload PDF or Image</span>}
                  </div>
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Certificate Title</label>
                  <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Advanced React" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Issuing Organization</label>
                  <input required value={issuer} onChange={e => setIssuer(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Coursera" />
               </div>

               <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Issue Date</label>
                  <input required type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
               </div>

               <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={onClose} className="px-5 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button type="submit" disabled={uploading} className={`px-6 py-2 text-white font-bold text-sm rounded-lg shadow-md ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
}

function CertificateDetailModal({ cert, onClose, onDelete }) {
   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
         <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
         <div className="bg-white rounded-2xl w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            
            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
               <h3 className="font-bold text-gray-800">{cert.title}</h3>
               <button onClick={onClose}><svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>

            <div className="flex-1 bg-gray-100 overflow-auto p-6 flex items-center justify-center">
               {cert.previewImage ? (
                  <img src={cert.previewImage} alt="Certificate" className="max-w-full max-h-full shadow-lg rounded" />
               ) : (
                  <div className="bg-white p-10 rounded shadow-sm text-center">
                     <p className="text-gray-500">No preview available</p>
                  </div>
               )}
            </div>

            <div className="p-5 bg-white border-t border-gray-200 flex justify-between items-center">
               <div>
                  <p className="text-xs text-gray-500">Credential ID: <span className="font-mono text-gray-800">{cert.credentialId || "N/A"}</span></p>
               </div>
               <div className="flex gap-3">
                  <button onClick={() => onDelete(cert.id)} className="px-4 py-2 text-red-600 font-bold text-sm hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100">Delete</button>
                  <button className="px-4 py-2 bg-gray-900 text-white font-bold text-sm rounded-lg shadow-md hover:bg-black">Download</button>
               </div>
            </div>
         </div>
      </div>
   );
}