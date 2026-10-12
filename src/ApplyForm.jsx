import React, { useEffect, useState } from "react";
import { CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { API_BASE } from "./config";
import { formatDate } from "./Internships";
import "./upload.css";

const MAX_RESUME_MB = 2;
const RESUME_EXTENSIONS = ["pdf", "doc", "docx"];

// Turns the chosen file into text so it can be sent to the server
function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

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
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    setFileError("");
    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();
    if (!RESUME_EXTENSIONS.includes(ext)) {
      setFileError("Please choose a PDF or Word file (.pdf, .doc, .docx).");
      return;
    }
    if (file.size > MAX_RESUME_MB * 1024 * 1024) {
      setFileError(`File is too big. Please choose a file under ${MAX_RESUME_MB} MB.`);
      return;
    }
    setResumeFile(file);
  };

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
      const payload = { ...form, internshipId: internship._id };
      if (resumeFile) {
        payload.resumeFile = {
          name: resumeFile.name,
          data: await readFileAsBase64(resumeFile),
        };
      }
      let response;
      try {
        response = await fetch(`${API_BASE}/api/applications`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
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

              <div className="apply-field">
                <span>Resume</span>
                {resumeFile ? (
                  <div className="upload-chosen">
                    <FileText size={20} />
                    <div>
                      <strong>{resumeFile.name}</strong>
                      <small>{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</small>
                    </div>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      aria-label="Remove file"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-box">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={pickFile}
                    />
                    <Upload size={22} />
                    <strong>Upload your resume</strong>
                    <small>PDF or Word · up to {MAX_RESUME_MB} MB</small>
                  </label>
                )}
                {fileError && <small className="upload-error">{fileError}</small>}
              </div>

              <Field label="Or paste a resume link (Google Drive, etc.)">
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

              <p className="apply-consent">
                By submitting, you confirm you are 18 or older and agree to our{" "}
                <a href="/privacy.html" target="_blank" rel="noreferrer">
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a href="/terms.html" target="_blank" rel="noreferrer">
                  Terms &amp; Conditions
                </a>
                . We never charge any fee for internships.
              </p>

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
