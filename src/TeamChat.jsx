import React, { useEffect, useRef, useState } from "react";
import { Loader2, Phone, Send, Trash2, Video, X } from "lucide-react";

function timeLabel(value) {
  const d = new Date(value);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return sameDay ? time : `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}

function initials(name) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// Turns links into clickable links and highlights @mentions
function MessageText({ text }) {
  const parts = String(text).split(/(https?:\/\/[^\s]+|@\w+)/g);
  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer">
          {part}
        </a>
      );
    }
    if (/^@\w+/.test(part)) {
      return (
        <b key={i} className="tc-mention">
          {part}
        </b>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

const POLL_MS = 8000;

export default function TeamChat({ token, api, onAuthError }) {
  const [me, setMe] = useState(null);
  const [people, setPeople] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [callOpen, setCallOpen] = useState(false);
  const listRef = useRef(null);
  const lastRef = useRef(null);
  const stickRef = useRef(true);

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const scrollDown = () => {
    const el = listRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  };

  const addMessages = (items) => {
    if (!items.length) return;
    setMessages((list) => {
      const seen = new Set(list.map((m) => m._id));
      const merged = [...list, ...items.filter((m) => !seen.has(m._id))];
      lastRef.current = merged[merged.length - 1]?.createdAt || lastRef.current;
      return merged;
    });
  };

  // First load
  useEffect(() => {
    Promise.all([api("/api/workspace/people", { token }), api("/api/workspace/messages", { token })])
      .then(([p, items]) => {
        setMe(p.me);
        setPeople(p.people);
        setMessages(items);
        lastRef.current = items[items.length - 1]?.createdAt || null;
      })
      .catch(handleError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for new messages every few seconds while the page is open
  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      const after = lastRef.current ? `?after=${encodeURIComponent(lastRef.current)}` : "";
      api(`/api/workspace/messages${after}`, { token })
        .then((items) => addMessages(items))
        .catch((err) => {
          if (err.status === 401) onAuthError();
        });
    };
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(scrollDown, [messages]);

  const onScroll = () => {
    const el = listRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const send = async (e) => {
    e?.preventDefault();
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    setError("");
    try {
      const message = await api("/api/workspace/messages", { token, method: "POST", body: { text: value } });
      setText("");
      stickRef.current = true;
      addMessages([message]);
    } catch (err) {
      handleError(err);
    } finally {
      setSending(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api(`/api/workspace/messages/${m._id}`, { token, method: "DELETE" });
      setMessages((list) => list.filter((x) => x._id !== m._id));
    } catch (err) {
      handleError(err);
    }
  };

  const insertMention = (name) => {
    const first = name.split(/[\s(]/)[0];
    setText((t) => `${t}${t && !t.endsWith(" ") ? " " : ""}@${first} `);
  };

  // Latest call in the last 3 hours, shown as a banner
  const liveCall = [...messages]
    .reverse()
    .find((m) => m.kind === "call" && Date.now() - new Date(m.createdAt).getTime() < 3 * 60 * 60 * 1000);

  return (
    <div className="tc">
      <div className="dash-head">
        <div>
          <h1>Team chat</h1>
          <p>
            {people.length} people · type <b>@name</b> to email someone, <b>@all</b> for everyone
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCallOpen(true)}>
          <Video size={16} /> Start call
        </button>
      </div>

      {liveCall && (
        <div className="tc-live">
          <Phone size={18} />
          <span>
            <b>{liveCall.authorName}</b> started a call: {liveCall.text} · {timeLabel(liveCall.createdAt)}
          </span>
          <a className="btn btn-primary" href={liveCall.meetUrl} target="_blank" rel="noreferrer">
            Join
          </a>
        </div>
      )}

      {error && <div className="error-box">{error}</div>}

      <div className="tc-box">
        <div className="tc-list" ref={listRef} onScroll={onScroll}>
          {loading ? (
            <div className="empty">
              <Loader2 className="spin" /> Loading chat…
            </div>
          ) : messages.length === 0 ? (
            <div className="empty">No messages yet. Say hello to your team 👋</div>
          ) : (
            messages.map((m) => {
              const mine = me && m.authorId === me.id;
              return (
                <div key={m._id} className={`tc-msg ${mine ? "mine" : ""} ${m.kind === "call" ? "call" : ""}`}>
                  {!mine && <span className="tc-avatar">{initials(m.authorName)}</span>}
                  <div className="tc-bubble">
                    <div className="tc-meta">
                      <strong>{mine ? "You" : m.authorName}</strong>
                      <span>{timeLabel(m.createdAt)}</span>
                      {(mine || me?.id === "admin") && (
                        <button className="tc-del" onClick={() => remove(m)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                    {m.kind === "call" ? (
                      <div className="tc-call">
                        <Video size={16} /> <span>Call: {m.text}</span>
                        <a href={m.meetUrl} target="_blank" rel="noreferrer">
                          Join Google Meet
                        </a>
                      </div>
                    ) : (
                      <p>
                        <MessageText text={m.text} />
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {people.length > 1 && (
          <div className="tc-people">
            {people
              .filter((p) => !me || p.id !== me.id)
              .map((p) => (
                <button key={p.id} type="button" onClick={() => insertMention(p.name)} title={`Mention ${p.name}`}>
                  @{p.name.split(/[\s(]/)[0]}
                </button>
              ))}
            <button type="button" onClick={() => setText((t) => `${t}${t && !t.endsWith(" ") ? " " : ""}@all `)}>
              @all
            </button>
          </div>
        )}

        <form className="tc-input" onSubmit={send}>
          <textarea
            rows={1}
            value={text}
            maxLength={2000}
            placeholder="Write a message…"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="btn btn-primary" disabled={sending || !text.trim()} aria-label="Send">
            {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>

      {callOpen && (
        <StartCall
          token={token}
          api={api}
          onClose={() => setCallOpen(false)}
          onAuthError={onAuthError}
          onStarted={(m) => {
            setCallOpen(false);
            stickRef.current = true;
            addMessages([m]);
          }}
        />
      )}
    </div>
  );
}

function StartCall({ token, api, onClose, onStarted, onAuthError }) {
  const [meetUrl, setMeetUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      onStarted(await api("/api/workspace/calls", { token, method: "POST", body: { meetUrl: meetUrl.trim(), topic } }));
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
          <h2>Start a team call</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          <ol className="tc-steps">
            <li>
              Open{" "}
              <a href="https://meet.google.com/new" target="_blank" rel="noreferrer">
                meet.google.com/new
              </a>{" "}
              (it creates a new meeting).
            </li>
            <li>Copy the meeting link and paste it below.</li>
            <li>Everyone in the team gets an email with the link, and a "Join" button appears in the chat.</li>
          </ol>
          <label className="field">
            Google Meet link *
            <input
              required
              value={meetUrl}
              onChange={(e) => setMeetUrl(e.target.value)}
              placeholder="https://meet.google.com/abc-defg-hij"
            />
          </label>
          <label className="field">
            Topic
            <input value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={200} placeholder="e.g. Weekly team call" />
          </label>
          {error && <div className="error-box">{error}</div>}
        </div>
        <div className="modal-foot">
          <button type="button" className="btn btn-light" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? <Loader2 size={16} className="spin" /> : <Phone size={16} />} Share call
          </button>
        </div>
      </form>
    </div>
  );
}
