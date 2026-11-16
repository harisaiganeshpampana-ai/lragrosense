import React, { useEffect, useState } from "react";
import { Copy, KeyRound, Loader2, MessageCircle, Plus, Power, Trash2, X } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

const CONFIG = {
  intern: {
    listPath: "/api/team/interns",
    title: "Interns",
    singular: "intern",
    portal: "https://lragrosense.in/intern.html",
    intro: "Add an intern's Gmail. A password is made for them. Send both to the intern on WhatsApp.",
  },
  manager: {
    listPath: "/api/admin/managers",
    title: "Team managers",
    singular: "manager",
    portal: "https://lragrosense.in/team.html",
    intro: "Managers (like Sandeep) can add interns, check field reports and read daily updates. They cannot see internships, applications or settings.",
  },
};

function credentialsText(role, user, password) {
  const c = CONFIG[role];
  return [
    `Hi ${user.name.split(" ")[0]}, here is your LR AgroSense ${c.singular} login 🌱`,
    "",
    `Website: ${c.portal}`,
    `Email: ${user.email}`,
    `Password: ${password}`,
    "",
    role === "intern"
      ? "Log in and submit a report for every farmer you meet, plus a daily update. Please don't share this password."
      : "Log in to manage interns and review their reports. Please don't share this password.",
  ].join("\n");
}

export default function TeamPeople({ role, token, api, onAuthError }) {
  const c = CONFIG[role];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [creds, setCreds] = useState(null); // { user, password }

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await api(c.listPath, { token }));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const update = async (u, body, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(u._id);
    try {
      const data = await api(`${c.listPath}/${u._id}`, { token, method: "PUT", body });
      setItems((list) => list.map((x) => (x._id === u._id ? { ...x, ...data.user } : x)));
      if (data.password) setCreds({ user: data.user, password: data.password });
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name}'s login? Their submitted reports are kept.`)) return;
    setBusyId(u._id);
    try {
      await api(`${c.listPath}/${u._id}`, { token, method: "DELETE" });
      setItems((list) => list.filter((x) => x._id !== u._id));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const activeCount = items.filter((u) => u.active).length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>{c.title}</h1>
          <p>
            {items.length} logins · {activeCount} active
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          <Plus size={18} /> Add {c.singular}
        </button>
      </div>
      <p className="pt-intro">{c.intro}</p>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="empty">
          <Loader2 className="spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="empty">No {c.singular}s yet. Click "Add {c.singular}".</div>
      ) : (
        <div className="list">
          {items.map((u) => (
            <article key={u._id} className={`app-card ${u.active ? "" : "row-closed"}`}>
              <div className="app-top">
                <div className="app-summary pt-person">
                  <span className="app-avatar">{(u.name || "?").charAt(0).toUpperCase()}</span>
                  <span className="app-who">
                    <strong>
                      {u.name} {!u.active && <em className="pt-off">(turned off)</em>}
                    </strong>
                    <span>
                      {u.email}
                      {u.phone ? ` · ${u.phone}` : ""}
                      {u.college ? ` · ${u.college}` : ""}
                    </span>
                    <span className="pt-meta">
                      {role === "intern" && (
                        <>
                          {u.reports} visits ({u.verified} verified) · {u.updates} daily updates · last update{" "}
                          {formatDate(u.lastUpdateAt)} ·{" "}
                        </>
                      )}
                      last login {formatDate(u.lastLoginAt)}
                    </span>
                  </span>
                </div>
                <div className="app-controls">
                  <button
                    className="icon-btn"
                    title="Reset password"
                    disabled={busyId === u._id}
                    onClick={() =>
                      update(u, { resetPassword: true }, `Make a new password for ${u.name}? The old one will stop working.`)
                    }
                  >
                    <KeyRound size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    title={u.active ? "Turn login off" : "Turn login on"}
                    disabled={busyId === u._id}
                    onClick={() => update(u, { active: !u.active })}
                  >
                    <Power size={16} />
                  </button>
                  <button className="icon-btn icon-danger" title="Remove login" disabled={busyId === u._id} onClick={() => remove(u)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {adding && (
        <AddPerson
          role={role}
          token={token}
          api={api}
          onClose={() => setAdding(false)}
          onAuthError={onAuthError}
          onCreated={(data) => {
            setItems((list) => [{ ...data.user, reports: 0, verified: 0, updates: 0 }, ...list]);
            setAdding(false);
            setCreds(data);
          }}
        />
      )}

      {creds && <Credentials role={role} creds={creds} onClose={() => setCreds(null)} />}
    </>
  );
}

function AddPerson({ role, token, api, onClose, onCreated, onAuthError }) {
  const c = CONFIG[role];
  const [form, setForm] = useState({ name: "", email: "", phone: "", college: "", batch: role === "intern" ? "Batch 1" : "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onCreated(await api(c.listPath, { token, method: "POST", body: form }));
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
          <h2>Add {c.singular}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            Full name *
            <input required value={form.name} onChange={set("name")} maxLength={100} />
          </label>
          <label className="field">
            Gmail / email *
            <input required type="email" value={form.email} onChange={set("email")} maxLength={200} placeholder="name@gmail.com" />
          </label>
          <div className="grid-2">
            <label className="field">
              Phone
              <input value={form.phone} onChange={set("phone")} maxLength={20} />
            </label>
            {role === "intern" && (
              <label className="field">
                Batch
                <input value={form.batch} onChange={set("batch")} maxLength={60} />
              </label>
            )}
          </div>
          {role === "intern" && (
            <label className="field">
              College
              <input value={form.college} onChange={set("college")} maxLength={150} />
            </label>
          )}
          <p className="pt-intro">A password will be created automatically. You'll see it on the next screen.</p>
          {error && <div className="error-box">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : <Plus size={16} />} Create login
          </button>
        </div>
      </form>
    </div>
  );
}

function Credentials({ role, creds, onClose }) {
  const [copied, setCopied] = useState(false);
  const text = credentialsText(role, creds.user, creds.password);
  const phone = (creds.user.phone || "").replace(/\D/g, "");
  const waNumber = phone.length === 10 ? `91${phone}` : phone;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this message:", text);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Login ready for {creds.user.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <div className="pt-cred">
            <div>
              <span>Email</span>
              <strong>{creds.user.email}</strong>
            </div>
            <div>
              <span>Password</span>
              <strong className="pt-mono">{creds.password}</strong>
            </div>
          </div>
          <p className="pt-warn">
            ⚠ Save or send this now. For safety the password is not stored in readable form, so you won't see it
            again. If it's lost, use "Reset password".
          </p>
          <pre className="pt-msg">{text}</pre>
        </div>
        <div className="modal-foot">
          <button className="btn btn-light" onClick={copy}>
            <Copy size={16} /> {copied ? "Copied!" : "Copy message"}
          </button>
          <a className="btn btn-primary" href={waLink} target="_blank" rel="noreferrer">
            <MessageCircle size={16} /> Send on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
