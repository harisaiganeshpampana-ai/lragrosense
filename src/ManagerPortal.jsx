import React, { useEffect, useState } from "react";
import { CalendarCheck, ClipboardList, Eye, EyeOff, Loader2, LogOut, MessageSquare, Sprout, Users } from "lucide-react";
import PortalLogin from "./PortalLogin";
import TeamPeople from "./TeamPeople";
import FieldReports from "./AdminFieldReports";
import TeamDailyUpdates from "./TeamDailyUpdates";
import { portalApi, readSession, saveSession } from "./portalApi";

const SESSION_KEY = "lr_manager_session";

// Manager portal (only managers, e.g. Sandeep): interns, their field reports and daily updates
export default function ManagerPortal() {
  const [session, setSession] = useState(() => readSession(SESSION_KEY));
  const [tab, setTab] = useState("reports");
  const [invite, setInvite] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get("invite") || "";
    } catch {
      return "";
    }
  });
  const closeInvite = () => {
    try {
      window.history.replaceState(null, "", window.location.pathname);
    } catch {
      /* ignore */
    }
    setInvite("");
  };

  const logout = () => {
    saveSession(SESSION_KEY, null);
    setSession(null);
  };

  useEffect(() => {
    if (!session || invite) return;
    portalApi("/api/portal/me", { token: session.token })
      .then((user) => {
        if (user.role !== "manager") return logout();
        const next = { ...session, user };
        saveSession(SESSION_KEY, next);
        setSession(next);
      })
      .catch((err) => {
        if (err.status === 401) logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (invite) {
    return (
      <div className="fr-page">
        <ManagerInvite
          token={invite}
          onCancel={closeInvite}
          onDone={(s) => {
            closeInvite();
            saveSession(SESSION_KEY, s);
            setSession(s);
          }}
        />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fr-page">
        <PortalLogin
          title="Manager portal"
          subtitle="Only for managers: interns, farmer visit reports and daily updates."
          allowedRoles={["manager"]}
          portal="manager"
          wrongRoleMessage="This portal is only for managers. For team chat, use lragrosense.in/team.html."
          onLogin={(s) => {
            saveSession(SESSION_KEY, s);
            setSession(s);
          }}
        />
      </div>
    );
  }

  const { token, user } = session;
  const props = { token, api: portalApi, onAuthError: logout };
  const tabs = [
    ["reports", "Field reports", ClipboardList],
    ["updates", "Daily updates", CalendarCheck],
    ["interns", "Interns", Users],
  ];

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
              <span>Manager portal · {user.name}</span>
            </div>
          </div>
          <div className="topbar-actions">
            <a className="btn btn-light" href="/team.html">
              <MessageSquare size={16} /> <span className="hide-sm">Team chat</span>
            </a>
            <button className="btn btn-light" onClick={logout}>
              <LogOut size={16} /> <span className="hide-sm">Log out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="dash-main">
        <div className="tabs">
          {tabs.map(([key, label, Icon]) => (
            <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
        {tab === "interns" && <TeamPeople role="intern" {...props} />}
        {tab === "reports" && <FieldReports {...props} />}
        {tab === "updates" && <TeamDailyUpdates {...props} />}
      </main>
    </div>
  );
}

// Opened from the manager portal invite link: set your own password
function ManagerInvite({ token, onDone, onCancel }) {
  const [info, setInfo] = useState(null);
  const [bad, setBad] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    portalApi(`/api/portal/invite/${encodeURIComponent(token)}`)
      .then((d) => (d.role && d.role !== "manager" ? setBad("This invite is for the team portal. Please open the link at lragrosense.in/team.html.") : setInfo(d)))
      .catch((err) => setBad(err.message));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      const data = await portalApi(`/api/portal/invite/${encodeURIComponent(token)}`, { method: "POST", body: { password } });
      if (data.user.role !== "manager") throw new Error("This invite is for the team portal. Please open it at lragrosense.in/team.html.");
      onDone({ token: data.token, user: data.user });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-login">
      <form className="pt-login-card" onSubmit={submit}>
        <div className="pt-login-brand">
          <span className="brand-mark">
            <Sprout size={18} />
          </span>
          <div>
            <strong>LR AgroSense</strong>
            <span>Manager portal</span>
          </div>
        </div>
        {bad ? (
          <>
            <div className="fr-error">{bad}</div>
            <button type="button" className="fr-btn fr-submit" onClick={onCancel}>
              Go to login
            </button>
          </>
        ) : !info ? (
          <p className="pt-login-sub">
            <Loader2 size={16} className="spin" /> Checking your invite…
          </p>
        ) : (
          <>
            <p className="pt-login-sub">
              Set your own password for <b>{info.email}</b> (manager portal).
            </p>
            <label className="fr-field">
              New password (at least 8 characters)
              <div className="pt-pass">
                <input type={show ? "text" : "password"} autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className="fr-field">
              Type it again
              <input type={show ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            {error && <div className="fr-error">{error}</div>}
            <button className="fr-btn fr-btn-primary fr-submit" disabled={busy}>
              {busy ? <Loader2 size={18} className="spin" /> : null} Set password
            </button>
          </>
        )}
      </form>
    </div>
  );
}
