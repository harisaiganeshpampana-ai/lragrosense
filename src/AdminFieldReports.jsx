import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Download, ExternalLink, Image, Loader2, MapPin, Trash2 } from "lucide-react";
import { API_BASE } from "./config";

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateTime(value) {
  if (!value) return "";
  return new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

const CSV_COLUMNS = [
  ["Submitted", (r) => formatDateTime(r.createdAt)],
  ["Status", (r) => r.status],
  ["Intern", (r) => r.internName],
  ["Intern phone", (r) => r.internPhone],
  ["College", (r) => r.internCollege],
  ["Visit date", (r) => formatDate(r.visitDate)],
  ["Farmer", (r) => r.farmerName],
  ["Farmer phone", (r) => r.farmerPhone],
  ["Village", (r) => r.village],
  ["Mandal", (r) => r.mandal],
  ["District", (r) => r.district],
  ["Crops", (r) => r.crops],
  ["Land (acres)", (r) => r.landAcres ?? ""],
  ["Water source", (r) => r.waterSource],
  ["Irrigation", (r) => r.irrigationMethod],
  ["Pump type", (r) => r.pumpType],
  ["Pump HP", (r) => r.pumpHP ?? ""],
  ["Farmer phone type", (r) => r.phoneType],
  ["Problems", (r) => (r.problems || []).join("; ")],
  ["Other problems", (r) => r.otherProblems],
  ["Biggest problem", (r) => r.biggestProblem],
  ["Would use device", (r) => r.interest],
  ["Would pay", (r) => r.priceRange],
  ["Notes", (r) => r.notes],
  ["Photo taken", (r) => formatDateTime(r.photoTakenAt)],
  ["Latitude", (r) => r.lat ?? ""],
  ["Longitude", (r) => r.lng ?? ""],
  ["Review note", (r) => r.reviewNote],
];

function toCsv(rows) {
  const esc = (v) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = CSV_COLUMNS.map(([h]) => esc(h)).join(",");
  const body = rows.map((r) => CSV_COLUMNS.map(([, get]) => esc(get(r))).join(","));
  return "﻿" + [head, ...body].join("\n");
}

// Flags that help spot reports that may not be genuine
function warnings(r, all) {
  const list = [];
  if (r.photoTakenAt && r.visitDate) {
    const days = Math.abs(new Date(r.photoTakenAt) - new Date(r.visitDate)) / 86400000;
    if (days > 2) list.push("Photo date doesn't match visit date");
  }
  const sameFarmer = all.filter(
    (x) =>
      x._id !== r._id &&
      x.farmerName.trim().toLowerCase() === r.farmerName.trim().toLowerCase() &&
      x.village.trim().toLowerCase() === r.village.trim().toLowerCase()
  );
  if (sameFarmer.length) list.push("Same farmer & village reported before");
  return list;
}

export default function FieldReports({ token, api, onAuthError }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openId, setOpenId] = useState("");
  const [busyId, setBusyId] = useState("");
  const [photos, setPhotos] = useState({}); // id -> object URL

  const handleError = (err) => {
    if (err.status === 401) onAuthError();
    else setError(err.message);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await api("/api/team/field-reports", { token }));
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    return () => Object.values(photos).forEach((u) => URL.revokeObjectURL(u));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPhoto = async (r) => {
    if (photos[r._id]) return;
    try {
      const response = await fetch(`${API_BASE}/api/team/field-reports/${r._id}/photo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 401) return onAuthError();
      if (!response.ok) throw new Error("Could not load the photo.");
      const url = URL.createObjectURL(await response.blob());
      setPhotos((p) => ({ ...p, [r._id]: url }));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = (r) => {
    const next = openId === r._id ? "" : r._id;
    setOpenId(next);
    if (next) loadPhoto(r);
  };

  const update = async (r, body) => {
    setBusyId(r._id);
    try {
      const updated = await api(`/api/team/field-reports/${r._id}`, { token, method: "PUT", body });
      setItems((list) => list.map((x) => (x._id === r._id ? updated : x)));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete the report for ${r.farmerName} (${r.village})? This cannot be undone.`)) return;
    setBusyId(r._id);
    try {
      await api(`/api/team/field-reports/${r._id}`, { token, method: "DELETE" });
      setItems((list) => list.filter((x) => x._id !== r._id));
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId("");
    }
  };

  const shown = items.filter((r) => statusFilter === "all" || r.status === statusFilter);

  const stats = useMemo(() => {
    const counts = {};
    items.forEach((r) => (r.problems || []).forEach((p) => (counts[p] = (counts[p] || 0) + 1)));
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const interns = new Set(items.map((r) => r.internPhone)).size;
    const yes = items.filter((r) => r.interest === "Yes").length;
    const maybe = items.filter((r) => r.interest === "Maybe").length;
    return { top, interns, yes, maybe };
  }, [items]);

  const exportCsv = () => {
    const blob = new Blob([toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lr-agrosense-field-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  };

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Field reports</h1>
          <p>
            {items.length} farmer visits · {stats.interns} interns · {stats.yes} would use it · {stats.maybe} maybe
          </p>
        </div>
        <div className="row-actions">
          <a className="btn btn-light" href="/intern.html" target="_blank" rel="noreferrer">
            <ExternalLink size={16} /> Intern portal
          </a>
          <button className="btn btn-primary" onClick={exportCsv} disabled={!shown.length}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {stats.top.length > 0 && (
        <div className="fr-admin-top">
          <strong>Top problems:</strong>
          {stats.top.map(([p, n]) => (
            <span key={p} className="fr-admin-chip">
              {p} · {n}
            </span>
          ))}
        </div>
      )}

      <div className="fr-admin-filter">
        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All reports</option>
          <option value="new">New (not checked)</option>
          <option value="verified">Verified</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="empty">
          <Loader2 className="spin" /> Loading reports…
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">
          No field reports yet. Add interns in the Interns tab and share <b>lragrosense.in/intern.html</b> with them.
        </div>
      ) : (
        <div className="list">
          {shown.map((r) => {
            const open = openId === r._id;
            const warn = warnings(r, items);
            return (
              <article key={r._id} className="app-card">
                <div className="app-top">
                  <button className="app-summary" onClick={() => toggle(r)}>
                    <span className="app-avatar">{(r.farmerName || "?").charAt(0).toUpperCase()}</span>
                    <span className="app-who">
                      <strong>
                        {r.farmerName} · {r.village}
                      </strong>
                      <span>
                        {r.crops} · by {r.internName} · {formatDate(r.visitDate)}
                        {warn.length > 0 && <em className="fr-admin-warn"> · ⚠ check</em>}
                      </span>
                    </span>
                    <ChevronDown size={18} className="app-chevron" style={{ transform: open ? "rotate(180deg)" : "" }} />
                  </button>
                  <div className="app-controls">
                    <select
                      className={`status-select status-${r.status === "verified" ? "selected" : r.status}`}
                      value={r.status}
                      disabled={busyId === r._id}
                      onChange={(e) => update(r, { status: e.target.value })}
                    >
                      <option value="new">New</option>
                      <option value="verified">Verified</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button className="icon-btn icon-danger" title="Delete" onClick={() => remove(r)} disabled={busyId === r._id}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="app-details fr-admin-details">
                    {warn.length > 0 && (
                      <div className="fr-admin-warnbox">⚠ {warn.join(" · ")}</div>
                    )}
                    <div className="fr-admin-cols">
                      <div className="fr-admin-photo">
                        {photos[r._id] ? (
                          <a href={photos[r._id]} target="_blank" rel="noreferrer">
                            <img src={photos[r._id]} alt={`Visit with ${r.farmerName}`} />
                          </a>
                        ) : (
                          <div className="fr-admin-nophoto">
                            <Image size={20} /> Loading photo…
                          </div>
                        )}
                        <small>
                          Photo time: {r.photoTakenAt ? formatDateTime(r.photoTakenAt) : "unknown"}
                          {r.lat != null && (
                            <>
                              {" · "}
                              <a href={`https://maps.google.com/?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer">
                                <MapPin size={12} /> map
                              </a>
                            </>
                          )}
                        </small>
                      </div>
                      <dl className="app-info">
                        <dt>Farmer</dt>
                        <dd>
                          {r.farmerName}
                          {r.farmerPhone ? ` · ${r.farmerPhone}` : ""}
                          {r.phoneType ? ` · ${r.phoneType}` : ""}
                        </dd>
                        <dt>Place</dt>
                        <dd>{[r.village, r.mandal, r.district].filter(Boolean).join(", ")}</dd>
                        <dt>Farm</dt>
                        <dd>
                          {r.crops}
                          {r.landAcres != null ? ` · ${r.landAcres} acres` : ""}
                        </dd>
                        <dt>Water</dt>
                        <dd>
                          {[r.waterSource, r.irrigationMethod, r.pumpType, r.pumpHP != null ? `${r.pumpHP} HP` : ""]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </dd>
                        <dt>Problems</dt>
                        <dd>{(r.problems || []).join(", ") || "—"}</dd>
                        {r.otherProblems && (
                          <>
                            <dt>Other</dt>
                            <dd>{r.otherProblems}</dd>
                          </>
                        )}
                        <dt>Biggest problem</dt>
                        <dd>{r.biggestProblem}</dd>
                        <dt>Interest</dt>
                        <dd>
                          {r.interest || "—"}
                          {r.priceRange ? ` · pay: ${r.priceRange}` : ""}
                        </dd>
                        {r.notes && (
                          <>
                            <dt>Notes</dt>
                            <dd>{r.notes}</dd>
                          </>
                        )}
                        <dt>Intern</dt>
                        <dd>
                          {r.internName} · {r.internPhone}
                          {r.internCollege ? ` · ${r.internCollege}` : ""}
                        </dd>
                        <dt>Submitted</dt>
                        <dd>{formatDateTime(r.createdAt)}</dd>
                      </dl>
                    </div>
                    <label className="field fr-admin-note">
                      Note to the intern (they will see it in their portal)
                      <input
                        defaultValue={r.reviewNote}
                        maxLength={500}
                        placeholder="e.g. Photo is blurry, please submit again"
                        onBlur={(e) => {
                          if (e.target.value !== (r.reviewNote || "")) update(r, { reviewNote: e.target.value });
                        }}
                      />
                    </label>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
