import React, { useState } from "react";
import QuestionsPage from "./pages/QuestionsPage.jsx";

/* ================================================================== */
/*  kaçlazım?  —  Yeditepe Tıp · Dönem II final hedefi hesaplayıcı     */
/*  Yıl sonu = SRP + 0,582·Komite ort. + 0,388·Final                  */
/*  Geçme 60 · bir komite 60 altıysa final ≥ 50 · final 200 soru      */
/* ================================================================== */

const C = {
  bg: "#081428",
  surface: "#0F2647",
  surface2: "#143057",
  border: "#21406F",
  borderSoft: "#1A3258",
  text: "#EAF1FB",
  textMute: "#94ABCF",
  gold: "#F6B83E",
  goldSoft: "#FBD07A",
  green: "#34D399",
  red: "#F87171",
};

const COMMITTEES = [
  { name: "Komite 1", total: 38 },
  { name: "Komite 2", total: 35 },
  { name: "Komite 3", total: 45 },
  { name: "Komite 4", total: 40 },
  { name: "Komite 5", total: 42 },
];

const COURSES = [
  { name: "Fizyoloji", counts: [12, 6, 6, 12, 10] },
  { name: "Anatomi", counts: [5, 4, 7, 15, 6] },
  { name: "Histoloji", counts: [4, 2, 5, 5, 5] },
  { name: "Biyokimya", counts: [4, 0, 12, 0, 9] },
  { name: "Mikrobiyoloji", counts: [3, 9, 6, 0, 1] },
  { name: "Patoloji", counts: [3, 2, 2, 0, 2] },
  { name: "Biyofizik", counts: [4, 1, 3, 1, 1] },
  { name: "Biyoistatistik", counts: [1, 1, 1, 2, 1] },
  { name: "İmmünoloji", counts: [1, 3, 1, 1, 1] },
  { name: "Genetik", counts: [0, 6, 0, 0, 0] },
  { name: "Med. Biyoloji", counts: [1, 1, 2, 1, 2] },
  { name: "Farmakoloji", counts: [0, 0, 0, 3, 4] },
].map((c) => ({ ...c, total: c.counts.reduce((a, b) => a + b, 0) }));

const TOTAL_Q = 200;
const PASS = 59.5;
const W_K = 0.582;
const W_F = 0.388;
const BARAJ = 50;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const f1 = (n) => (Number.isFinite(n) ? n.toFixed(1).replace(".", ",") : "—");

/* ---------- Logo ---------- */
function Logo() {
  return (
    <div className="flex items-center gap-3">
      <svg width="42" height="42" viewBox="0 0 40 40" aria-hidden="true">
        <defs>
          <linearGradient id="kl-badge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1A3A68" />
            <stop offset="1" stopColor="#0B1E3B" />
          </linearGradient>
        </defs>
        <rect x="0.5" y="0.5" width="39" height="39" rx="12" fill="url(#kl-badge)" stroke={C.border} />
        <circle cx="20" cy="20" r="11" fill="none" stroke={C.text} strokeOpacity="0.22" strokeWidth="2" />
        <circle cx="20" cy="20" r="6.2" fill="none" stroke={C.text} strokeOpacity="0.5" strokeWidth="2" />
        <circle cx="20" cy="20" r="2.6" fill={C.gold} />
      </svg>
      <div className="leading-none">
        <div className="text-xl font-extrabold tracking-tight" style={{ color: C.text }}>
          kaçlazım<span style={{ color: C.gold }}>?</span>
        </div>
        <div className="mt-1 text-[11px] font-medium" style={{ color: C.textMute }}>
          Dönem II · final hesabı
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("hedef");
  const [page, setPage] = useState("calculator");
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [scores, setScores] = useState(["", "", "", "", ""]);
  const [srp, setSrp] = useState(3);

  const nums = scores.map((s) =>
    s === "" ? null : clamp(parseFloat(s.replace(",", ".")) || 0, 0, 100)
  );
  const allEntered = nums.every((n) => n !== null);
  const K = allEntered ? nums.reduce((a, b) => a + b, 0) / 5 : null;
  const minK = allEntered ? Math.min(...nums) : null;
  const barajActive = allEntered && minK < PASS;

  let fPass = null, fReq = null, status = null;
  if (allEntered) {
    fPass = (PASS - srp - W_K * K) / W_F;
    fReq = barajActive ? Math.max(fPass, BARAJ) : fPass;
    if (fReq > 100) status = "impossible";
    else if (fReq <= 0 && !barajActive) { status = "guaranteed"; fReq = 0; }
    else status = "normal";
  }
  const correctNeeded =
    status === "normal" || status === "guaranteed"
      ? Math.min(TOTAL_Q, Math.ceil(fReq * 2))
      : null;
  const baseLocked = allEntered ? srp + W_K * K : null;

  const setScore = (i, v) => {
    const next = [...scores];
    next[i] = v.replace(/[^0-9.,]/g, "");
    setScores(next);
  };

  const cardStyle = { background: C.surface, border: `1px solid ${C.borderSoft}` };
  if (page === "questions") {
  return <QuestionsPage />;
}

  return (
    <div
      className="min-h-screen antialiased"
      style={{
        color: C.text,
        backgroundColor: C.bg,
        backgroundImage:
          "radial-gradient(1100px 520px at 50% -8%, #14315C 0%, rgba(8,20,40,0) 62%)",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <style>{`
        @media (prefers-reduced-motion: reduce){ *{transition:none!important;animation:none!important} }
        input::placeholder{ color:${C.textMute}; opacity:.7 }
        input[type=range]{ accent-color:${C.gold} }
      `}</style>

      <div className="mx-auto max-w-3xl px-4 pb-24 pt-6 sm:pt-9">
        {page === "questions" && (
  <div className="mb-8">
    <h1
      className="mb-6 text-3xl font-extrabold"
      style={{ color: C.gold }}
    >
      Çıkmış Sorular
    </h1>

    {!selectedCommittee ? (
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setSelectedCommittee(n)}
            className="rounded-xl p-5 text-left font-semibold"
            style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
            }}
          >
            Komite {n}
          </button>
        ))}
      </div>
    ) : (
      <div>
        <button
          onClick={() => setSelectedCommittee(null)}
          className="mb-4 rounded-lg px-3 py-2"
          style={{
            background: C.surface2,
            color: C.text,
          }}
        >
          ← Geri
        </button>

        <h2 className="mb-4 text-xl font-bold">
          Komite {selectedCommittee}
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {[2025, 2024, 2023].map((year) => (
            <button
              key={year}
              className="rounded-xl p-5 text-left font-semibold"
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
              }}
            >
              {year} Çıkmışı
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
)}
        {/* Top bar */}
        <header className="mb-9 flex items-center justify-between">
  <Logo />

  <div className="flex items-center gap-2">
    <button
      onClick={() => setPage("questions")}
      className="rounded-full px-3 py-1 text-[11px] font-semibold"
      style={{
        background: C.gold,
        color: C.bg,
      }}
    >
      Çıkmış Sorular
    </button>

    <span
      className="rounded-full px-3 py-1 text-[11px] font-medium"
      style={{
        background: C.surface2,
        color: C.textMute,
        border: `1px solid ${C.borderSoft}`,
      }}
    >
      Yeditepe Tıp
    </span>
  </div>
</header>

        {/* Hero */}
        <div className="mb-7">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Finalden <span style={{ color: C.gold }}>kaç lazım?</span>
          </h1>
          <p className="mt-2 max-w-xl text-sm sm:text-base" style={{ color: C.textMute }}>
            5 komite notunu gir; geçmek için gereken final notunu ve 200 soruda kaç
            doğru tutturman gerektiğini anında hesaplasın.
          </p>
        </div>

        {/* Tabs */}
        <div
          className="mb-6 inline-flex rounded-xl p-1"
          style={{ background: C.surface, border: `1px solid ${C.borderSoft}` }}
        >
          {[["hedef", "Hedef hesapla"], ["plan", "Final soru planı"]].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="rounded-lg px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              style={
                tab === id
                  ? { background: C.surface2, color: C.text }
                  : { background: "transparent", color: C.textMute }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "hedef" && (
          <div className="space-y-5">
            {/* Girdi */}
            <section className="rounded-2xl p-5 shadow-xl" style={cardStyle}>
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: C.textMute }}>
                Komite sonuç notların
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {COMMITTEES.map((c, i) => {
                  const low = nums[i] !== null && nums[i] < PASS;
                  return (
                    <label key={c.name} className="block">
                      <span className="mb-1 block text-xs font-medium" style={{ color: C.textMute }}>
                        {c.name}
                      </span>
                      <input
                        inputMode="decimal"
                        value={scores[i]}
                        onChange={(e) => setScore(i, e.target.value)}
                        placeholder="0–100"
                        className="w-full rounded-lg px-3 py-2 text-center font-mono text-lg tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                        style={{
                          background: C.surface2,
                          color: low ? C.gold : C.text,
                          border: `1px solid ${low ? C.gold : C.border}`,
                        }}
                      />
                    </label>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-sm font-medium" style={{ color: C.textMute }}>
                  SRP puanı
                </span>
                <div className="inline-flex overflow-hidden rounded-lg" style={{ border: `1px solid ${C.border}` }}>
                  {[0, 1, 2, 3].map((v) => (
                    <button
                      key={v}
                      onClick={() => setSrp(v)}
                      className="px-4 py-1.5 font-mono text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      style={{
                        background: srp === v ? C.surface2 : "transparent",
                        color: srp === v ? C.gold : C.textMute,
                        borderLeft: v !== 0 ? `1px solid ${C.border}` : "none",
                        fontWeight: srp === v ? 700 : 500,
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {allEntered && (
                  <span className="ml-auto text-sm" style={{ color: C.textMute }}>
                    Komite ort.{" "}
                    <span className="font-mono font-semibold" style={{ color: C.text }}>
                      {f1(K)}
                    </span>
                  </span>
                )}
              </div>
            </section>

            {/* Sonuç */}
            {!allEntered ? (
              <div
                className="rounded-2xl p-6 text-center text-sm"
                style={{ border: `1px dashed ${C.border}`, color: C.textMute }}
              >
                Hesap için 5 komite notunu da gir.
              </div>
            ) : status === "impossible" ? (
              <StateCard tone="red" label="Finalden geçmen mümkün değil">
                <p className="text-sm" style={{ color: C.text }}>
                  Gereken final <span className="font-mono font-semibold">{f1(fReq)}</span> çıkıyor —
                  100'ün üstünde. Bu notlarla finalden geçemezsin, <b>bütünlemeye</b> kalıyorsun.
                </p>
              </StateCard>
            ) : status === "guaranteed" ? (
              <StateCard tone="green" label="Finale girmeden bile geçtin">
                <p className="text-sm" style={{ color: C.text }}>
                  Cepteki puanın <span className="font-mono font-semibold">{f1(baseLocked)}</span> —
                  zaten 60'ın üstünde. Yine de finale girmen gerekir.
                </p>
              </StateCard>
            ) : (
              <section
                className="relative overflow-hidden rounded-2xl p-6 shadow-xl"
                style={{
                  background: "linear-gradient(160deg, #0F2647 0%, #0B1E3B 100%)",
                  border: `1px solid ${barajActive ? "rgba(246,184,62,0.4)" : C.border}`,
                }}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full"
                  style={{ background: "radial-gradient(circle, rgba(246,184,62,0.18), rgba(246,184,62,0))" }}
                />
                <div className="mb-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: C.gold }} />
                  <span className="text-sm font-semibold" style={{ color: C.textMute }}>
                    Geçmek için finalden en az
                  </span>
                </div>
                <div className="flex items-end gap-2">
                  <span
                    className="font-mono text-7xl font-extrabold leading-none tabular-nums"
                    style={{ color: C.gold, textShadow: "0 0 38px rgba(246,184,62,0.35)" }}
                  >
                    {Math.ceil(fReq)}
                  </span>
                  <span className="pb-2 text-lg" style={{ color: C.textMute }}>/ 100</span>
                </div>
                <p className="mt-3 text-sm" style={{ color: C.textMute }}>
                  Bu da 200 soruluk finalde{" "}
                  <span className="font-mono font-semibold" style={{ color: C.text }}>
                    {correctNeeded}
                  </span>{" "}
                  doğru demek.
                </p>

                {barajActive && (
                  <p
                    className="mt-4 rounded-lg px-3 py-2 text-xs"
                    style={{ background: "rgba(246,184,62,0.12)", color: C.goldSoft }}
                  >
                    Bir komiten 60'ın altında ({f1(minK)}), o yüzden <b>50 barajı</b> devrede.{" "}
                    {fPass < BARAJ
                      ? "Ortalama açısından daha azı yeterdi ama barajı geçmek için 50 şart."
                      : "Asıl belirleyen yine de ortalama."}
                  </p>
                )}

                <div
                  className="mt-5 space-y-1 border-t pt-4 text-xs"
                  style={{ borderColor: C.borderSoft, color: C.textMute }}
                >
                  <div className="flex justify-between">
                    <span>Cepteki puan (SRP + 0,582·komite)</span>
                    <span className="font-mono">{f1(baseLocked)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finalin katkısı (0,388·final)</span>
                    <span className="font-mono">+{f1(W_F * fReq)}</span>
                  </div>
                </div>

                <button
                  onClick={() => setTab("plan")}
                  className="mt-5 text-sm font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  style={{ color: C.gold }}
                >
                  → Final soru planına geç
                </button>
              </section>
            )}

            <p className="px-1 text-xs" style={{ color: C.textMute }}>
              Yıl sonu = SRP + 0,582·komite ort. + 0,388·final · Geçme 60 · Yanlış doğruyu
              götürmüyor varsayıldı.
            </p>
          </div>
        )}

        {tab === "plan" && (
          <FinalPlanner suggestedTarget={status === "normal" ? Math.ceil(fReq) : null} cardStyle={cardStyle} />
        )}

        <footer className="mt-10 text-center text-[11px]" style={{ color: C.textMute }}>
          kaçlazım? · tahmin aracıdır, kesin sonuç fakülte hesabına göredir
        </footer>
      </div>
    </div>
  );
}

/* ---------- Durum kartı (impossible / guaranteed) ---------- */
function StateCard({ tone, label, children }) {
  const map = {
    green: { c: C.green, bg: "rgba(52,211,153,0.10)", b: "rgba(52,211,153,0.35)" },
    red: { c: C.red, bg: "rgba(248,113,113,0.10)", b: "rgba(248,113,113,0.35)" },
  }[tone];
  return (
    <section className="rounded-2xl p-5 shadow-xl" style={{ background: map.bg, border: `1px solid ${map.b}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: map.c }} />
        <span className="text-sm font-semibold" style={{ color: map.c }}>{label}</span>
      </div>
      {children}
    </section>
  );
}

/* ---------- Final soru planlayıcı ---------- */
function FinalPlanner({ suggestedTarget, cardStyle }) {
  const proportional = (t) =>
    COURSES.map((c) => clamp(Math.round((t / 100) * c.total), 0, c.total));
  const [target, setTarget] = useState(suggestedTarget || 60);
  const [plan, setPlan] = useState(() => proportional(suggestedTarget || 60));

  const planTotal = plan.reduce((a, b) => a + b, 0);
  const projected = (planTotal / TOTAL_Q) * 100;
  const need = Math.min(TOTAL_Q, Math.ceil((target / 100) * TOTAL_Q));
  const ok = planTotal >= need;

  const setCourse = (i, v) => {
    const next = [...plan];
    next[i] = clamp(Math.round(v), 0, COURSES[i].total);
    setPlan(next);
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl p-5 shadow-xl" style={cardStyle}>
        <div className="flex flex-wrap items-end gap-4">
          <label className="block">
            <span className="mb-1 block text-xs font-medium" style={{ color: C.textMute }}>
              Hedef final notu
            </span>
            <input
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(clamp(parseInt(e.target.value.replace(/\D/g, "")) || 0, 0, 100))}
              className="w-24 rounded-lg px-3 py-2 text-center font-mono text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              style={{ background: C.surface2, color: C.text, border: `1px solid ${C.border}` }}
            />
          </label>
          <div className="text-sm" style={{ color: C.textMute }}>
            Gereken doğru:{" "}
            <span className="font-mono text-lg font-semibold" style={{ color: C.text }}>{need}</span>
            <span style={{ color: C.textMute }}> / {TOTAL_Q}</span>
          </div>
          <button
            onClick={() => setPlan(proportional(target))}
            className="ml-auto rounded-lg px-3 py-2 text-sm font-semibold transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            style={{ color: C.bg, background: C.gold }}
          >
            Hedefe göre dağıt
          </button>
        </div>
        {suggestedTarget && (
          <p className="mt-2 text-xs" style={{ color: C.textMute }}>
            Hesaplayıcıdan gelen öneri: {suggestedTarget}. İstediğin gibi değiştir.
          </p>
        )}
      </section>

      {/* Canlı durum */}
      <section
        className="rounded-2xl p-5 shadow-xl"
        style={{
          background: ok ? "rgba(52,211,153,0.10)" : "rgba(248,113,113,0.10)",
          border: `1px solid ${ok ? "rgba(52,211,153,0.35)" : "rgba(248,113,113,0.35)"}`,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold" style={{ color: C.textMute }}>Planlanan doğru</div>
            <div className="font-mono text-4xl font-extrabold tabular-nums" style={{ color: C.text }}>
              {planTotal}
              <span className="text-lg" style={{ color: C.textMute }}> / {TOTAL_Q}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm" style={{ color: C.textMute }}>Final notu ≈</div>
            <div className="font-mono text-3xl font-extrabold" style={{ color: ok ? C.green : C.red }}>
              {f1(projected)}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm" style={{ color: ok ? C.green : C.red }}>
          {ok ? `Hedefi tutuyorsun (${need} doğru yetiyor).` : `${need - planTotal} doğru daha lazım.`}
        </p>
      </section>

      {/* Ders bazlı */}
      <section className="rounded-2xl p-5 shadow-xl" style={cardStyle}>
        <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: C.textMute }}>
          Hangi dersten kaç doğru
        </h2>
        <p className="mb-4 text-xs" style={{ color: C.textMute }}>
          Her dersin finaldeki soru sayısı sabit. Kaydırarak hedefini ayarla — üstteki
          tahmin anında güncellenir.
        </p>
        <div className="space-y-3">
          {COURSES.map((c, i) => (
            <div key={c.name} className="flex items-center gap-3">
              <div className="w-28 shrink-0 text-sm" style={{ color: C.text }}>{c.name}</div>
              <input
                type="range"
                min={0}
                max={c.total}
                value={plan[i]}
                onChange={(e) => setCourse(i, +e.target.value)}
                className="h-2 flex-1 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                style={{ background: C.surface2 }}
              />
              <div className="w-16 shrink-0 text-right font-mono text-sm tabular-nums" style={{ color: C.text }}>
                {plan[i]}
                <span style={{ color: C.textMute }}>/{c.total}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t pt-3 text-sm" style={{ borderColor: C.borderSoft }}>
          <span className="font-medium" style={{ color: C.textMute }}>Toplam</span>
          <span className="font-mono font-semibold" style={{ color: C.text }}>
            {planTotal} / {TOTAL_Q}
          </span>
        </div>
      </section>

      <p className="px-1 text-xs" style={{ color: C.textMute }}>
        Final 200 soru · Yanlış doğruyu götürmüyor varsayıldı.
      </p>
    </div>
  );
}