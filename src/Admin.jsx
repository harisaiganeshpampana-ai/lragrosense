import React, { useEffect, useState } from "react";
import {
  Sprout,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Loader2,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { API_BASE } from "./config";

const TOKEN_KEY = "lr_admin_token";

const emptyForm = {
  title: "",
  category: "",
  mode: "Remote",
  location: "",
  duration: "",
  stipend: "Unpaid",
  openings: 1,
  deadline: "",
  description: "",
  skills: "",
  applyLink: "",
  isOpen: true,
};

function readToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

function saveToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function api(path, { token, method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(
      "Could not reach the server. It may be waking up. Please wait 30–60 seconds and try again."
    );
  }
  let data = {};
  try {
    data = await response.json();
  } catch {
    /* empty response */
  }
  if (!response.ok) {
    const error = new Error(data.error || "Something went wrong.");
    error.status = response.status;
    throw error;
  }
  return data;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Admin() {
  const [token, setToken] = useState(readToken);

  const logout = () => {
    saveToken("");
    setToken("");
  };

  if (!token) {
    return (
      <Login
        onLogin={(t) => {
          saveToken(t);
          setToken(t);
        }}
      />
    );
  }

  return <Dashboard token={token} onLogout={logout} />;
}

/* ---------------- Login ---------------- */

function Login({ onLogin }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api("/api/admin/login", {
        method: "POST",
        body: { password },
      });
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="login-brand">
          <span className="brand-mark">
            <Sprout size={20} />
          </span>
          <div>
            <strong>LR AgroSense</strong>
            <span>Admin portal</span>
          </div>
        </div>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            autoFocus
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button className="btn btn-primary btn-full" disabled={loading}>
          {loading ? <Loader2 size={18} className="spin" /> : null}
          {loading ? "Logging in…" : "Log in"}
        </button>

        <a href="/" className="back-link">
          ← Back to website
        </a>
      </form>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */

function Dashboard({ token, onLogout }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // null | "new" | item
  const [busyId, setBusyId] = useState("");

  const handleError = (err) => {
    if (err.status === 401) onLogout();
    else setError(err.message);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await api("/api/admin/internships", { token }));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleOpen = async (item) => {
    setBusyId(item._id);
    try {
      const updated = await api(`/api/admin/internships/${item._id}`, {
        token,
        method: "PUT",
        body: { isOpen: !item.isOpen },
      });
      setItems((list) => list.map((i) => (i._id === item._id ? updated : i)));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    setBusyId(item._id);
    try {
      await api(`/api/admin/internships/${item._id}`, { token, method: "DELETE" });
      setItems((list) => list.filter((i) => i._id !== item._id));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const onSaved = (saved) => {
    setItems((list) => {
      const exists = list.some((i) => i._id === saved._id);
      return exists ? list.map((i) => (i._id === saved._id ? saved : i)) : [saved, ...list];
    });
    setEditing(null);
  };

  const openCount = items.filter((i) => i.isOpen).length;

  return (
    <div className="dash">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="login-brand">
            <span className="brand-mark">
              <Sprout size={18} />
            </span>
            <div>
              <strong>LR AgroSense</strong>
              <span>Admin portal</span>
            </div>
          </div>
          <div className="topbar-actions">
            <a href="/#careers" target="_blank" rel="noreferrer" className="btn btn-light">
              <ExternalLink size={16} /> <span className="hide-sm">View website</span>
            </a>
            <button className="btn btn-light" onClick={onLogout}>
              <LogOut size={16} /> <span className="hide-sm">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="dash-head">
          <div>
            <h1>Internships</h1>
            <p>
              {items.length} total · {openCount} showing on the website
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setEditing("new")}>
            <Plus size={18} /> Add internship
          </button>
        </div>

        {error && (
          <div className="error-box">
            <p>{error}</p>
            <button className="btn btn-light" onClick={load}>
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="empty">
            <Loader2 size={28} className="spin" />
            <p>Loading internships… (the server may take up to a minute to wake up)</p>
          </div>
        ) : items.length === 0 && !error ? (
          <div className="empty">
            <Briefcase size={32} />
            <h3>No internships yet</h3>
            <p>Add your first internship and it will appear on the website.</p>
            <button className="btn btn-primary" onClick={() => setEditing("new")}>
              <Plus size={18} /> Add internship
            </button>
          </div>
        ) : (
          <div className="list">
            {items.map((item) => (
              <article key={item._id} className={`row ${item.isOpen ? "" : "row-closed"}`}>
                <div className="row-main">
                  <div className="row-title">
                    <h3>{item.title}</h3>
                    <span className={`status ${item.isOpen ? "status-open" : "status-closed"}`}>
                      {item.isOpen ? "Live on website" : "Hidden"}
                    </span>
                  </div>
                  <p className="row-meta">
                    {[
                      item.category,
                      item.mode,
                      item.location,
                      item.duration,
                      item.stipend,
                      item.deadline ? `Apply by ${formatDate(item.deadline)}` : "",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="row-actions">
                  <button
                    className="icon-btn"
                    title={item.isOpen ? "Hide from website" : "Show on website"}
                    onClick={() => toggleOpen(item)}
                    disabled={busyId === item._id}
                  >
                    {item.isOpen ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    className="icon-btn"
                    title="Edit"
                    onClick={() => setEditing(item)}
                    disabled={busyId === item._id}
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    className="icon-btn icon-danger"
                    title="Delete"
                    onClick={() => remove(item)}
                    disabled={busyId === item._id}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {editing && (
        <InternshipForm
          token={token}
          item={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={onSaved}
          onAuthError={onLogout}
        />
      )}
    </div>
  );
}

/* ---------------- Add / edit form ---------------- */

function InternshipForm({ token, item, onClose, onSaved, onAuthError }) {
  const [form, setForm] = useState(() =>
    item
      ? {
          ...emptyForm,
          ...item,
          deadline: item.deadline ? item.deadline.slice(0, 10) : "",
          skills: (item.skills || []).join(", "),
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key) => (e) =>
    setForm((f) => ({
      ...f,
      [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const body = { ...form };
      delete body._id;
      delete body.createdAt;
      delete body.updatedAt;
      delete body.__v;
      const saved = item
        ? await api(`/api/admin/internships/${item._id}`, { token, method: "PUT", body })
        : await api("/api/admin/internships", { token, method: "POST", body });
      onSaved(saved);
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <form className="modal" onSubmit={submit} onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{item ? "Edit internship" : "Add internship"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <label className="field">
            <span>Title *</span>
            <input
              value={form.title}
              onChange={set("title")}
              placeholder="e.g. Agriculture Research Intern"
              required
            />
          </label>

          <div className="grid-2">
            <label className="field">
              <span>Category</span>
              <input
                value={form.category}
                onChange={set("category")}
                placeholder="e.g. Research, Technology, Marketing"
              />
            </label>
            <label className="field">
              <span>Work mode</span>
              <select value={form.mode} onChange={set("mode")}>
                <option>Remote</option>
                <option>On-site</option>
                <option>Hybrid</option>
              </select>
            </label>
          </div>

          <div className="grid-2">
            <label className="field">
              <span>Location</span>
              <input
                value={form.location}
                onChange={set("location")}
                placeholder="e.g. Andhra Pradesh (optional)"
              />
            </label>
            <label className="field">
              <span>Duration</span>
              <input value={form.duration} onChange={set("duration")} placeholder="e.g. 2 months" />
            </label>
          </div>

          <div className="grid-3">
            <label className="field">
              <span>Stipend</span>
              <input value={form.stipend} onChange={set("stipend")} placeholder="e.g. Unpaid" />
            </label>
            <label className="field">
              <span>Openings</span>
              <input
                type="number"
                min="1"
                value={form.openings}
                onChange={set("openings")}
              />
            </label>
            <label className="field">
              <span>Apply by</span>
              <input type="date" value={form.deadline} onChange={set("deadline")} />
            </label>
          </div>

          <label className="field">
            <span>Description</span>
            <textarea
              rows={5}
              value={form.description}
              onChange={set("description")}
              placeholder="What will the intern do? Who should apply?"
            />
          </label>

          <label className="field">
            <span>Skills (separate with commas)</span>
            <input
              value={form.skills}
              onChange={set("skills")}
              placeholder="e.g. Agronomy, Excel, Communication"
            />
          </label>

          <label className="field">
            <span>Application link (optional)</span>
            <input
              value={form.applyLink}
              onChange={set("applyLink")}
              placeholder="e.g. a Google Form link. Leave empty to apply by email."
            />
          </label>

          <label className="check">
            <input type="checkbox" checked={form.isOpen} onChange={set("isOpen")} />
            <span>Show this internship on the website</span>
          </label>

          {error && <p className="error">{error}</p>}
        </div>

        <div className="modal-foot">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={saving}>
            {saving ? <Loader2 size={18} className="spin" /> : null}
            {saving ? "Saving…" : item ? "Save changes" : "Publish internship"}
          </button>
        </div>
      </form>
    </div>
  );
}
