import { useMemo } from "react";

const ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)} }
  .pts-card { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both 0.08s; }
  .shine-text {
    background: linear-gradient(90deg,#ef4444,#f97316,#fbbf24,#f97316,#ef4444);
    background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  @keyframes shimmer { 0%{background-position:-200% center}100%{background-position:200% center} }
`;

const PALETTE = {
  Pon:    { dot: "#ef4444", glow: "rgba(239,68,68,0.35)",    dim: "rgba(239,68,68,0.09)"    },
  Naveen: { dot: "#60a5fa", glow: "rgba(96,165,250,0.35)",   dim: "rgba(96,165,250,0.09)"   },
  Varun:  { dot: "#fbbf24", glow: "rgba(251,191,36,0.35)",   dim: "rgba(251,191,36,0.09)"   },
  Pal:    { dot: "#ec4899", glow: "rgba(236,72,153,0.35)",   dim: "rgba(236,72,153,0.09)"   },
};

function imageSrcFor(name) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${name}.png`;
}

function computeStandings(matchHistory = []) {
  const stats = {};
  matchHistory.forEach((match) => {
    const players = match.players || [];
    if (!players.length) return;
    const maxPts = Math.max(...players.map((p) => parseFloat(p.points || 0)));
    players.forEach((p) => {
      const nm = p.player;
      if (!stats[nm]) stats[nm] = { player: nm, M: 0, W: 0, L: 0, totalPts: 0, results: [] };
      const pts = parseFloat(p.points || 0);
      stats[nm].M++;
      stats[nm].totalPts += pts;
      if (pts === maxPts) { stats[nm].W++; stats[nm].results.push("W"); }
      else                { stats[nm].L++; stats[nm].results.push("L"); }
    });
  });
  // Sort by total FPTS
  return Object.values(stats).sort((a, b) => b.totalPts - a.totalPts);
}

function Last10({ results = [] }) {
  const recent = results.slice(-10);
  const dots = Array.from({ length: 10 }, (_, i) => recent[i] || null);
  return (
    <div style={{ display: "flex", gap: 4, justifyContent: "center", flexWrap: "wrap", marginTop: 10 }}>
      {dots.map((r, i) => {
        const isW = r === "W", isL = r === "L";
        return (
          <div key={i} style={{
            width: 26, height: 18, borderRadius: 5,
            fontSize: 8, fontWeight: 700, lineHeight: "18px", textAlign: "center",
            background: isW ? "rgba(52,211,153,0.18)" : isL ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.04)",
            color:      isW ? "#34d399"                : isL ? "#f87171"               : "transparent",
            border: `1px solid ${isW ? "rgba(52,211,153,0.4)" : isL ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.08)"}`,
          }}>
            {r || ""}
          </div>
        );
      })}
    </div>
  );
}

const COL = "52px 90px 1fr 1fr";

const colLabelStyle = {
  fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
  textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
  textAlign: "center",
};

export default function Points({ matchHistory = [] }) {
  const standings = useMemo(() => computeStandings(matchHistory), [matchHistory]);
  const maxTotal = Math.max(...standings.map((s) => s.totalPts), 1);

  return (
    <>
      <style>{ANIM}</style>
      <div className="min-h-screen" style={{ background: "#080810", color: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

          {/* Header */}
          <div style={{ padding: "52px 0 24px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>
              HPL · Season 2026
            </p>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.9 }}>
              <span style={{ fontSize: 46, color: "rgba(255,255,255,0.88)" }}>Points&nbsp;</span>
              <span className="shine-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 54 }}>Table</span>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
              {matchHistory.length} match{matchHistory.length !== 1 ? "es" : ""} played
            </div>
          </div>

          {/* Table card */}
          <div className="pts-card" style={{
            borderRadius: 24, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.07)",
            background: "rgba(255,255,255,0.028)", backdropFilter: "blur(8px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
          }}>
            <div style={{ height: 3, background: "linear-gradient(90deg,#ef4444,#f97316,transparent)" }} />

            {/* Column headers */}
            <div style={{ display: "grid", gridTemplateColumns: COL, alignItems: "center", padding: "10px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={colLabelStyle}>Rank</span>
              <span style={colLabelStyle}>Player</span>
              <span style={colLabelStyle}>M · W · L</span>
              <span style={colLabelStyle}>FPTS</span>
            </div>

            {/* Rows */}
            {standings.map((s, i) => {
              const pal = PALETTE[s.player] || { dot: "#9ca3af", glow: "rgba(156,163,175,0.3)", dim: "rgba(156,163,175,0.08)" };
              const barW = Math.round((s.totalPts / maxTotal) * 100);

              return (
                <div key={s.player} style={{
                  padding: "14px 14px 18px",
                  borderBottom: i < standings.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  background: pal.dim,
                  position: "relative",
                }}>
                  {/* Progress bar */}
                  <div style={{ position: "absolute", bottom: 0, left: 14, right: 14, height: 1, background: "rgba(255,255,255,0.04)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${barW}%`, height: "100%", background: pal.dot, opacity: 0.5, borderRadius: 99 }} />
                  </div>

                  {/* Main grid row */}
                  <div style={{ display: "grid", gridTemplateColumns: COL, alignItems: "center" }}>

                    {/* Rank */}
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1, textAlign: "center",
                      color: pal.dot, textShadow: `0 0 18px ${pal.glow}`,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    {/* Player: image + name */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                      <div style={{
                        width: 60, height: 70, borderRadius: 10, overflow: "hidden",
                        border: `2px solid ${pal.dot}`,
                        boxShadow: `0 0 14px ${pal.glow}`,
                        background: `${pal.dot}18`,
                      }}>
                        <img
                          src={imageSrcFor(s.player)} alt={s.player}
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: "0.04em", color: "#fff" }}>
                        {s.player}
                      </span>
                    </div>

                    {/* M · W · L */}
                    <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                      {[
                        { v: s.M, label: "M", color: "rgba(255,255,255,0.75)" },
                        { v: s.W, label: "W", color: "#34d399" },
                        { v: s.L, label: "L", color: "#f87171" },
                      ].map(({ v, label, color }) => (
                        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, lineHeight: 1, color }}>{v}</span>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* FPTS */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, lineHeight: 1,
                        color: pal.dot, textShadow: `0 0 14px ${pal.glow}`,
                      }}>
                        {Math.round(s.totalPts)}
                      </span>
                      <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.dot, opacity: 0.7 }}>
                        FPTS
                      </span>
                    </div>
                  </div>

                  {/* Last 10 — full width below */}
                  <Last10 results={s.results} />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: 14, padding: "0 4px", display: "flex", gap: 16, flexWrap: "wrap" }}>
            {[
              { color: "#34d399", label: "W — Win" },
              { color: "#f87171", label: "L — Loss" },
            ].map(({ color, label }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                {label}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}