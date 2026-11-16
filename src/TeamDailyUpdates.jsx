import React, { useEffect, useMemo, useState } from "react";
import { Check, Download, Loader2 } from "lucide-react";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export default function TeamDailyUpdates({ token, api, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [who, setWho] = useState("all");
  const [onlyNew, setOnlyNew] = useState(false);
  const [busyId, setBusyId] = useState("");

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  useEffect(() => {
    api("/api/team/daily-updates", { token })
      .then(setItems)
      .catch(handleError)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const names = useMemo(() => [...new Set(items.map((u) => u.internName))].sort(), [items]);
  const shown = items.filter((u) => (who === "all" || u.internName === who) && (!onlyNew || !u.seen));
  const unseen = items.filter((u) => !u.seen).length;

  const update = async (u, body) => {
    setBusyId(u._id);
    try {
      const updated = await api(`/api/team/daily-updates/${u._id}`, { token, method: "PUT", body });
      setItems((list) => list.map((x) => (x._id === u._id ? updated : x)));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const exportCsv = () => {
    const esc = (v) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = [
      ["Date", "Intern", "Hours", "Farmers met", "Work", "Learnings", "Problems", "Seen", "Review note"],
      ...shown.map((u) => [
        new Date(u.date).toLocaleDateString("en-IN"),
        u.internName,
        u.hours ?? "",
        u.farmersMet ?? "",
        u.work,
        u.learnings,
        u.blockers,
        u.seen ? "Yes" : "No",
        u.reviewNote,
      ]),
    ];
    const blob = new Blob(["﻿" + rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lr-agrosense-daily-updates-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Daily updates</h1>
          <p>
            {items.length} updates · {unseen} not seen yet
          </p>
        </div>
        <button className="btn btn-primary" onClick={exportCsv} disabled={!shown.length}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="fr-admin-filter pt-filters">
        <select className="filter-select" value={who} onChange={(e) => setWho(e.target.value)}>
          <option value="all">All interns</option>
          {names.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <label className="check">
          <input type="checkbox" checked={onlyNew} onChange={(e) => setOnlyNew(e.target.checked)} /> Only not seen
        </label>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="empty">
          <Loader2 className="spin" /> Loading…
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">No daily updates here yet.</div>
      ) : (
        <div className="list">
          {shown.map((u) => (
            <article key={u._id} className="app-card pt-update">
              <div className="pt-update-head">
                <div>
                  <strong>{u.internName}</strong>
                  <span>
                    {formatDate(u.date)}
                    {u.hours != null ? ` · ${u.hours} h` : ""}
                    {u.farmersMet != null ? ` · ${u.farmersMet} farmers` : ""}
                  </span>
                </div>
                <button
                  className={`btn ${u.seen ? "btn-light" : "btn-primary"}`}
                  disabled={busyId === u._id}
                  onClick={() => update(u, { seen: !u.seen })}
                >
                  <Check size={16} /> {u.seen ? "Seen" : "Mark seen"}
                </button>
              </div>
              <p className="pt-update-work">{u.work}</p>
              {u.learnings && (
                <p className="pt-update-extra">
                  <b>Learned:</b> {u.learnings}
                </p>
              )}
              {u.blockers && (
                <p className="pt-update-extra pt-blocker">
                  <b>Needs help:</b> {u.blockers}
                </p>
              )}
              <input
                className="pt-note"
                defaultValue={u.reviewNote}
                maxLength={500}
                placeholder="Reply / note to the intern (they will see it)"
                onBlur={(e) => {
                  if (e.target.value !== (u.reviewNote || "")) update(u, { reviewNote: e.target.value });
                }}
              />
            </article>
          ))}
        </div>
      )}
    </>
  );
}
