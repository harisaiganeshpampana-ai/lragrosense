/*
|--------------------------------------------------------------------------
| LR AgroSense — Backend API
|--------------------------------------------------------------------------
| Stores internships in MongoDB.
|   Public:  GET  /api/internships           -> open internships for the website
|   Admin:   POST /api/admin/login           -> returns a login token
|            GET  /api/admin/internships     -> all internships (open + closed)
|            POST /api/admin/internships     -> add an internship
|            PUT  /api/admin/internships/:id -> edit an internship
|            DELETE /api/admin/internships/:id -> delete an internship
|
| Settings come from environment variables (set them in Render):
|   MONGODB_URI     your MongoDB connection string
|   ADMIN_PASSWORD  the password for the admin portal
|   TOKEN_SECRET    any long random text (keeps logins secure)
|   FRONTEND_URL    https://lragrosense.in
*/

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import crypto from "crypto";

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

if (!MONGODB_URI || !ADMIN_PASSWORD || !TOKEN_SECRET) {
  console.error(
    "Missing settings. Please set MONGODB_URI, ADMIN_PASSWORD and TOKEN_SECRET."
  );
  process.exit(1);
}

/* ---------------- Allowed websites (CORS) ---------------- */

const allowedOrigins = [
  "https://lragrosense.in",
  "https://www.lragrosense.in",
  "http://localhost:5173",
  "http://localhost:4173",
  ...(process.env.FRONTEND_URL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
];

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "100kb" }));

/* ---------------- Database model ---------------- */

const internshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    category: { type: String, trim: true, maxlength: 60, default: "" },
    mode: { type: String, trim: true, maxlength: 40, default: "Remote" },
    location: { type: String, trim: true, maxlength: 80, default: "" },
    duration: { type: String, trim: true, maxlength: 60, default: "" },
    stipend: { type: String, trim: true, maxlength: 60, default: "Unpaid" },
    openings: { type: Number, min: 1, max: 999, default: 1 },
    deadline: { type: Date, default: null },
    description: { type: String, trim: true, maxlength: 3000, default: "" },
    skills: { type: [String], default: [] },
    applyLink: { type: String, trim: true, maxlength: 500, default: "" },
    isOpen: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Internship = mongoose.model("Internship", internshipSchema);

const EDITABLE_FIELDS = [
  "title",
  "category",
  "mode",
  "location",
  "duration",
  "stipend",
  "openings",
  "deadline",
  "description",
  "skills",
  "applyLink",
  "isOpen",
];

function cleanInput(body = {}) {
  const data = {};
  for (const key of EDITABLE_FIELDS) {
    if (body[key] === undefined) continue;
    data[key] = body[key];
  }

  if (typeof data.skills === "string") {
    data.skills = data.skills.split(",");
  }
  if (Array.isArray(data.skills)) {
    data.skills = data.skills
      .map((s) => String(s).trim())
      .filter(Boolean)
      .slice(0, 20)
      .map((s) => s.slice(0, 40));
  }

  if (data.deadline === "" || data.deadline === null) data.deadline = null;

  if (data.openings !== undefined) {
    const n = parseInt(data.openings, 10);
    data.openings = Number.isFinite(n) && n > 0 ? n : 1;
  }

  if (data.isOpen !== undefined) data.isOpen = Boolean(data.isOpen);

  if (data.applyLink && !/^(https?:\/\/|mailto:)/i.test(data.applyLink)) {
    data.applyLink = "";
  }

  return data;
}

/* ---------------- Login tokens ---------------- */

const TOKEN_DAYS = 7;

function sign(text) {
  return crypto.createHmac("sha256", TOKEN_SECRET).update(text).digest("base64url");
}

function createToken() {
  const payload = Buffer.from(
    JSON.stringify({ role: "admin", exp: Date.now() + TOKEN_DAYS * 86400000 })
  ).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifyToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  const expected = sign(payload);
  const a = Buffer.from(signature || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    return data.role === "admin" && data.exp > Date.now();
  } catch {
    return false;
  }
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!verifyToken(token)) {
    return res.status(401).json({ error: "Please log in again." });
  }
  next();
}

function passwordMatches(input) {
  const a = crypto.createHash("sha256").update(String(input || "")).digest();
  const b = crypto.createHash("sha256").update(ADMIN_PASSWORD).digest();
  return crypto.timingSafeEqual(a, b);
}

/* Simple protection against password guessing: 10 tries per 15 minutes per IP */
const loginAttempts = new Map();

function tooManyAttempts(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, start: now };
  if (now - entry.start > 15 * 60 * 1000) {
    entry.count = 0;
    entry.start = now;
  }
  entry.count += 1;
  loginAttempts.set(ip, entry);
  return entry.count > 10;
}

/* ---------------- Routes ---------------- */

app.get("/", (req, res) => {
  res.json({ name: "LR AgroSense API", status: "running" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

// Public: open internships for the website
app.get("/api/internships", async (req, res, next) => {
  try {
    const items = await Internship.find({ isOpen: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  if (tooManyAttempts(req.ip)) {
    return res
      .status(429)
      .json({ error: "Too many attempts. Please wait 15 minutes and try again." });
  }
  if (!passwordMatches(req.body?.password)) {
    return res.status(401).json({ error: "Wrong password." });
  }
  loginAttempts.delete(req.ip);
  res.json({ token: createToken() });
});

// Admin: list all
app.get("/api/admin/internships", requireAdmin, async (req, res, next) => {
  try {
    const items = await Internship.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Admin: create
app.post("/api/admin/internships", requireAdmin, async (req, res, next) => {
  try {
    const item = await Internship.create(cleanInput(req.body));
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
});

// Admin: update
app.put("/api/admin/internships/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Internship not found." });
    }
    const item = await Internship.findByIdAndUpdate(req.params.id, cleanInput(req.body), {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ error: "Internship not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Admin: delete
app.delete("/api/admin/internships/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Internship not found." });
    }
    const item = await Internship.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Internship not found." });
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
});

/* ---------------- Errors ---------------- */

app.use((req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.use((error, req, res, next) => {
  if (error.name === "ValidationError") {
    return res.status(400).json({ error: "Please fill in the required fields (title)." });
  }
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "This website is not allowed." });
  }
  console.error(error);
  res.status(500).json({ error: "Something went wrong on the server." });
});

/* ---------------- Start ---------------- */

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`LR AgroSense API running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  });
