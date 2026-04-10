import { useEffect, useState, useMemo } from "react";

const ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px);} to {opacity:1; transform:translateY(0);} }
  .ph-card { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
.shine-text {
  background: linear-gradient(90deg,#16a34a,#22c55e,#86efac,#22c55e,#16a34a);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
`;

const PALETTE_BY_NAME = {
  Pon:    { dot: "#ef4444", glow: "rgba(239,68,68,0.28)",   bg: "rgba(239,68,68,0.08)",   light: "rgba(239,68,68,0.15)" },
  Naveen: { dot: "#60a5fa", glow: "rgba(96,165,250,0.28)",  bg: "rgba(96,165,250,0.08)",  light: "rgba(96,165,250,0.15)" },
  Varun:  { dot: "#fbbf24", glow: "rgba(251,191,36,0.28)",  bg: "rgba(251,191,36,0.08)",  light: "rgba(251,191,36,0.15)" },
  Pal:    { dot: "#ec4899", glow: "rgba(236,72,153,0.28)",  bg: "rgba(236,72,153,0.08)",  light: "rgba(236,72,153,0.15)" },
};

const FILENAME_BY_NAME = { Pon: "Pon.png", Naveen: "Naveen.png", Pal: "Pal.png", Varun: "Varun.png" };

const TEAM_LOGOS = {
  CSK:"CSK.jpg", MI:"MI.png", RCB:"RCB.jpg", PBKS:"PBKS.png",
  DC:"DC.jpg", KKR:"KKR.jpg", GT:"GT.png", LSG:"LSG.jpeg", RR:"RR.jpg", SRH:"SRH.jpg",
};

const ALL_PLAYERS = ["Pon", "Naveen", "Varun", "Pal"];

function imageSrcFor(name) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${FILENAME_BY_NAME[name] || name + ".png"}`;
}
function teamLogoSrc(t) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${TEAM_LOGOS[t?.toUpperCase()] || t + ".png"}`;
}

/* ─── SVG Icons ─── */
function IconWallet({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2"/>
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/>
    </svg>
  );
}
function IconFree({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9 9h6M9 12h6M9 15h4"/>
    </svg>
  );
}
function IconWin({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

/* ─── Ledger computation ─── */
function computeLedger(matchHistory) {
  const ledger = {};
  ALL_PLAYERS.forEach(name => {
    ledger[name] = { totalDeposited: 0, totalWon: 0, matchesPlayed: 0, matchesWon: 0, transactions: [], netBalance: 0 };
  });

  matchHistory.forEach((match) => {
    const players = match.players || [];
    const sorted = [...players].sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
    const maxPts = sorted.length ? parseFloat(sorted[0].points || 0) : 0;
    const winners = sorted.filter(p => parseFloat(p.points || 0) === maxPts);
    const totalPrize = players.reduce((s, p) => s + parseFloat(p.paid || 0), 0);
    const share = winners.length && totalPrize > 0 ? totalPrize / winners.length : 0;

    players.forEach(mp => {
      const name = mp.player;
      if (!ledger[name]) return;
      const paid = parseFloat(mp.paid || 0);
      const isWinner = winners.some(w => w.player === name);
      const won = isWinner ? share : 0;

      ledger[name].matchesPlayed += 1;
      ledger[name].totalDeposited += paid;
      ledger[name].totalWon += won;
      if (isWinner && share > 0) ledger[name].matchesWon += 1;

      // ALWAYS push entry fee tx — even if paid=0 (FREE entry)
      ledger[name].transactions.push({
        type: paid > 0 ? "deposit" : "free",
        order: 0,
        amount: paid,
        isFree: paid === 0,
        matchNum: parseFloat(match.match),
        matchOn: match.matchOn,
        teams: match.teams || [],
        label: paid > 0 ? `Entry fee` : `Free entry`,
      });

      // ALWAYS push result tx — win or loss
      ledger[name].transactions.push({
        type: isWinner && share > 0 ? "win" : "loss",
        order: 1,
        amount: won,
        matchNum: parseFloat(match.match),
        matchOn: match.matchOn,
        teams: match.teams || [],
        label: isWinner && share > 0 ? `Won` : `No win`,
      });
    });
  });

  ALL_PLAYERS.forEach(name => {
    ledger[name].netBalance = ledger[name].totalWon - ledger[name].totalDeposited;
    // Latest match first; within same match → entry (order 0) before result (order 1)
    ledger[name].transactions.sort((a, b) =>
      b.matchNum !== a.matchNum ? b.matchNum - a.matchNum : a.order - b.order
    );
  });

  return ledger;
}

/* ─── Team chip ─── */
function TeamChip({ name }) {
  const [failed, setFailed] = useState(false);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 99, padding: "2px 8px 2px 4px",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", color: "rgba(255,255,255,0.55)"
    }}>
      {!failed
        ? <img src={teamLogoSrc(name)} alt={name} onError={() => setFailed(true)} style={{ width: 14, height: 14, borderRadius: "50%", objectFit: "cover" }} />
        : <span style={{ width: 14, height: 14, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "inline-block" }} />
      }
      {name}
    </span>
  );
}

/* ─── Player selector card ─── */
function PlayerCard({ name, data, isSelected, onClick }) {
  const pal = PALETTE_BY_NAME[name] || { dot: "#9ca3af", glow: "rgba(156,163,175,0.2)", bg: "rgba(156,163,175,0.08)" };
  const net = data.netBalance ?? 0;
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <button onClick={onClick} style={{
      all: "unset", cursor: "pointer", display: "block",
      borderRadius: 20, overflow: "hidden",
      border: `1.5px solid ${isSelected ? pal.dot : "rgba(255,255,255,0.07)"}`,
      boxShadow: isSelected ? `0 0 0 3px ${pal.glow}, 0 12px 32px rgba(0,0,0,0.4)` : "0 4px 16px rgba(0,0,0,0.3)",
      background: isSelected ? pal.bg : "rgba(255,255,255,0.025)",
      transition: "all 0.25s ease", flex: "0 0 auto", width: 100,
    }}>
      <div style={{ height: 3, background: isSelected ? `linear-gradient(90deg,${pal.dot},transparent)` : "transparent", transition: "background 0.25s" }} />
      <div style={{ padding: "12px 10px 14px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", overflow: "hidden",
          border: `2px solid ${isSelected ? pal.dot : "rgba(255,255,255,0.1)"}`,
          boxShadow: isSelected ? `0 0 14px ${pal.glow}` : "none",
          background: pal.bg, flexShrink: 0, transition: "border-color 0.25s, box-shadow 0.25s",
        }}>
          {!imgFailed
            ? <img src={imageSrcFor(name)} alt={name} onError={() => setImgFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: pal.dot, fontFamily: "'Bebas Neue',sans-serif" }}>{name[0]}</div>
          }
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: isSelected ? "#fff" : "rgba(255,255,255,0.5)", letterSpacing: "0.04em", textAlign: "center", transition: "color 0.2s" }}>
          {name}
        </div>
        <div style={{ fontSize: 13, fontWeight: 800, color: net > 0 ? "#34d399" : net < 0 ? "#f87171" : "rgba(255,255,255,0.35)", fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.04em" }}>
          {net > 0 ? "+" : ""}{net === 0 ? "±0" : `₹${Math.abs(net)}`}
        </div>
      </div>
    </button>
  );
}

/* ─── Match group ─── */
function MatchGroup({ depositTx, resultTx, matchIdx, playerPal }) {
  const isWin = resultTx?.type === "win";
  const isFree = depositTx?.isFree;
  const matchNum = depositTx?.matchNum ?? resultTx?.matchNum;

  // Deposit uses the player's own palette color
  const depositColor  = isFree ? "rgba(255,255,255,0.35)" : playerPal.dot;
  const depositBg     = isFree ? "rgba(255,255,255,0.03)"  : playerPal.bg;
  const depositBorder = isFree ? "rgba(255,255,255,0.08)"  : `${playerPal.dot}40`;

  return (
    <div className="ph-card" style={{ animationDelay: `${0.03 + matchIdx * 0.06}s`, marginBottom: 14 }}>

      {/* Match header */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, paddingLeft: 2 }}>
        <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 11, letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)" }}>
          MATCH {String(matchNum).padStart(2, "0")}
        </span>
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
        <div style={{ display: "flex", gap: 4 }}>
          {(depositTx?.teams || []).map((t, i) => <TeamChip key={i} name={t} />)}
        </div>
        {depositTx?.matchOn && (
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 600 }}>{depositTx.matchOn}</span>
        )}
      </div>

      <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.015)" }}>

        {/* Win row — only shown if won */}
        {isWin && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "rgba(52,211,153,0.08)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: "rgba(52,211,153,0.14)", border: "1.5px solid rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconWin size={17} color="#34d399" />
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(52,211,153,0.9)", letterSpacing: "0.04em" }}>WON</span>
            </div>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, lineHeight: 1, color: "#34d399", letterSpacing: "0.04em" }}>
              +₹{Number.isInteger(resultTx.amount) ? resultTx.amount : parseFloat(resultTx.amount.toFixed(1))}
            </div>
          </div>
        )}

        {/* Entry fee row */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: depositBg }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: isFree ? "rgba(255,255,255,0.05)" : `${playerPal.dot}18`, border: `1.5px solid ${depositBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {isFree
              ? <IconFree size={17} color="rgba(255,255,255,0.35)" />
              : <IconWallet size={17} color={playerPal.dot} />
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: isFree ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
              {isFree ? "FREE ENTRY" : "ENTRY FEE"}
            </div>
          </div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, lineHeight: 1, color: depositColor, letterSpacing: "0.04em" }}>
            {isFree ? "FREE" : `-₹${depositTx.amount}`}
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Main component ─── */
export default function PaymentHistory({ matchHistory = [] }) {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState("Pon");
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  const ledger = useMemo(() => computeLedger(matchHistory), [matchHistory]);
  const data = ledger[selected] || {};
  const pal = PALETTE_BY_NAME[selected] || { dot: "#9ca3af", glow: "rgba(156,163,175,0.2)", bg: "rgba(156,163,175,0.08)", light: "rgba(156,163,175,0.12)" };
  const net = data.netBalance ?? 0;
  const [imgFailed, setImgFailed] = useState(false);
  useEffect(() => { setImgFailed(false); }, [selected]);

  // Group transactions into pairs: [depositTx, resultTx] per match
  const matchGroups = useMemo(() => {
    const txs = data.transactions || [];
    const groups = [];
    for (let i = 0; i < txs.length; i += 2) {
      groups.push({ depositTx: txs[i], resultTx: txs[i + 1] });
    }
    return groups;
  }, [data.transactions]);

  return (
    <>
      <style>{ANIM}</style>
      <div className="min-h-screen" style={{ background: "#080810", color: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

          {/* Header */}
          <div style={{ padding: "52px 0 28px", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(-10px)", transition: "opacity 0.5s ease, transform 0.5s ease" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>
              HPL · Season 2026
            </p>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.9 }}>
              <span style={{ fontSize: 46, color: "rgba(255,255,255,0.88)" }}>Payment&nbsp;</span>
              <span className="shine-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 54 }}>History</span>
            </div>
          </div>

          {/* Player selector */}
          <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 24, scrollbarWidth: "none" }}>
            {ALL_PLAYERS.map(name => (
              <PlayerCard key={name} name={name} data={ledger[name] || {}} isSelected={selected === name} onClick={() => setSelected(name)} />
            ))}
          </div>

          {/* Hero card */}
          <div style={{ borderRadius: 24, overflow: "hidden", border: `1px solid ${pal.dot}40`, background: "rgba(255,255,255,0.025)", backdropFilter: "blur(8px)", boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 60px ${pal.glow}`, marginBottom: 24 }}>
            <div style={{ height: 4, background: `linear-gradient(90deg, ${pal.dot}, transparent)` }} />

            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, padding: "20px 20px 0" }}>
              <div style={{ width: 110, height: 130, borderRadius: 16, overflow: "hidden", flexShrink: 0, border: `2px solid ${pal.dot}`, boxShadow: `0 0 24px ${pal.glow}, 0 8px 24px rgba(0,0,0,0.5)`, background: pal.bg }}>
                {!imgFailed
                  ? <img src={imageSrcFor(selected)} alt={selected} onError={() => setImgFailed(true)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, color: pal.dot }}>{selected[0]}</div>
                }
              </div>
              <div style={{ flex: 1, paddingBottom: 16 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", marginBottom: 4 }}>PLAYER</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 38, lineHeight: 0.95, color: "#fff", marginBottom: 10 }}>{selected}</div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: pal.light, border: `1px solid ${pal.dot}50`, borderRadius: 99, padding: "5px 12px", fontSize: 12, fontWeight: 700 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: pal.dot, boxShadow: `0 0 6px ${pal.dot}`, display: "inline-block", animation: "pulse-dot 2s infinite" }} />
                  <span style={{ color: pal.dot }}>
                    {data.matchesPlayed > 0 ? `${data.matchesWon}/${data.matchesPlayed} wins` : "No matches"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0, margin: "16px 16px 0", borderRadius: 14, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
              {[
                { label: "Deposited", value: `₹${data.totalDeposited ?? 0}`, color: pal.dot },
                { label: "Won", value: `₹${data.totalWon ?? 0}`, color: "#34d399" },
                { label: "Net", value: net === 0 ? "±₹0" : `${net > 0 ? "+" : "−"}₹${Math.abs(net)}`, color: net > 0 ? "#34d399" : net < 0 ? "#f87171" : "rgba(255,255,255,0.4)" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center", padding: "14px 8px", background: "rgba(255,255,255,0.03)", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginBottom: 5 }}>{s.label.toUpperCase()}</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, lineHeight: 1, color: s.color, letterSpacing: "0.04em" }}>{s.value}</div>
                </div>
              ))}
            </div>

            {/* P&L bar */}
            <div style={{ padding: "14px 16px 16px" }}>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600, marginBottom: 6, letterSpacing: "0.1em" }}>P&L OVERVIEW</div>
              <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                {(data.totalDeposited > 0 || data.totalWon > 0) && (
                  <div style={{ height: "100%", borderRadius: 99, width: `${Math.min(100, data.totalDeposited > 0 ? (data.totalWon / data.totalDeposited) * 100 : 100)}%`, background: net >= 0 ? "linear-gradient(90deg,#34d399,#6ee7b7)" : "linear-gradient(90deg,#f87171,#fca5a5)", transition: "width 0.6s cubic-bezier(0.16,1,0.3,1)" }} />
                )}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 10, color: pal.dot, fontWeight: 600 }}>Deposited ₹{data.totalDeposited ?? 0}</span>
                <span style={{ fontSize: 10, color: "#34d399", fontWeight: 600 }}>Won ₹{data.totalWon ?? 0}</span>
              </div>
            </div>
          </div>

          {/* Transaction match groups */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.22)", marginBottom: 14 }}>
              TRANSACTIONS · {matchGroups.length} matches
            </div>

            {matchGroups.length === 0 && (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", padding: "40px 0", fontSize: 14 }}>No transactions yet</div>
            )}

            {matchGroups.map((g, i) => (
              <MatchGroup key={g.depositTx?.matchNum ?? i} depositTx={g.depositTx} resultTx={g.resultTx} matchIdx={i} playerPal={pal} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}