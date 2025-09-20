// src/pages/SurveyFlow.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getUser,
  hasCompleted,
  markCompleted,
  ensureNotCompleted,
  KEYS,
  loadDB,           // ✅ use local db.json loader
} from "../lib/surveys";

const COOLDOWN_SECONDS = 2; // time before Next becomes active after selecting an option

export default function SurveyFlow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState("intro"); // "intro" | "question" | "done"
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const timerRef = useRef(null);

  // Load the survey by ID from local db.json and immediately block if already completed
  useEffect(() => {
    (async () => {
      try {
        const db = await loadDB(); // { surveys: [...] }
        const data = (db?.surveys || []).find((s) => String(s.id) === String(id));
        if (!data) throw new Error("Survey not found");

        const user = getUser();
        if (!user?.id) {
          navigate("/login", { replace: true, state: { redirectTo: `/survey/${id}` } });
          return;
        }

        if (hasCompleted(user.id, data.id)) {
          // Already completed — bounce back to list with a note
          navigate("/surveys", {
            replace: true,
            state: { blocked: data.id, reason: "already_completed" },
          });
          return;
        }

        setSurvey(data);
      } catch {
        navigate("/surveys", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // start cooldown once a choice is selected
  useEffect(() => {
    if (choice === null) return;
    setCooldown(COOLDOWN_SECONDS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [choice]);

  const q = useMemo(() => survey?.items?.[index] ?? null, [survey, index]);

  async function finishSurvey() {
    try {
      const u = getUser();

      // 1) Mark completed PER USER (no server)
      markCompleted(u.id, survey.id, { finishedAt: Date.now() });

      // 2) Credit balance locally (Option A)
      const delta = Number(survey.payout || 0);
      if (Number.isFinite(delta) && delta > 0) {
        const next = { ...u, balance: (u.balance || 0) + delta };
        localStorage.setItem("app:user", JSON.stringify(next));
      }

      // 3) Let other screens know to refresh
      localStorage.setItem(KEYS.SURVEYS_VERSION_KEY, String(Date.now()));
    } catch (e) {
      console.error("Failed to complete survey", e);
    } finally {
      // Back to list (list page will show it as completed and block retake)
      navigate("/surveys", { replace: true, state: { justCompleted: survey?.id } });
    }
  }

  function handleNext() {
    // Hard guard: block progress if somehow completed mid-flow (e.g., other tab)
    try {
      ensureNotCompleted(survey.id);
    } catch (e) {
      alert(e?.message || "This survey is already completed and cannot be taken again.");
      return navigate("/surveys", { replace: true });
    }

    if (index + 1 < (survey?.items?.length ?? 0)) {
      setIndex(index + 1);
      setChoice(null);
      setCooldown(0);
    } else {
      setPhase("done");
      finishSurvey();
    }
  }

  // Intro "Start Survey" -> move into question phase
  function handleStart() {
    try {
      ensureNotCompleted(survey.id);
      setPhase("question");
    } catch (e) {
      alert(e?.message || "This survey is already completed and cannot be taken again.");
      navigate("/surveys", { replace: true });
    }
  }

  if (loading || !survey) {
    return <div className="p-6">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
      {/* header/payout strip */}
      <div className="rounded-lg bg-indigo-500/90 text-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm/6 opacity-90">Survey Payout</p>
            <span className="inline-flex rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold">
              {(survey.currency ?? "ksh").toUpperCase()} {survey.payout}
            </span>

            {phase !== "intro" && (
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/90 text-slate-900 px-3 py-1">
                <TimerIcon className="h-4 w-4" />
                <span className="font-medium">Next in :</span> {cooldown}
              </div>
            )}
          </div>

          <div className="text-right">
            <p className="text-sm/6 opacity-90">Survey Topic</p>
            <span className="inline-flex rounded-full bg-white/90 text-slate-900 px-3 py-1 font-semibold">
              {survey.name}
            </span>
          </div>
        </div>

        {/* inner card */}
        <div className="mt-4 rounded-xl bg-white text-slate-900 p-4 sm:p-5 ring-1 ring-slate-200">
          {phase === "intro" && (
            <IntroCard survey={survey} onStart={handleStart} />
          )}

          {phase === "question" && q && (
            <QuestionCard
              index={index}
              total={survey.items.length}
              question={q}
              choice={choice}
              setChoice={setChoice}
              cooldown={cooldown}
              onNext={handleNext}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* --------- subcomponents --------- */

function IntroCard({ survey, onStart }) {
  return (
    <div>
      <h3 className="text-lg font-semibold">
        You are about to take {survey.name} and will earn{" "}
        <span className="inline-flex rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 font-semibold">
          {(survey.currency ?? "ksh").toUpperCase()} {survey.payout}
        </span>
      </h3>

      <ul className="mt-4 space-y-3">
        <IntroItem text="Give authentic & honest feedback" />
        <IntroItem text="Earn money and have fun" />
      </ul>

      <button
        onClick={onStart}
        className="mt-4 w-full rounded-lg bg-emerald-500 px-4 py-3 text-white font-semibold shadow hover:bg-emerald-600"
      >
        Start Survey
      </button>

      <div className="mt-4 rounded-lg bg-amber-50 text-amber-800 px-4 py-3">
        Start the survey and make sure to complete and submit in order to earn.
      </div>
    </div>
  );
}

function IntroItem({ text }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-xl">🪶</span>
      <span className="text-slate-800">{text}</span>
    </li>
  );
}

function QuestionCard({ index, total, question, choice, setChoice, cooldown, onNext }) {
  const isLast = index + 1 === total;

  return (
    <div>
      <h4 className="text-lg font-semibold flex items-center gap-2">
        <QIcon className="h-5 w-5 text-slate-700" />
        {question.prompt}
      </h4>

      <div className="mt-4 space-y-3">
        {question.options.map((opt, i) => (
          <label key={i} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={`q-${index}`}
              className="h-4 w-4 accent-indigo-600"
              checked={choice === i}
              onChange={() => setChoice(i)}
            />
            <span className="text-slate-800">{opt}</span>
          </label>
        ))}
      </div>

      <div className="mt-5">
        <button
          disabled={choice === null || cooldown > 0}
          onClick={onNext}
          className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-white font-semibold disabled:opacity-60"
        >
          {isLast ? "Finish" : "Next"}
        </button>
      </div>
    </div>
  );
}

/* --------- tiny icons --------- */
function TimerIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="13" r="8" strokeWidth="2" />
      <path strokeWidth="2" d="M12 9v4l3 2" />
      <path strokeWidth="2" d="M9 3h6" />
    </svg>
  );
}
function QIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="2" />
      <path strokeWidth="2" d="M8 8h0M12 8h0M16 8h0" />
    </svg>
  );
}
