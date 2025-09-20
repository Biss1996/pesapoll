// src/pages/SurveyManager.jsx
import { useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext";
import AdminLogin from "./AdminLogin";

const API_BASE = import.meta.env.BASE_URL || "/";   // base path of your app
const SURVEYS_URL = `${API_BASE.replace(/\/+$/, "")}/db.json`;
export default function SurveyManager() {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <AdminLogin />;

  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- fetch all surveys ---------------- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(SURVEYS_URL);
        const data = await res.json();
        setSurveys(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Error fetching surveys:", e);
        alert("Failed to fetch surveys");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---------------- local edit helpers ---------------- */
  const patchSurvey = (id, field, value) => {
    setSurveys((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const patchQuestion = (sid, qIndex, field, value) => {
    setSurveys((prev) =>
      prev.map((s) => {
        if (s.id !== sid) return s;
        const items = Array.isArray(s.items) ? [...s.items] : [];
        items[qIndex] = { ...items[qIndex], [field]: value };
        return { ...s, items };
      })
    );
  };

  const addQuestion = (sid) => {
    setSurveys((prev) =>
      prev.map((s) => {
        if (s.id !== sid) return s;
        const items = Array.isArray(s.items) ? [...s.items] : [];
        items.push({ prompt: "New question", options: ["Option 1", "Option 2"] });
        return { ...s, items };
      })
    );
  };

  const removeQuestion = (sid, qIndex) => {
    setSurveys((prev) =>
      prev.map((s) => {
        if (s.id !== sid) return s;
        const items = (s.items || []).filter((_, i) => i !== qIndex);
        return { ...s, items };
      })
    );
  };

  /* ---------------- server actions ---------------- */
  const saveSurvey = async (id) => {
    try {
      const updated = surveys.find((s) => s.id === id);
      const res = await fetch(`${SURVEYS_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updated, updatedAt: Date.now() }),
      });
      const data = await res.json();
      setSurveys((prev) => prev.map((s) => (s.id === id ? data : s)));
      alert("Survey updated!");
    } catch (e) {
      console.error("Failed to update survey:", e);
      alert("Failed to update survey");
    }
  };

  const deleteSurvey = async (id) => {
    if (!confirm("Delete this survey? This cannot be undone.")) return;
    try {
      await fetch(`${SURVEYS_URL}/${id}`, { method: "DELETE" });
      setSurveys((prev) => prev.filter((s) => s.id !== id));
      alert("Survey deleted");
    } catch (e) {
      console.error("Failed to delete survey:", e);
      alert("Failed to delete survey");
    }
  };

  /* ---------------- render ---------------- */
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(800px_500px_at_90%_0%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom,#f8fafc,#eef2ff)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Manage Surveys</h1>
          <p className="text-slate-600">Edit survey details, questions, and payout. Save to apply changes.</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-700">Loading…</div>
        ) : surveys.length === 0 ? (
          <div className="text-center text-slate-600">No surveys found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {surveys.map((s) => (
              <div
                key={s.id}
                className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
              >
                {s.image ? (
                  <img src={s.image} alt={s.name} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-12 bg-slate-100" />
                )}

                <div className="p-4">
                  {/* Basics */}
                  <input
                    className="w-full text-lg font-semibold mb-2 border-b focus:outline-none focus:border-indigo-400"
                    value={s.name || ""}
                    onChange={(e) => patchSurvey(s.id, "name", e.target.value)}
                    placeholder="Survey name"
                  />

                  <textarea
                    className="w-full border rounded-lg p-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    value={s.description || ""}
                    placeholder="Survey description"
                    onChange={(e) => patchSurvey(s.id, "description", e.target.value)}
                  />

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Payout</label>
                      <input
                        type="number"
                        className="w-full border rounded-lg p-2"
                        value={s.payout ?? 0}
                        onChange={(e) => patchSurvey(s.id, "payout", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Currency</label>
                      <select
                        className="w-full border rounded-lg p-2"
                        value={(s.currency || "ksh").toLowerCase()}
                        onChange={(e) => patchSurvey(s.id, "currency", e.target.value)}
                      >
                        <option value="ksh">KSH</option>
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-indigo-600"
                        checked={!!s.premium}
                        onChange={(e) => patchSurvey(s.id, "premium", e.target.checked)}
                      />
                      Premium
                    </label>

                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Status</label>
                      <select
                        className="w-full border rounded-lg p-2"
                        value={s.status || "active"}
                        onChange={(e) => patchSurvey(s.id, "status", e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-xs text-slate-500 mb-1">Cover image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => patchSurvey(s.id, "image", reader.result);
                        reader.readAsDataURL(file);
                      }}
                    />
                  </div>

                  {/* Questions */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-slate-900">
                        Questions ({Array.isArray(s.items) ? s.items.length : 0})
                      </h3>
                      <button
                        type="button"
                        onClick={() => addQuestion(s.id)}
                        className="text-xs rounded-md border px-2 py-1 hover:bg-slate-50"
                      >
                        + Add Question
                      </button>
                    </div>

                    {Array.isArray(s.items) && s.items.length > 0 ? (
                      <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                        {s.items.map((q, qi) => (
                          <li key={`${s.id}-${qi}`} className="rounded-lg border p-2">
                            <input
                              className="w-full text-sm font-medium border-b mb-2 focus:outline-none focus:border-indigo-400"
                              value={q.prompt || ""}
                              onChange={(e) => patchQuestion(s.id, qi, "prompt", e.target.value)}
                              placeholder={`Question ${qi + 1}`}
                            />

                            <label className="block text-xs text-slate-500 mb-1">Options (comma or newline)</label>
                            <textarea
                              className="w-full text-xs border rounded p-2"
                              rows={2}
                              value={Array.isArray(q.options) ? q.options.join("\n") : ""}
                              onChange={(e) => {
                                const raw = e.target.value;
                                const options = raw
                                  .split(/\r?\n|,/)
                                  .map((s) => s.trim())
                                  .filter(Boolean);
                                patchQuestion(s.id, qi, "options", options);
                              }}
                            />

                            <div className="flex justify-end pt-2">
                              <button
                                type="button"
                                onClick={() => removeQuestion(s.id, qi)}
                                className="text-xs rounded-md border px-2 py-1 hover:bg-white"
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500">No questions yet.</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex justify-between">
                    <button
                      onClick={() => saveSurvey(s.id)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => deleteSurvey(s.id)}
                      className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
