import React, { useState } from "react";
import TeamPeople from "./TeamPeople";
import FieldReports from "./AdminFieldReports";
import TeamDailyUpdates from "./TeamDailyUpdates";
import TeamChat from "./TeamChat";
import TeamTasks from "./TeamTasks";

// Admin view of the team: chat, tasks, team logins and the intern program
export default function AdminTeam({ token, api, onAuthError }) {
  const [sub, setSub] = useState("chat");
  const props = { token, api, onAuthError };
  return (
    <>
      <div className="pt-subtabs">
        {[
          ["chat", "Team chat"],
          ["tasks", "Tasks"],
          ["members", "Core team"],
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
      {sub === "chat" && <TeamChat {...props} />}
      {sub === "tasks" && <TeamTasks {...props} />}
      {sub === "members" && <TeamPeople role="member" {...props} />}
      {sub === "managers" && <TeamPeople role="manager" {...props} />}
      {sub === "interns" && <TeamPeople role="intern" {...props} />}
      {sub === "reports" && <FieldReports {...props} />}
      {sub === "updates" && <TeamDailyUpdates {...props} />}
    </>
  );
}
