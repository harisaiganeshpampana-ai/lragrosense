import React, { useEffect, useState } from "react";
import { Copy, Link2, Loader2, MessageCircle, Pencil, Plus, Power, Trash2, X } from "lucide-react";

function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function inviteText(user, url) {
  return [
    `Hi ${user.name.split(" ")[0]}, you're added to the LR AgroSense team portal 🌱`,
    "",
    "Open this link and set your own password (valid 7 days):",
    url,
    "",
    `After that, log in any time at lragrosense.in/team.html with ${user.email}.`,
  ].join("\n");
}

// Admin: add core team Gmails. Each person gets a one-time link to set their own password.
export default function TeamMembers({ token, api, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [busyId, setBusyId] = useState("");
  const [invite, setInvite] = useState(null); // { user, inviteUrl, emailed }

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  useEffect(() => {
    api("/api/admin/team-members", { token })
      .then(setItems)
      .catch(handleError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = async (u, body, confirmText) => {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusyId(u._id);
    setError("");
    try {
      const data = await api(`/api/admin/team-members/${u._id}`, { token, method: "PUT", body });
      setItems((list) => list.map((x) => (x._id === u._id ? data.user : x)));
      if (data.inviteUrl) setInvite(data);
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (u) => {
    if (!window.confirm(`Remove ${u.name} from the team portal? Their old messages stay.`)) return;
    setBusyId(u._id);
    try {
      await api(`/api/admin/team-members/${u._id}`, { token, method: "DELETE" });
      setItems((list) => list.filter((x) => x._id !== u._id));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const joined = items.filter((u) => u.status === "joined").length;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Team members</h1>
          <p>
            {items.length} added · {joined} joined · {items.length - joined} waiting
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setAdding(true)}>
          <Plus size={18} /> Add Gmail
        </button>
      </div>
      <p className="pt-intro">
        Add a team member's Gmail. They get a one-time link to set <b>their own password</b>, then they can use the team portal
        at lragrosense.in/team.html. <b>Title</b> is what the team sees (e.g. Head of Operations). <b>Access</b> decides if they
        can also open the manager portal (interns and field reports). Use ✏️ to change these any time.
      </p>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="empty">
          <Loader2 className="spin" /> Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="empty">No team members yet. Click "Add Gmail".</div>
      ) : (
        <div className="list">
          {items.map((u) => (
            <article key={u._id} className={`app-card ${u.active ? "" : "row-closed"}`}>
              <div className="app-top">
                <div className="app-summary pt-person">
                  <span className="app-avatar">{(u.name || "?").charAt(0).toUpperCase()}</span>
                  <span className="app-who">
                    <strong>
                      {u.name}
                      {u.title ? <span className="tmb-title"> · {u.title}</span> : null}{" "}
                      {!u.active && <em className="pt-off">(turned off)</em>}
                    </strong>
                    <span>
                      {u.email}
                      {u.phone ? ` · ${u.phone}` : ""}
                    </span>
                    <span className="pt-meta">
                      <b className={`tmb-status ${u.status}`}>{u.status === "joined" ? "Joined" : "Invite sent"}</b> ·{" "}
                      {u.status === "joined" ? `last login ${formatDate(u.lastLoginAt)}` : `link valid till ${formatDate(u.inviteExpiresAt)}`}
                    </span>
                  </span>
                </div>
                <div className="app-controls">
                  <span className={`tmb-access ${u.role}`}>{u.role === "manager" ? "Manager access" : "Team access"}</span>
                  <button className="icon-btn" title="Edit name, title, access" disabled={busyId === u._id} onClick={() => setEditing(u)}>
                    <Pencil size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    title={u.status === "joined" ? "Send a new link (they set a new password)" : "Get a new invite link"}
                    disabled={busyId === u._id}
                    onClick={() =>
                      update(
                        u,
                        { newInvite: true },
                        u.status === "joined"
                          ? `Make a new link for ${u.name}? Their current password will stop working until they set a new one.`
                          : ""
                      )
                    }
                  >
                    <Link2 size={16} />
                  </button>
                  <button
                    className="icon-btn"
                    title={u.active ? "Turn off" : "Turn on"}
                    disabled={busyId === u._id}
                    onClick={() => update(u, { active: !u.active })}
                  >
                    <Power size={16} />
                  </button>
                  <button className="icon-btn icon-danger" title="Remove" disabled={busyId === u._id} onClick={() => remove(u)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {adding && (
        <AddMember
          token={token}
          api={api}
          onAuthError={onAuthError}
          onClose={() => setAdding(false)}
          onCreated={(data) => {
            setItems((list) => [data.user, ...list]);
            setAdding(false);
            setInvite(data);
          }}
        />
      )}
      {editing && (
        <AddMember
          existing={editing}
          token={token}
          api={api}
          onAuthError={onAuthError}
          onClose={() => setEditing(null)}
          onCreated={(data) => {
            setItems((list) => list.map((x) => (x._id === data.user._id ? data.user : x)));
            setEditing(null);
          }}
        />
      )}
      {invite && <InviteReady data={invite} onClose={() => setInvite(null)} />}
    </>
  );
}

function AddMember({ existing, token, api, onClose, onCreated, onAuthError }) {
  const [form, setForm] = useState({
    name: existing?.name || "",
    email: existing?.email || "",
    phone: existing?.phone || "",
    title: existing?.title || "",
    role: existing?.role || "member",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (existing) {
        const { email, ...changes } = form;
        onCreated(await api(`/api/admin/team-members/${existing._id}`, { token, method: "PUT", body: changes }));
      } else {
        onCreated(await api("/api/admin/team-members", { token, method: "POST", body: form }));
      }
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
          <h2>{existing ? `Edit ${existing.name}` : "Add team member"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <label className="field">
            Gmail *
            <input
              required
              type="email"
              value={form.email}
              onChange={set("email")}
              maxLength={200}
              placeholder="name@gmail.com"
              disabled={Boolean(existing)}
            />
          </label>
          <label className="field">
            Name
            <input value={form.name} onChange={set("name")} maxLength={100} placeholder="They can change it when they join" />
          </label>
          <label className="field">
            Title (shown next to their name)
            <input value={form.title} onChange={set("title")} maxLength={80} placeholder="e.g. Head of Operations" list="lr-titles" />
            <datalist id="lr-titles">
              <option value="Head of Operations" />
              <option value="Head of Agronomy" />
              <option value="Head of Research & Protected Cultivation" />
              <option value="Co-founder" />
              <option value="Advisor" />
            </datalist>
          </label>
          <div className="grid-2">
            <label className="field">
              Phone (for WhatsApp)
              <input value={form.phone} onChange={set("phone")} maxLength={20} />
            </label>
            <label className="field">
              Access
              <select value={form.role} onChange={set("role")}>
                <option value="member">Team portal only</option>
                <option value="manager">Team + Manager portal (interns)</option>
              </select>
            </label>
          </div>
          {error && <div className="error-box">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : existing ? null : <Plus size={16} />}{" "}
            {existing ? "Save changes" : "Add and get invite link"}
          </button>
        </div>
      </form>
    </div>
  );
}

function InviteReady({ data, onClose }) {
  const [copied, setCopied] = useState(false);
  const { user, inviteUrl, emailed } = data;
  const text = inviteText(user, inviteUrl);
  const phone = (user.phone || "").replace(/\D/g, "");
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
          <h2>Invite ready for {user.name}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <p className="pt-intro">
            {emailed
              ? `✅ We emailed this link to ${user.email}. You can also send it on WhatsApp.`
              : "Send this link to them on WhatsApp. (Email isn't set up yet, so it wasn't emailed.)"}
          </p>
          <pre className="pt-msg">{text}</pre>
          <p className="pt-warn">The link works once and expires in 7 days. If it's lost, use the 🔗 button for a new one.</p>
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
