// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

/** OPTION A (no backend): keep API_BASE = null */
const API_BASE = null;

// Absolute URL for /public/db.json
const DB_URL =
  typeof document !== "undefined"
    ? new URL("db.json", document.baseURI).toString()
    : "/db.json";

const USERS_KEY = "app:users";
const USER_KEY  = "app:user";
const REDIRECT_TO = "/login"; // change to "/login" if you prefer

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    referral: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // local helpers
  function getLocalUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
    catch { return []; }
  }
  function setLocalUsers(list) {
    localStorage.setItem(USERS_KEY, JSON.stringify(list));
  }

  // Seed users from /db.json if empty
  useEffect(() => {
    if (API_BASE) return;
    try {
      const existing = getLocalUsers();
      if (existing.length > 0) {
        setSeeded(true);
        return;
      }
    } catch {}
    (async () => {
      try {
        const res = await fetch(DB_URL);
        if (!res.ok) throw new Error("Failed to load db.json");
        const data = await res.json();
        const initialUsers = Array.isArray(data?.users) ? data.users : [];
        setLocalUsers(initialUsers);
      } catch {
        setLocalUsers([]);
      } finally {
        setSeeded(true);
      }
    })();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function validate() {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name) e.name = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (submitting) return;

    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length > 0) return;

    setSubmitting(true);
    try {
      const email = form.email.trim().toLowerCase();
      const referral = form.referral.trim() || null;

      if (API_BASE) {
        // Backend mode (unused in Option A)
        // ...
      } else {
        if (!seeded) throw new Error("Still initializing, try again.");
        const users = getLocalUsers();
        if (users.some((u) => String(u.email || "").toLowerCase() === email)) {
          setErrors((prev) => ({ ...prev, email: "Email already registered." }));
          return;
        }

        const newUser = {
          id: crypto?.randomUUID?.() || String(Date.now()),
          name: form.name.trim(),
          email,
          password: form.password, // demo only (do NOT do this in prod)
          referral,
          plan: "free",
          balance: 0,
          createdAt: Date.now(),
        };
        setLocalUsers([...users, newUser]);

        // ✅ Persist session so Dashboard shows the user (not Guest)
        const session = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          plan: newUser.plan,
          balance: newUser.balance,
          createdAt: newUser.createdAt,
        };
        localStorage.setItem(USER_KEY, JSON.stringify(session));
      }

      navigate(REDIRECT_TO, { replace: true, state: { justRegistered: true } });
    } catch (err) {
      console.error(err);
      alert("Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-indigo-50/50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
        {/* Icon */}
        <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center">
          <UserPlusIcon className="h-6 w-6" />
        </div>

        <h1 className="text-center text-2xl sm:text-3xl font-extrabold tracking-tight">
          Create Your Account
        </h1>
        <p className="mt-1 text-center text-sm text-slate-600">
          Join 50,000+ members earning real money
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label>
            <input
              id="name" name="name" type="text" placeholder="Full Name *"
              value={form.name} onChange={handleChange}
              aria-invalid={!!errors.name}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email Address</label>
            <input
              id="email" name="email" type="email" placeholder="Email Address *"
              value={form.email} onChange={handleChange}
              aria-invalid={!!errors.email}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password" name="password" type={showPwd ? "text" : "password"} placeholder="Password *"
              value={form.password} onChange={handleChange}
              aria-invalid={!!errors.password}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="button" onClick={() => setShowPwd((s) => !s)}
              className="absolute inset-y-0 right-3 my-auto h-8 w-8 grid place-items-center text-slate-500 hover:text-slate-700"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
            {errors.password && <p className="mt-1 text-xs text-rose-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label htmlFor="confirm" className="sr-only">Confirm Password</label>
            <input
              id="confirm" name="confirm" type={showConfirm ? "text" : "password"} placeholder="Confirm Password *"
              value={form.confirm} onChange={handleChange}
              aria-invalid={!!errors.confirm}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="button" onClick={() => setShowConfirm((s) => !s)}
              className="absolute inset-y-0 right-3 my-auto h-8 w-8 grid place-items-center text-slate-500 hover:text-slate-700"
              aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirm ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
            {errors.confirm && <p className="mt-1 text-xs text-rose-600">{errors.confirm}</p>}
          </div>

          {/* Referral (optional) */}
          <div>
            <label htmlFor="referral" className="sr-only">Referral Code</label>
            <input
              id="referral" name="referral" type="text" placeholder="Referral Code (Optional)"
              value={form.referral} onChange={handleChange}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || (!API_BASE && !seeded)}
            className="mt-2 w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {submitting ? "CREATING..." : "CREATE FREE ACCOUNT"}
          </button>
        </form>

        {/* Login link */}
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-700 hover:underline">
            Login here
          </Link>
        </p>

        {/* Terms note */}
        <p className="mt-3 text-center text-xs text-slate-500">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline">Terms of Service</a> and{" "}
          <a href="#" className="underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

/* icons */
function UserPlusIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M16 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4" strokeWidth="2"/>
      <path strokeWidth="2" d="M19 8h4M21 6v4"/>
    </svg>
  );
}
function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3" strokeWidth="2"/>
    </svg>
  );
}
function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-5.94"/>
      <path strokeWidth="2" d="M9.9 4.24A10.94 10.94 0 0112 5c7 0 11 7 11 7a21.87 21.87 0 01-3.22 4.15"/>
      <path strokeWidth="2" d="M1 1l22 22"/>
    </svg>
  );
}
