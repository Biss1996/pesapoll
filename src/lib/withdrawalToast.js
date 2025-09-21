// src/lib/withdrawalToast.js
import toast from "react-hot-toast";

const kes = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 });

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randChoice(arr) { return arr[randInt(0, arr.length - 1)]; }

function randomMaskedMsisdn() {
  // Format like: 2547XX****901 (matches your screenshot style)
  const last3 = String(randInt(0, 999)).padStart(3, "0");
  const prefixX = randChoice(["XX"]); // slight randomness
  return `2547${prefixX}****${last3}`;
}

function randomAmount() {
  // Between 500 and 5,000, step ~50
  const base = randInt(10, 100) * 50;           // 500..5000
  // Add some common amounts (e.g., 2,500 as in screenshot) with higher likelihood
  return randChoice([2500, base, base, base]);
}

function randomRef() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const digits  = "0123456789";
  const part = () =>
    letters[randInt(0,25)] + letters[randInt(0,25)] + digits[randInt(0,9)] + digits[randInt(0,9)] + letters[randInt(0,25)] + letters[randInt(0,25)];
  // Looks like TX9018EF → prefix TX + 6-mix
  const six = [
    digits[randInt(0,9)], digits[randInt(0,9)],
    digits[randInt(0,9)], digits[randInt(0,9)],
    letters[randInt(0,25)], letters[randInt(0,25)]
  ].join("");
  return `TX${six}`;
}

export function pushRandomWithdrawalToast() {
  const msisdn  = randomMaskedMsisdn();
  const amount  = randomAmount();
  const balance = randInt(20, 100); // small, feels realistic for “new balance”
  const ref     = randomRef();

  toast.custom((t) => (
    <div
      className={`w-[300px] sm:w-[360px] rounded-xl border border-amber-200 bg-white shadow-lg
                  ${t.visible ? "animate-in fade-in slide-in-from-top-2" : "animate-out fade-out"} `}
      style={{ padding: "12px 14px" }}
    >
      <div className="text-slate-900 font-bold">Withdrawal</div>
      <div className="mt-1 text-slate-700">
        <span className="font-mono tracking-tight">{msisdn}</span> has withdrawn{" "}
        <span className="font-semibold">{kes.format(amount)}</span>.{" "}
        New balance: <span className="font-semibold">{kes.format(balance)}</span>.{" "}
        Ref. <span className="font-mono">{ref}</span>
      </div>
    </div>
  ));
}
