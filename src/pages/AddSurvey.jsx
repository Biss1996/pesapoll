import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAdmin } from "../context/AdminContext";
import AdminLogin from "./AdminLogin"; // adjust if yours is in components/

const DEFAULT_CURRENCY = "ksh";
const makeId = () => crypto?.randomUUID?.() || String(Date.now());

export default function AddSurvey({ addSurvey }) {
  // gate with admin login
  const { isAdmin } = useAdmin();
  if (!isAdmin) return <AdminLogin />;

  const [form, setForm] = useState({
    name: "",
    description: "",
    payout: "",
    currency: DEFAULT_CURRENCY,
    premium: false,
    status: "active", // active | draft | archived
    image: "",
  });

  const [qDraft, setQDraft] = useState({ prompt: "", optionsText: "" });
  const [items, setItems] = useState([]); // [{ prompt, options: [] }]

  const onForm = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };
  const onQ = (e) => setQDraft((p) => ({ ...p, [e.target.name]: e.target.value }));

  function addQuestion() {
    const prompt = qDraft.prompt.trim();
    const options = qDraft.optionsText
      .split(/\r?\n|,/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!prompt) return toast.error("Question prompt is required");
    if (options.length < 2) return toast.error("Add at least two options");

    setItems((p) => [...p, { prompt, options }]);
    setQDraft({ prompt: "", optionsText: "" });
  }
  const removeQuestion = (i) => setItems((p) => p.filter((_, idx) => idx !== i));

  function onImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setForm((p) => ({ ...p, image: r.result }));
    r.readAsDataURL(f);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payoutNum = Number(form.payout);
    if (!form.name.trim()) return toast.error("Name is required");
    if (!form.description.trim()) return toast.error("Description is required");
    if (!Number.isFinite(payoutNum) || payoutNum < 0) return toast.error("Payout must be valid");
    if (items.length === 0) return toast.error("Add at least one question");

    const survey = {
      id: makeId(),
      name: form.name.trim(),
      description: form.description.trim(),
      payout: payoutNum,
      currency: String(form.currency || DEFAULT_CURRENCY).toLowerCase(),
      premium: !!form.premium,
      status: form.status,
      image: form.image || "",
      items,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await addSurvey?.(survey); // parent will persist (API/local)
      toast.success("Survey added!");
      Swal.fire({ icon: "success", title: "Added!", text: "Survey added successfully!" });
      setForm({
        name: "",
        description: "",
        payout: "",
        currency: DEFAULT_CURRENCY,
        premium: false,
        status: "active",
        image: "",
      });
      setItems([]);
      setQDraft({ prompt: "", optionsText: "" });
    } catch {
      toast.error("Failed to add survey");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_10%_-10%,rgba(99,102,241,0.08),transparent_60%),radial-gradient(800px_500px_at_90%_0%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom,#f8fafc,#eef2ff)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Survey</h1>
          <p className="text-slate-600">Fill in the survey details and add questions.</p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* left: details */}
          <div className="lg:col-span-2 bg-white rounded-2xl ring-1 ring-slate-200 p-4 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-4">Survey Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onForm}
                  placeholder="e.g., Customer Satisfaction 2025"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={onForm}
                  rows={4}
                  placeholder="Tell participants what this survey is about…"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Payout *</label>
                <input
                  type="number"
                  name="payout"
                  value={form.payout}
                  onChange={onForm}
                  min="0"
                  step="1"
                  placeholder="e.g., 70"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                <select
                  name="currency"
                  value={form.currency}
                  onChange={onForm}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ksh">KSH</option>
                  <option value="usd">USD</option>
                  <option value="eur">EUR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={onForm}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="premium"
                  checked={form.premium}
                  onChange={onForm}
                  className="h-4 w-4 accent-indigo-600"
                />
                <span className="text-sm text-slate-700">Premium survey</span>
              </label>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image (optional)</label>
                <input type="file" accept="image/*" onChange={onImage}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2" />
              </div>
            </div>
          </div>

          {/* right: questions */}
          <div className="bg-white rounded-2xl ring-1 ring-slate-200 p-4 sm:p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3">Add Question</h2>

            <label className="block text-sm font-medium text-slate-700 mb-1">Prompt *</label>
            <input
              name="prompt"
              value={qDraft.prompt}
              onChange={onQ}
              placeholder="e.g., How satisfied are you with our service?"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <label className="block text-sm font-medium text-slate-700 mt-3 mb-1">
              Options * <span className="text-slate-500 font-normal">(comma or new line)</span>
            </label>
            <textarea
              name="optionsText"
              value={qDraft.optionsText}
              onChange={onQ}
              rows={3}
              placeholder={`Very satisfied, Satisfied, Neutral, Dissatisfied, Very dissatisfied`}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            <button
              type="button"
              onClick={addQuestion}
              className="mt-3 w-full rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700"
            >
              Add Question
            </button>

            <div className="mt-5">
              <h3 className="text-sm font-semibold text-slate-900">Questions ({items.length})</h3>
              {items.length === 0 ? (
                <p className="text-sm text-slate-500 mt-1">No questions added yet.</p>
              ) : (
                <ul className="mt-2 space-y-2 max-h-72 overflow-auto pr-1">
                  {items.map((q, idx) => (
                    <li key={`${q.prompt}-${idx}`} className="rounded-lg ring-1 ring-slate-200 p-3 bg-slate-50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900">{idx + 1}. {q.prompt}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            Options: {q.options.join(" • ")}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeQuestion(idx)}
                          className="shrink-0 rounded-md border px-2 py-1 text-xs hover:bg-white"
                          title="Remove question"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-emerald-600 text-white px-4 py-2 font-semibold hover:bg-emerald-700"
            >
              Save Survey
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
