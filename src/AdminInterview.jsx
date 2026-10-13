import React, { useState } from "react";
import {
  Bot,
  Check,
  Copy,
  Loader2,
  Mail,
  MessageCircle,
  RefreshCw,
  Trash2,
  ChevronDown,
} from "lucide-react";
import "./admin-interview.css";

export const DEFAULT_INSTRUCTIONS =
  "Check: 1) Why they chose agriculture and this internship. 2) Can they talk politely to farmers in Telugu and explain why we are doing a survey? Give a situation: a farmer is busy and doesn't want to talk — what will they do? 3) What crops are grown in their area and one problem farmers there face. 4) Can they give about 8 hours a week for 6 weeks? 5) Honesty: what will they do if they could not finish the surveys on time? Be friendly — many students are nervous.";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function interviewLink(interview) {
  return `${window.location.origin}/interview.html?t=${interview.token}`;
}

function answeredCount(interview) {
  return (interview.messages || []).filter((m) => m.role === "candidate").length;
}

/* Small label shown on each application row */
export function InterviewBadge({ interview }) {
  if (!interview) return null;
  if (interview.status === "completed") {
    const score = interview.report?.score;
    return (
      <span className="ai-badge ai-badge-done">
        <Bot size={13} /> {score ? `AI ${score}/10` : "AI done"}
      </span>
    );
  }
  if (interview.status === "in_progress") {
    return (
      <span className="ai-badge ai-badge-progress">
        <Bot size={13} /> AI {answeredCount(interview)}/{interview.questionCount}
      </span>
    );
  }
  return (
    <span className="ai-badge">
      <Bot size={13} /> AI link sent
    </span>
  );
}

/* Panel inside an opened application */
export function InterviewPanel({ app, interview, internship, token, api, onChange, onAuthError }) {
  const [setupOpen, setSetupOpen] = useState(false);
  const [instructions, setInstructions] = useState(
    internship?.interviewInstructions || DEFAULT_INSTRUCTIONS
  );
  const [questionCount, setQuestionCount] = useState(internship?.interviewQuestions || 6);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fail = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const create = async () => {
    if (
      interview &&
      interview.status === "completed" &&
      !window.confirm("This student already finished an AI interview. Create a new one? The old report stays.")
    ) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      const created = await api(`/api/admin/applications/${app._id}/interview`, {
        token,
        method: "POST",
        body: { instructions, questionCount },
      });
      onChange(created);
      setSetupOpen(false);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const remakeReport = async () => {
    setBusy(true);
    setError("");
    try {
      onChange(await api(`/api/admin/interviews/${interview._id}/report`, { token, method: "POST" }));
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Delete this AI interview and its report?")) return;
    setBusy(true);
    setError("");
    try {
      await api(`/api/admin/interviews/${interview._id}`, { token, method: "DELETE" });
      onChange(null, interview._id);
    } catch (err) {
      fail(err);
    } finally {
      setBusy(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(interviewLink(interview));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link:", interviewLink(interview));
    }
  };

  const firstName = (app.name || "").split(" ")[0];
  const inviteText = interview
    ? `Hi ${firstName}, congratulations! You have been shortlisted for the ${app.internshipTitle} internship at LR AgroSense.\n\nPlease take your short AI voice interview (about 10–15 minutes). Open this link in Google Chrome, sit in a quiet place and answer by speaking:\n${interviewLink(
        interview
      )}\n\nThe link works until ${formatDate(interview.expiresAt)}.\n\n– Team LR AgroSense`
    : "";
  const phone = (app.phone || "").replace(/\D/g, "").replace(/^(\d{10})$/, "91$1");

  /* Setup form (your commands for the AI) */
  if (!interview || setupOpen) {
    return (
      <div className="ai-panel">
        <div className="ai-panel-head">
          <Bot size={18} />
          <strong>AI voice interview</strong>
        </div>
        {!setupOpen ? (
          <>
            <p className="ai-muted">
              Shortlisted this student? Create an AI interview link and send it to them on
              WhatsApp or email. You'll see the score and report here when they finish.
            </p>
            <button className="btn btn-primary" onClick={() => setSetupOpen(true)}>
              <Bot size={16} /> Set up AI interview
            </button>
          </>
        ) : (
          <>
            <label className="field">
              <span>Your instructions for the AI (what to ask and what to check)</span>
              <textarea
                rows={6}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                maxLength={4000}
              />
            </label>
            <label className="field ai-small-field">
              <span>Number of questions</span>
              <input
                type="number"
                min="3"
                max="15"
                value={questionCount}
                onChange={(e) => setQuestionCount(e.target.value)}
              />
            </label>
            <div className="ai-row">
              <button className="btn btn-light" onClick={() => setSetupOpen(false)} disabled={busy}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={create} disabled={busy}>
                {busy ? <Loader2 size={16} className="spin" /> : <Bot size={16} />}
                {busy ? "Creating…" : "Create interview link"}
              </button>
            </div>
          </>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  /* Finished: show report */
  if (interview.status === "completed") {
    const report = interview.report;
    return (
      <div className="ai-panel">
        <div className="ai-panel-head">
          <Bot size={18} />
          <strong>AI interview report</strong>
          <span className="ai-muted ai-date">Finished {formatDate(interview.completedAt)}</span>
        </div>

        {report ? (
          <div className="ai-report">
            <div className="ai-score">
              <b>{report.score}</b>
              <span>/10</span>
            </div>
            <div className="ai-report-main">
              <span className={`ai-reco ai-reco-${(report.recommendation || "").replace(/\s/g, "-").toLowerCase()}`}>
                {report.recommendation}
              </span>
              <p>{report.summary}</p>
            </div>
          </div>
        ) : (
          <p className="error">{interview.reportError || "The report is being made. Refresh in a minute."}</p>
        )}

        {report && (report.strengths?.length > 0 || report.concerns?.length > 0) && (
          <div className="ai-lists">
            {report.strengths?.length > 0 && (
              <div>
                <h4>Strengths</h4>
                <ul>
                  {report.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {report.concerns?.length > 0 && (
              <div>
                <h4>Concerns</h4>
                <ul>
                  {report.concerns.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <button className="ai-toggle" onClick={() => setShowChat(!showChat)}>
          <ChevronDown size={16} className={showChat ? "open" : ""} />
          {showChat ? "Hide" : "Read"} full interview ({answeredCount(interview)} answers)
        </button>
        {showChat && <Transcript interview={interview} name={firstName} />}

        <p className="ai-muted ai-note">
          The AI report is a helper. Please read the answers and make the final decision yourself.
        </p>

        <div className="ai-row">
          {!report && (
            <button className="btn btn-light" onClick={remakeReport} disabled={busy}>
              <RefreshCw size={16} className={busy ? "spin" : ""} /> Make report again
            </button>
          )}
          <button className="btn btn-light" onClick={() => setSetupOpen(true)} disabled={busy}>
            <Bot size={16} /> New interview
          </button>
          <button className="btn btn-light ai-danger" onClick={remove} disabled={busy}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  /* Link created, waiting for the student */
  const expired = new Date(interview.expiresAt) < new Date();
  return (
    <div className="ai-panel">
      <div className="ai-panel-head">
        <Bot size={18} />
        <strong>AI voice interview</strong>
        <span className={`ai-state ${interview.status === "in_progress" ? "ai-state-live" : ""}`}>
          {expired
            ? "Link expired"
            : interview.status === "in_progress"
            ? `In progress · ${answeredCount(interview)}/${interview.questionCount} answered`
            : "Waiting for student"}
        </span>
      </div>

      <div className="ai-link">
        <code>{interviewLink(interview)}</code>
        <button className="btn btn-light" onClick={copy}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="ai-muted">
        {expired ? "Expired on" : "Link works until"} {formatDate(interview.expiresAt)} ·{" "}
        {interview.questionCount} questions
      </p>

      <div className="ai-row">
        <a
          className="btn btn-primary"
          href={`https://wa.me/${phone}?text=${encodeURIComponent(inviteText)}`}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={16} /> Send on WhatsApp
        </a>
        <a
          className="btn btn-light"
          href={`mailto:${app.email}?subject=${encodeURIComponent(
            `Your AI interview – ${app.internshipTitle} at LR AgroSense`
          )}&body=${encodeURIComponent(inviteText)}`}
        >
          <Mail size={16} /> Send email
        </a>
        <button className="btn btn-light" onClick={() => setSetupOpen(true)} disabled={busy}>
          <RefreshCw size={16} /> New link
        </button>
        <button className="btn btn-light ai-danger" onClick={remove} disabled={busy}>
          <Trash2 size={16} /> Delete
        </button>
      </div>

      {interview.messages?.length > 0 && (
        <>
          <button className="ai-toggle" onClick={() => setShowChat(!showChat)}>
            <ChevronDown size={16} className={showChat ? "open" : ""} />
            {showChat ? "Hide" : "See"} answers so far
          </button>
          {showChat && <Transcript interview={interview} name={firstName} />}
        </>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

function Transcript({ interview, name }) {
  return (
    <div className="ai-chat">
      {(interview.messages || []).map((m, i) => (
        <div key={i} className={`ai-msg ai-msg-${m.role}`}>
          <span>{m.role === "ai" ? "AI interviewer" : name || "Student"}</span>
          <p>{m.text}</p>
        </div>
      ))}
    </div>
  );
}
