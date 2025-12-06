import React, { useEffect, useState } from "react";
import "./InternshipReport.css";

const API_BASE = "http://localhost:4000";

const LOCAL_KEYS = {
    student: "irs_student",
    company: "irs_company",
    college: "irs_college",
    logs: "irs_logs",
    projects: "irs_projects",
    images: "irs_report_images"
};

// Adjust these when your main portal has exact routes
const MAIN_PROFILE_URL = "http://localhost:5173/studentdashboard";
const MAIN_LOGS_URL = "http://localhost:5173/logbook";
const MAIN_PROJECTS_URL = "http://localhost:5173/logbook";

function InternshipReport() {
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
            let backendStudent = {};
            let backendCompany = {};
            let backendCollege = {};
            let backendLogs = [];
            let backendProjects = [];

            try {
                const [s, c, col, l, p] = await Promise.all([
                    fetch(`${API_BASE}/api/student`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/company`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/college`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/logs`).then((r) => r.json()),
                    fetch(`${API_BASE}/api/projects`).then((r) => r.json())
                ]);
                backendStudent = s;
                backendCompany = c;
                backendCollege = col;
                backendLogs = l;
                backendProjects = p;
            } catch (err) {
                console.warn("Report backend not available, using empty defaults", err);
            }

            const sData = fromLocal(LOCAL_KEYS.student, backendStudent);
            const cData = fromLocal(LOCAL_KEYS.company, backendCompany);
            const colData = fromLocal(LOCAL_KEYS.college, backendCollege);
            const localLogs = fromLocal(LOCAL_KEYS.logs, []);
            const localProjects = fromLocal(LOCAL_KEYS.projects, []);

            const allLogs = [...backendLogs, ...localLogs];
            const allProjects = [...backendProjects, ...localProjects];

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

            setStudent(sData);
            setCompany(cData);
            setCollege(colData);
            setLogs(allLogs);
            setProjects(allProjects);

            const imgs = fromLocal(LOCAL_KEYS.images, {});
            setImgSettings({
                figTechStackUrl: imgs.figTechStackUrl || "",
                figCorporateUrl: imgs.figCorporateUrl || ""
            });
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
            const res = await fetch(`${API_BASE}/api/report/html`);
            const html = await res.text();
            setReportHtml(html);
        } catch {
            alert("Failed to load report from backend.");
        }
    };

    const printReport = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/report/pdf`);
            if (!res.ok) {
                throw new Error(`PDF error ${res.status}`);
            }
            const blob = await res.blob();
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
        const res = await fetch(`${API_BASE}/api/report/html`);
        const html = await res.text();
        const blob = new Blob([html], { type: "text/html" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "Internship_Report.html";
        a.click();
        URL.revokeObjectURL(a.href);
    };

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