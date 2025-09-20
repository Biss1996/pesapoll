// src/utils/storage.js
export const LS_KEYS = {
  USER: "app:user",
  BALANCE: "app:balance",
  SURVEYS: "app:surveys",
};

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
