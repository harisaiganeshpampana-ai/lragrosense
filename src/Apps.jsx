import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Cloud,
  Code2,
  FileText,
  Github,
  Grid2X2,
  Leaf,
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

const apps = [
  {
    id: "canva",
    name: "Canva",
    description: "Create presentations, posters, documents and visual designs",
    category: "Design",
    icon: Palette,
    iconClass: "app-canva",
    popular: true,
    installed: false,
    status: "available",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Drive, Docs, Sheets and Slides",
    category: "Productivity",
    icon: Cloud,
    iconClass: "app-drive",
    popular: true,
    installed: false,
    status: "available",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Work with repositories, code, issues and development projects",
    category: "Developer",
    icon: Github,
    iconClass: "app-github",
    popular: true,
    installed: false,
    status: "available",
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Read, summarize and manage your Gmail",
    category: "Productivity",
    icon: Mail,
    iconClass: "app-gmail",
    popular: true,
    installed: false,
    status: "available",
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description: "Create, edit and summarize documents",
    category: "Productivity",
    icon: FileText,
    iconClass: "app-docs",
    popular: false,
    installed: false,
    status: "available",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description: "Useful tools for software development workflows",
    category: "Developer",
    icon: Code2,
    iconClass: "app-developer",
    popular: false,
    installed: false,
    status: "coming",
  },
  {
    id: "lr-farm-data",
    name: "LR Farm Data",
    description: "Connect your LR AgroSense farm data with LR AI",
    category: "Agriculture",
    icon: Sprout,
    iconClass: "app-lr",
    popular: true,
    installed: false,
    status: "native",
  },
  {
    id: "crop-doctor",
    name: "Crop Doctor",
    description: "Analyze crop symptoms and agricultural observations",
    category: "Agriculture",
    icon: Leaf,
    iconClass: "app-crop",
    popular: true,
    installed: false,
    status: "native",
  },
  {
    id: "agricultural-data",
    name: "Agricultural Data",
    description: "Work with agricultural datasets and information",
    category: "Agriculture",
    icon: Grid2X2,
    iconClass: "app-agri",
    popular: false,
    installed: false,
    status: "coming",
  },
];

const installedApps = [
  {
    id: "github",
    name: "GitHub",
    icon: Github,
    iconClass: "app-github",
  },
  {
    id: "canva",
    name: "Canva",
    icon: Palette,
    iconClass: "app-canva",
  },
  {
    id: "lr-farm-data",
    name: "LR Farm Data",
    icon: Sprout,
    iconClass: "app-lr",
  },
];

export default function Apps({ onClose }) {
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("Public");
  const [selectedApp, setSelectedApp] = useState(null);

  const query = searchText.trim().toLowerCase();

  const filteredPopular = useMemo(() => {
    return apps.filter((app) => {
      if (!app.popular) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      );
    });
  }, [query]);

  const filteredNoteworthy = useMemo(() => {
    return apps.filter((app) => {
      if (app.popular) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query)
      );
    });
  }, [query]);

  return (
    <div className="lr-ai-apps-page">

      {/* PAGE HEADER */}

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
              <span>LR AI</span>
            </div>

            <h1>Apps</h1>

          </div>

        </div>


        <button
          type="button"
          className="apps-settings-button"
          onClick={() =>
            alert(
              "App settings will be available when app connections are implemented."
            )
          }
        >
          <Settings2 size={15} />
          <span>Settings</span>
        </button>

      </header>


      {/* INTRO */}

      <section className="apps-intro">

        <h2>
          Connect LR AI with your tools
        </h2>

        <p>
          Connect apps you use for study, work,
          development and agriculture. LR AI will
          be able to work with connected tools when
          the integration is available.
        </p>

      </section>


      {/* SEARCH */}

      <div className="apps-search">

        <Search size={18} />

        <input
          type="text"
          placeholder="Search apps"
          value={searchText}
          onChange={(event) =>
            setSearchText(event.target.value)
          }
        />

        {searchText && (
          <button
            type="button"
            className="apps-clear-search"
            onClick={() => setSearchText("")}
          >
            <X size={14} />
          </button>
        )}

      </div>


      {/* INSTALLED */}

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


          <div className="installed-apps">

            {installedApps.map((app) => (
              <button
                type="button"
                key={app.id}
                className="installed-app"
                title={app.name}
                onClick={() => {
                  const fullApp = apps.find(
                    (item) => item.id === app.id
                  );

                  setSelectedApp(fullApp);
                }}
              >
                <div
                  className={`installed-app-icon ${app.iconClass}`}
                >
                  <app.icon size={22} />
                </div>
              </button>
            ))}

          </div>

        </section>
      )}


      {/* PUBLIC / PERSONAL */}

      <div className="apps-account-tabs">

        <button
          type="button"
          className={
            activeTab === "Public"
              ? "apps-account-tab active"
              : "apps-account-tab"
          }
          onClick={() => setActiveTab("Public")}
        >
          Public
        </button>

        <button
          type="button"
          className={
            activeTab === "Personal"
              ? "apps-account-tab active"
              : "apps-account-tab"
          }
          onClick={() => setActiveTab("Personal")}
        >
          Personal
        </button>

      </div>


      {/* PERSONAL TAB */}

      {activeTab === "Personal" ? (

        <section className="personal-apps-empty">

          <div className="personal-empty-icon">
            <Grid2X2 size={22} />
          </div>

          <h3>
            Your personal apps
          </h3>

          <p>
            Apps you connect privately to LR AI
            will appear here.
          </p>

          <button
            type="button"
            onClick={() => setActiveTab("Public")}
          >
            Explore public apps
            <ChevronRight size={15} />
          </button>

        </section>

      ) : (

        <>
          {/* POPULAR */}

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


            {filteredPopular.length > 0 ? (

              <div className="apps-list">

                {filteredPopular.map((app) => (
                  <AppListItem
                    key={app.id}
                    app={app}
                    onOpen={() => setSelectedApp(app)}
                  />
                ))}

              </div>

            ) : (
              <EmptySearch />
            )}

          </section>


          {/* NEW & NOTEWORTHY */}

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


            {filteredNoteworthy.length > 0 ? (

              <div className="apps-list">

                {filteredNoteworthy.map((app) => (
                  <AppListItem
                    key={app.id}
                    app={app}
                    onOpen={() => setSelectedApp(app)}
                  />
                ))}

              </div>

            ) : (
              <EmptySearch />
            )}

          </section>

        </>

      )}


      {/* FOOTER */}

      <div className="apps-marketplace-footer">

        <Sprout size={15} />

        <span>
          More agriculture and productivity apps
          are coming to LR AI.
        </span>

      </div>


      {/* APP DETAILS */}

      {selectedApp && (

        <div
          className="app-modal-overlay"
          onMouseDown={() => setSelectedApp(null)}
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
              onClick={() => setSelectedApp(null)}
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

                {selectedApp.status === "native"
                  ? "LR AgroSense app"
                  : selectedApp.status === "coming"
                    ? "Coming soon"
                    : "Available for connection"}

              </span>

            </div>


            <button
              type="button"
              className="app-modal-connect"
              onClick={() =>
                alert(
                  `${selectedApp.name} integration will be connected here when the API/OAuth integration is implemented.`
                )
              }
            >

              {selectedApp.status === "coming"
                ? "Coming soon"
                : `Connect ${selectedApp.name}`}

              <ChevronRight size={16} />

            </button>


            <small>
              LR AI will only access information
              that you authorize when integrations
              are implemented.
            </small>

          </div>

        </div>

      )}

    </div>
  );
}


/* =========================================================
   APP LIST ITEM
   ========================================================= */

function AppListItem({ app, onOpen }) {
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

        {app.status === "native" ? (

          <span className="app-native">

            <Check size={11} />

          </span>

        ) : app.status === "coming" ? (

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


/* =========================================================
   APP ICON
   ========================================================= */

function AppIcon({ app, large = false }) {
  const Icon = app.icon;

  return (
    <div
      className={`app-modal-icon ${
        app.iconClass
      } ${large ? "large" : ""}`}
    >
      <Icon size={large ? 30 : 23} />
    </div>
  );
}


/* =========================================================
   EMPTY SEARCH
   ========================================================= */

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
