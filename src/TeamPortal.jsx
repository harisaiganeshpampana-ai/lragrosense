import React, { useEffect, useState } from "react";
import { CalendarCheck, ClipboardList, ExternalLink, LogOut, Sprout, Users } from "lucide-react";
import PortalLogin from "./PortalLogin";
import TeamPeople from "./TeamPeople";
import FieldReports from "./AdminFieldReports";
import TeamDailyUpdates from "./TeamDailyUpdates";
import { portalApi, readSession, saveSession } from "./portalApi";

const SESSION_KEY = "lr_team_session";

// Portal for the intern manager (e.g. Sandeep): manage interns and review their work
export default function TeamPortal() {
  const [session, setSession] = useState(() => readSession(SESSION_KEY));
  const [tab, setTab] = useState("interns"); // interns | reports | updates

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
          subtitle="For LR AgroSense team leads: manage interns and review their field reports."
          allowedRole="manager"
          onLogin={(s) => {
            saveSession(SESSION_KEY, s);
            setSession(s);
          }}
        />
      </div>
    );
  }

  const { token, user } = session;

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
            <a href="/intern.html" target="_blank" rel="noreferrer" className="btn btn-light">
              <ExternalLink size={16} /> <span className="hide-sm">Intern portal</span>
            </a>
            <button className="btn btn-light" onClick={logout}>
              <LogOut size={16} /> <span className="hide-sm">Log out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="dash-main">
        <div className="tabs">
          <button className={tab === "interns" ? "active" : ""} onClick={() => setTab("interns")}>
            <Users size={16} /> Interns
          </button>
          <button className={tab === "reports" ? "active" : ""} onClick={() => setTab("reports")}>
            <ClipboardList size={16} /> Field reports
          </button>
          <button className={tab === "updates" ? "active" : ""} onClick={() => setTab("updates")}>
            <CalendarCheck size={16} /> Daily updates
          </button>
        </div>

        {tab === "interns" && <TeamPeople role="intern" token={token} api={portalApi} onAuthError={logout} />}
        {tab === "reports" && <FieldReports token={token} api={portalApi} onAuthError={logout} />}
        {tab === "updates" && <TeamDailyUpdates token={token} api={portalApi} onAuthError={logout} />}
      </main>
    </div>
  );
}
