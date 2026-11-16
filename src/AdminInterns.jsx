import React, { useState } from "react";
import TeamPeople from "./TeamPeople";
import FieldReports from "./AdminFieldReports";
import TeamDailyUpdates from "./TeamDailyUpdates";
import TeamMembers from "./TeamMembers";

// Admin view of the intern program (the same things managers see in the manager portal)
export default function AdminInterns({ token, api, onAuthError }) {
  const [sub, setSub] = useState("reports");
  const props = { token, api, onAuthError };
  return (
    <>
      <div className="pt-subtabs">
        {[
          ["reports", "Field reports"],
          ["updates", "Daily updates"],
          ["interns", "Intern logins"],
          ["managers", "Manager logins"],
        ].map(([key, label]) => (
          <button key={key} className={sub === key ? "on" : ""} onClick={() => setSub(key)}>
            {label}
          </button>
        ))}
      </div>
      {sub === "interns" && <TeamPeople role="intern" {...props} />}
      {sub === "reports" && <FieldReports {...props} />}
      {sub === "updates" && <TeamDailyUpdates {...props} />}
      {sub === "managers" && <TeamMembers portal="manager" {...props} />}
    </>
  );
}
