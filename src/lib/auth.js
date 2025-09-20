// src/lib/auth.js
import { KEYS } from "./surveys";

const AUTH_VERSION_KEY = "auth:version";
const ADMIN_FLAG_KEY = "app:admin.flag.v1"; // "true" when admin is logged in

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(KEYS.USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function isAdmin() {
  const u = getCurrentUser();
  return u?.role === "admin" || localStorage.getItem(ADMIN_FLAG_KEY) === "true";
}

export function logout() {
  try {
    localStorage.removeItem(KEYS.USER_KEY);      // log out user/admin
    localStorage.removeItem(ADMIN_FLAG_KEY);     // clear admin flag
    bumpAuth();
    bumpSurveysVersion();
  } catch {}
}

function bumpAuth() {
  try { localStorage.setItem(AUTH_VERSION_KEY, String(Date.now())); } catch {}
}
function bumpSurveysVersion() {
  try { localStorage.setItem(KEYS.SURVEYS_VERSION_KEY, String(Date.now())); } catch {}
}

export const AUTH_KEYS = { AUTH_VERSION_KEY, ADMIN_FLAG_KEY };
