import React, { useEffect, useMemo, useState } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";
import Sidebar from "../components/studentdashboard/sidebar.jsx";
import { motion, AnimatePresence } from "framer-motion";

// StudentActivityTracker.jsx — corrected & balanced braces
export default function ActivityTrackerPage({
  storageKey = "activity-tracker-v1",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // mock current user — replace with your auth/user provider
  const currentUser = { id: "user-1", name: "Asha Verma", avatar: null };

  function handleNavigate(route) {
    // wire to your router here. Example: react-router -> navigate(`/${route}`)
    // For now we use hash-nav fallback:
    window.location.hash = `#/${route}`;
  }

  const emptyForm = {
    id: null,
    title: "",
    date: "",
    organiser: "",
    location: "",
    topic: "",
    notes: "",
    tags: [],
    attachments: [], // attachments for new items will be {id,name,type,url}
  };

  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // close overlay on Escape
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setSelectedActivity(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);

  // Lazy-load StatsSidebar to reduce initial bundle
  const StatsSidebar = React.lazy(() =>
    import("../components/studentdashboard/StatsSidebar.jsx")
  );

  // Load activities (legacy attachments may contain dataUrl; we keep them but do not display)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setActivities(JSON.parse(raw));
    } catch (e) {
      console.error("Failed to load activities", e);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(activities));
    } catch (e) {
      console.error("Failed to save activities", e);
    }
  }, [activities, storageKey]);

  // ensure newest first
  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
      const ta = new Date(a.createdAt || a.date).getTime();
      const tb = new Date(b.createdAt || b.date).getTime();
      return tb - ta;
    });
  }, [activities]);

  const allTags = useMemo(() => {
    const set = new Set();
    activities.forEach((a) => (a.tags || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [activities]);

  function openAdd() {
    setForm(emptyForm);
    setEditing(false);
    setShowModal(true);
  }

  function openEdit(activity) {
    // Put activity into form — keep existing attachments as-is (legacy ones will remain invisible)
    setForm({
      ...activity,
      attachments: activity.attachments ? activity.attachments.slice() : [],
    });
    setEditing(true);
    setShowModal(true);
  }

  // -------------------------
  // Image compression helper
  // -------------------------
  async function compressImage(file, maxWidth = 1200, quality = 0.75) {
    if (!file.type.startsWith("image/")) return file;
    const bitmap = await createImageBitmap(file);
    const ratio = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * ratio);
    const height = Math.round(bitmap.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);

    return new Promise((res) => {
      canvas.toBlob(
        (blob) => {
          const newFile = new File([blob], file.name, { type: file.type });
          res(newFile);
        },
        file.type || "image/jpeg",
        quality
      );
    });
  }

  // -------------------------
  // SIMPLE file handling (FileReader -> dataURL)
  // -------------------------
  async function handleFilesSelected(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const attachments = [];

    for (const file of Array.from(files)) {
      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => resolve(ev.target.result);
        reader.readAsDataURL(file);
      });

      attachments.push({
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        url: dataUrl, // readAsDataURL result — works in view & download
      });
    }

    setForm((f) => ({
      ...f,
      attachments: [...(f.attachments || []), ...attachments],
    }));

    // allow selecting same file again
    e.target.value = null;
  }

  function removeAttachmentFromForm(id) {
    setForm((f) => ({
      ...f,
      attachments: (f.attachments || []).filter((x) => x.id !== id),
    }));
  }

  function saveActivity(e) {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Please provide a title and date.");
      return;
    }

    const next = { ...form };
    next.updatedAt = new Date().toISOString();
    next.verificationStatus = form.attachments && form.attachments.length > 0 ? "pending" : "none";
    next.facultyId = "faculty-123";

    // Attachments are kept as data URLs (so view/download works immediately)
    next.attachments = (form.attachments || []).filter((att) => att && att.url);

    if (!editing) {
      next.id = Date.now() + Math.random();
      next.createdAt = new Date().toISOString();
      setActivities((s) => [next, ...s]);
    } else {
      setActivities((s) => s.map((a) => (a.id === next.id ? next : a)));
    }

    setShowModal(false);
  }

  function removeActivity(id) {
    if (!confirm("Delete this activity? This cannot be undone.")) return;
    setActivities((s) => s.filter((a) => a.id !== id));
  }

  // View attachment (works for images & PDFs stored as data URLs)
  function viewAttachment(att) {
    if (!att || !att.url) {
      return alert("Attachment not available.");
    }

    const w = window.open();
    if (!w) return alert("Popup blocked — allow popups for this site to view attachments.");
    w.document.title = att.name;

    if (att.type && att.type.startsWith("image/")) {
      w.document.body.style.margin = "0";
      w.document.body.innerHTML = `<img src="${att.url}" style="max-width:100%;height:auto;display:block;margin:0 auto"/>`;
    } else if (att.type === "application/pdf" || (att.url && att.url.startsWith("data:application/pdf"))) {
      w.document.body.style.margin = "0";
      w.document.body.innerHTML = `<embed src="${att.url}" type="application/pdf" width="100%" height="100%"></embed>`;
    } else {
      // For other types, open the data URL (browser will usually download)
      w.location.href = att.url;
    }
  }

  function downloadAttachment(att) {
    if (!att || !att.url) {
      return alert("Attachment not available for download.");
    }
    const link = document.createElement("a");
    link.href = att.url;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(activities, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `activities-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function exportCSV() {
    const rows = activities.map((a) => ({
      title: a.title,
      date: a.date,
      organiser: a.organiser,
      location: a.location,
      topic: a.topic,
      tags: (a.tags || []).join(";"),
      notes: a.notes?.replace(/\n/g, " ") || "",
      attachments: (a.attachments || []).map((x) => x.name || "").join(";"),
    }));

    if (rows.length === 0) {
      alert("No data to export");
      return;
    }

    const header = Object.keys(rows[0]).join(",");
    const lines = rows.map((r) =>
      Object.values(r)
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [header, ...lines].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `activities-${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  const filtered = sortedActivities.filter((a) => {
    if (filterTag && !(a.tags || []).includes(filterTag)) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      a.title.toLowerCase().includes(q) ||
      (a.organiser || "").toLowerCase().includes(q) ||
      (a.location || "").toLowerCase().includes(q) ||
      (a.topic || "").toLowerCase().includes(q) ||
      (a.notes || "").toLowerCase().includes(q)
    );
  });


  // Small motion variants
  const cardVariant = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } };
  const modalVariant = { hidden: { opacity: 0, y: -10 }, visible: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        user={{ name: currentUser.name }}
        onToggleSidebar={() => setSidebarOpen(true)}
        onSearch={(q) => alert("Search: " + q)}
        onNavigate={(r) => handleNavigate(r)}
      />

      <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Activity Tracker</h1>
            <p className="text-sm text-slate-500">Log seminars, workshops and certificates.</p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={openAdd} className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-indigo-700">+ Add Activity</button>
            <div className="inline-flex gap-2">
              <button onClick={exportJSON} className="px-3 py-2 border rounded">Export JSON</button>
              <button onClick={exportCSV} className="px-3 py-2 border rounded">Export CSV</button>
            </div>
          </div>
        </div>

        {/* Two column layout: left = main list, right = stats sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <main className="space-y-4 w-full max-w-2xl mx-auto">
            <section className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, organiser, topic or notes" className="p-2 border rounded-lg w-full" />

              <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="p-2 border rounded-lg">
                <option value="">Filter by tag (all)</option>
                {allTags.map((t) => (<option key={t} value={t}>{t}</option>))}
              </select>

              <div className="flex items-center gap-2">
                {allTags.slice(0, 6).map((t) => (
                  <button key={t} onClick={() => setFilterTag(filterTag === t ? "" : t)} className={`px-2 py-1 rounded-full border ${filterTag === t ? "bg-indigo-100" : ""}`}>{t}</button>
                ))}
              </div>

              <div className="text-sm text-slate-600">You have <strong>{activities.length}</strong> activities logged.</div>
            </section>

            <section className="grid gap-4">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-slate-500 border rounded">No activities found. Click <strong>+ Add Activity</strong> to create one.</div>
              ) : (
                <div className="flex flex-col w-full max-w-2xl mx-auto">
                  {filtered.map((a) => (
                    <motion.article key={a.id} onClick={() => setSelectedActivity(a)} className="cursor-pointer p-4 border rounded-lg shadow-sm bg-white hover:bg-slate-50 transition" initial="hidden" animate="visible" variants={cardVariant}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="text-lg font-medium">{a.title}</h2>
                          <div className="text-sm text-slate-600">{a.topic} • {a.organiser}</div>
                          <div className="mt-2 text-sm text-slate-500">{a.location} • {a.date}</div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex gap-2">
                            <button onClick={(e) => { e.stopPropagation(); openEdit(a); }} className="px-3 py-1 border rounded">Edit</button>
                            <button onClick={(e) => { e.stopPropagation(); removeActivity(a.id); }} className="px-3 py-1 border rounded text-red-600">Delete</button>
                          </div>

                          <div className="text-xs text-slate-400">Logged: {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}</div>

                          <div className="text-xs mt-1">
                            {a.verificationStatus === "pending" && (<span className="text-yellow-600 font-medium">Pending Verification</span>)}
                            {a.verificationStatus === "verified" && (<span className="text-green-600 font-medium">Verified</span>)}
                            {a.verificationStatus === "rejected" && (<span className="text-red-600 font-medium">Rejected</span>)}
                          </div>
                        </div>
                      </div>

                      {a.notes ? (<p className="mt-3 text-sm text-slate-700 line-clamp-3">{a.notes}</p>) : null}

                      {a.tags && a.tags.length > 0 && (
                        <div className="mt-3 flex gap-1 flex-wrap">{a.tags.map((t) => (<span key={t} className="px-2 py-0.5 bg-slate-100 rounded-full text-xs">{t}</span>))}</div>
                      )}

                      {a.attachments && a.attachments.filter((att) => att && att.url).length > 0 && (
                        <div className="mt-3 border-t pt-3 flex gap-2 flex-wrap">
                          {a.attachments.filter((att) => att && att.url).map((att) => (
                            <div key={att.id} className="text-xs border rounded p-2">
                              <div className="font-medium">{att.name}</div>
                              <div className="mt-2 flex gap-1">
                                <button onClick={(e) => { e.stopPropagation(); viewAttachment(att); }} className="px-2 py-1 border rounded">View</button>
                                <button onClick={(e) => { e.stopPropagation(); downloadAttachment(att); }} className="px-2 py-1 border rounded">Download</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.article>
                  ))}
                </div>
              )}
            </section>
          </main>

          {/* Right column: Stats & Leaderboard (lazy loaded) */}
          <aside className="hidden lg:block">
            <React.Suspense fallback={<div className="p-4 text-center text-slate-500">Loading stats...</div>}>
              <StatsSidebar activities={activities} user={currentUser} batchId="batch-1" />
            </React.Suspense>
          </aside>
        </div>
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={(route) => handleNavigate(route)} />

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)}></div>

          <form onSubmit={saveActivity} className="relative z-10 w-full max-w-2xl bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editing ? "Edit Activity" : "Add Activity"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-500">Close</button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input required placeholder="Title (eg. AI Seminar)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="p-2 border rounded" />
              <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" />

              <input placeholder="Organiser / Speaker" value={form.organiser} onChange={(e) => setForm({ ...form, organiser: e.target.value })} className="p-2 border rounded" />
              <input placeholder="Location (eg. Online / Room 101)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="p-2 border rounded" />

              <input placeholder="Topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} className="p-2 border rounded" />
              <input placeholder="Tags (comma separated)" value={(form.tags || []).join(",")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} className="p-2 border rounded" />

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full p-2 border rounded" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1">Attach certificates / files</label>
                <input type="file" multiple onChange={handleFilesSelected} accept="image/*,application/pdf" />

                {form.attachments && form.attachments.length > 0 && (
                  <div className="mt-3 grid gap-2">
                    {form.attachments.map((att) => (
                      <div key={att.id} className="flex items-center justify-between gap-2 border rounded p-2">
                        <div className="text-sm">{att.name}</div>
                        <div className="flex gap-2">
                          {att.url ? (
                            <>
                              <button type="button" onClick={() => viewAttachment(att)} className="px-2 py-1 border rounded text-xs">View</button>
                              <button type="button" onClick={() => downloadAttachment(att)} className="px-2 py-1 border rounded text-xs">Download</button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-500">Preview not available</span>
                          )}

                          <button type="button" onClick={() => removeAttachmentFromForm(att.id)} className="px-2 py-1 border rounded text-xs text-red-600">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editing ? "Save" : "Add"}</button>
            </div>
          </form>
        </div>
      )}

      {/* Floating action button with subtle mount animation */}
      <motion.button title="Create new log" onClick={openAdd} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 bg-blue-600 hover:bg-blue-600 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
      </motion.button>

      {/* Activity View Overlay (AnimatePresence for exit animation) */}
      <AnimatePresence>
        {selectedActivity && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedActivity(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-xl shadow-xl w-full max-w-3xl sm:max-h-[90vh] sm:overflow-y-auto p-4 sm:p-6 h-full sm:h-auto sm:mx-auto sm:my-0" onClick={(e) => e.stopPropagation()} initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 20 }} style={{ maxHeight: "calc(100vh - 3rem)" }}>
              <h2 className="text-2xl font-semibold mb-2">{selectedActivity.title}</h2>
              <p className="text-sm text-slate-500 mb-4">Created: {selectedActivity.createdAt ? new Date(selectedActivity.createdAt).toLocaleString() : "—"}</p>

              <div className="space-y-3 text-slate-700">
                <p><strong>Topic:</strong> {selectedActivity.topic}</p>
                <p><strong>Organiser:</strong> {selectedActivity.organiser}</p>
                <p><strong>Location:</strong> {selectedActivity.location}</p>
                <p><strong>Date:</strong> {selectedActivity.date}</p>

                <div>
                  <strong>Description:</strong>
                  <p className="whitespace-pre-wrap mt-1">{selectedActivity.notes || "No description provided"}</p>
                </div>

                {selectedActivity.tags?.length > 0 && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {selectedActivity.tags.map((t) => (<span key={t} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">{t}</span>))}
                  </div>
                )}

                {selectedActivity.attachments && selectedActivity.attachments.filter((att) => att && att.url).length > 0 && (
                  <div>
                    <strong>Attachments:</strong>
                    <div className="mt-2 space-y-2">
                      {selectedActivity.attachments.filter((att) => att && att.url).map((att) => (
                        <div key={att.id} className="border p-3 rounded flex items-center justify-between">
                          <span className="text-sm">{att.name}</span>
                          <div className="flex gap-2">
                            <button onClick={() => { viewAttachment(att); }} className="px-2 py-1 border rounded text-xs">View</button>
                            <button onClick={() => { downloadAttachment(att); }} className="px-2 py-1 border rounded text-xs">Download</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 text-right">
                <button onClick={() => setSelectedActivity(null)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
