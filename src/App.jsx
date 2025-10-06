// src/App.jsx
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState, useRef } from "react";
import { useAdmin } from "./context/AdminContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Surveys from "./pages/Surveys";
import SurveyFlow from "./pages/SurveyFlow";
import Register from "./pages/Register";
import Packages from "./pages/Packages";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import InstallPWA from "./components/InstallPWA";
import AddSurvey from "./pages/AddSurvey";
import SurveyManager from "./pages/SurveyManager";
import AdminLogin from "./pages/AdminLogin";

/* --- guard: some routes require a signed-in user --- */
function isSignedIn() {
  try {
    const u = JSON.parse(localStorage.getItem("app:user") || "null");
    return !!(u && u.id);
  } catch {
    return false;
  }
}
function ProtectedRoute({ children }) {
  return isSignedIn() ? children : <Navigate to="/login" replace />;
}

/* ---------- API base (dev via Vite proxy, prod on Vercel) ---------- */
const API_ROOT = "/api/mock";
const SURVEYS_URL = `${API_ROOT}/surveys`;

/* ---------- Randomized "Withdrawal" toast helpers ---------- */
const kesFmt = new Intl.NumberFormat("en-KE", {
  style: "currency",
  currency: "KES",
  maximumFractionDigits: 0,
});
const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[ri(0, arr.length - 1)];
function randomMaskedMsisdn() {
  const last3 = String(ri(0, 999)).padStart(3, "0");
  const mid = pick(["XX", "XY", "XZ", "9X"]);
  return `2547${mid}****${last3}`;
}
function randomAmount() {
  const base = ri(10, 100) * 50;
  return pick([2500, base, base]);
}
function randomRef() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const d = () => ri(0, 9);
  const L = () => letters[ri(0, letters.length - 1)];
  return `TX${d()}${d()}${d()}${d()}${L()}${L()}`;
}
function pushRandomWithdrawalToast() {
  const msisdn = randomMaskedMsisdn();
  const amount = randomAmount();
  const balance = ri(0, 100);
  const ref = randomRef();
  toast(
    <div className="rounded-xl">
      <div className="text-slate-900 font-bold">Withdrawal</div>
      <div className="mt-1 text-slate-700">
        <span className="font-mono tracking-tight">{msisdn}</span> has withdrawn{" "}
        <span className="font-semibold">{kesFmt.format(amount)}</span>. New balance:{" "}
        <span className="font-semibold">{kesFmt.format(balance)}</span>. Ref.{" "}
        <span className="font-mono">{ref}</span>
      </div>
    </div>,
    {
      className: "rounded-xl border border-amber-200 shadow-lg bg-white !text-slate-800",
      autoClose: 4500,
      closeOnClick: true,
      pauseOnHover: true,
      hideProgressBar: true,
    }
  );
}

function App() {
  const [surveysAdmin, setSurveysAdmin] = useState([]);
  const { isAdmin } = useAdmin();

  /* ---------- Safe JSON fetch helper ----------
     - cache-busts & sets no-store to avoid SW
     - parses JSON even if header missing
     - logs small response preview for debugging
  -------------------------------------------- */
  async function fetchJson(url) {
    const withBust = url.includes("?") ? `${url}&_=${Date.now()}` : `${url}?_=${Date.now()}`;
    const res = await fetch(withBust, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const body = await res.text();
    const ct = (res.headers.get("content-type") || "").toLowerCase();

    if (!res.ok) {
      console.error("HTTP error", {
        url: res.url,
        status: res.status,
        ct,
        preview: body.slice(0, 200),
      });
      throw new Error(`HTTP ${res.status}`);
    }

    if (ct.includes("json")) {
      try {
        return JSON.parse(body);
      } catch (e) {
        console.warn("JSON header present but parse failed, trying salvage:", e);
      }
    }

    const trimmed = body.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed);
      } catch (e) {
        console.error("Salvage parse failed", { url: res.url, preview: trimmed.slice(0, 200) });
      }
    }

    console.error("Non-JSON response", { url: res.url, ct, preview: body.slice(0, 200) });
    throw new Error("Not JSON");
  }

  /* ---------- Load surveys (collection first, then fallback to full DB) ---------- */
  useEffect(() => {
    (async () => {
      try {
        let list = [];

        // Try the collection endpoint first
        try {
          const data = await fetchJson(SURVEYS_URL);
          list = Array.isArray(data) ? data : Array.isArray(data?.surveys) ? data.surveys : [];
        } catch (e) {
          console.warn("Primary /surveys fetch failed, attempting /api/mock fallback:", e);
        }

        // Fallback to whole DB at /api/mock
        if (!Array.isArray(list) || list.length === 0) {
          const db = await fetchJson(API_ROOT);
          list = Array.isArray(db?.surveys) ? db.surveys : [];
        }

        setSurveysAdmin(list);
      } catch (err) {
        console.error("Fetch surveys failed:", err);
        toast.error("Failed to fetch surveys");
      }
    })();
  }, []);

  /* ---------- Fun ticker for random toasts ---------- */
  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    const tick = () => {
      if (document.visibilityState === "visible") {
        pushRandomWithdrawalToast();
      }
    };
    const id = setInterval(tick, 15000);
    return () => clearInterval(id);
  }, []);

  /* ---------- Admin actions (read-only on mock in prod) ---------- */
  async function addSurvey(newSurvey) {
    try {
      const res = await fetch(SURVEYS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(newSurvey),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) throw new Error("Not JSON");
      const data = await res.json();
      setSurveysAdmin((prev) => [data, ...prev]);
      toast.success("Survey added successfully");
    } catch {
      toast.error("Failed to add survey (needs a real backend/json-server).");
    }
  }

  async function updateSurvey(updatedSurvey) {
    try {
      const res = await fetch(`${SURVEYS_URL}/${updatedSurvey.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(updatedSurvey),
      });
      const ct = res.headers.get("content-type") || "";
      if (!res.ok || !ct.includes("application/json")) throw new Error("Not JSON");
      const data = await res.json();
      setSurveysAdmin((prev) => prev.map((s) => (s.id === data.id ? data : s)));
      toast.success("Survey updated successfully");
    } catch {
      toast.error("Failed to update survey (needs a real backend/json-server).");
    }
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(800px_500px_at_90%_0%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom,#f8fafc,#eef2ff)]">
      <Navbar />
      <main className="flex-grow w-full max-w-screen-2xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/home" element={<Surveys />} />
          <Route path="/survey/:id" element={<ProtectedRoute><SurveyFlow /></ProtectedRoute>} />
          <Route path="/surveys/:id" element={<ProtectedRoute><SurveyFlow /></ProtectedRoute>} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/add-survey"
            element={isAdmin ? <AddSurvey addSurvey={addSurvey} /> : <Navigate to="/admin-login" replace />}
          />
          <Route
            path="/surveys/manage"
            element={
              isAdmin ? (
                <SurveyManager
                  surveys={surveysAdmin}
                  updateSurvey={updateSurvey}
                  setSurveys={setSurveysAdmin}
                />
              ) : (
                <Navigate to="/admin-login" replace />
              )
            }
          />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <InstallPWA />
      <ToastContainer position="top-right" autoClose={4500} hideProgressBar />
    </div>
  );
}

export default App;
