import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Sprout } from "lucide-react";
import { portalApi } from "./portalApi";

// Opened from the invite link: the person sets their own password
export default function InviteSetup({ token, onDone, onCancel }) {
  const [info, setInfo] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [bad, setBad] = useState("");

  useEffect(() => {
    portalApi(`/api/portal/invite/${encodeURIComponent(token)}`)
      .then((d) => {
        setInfo(d);
        setName(d.name || "");
      })
      .catch((err) => setBad(err.message));
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      const data = await portalApi(`/api/portal/invite/${encodeURIComponent(token)}`, {
        method: "POST",
        body: { password, name: name.trim() },
      });
      onDone({ token: data.token, user: data.user });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-login">
      <form className="pt-login-card" onSubmit={submit}>
        <div className="pt-login-brand">
          <span className="brand-mark">
            <Sprout size={18} />
          </span>
          <div>
            <strong>LR AgroSense</strong>
            <span>Join the team</span>
          </div>
        </div>

        {bad ? (
          <>
            <div className="fr-error">{bad}</div>
            <button type="button" className="fr-btn fr-submit" onClick={onCancel}>
              Go to login
            </button>
          </>
        ) : !info ? (
          <div className="empty">
            <Loader2 className="spin" /> Checking your invite…
          </div>
        ) : (
          <>
            <p className="pt-login-sub">
              Welcome! Set your own password for <b>{info.email}</b>. You'll use it to log in next time.
            </p>
            <label className="fr-field">
              Your name
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} required />
            </label>
            <label className="fr-field">
              New password (at least 8 characters)
              <div className="pt-pass">
                <input
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>
            <label className="fr-field">
              Type it again
              <input type={show ? "text" : "password"} autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
            {error && <div className="fr-error">{error}</div>}
            <button className="fr-btn fr-btn-primary fr-submit" disabled={busy}>
              {busy ? <Loader2 size={16} className="spin" /> : null} Set password and join
            </button>
          </>
        )}
      </form>
    </div>
  );
}
