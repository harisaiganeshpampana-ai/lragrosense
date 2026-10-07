import express from "express";
import crypto from "crypto";

const router = express.Router();

const apps = [
  {
    id: "canva",
    name: "Canva",
    description:
      "Create presentations, posters, documents and visual designs.",
    category: "Design",
    status: "available",
    connected: false,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Access and organize files stored in Google Drive.",
    category: "Storage",
    status: "coming",
    connected: false,
  },
  {
    id: "github",
    name: "GitHub",
    description:
      "Work with repositories, code, issues and development projects.",
    category: "Developer",
    status: "coming",
    connected: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    description:
      "Read, summarize and manage your Gmail.",
    category: "Communication",
    status: "coming",
    connected: false,
  },
  {
    id: "google-docs",
    name: "Google Docs",
    description:
      "Create, edit and summarize documents.",
    category: "Productivity",
    status: "coming",
    connected: false,
  },
  {
    id: "lr-farm-data",
    name: "LR Farm Data",
    description:
      "Work with agricultural field and farm data.",
    category: "Agriculture",
    status: "native",
    connected: true,
  },
  {
    id: "crop-doctor",
    name: "Crop Doctor",
    description:
      "Agricultural AI assistance for crop health and farming questions.",
    category: "Agriculture",
    status: "native",
    connected: true,
  },
  {
    id: "agricultural-data",
    name: "Agricultural Data",
    description:
      "Analyze agricultural datasets and farm information.",
    category: "Agriculture",
    status: "native",
    connected: false,
  },
];

/*
|--------------------------------------------------------------------------
| Temporary session storage
|--------------------------------------------------------------------------
|
| This is intentionally in-memory for the first Canva integration test.
|
| IMPORTANT:
| - Tokens disappear if Render restarts/redeploys.
| - This is NOT our final production storage.
| - Later we will move this to a database and encrypt sensitive tokens.
|
*/

const sessions = new Map();

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...valueParts] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}

function createSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function getOrCreateSession(req, res) {
  let sessionId = getCookie(req, "lr_ai_session");

  if (!sessionId || !sessions.has(sessionId)) {
    sessionId = createSessionId();

    sessions.set(sessionId, {
      canva: null,
      pendingCanva: null,
    });

    res.setHeader(
      "Set-Cookie",
      `lr_ai_session=${encodeURIComponent(
        sessionId
      )}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
    );
  }

  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      canva: null,
      pendingCanva: null,
    });
  }

  return {
    sessionId,
    session: sessions.get(sessionId),
  };
}

/*
|--------------------------------------------------------------------------
| GET /api/apps
|--------------------------------------------------------------------------
*/

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    apps,
  });
});

/*
|--------------------------------------------------------------------------
| GET /api/apps/:id
|--------------------------------------------------------------------------
*/

router.get("/:id", (req, res) => {
  const app = apps.find(
    (item) => item.id === req.params.id
  );

  if (!app) {
    return res.status(404).json({
      success: false,
      message: "App not found",
    });
  }

  res.status(200).json({
    success: true,
    app,
  });
});

/*
|--------------------------------------------------------------------------
| GET /api/apps/:id/status
|--------------------------------------------------------------------------
*/

router.get("/:id/status", (req, res) => {
  const app = apps.find(
    (item) => item.id === req.params.id
  );

  if (!app) {
    return res.status(404).json({
      success: false,
      message: "App not found",
    });
  }

  if (req.params.id === "canva") {
    const { session } = getOrCreateSession(req, res);

    return res.status(200).json({
      success: true,
      id: "canva",
      name: "Canva",
      connected: Boolean(session.canva),
      status: "available",
    });
  }

  res.status(200).json({
    success: true,
    id: app.id,
    name: app.name,
    connected: app.connected,
    status: app.status,
  });
});

/*
|--------------------------------------------------------------------------
| GET /api/apps/canva/connect
|--------------------------------------------------------------------------
|
| Starts Canva OAuth using PKCE.
|
*/

router.get("/canva/connect", (req, res) => {
  const clientId = process.env.CANVA_CLIENT_ID;
  const redirectUri = process.env.CANVA_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return res.status(500).json({
      success: false,
      message:
        "Canva environment variables are not configured.",
    });
  }

  const { session } = getOrCreateSession(req, res);

  const state = crypto
    .randomBytes(32)
    .toString("base64url");

  const codeVerifier = crypto
    .randomBytes(64)
    .toString("base64url");

  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  /*
   * Request only the permissions LR AI needs.
   *
   * design:content:write = create designs
   * design:content:read  = read design content
   * design:meta:read     = read design metadata
   * profile:read         = identify/read the connected Canva account
   */
  const scope = [
    "design:content:read",
    "design:content:write",
    "design:meta:read",
    "profile:read",
  ].join(" ");

  session.pendingCanva = {
    state,
    codeVerifier,
    createdAt: Date.now(),
  };

  const authorizationUrl =
    new URL(
      "https://www.canva.com/api/oauth/authorize"
    );

  authorizationUrl.searchParams.set(
    "code_challenge",
    codeChallenge
  );

  authorizationUrl.searchParams.set(
    "code_challenge_method",
    "s256"
  );

  authorizationUrl.searchParams.set(
    "scope",
    scope
  );

  authorizationUrl.searchParams.set(
    "response_type",
    "code"
  );

  authorizationUrl.searchParams.set(
    "client_id",
    clientId
  );

  authorizationUrl.searchParams.set(
    "state",
    state
  );

  authorizationUrl.searchParams.set(
    "redirect_uri",
    redirectUri
  );

  res.redirect(
    authorizationUrl.toString()
  );
});

/*
|--------------------------------------------------------------------------
| GET /api/apps/canva/callback
|--------------------------------------------------------------------------
|
| Canva sends the user back here after authorization.
|
*/

router.get("/canva/callback", async (req, res) => {
  const frontendUrl =
    process.env.FRONTEND_URL ||
    "https://lragrosense.in";

  const code = req.query.code;
  const state = req.query.state;
  const error = req.query.error;

  const sessionId = getCookie(
    req,
    "lr_ai_session"
  );

  const session = sessionId
    ? sessions.get(sessionId)
    : null;

  if (error) {
    console.error(
      "Canva authorization error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/?canva=error`
    );
  }

  if (!code || !state) {
    return res.redirect(
      `${frontendUrl}/?canva=error`
    );
  }

  if (!session || !session.pendingCanva) {
    console.error(
      "Canva OAuth session not found."
    );

    return res.redirect(
      `${frontendUrl}/?canva=error`
    );
  }

  /*
   * Verify OAuth state.
   */

  if (
    state !==
    session.pendingCanva.state
  ) {
    console.error(
      "Canva OAuth state mismatch."
    );

    session.pendingCanva = null;

    return res.redirect(
      `${frontendUrl}/?canva=error`
    );
  }

  /*
   * Prevent very old OAuth requests.
   */

  const requestAge =
    Date.now() -
    session.pendingCanva.createdAt;

  if (requestAge > 10 * 60 * 1000) {
    console.error(
      "Canva OAuth request expired."
    );

    session.pendingCanva = null;

    return res.redirect(
      `${frontendUrl}/?canva=error`
    );
  }

  const codeVerifier =
    session.pendingCanva.codeVerifier;

  session.pendingCanva = null;

  try {
    const clientId =
      process.env.CANVA_CLIENT_ID;

    const clientSecret =
      process.env.CANVA_CLIENT_SECRET;

    const redirectUri =
      process.env.CANVA_REDIRECT_URI;

    if (
      !clientId ||
      !clientSecret ||
      !redirectUri
    ) {
      throw new Error(
        "Canva credentials are missing from environment variables."
      );
    }

    /*
     * Canva requires backend authentication
     * using Client ID + Client Secret.
     */

    const basicCredentials =
      Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64");

    const body =
      new URLSearchParams();

    body.set(
      "grant_type",
      "authorization_code"
    );

    body.set(
      "code_verifier",
      codeVerifier
    );

    body.set(
      "code",
      code
    );

    body.set(
      "redirect_uri",
      redirectUri
    );

    const tokenResponse =
      await fetch(
        "https://api.canva.com/rest/v1/oauth/token",
        {
          method: "POST",
          headers: {
            Authorization:
              `Basic ${basicCredentials}`,
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body,
        }
      );

    const tokenData =
      await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error(
        "Canva token exchange failed:",
        tokenData
      );

      throw new Error(
        "Canva token exchange failed."
      );
    }

    /*
     * Store the token only on the backend.
     * Never send Client Secret or refresh token
     * to the browser.
     */

    session.canva = {
      accessToken:
        tokenData.access_token,

      refreshToken:
        tokenData.refresh_token || null,

      expiresIn:
        tokenData.expires_in || null,

      expiresAt:
        tokenData.expires_in
          ? Date.now() +
            tokenData.expires_in * 1000
          : null,

      scope:
        tokenData.scope || null,

      connectedAt:
        new Date().toISOString(),
    };

    console.log(
      "Canva connected successfully."
    );

    return res.redirect(
      `${frontendUrl}/?canva=connected`
    );
  } catch (error) {
    console.error(
      "Canva OAuth callback error:",
      error
    );

    return res.redirect(
      `${frontendUrl}/?canva=error`
    );
  }
});

/*
|--------------------------------------------------------------------------
| POST /api/apps/canva/disconnect
|--------------------------------------------------------------------------
*/

router.post(
  "/canva/disconnect",
  (req, res) => {
    const sessionId =
      getCookie(
        req,
        "lr_ai_session"
      );

    const session =
      sessionId
        ? sessions.get(sessionId)
        : null;

    if (session) {
      session.canva = null;
    }

    res.status(200).json({
      success: true,
      message:
        "Canva disconnected.",
    });
  }
);

export default router;
