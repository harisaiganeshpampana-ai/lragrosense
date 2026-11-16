import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Sprout } from "lucide-react";
import { portalApi } from "./portalApi";

// Email + password login used by both the intern portal and the team portal
export default function PortalLogin({ title, subtitle, allowedRoles, onLogin, wrongRoleMessage, portal }) {
  const portalName = portal || (allowedRoles.includes("intern") ? "intern" : allowedRoles.includes("manager") && !allowedRoles.includes("member") ? "manager" : "team");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const data = await portalApi("/api/portal/login", {
        method: "POST",
        body: { email: email.trim(), password, portal: portalName },
      });
      if (!allowedRoles.includes(data.user.role)) {
        throw new Error(
          wrongRoleMessage ||
          (allowedRoles.includes("intern")
            ? "This login is for the team portal. Please use lragrosense.in/team.html."
            : "This login is for interns. Please use lragrosense.in/intern.html.")
        );
      }
      onLogin({ token: data.token, user: data.user });
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
            <span>{title}</span>
          </div>
        </div>
        <p className="pt-login-sub">{subtitle}</p>

        <label className="fr-field">
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@gmail.com"
          />
        </label>
        <label className="fr-field">
          Password
          <div className="pt-pass">
            <input
              type={show ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
            <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {error && <div className="fr-error">{error}</div>}

        <button className="fr-btn fr-btn-primary fr-submit" disabled={busy}>
          {busy ? <Loader2 size={18} className="spin" /> : null} Log in
        </button>
        <p className="fr-foot">Forgot your password? Ask Hari for a new link.</p>
      </form>
    </div>
  );
}
