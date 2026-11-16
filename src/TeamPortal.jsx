import React, { useEffect, useState } from "react";
import { CalendarCheck, ClipboardList, ListTodo, LogOut, MessageSquare, Sprout, Users } from "lucide-react";
import PortalLogin from "./PortalLogin";
import TeamPeople from "./TeamPeople";
import FieldReports from "./AdminFieldReports";
import TeamDailyUpdates from "./TeamDailyUpdates";
import TeamChat from "./TeamChat";
import TeamTasks from "./TeamTasks";
import { portalApi, readSession, saveSession } from "./portalApi";

const SESSION_KEY = "lr_team_session";

// Team portal: team chat + tasks for the core team. Managers (e.g. Sandeep)
// also get the intern tabs.
export default function TeamPortal() {
  const [session, setSession] = useState(() => readSession(SESSION_KEY));
  const [tab, setTab] = useState("chat"); // chat | tasks | interns | reports | updates

  const logout = () => {
    saveSession(SESSION_KEY, null);
    setSession(null);
  };

  useEffect(() => {
    if (!session) return;
    portalApi("/api/portal/me", { token: session.token })
      .then((user) => {
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
          title="Team portal"
          subtitle="For the LR AgroSense core team: team chat, calls and tasks."
          allowedRoles={["manager", "member"]}
          onLogin={(s) => {
            saveSession(SESSION_KEY, s);
            setSession(s);
          }}
        />
      </div>
    );
  }

  const { token, user } = session;
  const isManager = user.role === "manager";
  const props = { token, api: portalApi, onAuthError: logout };

  const tabs = [
    ["chat", "Team chat", MessageSquare],
    ["tasks", "Tasks", ListTodo],
    ...(isManager
      ? [
          ["interns", "Interns", Users],
          ["reports", "Field reports", ClipboardList],
          ["updates", "Daily updates", CalendarCheck],
        ]
      : []),
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
              <span>Team portal · {user.name}</span>
            </div>
          </div>
          <div className="topbar-actions">
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

        {tab === "chat" && <TeamChat {...props} />}
        {tab === "tasks" && <TeamTasks {...props} />}
        {isManager && tab === "interns" && <TeamPeople role="intern" {...props} />}
        {isManager && tab === "reports" && <FieldReports {...props} />}
        {isManager && tab === "updates" && <TeamDailyUpdates {...props} />}
      </main>
    </div>
  );
}
