import React, { useEffect, useState } from "react";
import { FileText, Image as ImageIcon, Loader2, Search } from "lucide-react";
import { fileSizeLabel, portalFileUrl } from "./portalApi";
import { timeLabel } from "./TeamChat";

// Every PDF and image shared in the group chat or in your direct chats
export default function TeamFiles({ token, api, onAuthError }) {
  const [files, setFiles] = useState([]);
  const [people, setPeople] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");

  useEffect(() => {
    Promise.all([api("/api/workspace/files", { token }), api("/api/workspace/people", { token })])
      .then(([list, p]) => {
        setFiles(list);
        setPeople(p.people);
        setMe(p.me);
      })
      .catch((err) => (err.status === 401 ? onAuthError() : setError(err.message)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const where = (f) => {
    if (f.channel === "team") return "Group chat";
    const other = f.channel.slice(3).split(":").find((id) => id !== me?.id);
    return `Chat with ${people.find((p) => p.id === other)?.name || "a past member"}`;
  };

  const open = async (f) => {
    try {
      window.open(await portalFileUrl(String(f._id), token), "_blank", "noopener");
    } catch (err) {
      if (err.status === 401) onAuthError();
      else setError(err.message);
    }
  };

  const shown = files.filter((f) => {
    if (kind === "pdf" && f.contentType !== "application/pdf") return false;
    if (kind === "image" && !f.contentType.startsWith("image/")) return false;
    return !q || f.name.toLowerCase().includes(q.toLowerCase());
  });

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Files</h1>
          <p>PDFs and images shared with you · to share a file, use the 📎 button in a chat</p>
        </div>
      </div>
      <div className="fr-admin-filter pt-filters">
        <label className="tf-search">
          <Search size={16} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search file name" />
        </label>
        <select className="filter-select" value={kind} onChange={(e) => setKind(e.target.value)}>
          <option value="all">All files</option>
          <option value="pdf">PDFs</option>
          <option value="image">Images</option>
        </select>
      </div>
      {error && <div className="error-box">{error}</div>}
      {loading ? (
        <div className="empty">
          <Loader2 className="spin" /> Loading files…
        </div>
      ) : shown.length === 0 ? (
        <div className="empty">{files.length ? "No files match." : "No files shared yet."}</div>
      ) : (
        <div className="tf-list">
          {shown.map((f) => (
            <button key={f._id} className="tf-item" onClick={() => open(f)}>
              {f.contentType === "application/pdf" ? <FileText size={22} /> : <ImageIcon size={22} />}
              <span className="tf-name">
                <strong>{f.name}</strong>
                <small>
                  {f.uploadedByName} · {where(f)} · {timeLabel(f.createdAt)} · {fileSizeLabel(f.size)}
                </small>
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
