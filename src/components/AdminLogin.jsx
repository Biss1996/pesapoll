// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext";

export default function AdminLogin() {
  const { login } = useAdmin();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();
  const loc = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const ok = login(password);
      if (!ok) {
        setError("Wrong password. Please try again.");
        return;
      }
      // redirect to original “from” or admin home
      const to = loc.state?.from || "/admin";
      nav(to, { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-xl font-semibold mb-4">Admin Login</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-5 rounded-xl ring-1 ring-slate-200 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Admin Password
          </label>
          <div className="flex">
            <input
              type={show ? "text" : "password"}
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-l-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="rounded-r-lg border border-l-0 border-slate-300 px-3 text-slate-600 hover:bg-slate-50"
              title={show ? "Hide" : "Show"}
            >
              {show ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className={`w-full rounded-lg px-4 py-2 font-semibold text-white
            ${submitting ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
        >
          {submitting ? "Signing in…" : "Login as Admin"}
        </button>

        <p className="text-xs text-slate-500">
          Tip: set <code>VITE_ADMIN_PASSWORD</code> in your .env to override the default.
        </p>
      </form>
    </div>
  );
}
