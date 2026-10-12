/*
|--------------------------------------------------------------------------
| LR AgroSense — Backend API
|--------------------------------------------------------------------------
| Stores internships and internship applications in MongoDB.
|   Public:  GET  /api/internships              -> open internships for the website
|            GET  /api/internships/:id          -> one open internship
|            POST /api/applications             -> submit an application
|   Admin:   POST /api/admin/login              -> returns a login token
|            GET  /api/admin/internships        -> all internships (open + closed)
|            POST /api/admin/internships        -> add an internship
|            PUT  /api/admin/internships/:id    -> edit an internship
|            DELETE /api/admin/internships/:id  -> delete an internship
|            GET  /api/admin/applications       -> all applications
|            PUT  /api/admin/applications/:id   -> change application status
|            DELETE /api/admin/applications/:id -> delete an application
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

const applicationSchema = new mongoose.Schema(
  {
    internship: { type: mongoose.Schema.Types.ObjectId, ref: "Internship", required: true },
    internshipTitle: { type: String, trim: true, maxlength: 120, default: "" },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    college: { type: String, required: true, trim: true, maxlength: 150 },
    course: { type: String, trim: true, maxlength: 100, default: "" },
    year: { type: String, trim: true, maxlength: 30, default: "" },
    city: { type: String, trim: true, maxlength: 80, default: "" },
    resumeLink: { type: String, trim: true, maxlength: 500, default: "" },
    linkedin: { type: String, trim: true, maxlength: 300, default: "" },
    message: { type: String, trim: true, maxlength: 2000, default: "" },
    status: {
      type: String,
      enum: ["new", "shortlisted", "rejected", "selected"],
      default: "new",
    },
  },
  { timestamps: true }
);

const Application = mongoose.model("Application", applicationSchema);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeLink(value) {
  const link = String(value || "").trim();
  return /^https?:\/\//i.test(link) ? link : "";
}

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

/* Simple limits against spam and password guessing */
function makeLimiter(max, windowMs) {
  const hits = new Map();
  return {
    tooMany(ip) {
      const now = Date.now();
      const entry = hits.get(ip) || { count: 0, start: now };
      if (now - entry.start > windowMs) {
        entry.count = 0;
        entry.start = now;
      }
      entry.count += 1;
      hits.set(ip, entry);
      return entry.count > max;
    },
    reset(ip) {
      hits.delete(ip);
    },
  };
}

const loginLimiter = makeLimiter(10, 15 * 60 * 1000); // 10 tries / 15 min
const applyLimiter = makeLimiter(8, 60 * 60 * 1000); // 8 applications / hour

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

// Public: one open internship
app.get("/api/internships/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Internship not found." });
    }
    const item = await Internship.findOne({ _id: req.params.id, isOpen: true }).lean();
    if (!item) return res.status(404).json({ error: "This internship is no longer open." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Public: submit an application
app.post("/api/applications", async (req, res, next) => {
  try {
    const body = req.body || {};

    // Hidden "website" field: real people leave it empty, spam bots fill it in
    if (body.website) return res.status(201).json({ ok: true });

    if (applyLimiter.tooMany(req.ip)) {
      return res
        .status(429)
        .json({ error: "Too many applications from your connection. Please try again later." });
    }

    const internshipId = String(body.internshipId || "");
    if (!mongoose.isValidObjectId(internshipId)) {
      return res.status(400).json({ error: "Please choose an internship." });
    }
    const internship = await Internship.findOne({ _id: internshipId, isOpen: true }).lean();
    if (!internship) {
      return res.status(404).json({ error: "This internship is no longer open." });
    }
    if (internship.deadline) {
      const lastDay = new Date(internship.deadline);
      lastDay.setUTCHours(23, 59, 59, 999);
      if (lastDay < new Date()) {
        return res.status(400).json({ error: "The deadline for this internship has passed." });
      }
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").replace(/[^\d+]/g, "");
    const college = String(body.college || "").trim();

    if (!name || !email || !phone || !college) {
      return res
        .status(400)
        .json({ error: "Please fill in your name, email, phone and college." });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (phone.replace(/\D/g, "").length < 10) {
      return res.status(400).json({ error: "Please enter a valid phone number." });
    }

    const already = await Application.findOne({ internship: internship._id, email }).lean();
    if (already) {
      return res
        .status(409)
        .json({ error: "You have already applied for this internship with this email." });
    }

    await Application.create({
      internship: internship._id,
      internshipTitle: internship.title,
      name,
      email,
      phone,
      college,
      course: String(body.course || ""),
      year: String(body.year || ""),
      city: String(body.city || ""),
      resumeLink: safeLink(body.resumeLink),
      linkedin: safeLink(body.linkedin),
      message: String(body.message || ""),
    });

    res.status(201).json({ ok: true });
  } catch (error) {
    next(error);
  }
});

// Admin login
app.post("/api/admin/login", (req, res) => {
  if (loginLimiter.tooMany(req.ip)) {
    return res
      .status(429)
      .json({ error: "Too many attempts. Please wait 15 minutes and try again." });
  }
  if (!passwordMatches(req.body?.password)) {
    return res.status(401).json({ error: "Wrong password." });
  }
  loginLimiter.reset(req.ip);
  res.json({ token: createToken() });
});

// Admin: list all (with number of applications for each)
app.get("/api/admin/internships", requireAdmin, async (req, res, next) => {
  try {
    const items = await Internship.find().sort({ createdAt: -1 }).lean();
    const counts = await Application.aggregate([
      { $group: { _id: "$internship", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
    res.json(items.map((i) => ({ ...i, applicationCount: countMap.get(String(i._id)) || 0 })));
  } catch (error) {
    next(error);
  }
});

// Admin: list applications (optionally for one internship)
app.get("/api/admin/applications", requireAdmin, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.internship && mongoose.isValidObjectId(String(req.query.internship))) {
      filter.internship = String(req.query.internship);
    }
    const items = await Application.find(filter).sort({ createdAt: -1 }).limit(1000).lean();
    res.json(items);
  } catch (error) {
    next(error);
  }
});

// Admin: change application status
app.put("/api/admin/applications/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Application not found." });
    }
    const status = String(req.body?.status || "");
    if (!["new", "shortlisted", "rejected", "selected"].includes(status)) {
      return res.status(400).json({ error: "Unknown status." });
    }
    const item = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!item) return res.status(404).json({ error: "Application not found." });
    res.json(item);
  } catch (error) {
    next(error);
  }
});

// Admin: delete application
app.delete("/api/admin/applications/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "Application not found." });
    }
    const item = await Application.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Application not found." });
    res.json({ deleted: true });
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
    return res.status(400).json({ error: "Please fill in all the required fields." });
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
