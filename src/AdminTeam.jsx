import React, { useState } from "react";
import TeamChat from "./TeamChat";
import TeamMessages from "./TeamMessages";
import TeamFiles from "./TeamFiles";
import TeamMembers from "./TeamMembers";

// Admin view of the team workspace: same chat as the team, plus adding members
export default function AdminTeam({ token, api, onAuthError }) {
  const [sub, setSub] = useState("group");
  const props = { token, api, onAuthError };
  return (
    <>
      <div className="pt-subtabs">
        {[
          ["group", "Group chat"],
          ["messages", "Messages"],
          ["files", "Files"],
          ["members", "Members"],
        ].map(([key, label]) => (
          <button key={key} className={sub === key ? "on" : ""} onClick={() => setSub(key)}>
            {label}
          </button>
        ))}
      </div>
      {sub === "group" && <TeamChat {...props} />}
      {sub === "messages" && <TeamMessages {...props} />}
      {sub === "files" && <TeamFiles {...props} />}
      {sub === "members" && <TeamMembers {...props} />}
    </>
  );
}
