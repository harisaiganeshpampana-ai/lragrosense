import React, { useEffect, useState } from "react";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { API_BASE } from "./config";
import { formatDate } from "./Internships";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  college: "",
  course: "",
  year: "",
  city: "",
  resumeLink: "",
  linkedin: "",
  message: "",
  website: "", // hidden spam trap — real people never see or fill this
};

export default function ApplyForm({ internship, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      let response;
      try {
        response = await fetch(`${API_BASE}/api/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, internshipId: internship._id }),
        });
      } catch {
        throw new Error(
          "Could not reach the server. Please check your internet and try again in a minute."
        );
      }
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="apply-backdrop" onMouseDown={onClose}>
      <div
        className="apply-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Apply for ${internship.title}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="apply-head">
          <div>
            <span className="apply-kicker">Apply for</span>
            <h2>{internship.title}</h2>
            <p>
              {[
                internship.mode,
                internship.duration,
                internship.stipend,
                internship.deadline ? `Apply by ${formatDate(internship.deadline)}` : "",
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <button className="apply-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="apply-done">
            <CheckCircle2 size={52} />
            <h3>Application submitted!</h3>
            <p>
              Thank you, {form.name.split(" ")[0]}. We've received your application
              and will contact you at <b>{form.email}</b> if you're shortlisted.
            </p>
            <button className="btn" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <form className="apply-form" onSubmit={submit}>
            <div className="apply-body">
              <div className="apply-grid">
                <Field label="Full name" required>
                  <input value={form.name} onChange={set("name")} required maxLength={100} />
                </Field>
                <Field label="Email" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    required
                    maxLength={120}
                  />
                </Field>
                <Field label="Phone / WhatsApp" required>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={set("phone")}
                    placeholder="+91"
                    required
                    maxLength={20}
                  />
                </Field>
                <Field label="City">
                  <input value={form.city} onChange={set("city")} maxLength={80} />
                </Field>
              </div>

              <Field label="College / University" required>
                <input value={form.college} onChange={set("college")} required maxLength={150} />
              </Field>

              <div className="apply-grid">
                <Field label="Course">
                  <input
                    value={form.course}
                    onChange={set("course")}
                    placeholder="e.g. B.Sc. Agriculture"
                    maxLength={100}
                  />
                </Field>
                <Field label="Year of study">
                  <select value={form.year} onChange={set("year")}>
                    <option value="">Select</option>
                    <option>1st year</option>
                    <option>2nd year</option>
                    <option>3rd year</option>
                    <option>4th year</option>
                    <option>Postgraduate</option>
                    <option>Graduated</option>
                  </select>
                </Field>
              </div>

              <Field
                label="Resume link"
                hint="Upload your resume to Google Drive, set sharing to “Anyone with the link”, and paste the link here."
              >
                <input
                  type="url"
                  value={form.resumeLink}
                  onChange={set("resumeLink")}
                  placeholder="https://drive.google.com/…"
                  maxLength={500}
                />
              </Field>

              <Field label="LinkedIn profile">
                <input
                  type="url"
                  value={form.linkedin}
                  onChange={set("linkedin")}
                  placeholder="https://linkedin.com/in/…"
                  maxLength={300}
                />
              </Field>

              <Field label="Why do you want to join this internship?">
                <textarea
                  rows={4}
                  value={form.message}
                  onChange={set("message")}
                  maxLength={2000}
                />
              </Field>

              {/* Spam trap: hidden from people */}
              <input
                className="apply-trap"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={set("website")}
                aria-hidden="true"
              />

              {error && <p className="apply-error">{error}</p>}
            </div>

            <div className="apply-foot">
              <button type="button" className="btn btn-outline" onClick={onClose}>
                Cancel
              </button>
              <button className="btn" disabled={sending}>
                {sending && <Loader2 size={18} className="intern-spin-light" />}
                {sending ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, required, hint, children }) {
  return (
    <label className="apply-field">
      <span>
        {label}
        {required && <em> *</em>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
