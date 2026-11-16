import React, { useEffect, useState } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import TeamChat, { initials, timeLabel } from "./TeamChat";

const SEEN_KEY = "lr_dm_seen";

function readSeen() {
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "{}");
  } catch {
    return {};
  }
}

function markSeen(id) {
  try {
    const seen = readSeen();
    seen[id] = new Date().toISOString();
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    /* ignore */
  }
}

// Direct messages: pick a team member on the left, chat on the right
export default function TeamMessages({ token, api, onAuthError }) {
  const [me, setMe] = useState(null);
  const [people, setPeople] = useState([]);
  const [summary, setSummary] = useState({});
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [, setTick] = useState(0);

  const loadSummary = () =>
    api("/api/workspace/dm-summary", { token })
      .then((s) => setSummary(s.dms || {}))
      .catch((err) => err.status === 401 && onAuthError());

  useEffect(() => {
    Promise.all([api("/api/workspace/people", { token }), loadSummary()])
      .then(([p]) => {
        setMe(p.me);
        setPeople(p.people.filter((x) => x.id !== p.me.id));
      })
      .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)))
      .finally(() => setLoading(false));
    const id = setInterval(() => !document.hidden && loadSummary(), 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const open = (p) => {
    markSeen(p.id);
    setActive(p);
  };

  const seen = readSeen();
  const isNew = (p) => {
    const s = summary[p.id];
    if (!s || s.fromMe || active?.id === p.id) return false;
    return !seen[p.id] || new Date(s.last) > new Date(seen[p.id]);
  };

  const sorted = [...people].sort((a, b) => {
    const la = summary[a.id]?.last ? new Date(summary[a.id].last).getTime() : 0;
    const lb = summary[b.id]?.last ? new Date(summary[b.id].last).getTime() : 0;
    return lb - la || a.name.localeCompare(b.name);
  });

  return (
    <div className={`tm ${active ? "tm-open" : ""}`}>
      <aside className="tm-list">
        <h2>Messages</h2>
        {error && <div className="error-box">{error}</div>}
        {loading ? (
          <div className="empty">
            <Loader2 className="spin" />
          </div>
        ) : sorted.length === 0 ? (
          <p className="pt-intro">No one else has joined yet. Once team members set their password, they'll show here.</p>
        ) : (
          sorted.map((p) => (
            <button key={p.id} className={`tm-person ${active?.id === p.id ? "on" : ""}`} onClick={() => open(p)}>
              <span className="tc-avatar">{initials(p.name)}</span>
              <span className="tm-who">
                <strong>{p.name}</strong>
                <small>{summary[p.id] ? timeLabel(summary[p.id].last) : p.role === "manager" ? "Manager" : p.role === "founder" ? "Founder" : "Core team"}</small>
              </span>
              {isNew(p) && <span className="tm-dot" title="New message" />}
            </button>
          ))
        )}
      </aside>
      <section className="tm-chat">
        {active ? (
          <>
            <button
              className="btn btn-light tm-back"
              onClick={() => {
                markSeen(active.id);
                setActive(null);
                setTick((t) => t + 1);
              }}
            >
              <ArrowLeft size={16} /> All messages
            </button>
            <TeamChat key={active.id} token={token} api={api} onAuthError={onAuthError} withId={active.id} withName={active.name} />
          </>
        ) : (
          <div className="empty tm-empty">{me ? "Pick a person to start a private chat." : ""}</div>
        )}
      </section>
    </div>
  );
}
