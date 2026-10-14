import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Check,
  ChevronDown,
  Copy,
  Inbox,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import "./admin-cofounder.css";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/* ================= AI screening (inside Applications) ================= */

export function ScreenBadge({ screen }) {
  if (!screen) return null;
  const tone = screen.verdict === "Shortlist" ? "good" : screen.verdict === "Skip" ? "bad" : "mid";
  return (
    <span className={`cf-badge cf-badge-${tone}`} title={screen.reason}>
      <Sparkles size={12} /> {screen.score}/10 · {screen.verdict}
    </span>
  );
}

export function ScreenPanel({ app, token, api, onUpdate, onAuthError }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const screen = app.aiScreen;

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      onUpdate(await api(`/api/admin/applications/${app._id}/screen`, { token, method: "POST" }));
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="cf-screen">
      <div className="cf-screen-head">
        <Sparkles size={16} />
        <strong>Co-founder's first look</strong>
        {screen && <ScreenBadge screen={screen} />}
        <button className="cf-link" onClick={run} disabled={busy}>
          {busy ? <Loader2 size={14} className="spin" /> : <RefreshCw size={14} />}
          {screen ? "Check again" : "Screen with AI"}
        </button>
      </div>
      {screen ? (
        <>
          <p>{screen.reason}</p>
          {(screen.strengths?.length > 0 || screen.concerns?.length > 0) && (
            <div className="cf-screen-lists">
              {screen.strengths?.length > 0 && (
                <ul className="cf-plus">
                  {screen.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
              {screen.concerns?.length > 0 && (
                <ul className="cf-minus">
                  {screen.concerns.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="cf-muted">Not screened yet. Click "Screen with AI" for a quick score and reason.</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

/* ================= Outbox ================= */

const TYPE_LABEL = {
  ack: "Thank-you for applying",
  invite: "Interview invite",
  result: "Selection result",
  custom: "Email",
};

export function Outbox({ token, api, onAuthError, onCount }) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState("");
  const [openId, setOpenId] = useState("");
  const [showSent, setShowSent] = useState(false);

  const fail = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [list, st] = await Promise.all([
        api("/api/admin/outbox", { token }),
        api("/api/admin/cofounder/status", { token }),
      ]);
      setItems(list);
      setStatus(st);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drafts = items.filter((e) => e.status !== "sent");
  const sent = items.filter((e) => e.status === "sent");

  useEffect(() => {
    onCount?.(items.filter((e) => e.status === "draft").length);
  }, [items, onCount]);

  const replace = (email) => setItems((list) => list.map((e) => (e._id === email._id ? email : e)));

  const save = async (email, changes) => {
    setBusy(email._id);
    setError("");
    try {
      replace(await api(`/api/admin/outbox/${email._id}`, { token, method: "PUT", body: changes }));
    } catch (err) {
      fail(err);
    } finally {
      setBusy("");
    }
  };

  const send = async (email) => {
    setBusy(email._id);
    setError("");
    try {
      const result = await api(`/api/admin/outbox/${email._id}/send`, { token, method: "POST" });
      replace(result);
      if (result.status === "failed") setError(`Could not send to ${result.to}: ${result.error}`);
      else setNotice(`Sent to ${result.to}`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy("");
    }
  };

  const discard = async (email) => {
    if (!window.confirm("Discard this email?")) return;
    setBusy(email._id);
    try {
      await api(`/api/admin/outbox/${email._id}`, { token, method: "DELETE" });
      setItems((list) => list.filter((e) => e._id !== email._id));
    } catch (err) {
      fail(err);
    } finally {
      setBusy("");
    }
  };

  const sendAll = async () => {
    if (!window.confirm(`Send all ${drafts.length} emails now?`)) return;
    setBusy("all");
    setError("");
    try {
      const result = await api("/api/admin/outbox/send-all", { token, method: "POST" });
      setNotice(`Sent ${result.sent} email${result.sent === 1 ? "" : "s"}${result.failed ? `, ${result.failed} failed` : ""}.`);
      await load();
    } catch (err) {
      fail(err);
    } finally {
      setBusy("");
    }
  };

  const setSetting = async (changes) => {
    try {
      const settings = await api("/api/admin/cofounder/settings", { token, method: "PUT", body: changes });
      setStatus((s) => ({ ...s, settings }));
    } catch (err) {
      fail(err);
    }
  };

  const summaryNow = async () => {
    setBusy("summary");
    setError("");
    try {
      await api("/api/admin/cofounder/summary-now", { token, method: "POST" });
      setNotice(`Today's summary was sent to ${status?.adminEmail}.`);
    } catch (err) {
      fail(err);
    } finally {
      setBusy("");
    }
  };

  const settings = status?.settings;

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Outbox</h1>
          <p>Emails your co-founder wrote. Check them, edit if needed, and send.</p>
        </div>
        {drafts.length > 0 && (
          <button className="btn btn-primary" onClick={sendAll} disabled={busy === "all" || !status?.emailReady}>
            {busy === "all" ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Send all ({drafts.length})
          </button>
        )}
      </div>

      {status && !status.emailReady && (
        <div className="cf-setup">
          <Mail size={18} />
          <div>
            <strong>Email is not connected yet.</strong> Drafts will be saved here, but they can't be
            sent until you add <code>BREVO_API_KEY</code> in Render (see the setup steps I gave you).
          </div>
        </div>
      )}

      {notice && (
        <p className="cf-notice" onClick={() => setNotice("")}>
          <Check size={16} /> {notice}
        </p>
      )}
      {error && <p className="error">{error}</p>}

      {loading ? (
        <div className="empty">
          <Loader2 size={28} className="spin" />
          <p>Loading outbox…</p>
        </div>
      ) : drafts.length === 0 ? (
        <div className="empty">
          <Inbox size={32} />
          <h3>Nothing waiting</h3>
          <p>
            When students apply, get shortlisted or get a result, your co-founder writes the email
            and puts it here for you.
          </p>
        </div>
      ) : (
        <div className="list">
          {drafts.map((email) => (
            <DraftCard
              key={email._id}
              email={email}
              open={openId === email._id}
              onToggle={() => setOpenId(openId === email._id ? "" : email._id)}
              busy={busy === email._id}
              canSend={status?.emailReady}
              onSave={(changes) => save(email, changes)}
              onSend={() => send(email)}
              onDiscard={() => discard(email)}
            />
          ))}
        </div>
      )}

      {settings && (
        <div className="cf-settings">
          <h3>
            <Bot size={18} /> Co-founder settings
          </h3>
          <p className="cf-muted">Turn on "send automatically" only when you trust that email type.</p>
          <Toggle
            label="Thank-you email when a student applies"
            hint="Send automatically"
            checked={settings.autoSend?.ack}
            onChange={(v) => setSetting({ autoSend: { ack: v } })}
          />
          <Toggle
            label="Interview invite when you create an AI interview link"
            hint="Send automatically"
            checked={settings.autoSend?.invite}
            onChange={(v) => setSetting({ autoSend: { invite: v } })}
          />
          <Toggle
            label="Result email when you mark Selected or Rejected"
            hint="Send automatically"
            checked={settings.autoSend?.result}
            onChange={(v) => setSetting({ autoSend: { result: v } })}
          />
          <Toggle
            label="Screen every new application with AI"
            hint="On"
            checked={settings.autoScreen}
            onChange={(v) => setSetting({ autoScreen: v })}
          />
          <Toggle
            label={`Daily summary email at 8 AM${status.adminEmail ? ` to ${status.adminEmail}` : ""}`}
            hint="On"
            checked={settings.dailySummary}
            onChange={(v) => setSetting({ dailySummary: v })}
          />
          <div className="cf-settings-foot">
            <button
              className="btn btn-light"
              onClick={summaryNow}
              disabled={busy === "summary" || !status.emailReady || !status.adminEmail}
            >
              {busy === "summary" ? <Loader2 size={16} className="spin" /> : <Mail size={16} />} Send me
              today's summary now
            </button>
            {!status.adminEmail && <span className="cf-muted">Add ADMIN_EMAIL in Render to get summaries.</span>}
          </div>
        </div>
      )}

      {sent.length > 0 && (
        <div className="cf-history">
          <button className="cf-link" onClick={() => setShowSent(!showSent)}>
            <ChevronDown size={16} className={showSent ? "cf-rot" : ""} /> Sent emails ({sent.length})
          </button>
          {showSent && (
            <ul>
              {sent.map((e) => (
                <li key={e._id}>
                  <Check size={14} /> <b>{e.toName || e.to}</b> – {e.subject}
                  <span>{formatDate(e.sentAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </>
  );
}

function DraftCard({ email, open, onToggle, busy, canSend, onSave, onSend, onDiscard }) {
  const [subject, setSubject] = useState(email.subject);
  const [body, setBody] = useState(email.body);
  const changed = subject !== email.subject || body !== email.body;

  useEffect(() => {
    setSubject(email.subject);
    setBody(email.body);
  }, [email.subject, email.body]);

  return (
    <article className={`app-card cf-draft ${email.status === "failed" ? "cf-failed" : ""}`}>
      <div className="app-top">
        <button className="app-summary" onClick={onToggle}>
          <span className="app-avatar">
            <Mail size={16} />
          </span>
          <span className="app-who">
            <strong>
              {email.toName || email.to}
              <span className="cf-type">{TYPE_LABEL[email.type] || "Email"}</span>
            </strong>
            <span>{email.subject}</span>
          </span>
          <ChevronDown size={18} className={`app-chevron ${open ? "open" : ""}`} />
        </button>
        <div className="app-controls">
          <button className="btn btn-primary cf-send" onClick={onSend} disabled={busy || !canSend || changed}>
            {busy ? <Loader2 size={16} className="spin" /> : <Send size={16} />} Send
          </button>
          <button className="icon-btn icon-danger" title="Discard" onClick={onDiscard} disabled={busy}>
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      {email.status === "failed" && <p className="error cf-fail-msg">Last try failed: {email.error}</p>}
      {open && (
        <div className="app-details">
          <p className="cf-muted">To: {email.to}</p>
          <label className="field">
            <span>Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <label className="field">
            <span>Message</span>
            <textarea rows={12} value={body} onChange={(e) => setBody(e.target.value)} />
          </label>
          {changed && (
            <div className="ai-row">
              <button className="btn btn-primary" onClick={() => onSave({ subject, body })} disabled={busy}>
                Save changes
              </button>
              <button
                className="btn btn-light"
                onClick={() => {
                  setSubject(email.subject);
                  setBody(email.body);
                }}
              >
                Undo
              </button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="cf-toggle">
      <span>{label}</span>
      <span className="cf-switch-wrap">
        <small>{hint}</small>
        <input type="checkbox" checked={Boolean(checked)} onChange={(e) => onChange(e.target.checked)} />
        <i className="cf-switch" />
      </span>
    </label>
  );
}

/* ================= Co-founder chat ================= */

const CHAT_KEY = "lr_cofounder_chat";
const STARTERS = [
  "Who are my best 3 candidates right now?",
  "What should I do this week? I only have 1 hour a day.",
  "Write a LinkedIn post about our internship program",
  "Which applications still need my decision?",
  "Write a WhatsApp message to remind students to finish their AI interview",
  "Give me ideas to get our first paying customer",
];

function loadChat() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveChat(messages) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-40)));
  } catch {
    /* ignore */
  }
}

// Shows the co-founder's reply with simple formatting (bold, lists)
function Formatted({ text }) {
  const blocks = String(text).split(/\n/);
  const out = [];
  let list = [];
  let numbered = false;
  const flush = () => {
    if (list.length) {
      const items = list.map((li, i) => <li key={i}>{bold(li)}</li>);
      out.push(numbered ? <ol key={`l${out.length}`}>{items}</ol> : <ul key={`l${out.length}`}>{items}</ul>);
      list = [];
    }
  };
  blocks.forEach((line) => {
    const item = line.match(/^\s*([-*•]|\d+[.)])\s+(.*)/);
    if (item) {
      const isNumber = /\d/.test(item[1]);
      if (list.length && isNumber !== numbered) flush();
      numbered = isNumber;
      list.push(item[2]);
    } else {
      flush();
      if (line.trim()) out.push(<p key={`p${out.length}`}>{bold(line.replace(/^#+\s*/, ""))}</p>);
    }
  });
  flush();
  return <>{out}</>;
}

function bold(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? <b key={i}>{part.slice(2, -2)}</b> : part
  );
}

export function Cofounder({ token, api, onAuthError }) {
  const [messages, setMessages] = useState(loadChat);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(-1);
  const endRef = useRef(null);

  useEffect(() => {
    saveChat(messages);
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, thinking]);

  const ask = async (text) => {
    const question = String(text ?? input).trim();
    if (!question || thinking) return;
    const next = [...messages, { role: "user", text: question }];
    setMessages(next);
    setInput("");
    setError("");
    setThinking(true);
    try {
      const data = await api("/api/admin/cofounder/chat", { token, method: "POST", body: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", text: data.reply }]);
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setThinking(false);
    }
  };

  const copy = async (text, i) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\*\*/g, ""));
      setCopied(i);
      setTimeout(() => setCopied(-1), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="cf-chat">
      <div className="dash-head">
        <div>
          <h1>Co-founder</h1>
          <p>Your AI co-founder knows LR AgroSense and your live applications. Ask anything.</p>
        </div>
        {messages.length > 0 && (
          <button
            className="btn btn-light"
            onClick={() => {
              setMessages([]);
              setError("");
            }}
          >
            New chat
          </button>
        )}
      </div>

      <div className="cf-thread">
        {messages.length === 0 && (
          <div className="cf-welcome">
            <span className="cf-avatar">
              <Bot size={22} />
            </span>
            <p>
              Hi Hari! I'm your AI co-founder. I can see your internships, applications, AI screening
              scores and interview reports. Try one of these:
            </p>
            <div className="cf-starters">
              {STARTERS.map((s) => (
                <button key={s} onClick={() => ask(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`cf-msg cf-msg-${m.role}`}>
            {m.role === "assistant" && (
              <span className="cf-avatar">
                <Bot size={16} />
              </span>
            )}
            <div className="cf-bubble">
              {m.role === "assistant" ? <Formatted text={m.text} /> : <p>{m.text}</p>}
              {m.role === "assistant" && (
                <button className="cf-copy" onClick={() => copy(m.text, i)}>
                  {copied === i ? <Check size={13} /> : <Copy size={13} />} {copied === i ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="cf-msg cf-msg-assistant">
            <span className="cf-avatar">
              <Bot size={16} />
            </span>
            <div className="cf-bubble cf-typing">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && <p className="error">{error}</p>}

      <form
        className="cf-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              ask();
            }
          }}
          placeholder="Ask your co-founder… (Enter to send, Shift+Enter for a new line)"
          maxLength={4000}
        />
        <button className="btn btn-primary" disabled={thinking || !input.trim()}>
          {thinking ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}
