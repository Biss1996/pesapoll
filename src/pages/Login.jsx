// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const USERS_KEY = "app:users";
const USER_KEY  = "app:user";
const SURVEYS_ROUTE = "/surveys";

// Absolute URL for /public/db.json (for first-time seeding if needed)
const DB_URL =
  typeof document !== "undefined"
    ? new URL("db.json", document.baseURI).toString()
    : "/db.json";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverErr, setServerErr] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [seeded, setSeeded] = useState(false);

  // Ensure local users are seeded (first load only)
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (Array.isArray(existing) && existing.length > 0) {
        setSeeded(true);
        return;
      }
    } catch {}
    (async () => {
      try {
        const res = await fetch(DB_URL);
        const data = await res.json();
        const initialUsers = Array.isArray(data?.users) ? data.users : [];
        localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      } catch {
        localStorage.setItem(USERS_KEY, JSON.stringify([]));
      } finally {
        setSeeded(true);
      }
    })();
  }, []);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.password) e.password = "Password is required.";
    return e;
  };

  async function onSubmit(e) {
    e.preventDefault();
    setServerErr("");
    const eObj = validate();
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    if (!seeded) {
      setServerErr("Initializing… try again in a moment.");
      return;
    }

    setSubmitting(true);
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const email = form.email.trim().toLowerCase();
      const pwd = form.password;

      const found = users.find(
        (u) => String(u.email || "").toLowerCase() === email && u.password === pwd
      );

      if (!found) {
        setServerErr("Invalid email or password.");
      } else {
        // Persist session (normalize minimal shape)
        const session = {
          id: found.id,
          name: found.name || "",
          email: found.email,
          plan: found.plan || "free",
          tier: found.tier || undefined,
          balance: Number(found.balance || 0),
          createdAt: found.createdAt || Date.now(),
        };
        localStorage.setItem(USER_KEY, JSON.stringify(session));
        navigate(SURVEYS_ROUTE, { replace: true });
      }
    } catch {
      setServerErr("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-full bg-indigo-50/50">
      <div className="min-h-[calc(100vh-64px)] container mx-auto px-4 py-10 flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-indigo-100 text-indigo-700 grid place-items-center">
            <LoginIcon className="h-6 w-6" />
          </div>

          <h1 className="text-center text-3xl font-extrabold tracking-tight">Welcome Back</h1>
          <p className="mt-1 text-center text-sm text-slate-600">Login to access your earnings</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email Address</label>
              <input
                id="email" name="email" type="email" placeholder="Email Address *"
                value={form.email} onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password" name="password" type={showPwd ? "text" : "password"} placeholder="Password *"
                value={form.password} onChange={onChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-11 text-blue-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                aria-invalid={!!errors.password}
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

            {serverErr && <p className="text-sm text-rose-600">{serverErr}</p>}

            <div className="text-right">
              <Link to="/forgot" className="text-sm text-indigo-700 hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={submitting || !seeded}
              className="mt-2 w-full rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white tracking-wide uppercase shadow-sm hover:bg-indigo-700 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {submitting ? "LOGGING IN…" : "LOGIN TO ACCOUNT"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-indigo-700 font-semibold hover:underline">
              Create one here
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-slate-500">New users get a $5 signup bonus!</p>
        </div>
      </div>
    </section>
  );
}

/* icons */
function LoginIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M10 3H6a3 3 0 00-3 3v12a3 3 0 003 3h4" />
      <path strokeWidth="2" d="M13 7l5 5-5 5M8 12h10" />
    </svg>
  );
}
function EyeIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}
function EyeOffIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeWidth="2" d="M17.94 17.94A10.94 10.94 0 0112 19c-7 0-11-7-11-7a21.77 21.77 0 015.06-5.94" />
      <path strokeWidth="2" d="M9.9 4.24A10.94 10.94 0 0112 5c7 0 11 7 11 7a21.87 21.87 0 01-3.22 4.15" />
      <path strokeWidth="2" d="M1 1l22 22" />
    </svg>
  );
}
