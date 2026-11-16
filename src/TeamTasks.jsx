import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "doing", label: "Doing" },
  { key: "done", label: "Done" },
];

function dateLabel(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function toInputDate(value) {
  if (!value) return "";
  const d = new Date(value);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function isOverdue(task) {
  if (!task.dueDate || task.status === "done") return false;
  const end = new Date(task.dueDate);
  end.setHours(23, 59, 59, 999);
  return end.getTime() < Date.now();
}

export default function TeamTasks({ token, api, onAuthError }) {
  const [tasks, setTasks] = useState([]);
  const [people, setPeople] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | mine | person id
  const [editing, setEditing] = useState(null); // task object, or {} for new
  const [busyId, setBusyId] = useState("");

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const load = () =>
    Promise.all([api("/api/workspace/people", { token }), api("/api/workspace/tasks", { token })])
      .then(([p, list]) => {
        setMe(p.me);
        setPeople(p.people);
        setTasks(list);
      })
      .catch(handleError)
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const move = async (task, dir) => {
    const idx = COLUMNS.findIndex((c) => c.key === task.status);
    const next = COLUMNS[idx + dir];
    if (!next) return;
    setBusyId(task._id);
    try {
      const updated = await api(`/api/workspace/tasks/${task._id}`, { token, method: "PUT", body: { status: next.key } });
      setTasks((list) => list.map((t) => (t._id === task._id ? updated : t)));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (task) => {
    if (!window.confirm(`Delete the task "${task.title}"?`)) return;
    setBusyId(task._id);
    try {
      await api(`/api/workspace/tasks/${task._id}`, { token, method: "DELETE" });
      setTasks((list) => list.filter((t) => t._id !== task._id));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const shown = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "mine") return me && t.assigneeId === me.id;
    return t.assigneeId === filter;
  });

  const openCount = tasks.filter((t) => t.status !== "done").length;
  const overdueCount = tasks.filter(isOverdue).length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Tasks</h1>
          <p>
            {openCount} open · {overdueCount} overdue · the person assigned gets an email
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({})}>
          <Plus size={18} /> New task
        </button>
      </div>

      <div className="fr-admin-filter pt-filters">
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">Everyone's tasks</option>
          <option value="mine">My tasks</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="empty">
          <Loader2 className="spin" /> Loading tasks…
        </div>
      ) : (
        <div className="tt-board">
          {COLUMNS.map((col, ci) => {
            const items = shown.filter((t) => t.status === col.key);
            return (
              <section key={col.key} className={`tt-col tt-${col.key}`}>
                <header>
                  <strong>{col.label}</strong>
                  <span>{items.length}</span>
                </header>
                {items.length === 0 && <p className="tt-empty">Nothing here</p>}
                {items.map((t) => (
                  <article key={t._id} className={`tt-card ${isOverdue(t) ? "overdue" : ""}`}>
                    <div className="tt-title">{t.title}</div>
                    {t.notes && <p className="tt-notes">{t.notes}</p>}
                    <div className="tt-meta">
                      <span className="tt-who">{t.assigneeName || "Unassigned"}</span>
                      {t.dueDate && <span className="tt-due">{isOverdue(t) ? "⚠ " : ""}Due {dateLabel(t.dueDate)}</span>}
                    </div>
                    <div className="tt-actions">
                      <button className="icon-btn" disabled={ci === 0 || busyId === t._id} onClick={() => move(t, -1)} title="Move back">
                        <ChevronLeft size={16} />
                      </button>
                      <button className="icon-btn" onClick={() => setEditing(t)} title="Edit">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn icon-danger" disabled={busyId === t._id} onClick={() => remove(t)} title="Delete">
                        <Trash2 size={15} />
                      </button>
                      <button
                        className="icon-btn"
                        disabled={ci === COLUMNS.length - 1 || busyId === t._id}
                        onClick={() => move(t, 1)}
                        title="Move forward"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </article>
                ))}
              </section>
            );
          })}
        </div>
      )}

      {editing && (
        <TaskForm
          task={editing}
          people={people}
          token={token}
          api={api}
          onAuthError={onAuthError}
          onClose={() => setEditing(null)}
          onSaved={(saved) => {
            setTasks((list) => (list.some((t) => t._id === saved._id) ? list.map((t) => (t._id === saved._id ? saved : t)) : [saved, ...list]));
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function TaskForm({ task, people, token, api, onClose, onSaved, onAuthError }) {
  const isNew = !task._id;
  const [form, setForm] = useState({
    title: task.title || "",
    notes: task.notes || "",
    assigneeId: task.assigneeId || "",
    dueDate: toInputDate(task.dueDate),
    status: task.status || "todo",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const saved = isNew
        ? await api("/api/workspace/tasks", { token, method: "POST", body: form })
        : await api(`/api/workspace/tasks/${task._id}`, { token, method: "PUT", body: form });
      onSaved(saved);
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="modal-head">
          <h2>{isNew ? "New task" : "Edit task"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            Task *
            <input required value={form.title} onChange={set("title")} maxLength={200} placeholder="e.g. Research watering levels for banana" />
          </label>
          <label className="field">
            Notes
            <textarea rows={3} value={form.notes} onChange={set("notes")} maxLength={3000} />
          </label>
          <div className="grid-2">
            <label className="field">
              Assign to
              <select value={form.assigneeId} onChange={set("assigneeId")}>
                <option value="">Nobody yet</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              Due date
              <input type="date" value={form.dueDate} onChange={set("dueDate")} />
            </label>
          </div>
          <label className="field">
            Status
            <select value={form.status} onChange={set("status")}>
              {COLUMNS.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          {error && <div className="error-box">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : null} {isNew ? "Add task" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
