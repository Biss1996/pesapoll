// src/pages/Dashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { getUser, KEYS, loadDB } from "../lib/surveys";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/* ---------------- Option A (no backend) ---------------- */
const API_BASE = null; // set to e.g. "http://localhost:3001" if you later add an API
const USERS_KEY = "app:users";
const USER_KEY = "app:user";
const WITHDRAWALS_KEY = "app:withdrawals"; // [{ id, amount, dateISO }]

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function setLocalUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}
function updateUserLocal(id, partial) {
  const users = getLocalUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...partial, updatedAt: Date.now() };
    setLocalUsers(users);
  }
  const cur = JSON.parse(localStorage.getItem(USER_KEY) || "null");
  if (cur && cur.id === id) {
    localStorage.setItem(USER_KEY, JSON.stringify({ ...cur, ...partial }));
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [mpesaNumber, setMpesaNumber] = useState("");
  const [mpesaName, setMpesaName] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- helpers to read/write persisted data ---------------- */
  function readWithdrawals() {
    try {
      const raw = localStorage.getItem(WITHDRAWALS_KEY) || "[]";
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch {
      return [];
    }
  }
  function writeWithdrawals(list) {
    localStorage.setItem(WITHDRAWALS_KEY, JSON.stringify(list));
  }
  function readCompletionsBlob() {
    try {
      const raw = localStorage.getItem(KEYS.COMPLETIONS_KEY) || "{}";
      return JSON.parse(raw);
    } catch {
      return {};
    }
  }

  /* ---------------- build transactions from completions + withdrawals ---- */
  async function rebuildTransactionsAndBalance() {
    const u = getUser();
    if (!u?.id) return;

    // 1) Gather completions for this user
    const all = readCompletionsBlob();
    const mine = all[u.id] || {}; // { [surveyId]: { answers, completedAt } }

    // 2) Load catalog so we can look up reward/title per surveyId
    const db = await loadDB();
    const byId = new Map((db.surveys || []).map((s) => [s.id, s]));

    // 3) Map completions -> "Survey Completed" transactions
    const earnedTx = Object.entries(mine).map(([surveyId, payload], idx) => {
      const s = byId.get(surveyId) || {};
      const amount = Number(s.payout || 0);
      const title = s.name || s.title || "Survey";
      const dateISO = payload?.completedAt || new Date().toISOString();
      return {
        id: `earn-${surveyId}-${idx}`,
        type: `Survey Completed — ${title}`,
        date: new Date(dateISO).toLocaleDateString(),
        dateISO,
        amount: amount,
        status: "Earned",
      };
    });

    // 4) Append persisted withdrawals
    const withdrawals = readWithdrawals().map((w) => ({
      id: `wd-${w.id}`,
      type: "Withdrawal",
      date: new Date(w.dateISO).toLocaleDateString(),
      dateISO: w.dateISO,
      amount: -Math.abs(Number(w.amount || 0)),
      status: "Completed",
    }));

    // 5) Sort by time desc
    const allTx = [...earnedTx, ...withdrawals].sort(
      (a, b) => new Date(b.dateISO) - new Date(a.dateISO)
    );
    setTransactions(allTx);

    // 6) Compute balance
    const computedBalance = allTx.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    // 7) Persist balance to user (local only)
    const updatedUser = { ...u, balance: computedBalance };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

    // 8) Mirror balance
    try {
      if (API_BASE) {
        await fetch(`${API_BASE}/users/${u.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ balance: computedBalance }),
        });
      } else {
        updateUserLocal(u.id, { balance: computedBalance });
      }
    } catch {
      /* ignore in Option A */
    }
  }

  /* ---------------- load on mount, and refresh on changes ---------------- */
  useEffect(() => {
    (async () => {
      const u = getUser();
      if (!u) {
        navigate("/login");
        return;
      }
      setUser(u);
      await rebuildTransactionsAndBalance();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e?.key === KEYS.SURVEYS_VERSION_KEY || e?.key === KEYS.COMPLETIONS_KEY) {
        rebuildTransactionsAndBalance();
      }
    };
    const onFocus = () => rebuildTransactionsAndBalance();

    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- derived UI bits ---------------- */
  const accountType = useMemo(() => {
    if (!user) return "Free Account";
    switch (user.tier) {
      case "gold":
        return "Gold Account";
      case "silver":
        return "Silver Account";
      case "platinum":
        return "Platinum Account";
      default:
        return "Free Account";
    }
  }, [user]);

  const surveysPerDay = useMemo(() => {
    if (!user) return 1;
    switch (user.tier) {
      case "gold":
        return 10;
      case "silver":
        return 5;
      case "platinum":
        return 20;
      default:
        return 1;
    }
  }, [user]);

  const minWithdrawal = useMemo(() => {
    if (!user) return 4500;
    switch (user.tier) {
      case "gold":
        return 2500;
      case "silver":
        return 3000;
      case "platinum":
        return 2000;
      default:
        return 4500;
    }
  }, [user]);

  const earningsData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const sums = new Array(7).fill(0);
    transactions.forEach((t) => {
      if (t.amount > 0 && t.dateISO) {
        const d = new Date(t.dateISO);
        sums[d.getDay()] += Number(t.amount) || 0;
      }
    });
    return {
      labels: days,
      datasets: [
        {
          label: "Earnings (Ksh)",
          data: sums,
          backgroundColor: "rgba(0, 180, 180, 0.8)",
          borderColor: "rgba(0, 180, 180, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [transactions]);

  /* ---------------- actions ---------------- */
  const handleAddPayment = () => setShowPaymentModal(true);
  const handleWithdraw = () => setShowWithdrawModal(true);

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...user,
      paymentDetails: { mpesaNumber, mpesaName },
    };
    setUser(updatedUser);
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    if (user?.id) updateUserLocal(user.id, { paymentDetails: { mpesaNumber, mpesaName } });

    setShowPaymentModal(false);
    setMpesaNumber("");
    setMpesaName("");
  };

  const handleSubmitWithdraw = (e) => {
    e.preventDefault();
    const amount = parseInt(withdrawAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    if (amount > (user.balance || 0)) {
      setError("Insufficient balance.");
      return;
    }
    if (amount < minWithdrawal) {
      setError(`Minimum withdrawal amount is Ksh ${minWithdrawal}.`);
      return;
    }
    const list = readWithdrawals();
    const entry = {
      id: (list[list.length - 1]?.id || 0) + 1,
      amount,
      dateISO: new Date().toISOString(),
    };
    writeWithdrawals([...list, entry]);
    rebuildTransactionsAndBalance();

    setShowWithdrawModal(false);
    setWithdrawAmount("");
    setError("");
  };

  /* ---------------- render ---------------- */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>No user data found. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Top grid: Profile + Account */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 mb-6">
        {/* User Info */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
              <span className="text-indigo-600 font-semibold">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {user.email || "Guest Mode"}
              </p>
              <p className="text-xs text-gray-500 truncate">{accountType}</p>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Account type */}
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="text-xs text-gray-500">Account type</p>
                <p className="font-semibold text-gray-800 flex items-center gap-2">
                  {accountType} {accountType !== "Free Account" && "⭐"}
                </p>
                <p className="text-xs text-green-600">{surveysPerDay} surveys/day</p>
              </div>
              <button
                onClick={() => navigate("/packages")}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 w-auto"
              >
                Upgrade ⭐
              </button>
            </div>

            {/* Balance */}
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="text-xs text-gray-500">Balance</p>
                <p className="font-semibold text-gray-800">💰 Ksh {user.balance || 0}</p>
              </div>
              <button
                onClick={handleWithdraw}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 w-auto"
              >
                Withdraw $
              </button>
            </div>

            {/* Available Surveys */}
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="text-xs text-gray-500">Available Surveys</p>
                <p className="font-semibold text-gray-800">📋 {user.availableSurveys || 50}</p>
              </div>
              <button
                onClick={() => navigate("/surveys")}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 w-auto"
              >
                Surveys 📋
              </button>
            </div>

            {/* Loyalty */}
            <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div>
                <p className="text-xs text-gray-500">Loyalty points</p>
                <p className="font-semibold text-gray-800">🏆 {user.loyaltyPoints || 0}</p>
              </div>
              <button className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 w-auto">
                Referrals 🔄
              </button>
            </div>

            {/* Payment Details */}
            <div className="sm:col-span-2 xl:col-span-1 flex items-center justify-between rounded-lg border border-gray-100 p-3">
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Payment details</p>
                {user.paymentDetails ? (
                  <p className="font-semibold text-gray-800 truncate">
                    {user.paymentDetails.mpesaName} ({user.paymentDetails.mpesaNumber})
                  </p>
                ) : (
                  <p className="font-semibold text-gray-500">Not Provided</p>
                )}
              </div>
              <button
                onClick={handleAddPayment}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 w-auto"
              >
                {user.paymentDetails ? "Update" : "Add"} +
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg mt-4">
            💡 Payments system is selected based on your country for convenience
          </div>
        </div>
      </div>

      {/* Bottom grid: Transactions + Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Transactions History */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Transactions History</h2>
          {transactions.length === 0 ? (
            <p className="text-gray-500">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 truncate">{transaction.type}</p>
                    <p className="text-sm text-gray-500">{transaction.date}</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p
                      className={`font-medium ${
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? "+" : "-"} Ksh {Math.abs(transaction.amount)}
                    </p>
                    <p className="text-sm text-gray-500">{transaction.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earnings Overview */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Earnings Overview</h2>
          <div className="h-56 sm:h-64 xl:h-80">
            <Bar
              data={earningsData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { precision: 0 } },
                  x: { grid: { display: false } },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Add Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-xl shadow-lg p-4 sm:p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Payment Details</h2>
            <div className="flex justify-center mb-4">
              <img src="/download.png" alt="M-Pesa" className="h-16" />
            </div>
            <form onSubmit={handleSubmitPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-PESA Number *
                </label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg">
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/4/49/Flag_of_Kenya.svg"
                      alt="Kenya"
                      className="w-5 h-3"
                    />
                    <span className="text-gray-900">+254</span>
                  </div>
                  <input
                    type="text"
                    value={mpesaNumber}
                    onChange={(e) => setMpesaNumber(e.target.value)}
                    placeholder="e.g., 712345678"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  M-PESA Name *
                </label>
                <input
                  type="text"
                  value={mpesaName}
                  onChange={(e) => setMpesaName(e.target.value)}
                  placeholder="Enter your M-PESA name"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg mt-2">
                💡 Payments system is selected based on your country for convenience
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-xl shadow-lg p-4 sm:p-6 overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Withdraw</h2>
            <div className="flex justify-center mb-4">
              <img src="/download.png" alt="M-Pesa" className="h-16" />
            </div>
            <div className="mb-4">
              <p className="text-gray-700">
                Account Balance: <span className="font-semibold">Ksh {user.balance || 0}</span>
              </p>
            </div>
            <form onSubmit={handleSubmitWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Amount *
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount to withdraw"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                <p className="mt-1 text-xs text-red-500">
                  Minimum withdrawal amount is Ksh {minWithdrawal}.
                </p>
              </div>
              <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg mt-2">
                💡 Payments system is selected based on your country for convenience
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    setError("");
                  }}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Withdraw
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
