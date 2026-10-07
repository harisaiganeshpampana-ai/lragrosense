const API_BASE = "https://lragrosense.onrender.com";

let menuRoot = null;
let connectorsOpen = false;
let canvaConnected = false;
let statusRequestInFlight = false;

const STYLE = `
.lr-connector-host {
  position: relative !important;
}

.lr-plus-button {
  width: 35px;
  height: 35px;
  flex: 0 0 35px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #707770;
  cursor: pointer;
}

.lr-plus-button:hover,
.lr-plus-button.is-open {
  background: #f1f3f0;
  color: #202520;
}

.lr-plus-button svg {
  width: 20px;
  height: 20px;
}

.lr-plus-popover {
  position: absolute;
  left: 0;
  bottom: 48px;
  width: 294px;
  padding: 7px;
  border: 1px solid rgba(40, 45, 41, .14);
  border-radius: 14px;
  background: rgba(31, 32, 31, .98);
  box-shadow: 0 18px 45px rgba(0, 0, 0, .22);
  color: #f4f5f3;
  z-index: 1000;
  font-family: inherit;
}

.lr-menu-row {
  width: 100%;
  min-height: 37px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #f1f2f0;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
}

.lr-menu-row:hover,
.lr-menu-row.is-active {
  background: rgba(255, 255, 255, .09);
}

.lr-menu-row svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: #dfe3de;
}

.lr-menu-label {
  min-width: 0;
  flex: 1;
}

.lr-menu-shortcut,
.lr-menu-chevron {
  margin-left: auto;
  color: #9ca19c;
  font-size: 11px;
}

.lr-menu-divider {
  height: 1px;
  margin: 6px 4px;
  background: rgba(255, 255, 255, .11);
}

.lr-menu-check {
  margin-left: auto;
  color: #4da1ff;
  font-size: 18px;
  line-height: 1;
}

.lr-connectors-submenu {
  position: absolute;
  left: calc(100% + 7px);
  top: 136px;
  width: 235px;
  padding: 7px;
  border: 1px solid rgba(40, 45, 41, .14);
  border-radius: 14px;
  background: rgba(31, 32, 31, .98);
  box-shadow: 0 18px 45px rgba(0, 0, 0, .22);
  z-index: 1001;
}

.lr-connector-item {
  width: 100%;
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 9px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #f1f2f0;
  font-size: 13px;
  text-align: left;
}

.lr-connector-item:hover {
  background: rgba(255, 255, 255, .08);
}

.lr-connector-icon {
  width: 19px;
  height: 19px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  background: #7c3aed;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
}

.lr-connector-name {
  min-width: 0;
  flex: 1;
}

.lr-connector-muted {
  color: #969b96;
  font-size: 10px;
  margin-left: auto;
}

.lr-connector-switch {
  position: relative;
  width: 38px;
  height: 22px;
  flex: 0 0 38px;
  border: 0;
  border-radius: 999px;
  background: #555a55;
  cursor: pointer;
}

.lr-connector-switch::after {
  content: "";
  position: absolute;
  width: 18px;
  height: 18px;
  top: 2px;
  left: 2px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, .28);
  transition: transform .15s ease;
}

.lr-connector-switch.is-on {
  background: #3989ed;
}

.lr-connector-switch.is-on::after {
  transform: translateX(16px);
}

.lr-connector-switch:disabled {
  opacity: .6;
  cursor: wait;
}

.lr-connector-toast {
  position: fixed;
  left: 50%;
  bottom: 88px;
  transform: translateX(-50%) translateY(10px);
  padding: 9px 13px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 9px;
  background: #202220;
  color: #f4f5f3;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .18);
  font-size: 11px;
  opacity: 0;
  pointer-events: none;
  transition: .18s;
  z-index: 2000;
}

.lr-connector-toast.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

@media (max-width: 700px) {
  .lr-plus-popover {
    width: min(294px, calc(100vw - 28px));
  }

  .lr-connectors-submenu {
    left: 0;
    top: auto;
    bottom: calc(100% + 7px);
    width: min(235px, calc(100vw - 28px));
  }
}
`;

function injectStyles() {
  if (document.getElementById("lr-connector-enhancer-style")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "lr-connector-enhancer-style";
  style.textContent = STYLE;

  document.head.appendChild(style);
}

function icon(name) {
  const icons = {
    plus: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2">
        <path d="M12 5v14M5 12h14"/>
      </svg>
    `,

    paperclip: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.9">
        <path d="m21.4 11.6-8.9 8.9a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7L9.7 17.7a2 2 0 1 1-2.8-2.8l8.5-8.5"/>
      </svg>
    `,

    folder: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <path d="M3 7.5h6l2 2h10v9.2a1.3 1.3 0 0 1-1.3 1.3H4.3A1.3 1.3 0 0 1 3 18.7z"/>
        <path d="M3 7.5V5.8A1.8 1.8 0 0 1 4.8 4h4l2 2H21a1 1 0 0 1 1 1.5"/>
      </svg>
    `,

    sparkles: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/>
        <path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>
      </svg>
    `,

    connectors: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <rect x="4" y="4" width="6" height="6" rx="1"/>
        <rect x="14" y="14" width="6" height="6" rx="1"/>
        <path d="M10 7h3a2 2 0 0 1 2 2v5M14 17h-3a2 2 0 0 1-2-2v-5"/>
      </svg>
    `,

    palette: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <path d="M12 3a9 9 0 0 0 0 18h1.3a1.7 1.7 0 0 0 0-3.4h-.8a1.5 1.5 0 0 1 0-3h2.9a5.6 5.6 0 0 0 5.6-5.6C21 5.7 17 3 12 3Z"/>
        <circle cx="7.5" cy="9" r=".7" fill="currentColor"/>
        <circle cx="10" cy="6.7" r=".7" fill="currentColor"/>
        <circle cx="14" cy="6.7" r=".7" fill="currentColor"/>
      </svg>
    `,

    plug: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <path d="M8 3v5M16 3v5M6 8h12v3a6 6 0 0 1-6 6v4M12 17v4"/>
      </svg>
    `,

    globe: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="9"/>
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>
      </svg>
    `,

    memory: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="8"/>
        <path d="M8 12h8M12 8v8"/>
      </svg>
    `,

    search: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <circle cx="11" cy="11" r="7"/>
        <path d="m20 20-4-4"/>
      </svg>
    `,

    chevron: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2">
        <path d="m9 6 6 6-6 6"/>
      </svg>
    `,

    sliders: `
      <svg viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="1.8">
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10"/>
        <circle cx="16" cy="7" r="2"/>
        <circle cx="8" cy="17" r="2"/>
      </svg>
    `
  };

  return icons[name] || "";
}

function showToast(message) {
  let toast = document.querySelector(".lr-connector-toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "lr-connector-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

async function fetchCanvaStatus() {
  if (statusRequestInFlight) {
    return canvaConnected;
  }

  statusRequestInFlight = true;

  try {
    const response = await fetch(
      `${API_BASE}/api/apps/canva/status`,
      {
        credentials: "include",
        cache: "no-store"
      }
    );

    const data = await response.json();

    canvaConnected = Boolean(data?.connected);
  } catch {
    // Keep last known state.
  } finally {
    statusRequestInFlight = false;
    updateCanvaSwitches();
  }

  return canvaConnected;
}

function updateCanvaSwitches() {
  document
    .querySelectorAll(".lr-canva-switch")
    .forEach((button) => {

      button.classList.toggle(
        "is-on",
        canvaConnected
      );

      button.setAttribute(
        "aria-checked",
        String(canvaConnected)
      );

      button.title = canvaConnected
        ? "Canva connected"
        : "Connect Canva";
    });
}

function startCanvaConnect() {
  window.location.href =
    `${API_BASE}/api/apps/canva/connect`;
}

async function disconnectCanva() {
  try {
    const response = await fetch(
      `${API_BASE}/api/apps/canva/disconnect`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    if (!response.ok) {
      throw new Error();
    }

    canvaConnected = false;

    updateCanvaSwitches();

    showToast("Canva disconnected");

  } catch {
    showToast("Could not disconnect Canva");
  }
}

function connectorRow(
  label,
  letter,
  muted = false
) {
  const row =
    document.createElement("div");

  row.className =
    "lr-connector-item";

  row.innerHTML = `
    <span class="lr-connector-icon">
      ${letter}
    </span>

    <span class="lr-connector-name">
      ${label}
    </span>

    ${
      muted
        ? `
          <span class="lr-connector-muted">
            Soon
          </span>
        `
        : `
          <button
            class="lr-connector-switch lr-canva-switch"
            type="button"
            role="switch"
          ></button>
        `
    }
  `;

  return row;
}

function buildConnectorsSubmenu() {
  const submenu =
    document.createElement("div");

  submenu.className =
    "lr-connectors-submenu";

  const add =
    document.createElement("button");

  add.className = "lr-menu-row";

  add.innerHTML = `
    ${icon("plus")}
    <span class="lr-menu-label">
      Add connector
    </span>
    ${icon("chevron")}
  `;

  add.onclick = () => {
    showToast(
      "More connectors will be added here."
    );
  };

  submenu.appendChild(add);

  const manage =
    document.createElement("button");

  manage.className = "lr-menu-row";

  manage.innerHTML = `
    ${icon("sliders")}
    <span class="lr-menu-label">
      Manage connectors
    </span>
  `;

  manage.onclick = () => {
    showToast(
      "Manage connectors is ready."
    );
  };

  submenu.appendChild(manage);

  const divider =
    document.createElement("div");

  divider.className =
    "lr-menu-divider";

  submenu.appendChild(divider);

  /*
   * CANVA
   */

  const canva =
    connectorRow("Canva", "C");

  const canvaSwitch =
    canva.querySelector(
      ".lr-canva-switch"
    );

  canvaSwitch.addEventListener(
    "click",
    async (event) => {

      event.stopPropagation();

      if (canvaConnected) {
        await disconnectCanva();
      } else {
        startCanvaConnect();
      }
    }
  );

  canva.onclick = (event) => {

    if (
      event.target.closest(
        ".lr-canva-switch"
      )
    ) {
      return;
    }

    if (canvaConnected) {
      showToast(
        "Canva is connected"
      );
    } else {
      startCanvaConnect();
    }
  };

  submenu.appendChild(canva);

  /*
   * OTHER CONNECTORS
   */

  submenu.appendChild(
    connectorRow(
      "Gamma",
      "G",
      true
    )
  );

  submenu.appendChild(
    connectorRow(
      "Unsplash",
      "U",
      true
    )
  );

  submenu.appendChild(
    connectorRow(
      "Blender",
      "B",
      true
    )
  );

  const divider2 =
    document.createElement("div");

  divider2.className =
    "lr-menu-divider";

  submenu.appendChild(divider2);

  /*
   * ADD FROM CANVA
   */

  const addFrom =
    document.createElement("button");

  addFrom.className =
    "lr-menu-row";

  addFrom.innerHTML = `
    <span
      style="
        width:19px;
        height:19px;
        border-radius:5px;
        background:#7c3aed;
        display:grid;
        place-items:center;
        color:#fff;
        font-size:11px;
        font-weight:800;
      "
    >
      C
    </span>

    <span class="lr-menu-label">
      Add from Canva
    </span>

    ${icon("chevron")}
  `;

  addFrom.onclick = () => {

    if (canvaConnected) {

      showToast(
        "Canva content picker will open here."
      );

    } else {

      startCanvaConnect();

    }
  };

  submenu.appendChild(addFrom);

  /*
   * TOOL ACCESS
   */

  const tools =
    document.createElement("button");

  tools.className =
    "lr-menu-row";

  tools.innerHTML = `
    ${icon("search")}

    <span class="lr-menu-label">
      Tool access
    </span>

    ${icon("chevron")}
  `;

  tools.onclick = () => {
    showToast(
      "Tool access settings will appear here."
    );
  };

  submenu.appendChild(tools);

  updateCanvaSwitches();

  return submenu;
}

function closeMenus() {

  if (!menuRoot) {
    return;
  }

  menuRoot.remove();

  menuRoot = null;

  connectorsOpen = false;

  document
    .querySelectorAll(
      ".lr-plus-button"
    )
    .forEach((button) => {
      button.classList.remove(
        "is-open"
      );
    });
}

function buildMainMenu(
  inputBox,
  plusButton
) {

  const popover =
    document.createElement("div");

  popover.className =
    "lr-plus-popover";

  /*
   * ADD FILES
   */

  const addFiles =
    document.createElement("button");

  addFiles.className =
    "lr-menu-row";

  addFiles.innerHTML = `
    ${icon("paperclip")}

    <span class="lr-menu-label">
      Add files or photos
    </span>

    <span class="lr-menu-shortcut">
      Ctrl+U
    </span>
  `;

  addFiles.onclick = () => {

    inputBox
      .querySelector(
        'input[type="file"]'
      )
      ?.click();

    closeMenus();
  };

  popover.appendChild(addFiles);

  /*
   * ADD TO PROJECT
   */

  const project =
    document.createElement("button");

  project.className =
    "lr-menu-row";

  project.innerHTML = `
    ${icon("folder")}

    <span class="lr-menu-label">
      Add to project
    </span>

    ${icon("chevron")}
  `;

  project.onclick = () => {
    showToast(
      "Project picker will open here."
    );
  };

  popover.appendChild(project);

  const divider =
    document.createElement("div");

  divider.className =
    "lr-menu-divider";

  popover.appendChild(divider);

  /*
   * SKILLS
   */

  const skills =
    document.createElement("button");

  skills.className =
    "lr-menu-row";

  skills.innerHTML = `
    ${icon("sparkles")}

    <span class="lr-menu-label">
      Skills
    </span>

    ${icon("chevron")}
  `;

  skills.onclick = () => {
    showToast(
      "Skills will be available here."
    );
  };

  popover.appendChild(skills);

  /*
   * CONNECTORS
   */

  const connectors =
    document.createElement("button");

  connectors.className =
    "lr-menu-row";

  connectors.innerHTML = `
    ${icon("connectors")}

    <span class="lr-menu-label">
      Connectors
    </span>

    ${icon("chevron")}
  `;

  connectors.onclick = async (event) => {

    event.stopPropagation();

    connectorsOpen =
      !connectorsOpen;

    popover
      .querySelector(
        ".lr-connectors-submenu"
      )
      ?.remove();

    if (connectorsOpen) {

      popover.appendChild(
        buildConnectorsSubmenu()
      );

      await fetchCanvaStatus();
    }
  };

  popover.appendChild(connectors);

  /*
   * DESIGN SYSTEM
   */

  const design =
    document.createElement("button");

  design.className =
    "lr-menu-row";

  design.innerHTML = `
    ${icon("palette")}

    <span class="lr-menu-label">
      Design system
    </span>

    ${icon("chevron")}
  `;

  design.onclick = () => {
    showToast(
      "Design system settings will appear here."
    );
  };

  popover.appendChild(design);

  /*
   * PLUGINS
   */

  const plugins =
    document.createElement("button");

  plugins.className =
    "lr-menu-row";

  plugins.innerHTML = `
    ${icon("plug")}

    <span class="lr-menu-label">
      Add plugins
    </span>
  `;

  plugins.onclick = () => {
    showToast(
      "Plugins will be available here."
    );
  };

  popover.appendChild(plugins);

  const divider2 =
    document.createElement("div");

  divider2.className =
    "lr-menu-divider";

  popover.appendChild(divider2);

  /*
   * WEB SEARCH
   */

  const web =
    document.createElement("button");

  web.className =
    "lr-menu-row";

  web.innerHTML = `
    ${icon("globe")}

    <span class="lr-menu-label">
      Web search
    </span>

    <span class="lr-menu-check">
      ✓
    </span>
  `;

  popover.appendChild(web);

  /*
   * MEMORY
   */

  const memory =
    document.createElement("button");

  memory.className =
    "lr-menu-row";

  memory.innerHTML = `
    ${icon("memory")}

    <span class="lr-menu-label">
      Memory
    </span>

    <span class="lr-menu-check">
      ✓
    </span>
  `;

  popover.appendChild(memory);

  inputBox.appendChild(
    popover
  );

  menuRoot = popover;

  plusButton.classList.add(
    "is-open"
  );

  fetchCanvaStatus();
}

function enhanceInputBox(
  inputBox
) {

  if (
    !inputBox ||
    inputBox.dataset
      .lrConnectorEnhanced ===
      "true"
  ) {
    return;
  }

  const attachButton =
    inputBox.querySelector(
      ".attach-button"
    );

  if (!attachButton) {
    return;
  }

  inputBox.dataset
    .lrConnectorEnhanced =
    "true";

  inputBox.classList.add(
    "lr-connector-host"
  );

  /*
   * REPLACE CAMERA BUTTON
   * WITH +
   */

  const plusButton =
    document.createElement("button");

  plusButton.type =
    "button";

  plusButton.className =
    "lr-plus-button";

  plusButton.setAttribute(
    "aria-label",
    "Open tools and connectors"
  );

  plusButton.title =
    "Add files, connectors and tools";

  plusButton.innerHTML =
    icon("plus");

  attachButton.replaceWith(
    plusButton
  );

  plusButton.onclick =
    (event) => {

      event.stopPropagation();

      if (menuRoot) {
        closeMenus();
      } else {
        buildMainMenu(
          inputBox,
          plusButton
        );
      }
    };

  inputBox.onclick =
    (event) => {
      event.stopPropagation();
    };
}

function scan() {

  injectStyles();

  const inputBox =
    document.querySelector(
      ".input-box"
    );

  if (inputBox) {
    enhanceInputBox(
      inputBox
    );
  }
}

function handleOAuthResult() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  const result =
    params.get("canva");

  if (!result) {
    return;
  }

  if (result === "connected") {

    canvaConnected = true;

    showToast(
      "Canva connected"
    );

    fetchCanvaStatus();

  } else if (
    result === "error"
  ) {

    showToast(
      "Canva connection failed"
    );
  }

  /*
   * Remove ?canva=connected
   * from the address bar.
   */

  params.delete("canva");

  const clean =
    params.toString();

  history.replaceState(
    {},
    document.title,
    `${location.pathname}${
      clean
        ? `?${clean}`
        : ""
    }${location.hash}`
  );
}

document.addEventListener(
  "click",
  () => closeMenus()
);

handleOAuthResult();

scan();

new MutationObserver(
  scan
).observe(
  document.body,
  {
    childList: true,
    subtree: true
  }
);

window.addEventListener(
  "pageshow",
  () => {
    handleOAuthResult();
    scan();
    fetchCanvaStatus();
  }
);

window.addEventListener(
  "focus",
  () => {
    fetchCanvaStatus();
  }
);
