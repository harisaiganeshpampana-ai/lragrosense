import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
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
  Search,
  Settings2,
  Sparkles,
  Sprout,
  X,
} from "lucide-react";

const apps = [
  {
    id: "canva",
    name: "Canva",
    description:
      "Create presentations, posters, documents and visual designs with LR AI.",
    category: "Design",
    icon: Palette,
    iconClass: "app-icon-canva",
    popular: true,
    status: "Available soon",
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description:
      "Search, summarize and work with files from your Google Drive.",
    category: "Productivity",
    icon: Cloud,
    iconClass: "app-icon-drive",
    popular: true,
    status: "Available soon",
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Work with repositories, code, issues and development projects.",
    category: "Developer",
    icon: Github,
    iconClass: "app-icon-github",
    popular: true,
    status: "Available soon",
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description:
      "Create, summarize and organize documents with help from LR AI.",
    category: "Productivity",
    icon: FileText,
    iconClass: "app-icon-docs",
    popular: false,
    status: "Available soon",
  },
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Find important emails, summarize conversations and draft replies.",
    category: "Productivity",
    icon: Mail,
    iconClass: "app-icon-gmail",
    popular: false,
    status: "Available soon",
  },
  {
    id: "lr-farm-data",
    name: "LR Farm Data",
    description:
      "Connect your LR AgroSense farm data and ask LR AI about field conditions.",
    category: "Agriculture",
    icon: Sprout,
    iconClass: "app-icon-lr",
    popular: true,
    status: "LR AgroSense",
  },
  {
    id: "crop-doctor",
    name: "Crop Doctor",
    description:
      "Analyze crop symptoms and organize agricultural observations.",
    category: "Agriculture",
    icon: Leaf,
    iconClass: "app-icon-crop",
    popular: true,
    status: "LR AgroSense",
  },
  {
    id: "agri-data",
    name: "Agricultural Data",
    description:
      "Use agricultural datasets and information while working with LR AI.",
    category: "Agriculture",
    icon: Grid2X2,
    iconClass: "app-icon-data",
    popular: false,
    status: "Coming soon",
  },
  {
    id: "developer-tools",
    name: "Developer Tools",
    description:
      "Connect development services and use LR AI for technical workflows.",
    category: "Developer",
    icon: Code2,
    iconClass: "app-icon-developer",
    popular: false,
    status: "Coming soon",
  },
];

const categories = [
  "All",
  "Popular",
  "Agriculture",
  "Productivity",
  "Design",
  "Developer",
];

export default function Apps({ onClose }) {
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedApp, setSelectedApp] = useState(null);

  const filteredApps = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return apps.filter((app) => {
      const matchesSearch =
        !query ||
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "All"
          ? true
          : activeCategory === "Popular"
            ? app.popular
            : app.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchText, activeCategory]);

  const popularApps = apps.filter((app) => app.popular);

  return (
    <div className="lr-ai-apps-page">
      {/* HEADER */}
      <div className="apps-page-header">
        <div className="apps-header-left">
          <button
            className="apps-back-button"
            onClick={onClose}
            aria-label="Back to LR AI"
            title="Back to LR AI"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="apps-eyebrow">
              <Sparkles size={13} />
              LR AI
            </div>

            <h1>Apps</h1>
          </div>
        </div>

        <button
          className="apps-settings-button"
          type="button"
          title="App settings"
          onClick={() =>
            alert(
              "App settings will be available after the connection system is added."
            )
          }
        >
          <Settings2 size={17} />
          <span>Settings</span>
        </button>
      </div>

      {/* HERO */}
      <section className="apps-hero">
        <div className="apps-hero-icon">
          <Grid2X2 size={25} />
        </div>

        <div className="apps-hero-content">
          <h2>Connect LR AI with your tools</h2>

          <p>
            Connect apps you use for study, work, development and
            agriculture. LR AI will be able to work with connected tools
            when the integration is available.
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <div className="apps-search-row">
        <div className="apps-search-box">
          <Search size={18} />

          <input
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search apps"
            aria-label="Search apps"
          />

          {searchText && (
            <button
              type="button"
              className="apps-search-clear"
              onClick={() => setSearchText("")}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="apps-category-row">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              activeCategory === category
                ? "apps-category active"
                : "apps-category"
            }
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* POPULAR */}
      {!searchText && activeCategory === "All" && (
        <section className="apps-section">
          <div className="apps-section-heading">
            <div>
              <h3>Popular</h3>
              <p>Useful integrations to get started with LR AI.</p>
            </div>

            <span>{popularApps.length} apps</span>
          </div>

          <div className="apps-grid">
            {popularApps.slice(0, 4).map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onOpen={() => setSelectedApp(app)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ALL APPS */}
      <section className="apps-section">
        <div className="apps-section-heading">
          <div>
            <h3>
              {activeCategory === "All"
                ? "All apps"
                : activeCategory}
            </h3>

            <p>
              Explore tools and services that can work with LR AI.
            </p>
          </div>

          <span>{filteredApps.length} apps</span>
        </div>

        {filteredApps.length > 0 ? (
          <div className="apps-grid">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onOpen={() => setSelectedApp(app)}
              />
            ))}
          </div>
        ) : (
          <div className="apps-empty">
            <Search size={24} />
            <h3>No apps found</h3>
            <p>
              Try another search or choose a different category.
            </p>
          </div>
        )}
      </section>

      {/* FUTURE NOTE */}
      <section className="apps-future-card">
        <div className="apps-future-icon">
          <Sprout size={20} />
        </div>

        <div>
          <strong>More LR AgroSense apps are coming</strong>

          <p>
            LR AI will gradually connect agriculture tools,
            farm monitoring, crop health and agricultural data
            into one workspace.
          </p>
        </div>
      </section>

      {/* APP DETAILS MODAL */}
      {selectedApp && (
        <div
          className="app-details-overlay"
          onMouseDown={() => setSelectedApp(null)}
        >
          <div
            className="app-details-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              className="app-details-close"
              onClick={() => setSelectedApp(null)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <AppIcon app={selectedApp} large />

            <div className="app-details-category">
              {selectedApp.category}
            </div>

            <h2>{selectedApp.name}</h2>

            <p>{selectedApp.description}</p>

            <div className="app-permission-box">
              <strong>Connection status</strong>

              <div className="app-status-row">
                <span className="app-status-dot" />
                {selectedApp.status}
              </div>
            </div>

            <button
              className="app-connect-button"
              onClick={() => {
                alert(
                  `${selectedApp.name} connection will be added in the next integration phase.`
                );
              }}
            >
              Connect {selectedApp.name}
              <ChevronRight size={17} />
            </button>

            <p className="app-security-note">
              LR AI will only access information that you
              authorize when the real connection is implemented.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AppCard({ app, onOpen }) {
  return (
    <button
      type="button"
      className="app-card"
      onClick={onOpen}
    >
      <div className="app-card-top">
        <AppIcon app={app} />

        <div className="app-card-arrow">
          <ChevronRight size={17} />
        </div>
      </div>

      <div className="app-card-content">
        <h4>{app.name}</h4>

        <p>{app.description}</p>
      </div>

      <div className="app-card-footer">
        <span>{app.category}</span>

        {app.status === "LR AgroSense" ? (
          <span className="app-native-badge">
            <Check size={11} />
            LR app
          </span>
        ) : (
          <span className="app-coming-badge">
            {app.status}
          </span>
        )}
      </div>
    </button>
  );
}

function AppIcon({ app, large = false }) {
  const Icon = app.icon;

  return (
    <div
      className={`app-icon ${app.iconClass} ${
        large ? "large" : ""
      }`}
    >
      <Icon size={large ? 29 : 22} />
    </div>
  );
}
