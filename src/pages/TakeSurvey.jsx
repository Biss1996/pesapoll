// src/pages/TakeSurvey.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUser, hasCompleted, markCompleted, ensureNotCompleted, KEYS, loadDB } from "../lib/surveys";

export default function TakeSurvey() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Load survey from local db.json
  useEffect(() => {
    (async () => {
      try {
        const u = getUser();
        if (!u?.id) {
          navigate("/login", { replace: true, state: { redirectTo: `/survey/${id}` } });
          return;
        }

        const db = await loadDB(); // { surveys: [...] }
        const found = (db?.surveys || []).find((s) => String(s.id) === String(id));
        if (!found) throw new Error("Survey not found.");

        if (hasCompleted(u.id, found.id)) {
          navigate("/surveys", {
            replace: true,
            state: { blocked: found.id, reason: "already_completed" },
          });
          return;
        }

        setSurvey(found);
        setErr("");
      } catch (e) {
        setErr(e?.message || "Failed to load survey.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // Normalize to a single array: [{ id, text, options }]
  const questions = useMemo(() => {
    if (!survey) return [];
    // supports shape A: survey.items -> { prompt, options }
    if (Array.isArray(survey.items) && survey.items.length) {
      return survey.items.map((it, idx) => ({
        id: it.id ?? `i_${idx}`,
        text: it.prompt ?? it.question ?? `Question ${idx + 1}`,
        options: Array.isArray(it.options) ? it.options : [],
      }));
    }
    // supports shape B: survey.questions -> { id, text, options }
    if (Array.isArray(survey.questions) && survey.questions.length) {
      return survey.questions.map((q, idx) => ({
        id: q.id ?? `q_${idx}`,
        text: q.text ?? q.prompt ?? `Question ${idx + 1}`,
        options: Array.isArray(q.options) ? q.options : [],
      }));
    }
    return [];
  }, [survey]);

  function onSubmit(e) {
    e.preventDefault();
    if (!survey) return;

    // require an answer for each question
    const missing = questions.find((q) => answers[q.id] == null);
    if (missing) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      ensureNotCompleted(survey.id);
      const u = getUser();

      // mark completion
      markCompleted(u.id, survey.id, {
        answers,
        completedAt: Date.now(),
      });

      // update balance locally (Option A – no server)
      const reward = Number(survey.payout || 0);
      if (Number.isFinite(reward) && reward > 0) {
        const updated = { ...u, balance: (u.balance || 0) + reward };
        localStorage.setItem("app:user", JSON.stringify(updated));
      }

      // let other tabs/pages refresh lists
      localStorage.setItem(KEYS.SURVEYS_VERSION_KEY, String(Date.now()));

      alert("Thanks! Your responses were submitted and your balance updated.");
      navigate("/surveys", { replace: true, state: { justCompleted: survey.id } });
    } catch (ex) {
      alert(ex?.message || "This survey can’t be taken (possibly already completed).");
      navigate("/surveys", { replace: true });
    }
  }

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-rose-600">{err}</div>;
  if (!survey) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-4 rounded-xl bg-indigo-600 text-white p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">{survey.name || survey.title || "Survey"}</h1>
          <span className="inline-flex rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold">
            {(survey.currency ?? "ksh").toUpperCase()} {survey.payout ?? 0}
          </span>
        </div>
        {survey.description && <p className="mt-2 text-white/90 text-sm">{survey.description}</p>}
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white border rounded-2xl p-4">
            <div className="font-medium">{idx + 1}. {q.text}</div>
            <div className="mt-2 grid gap-2">
              {(q.options || []).map((opt, i) => (
                <label key={`${q.id}_${i}`} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`q_${q.id}`}              // group by question
                    checked={answers[q.id] === opt}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    className="h-4 w-4 accent-indigo-600"
                    required
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-2 w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          Submit Survey
        </button>
      </form>
    </div>
  );
}
