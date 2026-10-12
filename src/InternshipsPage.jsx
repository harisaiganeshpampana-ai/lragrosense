import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Sprout } from "lucide-react";
import {
  InternshipCard,
  InternshipsEmpty,
  InternshipsLoading,
  useInternships,
} from "./Internships";
import ApplyForm from "./ApplyForm";
import { CONTACT_EMAIL } from "./config";

export default function InternshipsPage() {
  const { items, status } = useInternships();
  const [applyingTo, setApplyingTo] = useState(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // Open the form automatically when coming from the homepage (?apply=ID)
  useEffect(() => {
    if (status !== "ready") return;
    const id = new URLSearchParams(window.location.search).get("apply");
    if (!id) return;
    const match = items.find((i) => i._id === id);
    if (match && !match.applyLink) setApplyingTo(match);
  }, [status, items]);

  const closeForm = () => {
    setApplyingTo(null);
    if (window.location.search) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const categories = useMemo(
    () => ["All", ...new Set(items.map((i) => i.category).filter(Boolean))],
    [items]
  );

  const filtered = items.filter((i) => {
    const inCategory = category === "All" || i.category === category;
    const text = `${i.title} ${i.category} ${i.description} ${(i.skills || []).join(" ")}`;
    return inCategory && text.toLowerCase().includes(query.trim().toLowerCase());
  });

  return (
    <div className="ipage">
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
          <a href="/" className="ipage-back">
            <ArrowLeft size={16} /> Back to website
          </a>
        </div>
      </header>

      <section className="ipage-hero">
        <div className="container">
          <span className="eyebrow eyebrow-light">Careers · Internships</span>
          <h1>Grow your career with LR AgroSense.</h1>
          <p>
            Work on real agriculture and technology problems with an early-stage
            startup. Pick a role below and apply in two minutes.
          </p>
          <div className="pills ipage-pills">
            <span>Remote-friendly</span>
            <span>Agriculture-focused</span>
            <span>Real projects</span>
          </div>
        </div>
      </section>

      <main className="section ipage-main">
        <div className="container">
          {status === "ready" && items.length > 0 && (
            <div className="ipage-tools">
              <div className="ipage-search">
                <Search size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search internships or skills"
                />
              </div>
              {categories.length > 2 && (
                <div className="ipage-filters">
                  {categories.map((c) => (
                    <button
                      key={c}
                      className={c === category ? "active" : ""}
                      onClick={() => setCategory(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {status === "ready" && items.length > 0 && (
            <p className="ipage-count">
              {filtered.length} open internship{filtered.length === 1 ? "" : "s"}
            </p>
          )}

          {status === "loading" && <InternshipsLoading />}
          {status !== "loading" && items.length === 0 && <InternshipsEmpty status={status} />}

          {items.length > 0 && filtered.length === 0 && (
            <div className="intern-empty">
              <h3>No internships match your search</h3>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Clear search
              </button>
            </div>
          )}

          {filtered.length > 0 && (
            <div className="intern-grid">
              {filtered.map((item) => (
                <InternshipCard key={item._id} item={item} onApply={setApplyingTo} />
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="ipage-foot">
        <div className="container">
          <span>© {new Date().getFullYear()} LR AgroSense</span>
          <span>
            Questions? <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </span>
        </div>
      </footer>

      {applyingTo && <ApplyForm internship={applyingTo} onClose={closeForm} />}
    </div>
  );
}
