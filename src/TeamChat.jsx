import React, { useEffect, useRef, useState } from "react";
import { FileText, Loader2, Paperclip, Phone, Send, Trash2, Video, X } from "lucide-react";
import { fileSizeLabel, portalFileUrl, readFileBase64 } from "./portalApi";

export function timeLabel(value) {
  const d = new Date(value);
  const today = new Date();
  const sameDay = d.toDateString() === today.toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  return sameDay ? time : `${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}, ${time}`;
}

export function initials(name) {
  return (name || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

const ACCEPT = "application/pdf,image/jpeg,image/png,image/webp";
const MAX_BYTES = 5 * 1024 * 1024;
const POLL_MS = 8000;

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

// A shared PDF or image inside a message
export function SharedFile({ file, token, onAuthError }) {
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
      const link = url || (await portalFileUrl(file.id, token));
      window.open(link, "_blank", "noopener");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    }
  };

  return (
    <div className="tc-file">
      {isImage && url ? (
        <button type="button" className="tc-img" onClick={open} title="Open full size">
          <img src={url} alt={file.name} />
        </button>
      ) : isImage && !error ? (
        <div className="tc-img tc-img-loading">
          <Loader2 className="spin" size={18} />
        </div>
      ) : null}
      <button type="button" className="tc-file-row" onClick={open}>
        <FileText size={16} />
        <span>{file.name}</span>
        <em>{fileSizeLabel(file.size)}</em>
      </button>
      {error && <small className="tc-file-err">{error}</small>}
    </div>
  );
}

// One conversation: the group chat (withId empty) or a direct chat with one person
export default function TeamChat({ token, api, onAuthError, withId = "", withName = "", people: givenPeople }) {
  const [me, setMe] = useState(null);
  const [people, setPeople] = useState(givenPeople || []);
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
  const isDm = Boolean(withId);
  const query = isDm ? `with=${encodeURIComponent(withId)}` : "";

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
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

  // Load this conversation (again when switching person)
  useEffect(() => {
    setLoading(true);
    setMessages([]);
    setError("");
    lastRef.current = null;
    stickRef.current = true;
    Promise.all([api("/api/workspace/people", { token }), api(`/api/workspace/messages${query ? `?${query}` : ""}`, { token })])
      .then(([p, items]) => {
        setMe(p.me);
        setPeople(p.people);
        setMessages(items);
        lastRef.current = items[items.length - 1]?.createdAt || null;
      })
      .catch(handleError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withId]);

  // Check for new messages every few seconds while the page is open
  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      const params = [query, lastRef.current ? `after=${encodeURIComponent(lastRef.current)}` : ""].filter(Boolean).join("&");
      api(`/api/workspace/messages${params ? `?${params}` : ""}`, { token })
        .then(addMessages)
        .catch((err) => {
          if (err.status === 401) onAuthError();
        });
    };
    const id = setInterval(tick, POLL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [withId]);

  useEffect(() => {
    const el = listRef.current;
    if (el && stickRef.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const onScroll = () => {
    const el = listRef.current;
    if (el) stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (!ACCEPT.split(",").includes(f.type)) return setError("Only PDF, JPG, PNG or WEBP files can be shared.");
    if (f.size > MAX_BYTES) return setError("File is too big. Please share files under 5 MB (or share a Google Drive link).");
    setError("");
    setFile(f);
  };

  const send = async (e) => {
    e?.preventDefault();
    const value = text.trim();
    if ((!value && !file) || sending) return;
    setSending(true);
    setError("");
    try {
      const body = { text: value, ...(isDm ? { with: withId } : {}) };
      if (file) body.file = { name: file.name, type: file.type, data: await readFileBase64(file) };
      const message = await api("/api/workspace/messages", { token, method: "POST", body });
      setText("");
      setFile(null);
      stickRef.current = true;
      addMessages([message]);
    } catch (err) {
      handleError(err);
    } finally {
      setSending(false);
    }
  };

  const remove = async (m) => {
    if (!window.confirm(m.kind === "file" ? "Delete this message and its file?" : "Delete this message?")) return;
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
          <h1>{isDm ? withName : "Group chat"}</h1>
          <p>
            {isDm ? (
              "Only you two can see this chat"
            ) : (
              <>
                {people.length} people · type <b>@name</b> to email someone, <b>@all</b> for everyone
              </>
            )}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setCallOpen(true)}>
          <Video size={16} /> {isDm ? "Call" : "Start call"}
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
            <div className="empty">{isDm ? `No messages with ${withName} yet. Say hi 👋` : "No messages yet. Say hello to your team 👋"}</div>
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
                      <>
                        {m.kind === "file" && m.file?.id && <SharedFile file={m.file} token={token} onAuthError={onAuthError} />}
                        {m.text && (
                          <p>
                            <MessageText text={m.text} />
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!isDm && people.length > 1 && (
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

        {file && (
          <div className="tc-picked">
            <FileText size={16} />
            <span>{file.name}</span>
            <em>{fileSizeLabel(file.size)}</em>
            <button type="button" className="icon-btn" onClick={() => setFile(null)} aria-label="Remove file">
              <X size={15} />
            </button>
          </div>
        )}

        <form className="tc-input" onSubmit={send}>
          <input ref={fileRef} type="file" accept={ACCEPT} hidden onChange={pickFile} />
          <button type="button" className="btn btn-light tc-attach" onClick={() => fileRef.current?.click()} title="Share a PDF or image" aria-label="Attach file">
            <Paperclip size={16} />
          </button>
          <textarea
            rows={1}
            value={text}
            maxLength={2000}
            placeholder={file ? "Add a note (optional)…" : "Write a message…"}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
          />
          <button className="btn btn-primary" disabled={sending || (!text.trim() && !file)} aria-label="Send">
            {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
          </button>
        </form>
      </div>

      {callOpen && (
        <StartCall
          token={token}
          api={api}
          withId={withId}
          withName={withName}
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

function StartCall({ token, api, withId, withName, onClose, onStarted, onAuthError }) {
  const [meetUrl, setMeetUrl] = useState("");
  const [topic, setTopic] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const body = { meetUrl: meetUrl.trim(), topic, ...(withId ? { with: withId } : {}) };
      onStarted(await api("/api/workspace/calls", { token, method: "POST", body }));
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
          <h2>{withId ? `Call ${withName}` : "Start a team call"}</h2>
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
            <li>{withId ? `${withName} gets an email` : "Everyone in the team gets an email"} with the link, and a "Join" button appears in the chat.</li>
          </ol>
          <label className="field">
            Google Meet link *
            <input required value={meetUrl} onChange={(e) => setMeetUrl(e.target.value)} placeholder="https://meet.google.com/abc-defg-hij" />
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
