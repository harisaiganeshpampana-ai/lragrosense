import express from "express";

const router = express.Router();

// --------------------------------------------------
// App catalogue
// --------------------------------------------------

const apps = [
  {
    id: "canva",
    name: "Canva",
    description: "Create presentations, designs, documents and visual content.",
    category: "Design",
    status: "available",
    connected: false
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Access and organize files stored in Google Drive.",
    category: "Storage",
    status: "coming",
    connected: false
  },
  {
    id: "github",
    name: "GitHub",
    description: "Work with repositories, issues and development projects.",
    category: "Developer",
    status: "coming",
    connected: false
  },
  {
    id: "gmail",
    name: "Gmail",
    description: "Work with email and communication workflows.",
    category: "Communication",
    status: "coming",
    connected: false
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description: "Create and work with documents.",
    category: "Productivity",
    status: "coming",
    connected: false
  },
  {
    id: "lr-farm-data",
    name: "LR Farm Data",
    description: "Work with agricultural field and farm data.",
    category: "Agriculture",
    status: "native",
    connected: true
  },
  {
    id: "crop-doctor",
    name: "Crop Doctor",
    description: "Agricultural AI assistance for crop health and farming questions.",
    category: "Agriculture",
    status: "native",
    connected: true
  },
  {
    id: "agricultural-data",
    name: "Agricultural Data",
    description: "Analyze agricultural datasets and farm information.",
    category: "Agriculture",
    status: "native",
    connected: false
  }
];

// --------------------------------------------------
// GET /api/apps
// --------------------------------------------------

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    apps
  });
});

// --------------------------------------------------
// GET /api/apps/:id
// --------------------------------------------------

router.get("/:id", (req, res) => {
  const app = apps.find((item) => item.id === req.params.id);

  if (!app) {
    return res.status(404).json({
      success: false,
      message: "App not found"
    });
  }

  res.status(200).json({
    success: true,
    app
  });
});

// --------------------------------------------------
// GET /api/apps/:id/status
// --------------------------------------------------

router.get("/:id/status", (req, res) => {
  const app = apps.find((item) => item.id === req.params.id);

  if (!app) {
    return res.status(404).json({
      success: false,
      message: "App not found"
    });
  }

  res.status(200).json({
    success: true,
    id: app.id,
    name: app.name,
    connected: app.connected,
    status: app.status
  });
});

export default router;
