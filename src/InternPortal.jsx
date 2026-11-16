import React, { useEffect, useState } from "react";
import { CalendarCheck, CheckCircle2, ClipboardList, Loader2, LogOut, Sprout, Tractor } from "lucide-react";
import FieldVisitForm from "./FieldVisitForm";
import PortalLogin from "./PortalLogin";
import { formatDate, portalApi, readSession, saveSession, todayISO } from "./portalApi";

const SESSION_KEY = "lr_intern_session";

export default function InternPortal() {
  const [session, setSession] = useState(() => readSession(SESSION_KEY));
  const [tab, setTab] = useState("visit"); // visit | daily | mine

  const logout = () => {
    saveSession(SESSION_KEY, null);
    setSession(null);
  };

  // Check the saved login is still valid (password reset or login turned off)
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
      <PortalLogin
        title="Intern portal"
        subtitle="Log in with the email and password LR AgroSense sent you, then submit your daily work."
        allowedRoles={["intern"]}
        onLogin={(s) => {
          saveSession(SESSION_KEY, s);
          setSession(s);
        }}
      />
    );
  }

  const { token, user } = session;

  return (
    <div className="ipage fr-page">
      <header className="ipage-bar">
        <div className="container ipage-bar-inner">
          <a href="/" className="brand">
            <span className="brand-mark">
              <Sprout size={18} strokeWidth={2.4} />
            </span>
            <span className="brand-name">
              LR <b>AgroSense</b>
            </span>
          </a>
          <button className="ipage-back pt-logout" onClick={logout}>
            <LogOut size={16} /> Log out
          </button>
        </div>
      </header>

      <section className="fr-hero pt-hero">
        <div className="container fr-narrow">
          <span className="eyebrow eyebrow-light">Intern portal</span>
          <h1>Hi, {user.name.split(" ")[0]} 👋</h1>
          <p>Submit a report for each farmer you meet, and a short update for each day you work.</p>
        </div>
      </section>

      <main className="container fr-narrow fr-main">
        <div className="pt-tabs">
          <button className={tab === "visit" ? "on" : ""} onClick={() => setTab("visit")}>
            <Tractor size={16} /> Farmer visit
          </button>
          <button className={tab === "daily" ? "on" : ""} onClick={() => setTab("daily")}>
            <CalendarCheck size={16} /> Daily update
          </button>
          <button className={tab === "mine" ? "on" : ""} onClick={() => setTab("mine")}>
            <ClipboardList size={16} /> My work
          </button>
        </div>

        {tab === "visit" && <FieldVisitForm token={token} onAuthError={logout} />}
        {tab === "daily" && <DailyUpdateForm token={token} onAuthError={logout} />}
        {tab === "mine" && <MyWork token={token} onAuthError={logout} />}
      </main>
    </div>
  );
}

function DailyUpdateForm({ token, onAuthError }) {
  const empty = { date: todayISO(), hours: "", farmersMet: "", work: "", learnings: "", blockers: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await portalApi("/api/intern/daily-updates", { token, method: "POST", body: form });
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="fr-card fr-done">
        <CheckCircle2 size={48} />
        <h2>Daily update saved. Thank you!</h2>
        <p>Your team lead will see it today.</p>
        <button
          className="fr-btn fr-btn-primary"
          onClick={() => {
            setForm(empty);
            setDone(false);
          }}
        >
          Add another update
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit}>
      <section className="fr-card">
        <h2>
          <span>✓</span> Today's work
        </h2>
        <div className="fr-grid">
          <label className="fr-field">
            Date *
            <input required type="date" max={todayISO()} value={form.date} onChange={set("date")} />
          </label>
          <label className="fr-field">
            Hours worked
            <input type="number" inputMode="decimal" min="0" max="24" step="0.5" value={form.hours} onChange={set("hours")} />
          </label>
          <label className="fr-field">
            Farmers met today
            <input type="number" inputMode="numeric" min="0" max="200" value={form.farmersMet} onChange={set("farmersMet")} />
          </label>
        </div>
        <label className="fr-field">
          What did you do today? *
          <textarea
            required
            rows={4}
            maxLength={3000}
            placeholder="e.g. Visited 3 farmers in Pedavegi, submitted reports, researched drip irrigation costs"
            value={form.work}
            onChange={set("work")}
          />
        </label>
        <label className="fr-field">
          What did you learn?
          <textarea rows={2} maxLength={2000} value={form.learnings} onChange={set("learnings")} />
        </label>
        <label className="fr-field">
          Any problems or help needed?
          <textarea rows={2} maxLength={2000} value={form.blockers} onChange={set("blockers")} />
        </label>
      </section>

      {error && <div className="fr-error">{error}</div>}

      <button className="fr-btn fr-btn-primary fr-submit" disabled={busy}>
        {busy ? (
          <>
            <Loader2 size={18} className="spin" /> Saving…
          </>
        ) : (
          "Submit daily update"
        )}
      </button>
    </form>
  );
}

const STATUS_LABEL = { new: "Waiting for review", verified: "Verified ✓", rejected: "Not accepted" };

function MyWork({ token, onAuthError }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    portalApi("/api/intern/submissions", { token })
      .then(setData)
      .catch((err) => {
        if (err.status === 401) onAuthError();
        else setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) return <div className="fr-error">{error}</div>;
  if (!data) {
    return (
      <div className="fr-card pt-empty">
        <Loader2 className="spin" /> Loading your work…
      </div>
    );
  }

  const verified = data.reports.filter((r) => r.status === "verified").length;

  return (
    <>
      <div className="pt-stats">
        <div>
          <strong>{data.reports.length}</strong>
          <span>Farmer visits</span>
        </div>
        <div>
          <strong>{verified}</strong>
          <span>Verified</span>
        </div>
        <div>
          <strong>{data.updates.length}</strong>
          <span>Daily updates</span>
        </div>
      </div>

      <section className="fr-card">
        <h2>
          <span>{data.reports.length}</span> Farmer visits
        </h2>
        {data.reports.length === 0 ? (
          <p className="fr-hint">No visits yet. Use the "Farmer visit" tab after meeting a farmer.</p>
        ) : (
          <ul className="pt-list">
            {data.reports.map((r) => (
              <li key={r._id}>
                <div>
                  <strong>
                    {r.farmerName} · {r.village}
                  </strong>
                  <span>
                    {r.crops} · {formatDate(r.visitDate)}
                  </span>
                  {r.reviewNote && <em>Note from team lead: {r.reviewNote}</em>}
                </div>
                <b className={`pt-badge pt-${r.status}`}>{STATUS_LABEL[r.status] || r.status}</b>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="fr-card">
        <h2>
          <span>{data.updates.length}</span> Daily updates
        </h2>
        {data.updates.length === 0 ? (
          <p className="fr-hint">No updates yet.</p>
        ) : (
          <ul className="pt-list">
            {data.updates.map((u) => (
              <li key={u._id}>
                <div>
                  <strong>
                    {formatDate(u.date)}
                    {u.hours != null ? ` · ${u.hours} h` : ""}
                  </strong>
                  <span>{u.work}</span>
                  {u.reviewNote && <em>Note from team lead: {u.reviewNote}</em>}
                </div>
                {u.seen && <b className="pt-badge pt-verified">Seen</b>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
