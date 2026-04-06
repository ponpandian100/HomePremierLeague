import { useEffect, useState } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes barGrow {
    from { width: 0; }
    to   { width: var(--bar-w); }
  }
  @keyframes fadeSlide {
    from { opacity: 0; transform: translateX(-12px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .bar-fill { animation: barGrow 0.8s cubic-bezier(0.16,1,0.3,1) both; }
  .fade-slide { animation: fadeSlide 0.4s cubic-bezier(0.16,1,0.3,1) both; }
`;

const colorMap = {
  red:    "#f87171",
  blue:   "#60a5fa",
  green:  "#34d399",
  orange: "#fb923c",
  purple: "#a78bfa",
};

export default function Hot({ matchHistory = [], players = [] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (!players.length) {
    return (
      <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>No data available</span>
      </div>
    );
  }

  // Build per-match per-player points table
  const playerIds = players.map(p => p.player);

  // Totals
  const totals = {};
  playerIds.forEach(id => { totals[id] = 0; });
  matchHistory.forEach(m => {
    m.players?.forEach(mp => {
      totals[mp.player] = (totals[mp.player] || 0) + parseFloat(mp.points || 0);
    });
  });

  const maxTotal = Math.max(...playerIds.map(id => totals[id]), 1);

  const sortedPlayers = [...players].sort((a, b) => totals[b.player] - totals[a.player]);

  return (
    <>
      <style>{style}</style>
      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 32px" }}>

          {/* Header */}
          <div style={{
            padding: "48px 0 28px",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(-8px)",
            transition: "opacity 0.45s ease, transform 0.45s ease",
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>
              Season 2026
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, lineHeight: 0.95, letterSpacing: 1 }}>
              <div style={{ color: "rgba(255,255,255,0.9)" }}>Points</div>
              <div style={{ background: "linear-gradient(90deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontSize: 52 }}>Breakdown</div>
            </div>
          </div>

          {/* Totals bar chart */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16, fontWeight: 700 }}>
              Total Points
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {sortedPlayers.map((p, i) => {
                const color = colorMap[p.color] || colorMap.red;
                const pct = (totals[p.player] / maxTotal) * 100;
                return (
                  <div key={p.player} className="fade-slide" style={{ animationDelay: `${0.1 + i * 0.06}s` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>{p.name}</span>
                      <span style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                        fontSize: 18, color, lineHeight: 1,
                      }}>
                        {Math.round(totals[p.player]).toLocaleString()}
                      </span>
                    </div>
                    <div style={{
                      height: 7, borderRadius: 99,
                      background: "rgba(255,255,255,0.06)",
                      overflow: "hidden",
                    }}>
                      <div
                        className="bar-fill"
                        style={{
                          "--bar-w": `${pct}%`,
                          height: "100%",
                          borderRadius: 99,
                          background: `linear-gradient(90deg, ${color}99, ${color})`,
                          animationDelay: `${0.2 + i * 0.08}s`,
                          boxShadow: `0 0 8px ${color}55`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Per-match table */}
          {matchHistory.length > 0 && (
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 20,
              overflow: "hidden",
            }}>
              <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>
                  Match Log
                </div>
              </div>

              {/* Header row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `80px repeat(${sortedPlayers.length}, 1fr)`,
                padding: "10px 16px",
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: 1 }}>MATCH</div>
                {sortedPlayers.map(p => (
                  <div key={p.player} style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                    color: colorMap[p.color] || colorMap.red,
                    textAlign: "center",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {p.name.split(" ")[0].toUpperCase()}
                  </div>
                ))}
              </div>

              {/* Data rows */}
              {matchHistory.map((m, idx) => {
                // Build pts map for this match
                const pts = {};
                m.players?.forEach(mp => { pts[mp.player] = parseFloat(mp.points || 0); });
                const maxPts = Math.max(...Object.values(pts), 1);

                return (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: `80px repeat(${sortedPlayers.length}, 1fr)`,
                      padding: "10px 16px",
                      borderBottom: idx < matchHistory.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>
                      {m.date || `M${idx + 1}`}
                    </div>
                    {sortedPlayers.map(p => {
                      const val = pts[p.player] ?? 0;
                      const isTop = val === maxPts && val > 0;
                      const color = colorMap[p.color] || colorMap.red;
                      return (
                        <div key={p.player} style={{ textAlign: "center" }}>
                          <span style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: 16,
                            color: isTop ? color : "rgba(255,255,255,0.4)",
                            fontWeight: isTop ? 700 : 400,
                          }}>
                            {Math.round(val)}
                          </span>
                          {isTop && (
                            <span style={{ fontSize: 8, marginLeft: 2, verticalAlign: "super" }}>★</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Totals row */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `80px repeat(${sortedPlayers.length}, 1fr)`,
                padding: "12px 16px",
                background: "rgba(255,255,255,0.03)",
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>TOTAL</div>
                {sortedPlayers.map(p => {
                  const color = colorMap[p.color] || colorMap.red;
                  return (
                    <div key={p.player} style={{
                      textAlign: "center",
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 18,
                      color,
                    }}>
                      {Math.round(totals[p.player]).toLocaleString()}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}