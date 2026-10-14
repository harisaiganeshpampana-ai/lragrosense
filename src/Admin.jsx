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
  Users,
  Mail,
  Phone,
  FileText,
  Linkedin,
  ChevronDown,
  Bot,
  Inbox,
  Sparkles,
} from "lucide-react";
import { API_BASE } from "./config";
import { DEFAULT_INSTRUCTIONS, InterviewBadge, InterviewPanel } from "./AdminInterview";
import { Cofounder, Outbox, ScreenBadge, ScreenPanel } from "./AdminCofounder";

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
  interviewInstructions: "",
  interviewQuestions: 6,
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
  const [tab, setTab] = useState("internships"); // internships | applications | outbox | cofounder
  const [appFilter, setAppFilter] = useState("");
  const [draftCount, setDraftCount] = useState(0);

  // Number of emails waiting in the Outbox (shown on the tab)
  const refreshDrafts = async () => {
    try {
      const list = await api("/api/admin/outbox", { token });
      setDraftCount(list.filter((e) => e.status === "draft").length);
    } catch {
      /* ignore */
    }
  };

  const showApplications = (internshipId = "") => {
    setAppFilter(internshipId);
    setTab("applications");
  };

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
    refreshDrafts();
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
      setItems((list) =>
        list.map((i) =>
          i._id === item._id ? { ...updated, applicationCount: i.applicationCount } : i
        )
      );
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
      return exists
        ? list.map((i) =>
            i._id === saved._id ? { ...saved, applicationCount: i.applicationCount } : i
          )
        : [{ ...saved, applicationCount: 0 }, ...list];
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
        <div className="tabs">
          <button
            className={tab === "internships" ? "active" : ""}
            onClick={() => setTab("internships")}
          >
            <Briefcase size={16} /> Internships
          </button>
          <button
            className={tab === "applications" ? "active" : ""}
            onClick={() => showApplications("")}
          >
            <Users size={16} /> Applications
          </button>
          <button className={tab === "outbox" ? "active" : ""} onClick={() => setTab("outbox")}>
            <Inbox size={16} /> Outbox
            {draftCount > 0 && <span className="tab-count">{draftCount}</span>}
          </button>
          <button className={tab === "cofounder" ? "active" : ""} onClick={() => setTab("cofounder")}>
            <Bot size={16} /> Co-founder
          </button>
        </div>

        {tab === "outbox" ? (
          <Outbox token={token} api={api} onAuthError={onLogout} onCount={setDraftCount} />
        ) : tab === "cofounder" ? (
          <Cofounder token={token} api={api} onAuthError={onLogout} />
        ) : tab === "applications" ? (
          <Applications
            token={token}
            internships={items}
            filter={appFilter}
            setFilter={setAppFilter}
            onAuthError={onLogout}
            onDraftsChanged={refreshDrafts}
            openOutbox={() => setTab("outbox")}
          />
        ) : (
          <>
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
                      <button className="count-link" onClick={() => showApplications(item._id)}>
                        <Users size={14} /> {item.applicationCount || 0} application
                        {item.applicationCount === 1 ? "" : "s"}
                      </button>
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
          </>
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

/* ---------------- Applications ---------------- */

const STATUSES = [
  { value: "new", label: "New" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
];

function Applications({
  token,
  internships,
  filter,
  setFilter,
  onAuthError,
  onDraftsChanged,
  openOutbox,
}) {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openId, setOpenId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [interviews, setInterviews] = useState([]);
  const [sortBy, setSortBy] = useState("newest"); // newest | score
  const [notice, setNotice] = useState("");
  const [screening, setScreening] = useState(false);

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const query = filter ? `?internship=${filter}` : "";
      const [appList, interviewList] = await Promise.all([
        api(`/api/admin/applications${query}`, { token }),
        api("/api/admin/interviews", { token }).catch(() => []),
      ]);
      setApps(appList);
      setInterviews(interviewList);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const changeStatus = async (app, status) => {
    setBusyId(app._id);
    try {
      const updated = await api(`/api/admin/applications/${app._id}`, {
        token,
        method: "PUT",
        body: { status },
      });
      setApps((list) => list.map((a) => (a._id === app._id ? updated : a)));
      if (updated.emailDraft) {
        setNotice(
          updated.emailDraft.status === "sent"
            ? `Result email sent to ${app.name}.`
            : `Your co-founder wrote a result email for ${app.name}. Check it in the Outbox.`
        );
        onDraftsChanged?.();
      }
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const replaceApp = (updated) =>
    setApps((list) => list.map((a) => (a._id === updated._id ? { ...a, ...updated } : a)));

  // Ask the AI co-founder to screen every application it hasn't looked at yet
  const screenAll = async () => {
    setScreening(true);
    setError("");
    try {
      const result = await api("/api/admin/screen-all", { token, method: "POST" });
      setNotice(
        result.screened
          ? `Screened ${result.screened} application${result.screened === 1 ? "" : "s"}.${
              result.left ? ` ${result.left} left — click again.` : ""
            }`
          : "All applications are already screened."
      );
      await load();
    } catch (err) {
      handleError(err);
    } finally {
      setScreening(false);
    }
  };

  // Resume files need the admin login, so download them with the token and open them
  const openResume = async (app) => {
    const tab = window.open("", "_blank");
    setBusyId(app._id);
    try {
      const response = await fetch(`${API_BASE}/api/admin/applications/${app._id}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) {
        if (tab) tab.close();
        onAuthError();
        return;
      }
      if (!response.ok) throw new Error("Could not open the resume file.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const isPdf = blob.type === "application/pdf";
      if (isPdf && tab) {
        tab.location.href = url;
      } else {
        if (tab) tab.close();
        const link = document.createElement("a");
        link.href = url;
        link.download = app.resumeFileName || "resume";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (err) {
      if (tab) tab.close();
      setError(err.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (app) => {
    if (!window.confirm(`Delete the application from ${app.name}? This cannot be undone.`)) return;
    setBusyId(app._id);
    try {
      await api(`/api/admin/applications/${app._id}`, { token, method: "DELETE" });
      setApps((list) => list.filter((a) => a._id !== app._id));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  // Newest AI interview for each application
  const interviewFor = (appId) => interviews.find((iv) => iv.application === appId) || null;

  const onInterviewChange = (updated, removedId) => {
    if (updated && updated.status === "pending") {
      setNotice(`Interview invite email for ${updated.candidateName} is ready in the Outbox.`);
      onDraftsChanged?.();
    }
    setInterviews((list) => {
      if (!updated) return list.filter((iv) => iv._id !== removedId);
      const others = list.filter(
        (iv) =>
          iv._id !== updated._id &&
          !(iv.application === updated.application && iv.status !== "completed")
      );
      return [updated, ...others];
    });
  };

  const counts = STATUSES.reduce(
    (acc, s) => ({ ...acc, [s.value]: apps.filter((a) => a.status === s.value).length }),
    {}
  );
  const filtered = statusFilter === "all" ? apps : apps.filter((a) => a.status === statusFilter);
  const shown =
    sortBy === "score"
      ? [...filtered].sort((a, b) => (b.aiScreen?.score || 0) - (a.aiScreen?.score || 0))
      : filtered;
  const unscreened = apps.filter((a) => !a.aiScreen).length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Applications</h1>
          <p>
            {apps.length} total · {counts.new || 0} new
          </p>
        </div>
        <div className="apps-tools">
          {unscreened > 0 && (
            <button className="btn btn-light" onClick={screenAll} disabled={screening}>
              {screening ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />}
              {screening ? "Screening…" : `Screen ${unscreened} with AI`}
            </button>
          )}
          <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="score">Best AI match first</option>
          </select>
          <select
            className="filter-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All internships</option>
            {internships.map((i) => (
              <option key={i._id} value={i._id}>
                {i.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {notice && (
        <p className="cf-notice" onClick={() => setNotice("")}>
          {notice}{" "}
          {notice.includes("Outbox") && (
            <button
              className="cf-link"
              onClick={(e) => {
                e.stopPropagation();
                openOutbox?.();
              }}
            >
              Open Outbox →
            </button>
          )}
        </p>
      )}

      <div className="chips">
        <button
          className={statusFilter === "all" ? "active" : ""}
          onClick={() => setStatusFilter("all")}
        >
          All ({apps.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s.value}
            className={statusFilter === s.value ? "active" : ""}
            onClick={() => setStatusFilter(s.value)}
          >
            {s.label} ({counts[s.value] || 0})
          </button>
        ))}
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
          <p>Loading applications…</p>
        </div>
      ) : shown.length === 0 && !error ? (
        <div className="empty">
          <Users size={32} />
          <h3>No applications here yet</h3>
          <p>When students apply on the Internships page, they'll show up here.</p>
        </div>
      ) : (
        <div className="list">
          {shown.map((app) => {
            const open = openId === app._id;
            return (
              <article key={app._id} className="app-card">
                <div className="app-top">
                  <button className="app-summary" onClick={() => setOpenId(open ? "" : app._id)}>
                    <span className="app-avatar">{(app.name || "?").charAt(0).toUpperCase()}</span>
                    <span className="app-who">
                      <strong>
                        {app.name}
                        <ScreenBadge screen={app.aiScreen} />
                        <InterviewBadge interview={interviewFor(app._id)} />
                      </strong>
                      <span>
                        {app.internshipTitle} · {formatDate(app.createdAt)}
                      </span>
                    </span>
                    <ChevronDown size={18} className={`app-chevron ${open ? "open" : ""}`} />
                  </button>
                  <div className="app-controls">
                    <select
                      className={`status-select status-${app.status}`}
                      value={app.status}
                      onChange={(e) => changeStatus(app, e.target.value)}
                      disabled={busyId === app._id}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="icon-btn icon-danger"
                      title="Delete"
                      onClick={() => remove(app)}
                      disabled={busyId === app._id}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="app-details">
                    <div className="app-links">
                      <a href={`mailto:${app.email}`} className="btn btn-light">
                        <Mail size={16} /> {app.email}
                      </a>
                      <a href={`tel:${app.phone}`} className="btn btn-light">
                        <Phone size={16} /> {app.phone}
                      </a>
                      <a
                        href={`https://wa.me/${app.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-light"
                      >
                        WhatsApp
                      </a>
                      {app.resumeFileName && (
                        <button
                          className="btn btn-light"
                          onClick={() => openResume(app)}
                          disabled={busyId === app._id}
                        >
                          <FileText size={16} /> Open resume
                        </button>
                      )}
                      {app.resumeLink && (
                        <a href={app.resumeLink} target="_blank" rel="noreferrer" className="btn btn-light">
                          <FileText size={16} /> Resume link
                        </a>
                      )}
                      {app.linkedin && (
                        <a href={app.linkedin} target="_blank" rel="noreferrer" className="btn btn-light">
                          <Linkedin size={16} /> LinkedIn
                        </a>
                      )}
                    </div>
                    <dl className="app-info">
                      <div>
                        <dt>College</dt>
                        <dd>{app.college || "—"}</dd>
                      </div>
                      <div>
                        <dt>Course</dt>
                        <dd>{app.course || "—"}</dd>
                      </div>
                      <div>
                        <dt>Year</dt>
                        <dd>{app.year || "—"}</dd>
                      </div>
                      <div>
                        <dt>City</dt>
                        <dd>{app.city || "—"}</dd>
                      </div>
                    </dl>
                    {app.message && (
                      <div className="app-message">
                        <dt>Why they want to join</dt>
                        <p>{app.message}</p>
                      </div>
                    )}
                    <ScreenPanel
                      app={app}
                      token={token}
                      api={api}
                      onUpdate={replaceApp}
                      onAuthError={onAuthError}
                    />
                    <InterviewPanel
                      key={interviewFor(app._id)?._id || "none"}
                      app={app}
                      interview={interviewFor(app._id)}
                      internship={internships.find((i) => i._id === app.internship)}
                      token={token}
                      api={api}
                      onChange={onInterviewChange}
                      onAuthError={onAuthError}
                    />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
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
      delete body.applicationCount;
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
            <span>External application link (optional)</span>
            <input
              value={form.applyLink}
              onChange={set("applyLink")}
              placeholder="Leave empty to use the built-in application form"
            />
          </label>

          <div className="form-section">
            <Bot size={18} /> AI voice interview
          </div>

          <label className="field">
            <span>Your instructions for the AI interviewer</span>
            <textarea
              rows={6}
              value={form.interviewInstructions}
              onChange={set("interviewInstructions")}
              placeholder={DEFAULT_INSTRUCTIONS}
              maxLength={4000}
            />
            <small className="field-hint">
              Tell the AI what to ask and what to check. Used when you create an AI interview for a
              shortlisted student (you can still change it for each student).
            </small>
          </label>

          <label className="field" style={{ maxWidth: 220 }}>
            <span>Number of AI questions</span>
            <input
              type="number"
              min="3"
              max="15"
              value={form.interviewQuestions}
              onChange={set("interviewQuestions")}
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
