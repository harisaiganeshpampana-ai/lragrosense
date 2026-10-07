import express from "express";
import crypto from "crypto";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| LR AI Apps
|--------------------------------------------------------------------------
*/

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
      "Connect your LR AgroSense farm data with LR AI.",
    category: "Agriculture",
    status: "native",
    connected: true,
  },
  {
    id: "crop-doctor",
    name: "Crop Doctor",
    description:
      "Analyze crop symptoms and agricultural observations.",
    category: "Agriculture",
    status: "native",
    connected: true,
  },
  {
    id: "agricultural-data",
    name: "Agricultural Data",
    description:
      "Work with agricultural datasets and information.",
    category: "Agriculture",
    status: "coming",
    connected: false,
  },
];

/*
|--------------------------------------------------------------------------
| Temporary session storage
|--------------------------------------------------------------------------
|
| This is for the first integration test.
|
| IMPORTANT:
| Tokens are stored in server memory.
| A Render restart/redeploy will remove the connection.
|
| Later we should move this to a real database.
|
*/

const sessions = new Map();

/*
|--------------------------------------------------------------------------
| Cookie helpers
|--------------------------------------------------------------------------
*/

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
  let sessionId = getCookie(
    req,
    "lr_ai_session"
  );

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
      )}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=604800`
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
  const { session } = getOrCreateSession(
    req,
    res
  );

  const responseApps = apps.map((app) => {
    if (app.id === "canva") {
      return {
        ...app,
        connected: Boolean(session.canva),
      };
    }

    return app;
  });

  res.status(200).json({
    success: true,
    apps: responseApps,
  });
});

/*
|--------------------------------------------------------------------------
| GET /api/apps/canva/connect
|--------------------------------------------------------------------------
|
| Starts Canva OAuth.
|
*/

router.get(
  "/canva/connect",
  (req, res) => {
    const clientId =
      process.env.CANVA_CLIENT_ID;

    const redirectUri =
      process.env.CANVA_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      console.error(
        "Canva environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Canva environment variables are not configured.",
      });
    }

    const { session } =
      getOrCreateSession(req, res);

    /*
     * OAuth state
     */

    const state =
      crypto.randomBytes(32).toString(
        "base64url"
      );

    /*
     * PKCE verifier
     */

    const codeVerifier =
      crypto.randomBytes(64).toString(
        "base64url"
      );

    /*
     * PKCE challenge
     */

    const codeChallenge =
      crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

    /*
     * Canva permissions.
     *
     * design:content:read
     * Read design contents.
     *
     * design:content:write
     * Create designs on behalf of the user.
     *
     * design:meta:read
     * Read design metadata.
     *
     * profile:read
     * Read Canva profile/account information.
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

    /*
     * Canva authorization URL
     */

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

    console.log(
      "Starting Canva OAuth..."
    );

    res.redirect(
      authorizationUrl.toString()
    );
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/apps/canva/callback
|--------------------------------------------------------------------------
|
| Canva redirects the user here after authorization.
|
*/

router.get(
  "/canva/callback",
  async (req, res) => {
    const frontendUrl =
      process.env.FRONTEND_APP_URL ||
      "https://lragrosense.in/lr-ai.html";

    const code = req.query.code;
    const state = req.query.state;
    const error = req.query.error;

    const sessionId =
      getCookie(
        req,
        "lr_ai_session"
      );

    const session =
      sessionId
        ? sessions.get(sessionId)
        : null;

    /*
     * User denied authorization.
     */

    if (error) {
      console.error(
        "Canva authorization error:",
        error
      );

      return res.redirect(
        `${frontendUrl}?canva=error`
      );
    }

    /*
     * Missing OAuth parameters.
     */

    if (!code || !state) {
      console.error(
        "Canva callback missing code or state."
      );

      return res.redirect(
        `${frontendUrl}?canva=error`
      );
    }

    /*
     * Session must exist.
     */

    if (
      !session ||
      !session.pendingCanva
    ) {
      console.error(
        "Canva OAuth session not found."
      );

      return res.redirect(
        `${frontendUrl}?canva=error`
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
        `${frontendUrl}?canva=error`
      );
    }

    /*
     * OAuth request expires after 10 minutes.
     */

    const requestAge =
      Date.now() -
      session.pendingCanva.createdAt;

    if (
      requestAge >
      10 * 60 * 1000
    ) {
      console.error(
        "Canva OAuth request expired."
      );

      session.pendingCanva = null;

      return res.redirect(
        `${frontendUrl}?canva=error`
      );
    }

    const codeVerifier =
      session.pendingCanva.codeVerifier;

    /*
     * OAuth state is one-time use.
     */

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
          "Canva credentials are missing."
        );
      }

      /*
       * Client authentication.
       *
       * Client ID + Client Secret stay on backend.
       */

      const basicCredentials =
        Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64");

      /*
       * Token request body.
       */

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

      /*
       * Exchange authorization code
       * for access + refresh tokens.
       */

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
       * Store tokens on backend only.
       */

      session.canva = {
        accessToken:
          tokenData.access_token,

        refreshToken:
          tokenData.refresh_token ||
          null,

        tokenType:
          tokenData.token_type ||
          "Bearer",

        expiresIn:
          tokenData.expires_in ||
          null,

        expiresAt:
          tokenData.expires_in
            ? Date.now() +
              tokenData.expires_in *
                1000
            : null,

        scope:
          tokenData.scope ||
          null,

        connectedAt:
          new Date().toISOString(),
      };

      console.log(
        "Canva connected successfully."
      );

      return res.redirect(
        `${frontendUrl}?canva=connected`
      );
    } catch (error) {
      console.error(
        "Canva OAuth callback error:",
        error
      );

      return res.redirect(
        `${frontendUrl}?canva=error`
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/apps/canva/status
|--------------------------------------------------------------------------
*/

router.get(
  "/canva/status",
  (req, res) => {
    const { session } =
      getOrCreateSession(req, res);

    res.status(200).json({
      success: true,
      id: "canva",
      name: "Canva",
      connected: Boolean(
        session.canva
      ),
      status: "available",
    });
  }
);

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

/*
|--------------------------------------------------------------------------
| GET /api/apps/:id/status
|--------------------------------------------------------------------------
*/

router.get(
  "/:id/status",
  (req, res) => {
    const app = apps.find(
      (item) =>
        item.id === req.params.id
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    if (req.params.id === "canva") {
      const { session } =
        getOrCreateSession(
          req,
          res
        );

      return res.status(200).json({
        success: true,
        id: "canva",
        name: "Canva",
        connected: Boolean(
          session.canva
        ),
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
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/apps/:id
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  (req, res) => {
    const app = apps.find(
      (item) =>
        item.id === req.params.id
    );

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "App not found",
      });
    }

    if (app.id === "canva") {
      const { session } =
        getOrCreateSession(
          req,
          res
        );

      return res.status(200).json({
        success: true,
        app: {
          ...app,
          connected: Boolean(
            session.canva
          ),
        },
      });
    }

    res.status(200).json({
      success: true,
      app,
    });
  }
);

export default router;
