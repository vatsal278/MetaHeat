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
  app2.get("/api/tokens/solana", async (_req, res) => {
    try {
      const response = await fetch("https://api.dexscreener.com/latest/dex/tokens/solana");
      if (!response.ok) {
        throw new Error(`DexScreener API responded with status: ${response.status}`);
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching Solana tokens:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch token data from DexScreener"
      });
    }
  });
  function determineNetwork(coinId, symbol) {
    const id = coinId.toLowerCase();
    const sym = symbol.toLowerCase();
    const networkMap = {
      // Bitcoin ecosystem
      "bitcoin": "Bitcoin",
      "btc": "Bitcoin",
      // Ethereum ecosystem
      "ethereum": "Ethereum",
      "eth": "Ethereum",
      "usdt": "Ethereum",
      // Tether
      "usdc": "Ethereum",
      // USD Coin
      "dai": "Ethereum",
      "shiba-inu": "Ethereum",
      "shib": "Ethereum",
      "chainlink": "Ethereum",
      "link": "Ethereum",
      "uniswap": "Ethereum",
      "uni": "Ethereum",
      "wrapped-bitcoin": "Ethereum",
      "wbtc": "Ethereum",
      "pepe": "Ethereum",
      "floki": "Ethereum",
      "apecoin": "Ethereum",
      "ape": "Ethereum",
      // Binance ecosystem
      "binancecoin": "BSC",
      "bnb": "BSC",
      "cake": "BSC",
      // Solana ecosystem
      "solana": "Solana",
      "sol": "Solana",
      "bonk": "Solana",
      "dogwifhat": "Solana",
      "wif": "Solana",
      "samoyedcoin": "Solana",
      "samo": "Solana",
      // Other major blockchains
      "cardano": "Cardano",
      "ada": "Cardano",
      "polkadot": "Polkadot",
      "dot": "Polkadot",
      "polygon": "Polygon",
      "matic": "Polygon",
      "avalanche-2": "Avalanche",
      "avax": "Avalanche",
      "cosmos": "Cosmos",
      "atom": "Cosmos",
      "ripple": "Ripple",
      "xrp": "Ripple",
      "dogecoin": "Dogecoin",
      "doge": "Dogecoin",
      "litecoin": "Litecoin",
      "ltc": "Litecoin",
      "near": "NEAR",
      "filecoin": "Filecoin",
      "fil": "Filecoin",
      "algorand": "Algorand",
      "algo": "Algorand",
      "terra-luna": "Terra",
      "luna": "Terra"
    };
    if (networkMap[id]) {
      return networkMap[id];
    }
    if (networkMap[sym]) {
      return networkMap[sym];
    }
    if (id.includes("shib") || id.includes("floki") || id.includes("elon") || id.includes("doge") && !id.includes("solana") || id.includes("pepe")) {
      return "Ethereum";
    }
    if (id.includes("sol") || id.includes("bonk") || id.includes("samo") || id.includes("wif")) {
      return "Solana";
    }
    return "Multi-chain";
  }
  app2.get("/api/tokens/trending", async (_req, res) => {
    try {
      try {
        const coinGeckoUrl = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8e3);
        const coinGeckoResponse = await fetch(coinGeckoUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (coinGeckoResponse.ok) {
          const coinGeckoData = await coinGeckoResponse.json();
          const processedPairs = coinGeckoData.slice(0, 30).map((coin, index) => {
            let network = determineNetwork(coin.id, coin.symbol);
            const priceChangePercent = coin.price_change_percentage_24h;
            const formattedPriceChange = priceChangePercent >= 0 ? `+${priceChangePercent.toFixed(2)}` : priceChangePercent.toFixed(2);
            return {
              id: index.toString(),
              baseToken: {
                name: coin.name,
                symbol: coin.symbol.toUpperCase()
              },
              chainId: network.toLowerCase(),
              chainName: network,
              priceUsd: coin.current_price.toString(),
              priceChange: {
                h24: formattedPriceChange,
                // Estimate 6h and 12h data proportionally
                h6: (priceChangePercent / 4).toFixed(2).toString(),
                h12: (priceChangePercent / 2).toFixed(2).toString()
              },
              volume: {
                h24: coin.total_volume.toString(),
                h6: (coin.total_volume / 4).toString(),
                h12: (coin.total_volume / 2).toString()
              },
              liquidity: {
                usd: (coin.total_volume / 5).toString()
                // Estimate liquidity as 1/5 of volume
              },
              fdv: coin.market_cap.toString(),
              pairAddress: coin.id,
              url: `https://www.coingecko.com/en/coins/${coin.id}`
            };
          });
          console.log("CoinGecko API request successful, returning real-time data");
          return res.status(200).json({
            success: true,
            pairs: processedPairs
          });
        }
        console.log(`CoinGecko API responded with status: ${coinGeckoResponse.status}, falling back to backup data`);
      } catch (error) {
        console.log(`Error fetching from CoinGecko: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
      const backupTokenData = generateBackupTokenData();
      return res.status(200).json({
        success: true,
        pairs: backupTokenData
      });
    } catch (error) {
      console.error("Error fetching trending tokens:", error instanceof Error ? error.message : "Unknown error");
      return res.status(500).json({
        success: false,
        message: "Failed to fetch token data"
      });
    }
  });
  function generateBackupTokenData() {
    const tokens = [
      { symbol: "BTC", name: "Bitcoin", price: "58432.21", change: "+2.3", volume: "12500000000", network: "Bitcoin" },
      { symbol: "ETH", name: "Ethereum", price: "3105.65", change: "+1.8", volume: "8970000000", network: "Ethereum" },
      { symbol: "SOL", name: "Solana", price: "123.45", change: "+8.7", volume: "3860000000", network: "Solana" },
      { symbol: "BNB", name: "Binance Coin", price: "567.82", change: "+0.9", volume: "2340000000", network: "BSC" },
      { symbol: "ADA", name: "Cardano", price: "1.23", change: "-2.1", volume: "1950000000", network: "Cardano" },
      { symbol: "XRP", name: "Ripple", price: "0.65", change: "+1.2", volume: "1680000000", network: "Ripple" },
      { symbol: "AVAX", name: "Avalanche", price: "35.67", change: "+5.4", volume: "1420000000", network: "Avalanche" },
      { symbol: "DOT", name: "Polkadot", price: "15.78", change: "-0.8", volume: "1180000000", network: "Polkadot" },
      { symbol: "MATIC", name: "Polygon", price: "0.98", change: "+4.6", volume: "927000000", network: "Polygon" },
      { symbol: "DOGE", name: "Dogecoin", price: "0.123", change: "+12.3", volume: "835000000", network: "Dogecoin" },
      { symbol: "SHIB", name: "Shiba Inu", price: "0.00002846", change: "+18.5", volume: "780000000", network: "Ethereum" },
      { symbol: "LINK", name: "Chainlink", price: "14.39", change: "+2.7", volume: "650000000", network: "Ethereum" },
      { symbol: "UNI", name: "Uniswap", price: "8.56", change: "-1.3", volume: "620000000", network: "Ethereum" },
      { symbol: "ATOM", name: "Cosmos", price: "12.18", change: "+3.9", volume: "580000000", network: "Cosmos" },
      { symbol: "DAI", name: "Dai", price: "1.00", change: "+0.01", volume: "560000000", network: "Ethereum" },
      { symbol: "USDC", name: "USD Coin", price: "1.00", change: "+0.00", volume: "540000000", network: "Ethereum" },
      { symbol: "LUNA", name: "Terra", price: "0.0002", change: "-5.8", volume: "520000000", network: "Terra" },
      { symbol: "NEAR", name: "NEAR Protocol", price: "5.68", change: "+7.6", volume: "485000000", network: "NEAR" },
      { symbol: "FIL", name: "Filecoin", price: "6.23", change: "+1.4", volume: "460000000", network: "Filecoin" },
      { symbol: "ALGO", name: "Algorand", price: "0.35", change: "-0.9", volume: "440000000", network: "Algorand" },
      { symbol: "APE", name: "ApeCoin", price: "3.28", change: "+24.5", volume: "412000000", network: "Ethereum" },
      { symbol: "BONK", name: "Bonk", price: "0.00002134", change: "+31.2", volume: "385000000", network: "Solana" },
      { symbol: "WIF", name: "Dogwifhat", price: "0.68", change: "+14.7", volume: "374000000", network: "Solana" },
      { symbol: "PEPE", name: "Pepe", price: "0.00000987", change: "+17.9", volume: "350000000", network: "Ethereum" },
      { symbol: "BORK", name: "BorkToken", price: "0.07", change: "+28.3", volume: "328000000", network: "Solana" },
      { symbol: "WOJAK", name: "Wojak", price: "0.00001345", change: "+16.2", volume: "315000000", network: "Ethereum" },
      { symbol: "FLOKI", name: "Floki Inu", price: "0.0002134", change: "+9.3", volume: "297000000", network: "Ethereum" },
      { symbol: "MEME", name: "MemeToken", price: "0.0425", change: "+21.4", volume: "285000000", network: "Ethereum" },
      { symbol: "CAT", name: "CatCoin", price: "0.00005678", change: "+13.1", volume: "268000000", network: "BSC" },
      { symbol: "POPCAT", name: "PopCat", price: "0.00008765", change: "+11.7", volume: "255000000", network: "Solana" }
    ];
    return tokens.map((token, index) => {
      const volume = parseFloat(token.volume);
      const priceChange = parseFloat(token.change);
      return {
        id: index.toString(),
        baseToken: {
          name: token.name,
          symbol: token.symbol
        },
        chainId: token.network.toLowerCase(),
        chainName: token.network,
        priceUsd: token.price,
        priceChange: {
          h24: token.change,
          h6: (priceChange / 4).toFixed(2).toString(),
          h12: (priceChange / 2).toFixed(2).toString()
        },
        volume: {
          h24: volume.toString(),
          h6: (volume / 4).toString(),
          h12: (volume / 2).toString()
        },
        liquidity: {
          usd: (volume / 5).toString()
        },
        fdv: (parseFloat(token.price) * 1e9).toString(),
        pairAddress: `${token.symbol}USDT`,
        url: `https://www.binance.com/en/trade/${token.symbol}_USDT`
      };
    });
  }
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
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@db": path.resolve(import.meta.dirname, "db"),
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
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
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
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
  const distPath = path2.resolve(import.meta.dirname, "public");
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
