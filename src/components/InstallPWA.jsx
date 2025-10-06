// src/components/InstallPWA.jsx
import { useEffect, useMemo, useState } from "react";

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(
    () => localStorage.getItem("pwa-installed") === "1"
  );
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Are we already running as an installed app?
  const isStandalone = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia?.("(display-mode: standalone)")?.matches ||
      // iOS Safari
      window.navigator.standalone === true
    );
  }, []);

  // Listen for the install prompt
  useEffect(() => {
    const saveInstalled = () => {
      localStorage.setItem("pwa-installed", "1");
      setInstalled(true);
      setShowInstallPrompt(false);
    };

    const onBIP = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", saveInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", saveInstalled);
    };
  }, []);

  // If already running in standalone, show nothing
  if (isStandalone) return null;

  const installApp = async () => {
    if (!deferredPrompt) {
      // No prompt (iOS or not eligible). You could show iOS A2HS tip here.
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      // We also rely on 'appinstalled', but set a soft flag just in case.
      localStorage.setItem("pwa-installed", "1");
      setInstalled(true);
    }
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  const openInstalledApp = () => {
    // Attempt to open the installed app via link-capturing.
    // (Works on Chromium with manifest `capture_links`.)
    const url = new URL("/", window.location.origin);
    url.searchParams.set("open", Date.now().toString());
    window.location.assign(url.toString());
  };

  // Show “Install App” button if we have a prompt
  // Show “Open App” if we believe the app is installed but not in standalone
  const showOpen = installed && !isStandalone;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
      }}
    >
      {!showOpen && showInstallPrompt && (
        <>
          <button
            onClick={installApp}
            style={{
              background: "transparent",
              border: "none",
              borderRadius: "50%",
              width: 56,
              height: 56,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,.15)",
              backgroundColor: "white",
            }}
            title="Install App"
            aria-label="Install App"
          >
            <img
              src="/download.gif"
              alt="Install"
              style={{
                width: "120%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </button>
          <span
            style={{
              color: "#6b21a8",
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: "white",
              padding: "2px 8px",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            Install App
          </span>
        </>
      )}

      {showOpen && (
        <>
          <button
            onClick={openInstalledApp}
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 9999,
              padding: "10px 14px",
              cursor: "pointer",
              fontWeight: 700,
              boxShadow: "0 2px 10px rgba(0,0,0,.12)",
            }}
            title="Open Installed App"
            aria-label="Open Installed App"
          >
            Open App
          </button>
          <span
            style={{
              color: "#334155",
              fontSize: 11,
              backgroundColor: "white",
              padding: "2px 8px",
              borderRadius: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            }}
          >
            Launch installed app
          </span>
        </>
      )}
    </div>
  );
}
