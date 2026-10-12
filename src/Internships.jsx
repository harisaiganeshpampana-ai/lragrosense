import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  Clock,
  GraduationCap,
  IndianRupee,
  Loader2,
  MapPin,
  Users,
} from "lucide-react";
import { API_BASE, CONTACT_EMAIL } from "./config";
import "./internships.css";

/* ---------------- Shared helpers ---------------- */

export function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Loads open internships from the server
export function useInternships() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 70000);

    fetch(`${API_BASE}/api/internships`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return { items, status };
}

export function InternshipsLoading() {
  return (
    <div className="intern-empty">
      <Loader2 size={26} className="intern-spin" />
      <p>Loading open internships…</p>
    </div>
  );
}

export function InternshipsEmpty({ status }) {
  return (
    <div className="intern-empty">
      <span className="intern-empty-icon">
        <GraduationCap size={26} />
      </span>
      <h3>
        {status === "error"
          ? "Internships couldn't load right now"
          : "No open internships right now"}
      </h3>
      <p>
        We post new roles regularly. You can still send us your interest and
        we'll reach out when something fits.
      </p>
      <a
        className="btn"
        href={`mailto:${CONTACT_EMAIL}?subject=Internship%20Interest%20-%20LR%20AgroSense`}
      >
        Send your interest <ArrowRight size={18} />
      </a>
    </div>
  );
}

/* ---------------- Card ---------------- */

// onApply(item) opens the form; if not given, Apply links to the internships page
export function InternshipCard({ item, onApply }) {
  const [expanded, setExpanded] = useState(false);
  const longText = (item.description || "").length > 220;

  const meta = [
    { icon: MapPin, text: [item.mode, item.location].filter(Boolean).join(" · ") },
    { icon: Clock, text: item.duration },
    { icon: IndianRupee, text: item.stipend },
    {
      icon: Users,
      text: item.openings ? `${item.openings} opening${item.openings > 1 ? "s" : ""}` : "",
    },
  ].filter((m) => m.text);

  let applyButton;
  if (item.applyLink) {
    applyButton = (
      <a className="btn btn-small" href={item.applyLink} target="_blank" rel="noreferrer">
        Apply <ArrowUpRight size={16} />
      </a>
    );
  } else if (onApply) {
    applyButton = (
      <button className="btn btn-small" onClick={() => onApply(item)}>
        Apply now <ArrowRight size={16} />
      </button>
    );
  } else {
    applyButton = (
      <a className="btn btn-small" href={`/internships.html?apply=${item._id}`}>
        Apply now <ArrowRight size={16} />
      </a>
    );
  }

  return (
    <article className="intern-card">
      <div className="intern-top">
        <span className="intern-icon">
          <Briefcase size={20} />
        </span>
        {item.category && <span className="badge">{item.category}</span>}
      </div>

      <h3>{item.title}</h3>

      <ul className="intern-meta">
        {meta.map(({ icon: Icon, text }) => (
          <li key={text}>
            <Icon size={15} /> {text}
          </li>
        ))}
      </ul>

      {item.description && (
        <p className={`intern-desc ${expanded ? "open" : ""}`}>{item.description}</p>
      )}
      {longText && (
        <button className="intern-more" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {item.skills?.length > 0 && (
        <div className="intern-skills">
          {item.skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      )}

      <div className="intern-foot">
        {item.deadline ? (
          <span className="intern-deadline">
            <CalendarDays size={15} /> Apply by {formatDate(item.deadline)}
          </span>
        ) : (
          <span className="intern-deadline">Rolling applications</span>
        )}
        {applyButton}
      </div>
    </article>
  );
}

/* ---------------- Homepage section (shows up to 3) ---------------- */

export default function Internships() {
  const { items, status } = useInternships();
  const preview = items.slice(0, 3);

  return (
    <section id="careers" className="section section-tint">
      <div className="container">
        <div className="intern-head">
          <div>
            <span className="eyebrow">Internships</span>
            <h2>Learn. Build. Contribute.</h2>
            <p>
              Hands-on startup experience in agriculture, technology, research,
              business and content.
            </p>
          </div>
          <a className="btn" href="/internships.html">
            View all internships <ArrowRight size={18} />
          </a>
        </div>

        {status === "loading" && <InternshipsLoading />}
        {status !== "loading" && items.length === 0 && <InternshipsEmpty status={status} />}

        {preview.length > 0 && (
          <div className="intern-grid">
            {preview.map((item) => (
              <InternshipCard key={item._id} item={item} />
            ))}
          </div>
        )}

        {items.length > 3 && (
          <div className="intern-more-row">
            <a className="btn btn-outline" href="/internships.html">
              See {items.length - 3} more internship{items.length - 3 > 1 ? "s" : ""}{" "}
              <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
