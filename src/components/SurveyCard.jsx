import { useMemo, useEffect, useState } from "react";

/* ---- API (prod = Vercel functions, dev = Vite proxy/json-server if configured) ---- */
const API_ROOT = "/api/mock";
const CATALOG_URL = `${API_ROOT}/surveys`;

async function fetchJson(url) {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error(`Not JSON from ${url}`);
  return res.json();
}

let catalogPromise = null;
function loadCatalog() {
  if (!catalogPromise) {
    catalogPromise = fetchJson(CATALOG_URL)
      .catch(async () => {
        // Fallback to whole DB at /api/mock, then pick .surveys
        const db = await fetchJson(API_ROOT);
        return Array.isArray(db?.surveys) ? db.surveys : [];
      })
      .then((list) =>
        Array.isArray(list) ? list : Array.isArray(list?.surveys) ? list.surveys : []
      );
  }
  return catalogPromise;
}

export default function SurveyCard({ survey, onStart }) {
  const {
    id,
    name,
    title,
    questions,
    questionsCount: qc,
    payout,
    currency = "ksh",
    premium,
    completed,
    locked: lockedFromData,
  } = survey || {};

  const [fallback, setFallback] = useState(null);

  useEffect(() => {
    const needPayout = !Number.isFinite(payout);
    const haveQ =
      Array.isArray(questions) ||
      typeof qc === "number" ||
      typeof questions === "number" ||
      Array.isArray(survey?.items);

    if (!id) return;
    if (!needPayout && haveQ) return;

    loadCatalog()
      .then((list) => {
        const found = list.find((s) => s.id === id);
        if (found) setFallback(found);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, payout, questions, qc, survey?.items]);

  const displayName = name || title || fallback?.name || "Survey";
  const currencyLabel = String(currency || fallback?.currency || "ksh").toLowerCase();

  const questionsCount = useMemo(() => {
    if (Array.isArray(questions)) return questions.length;
    if (typeof qc === "number") return qc;
    if (typeof questions === "number") return questions;
    if (Array.isArray(survey?.items)) return survey.items.length;
    if (Array.isArray(fallback?.items)) return fallback.items.length;
    if (Array.isArray(fallback?.questions)) return fallback.questions.length;
    return 0;
  }, [questions, qc, survey?.items, fallback?.items, fallback?.questions]);

  const effectivePayout = useMemo(() => {
    if (Number.isFinite(payout)) return payout;
    if (Number.isFinite(fallback?.payout)) return Number(fallback.payout);
    return 0;
  }, [payout, fallback?.payout]);

  const isCompleted = !!completed;

  const isPremiumLockedForUser = useMemo(() => {
    try {
      const u = JSON.parse(localStorage.getItem("app:user") || "null");
      const isPremiumUser =
        !!u && (u.plan === "premium" || ["gold", "silver", "platinum"].includes(u.tier));
      return !!premium && !isPremiumUser;
    } catch {
      return !!premium;
    }
  }, [premium]);

  const isDisabled = isCompleted || !!lockedFromData;

  const buttonLabel = isCompleted
    ? "Completed"
    : isPremiumLockedForUser
    ? "Upgrade to Unlock"
    : "Start Survey";

  const buttonTitle = isCompleted
    ? "Already completed. Retakes are not allowed."
    : isPremiumLockedForUser
    ? "Premium survey — tap to upgrade your account."
    : `Start ${displayName}`;

  const handleClick = () => {
    if (isDisabled) return;
    onStart?.({ ...fallback, ...survey });
  };

  return (
    <div
      className="relative rounded-2xl bg-white ring-1 ring-slate-200 p-4 sm:p-5
                 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition"
    >
      {/* Top-right Premium badge (always visible if premium) */}
      {premium && (
        <span
          className="pointer-events-none absolute top-3 right-3 z-10 inline-flex items-center gap-1
                     rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5
                     ring-1 ring-violet-200 shadow-sm"
        >
          <LockIcon className="h-3.5 w-3.5" /> Premium
        </span>
      )}

      {/* Left: title + status */}
      <div className="min-w-0">
        <div className="inline-flex items-center gap-2">
          <div className="inline-flex items-center rounded-full bg-slate-100 text-slate-800 font-semibold px-3 py-1">
            {displayName}
          </div>

          {isCompleted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 ring-1 ring-emerald-200">
              ✓ Completed
            </span>
          )}
        </div>

        {/* Badges row */}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 text-sm px-2 py-1">
            <QuestionIcon className="h-4 w-4 text-emerald-600" />
            <span className="font-medium">Questions:</span> {questionsCount}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 text-sm px-2 py-1 ring-1 ring-emerald-200">
            <CashIcon className="h-4 w-4" />
            <span className="font-medium">Payout :</span>{" "}
            <span className="font-bold">
              {currencyLabel} {effectivePayout}
            </span>
          </span>
        </div>
      </div>

      {/* Right: CTA */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled}
        className={`shrink-1 absolute-bottom-right rounded-full px-1 py-1 font-semibold transition shadow
          ${
            isDisabled
              ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
              : isPremiumLockedForUser
              ? "bg-amber-500 text-white hover:bg-amber-600"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        aria-label={`${buttonLabel} ${displayName || id || ""}`}
        title={buttonTitle}
      >
        <span className="inline-flex items-center gap-2">
          {isPremiumLockedForUser && <LockIcon className="h-4 w-4" />}
          {buttonLabel}
        </span>
      </button>
    </div>
  );
}

/* Tiny inline icons */
function QuestionIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M9 9a3 3 0 116 0c0 2-3 2-3 4" />
      <path strokeWidth="2" d="M12 17h.01" />
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
    </svg>
  );
}
function CashIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-emerald-600" {...props}>
      <rect x="2" y="5" width="20" height="14" rx="2" strokeWidth="2" />
      <circle cx="12" cy="12" r="2.5" strokeWidth="2" />
    </svg>
  );
}
function LockIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="11" width="18" height="10" rx="2" strokeWidth="2" />
      <path strokeWidth="2" d="M7 11V8a5 5 0 0110 0v3" />
    </svg>
  );
}
