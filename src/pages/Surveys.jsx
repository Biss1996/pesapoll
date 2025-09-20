// src/pages/Surveys.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SurveyList from "../components/SurveyList";
import PremiumModal from "../components/PremiumModal";
import {
  getUser,
  listSurveysForUser,
  ensureNotCompleted,
  KEYS,
} from "../lib/surveys";

export default function Surveys() {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);
  const [pendingSurvey, setPendingSurvey] = useState(null);

  const isPremiumUser = () => {
    const u = getUser();
    return u?.plan === "premium" || ["gold", "silver", "platinum"].includes(u?.tier);
  };

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const list = await listSurveysForUser(); // should mark {completed} per user
      setSurveys(list);
      setErr("");
    } catch (e) {
      setErr(e?.message || "Failed to load surveys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // redirect to login if no user
    const u = getUser();
    if (!u?.id) {
      navigate("/login", { replace: true });
      return;
    }
    load();
  }, [load, navigate]);

  // 🔄 Refresh when completions or versions change (any tab) or when tab regains focus
  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === KEYS.SURVEYS_VERSION_KEY || e?.key === KEYS.COMPLETIONS_KEY) {
        load();
      }
    };
    const onFocus = () => load();
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  function handleStart(s) {
    // Hard guard: do not allow starting a completed survey
    try {
      ensureNotCompleted(s.id);
    } catch (e) {
      alert(e?.message || "This survey is already completed and cannot be taken again.");
      return;
    }

    // Premium gating
    if (!s.premium || isPremiumUser()) {
      // ✅ Correct route (make sure you have <Route path="/surveys/:id" ... />)
      navigate(`/surveys/${s.id}`);
      return;
    }
    setPendingSurvey(s);
    setShowPaywall(true);
  }

  function handleUpgrade() {
    setShowPaywall(false);
    // Send to packages page; after upgrade you can route back to pending survey if you store state
    navigate("/packages");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-5 shadow-sm">
        <h3 className="text-lg font-semibold">Surveys For You Today</h3>
        <p className="mt-3 inline-flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">
          <span className="text-base">🔒</span>
          Surveys are automatically filtered based on your location
        </p>

        <div className="mt-5">
          {loading && <div className="text-sm text-slate-600">Loading…</div>}
          {!loading && err && <div className="text-sm text-rose-600">{err}</div>}
          {!loading && !err && (
            <SurveyList surveys={surveys} onStart={handleStart} />
          )}
          {!loading && !err && surveys.length === 0 && (
            <p className="text-sm text-slate-600 mt-3">No surveys available right now.</p>
          )}
        </div>
      </div>

      <PremiumModal
        open={showPaywall}
        onClose={() => setShowPaywall(false)}
        onUpgrade={handleUpgrade}
        // optionally pass context:
        survey={pendingSurvey || null}
      />
    </div>
  );
}
