import React, { useEffect, useState } from "react";
import { CalendarCheck, ClipboardList, LogOut, MessageSquare, Sprout, Users } from "lucide-react";
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

  const logout = () => {
    saveSession(SESSION_KEY, null);
    setSession(null);
  };

  useEffect(() => {
    if (!session) return;
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

  if (!session) {
    return (
      <div className="fr-page">
        <PortalLogin
          title="Manager portal"
          subtitle="Only for managers: interns, farmer visit reports and daily updates."
          allowedRoles={["manager"]}
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
