import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import appsRouter from "./routes/apps.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const allowedOrigins = [
  "https://lragrosense.in",
  "https://www.lragrosense.in"
];

if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header.
      // Useful for direct API checks and server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS origin not allowed"));
    },
    credentials: true
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(express.urlencoded({ extended: true }));

// --------------------------------------------------
// Root
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "LR AI Backend",
    company: "LR AgroSense",
    status: "operational",
    version: "1.0.0"
  });
});

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LR AI Backend is running",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// --------------------------------------------------
// Apps
// --------------------------------------------------

app.use("/api/apps", appsRouter);

// --------------------------------------------------
// 404
// --------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl
  });
});

// --------------------------------------------------
// Error handler
// --------------------------------------------------

app.use((error, req, res, next) => {
  console.error("Backend error:", error);

  if (error.message === "CORS origin not allowed") {
    return res.status(403).json({
      success: false,
      message: "CORS origin not allowed"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, HOST, () => {
  console.log("======================================");
  console.log("LR AI Backend");
  console.log("======================================");
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("======================================");
});
