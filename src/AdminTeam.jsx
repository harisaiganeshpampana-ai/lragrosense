import React, { useState } from "react";
import TeamPeople from "./TeamPeople";
import FieldReports from "./AdminFieldReports";
import TeamDailyUpdates from "./TeamDailyUpdates";

// Admin view of the intern program: manager logins, intern logins, reports and updates
export default function AdminTeam({ token, api, onAuthError }) {
  const [sub, setSub] = useState("managers"); // managers | interns | reports | updates
  const props = { token, api, onAuthError };
  return (
    <>
      <div className="pt-subtabs">
        {[
          ["managers", "Managers"],
          ["interns", "Interns"],
          ["reports", "Field reports"],
          ["updates", "Daily updates"],
        ].map(([key, label]) => (
          <button key={key} className={sub === key ? "on" : ""} onClick={() => setSub(key)}>
            {label}
          </button>
        ))}
      </div>
      {sub === "managers" && <TeamPeople role="manager" {...props} />}
      {sub === "interns" && <TeamPeople role="intern" {...props} />}
      {sub === "reports" && <FieldReports {...props} />}
      {sub === "updates" && <TeamDailyUpdates {...props} />}
    </>
  );
}
