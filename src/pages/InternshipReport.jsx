import React, { useEffect, useState } from "react";
import "./InternshipReport.css";
import studentService from "../services/studentService";

const LOCAL_KEYS = {
    student: "irs_student",
    company: "irs_company",
    college: "irs_college",
    logs: "irs_logs",
    projects: "irs_projects",
    images: "irs_report_images"
};

// Adjust these when your main portal has exact routes
const MAIN_PROFILE_URL = "/studentdashboard";
const MAIN_LOGS_URL = "/logbook";
const MAIN_PROJECTS_URL = "/logbook";

function InternshipReport() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [metrics, setMetrics] = useState({
        totalLogs: 0,
        projects: 0,
        technologies: 0,
        daysActive: 0
    });

    const [student, setStudent] = useState(null);
    const [company, setCompany] = useState(null);
    const [college, setCollege] = useState(null);
    const [logs, setLogs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [imgSettings, setImgSettings] = useState({
        figTechStackUrl: "",
        figCorporateUrl: ""
    });
    const [reportHtml, setReportHtml] = useState(
        'No Report Generated. Click "Preview Report" above.'
    );

    const fromLocal = (key, fallback) => {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        try {
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    };

    useEffect(() => {
        async function loadSummary() {
            setLoading(true);
            setError(null);
            
            let backendData = {
                student: {},
                company: {},
                college: {},
                logs: [],
                projects: []
            };

            try {
                // Fetch internship report data from the backend API
                const reportResponse = await studentService.getInternshipReport();
                
                if (reportResponse) {
                    backendData = {
                        student: reportResponse.student || {},
                        company: reportResponse.company || {},
                        college: reportResponse.college || {},
                        logs: reportResponse.logs || [],
                        projects: reportResponse.projects || []
                    };
                }
            } catch (err) {
                console.warn("Report backend not available, using local storage fallback", err);
                setError("Could not load report data from server. Using local data.");
            }

            // Merge with local storage data (if any)
            const sData = fromLocal(LOCAL_KEYS.student, backendData.student);
            const cData = fromLocal(LOCAL_KEYS.company, backendData.company);
            const colData = fromLocal(LOCAL_KEYS.college, backendData.college);
            const localLogs = fromLocal(LOCAL_KEYS.logs, []);
            const localProjects = fromLocal(LOCAL_KEYS.projects, []);

            const allLogs = [...backendData.logs, ...localLogs];
            const allProjects = [...backendData.projects, ...localProjects];

            const techSet = new Set();
            allLogs.forEach((l) => {
                (l.tools || "")
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                    .forEach((t) => techSet.add(t));
            });
            allProjects.forEach((p) => {
                (p.tools || "")
                    .split(",")
                    .map((x) => x.trim())
                    .filter(Boolean)
                    .forEach((t) => techSet.add(t));
            });
            const daySet = new Set(allLogs.map((l) => l.date));

            setMetrics({
                totalLogs: allLogs.length,
                projects: allProjects.length,
                technologies: techSet.size,
                daysActive: daySet.size
            });

            setStudent(Object.keys(sData).length > 0 ? sData : backendData.student);
            setCompany(Object.keys(cData).length > 0 ? cData : backendData.company);
            setCollege(Object.keys(colData).length > 0 ? colData : backendData.college);
            setLogs(allLogs);
            setProjects(allProjects);

            const imgs = fromLocal(LOCAL_KEYS.images, {});
            setImgSettings({
                figTechStackUrl: imgs.figTechStackUrl || "",
                figCorporateUrl: imgs.figCorporateUrl || ""
            });

            setLoading(false);
        }

        loadSummary();
    }, []);

    const handleImageChange = (e) => {
        const { name, value } = e.target;
        setImgSettings((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageSave = (e) => {
        e.preventDefault();
        window.localStorage.setItem(LOCAL_KEYS.images, JSON.stringify(imgSettings));
    };

    const previewReport = async () => {
        try {
            const response = await studentService.getInternshipReportHtml();
            setReportHtml(response.html || response);
        } catch {
            alert("Failed to load report preview. Please ensure you have completed your internship data.");
        }
    };

    const printReport = async () => {
        try {
            const response = await studentService.getInternshipReportPdf();
            // Handle blob response for PDF download
            const blob = response instanceof Blob ? response : new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "Internship_Report.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading PDF:", err);
            alert("Failed to generate PDF. Please try again.");
        }
    };

    const downloadHtml = async () => {
        try {
            const response = await studentService.getInternshipReportHtml();
            const html = response.html || response;
            const blob = new Blob([html], { type: "text/html" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = "Internship_Report.html";
            a.click();
            URL.revokeObjectURL(a.href);
        } catch (err) {
            console.error("Error downloading HTML:", err);
            alert("Failed to generate HTML report. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="ir-page">
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-pulse text-center">
                        <div className="h-12 w-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <div className="h-4 w-32 bg-gray-300 rounded mx-auto"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="ir-page">
            {/* Header */}
            <header className="ir-header">
                <h1 className="ir-title">Generate Internship Report</h1>
                <p className="ir-subtitle">
                    Review your internship data from the main portal, then generate a
                    formatted report.
                </p>
            </header>

            {/* Metrics row */}
            <section className="ir-metric-grid">
                <div className="card ir-metric-card">
                    <div className="ir-metric-label">Total Logs</div>
                    <div className="ir-metric-value">{metrics.totalLogs}</div>
                </div>
                <div className="card ir-metric-card">
                    <div className="ir-metric-label">Projects/Modules</div>
                    <div className="ir-metric-value">{metrics.projects}</div>
                </div>
                <div className="card ir-metric-card">
                    <div className="ir-metric-label">Technologies</div>
                    <div className="ir-metric-value">{metrics.technologies}</div>
                </div>
                <div className="card ir-metric-card">
                    <div className="ir-metric-label">Days Active</div>
                    <div className="ir-metric-value">{metrics.daysActive}</div>
                </div>
            </section>

            {/* Profile */}
            <section className="ir-section">
                <div className="ir-section-header">
                    <h2>Final Profile (Read-only)</h2>
                    <button
                        type="button"
                        className="ir-link-button"
                        onClick={() => (window.location.href = MAIN_PROFILE_URL)}
                    >
                        Open Profile in Main Portal
                    </button>
                </div>
                <div className="card ir-card">
                    {student && company && college ? (
                        <div className="ir-profile-grid">
                            <div>
                                <h4>Student</h4>
                                <p>
                                    <span className="ir-label">Name</span>
                                    <span>{student.fullName}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Enrollment</span>
                                    <span>{student.enrollmentNumber}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Branch</span>
                                    <span>{student.branch}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Institute</span>
                                    <span>{student.instituteName}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Year</span>
                                    <span>{student.year}</span>
                                </p>
                            </div>
                            <div>
                                <h4>Internship</h4>
                                <p>
                                    <span className="ir-label">Organization</span>
                                    <span>{company.organizationName}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Role</span>
                                    <span>{company.internshipRole}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Mentor</span>
                                    <span>{company.mentorName}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Duration</span>
                                    <span>
                                        {student.internshipStart} – {student.internshipEnd}
                                    </span>
                                </p>
                                <p>
                                    <span className="ir-label">Report Submission</span>
                                    <span>{student.reportSubmissionDate || "-"}</span>
                                </p>
                            </div>
                            <div>
                                <h4>College Authorities</h4>
                                <p>
                                    <span className="ir-label">Director</span>
                                    <span>{college.director}</span>
                                </p>
                                <p>
                                    <span className="ir-label">Associate Dean</span>
                                    <span>{college.dean}</span>
                                </p>
                                <p>
                                    <span className="ir-label">HoD</span>
                                    <span>{college.hod}</span>
                                </p>
                                <p>
                                    <span className="ir-label">T&amp;P Coordinator</span>
                                    <span>{college.tnpCoordinator}</span>
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="ir-muted">Loading profile details…</p>
                    )}
                </div>
            </section>

            {/* Logs */}
            <section className="ir-section">
                <div className="ir-section-header">
                    <h2>All Daily Logs (Read-only)</h2>
                    <button
                        type="button"
                        className="ir-link-button"
                        onClick={() => (window.location.href = MAIN_LOGS_URL)}
                    >
                        Open Logs in Main Portal
                    </button>
                </div>
                <div className="card ir-card ir-logs-card">
                    <table className="ir-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Project</th>
                                <th>Tasks</th>
                                <th>Tools</th>
                                <th>Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="ir-muted">
                                        No logs available.
                                    </td>
                                </tr>
                            ) : (
                                logs
                                    .slice()
                                    .sort((a, b) =>
                                        a.date < b.date ? 1 : a.date > b.date ? -1 : 0
                                    )
                                    .map((log, idx) => (
                                        <tr key={idx}>
                                            <td>{log.date}</td>
                                            <td>{log.project || "-"}</td>
                                            <td>{log.tasks || "-"}</td>
                                            <td>{log.tools || "-"}</td>
                                            <td>{log.hours || "-"}</td>
                                        </tr>
                                    ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Projects */}
            <section className="ir-section">
                <div className="ir-section-header">
                    <h2>Projects / Modules (Read-only)</h2>
                    <button
                        type="button"
                        className="ir-link-button"
                        onClick={() => (window.location.href = MAIN_PROJECTS_URL)}
                    >
                        Open Projects in Main Portal
                    </button>
                </div>
                <div className="card ir-card">
                    {projects.length === 0 ? (
                        <p className="ir-muted">No projects added yet.</p>
                    ) : (
                        projects.map((p, idx) => (
                            <div key={idx} className="ir-project-item">
                                <div className="ir-project-title">{p.title}</div>
                                <div className="ir-project-tools">{p.tools || ""}</div>
                                <div className="ir-project-objective">
                                    <span className="ir-label">Objective</span>
                                    <span>{p.objective || "-"}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Image settings */}
            <section className="ir-section">
                <h2>Report Images (Optional)</h2>
                <div className="card ir-card">
                    <p className="ir-muted">
                        Provide URLs for additional images (tech stack collage, corporate
                        actions screenshot) that will be embedded in the report.
                    </p>
                    <form className="ir-form" onSubmit={handleImageSave}>
                        <div className="form-field">
                            <label htmlFor="figTechStackUrl">
                                Fig 1.1 – Different Technologies Learnt
                            </label>
                            <input
                                id="figTechStackUrl"
                                name="figTechStackUrl"
                                value={imgSettings.figTechStackUrl}
                                onChange={handleImageChange}
                                placeholder="https://.../tech-stack.png"
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="figCorporateUrl">
                                Fig 1.2 – Corporate Actions Table
                            </label>
                            <input
                                id="figCorporateUrl"
                                name="figCorporateUrl"
                                value={imgSettings.figCorporateUrl}
                                onChange={handleImageChange}
                                placeholder="https://.../corporate-actions.png"
                            />
                        </div>
                        <button type="submit" className="btn ir-save-btn">
                            Save Image Settings
                        </button>
                    </form>
                </div>
            </section>

            {/* Actions + preview */}
            <section className="ir-section">
                <div className="card ir-card ir-actions-card">
                    <div className="ir-section-header">
                        <div>
                            <div className="ir-actions-title">Generate Final Report</div>
                            <div className="ir-muted ir-actions-subtitle">
                                Once the data looks correct, generate the formatted internship
                                report.
                            </div>
                        </div>
                        <div className="ir-actions-buttons">
                            <button type="button" className="btn" onClick={previewReport}>
                                Preview Report
                            </button>
                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={printReport}
                            >
                                Print / Save as PDF
                            </button>
                            <button
                                type="button"
                                className="btn ir-download-btn"
                                onClick={downloadHtml}
                            >
                                Download as HTML
                            </button>
                        </div>
                    </div>
                </div>

                <div className="ir-preview-wrapper">
                    <iframe
                        title="Internship Report Preview"
                        className="report-preview-frame"
                        srcDoc={reportHtml}
                    />
                </div>
            </section>
        </div>
    );
}

export default InternshipReport;