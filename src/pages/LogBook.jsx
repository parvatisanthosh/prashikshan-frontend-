import React, { useEffect, useState, useMemo, useRef } from "react";
import Navbar from "../components/studentdashboard/Navbar.jsx";

// LogbookPage.jsx — corrected, full component
// Added: TodoList feature (offline-first, localStorage).
// Updated: Mobile-first responsive improvements (better layout, touch targets, modal behavior)

export default function LogbookPage() {
  // --- Data model ---
  const [logs, setLogs] = useState(() => {
    try {
      const raw = localStorage.getItem("logbookLogs");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  // Todo state (new feature)
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem("logbookTodos");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });
  const [todoInput, setTodoInput] = useState("");
  const [todoFilter, setTodoFilter] = useState("all"); // all | active | completed
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoText, setEditingTodoText] = useState("");

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", tags: "", hours: "" });
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState("newest");
  const [showOnlyToday, setShowOnlyToday] = useState(false);
  const [markdownPreview, setMarkdownPreview] = useState(false);
  const [activeTagFilter, setActiveTagFilter] = useState("");
  const [showTrash, setShowTrash] = useState(false);

  const autosaveKey = "logbook_draft";
  const modalOpenRef = useRef(false);

  // persist logs
  useEffect(() => {
    localStorage.setItem("logbookLogs", JSON.stringify(logs));
  }, [logs]);

  // persist todos
  useEffect(() => {
    localStorage.setItem("logbookTodos", JSON.stringify(todos));
  }, [todos]);

  // --- Debounce search ---
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // --- Modal autosave (session while editing/creating) ---
  useEffect(() => {
    if (!isModalOpen) return;
    modalOpenRef.current = true;
    const saved = sessionStorage.getItem(autosaveKey);
    if (saved && !editingId) {
      // only prompt restore for new entries
      try {
        const data = JSON.parse(saved);
        if (data && (data.title || data.body)) {
          if (confirm("Restore unsaved draft?")) {
            setForm({ title: data.title || "", body: data.body || "", tags: data.tags || "", hours: data.hours || "" });
          }
        }
      } catch (e) {}
    }

    return () => {
      modalOpenRef.current = false;
    };
  }, [isModalOpen, editingId]);

  useEffect(() => {
    if (!modalOpenRef.current) return;
    // autosave form to sessionStorage
    sessionStorage.setItem(autosaveKey, JSON.stringify(form));
  }, [form]);

  // --- Helpers: create payload with canonical model ---
  function makePayload({
    id = null,
    title,
    body,
    tags = [],
    hours = null,
    status = "draft",
    createdAt = null,
    updatedAt = null,
    attachments = [],
    history = [],
    facultyFeedback = [],
    isDeleted = false,
    deletedAt = null,
  } = {}) {
    const now = new Date().toISOString();
    return {
      id: id || `log_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      studentId: "student_local",
      title: (title || "").trim(),
      body: body || "",
      tags: (tags || []).map((t) => t.trim()).filter(Boolean),
      attachments: attachments || [],
      status: status,
      createdAt: createdAt || now,
      updatedAt: updatedAt || now,
      hours: hours ? Number(hours) : null,
      facultyFeedback: facultyFeedback || [],
      history: history || [],
      isDeleted: !!isDeleted,
      deletedAt: deletedAt || null,
      syncStatus: "local", // local | queued | synced
    };
  }

  // --- CRUD actions ---
  function openCreateModal() {
    setEditingId(null);
    setForm({ title: "", body: "", tags: "", hours: "" });
    setIsModalOpen(true);
  }

  function openEditModal(id) {
    const l = logs.find((x) => x.id === id);
    if (!l) return;
    setEditingId(id);
    setForm({ title: l.title, body: l.body, tags: (l.tags || []).join(", "), hours: l.hours || "" });
    setIsModalOpen(true);
  }

  function softDelete(id) {
    if (!confirm("Move this log to trash?")) return;
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, isDeleted: true, deletedAt: new Date().toISOString() } : l)));
  }

  function restoreFromTrash(id) {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, isDeleted: false, deletedAt: null } : l)));
  }

  function permanentDelete(id) {
    if (!confirm("Permanently delete this log? This cannot be undone.")) return;
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }

  function handleDuplicate(id) {
    const l = logs.find((x) => x.id === id);
    if (!l) return;
    const copy = makePayload({ ...l, id: null, title: l.title + " (copy)", createdAt: null, updatedAt: null });
    setLogs((prev) => [copy, ...prev]);
    alert("Duplicate created.");
  }

  async function handleCopyToClipboard(id) {
    const l = logs.find((x) => x.id === id);
    if (!l) return;
    try {
      await navigator.clipboard.writeText(`${l.title}\n\n${l.body}`);
      alert("Log copied to clipboard.");
    } catch (e) {
      alert("Unable to copy.");
    }
  }

  function handleSave() {
    const trimmedTitle = (form.title || "").trim();
    if (!trimmedTitle) {
      alert("Please provide a title for the log.");
      return;
    }

    // prepare payload and version history
    if (editingId) {
      setLogs((prev) =>
        prev.map((l) => {
          if (l.id !== editingId) return l;
          const snapshot = { title: l.title, body: l.body, tags: l.tags, hours: l.hours, at: new Date().toISOString() };
          const updated = makePayload({
            ...l,
            title: form.title,
            body: form.body,
            tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
            hours: form.hours || null,
            updatedAt: new Date().toISOString(),
            history: [snapshot, ...(l.history || [])],
          });
          return updated;
        })
      );
    } else {
      const payload = makePayload({
        title: form.title,
        body: form.body,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        hours: form.hours || null,
      });
      setLogs((prev) => [payload, ...prev]);
    }

    // clear draft and close
    sessionStorage.removeItem(autosaveKey);
    setIsModalOpen(false);
  }

  // Submit for faculty review
  function submitForReview(id) {
    setLogs((prev) => prev.map((l) => (l.id === id ? { ...l, status: "submitted", updatedAt: new Date().toISOString() } : l)));
    alert("Submitted for review.");
  }

  // --- Derived lists & analytics ---
  const filtered = useMemo(() => {
    let list = [...logs];
    // show either trashed or active
    if (showTrash) {
      list = list.filter((l) => l.isDeleted);
    } else {
      list = list.filter((l) => !l.isDeleted);
    }

    if (activeTagFilter) {
      list = list.filter((l) => (l.tags || []).includes(activeTagFilter));
    }

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          (l.body || "").toLowerCase().includes(q) ||
          (l.tags || []).join(" ").toLowerCase().includes(q)
      );
    }

    if (showOnlyToday) {
      const today = new Date();
      list = list.filter((l) => {
        const d = new Date(l.createdAt);
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      });
    }

    if (sort === "newest") list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sort === "oldest") list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sort === "recentlyEdited") list.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return list;
  }, [logs, debouncedQuery, sort, showOnlyToday, activeTagFilter, showTrash]);

  const totalLogs = logs.filter((l) => !l.isDeleted).length;
  const logsToday = logs.filter((l) => {
    if (l.isDeleted) return false;
    const d = new Date(l.createdAt);
    const t = new Date();
    return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
  }).length;

  const last7 = useMemo(() => {
    const dayCounts = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const count = logs.filter((l) => {
        if (l.isDeleted) return false;
        const dd = new Date(l.createdAt);
        return dd.getFullYear() === d.getFullYear() && dd.getMonth() === d.getMonth() && dd.getDate() === d.getDate();
      }).length;
      dayCounts.push({ key, label: d.toLocaleDateString(undefined, { weekday: "short" }), count });
    }
    return dayCounts;
  }, [logs]);

  const allTags = useMemo(() => {
    const s = new Set();
    logs.forEach((l) => (l.tags || []).forEach((t) => s.add(t)));
    return Array.from(s);
  }, [logs]);

  // --- CSV export (exports filtered view by default) ---
  function exportCSV(all = false) {
    const data = all ? logs : filtered;
    const headers = ["id", "title", "body", "tags", "createdAt", "updatedAt"];
    const escape = (v = "") => '"' + String(v).replace(/"/g, '""') + '"';

    const rows = data.map((l) =>
      [
        escape(l.id),
        escape(l.title || ""),
        escape(l.body || ""),
        escape((l.tags || []).join("; ")),
        escape(l.createdAt || ""),
        escape(l.updatedAt || ""),
      ].join(",")
    );

    const csv = [headers.join(",")].concat(rows).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // --- Small helpers for UI ---
  function clearDraft() {
    sessionStorage.removeItem(autosaveKey);
    setForm({ title: "", body: "", tags: "", hours: "" });
  }

  // --- Todo helpers (new feature) ---
  function addTodo(e) {
    e && e.preventDefault();
    const text = (todoInput || "").trim();
    if (!text) return;
    const t = {
      id: `todo_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos((prev) => [t, ...prev]);
    setTodoInput("");
  }

  function toggleTodo(id) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t)));
  }

  function deleteTodo(id) {
    if (!confirm("Delete this todo?")) return;
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEditTodo(id) {
    const t = todos.find((x) => x.id === id);
    if (!t) return;
    setEditingTodoId(id);
    setEditingTodoText(t.text);
  }

  function saveEditTodo() {
    if (!editingTodoId) return;
    const text = (editingTodoText || "").trim();
    if (!text) return alert("Empty todo not allowed.");
    setTodos((prev) => prev.map((t) => (t.id === editingTodoId ? { ...t, text, updatedAt: new Date().toISOString() } : t)));
    setEditingTodoId(null);
    setEditingTodoText("");
  }

  function cancelEditTodo() {
    setEditingTodoId(null);
    setEditingTodoText("");
  }

  function clearCompletedTodos() {
    if (!confirm("Remove all completed todos?")) return;
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  const visibleTodos = useMemo(() => {
    if (todoFilter === "all") return todos;
    if (todoFilter === "active") return todos.filter((t) => !t.completed);
    return todos.filter((t) => t.completed);
  }, [todos, todoFilter]);

  function exportTodosCSV() {
    const headers = ["id", "text", "completed", "createdAt", "updatedAt"];
    const escape = (v = "") => '"' + String(v).replace(/"/g, '""') + '"';
    const rows = todos.map((t) => [escape(t.id), escape(t.text), escape(t.completed), escape(t.createdAt), escape(t.updatedAt)].join(","));
    const csv = [headers.join(",")].concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-export-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-6">
        <Navbar />
      </div>

      <div className="p-4 sm:p-6 max-w-3xl md:max-w-6xl mx-auto mt-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600">Logbook</h1>
            <p className="text-sm text-gray-500 mt-1">Keep track of your daily notes, experiments, and activities. (Offline-first demo)</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="bg-white border rounded-lg p-3 text-center shadow-sm w-28 sm:w-36">
              <div className="text-xs text-gray-500">Active logs</div>
              <div className="text-2xl font-bold">{totalLogs}</div>
            </div>
            <div className="bg-white border rounded-lg p-3 text-center shadow-sm w-28 sm:w-36">
              <div className="text-xs text-gray-500">Today</div>
              <div className="text-2xl font-bold">{logsToday}</div>
            </div>
            <div className="flex gap-2">
              <div className="relative inline-block">
                <button onClick={() => exportCSV(false)} className="px-3 py-2 border rounded-lg bg-white text-sm w-full md:w-auto">Export</button>
                <button onClick={() => exportCSV(true)} className="ml-2 px-3 py-2 border rounded-lg bg-white text-sm hidden md:inline-block">All</button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white border rounded-lg p-3 sm:p-4 mb-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search logs..." className="w-full md:w-80 border rounded px-3 py-2 focus:outline-none focus:ring" />

            <label className="flex items-center gap-2 text-sm ml-1">
              <input type="checkbox" checked={showOnlyToday} onChange={(e) => setShowOnlyToday(e.target.checked)} />
              Today
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={markdownPreview} onChange={(e) => setMarkdownPreview(e.target.checked)} />
              MD
            </label>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-3 py-2 text-sm">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="recentlyEdited">Recently edited</option>
            </select>

            <button onClick={() => { setShowTrash((s) => !s); }} className={`px-3 py-2 rounded text-sm ${showTrash ? "bg-red-50 border" : "bg-white border"}`}>{showTrash ? "Trash" : "View Trash"}</button>
          </div>
        </div>

        {/* Tag chips */}
        <div className="mb-4 flex gap-2 items-center flex-wrap">
          <button onClick={() => setActiveTagFilter("")} className={`px-3 py-1 rounded ${!activeTagFilter ? "bg-blue-600 text-white" : "bg-white border"}`}>All</button>
          {allTags.map((t) => (
            <button key={t} onClick={() => setActiveTagFilter(t)} className={`px-3 py-1 rounded ${activeTagFilter === t ? "bg-indigo-600 text-white" : "bg-white border"}`}>#{t}</button>
          ))}
        </div>

        {/* Layout: main + aside stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">Recent logs</h2>
                <div className="text-sm text-gray-500">{filtered.length} shown</div>
              </div>

              {filtered.length === 0 ? (
                <div className="py-8 text-center text-gray-500">No logs found.</div>
              ) : (
                <ul className="space-y-3">
                  {filtered.map((l) => (
                    <li key={l.id} className="border rounded-lg p-3 hover:shadow-md flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 transition">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium text-base sm:text-lg">{l.title}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${l.status === "submitted" ? "bg-yellow-100 text-yellow-800" : l.status === "approved" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{l.status}</span>
                          </div>
                          <div className="text-xs text-gray-400">{formatDate(l.createdAt)}</div>
                        </div>

                        <p className="text-sm text-gray-700 mt-2 line-clamp-3">{l.body || <span className="text-gray-400">(no details)</span>}</p>

                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          {(l.tags || []).slice(0, 6).map((t, i) => (
                            <button key={i} onClick={() => setActiveTagFilter(t)} className="text-xs bg-indigo-50 border rounded px-2 py-1">{t}</button>
                          ))}
                          {l.tags && l.tags.length > 6 && <span className="text-xs text-gray-500">+{l.tags.length - 6} more</span>}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex flex-wrap gap-2 justify-end w-full sm:w-auto">
                        {!showTrash ? (
                          <>
                            <button onClick={() => openEditModal(l.id)} className="px-3 py-2 border rounded text-sm w-full sm:w-auto">Edit</button>
                            <button onClick={() => handleDuplicate(l.id)} className="px-3 py-2 border rounded text-sm w-full sm:w-auto">Duplicate</button>
                            <button onClick={() => handleCopyToClipboard(l.id)} className="px-3 py-2 border rounded text-sm w-full sm:w-auto">Copy</button>
                            <button onClick={() => softDelete(l.id)} className="px-3 py-2 border rounded text-sm text-red-600 w-full sm:w-auto">Trash</button>
                            <button onClick={() => submitForReview(l.id)} className="px-3 py-2 border rounded text-sm bg-yellow-50 w-full sm:w-auto">Submit</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => restoreFromTrash(l.id)} className="px-3 py-2 border rounded text-sm w-full sm:w-auto">Restore</button>
                            <button onClick={() => permanentDelete(l.id)} className="px-3 py-2 border rounded text-sm text-red-600 w-full sm:w-auto">Delete</button>
                          </>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
              <h3 className="font-medium mb-2">Last 7 days</h3>
              <div className="flex items-end gap-2 h-24 sm:h-28">
                {last7.map((d) => {
                  const max = Math.max(...last7.map((x) => x.count), 1);
                  const height = Math.round((d.count / max) * 100) + 8; // min height
                  return (
                    <div key={d.key} className="flex-1 text-center">
                      <div className="h-full flex items-end justify-center">
                        <div className="w-6 sm:w-8 rounded-t" style={{ height: `${height}%`, background: "linear-gradient(180deg, rgba(79,70,229,0.95), rgba(99,102,241,0.95))" }} />
                      </div>
                      <div className="text-xs mt-1">{d.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
              <h3 className="font-medium mb-2">Quick actions</h3>
              <div className="flex flex-col gap-2">
                <button onClick={openCreateModal} className="w-full text-left px-3 py-2 border rounded">+ Create new log</button>
                <button onClick={() => { if (!confirm("Empty trash permanently?")) return; setLogs((prev) => prev.filter((l) => !l.isDeleted)); }} className="w-full text-left px-3 py-2 border rounded text-red-600">Empty trash</button>
                <button onClick={() => { if (!confirm("Move all active logs to trash?")) return; setLogs((prev) => prev.map((l) => ({ ...l, isDeleted: true, deletedAt: new Date().toISOString() }))); }} className="w-full text-left px-3 py-2 border rounded text-red-600">Move all to trash</button>
                <button onClick={() => exportCSV(false)} className="w-full text-left px-3 py-2 border rounded">Export filtered CSV</button>
              </div>
            </div>

            {/* TODO: TodoList card - follows the same design language */}
            <div className="bg-white border rounded-lg p-3 sm:p-4 shadow-sm">
              <h3 className="font-medium mb-2">Todo List</h3>

              <form onSubmit={addTodo} className="flex gap-2 mb-3">
                <input value={todoInput} onChange={(e) => setTodoInput(e.target.value)} placeholder="Add a todo..." className="flex-1 border rounded px-3 py-2" />
                <button type="submit" className="px-3 py-2 border rounded">Add</button>
              </form>

              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <button onClick={() => setTodoFilter("all")} className={`px-2 py-1 text-xs rounded ${todoFilter === "all" ? "bg-blue-600 text-white" : "bg-white border"}`}>All</button>
                <button onClick={() => setTodoFilter("active")} className={`px-2 py-1 text-xs rounded ${todoFilter === "active" ? "bg-indigo-600 text-white" : "bg-white border"}`}>Active</button>
                <button onClick={() => setTodoFilter("completed")} className={`px-2 py-1 text-xs rounded ${todoFilter === "completed" ? "bg-green-600 text-white" : "bg-white border"}`}>Done</button>
                <button onClick={clearCompletedTodos} className="ml-auto text-xs text-red-600">Clear done</button>
              </div>

              <div className="space-y-2 max-h-48 overflow-auto">
                {visibleTodos.length === 0 ? (
                  <div className="text-xs text-gray-400">No todos.</div>
                ) : (
                  visibleTodos.map((t) => (
                    <div key={t.id} className="flex items-center gap-2 border rounded px-2 py-3">
                      <input type="checkbox" checked={!!t.completed} onChange={() => toggleTodo(t.id)} className="h-5 w-5" />
                      <div className={`flex-1 text-sm ${t.completed ? "line-through text-gray-400" : "text-gray-800"}`}>{t.text}</div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEditTodo(t.id)} className="px-3 py-2 text-sm border rounded">Edit</button>
                        <button onClick={() => deleteTodo(t.id)} className="px-3 py-2 text-sm border rounded text-red-600">Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* edit inline */}
              {editingTodoId && (
                <div className="mt-3 border rounded p-3 bg-gray-50">
                  <div className="text-xs text-gray-500 mb-2">Editing</div>
                  <input value={editingTodoText} onChange={(e) => setEditingTodoText(e.target.value)} className="w-full border rounded px-3 py-2 mb-2" />
                  <div className="flex gap-2 justify-end">
                    <button onClick={cancelEditTodo} className="px-3 py-2 border rounded text-sm">Cancel</button>
                    <button onClick={saveEditTodo} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">Save</button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <div className="text-xs text-gray-500">{todos.length} total</div>
                <button onClick={exportTodosCSV} className="ml-auto px-3 py-2 border rounded text-xs">Export</button>
              </div>
            </div>

          </aside>
        </div>
      </div>

      {/* Floating plus button bottom-right */}
      <button title="Create new log" onClick={openCreateModal} className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 bg-blue-600 hover:bg-blue-600 text-white rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-2xl flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modal overlay for create / edit - responsive: full-screen on small, centered on md+ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-10">
          {/* overlay */}
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setIsModalOpen(false)} />

          {/* modal container */}
          <div className="relative bg-white rounded-tl-lg rounded-tr-lg md:rounded-lg w-full h-full md:h-auto md:w-[min(95%,1000px)] md:max-w-5xl overflow-auto grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:p-6"> 
            {/* top chrome for small screens */}
            <div className="md:hidden absolute right-3 top-3 z-20">
              <button onClick={() => setIsModalOpen(false)} className="px-3 py-2 border rounded bg-white">Close</button>
            </div>

            {/* left column */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{editingId ? "Edit log" : "Create new log"}</h2>
                <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                  <div>Time: {formatDate(new Date().toISOString())}</div>
                  <button onClick={() => setIsModalOpen(false)} className="px-2 py-1 border rounded">Close</button>
                </div>
              </div>

              <div className="space-y-3 overflow-visible">
                <input className="w-full border rounded px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />

                <textarea rows={10} className="w-full border rounded px-3 py-2 min-h-[120px] resize-y" placeholder="Details, observations, steps..." value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />

                <div className="flex gap-2 flex-col sm:flex-row">
                  <input className="flex-1 border rounded px-3 py-2" placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} />
                  <input className="w-full sm:w-28 border rounded px-3 py-2" placeholder="Hours" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))} />
                </div>

                <div className="flex items-center gap-3 justify-end flex-wrap">
                  {editingId && (
                    <button onClick={() => { if (!confirm("Move this to trash?")) return; softDelete(editingId); setIsModalOpen(false); }} className="px-3 py-2 border rounded text-sm text-red-600">Trash</button>
                  )}
                  <button onClick={() => { clearDraft(); setIsModalOpen(false); }} className="px-3 py-2 border rounded text-sm">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                  {editingId && (
                    <button onClick={() => submitForReview(editingId)} className="px-4 py-2 bg-yellow-100 rounded">Submit</button>
                  )}
                </div>

                <div className="text-xs text-gray-400">Autosaves while the modal is open. Draft is cleared on save.</div>
              </div>
            </div>

            {/* right column */}
            <div className="min-h-0 flex flex-col">
              <h4 className="font-medium mb-2">Live preview</h4>
              <div className="border rounded p-3 bg-gray-50 h-full overflow-auto">
                <h3 className="font-semibold text-lg">{form.title || "(Untitled)"}</h3>
                <div className="text-xs text-gray-500 mb-2">Status: <span className={`px-2 py-1 rounded ${editingId ? "bg-gray-100" : "bg-gray-50"}`}>{editingId ? (logs.find((l) => l.id === editingId)?.status || "draft") : "draft"}</span></div>
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: (form.body || "").replace(/\n/g, "<br/>") }} />
                <div className="mt-3 flex gap-2 flex-wrap">{(form.tags || "").split(",").map((t) => t.trim()).filter(Boolean).slice(0, 6).map((t, i) => (<span key={i} className="text-xs bg-indigo-50 border rounded px-2 py-1">{t}</span>))}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// small util used in several places
function formatDate(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${day}-${mo}-${y} ${h}:${m}`;
  } catch (e) {
    return iso;
  }
}
