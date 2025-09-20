export default function PremiumModal({ open, onClose, onUpgrade }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      {/* Dim + blur backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />

      {/* Centered card */}
      <div className="relative z-10 mx-auto mt-28 w-[92%] max-w-lg rounded-xl bg-white p-6 shadow-xl ring-1 ring-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">This is a premium survey</h3>
        <p className="mt-1 text-sm text-slate-600">
          Upgrade your account to access this and more surveys and earn more
        </p>

        <button
          onClick={onUpgrade}
          className="mt-5 w-full rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          UPGRADE ACCOUNT
        </button>
      </div>
    </div>
  );
}
