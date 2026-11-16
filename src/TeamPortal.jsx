import React, { useEffect, useState } from "react";
import { FolderOpen, LogOut, MessageCircle, MessageSquare, ShieldCheck, Sprout } from "lucide-react";
import PortalLogin from "./PortalLogin";
import InviteSetup from "./InviteSetup";
import TeamChat from "./TeamChat";
import TeamMessages from "./TeamMessages";
import TeamFiles from "./TeamFiles";
import { portalApi, readSession, saveSession } from "./portalApi";

const SESSION_KEY = "lr_team_session";

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

// Team portal for the core team: group chat, direct messages, calls and file sharing
export default function TeamPortal() {
  const [session, setSession] = useState(() => readSession(SESSION_KEY));
  const [invite, setInvite] = useState(readInvite);
  const [tab, setTab] = useState("group"); // group | messages | files

  const logout = () => {
    saveSession(SESSION_KEY, null);
    setSession(null);
  };

  const login = (s) => {
    saveSession(SESSION_KEY, s);
    setSession(s);
  };

  useEffect(() => {
    if (!session || invite) return;
    portalApi("/api/portal/me", { token: session.token })
      .then((user) => login({ ...session, user }))
      .catch((err) => {
        if (err.status === 401) logout();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (invite) {
    return (
      <div className="fr-page">
        <InviteSetup
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
      </div>
    );
  }

  if (!session) {
    return (
      <div className="fr-page">
        <PortalLogin
          title="Team portal"
          subtitle="For the LR AgroSense core team: group chat, messages, calls and file sharing."
          allowedRoles={["manager", "member"]}
          onLogin={login}
        />
      </div>
    );
  }

  const { token, user } = session;
  const props = { token, api: portalApi, onAuthError: logout };
  const tabs = [
    ["group", "Group chat", MessageSquare],
    ["messages", "Messages", MessageCircle],
    ["files", "Files", FolderOpen],
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
            {user.role === "manager" && (
              <a className="btn btn-light" href="/manager.html">
                <ShieldCheck size={16} /> <span className="hide-sm">Manager portal</span>
              </a>
            )}
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
        {tab === "group" && <TeamChat {...props} />}
        {tab === "messages" && <TeamMessages {...props} />}
        {tab === "files" && <TeamFiles {...props} />}
      </main>
    </div>
  );
}
