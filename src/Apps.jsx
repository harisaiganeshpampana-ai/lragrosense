import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Check,
  ChevronRight,
  Cloud,
  Code2,
  FileText,
  Github,
  Grid2X2,
  Leaf,
  LoaderCircle,
  Mail,
  Palette,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";

import "./apps.css";

/*
|--------------------------------------------------------------------------
| LR AI Backend
|--------------------------------------------------------------------------
*/

const API_BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://lragrosense.onrender.com"
).replace(/\/$/, "");

/*
|--------------------------------------------------------------------------
| App definitions
|--------------------------------------------------------------------------
*/

const appDefinitions = [
  {
    id: "canva",
    name: "Canva",
    description:
      "Create presentations, posters, documents and visual designs",
    category: "Design",
    icon: Palette,
    iconClass: "app-canva",
    popular: true,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description:
      "Drive, Docs, Sheets and Slides",
    category: "Storage",
    icon: Cloud,
    iconClass: "app-drive",
    popular: true,
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Work with repositories, code, issues and development projects",
    category: "Developer",
    icon: Github,
    iconClass: "app-github",
    popular: true,
  },
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Read, summarize and manage your Gmail",
    category: "Communication",
    icon: Mail,
    iconClass: "app-gmail",
    popular: true,
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description:
      "Create, edit and summarize documents",
    category: "Productivity",
    icon: FileText,
    iconClass: "app-docs",
    popular: false,
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description:
      "Useful tools for software development workflows",
    category: "Developer",
    icon: Code2,
    iconClass: "app-developer",
    popular: false,
  },
  {
    id: "lr-farm-data",
    name: "LR Farm Data",
    description:
      "Connect your LR AgroSense farm data with LR AI",
    category: "Agriculture",
    icon: Sprout,
    iconClass: "app-lr",
    popular: true,
  },
  {
    id: "crop-doctor",
    name: "Crop Doctor",
    description:
      "Analyze crop symptoms and agricultural observations",
    category: "Agriculture",
    icon: Leaf,
    iconClass: "app-crop",
    popular: true,
  },
  {
    id: "agricultural-data",
    name: "Agricultural Data",
    description:
      "Work with agricultural datasets and information",
    category: "Agriculture",
    icon: Grid2X2,
    iconClass: "app-agri",
    popular: false,
  },
];

/*
|--------------------------------------------------------------------------
| Fallback statuses
|--------------------------------------------------------------------------
*/

const fallbackStatuses = {
  canva: "available",
  "google-drive": "coming",
  github: "coming",
  gmail: "coming",
  "google-docs": "coming",
  "developer-tools": "coming",
  "lr-farm-data": "native",
  "crop-doctor": "native",
  "agricultural-data": "coming",
};

/*
|--------------------------------------------------------------------------
| Main Apps component
|--------------------------------------------------------------------------
*/

export default function Apps({
  onClose,
}) {
  const [searchText, setSearchText] =
    useState("");

  const [activeTab, setActiveTab] =
    useState("Public");

  const [selectedApp, setSelectedApp] =
    useState(null);

  const [backendApps, setBackendApps] =
    useState([]);

  const [loadingApps, setLoadingApps] =
    useState(true);

  const [backendError, setBackendError] =
    useState(false);

  const [notice, setNotice] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Load apps from backend
  |--------------------------------------------------------------------------
  */

  const loadApps = async () => {
    try {
      setLoadingApps(true);
      setBackendError(false);

      const response =
        await fetch(
          `${API_BASE}/api/apps`,
          {
            credentials: "include",
          }
        );

      if (!response.ok) {
        throw new Error(
          `Apps API returned ${response.status}`
        );
      }

      const data =
        await response.json();

      if (
        !data.success ||
        !Array.isArray(data.apps)
      ) {
        throw new Error(
          "Invalid apps API response"
        );
      }

      setBackendApps(
        data.apps
      );
    } catch (error) {
      console.error(
        "LR AI Apps API error:",
        error
      );

      setBackendError(true);
      setBackendApps([]);
    } finally {
      setLoadingApps(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load apps when component opens
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    loadApps();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle Canva OAuth result
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const params =
      new URLSearchParams(
        window.location.search
      );

    const canvaStatus =
      params.get("canva");

    if (
      canvaStatus ===
      "connected"
    ) {
      setNotice({
        type: "success",
        message:
          "Canva connected successfully.",
      });

      loadApps();

      /*
       * Remove query parameter
       * from browser URL.
       */

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    if (
      canvaStatus ===
      "error"
    ) {
      setNotice({
        type: "error",
        message:
          "Canva connection failed. Please try again.",
      });

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Automatically hide notice
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer =
      setTimeout(() => {
        setNotice(null);
      }, 5000);

    return () =>
      clearTimeout(timer);
  }, [notice]);

  /*
  |--------------------------------------------------------------------------
  | Merge backend apps with frontend definitions
  |--------------------------------------------------------------------------
  */

  const apps = useMemo(() => {
    return appDefinitions.map(
      (definition) => {
        const backendApp =
          backendApps.find(
            (item) =>
              item.id ===
              definition.id
          );

        return {
          ...definition,

          description:
            backendApp?.description ||
            definition.description,

          category:
            backendApp?.category ||
            definition.category,

          status:
            backendApp?.status ||
            fallbackStatuses[
              definition.id
            ] ||
            "coming",

          connected:
            Boolean(
              backendApp?.connected
            ),
        };
      }
    );
  }, [backendApps]);

  /*
  |--------------------------------------------------------------------------
  | Installed apps
  |--------------------------------------------------------------------------
  */

  const installedApps =
    useMemo(() => {
      return apps.filter(
        (app) =>
          app.connected
      );
    }, [apps]);

  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  */

  const query =
    searchText
      .trim()
      .toLowerCase();

  const matchesQuery =
    (app) => {
      if (!query) {
        return true;
      }

      return (
        app.name
          .toLowerCase()
          .includes(query) ||
        app.description
          .toLowerCase()
          .includes(query) ||
        app.category
          .toLowerCase()
          .includes(query)
      );
    };

  const filteredPopular =
    useMemo(() => {
      return apps.filter(
        (app) =>
          app.popular &&
          matchesQuery(app)
      );
    }, [apps, query]);

  const filteredNoteworthy =
    useMemo(() => {
      return apps.filter(
        (app) =>
          !app.popular &&
          matchesQuery(app)
      );
    }, [apps, query]);

  /*
  |--------------------------------------------------------------------------
  | Start Canva OAuth
  |--------------------------------------------------------------------------
  */

  const connectCanva = () => {
    window.location.href =
      `${API_BASE}/api/apps/canva/connect`;
  };

  /*
  |--------------------------------------------------------------------------
  | Disconnect Canva
  |--------------------------------------------------------------------------
  */

  const disconnectCanva =
    async () => {
      try {
        const response =
          await fetch(
            `${API_BASE}/api/apps/canva/disconnect`,
            {
              method: "POST",
              credentials:
                "include",
              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            "Unable to disconnect Canva."
          );
        }

        await loadApps();

        setSelectedApp(
          null
        );

        setNotice({
          type: "success",
          message:
            "Canva disconnected.",
        });
      } catch (error) {
        console.error(
          "Canva disconnect error:",
          error
        );

        setNotice({
          type: "error",
          message:
            "Could not disconnect Canva.",
        });
      }
    };

  return (
    <div className="lr-ai-apps-page">

      {/* -------------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------------- */}

      <header className="apps-page-header">

        <div className="apps-header-left">

          <button
            type="button"
            className="apps-back-button"
            onClick={onClose}
            aria-label="Back to LR AI"
          >
            <ChevronRight
              size={18}
              className="apps-back-icon"
            />
          </button>

          <div className="apps-heading">

            <div className="apps-heading-brand">
              <Sparkles size={12} />
              <span>
                LR AI
              </span>
            </div>

            <h1>
              Apps
            </h1>

          </div>

        </div>

        <button
          type="button"
          className="apps-settings-button"
          onClick={() =>
            setNotice({
              type: "success",
              message:
                "App settings will be available soon.",
            })
          }
        >
          <Settings2 size={15} />
          <span>
            Settings
          </span>
        </button>

      </header>

      {/* -------------------------------------------------- */}
      {/* Notification */}
      {/* -------------------------------------------------- */}

      {notice && (
        <div
          className={`apps-notice ${
            notice.type ===
            "error"
              ? "apps-notice-error"
              : "apps-notice-success"
          }`}
        >
          <span>
            {notice.message}
          </span>

          <button
            type="button"
            onClick={() =>
              setNotice(null)
            }
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* -------------------------------------------------- */}
      {/* Introduction */}
      {/* -------------------------------------------------- */}

      <section className="apps-intro">

        <h2>
          Connect LR AI with your tools
        </h2>

        <p>
          Connect apps you use for study,
          work, development and agriculture.
          LR AI will be able to work with
          connected tools when the integration
          is available.
        </p>

      </section>

      {/* -------------------------------------------------- */}
      {/* Search */}
      {/* -------------------------------------------------- */}

      <div className="apps-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search apps"
          value={searchText}
          onChange={(event) =>
            setSearchText(
              event.target.value
            )
          }
        />

        {searchText && (
          <button
            type="button"
            className="apps-clear-search"
            onClick={() =>
              setSearchText("")
            }
          >
            <X size={14} />
          </button>
        )}

      </div>

      {/* -------------------------------------------------- */}
      {/* Backend status */}
      {/* -------------------------------------------------- */}

      <div
        className="apps-backend-status"
        aria-live="polite"
      >

        {loadingApps ? (
          <>
            <LoaderCircle
              size={13}
              className="apps-loading-icon"
            />

            <span>
              Loading apps...
            </span>
          </>
        ) : backendError ? (
          <>
            <span className="apps-status-warning-dot" />

            <span>
              Using local app information
            </span>
          </>
        ) : (
          <>
            <span className="apps-status-online-dot" />

            <span>
              Connected to LR AI backend
            </span>
          </>
        )}

      </div>

      {/* -------------------------------------------------- */}
      {/* Installed */}
      {/* -------------------------------------------------- */}

      {!query && (
        <section className="apps-section installed-section">

          <div className="apps-section-title-row">

            <button
              type="button"
              className="apps-section-title"
            >
              Installed
              <ChevronRight size={15} />
            </button>

          </div>

          {installedApps.length >
          0 ? (
            <div className="installed-apps">

              {installedApps.map(
                (app) => {
                  const Icon =
                    app.icon;

                  return (
                    <button
                      type="button"
                      key={app.id}
                      className="installed-app"
                      title={app.name}
                      onClick={() =>
                        setSelectedApp(
                          app
                        )
                      }
                    >
                      <div
                        className={`installed-app-icon ${app.iconClass}`}
                      >
                        <Icon
                          size={22}
                        />
                      </div>
                    </button>
                  );
                }
              )}

            </div>
          ) : (
            <div className="apps-installed-empty">
              No connected apps yet.
            </div>
          )}

        </section>
      )}

      {/* -------------------------------------------------- */}
      {/* Account tabs */}
      {/* -------------------------------------------------- */}

      <div className="apps-account-tabs">

        <button
          type="button"
          className={
            activeTab ===
            "Public"
              ? "apps-account-tab active"
              : "apps-account-tab"
          }
          onClick={() =>
            setActiveTab(
              "Public"
            )
          }
        >
          Public
        </button>

        <button
          type="button"
          className={
            activeTab ===
            "Personal"
              ? "apps-account-tab active"
              : "apps-account-tab"
          }
          onClick={() =>
            setActiveTab(
              "Personal"
            )
          }
        >
          Personal
        </button>

      </div>

      {/* -------------------------------------------------- */}
      {/* Personal */}
      {/* -------------------------------------------------- */}

      {activeTab ===
      "Personal" ? (
        <section className="personal-apps-empty">

          <div className="personal-empty-icon">
            <Grid2X2 size={22} />
          </div>

          <h3>
            Your personal apps
          </h3>

          <p>
            Apps you connect privately
            to LR AI will appear here.
          </p>

          <button
            type="button"
            onClick={() =>
              setActiveTab(
                "Public"
              )
            }
          >
            Explore public apps
            <ChevronRight size={15} />
          </button>

        </section>
      ) : (
        <>
          {/* -------------------------------------------------- */}
          {/* Popular */}
          {/* -------------------------------------------------- */}

          <section className="apps-section">

            <div className="apps-section-heading">

              <button
                type="button"
                className="apps-section-title"
              >
                Popular
                <ChevronRight size={15} />
              </button>

            </div>

            {filteredPopular.length >
            0 ? (
              <div className="apps-list">

                {filteredPopular.map(
                  (app) => (
                    <AppListItem
                      key={app.id}
                      app={app}
                      onOpen={() =>
                        setSelectedApp(
                          app
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <EmptySearch />
            )}

          </section>

          {/* -------------------------------------------------- */}
          {/* New and Noteworthy */}
          {/* -------------------------------------------------- */}

          <section className="apps-section noteworthy-section">

            <div className="apps-section-heading">

              <button
                type="button"
                className="apps-section-title"
              >
                New &amp; Noteworthy
                <ChevronRight size={15} />
              </button>

            </div>

            {filteredNoteworthy.length >
            0 ? (
              <div className="apps-list">

                {filteredNoteworthy.map(
                  (app) => (
                    <AppListItem
                      key={app.id}
                      app={app}
                      onOpen={() =>
                        setSelectedApp(
                          app
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <EmptySearch />
            )}

          </section>
        </>
      )}

      {/* -------------------------------------------------- */}
      {/* Footer */}
      {/* -------------------------------------------------- */}

      <div className="apps-marketplace-footer">

        <Sprout size={15} />

        <span>
          More agriculture and productivity
          apps are coming to LR AI.
        </span>

      </div>

      {/* -------------------------------------------------- */}
      {/* App modal */}
      {/* -------------------------------------------------- */}

      {selectedApp && (
        <div
          className="app-modal-overlay"
          onMouseDown={() =>
            setSelectedApp(null)
          }
        >

          <div
            className="app-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="app-modal-close"
              onClick={() =>
                setSelectedApp(
                  null
                )
              }
            >
              <X size={17} />
            </button>

            <AppIcon
              app={selectedApp}
              large
            />

            <div className="app-modal-category">
              {selectedApp.category}
            </div>

            <h2>
              {selectedApp.name}
            </h2>

            <p>
              {selectedApp.description}.
            </p>

            <div className="app-modal-status">

              <strong>
                Connection status
              </strong>

              <span>

                <span className="status-dot" />

                {selectedApp.connected
                  ? "Connected"
                  : selectedApp.status ===
                    "native"
                    ? "LR AgroSense app"
                    : selectedApp.status ===
                      "coming"
                      ? "Coming soon"
                      : "Available for connection"}

              </span>

            </div>

            {/* ------------------------------------------------ */}
            {/* Canva connected */}
            {/* ------------------------------------------------ */}

            {selectedApp.id ===
              "canva" &&
            selectedApp.connected ? (
              <div className="app-modal-actions">

                <button
                  type="button"
                  className="app-modal-connect"
                  onClick={() => {
                    setNotice({
                      type: "success",
                      message:
                        "Canva is connected and ready for LR AI.",
                    });
                  }}
                >
                  Open Canva connection
                  <ChevronRight
                    size={16}
                  />
                </button>

                <button
                  type="button"
                  className="app-modal-disconnect"
                  onClick={
                    disconnectCanva
                  }
                >
                  Disconnect Canva
                </button>

              </div>
            ) : (
              /* ---------------------------------------------- */
              /* Normal connection button */
              /* ---------------------------------------------- */

              <button
                type="button"
                className="app-modal-connect"
                disabled={
                  selectedApp.status ===
                  "coming"
                }
                onClick={() => {

                  if (
                    selectedApp.status ===
                    "coming"
                  ) {
                    return;
                  }

                  /*
                   * Canva OAuth
                   */

                  if (
                    selectedApp.id ===
                    "canva"
                  ) {
                    connectCanva();
                    return;
                  }

                  setNotice({
                    type: "success",
                    message:
                      `${selectedApp.name} connection will be available soon.`,
                  });
                }}
              >

                {selectedApp.connected
                  ? `Open ${selectedApp.name}`
                  : selectedApp.status ===
                    "coming"
                    ? "Coming soon"
                    : `Connect ${selectedApp.name}`}

                <ChevronRight
                  size={16}
                />

              </button>
            )}

            <small>
              LR AI will only access information
              that you authorize. App credentials
              and secrets remain on the secure
              backend.
            </small>

          </div>

        </div>
      )}

    </div>
  );
}

/*
|--------------------------------------------------------------------------
| App list item
|--------------------------------------------------------------------------
*/

function AppListItem({
  app,
  onOpen,
}) {
  const Icon = app.icon;

  return (
    <button
      type="button"
      className="app-list-item"
      onClick={onOpen}
    >

      <div
        className={`app-list-icon ${app.iconClass}`}
      >
        <Icon size={24} />
      </div>

      <div className="app-list-content">

        <h3>
          {app.name}
        </h3>

        <p>
          {app.description}
        </p>

      </div>

      <div className="app-list-action">

        {app.connected ? (
          <span className="app-native">
            <Check size={11} />
          </span>
        ) : app.status ===
          "coming" ? (
          <span className="app-coming">
            Soon
          </span>
        ) : (
          <Plus size={19} />
        )}

      </div>

    </button>
  );
}

/*
|--------------------------------------------------------------------------
| App icon
|--------------------------------------------------------------------------
*/

function AppIcon({
  app,
  large = false,
}) {
  const Icon = app.icon;

  return (
    <div
      className={`app-modal-icon ${
        app.iconClass
      } ${
        large
          ? "large"
          : ""
      }`}
    >
      <Icon
        size={
          large
            ? 30
            : 23
        }
      />
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Empty search
|--------------------------------------------------------------------------
*/

function EmptySearch() {
  return (
    <div className="apps-no-results">

      <Search size={20} />

      <strong>
        No apps found
      </strong>

      <span>
        Try searching for another app.
      </span>

    </div>
  );
}
