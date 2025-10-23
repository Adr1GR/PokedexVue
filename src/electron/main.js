import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = !app.isPackaged;
const DEV_URL =
  process.env.VITE_DEV_SERVER_URL ||
  process.env.ELECTRON_RENDERER_URL ||
  "http://localhost:5173/";

if (!app.requestSingleInstanceLock()) app.quit();

function createWin() {
  const preloadPath = existsSync(join(__dirname, "preload.cjs"))
    ? join(__dirname, "preload.cjs")
    : join(__dirname, "preload.js");

  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("render-process-gone", (_e, details) => {
    console.error("render-process-gone:", details);
  });
  win.once("ready-to-show", () => win.show());

  const loadDist = () => {
    const indexPath = join(app.getAppPath(), "dist", "index.html");
    win.loadFile(indexPath);  // seguro tanto en dev como AppImage
  };

  if (isDev) {
    let attemptedDev = true;
    win.webContents.once("did-fail-load", () => {
      if (attemptedDev) {
        attemptedDev = false;
        loadDist();
      }
    });
    win.loadURL(DEV_URL).catch(() => loadDist());
  } else {
    loadDist();
  }
}

async function setupDevReload() {
  if (!isDev) return;
  try {
    const { default: chokidar } = await import("chokidar");
    const watcher = chokidar.watch(
      [join(__dirname, "../src"), join(__dirname, "preload.js"), join(__dirname, "preload.cjs")],
      { ignoreInitial: true }
    );
    watcher.on("change", async (file) => {
      if (file.endsWith("preload.js") || file.endsWith("preload.cjs")) {
        app.relaunch();
        app.exit(0);
        return;
      }
      for (const w of BrowserWindow.getAllWindows()) {
        try {
          await w.webContents.session.clearCache();
          w.webContents.reloadIgnoringCache();
        } catch (err) {
          console.error("Error reloading window:", err);
        }
      }
    });
  } catch (err) {
    console.warn("chokidar watcher not available:", err?.message || err);
  }
}

app.whenReady().then(async () => {
  await setupDevReload();
  createWin();
});

app.on("second-instance", () => {
  const [win] = BrowserWindow.getAllWindows();
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWin(); });
