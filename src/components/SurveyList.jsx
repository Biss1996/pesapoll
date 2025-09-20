// src/components/SurveyList.jsx
import SurveyCard from "./SurveyCard";
import { ensureNotCompleted } from "../lib/surveys";

export default function SurveyList({ surveys = [], onStart }) {
  const total = Array.isArray(surveys) ? surveys.length : 0;
  const completedCount = Array.isArray(surveys)
    ? surveys.filter((s) => s?.completed).length
    : 0;
  const availableCount = Math.max(0, total - completedCount);

  if (!total) {
    return (
      <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 mb-3">
          <span className="text-xl">📭</span>
        </div>
        <p className="text-slate-800 font-semibold">No surveys available right now</p>
        <p className="text-sm text-slate-600 mt-1">
          Check back later — new opportunities open frequently.
        </p>
      </div>
    );
  }

  // Incomplete first, then completed (both visible)
  const ordered = [...surveys].sort((a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
  );

  // Guard onStart to block retakes even if someone bypasses UI disables
  const guardedStart = (survey) => {
    try {
      ensureNotCompleted(survey.id);
      onStart?.(survey);
    } catch (e) {
      alert(e?.message || "This survey is already completed and cannot be taken again.");
    }
  };

  return (
    <section className="space-y-4">
      {/* Header / summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h4 className="text-base font-semibold text-slate-900">
          Available Surveys
          <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-xs ring-1 ring-emerald-200">
            {availableCount}
          </span>
        </h4>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-700 ring-1 ring-slate-200">
            Total: {total}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-indigo-700 ring-1 ring-indigo-200">
            Completed: {completedCount}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-500">
            Retakes are blocked once a survey is completed.
          </span>
        </div>
      </div>

      {/* Grid of surveys (responsive) */}
      <div
        className="
          grid gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {ordered.map((s) => (
          <div
            key={s.id ?? s.title ?? Math.random()}
            className="transition-transform duration-150 hover:-translate-y-0.5"
          >
            <SurveyCard survey={s} onStart={guardedStart} />
          </div>
        ))}
      </div>

      {/* Footer note if some are completed */}
      {completedCount > 0 && (
        <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
          {completedCount} {completedCount === 1 ? "survey" : "surveys"} are marked as
          completed and appear at the end of the list.
        </div>
      )}
    </section>
  );
}
