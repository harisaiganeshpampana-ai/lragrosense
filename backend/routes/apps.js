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
    description:
      "Access and organize files stored in Google Drive.",
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
| CANVA CONNECTION STORAGE
|--------------------------------------------------------------------------
|
| Browser:
|   Stores only an anonymous random client session ID.
|
| Backend:
|   Stores Canva access/refresh tokens.
|
| Canva tokens are NEVER sent to the browser.
|
| NOTE:
| This Map is temporary prototype storage.
| Render restart/redeploy will clear connections.
| Production should use a database.
|
*/

const canvaConnections = new Map();

const pendingOAuth = new Map();

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

function createRandomId(bytes = 32) {
  return crypto
    .randomBytes(bytes)
    .toString("base64url");
}

function isValidClientSession(value) {
  return (
    typeof value === "string" &&
    value.length >= 32 &&
    value.length <= 200 &&
    /^[A-Za-z0-9_-]+$/.test(value)
  );
}

function getFrontendUrl() {
  const configured =
    process.env.FRONTEND_APP_URL ||
    process.env.FRONTEND_URL ||
    "https://lragrosense.in/lr-ai.html";

  try {
    const url = new URL(configured);

    /*
     * Only allow the LR AgroSense website.
     */

    if (
      url.hostname !== "lragrosense.in" &&
      url.hostname !== "www.lragrosense.in"
    ) {
      return "https://lragrosense.in/lr-ai.html";
    }

    return url.toString();
  } catch {
    return "https://lragrosense.in/lr-ai.html";
  }
}

function redirectToFrontend(
  result,
  clientSession = null
) {
  const url =
    new URL(getFrontendUrl());

  url.searchParams.set(
    "canva",
    result
  );

  if (
    clientSession &&
    isValidClientSession(
      clientSession
    )
  ) {
    url.searchParams.set(
      "client_session",
      clientSession
    );
  }

  return url.toString();
}

/*
|--------------------------------------------------------------------------
| GET /api/apps
|--------------------------------------------------------------------------
*/

router.get("/", (req, res) => {
  const clientSession =
    req.query.client_session;

  const canvaConnected =
    isValidClientSession(
      clientSession
    ) &&
    Boolean(
      canvaConnections.get(
        clientSession
      )
    );

  const responseApps =
    apps.map((app) => {
      if (
        app.id === "canva"
      ) {
        return {
          ...app,
          connected:
            canvaConnected,
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
*/

router.get(
  "/canva/connect",
  (req, res) => {
    const clientId =
      process.env.CANVA_CLIENT_ID;

    const redirectUri =
      process.env.CANVA_REDIRECT_URI;

    const clientSession =
      req.query.client_session;

    if (
      !clientId ||
      !redirectUri
    ) {
      console.error(
        "Canva environment variables are missing."
      );

      return res.status(500).json({
        success: false,
        message:
          "Canva environment variables are not configured.",
      });
    }

    if (
      !isValidClientSession(
        clientSession
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Canva client session.",
      });
    }

    /*
     * OAuth state.
     */

    const state =
      createRandomId(48);

    /*
     * PKCE verifier.
     */

    const codeVerifier =
      createRandomId(64);

    /*
     * PKCE SHA-256 challenge.
     */

    const codeChallenge =
      crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

    /*
     * Save pending OAuth request.
     */

    pendingOAuth.set(
      state,
      {
        clientSession,
        codeVerifier,
        createdAt: Date.now(),
      }
    );

    /*
     * Canva scopes.
     */

    const scope = [
      "design:content:read",
      "design:content:write",
      "design:meta:read",
      "profile:read",
    ].join(" ");

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

    return res.redirect(
      authorizationUrl.toString()
    );
  }
);

/*
|--------------------------------------------------------------------------
| GET /api/apps/canva/callback
|--------------------------------------------------------------------------
*/

router.get(
  "/canva/callback",
  async (req, res) => {
    const code =
      req.query.code;

    const state =
      req.query.state;

    const error =
      req.query.error;

    /*
     * User denied authorization.
     */

    if (error) {
      console.error(
        "Canva authorization error:",
        error
      );

      return res.redirect(
        redirectToFrontend(
          "error"
        )
      );
    }

    /*
     * Missing parameters.
     */

    if (
      !code ||
      !state
    ) {
      console.error(
        "Canva callback missing code or state."
      );

      return res.redirect(
        redirectToFrontend(
          "error"
        )
      );
    }

    /*
     * Find pending OAuth request.
     */

    const pending =
      pendingOAuth.get(
        state
      );

    if (!pending) {
      console.error(
        "Canva OAuth state was not found."
      );

      return res.redirect(
        redirectToFrontend(
          "error"
        )
      );
    }

    /*
     * State is one-time use.
     */

    pendingOAuth.delete(
      state
    );

    const {
      clientSession,
      codeVerifier,
      createdAt,
    } = pending;

    /*
     * Expire OAuth after 10 minutes.
     */

    if (
      Date.now() -
        createdAt >
      10 * 60 * 1000
    ) {
      console.error(
        "Canva OAuth request expired."
      );

      return res.redirect(
        redirectToFrontend(
          "error",
          clientSession
        )
      );
    }

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
       * Canva token endpoint uses
       * HTTP Basic authentication.
       */

      const basicCredentials =
        Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString(
          "base64"
        );

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
       * Exchange authorization code.
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

      if (
        !tokenResponse.ok
      ) {
        console.error(
          "Canva token exchange failed:",
          tokenData
        );

        throw new Error(
          "Canva token exchange failed."
        );
      }

      /*
       * Store token ONLY on backend.
       */

      canvaConnections.set(
        clientSession,
        {
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
        }
      );

      console.log(
        "Canva connected successfully."
      );

      return res.redirect(
        redirectToFrontend(
          "connected",
          clientSession
        )
      );
    } catch (error) {
      console.error(
        "Canva OAuth callback error:",
        error
      );

      return res.redirect(
        redirectToFrontend(
          "error",
          clientSession
        )
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
    const clientSession =
      req.query.client_session;

    const connected =
      isValidClientSession(
        clientSession
      ) &&
      Boolean(
        canvaConnections.get(
          clientSession
        )
      );

    return res.status(200).json({
      success: true,
      id: "canva",
      name: "Canva",
      connected,
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
  express.json(),
  (req, res) => {
    const clientSession =
      req.body?.client_session;

    if (
      isValidClientSession(
        clientSession
      )
    ) {
      canvaConnections.delete(
        clientSession
      );
    }

    return res.status(200).json({
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
    const app =
      apps.find(
        (item) =>
          item.id ===
          req.params.id
      );

    if (!app) {
      return res.status(404).json({
        success: false,
        message:
          "App not found",
      });
    }

    if (
      req.params.id ===
      "canva"
    ) {
      const clientSession =
        req.query.client_session;

      const connected =
        isValidClientSession(
          clientSession
        ) &&
        Boolean(
          canvaConnections.get(
            clientSession
          )
        );

      return res.status(200).json({
        success: true,
        id: "canva",
        name: "Canva",
        connected,
        status: "available",
      });
    }

    return res.status(200).json({
      success: true,
      id: app.id,
      name: app.name,
      connected:
        app.connected,
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
    const app =
      apps.find(
        (item) =>
          item.id ===
          req.params.id
      );

    if (!app) {
      return res.status(404).json({
        success: false,
        message:
          "App not found",
      });
    }

    if (
      app.id === "canva"
    ) {
      const clientSession =
        req.query.client_session;

      const connected =
        isValidClientSession(
          clientSession
        ) &&
        Boolean(
          canvaConnections.get(
            clientSession
          )
        );

      return res.status(200).json({
        success: true,

        app: {
          ...app,
          connected,
        },
      });
    }

    return res.status(200).json({
      success: true,
      app,
    });
  }
);

export default router;
