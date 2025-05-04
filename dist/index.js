// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";
var earlyAccessUsers = [];
var nextId = 1;
async function registerRoutes(app2) {
  app2.post("/api/wallet/connect", async (req, res) => {
    try {
      const { walletAddress, email } = req.body;
      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: "Wallet address is required"
        });
      }
      const existingUserIndex = earlyAccessUsers.findIndex(
        (user) => user.walletAddress === walletAddress
      );
      if (existingUserIndex !== -1) {
        earlyAccessUsers[existingUserIndex] = {
          ...earlyAccessUsers[existingUserIndex],
          hasRequestedAccess: true,
          ...email ? { email } : {}
        };
        return res.status(200).json({
          success: true,
          message: "Wallet already registered for early access",
          isEarlyAccess: true
        });
      }
      const newUser = {
        id: nextId++,
        walletAddress,
        email: email || null,
        hasRequestedAccess: true,
        joinedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      earlyAccessUsers.push(newUser);
      return res.status(201).json({
        success: true,
        message: "Wallet connected and early access requested successfully",
        isEarlyAccess: true,
        user: {
          id: newUser.id,
          walletAddress: newUser.walletAddress,
          joinedAt: newUser.joinedAt
        }
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error processing wallet connection"
      });
    }
  });
  app2.get("/api/wallet/status/:address", async (req, res) => {
    try {
      const { address } = req.params;
      if (!address) {
        return res.status(400).json({
          success: false,
          message: "Wallet address is required"
        });
      }
      const user = earlyAccessUsers.find((user2) => user2.walletAddress === address);
      if (!user) {
        return res.status(200).json({
          success: true,
          isEarlyAccess: false,
          message: "Wallet not registered for early access"
        });
      }
      return res.status(200).json({
        success: true,
        isEarlyAccess: true,
        message: "Wallet is registered for early access",
        joinedAt: user.joinedAt
      });
    } catch (error) {
      console.error("Error checking wallet status:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error checking wallet status"
      });
    }
  });
  app2.get("/api/admin/early-access-users", async (_req, res) => {
    try {
      const sortedUsers = [...earlyAccessUsers].sort((a, b) => {
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      });
      return res.status(200).json({
        success: true,
        count: sortedUsers.length,
        users: sortedUsers.map((user) => ({
          id: user.id,
          walletAddress: user.walletAddress,
          joinedAt: user.joinedAt,
          hasRequestedAccess: user.hasRequestedAccess,
          email: user.email || "Not provided"
        }))
      });
    } catch (error) {
      console.error("Error fetching early access users:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error fetching early access users"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@db": path.resolve(__dirname, "db"),
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      crypto: "crypto"
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(__dirname2, "..", "client", "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
