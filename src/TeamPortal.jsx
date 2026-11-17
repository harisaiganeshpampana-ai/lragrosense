import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Hash,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Menu,
  Paperclip,
  Phone,
  Search,
  SendHorizontal,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { fileSizeLabel, portalApi, portalFileUrl, readFileBase64, readSession, saveSession } from "./portalApi";

const SESSION_KEY = "lr_team_session";
const SEEN_KEY = "lr_ws_seen";
const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;
const POLL_MS = 6000;

/* ---------------- small helpers ---------------- */

const AVATAR_COLORS = ["#4c6ef5", "#0ca678", "#f76707", "#ae3ec9", "#e64980", "#1098ad", "#7048e8", "#d6336c"];
function avatarColor(id = "") {
  let h = 0;
  for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
function initials(name) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
function Avatar({ id, name, size = 36 }) {
  return (
    <span className="ws-avatar" style={{ background: avatarColor(id), width: size, height: size, fontSize: size * 0.38 }}>
      {initials(name)}
    </span>
  );
}
function clock(value) {
  return new Date(value).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
}
function dayLabel(value) {
  const d = new Date(value);
  const today = new Date();
  const yesterday = new Date(Date.now() - 86400000);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}
function shortWhen(value) {
  const d = new Date(value);
  return d.toDateString() === new Date().toDateString() ? clock(value) : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
function readSeen() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeSeen(key) {
  try {
    const seen = readSeen();
    seen[key] = new Date().toISOString();
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    /* ignore */
  }
}
function readInvite() {
  try {
    return new URLSearchParams(window.location.search).get("invite") || "";
  } catch {
    return "";
  }
}
function clearInviteFromUrl() {
  try {
    window.history.replaceState(null, "", window.location.pathname);
  } catch {
    /* ignore */
  }
}

/* ---------------- app ---------------- */

export default function TeamPortal() {
  const [session, setSession] = useState(() => readSession(SESSION_KEY));
  const [invite, setInvite] = useState(readInvite);

  const login = (s) => {
    saveSession(SESSION_KEY, s);
    setSession(s);
  };
  const logout = () => {
    saveSession(SESSION_KEY, null);
    setSession(null);
  };

  useEffect(() => {
    if (!session || invite) return;
    portalApi("/api/portal/me", { token: session.token })
      .then((user) => login({ ...session, user }))
      .catch((err) => err.status === 401 && logout());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (invite) {
    return (
      <InvitePage
        token={invite}
        onDone={(s) => {
          clearInviteFromUrl();
          setInvite("");
          login(s);
        }}
        onCancel={() => {
          clearInviteFromUrl();
          setInvite("");
        }}
      />
    );
  }
  if (!session) return <LoginPage onLogin={login} />;
  return <Workspace session={session} onLogout={logout} />;
}

/* ---------------- sign in / invite ---------------- */

function AuthShell({ children }) {
  return (
    <div className="ws-auth">
      <div className="ws-auth-card">
        <div className="ws-auth-brand">
          <span className="ws-logo">LR</span>
          <div>
            <strong>LR AgroSense</strong>
            <span>Team workspace</span>
          </div>
        </div>
        {children}
      </div>
      <p className="ws-auth-foot">Private workspace · only invited team members can sign in</p>
    </div>
  );
}

function PasswordInput({ value, onChange, autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="ws-pass">
      <input type={show ? "text" : "password"} required autoComplete={autoComplete} value={value} onChange={onChange} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = await portalApi("/api/portal/login", { method: "POST", body: { email: email.trim(), password, portal: "team" } });
      if (data.user.role !== "member") throw new Error("This sign-in is for the core team. Interns use lragrosense.in/intern.html.");
      onLogin({ token: data.token, user: data.user });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      <h1>Sign in</h1>
      <p className="ws-auth-sub">Welcome back. Use the Gmail you were invited with.</p>
      <form onSubmit={submit} className="ws-form">
        <label>
          Email
          <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@gmail.com" />
        </label>
        <label>
          Password
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        {error && <div className="ws-error">{error}</div>}
        <button className="ws-btn ws-btn-primary ws-btn-block" disabled={busy}>
          {busy ? <Loader2 size={17} className="ws-spin" /> : <ArrowRight size={17} />} Sign in
        </button>
      </form>
      <p className="ws-auth-help">Forgot your password? Ask Hari for a new invite link.</p>
    </AuthShell>
  );
}

function InvitePage({ token, onDone, onCancel }) {
  const [info, setInfo] = useState(null);
  const [bad, setBad] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    portalApi(`/api/portal/invite/${encodeURIComponent(token)}`)
      .then((d) => {
        if (d.role && d.role !== "member") {
          setBad("This invite is for the manager portal. Please open the link at lragrosense.in/manager.html.");
          return;
        }
        setInfo(d);
        setName(d.name || "");
      })
      .catch((err) => setBad(err.message));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      const data = await portalApi(`/api/portal/invite/${encodeURIComponent(token)}`, {
        method: "POST",
        body: { password, name: name.trim() },
      });
      if (data.user.role !== "member") throw new Error("This invite is for the manager portal. Please open it at lragrosense.in/manager.html.");
      onDone({ token: data.token, user: data.user });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell>
      {bad ? (
        <>
          <h1>Link not valid</h1>
          <div className="ws-error">{bad}</div>
          <button className="ws-btn ws-btn-ghost ws-btn-block" onClick={onCancel}>
            Go to sign in
          </button>
        </>
      ) : !info ? (
        <div className="ws-center">
          <Loader2 className="ws-spin" /> Checking your invite…
        </div>
      ) : (
        <>
          <h1>Join your team</h1>
          <p className="ws-auth-sub">
            You're invited as <b>{info.email}</b>. Choose your own password to finish.
          </p>
          <form onSubmit={submit} className="ws-form">
            <label>
              Your name
              <input required maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
              New password <small>(at least 8 characters)</small>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
            </label>
            <label>
              Confirm password
              <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            </label>
            {error && <div className="ws-error">{error}</div>}
            <button className="ws-btn ws-btn-primary ws-btn-block" disabled={busy}>
              {busy ? <Loader2 size={17} className="ws-spin" /> : <ArrowRight size={17} />} Join workspace
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}

/* ---------------- workspace shell ---------------- */

function Workspace({ session, onLogout }) {
  const { token, user } = session;
  const [me, setMe] = useState(null);
  const [people, setPeople] = useState([]);
  const [summary, setSummary] = useState({ dms: {}, team: null });
  const [view, setView] = useState({ type: "team" }); // team | dm | files
  const [menuOpen, setMenuOpen] = useState(false);
  const [error, setError] = useState("");
  const [, bump] = useState(0);
  const [notifPerm, setNotifPerm] = useState(() => (typeof Notification === "undefined" ? "unsupported" : Notification.permission));
  const prevSummaryRef = useRef(null);
  const viewKeyRef = useRef("team");
  const peopleRef = useRef([]);
  const meRef = useRef(null);

  const handleError = (err) => {
    if (err.status === 401) onLogout();
    else setError(err.message);
  };

  // Pop-up notification for new messages while the portal is open (even in a background tab)
  const notifyNew = (prev, next) => {
    if (!prev || typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const items = [["team", next.team, prev.team, "New message in #general", null]];
    for (const [id, info] of Object.entries(next.dms || {})) {
      const person = peopleRef.current.find((x) => x.id === id);
      items.push([id, info, prev.dms?.[id], `New message from ${person?.name || "a teammate"}`, person]);
    }
    for (const [key, info, before, title, person] of items) {
      if (!info || info.fromMe) continue;
      if (before && new Date(info.last) <= new Date(before.last)) continue;
      if (!document.hidden && key === viewKeyRef.current) continue;
      try {
        const n = new Notification(title, {
          body: "Open the LR AgroSense team portal to read it.",
          tag: `lr-${key}`,
          icon: "/favicon.png",
        });
        n.onclick = () => {
          window.focus();
          setView(person ? { type: "dm", person } : { type: "team" });
          n.close();
        };
      } catch {
        /* some phones only allow notifications from installed apps */
      }
    }
  };

  const loadSummary = () =>
    portalApi("/api/workspace/dm-summary", { token })
      .then((next) => {
        notifyNew(prevSummaryRef.current, next);
        prevSummaryRef.current = next;
        setSummary(next);
      })
      .catch((err) => err.status === 401 && onLogout());

  const enableNotifications = async () => {
    try {
      const result = await Notification.requestPermission();
      setNotifPerm(result);
      if (result === "granted") {
        new Notification("Notifications are on 🌱", { body: "You'll get a pop-up for new team messages.", icon: "/favicon.png" });
      }
    } catch {
      setNotifPerm("unsupported");
    }
  };

  useEffect(() => {
    portalApi("/api/workspace/people", { token })
      .then((p) => {
        setMe(p.me);
        setPeople(p.people);
        meRef.current = p.me;
        peopleRef.current = p.people;
      })
      .catch(handleError);
    loadSummary();
    // Keep checking in the background too, so notifications arrive while you're on another tab
    const id = setInterval(loadSummary, 12000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const viewKey = view.type === "dm" ? view.person.id : view.type;
  viewKeyRef.current = viewKey;
  useEffect(() => {
    if (view.type !== "files") writeSeen(viewKey);
    bump((n) => n + 1);
  }, [viewKey, summary]); // eslint-disable-line react-hooks/exhaustive-deps

  const seen = readSeen();
  const unread = (key, info) => {
    if (!info || info.fromMe || key === viewKey) return false;
    return !seen[key] || new Date(info.last) > new Date(seen[key]);
  };

  // Unread count on the browser tab, e.g. "(2) LR AgroSense Team"
  const unreadCount =
    (unread("team", summary.team) ? 1 : 0) + Object.entries(summary.dms || {}).filter(([id, info]) => unread(id, info)).length;
  useEffect(() => {
    document.title = unreadCount ? `(${unreadCount}) LR AgroSense Team` : "LR AgroSense Team";
  }, [unreadCount]);

  const others = useMemo(() => {
    const list = people.filter((p) => !me || p.id !== me.id);
    return list.sort((a, b) => {
      const la = summary.dms?.[a.id]?.last ? new Date(summary.dms[a.id].last).getTime() : 0;
      const lb = summary.dms?.[b.id]?.last ? new Date(summary.dms[b.id].last).getTime() : 0;
      return lb - la || a.name.localeCompare(b.name);
    });
  }, [people, me, summary]);

  const go = (v) => {
    setView(v);
    setMenuOpen(false);
  };

  const myTitle = me?.title || user.title || "";

  return (
    <div className={`ws ${menuOpen ? "ws-menu-open" : ""}`}>
      <aside className="ws-side">
        <div className="ws-brand">
          <span className="ws-logo">LR</span>
          <div>
            <strong>LR AgroSense</strong>
            <span>Team workspace</span>
          </div>
          <button className="ws-icon ws-close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="ws-nav">
          <div className="ws-nav-label">Channels</div>
          <button className={`ws-nav-item ${view.type === "team" ? "on" : ""}`} onClick={() => go({ type: "team" })}>
            <Hash size={16} />
            <span>general</span>
            {unread("team", summary.team) && <i className="ws-dot" />}
          </button>

          <div className="ws-nav-label">Direct messages</div>
          {others.length === 0 && <p className="ws-nav-empty">Teammates appear here after they join.</p>}
          {others.map((p) => {
            const isNew = unread(p.id, summary.dms?.[p.id]);
            return (
              <button
                key={p.id}
                className={`ws-nav-item ws-nav-person ${view.type === "dm" && view.person.id === p.id ? "on" : ""} ${isNew ? "bold" : ""}`}
                onClick={() => go({ type: "dm", person: p })}
              >
                <Avatar id={p.id} name={p.name} size={22} />
                <span>{p.name}</span>
                {isNew && <i className="ws-dot" />}
              </button>
            );
          })}

          <div className="ws-nav-label">Workspace</div>
          <button className={`ws-nav-item ${view.type === "files" ? "on" : ""}`} onClick={() => go({ type: "files" })}>
            <FolderOpen size={16} />
            <span>Files</span>
          </button>
          {notifPerm === "default" && (
            <button className="ws-nav-item ws-notif-btn" onClick={enableNotifications}>
              <Bell size={16} />
              <span>Turn on notifications</span>
            </button>
          )}
          {notifPerm === "denied" && (
            <p className="ws-nav-empty">🔕 Notifications are blocked. Allow them in your browser's site settings for lragrosense.in.</p>
          )}
        </nav>

        <div className="ws-me">
          <Avatar id={me?.id || user._id} name={user.name} size={34} />
          <div className="ws-me-text">
            <strong>{user.name}</strong>
            <span>{myTitle || "Team member"}</span>
          </div>
          <button className="ws-icon" onClick={onLogout} title="Sign out" aria-label="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <div className="ws-scrim" onClick={() => setMenuOpen(false)} />

      <main className="ws-main">
        {error && (
          <div className="ws-error ws-error-bar">
            {error}
            <button className="ws-icon" onClick={() => setError("")} aria-label="Dismiss">
              <X size={15} />
            </button>
          </div>
        )}
        {view.type === "files" ? (
          <FilesView token={token} me={me} people={people} onMenu={() => setMenuOpen(true)} onAuthError={onLogout} />
        ) : me ? (
          <Conversation
            key={viewKey}
            token={token}
            me={me}
            people={people}
            person={view.type === "dm" ? view.person : null}
            onMenu={() => setMenuOpen(true)}
            onAuthError={onLogout}
            onActivity={loadSummary}
          />
        ) : (
          <div className="ws-center ws-grow">
            <Loader2 className="ws-spin" /> Loading workspace…
          </div>
        )}
      </main>
    </div>
  );
}

/* ---------------- a conversation (#general or a direct chat) ---------------- */

function MessageText({ text }) {
  const parts = String(text).split(/(https?:\/\/[^\s]+|@\w+)/g);
  return parts.map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer">
        {part}
      </a>
    ) : /^@\w+/.test(part) ? (
      <span key={i} className="ws-mention">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

function Attachment({ file, token, onAuthError }) {
  const isImage = file.type?.startsWith("image/");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isImage) return;
    portalFileUrl(file.id, token)
      .then(setUrl)
      .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file.id]);

  const open = async () => {
    try {
      window.open(url || (await portalFileUrl(file.id, token)), "_blank", "noopener");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    }
  };

  return (
    <div className="ws-attach">
      {isImage &&
        (url ? (
          <button type="button" className="ws-attach-img" onClick={open} title="Open full size">
            <img src={url} alt={file.name} />
          </button>
        ) : !error ? (
          <div className="ws-attach-img ws-attach-wait">
            <Loader2 size={18} className="ws-spin" />
          </div>
        ) : null)}
      {!isImage && (
        <button type="button" className="ws-attach-card" onClick={open}>
          <span className="ws-attach-icon">PDF</span>
          <span className="ws-attach-name">
            <strong>{file.name}</strong>
            <small>{fileSizeLabel(file.size)} · Click to open</small>
          </span>
        </button>
      )}
      {error && <small className="ws-attach-err">{error}</small>}
    </div>
  );
}

function Conversation({ token, me, people, person, onMenu, onAuthError, onActivity }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [callOpen, setCallOpen] = useState(false);
  const listRef = useRef(null);
  const lastRef = useRef(null);
  const stickRef = useRef(true);
  const fileRef = useRef(null);
  const inputRef = useRef(null);
  const query = person ? `with=${encodeURIComponent(person.id)}` : "";
  const byId = useMemo(() => Object.fromEntries(people.map((p) => [p.id, p])), [people]);

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const addMessages = (items) => {
    if (!items.length) return;
    setMessages((list) => {
      const seenIds = new Set(list.map((m) => m._id));
      const merged = [...list, ...items.filter((m) => !seenIds.has(m._id))];
      lastRef.current = merged[merged.length - 1]?.createdAt || lastRef.current;
      return merged;
    });
  };

  useEffect(() => {
    portalApi(`/api/workspace/messages${query ? `?${query}` : ""}`, { token })
      .then((items) => {
        setMessages(items);
        lastRef.current = items[items.length - 1]?.createdAt || null;
      })
      .catch(handleError)
      .finally(() => setLoading(false));
    const id = setInterval(() => {
      if (document.hidden) return;
      const params = [query, lastRef.current ? `after=${encodeURIComponent(lastRef.current)}` : ""].filter(Boolean).join("&");
      portalApi(`/api/workspace/messages${params ? `?${params}` : ""}`, { token })
        .then(addMessages)
        .catch((err) => err.status === 401 && onAuthError());
    }, POLL_MS);
    inputRef.current?.focus();
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = listRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  const onScroll = () => {
    const el = listRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!ACCEPT.split(",").includes(f.type)) return setError("Only PDF, JPG, PNG or WEBP files can be shared.");
    if (f.size > MAX_BYTES) return setError("File is over 5 MB. Please share a Google Drive link for large files.");
    setError("");
    setFile(f);
    inputRef.current?.focus();
  };

  const send = async (e) => {
    e?.preventDefault();
    const value = text.trim();
    if ((!value && !file) || sending) return;
    setSending(true);
    setError("");
    try {
      const body = { text: value, ...(person ? { with: person.id } : {}) };
      if (file) body.file = { name: file.name, type: file.type, data: await readFileBase64(file) };
      const message = await portalApi("/api/workspace/messages", { token, method: "POST", body });
      setText("");
      setFile(null);
      stickRef.current = true;
      addMessages([message]);
      onActivity();
    } catch (err) {
      handleError(err);
    } finally {
      setSending(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(m.kind === "file" ? "Delete this message and its file?" : "Delete this message?")) return;
    try {
      await portalApi(`/api/workspace/messages/${m._id}`, { token, method: "DELETE" });
      setMessages((list) => list.filter((x) => x._id !== m._id));
    } catch (err) {
      handleError(err);
    }
  };

  // @mention suggestions while typing in #general
  const mentionMatch = !person && /(^|\s)@(\w*)$/.exec(text);
  const suggestions = mentionMatch
    ? [
        ...people.filter((p) => p.id !== me.id && p.name.toLowerCase().startsWith(mentionMatch[2].toLowerCase())),
        ...("all".startsWith(mentionMatch[2].toLowerCase()) ? [{ id: "@all", name: "all", title: "Notify everyone" }] : []),
      ].slice(0, 6)
    : [];
  const insertMention = (p) => {
    const first = p.name.split(/[\s(]/)[0];
    setText((t) => t.replace(/@(\w*)$/, `@${first} `));
    inputRef.current?.focus();
  };

  const liveCall = [...messages].reverse().find((m) => m.kind === "call" && Date.now() - new Date(m.createdAt).getTime() < 3 * 3600 * 1000);

  // Build rows: day dividers + messages, grouping consecutive messages from one person
  const rows = [];
  let prev = null;
  for (const m of messages) {
    const day = new Date(m.createdAt).toDateString();
    if (!prev || new Date(prev.createdAt).toDateString() !== day) rows.push({ divider: dayLabel(m.createdAt), key: `d-${day}` });
    const grouped =
      prev &&
      prev.authorId === m.authorId &&
      prev.kind !== "call" &&
      m.kind !== "call" &&
      new Date(prev.createdAt).toDateString() === day &&
      new Date(m.createdAt) - new Date(prev.createdAt) < 5 * 60 * 1000;
    rows.push({ m, grouped, key: m._id });
    prev = m;
  }

  const title = person ? person.name : "general";
  const subtitle = person ? person.title || (person.role === "manager" ? "Manager" : "Team member") : `${people.length} members · use @name to notify someone`;

  return (
    <div className="ws-convo">
      <header className="ws-head">
        <button className="ws-icon ws-menu-btn" onClick={onMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        {person ? (
          <Avatar id={person.id} name={person.name} size={32} />
        ) : (
          <span className="ws-head-hash">
            <Hash size={18} />
          </span>
        )}
        <div className="ws-head-text">
          <strong>{title}</strong>
          <span>{subtitle}</span>
        </div>
        <button className="ws-btn ws-btn-ghost" onClick={() => setCallOpen(true)}>
          <Video size={17} /> <span className="ws-hide-sm">{person ? "Call" : "Start call"}</span>
        </button>
      </header>

      {liveCall && (
        <div className="ws-live">
          <span className="ws-live-pulse" />
          <span>
            <b>{byId[liveCall.authorId]?.name || liveCall.authorName}</b> started a call · {liveCall.text}
          </span>
          <a className="ws-btn ws-btn-success" href={liveCall.meetUrl} target="_blank" rel="noreferrer">
            <Phone size={15} /> Join
          </a>
        </div>
      )}

      <div className="ws-msgs" ref={listRef} onScroll={onScroll}>
        {loading ? (
          <div className="ws-center ws-grow">
            <Loader2 className="ws-spin" />
          </div>
        ) : (
          <>
            <div className="ws-intro">
              {person ? (
                <Avatar id={person.id} name={person.name} size={56} />
              ) : (
                <span className="ws-intro-hash">
                  <Hash size={28} />
                </span>
              )}
              <h2>{person ? person.name : "Welcome to #general"}</h2>
              <p>
                {person
                  ? `This is the start of your private conversation with ${person.name}${person.title ? `, ${person.title}` : ""}. Only you two can see it.`
                  : "The whole LR AgroSense team is here. Share updates, files and start calls."}
              </p>
            </div>
            {rows.map((r) =>
              r.divider ? (
                <div key={r.key} className="ws-divider">
                  <span>{r.divider}</span>
                </div>
              ) : (
                <MessageRow
                  key={r.key}
                  m={r.m}
                  grouped={r.grouped}
                  author={byId[r.m.authorId]}
                  mine={r.m.authorId === me.id}
                  canDelete={r.m.authorId === me.id || me.id === "admin"}
                  token={token}
                  onAuthError={onAuthError}
                  onDelete={() => remove(r.m)}
                />
              )
            )}
          </>
        )}
      </div>

      <div className="ws-composer-wrap">
        {error && <div className="ws-error ws-error-inline">{error}</div>}
        {suggestions.length > 0 && (
          <div className="ws-suggest">
            {suggestions.map((p) => (
              <button key={p.id} type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => insertMention(p)}>
                {p.id === "@all" ? <span className="ws-suggest-all">@</span> : <Avatar id={p.id} name={p.name} size={22} />}
                <strong>{p.name}</strong>
                {p.title && <small>{p.title}</small>}
              </button>
            ))}
          </div>
        )}
        <form className="ws-composer" onSubmit={send}>
          {file && (
            <div className="ws-picked">
              {file.type === "application/pdf" ? <FileText size={16} /> : <ImageIcon size={16} />}
              <span>{file.name}</span>
              <small>{fileSizeLabel(file.size)}</small>
              <button type="button" className="ws-icon" onClick={() => setFile(null)} aria-label="Remove file">
                <X size={15} />
              </button>
            </div>
          )}
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            maxLength={2000}
            placeholder={person ? `Message ${person.name}` : "Message #general"}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (suggestions.length && mentionMatch) insertMention(suggestions[0]);
                else send();
              }
            }}
          />
          <div className="ws-composer-bar">
            <input ref={fileRef} type="file" accept={ACCEPT} hidden onChange={pickFile} />
            <button type="button" className="ws-icon" onClick={() => fileRef.current?.click()} title="Attach a PDF or image (max 5 MB)">
              <Paperclip size={18} />
            </button>
            <span className="ws-composer-hint ws-hide-sm">Enter to send · Shift+Enter for new line</span>
            <button className="ws-send" disabled={sending || (!text.trim() && !file)} aria-label="Send">
              {sending ? <Loader2 size={17} className="ws-spin" /> : <SendHorizontal size={17} />}
            </button>
          </div>
        </form>
      </div>

      {callOpen && (
        <CallModal
          token={token}
          person={person}
          onClose={() => setCallOpen(false)}
          onAuthError={onAuthError}
          onStarted={(m) => {
            setCallOpen(false);
            stickRef.current = true;
            addMessages([m]);
            onActivity();
          }}
        />
      )}
    </div>
  );
}

function MessageRow({ m, grouped, author, mine, canDelete, token, onAuthError, onDelete }) {
  const name = author?.name || m.authorName;
  const title = author?.title || "";
  return (
    <div className={`ws-msg ${grouped ? "grouped" : ""} ${m.kind === "call" ? "is-call" : ""}`}>
      <div className="ws-msg-gutter">
        {grouped ? <span className="ws-msg-time-hover">{clock(m.createdAt)}</span> : <Avatar id={m.authorId} name={name} size={36} />}
      </div>
      <div className="ws-msg-body">
        {!grouped && (
          <div className="ws-msg-head">
            <strong>{name}</strong>
            {title && <span className="ws-title-chip">{title}</span>}
            {mine && <span className="ws-you">you</span>}
            <time>{clock(m.createdAt)}</time>
          </div>
        )}
        {m.kind === "call" ? (
          <div className="ws-callcard">
            <span className="ws-callcard-icon">
              <Video size={18} />
            </span>
            <div>
              <strong>Call started{m.text ? ` · ${m.text}` : ""}</strong>
              <small>Google Meet</small>
            </div>
            <a className="ws-btn ws-btn-success" href={m.meetUrl} target="_blank" rel="noreferrer">
              Join call
            </a>
          </div>
        ) : (
          <>
            {m.kind === "file" && m.file?.id && <Attachment file={m.file} token={token} onAuthError={onAuthError} />}
            {m.text && (
              <p className="ws-msg-text">
                <MessageText text={m.text} />
              </p>
            )}
          </>
        )}
      </div>
      {canDelete && (
        <button className="ws-msg-del" onClick={onDelete} title="Delete message" aria-label="Delete message">
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

function CallModal({ token, person, onClose, onStarted, onAuthError }) {
  const [meetUrl, setMeetUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = { meetUrl: meetUrl.trim(), topic, ...(person ? { with: person.id } : {}) };
      onStarted(await portalApi("/api/workspace/calls", { token, method: "POST", body }));
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ws-modal-back" onClick={onClose}>
      <form className="ws-modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="ws-modal-head">
          <h3>{person ? `Call ${person.name}` : "Start a team call"}</h3>
          <button type="button" className="ws-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <ol className="ws-steps">
          <li>
            Open{" "}
            <a href="https://meet.google.com/new" target="_blank" rel="noreferrer">
              meet.google.com/new
            </a>
          </li>
          <li>Copy the meeting link and paste it here</li>
          <li>{person ? `${person.name} gets` : "Everyone gets"} an email and a Join button in the chat</li>
        </ol>
        <div className="ws-form">
          <label>
            Google Meet link
            <input required value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} placeholder="https://meet.google.com/abc-defg-hij" />
          </label>
          <label>
            Topic <small>(optional)</small>
            <input value={topic} maxLength={200} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Weekly sync" />
          </label>
          {error && <div className="ws-error">{error}</div>}
        </div>
        <div className="ws-modal-foot">
          <button type="button" className="ws-btn ws-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="ws-btn ws-btn-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="ws-spin" /> : <Phone size={16} />} Share call
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- files ---------------- */

function FilesView({ token, me, people, onMenu, onAuthError }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");

  useEffect(() => {
    portalApi("/api/workspace/files", { token })
      .then(setFiles)
      .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const where = (f) => {
    if (f.channel === "team") return "#general";
    const other = f.channel.slice(3).split(":").find((id) => id !== me?.id);
    return people.find((p) => p.id === other)?.name || "Direct message";
  };

  const open = async (f) => {
    try {
      window.open(await portalFileUrl(String(f._id), token), "_blank", "noopener");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    }
  };

  const shown = files.filter((f) => {
    if (kind === "pdf" && f.contentType !== "application/pdf") return false;
    if (kind === "image" && !f.contentType.startsWith("image/")) return false;
    return !q || f.name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div className="ws-convo">
      <header className="ws-head">
        <button className="ws-icon ws-menu-btn" onClick={onMenu} aria-label="Open menu">
          <Menu size={20} />
        </button>
        <span className="ws-head-hash">
          <FolderOpen size={18} />
        </span>
        <div className="ws-head-text">
          <strong>Files</strong>
          <span>Everything shared in #general and your direct messages</span>
        </div>
      </header>
      <div className="ws-files">
        <div className="ws-files-tools">
          <label className="ws-search">
            <Search size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files" />
          </label>
          <div className="ws-seg">
            {[
              ["all", "All"],
              ["pdf", "PDFs"],
              ["image", "Images"],
            ].map(([k, label]) => (
              <button key={k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        {error && <div className="ws-error">{error}</div>}
        {loading ? (
          <div className="ws-center">
            <Loader2 className="ws-spin" />
          </div>
        ) : shown.length === 0 ? (
          <div className="ws-empty">
            <FolderOpen size={32} />
            <p>{files.length ? "No files match your search." : "No files yet. Use the 📎 button in any chat to share a PDF or image."}</p>
          </div>
        ) : (
          <div className="ws-file-list">
            {shown.map((f) => (
              <button key={f._id} className="ws-file" onClick={() => open(f)}>
                <span className={`ws-file-icon ${f.contentType === "application/pdf" ? "pdf" : "img"}`}>
                  {f.contentType === "application/pdf" ? "PDF" : <ImageIcon size={18} />}
                </span>
                <span className="ws-file-name">
                  <strong>{f.name}</strong>
                  <small>
                    {f.uploadedByName} · {where(f)}
                  </small>
                </span>
                <span className="ws-file-meta">
                  <span>{fileSizeLabel(f.size)}</span>
                  <span>{shortWhen(f.createdAt)}</span>
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
