// src/lib/surveys.js
const SURVEYS_VERSION_KEY = "surveys:version";
const DB_URL = (() => {
  const base = (import.meta?.env?.BASE_URL ?? "/").toString();
  const normBase = (base.startsWith("/") ? base : `/${base}`).replace(/\/+$/, "");
  return `${normBase}/db.json`; // -> "/db.json" or "/subpath/db.json"
})();

export const USER_KEY = "app:user";
const COMPLETIONS_KEY = "surveys.completions.v1"; // { [userId]: { [surveyId]: { answers, completedAt } } }

/* ---------------- user helpers ---------------- */
export function getUser() {
  try {
    const u = JSON.parse(localStorage.getItem(USER_KEY) || "null");
    if (u && u.id) return u;
  } catch {}
  const fresh = {
    id: crypto?.randomUUID?.() || String(Date.now()),
    name: "Guest",
    email: "",
    plan: "free",
    balance: 0,
    createdAt: Date.now(),
  };
  localStorage.setItem(USER_KEY, JSON.stringify(fresh));
  return fresh;
}

export function setUser(patch) {
  const u = { ...getUser(), ...patch };
  localStorage.setItem(USER_KEY, JSON.stringify(u));
  return u;
}

/* ---------------- completions ---------------- */
function readCompletions() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || "{}");
  } catch {
    return {};
  }
}
function writeCompletions(all) {
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(all));
}
export function getCompletedIds(userId) {
  const all = readCompletions();
  return new Set(Object.keys(all[userId] || {}));
}
export function hasCompleted(userId, surveyId) {
  const all = readCompletions();
  return Boolean(all?.[userId]?.[surveyId]);
}
export function markCompleted(userId, surveyId, answers = {}) {
  const all = readCompletions();
  all[userId] = all[userId] || {};
  all[userId][surveyId] = { answers, completedAt: new Date().toISOString() };
  writeCompletions(all);

  // bump a version so UI screens listening to storage/focus can refresh
  try {
    localStorage.setItem(SURVEYS_VERSION_KEY, String(Date.now()));
  } catch {}
}
export function resetCompletions(userId) {
  const all = readCompletions();
  if (all[userId]) {
    delete all[userId];
    writeCompletions(all);
    try {
      localStorage.setItem(SURVEYS_VERSION_KEY, String(Date.now()));
    } catch {}
  }
}

/* Guard helpers: block starting an already-completed survey */
export function canStartSurvey(surveyId) {
  const user = getUser();
  return !hasCompleted(user.id, surveyId);
}

/**
 * Throws an Error if the current user already completed this survey.
 * Call this at the top of your "start survey" handler.
 */
export function ensureNotCompleted(surveyId) {
  if (!canStartSurvey(surveyId)) {
    throw new Error("This survey is already completed and cannot be taken again.");
  }
}

/* ---------------- db.json loader ---------------- */
let _dbCache = null;
export async function loadDB() {
  if (_dbCache) return _dbCache;

  // Avoid stale caching during dev
  const url = DB_URL.includes("?")
    ? `${DB_URL}&_=${Date.now()}`
    : `${DB_URL}?_=${Date.now()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load db.json");
  _dbCache = await res.json();
  return _dbCache;
}

/* ---------------- mapping for UI ---------------- */
/**
 * Hydrate surveys from db.json and tag per-user completion.
 * - Keeps all surveys visible
 * - Adds completion/lock metadata for UI to disable retakes
 *
 * Maps:
 *  - db.name        -> title
 *  - db.items       -> questions (array)
 *  - db.payout      -> reward
 *  - db.currency    -> currency
 * Adds:
 *  - questionsCount
 *  - completed (per user)
 *  - status: "completed" | "available"
 *  - locked: boolean (true if completed)
 *  - retakeBlockedReason: string | null
 */
export async function listSurveysForUser() {
  const user = getUser();
  const completed = getCompletedIds(user.id);
  const db = await loadDB();

  return (db.surveys || []).map((s) => {
    // Compute count robustly: supports items[], questions number, or questions[]
    const count =
      Array.isArray(s.items) ? s.items.length
      : Array.isArray(s.questions) ? s.questions.length
      : Number.isFinite(s.questions) ? s.questions
      : 0;

    const isCompleted = completed.has(s.id);

    return {
      id: s.id,
      title: s.name || s.title || "Survey",
      name: s.name,
      description: s.description || "",
      premium: !!s.premium,
      reward: s.payout,
      currency: (s.currency || "ksh").toLowerCase(),
      questions: Array.isArray(s.items) ? s.items : Array.isArray(s.questions) ? s.questions : [],
      questionsCount: count,

      // per-user completion (do NOT hide; surface for UI)
      completed: isCompleted,

      // helpful UI flags to block retakes while still showing the row
      status: isCompleted ? "completed" : "available",
      locked: isCompleted,
      retakeBlockedReason: isCompleted ? "Already completed. Retakes are not allowed." : null,
    };
  });
}

/* Expose keys for screens that listen to storage/focus */
export const KEYS = { SURVEYS_VERSION_KEY, COMPLETIONS_KEY, USER_KEY };
