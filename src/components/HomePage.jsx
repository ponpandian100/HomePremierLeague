import { useEffect, useState } from "react";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes goldPulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.25); }
    50%       { box-shadow: 0 0 0 8px rgba(255,215,0,0); }
  }

  .card-slide { animation: slideUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
  .shimmer-text {
    background: linear-gradient(90deg, #ffd700 0%, #fff8dc 40%, #ffd700 60%, #b8860b 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  .gold-ring { animation: goldPulse 2.5s ease-in-out infinite; }
`;

const colorMap = {
  red:    { accent: "#f87171", glow: "rgba(248,113,113,0.2)", border: "rgba(248,113,113,0.25)" },
  blue:   { accent: "#60a5fa", glow: "rgba(96,165,250,0.2)",  border: "rgba(96,165,250,0.25)" },
  green:  { accent: "#34d399", glow: "rgba(52,211,153,0.2)",  border: "rgba(52,211,153,0.25)" },
  orange: { accent: "#fb923c", glow: "rgba(251,146,60,0.2)",  border: "rgba(251,146,60,0.25)" },
  purple: { accent: "#a78bfa", glow: "rgba(167,139,250,0.2)", border: "rgba(167,139,250,0.25)" },
};

const rankMeta = [
  { ring: "#FFD700", label: "1st", size: 68 },
  { ring: "#C0C0C0", label: "2nd", size: 58 },
  { ring: "#CD7F32", label: "3rd", size: 58 },
];

// Fallback avatar using initials
function Avatar({ src, name, size, color }) {
  const [err, setErr] = useState(false);
  const c = colorMap[color] || colorMap.red;
  const initials = (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (!src || err) {
    return (
      <div style={{
        width: size, height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${c.accent}33, ${c.accent}66)`,
        border: `1.5px solid ${c.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: size * 0.38,
        color: c.accent,
        flexShrink: 0,
        letterSpacing: 1,
      }}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  );
}

export default function HomePage({ players = [], matchHistory = [] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Compute totals & wins
  const totals = {}, wins = {};
  players.forEach(p => { totals[p.player] = 0; wins[p.player] = 0; });
  matchHistory.forEach(m => {
    m.players?.forEach(mp => {
      totals[mp.player] = (totals[mp.player] || 0) + parseFloat(mp.points || 0);
    });
    const top = [...(m.players || [])].sort((a, b) => parseFloat(b.points) - parseFloat(a.points))[0];
    if (top) wins[top.player] = (wins[top.player] || 0) + 1;
  });

  const sorted = [...players]
    .map(p => ({ ...p, total: totals[p.player] || 0, winCount: wins[p.player] || 0 }))
    .sort((a, b) => b.total - a.total);

  return (
    <>
      <style>{style}</style>
      <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 32px" }}>

          {/* Header */}
          <div style={{
            padding: "48px 0 28px",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(-12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            {/* Top label */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16,
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.25)",
              }}>Season 2026</span>
              <span style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 99, padding: "3px 12px",
                fontSize: 11, color: "rgba(239,68,68,0.8)", fontWeight: 600,
              }}>
                {matchHistory.length} Matches
              </span>
            </div>

            {/* Title */}
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 44,
              lineHeight: 0.9,
              letterSpacing: 1,
            }}>
              <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 38 }}>Home Premier</div>
              <div style={{
                background: "linear-gradient(90deg, #ef4444, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: 52,
              }}>League</div>
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 8, letterSpacing: 0.3 }}>
              Stars of the season · Rankings
            </div>
          </div>

          {/* Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sorted.map((p, i) => {
              const rank = rankMeta[i];
              const isTop3 = i < 3;
              const c = colorMap[p.color] || colorMap.red;
              const delay = 0.08 + i * 0.07;

              return (
                <div
                  key={p.player}
                  className="card-slide"
                  style={{
                    animationDelay: `${delay}s`,
                    position: "relative",
                    borderRadius: 20,
                    padding: "16px 18px",
                    overflow: "hidden",
                    background: isTop3
                      ? `linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)`
                      : "rgba(255,255,255,0.025)",
                    border: isTop3
                      ? `1px solid ${rank?.ring}30`
                      : "1px solid rgba(255,255,255,0.06)",
                    boxShadow: isTop3
                      ? `0 4px 32px ${i === 0 ? "rgba(255,215,0,0.08)" : "rgba(0,0,0,0.3)"}`
                      : "none",
                  }}
                >
                  {/* Glow strip right */}
                  <div style={{
                    position: "absolute", top: 0, right: 0, bottom: 0, width: "40%",
                    background: `linear-gradient(270deg, ${c.glow} 0%, transparent 100%)`,
                    pointerEvents: "none",
                    borderRadius: "0 20px 20px 0",
                  }} />

                  {/* Rank number watermark */}
                  <div style={{
                    position: "absolute", right: 16, top: "50%",
                    transform: "translateY(-50%)",
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 72,
                    color: isTop3 ? `${rank.ring}0d` : "rgba(255,255,255,0.03)",
                    lineHeight: 1,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}>
                    {i + 1}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative" }}>

                    {/* Rank badge */}
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: isTop3 ? 28 : 22,
                      color: rank ? rank.ring : "rgba(255,255,255,0.2)",
                      minWidth: 30,
                      textAlign: "center",
                      flexShrink: 0,
                      lineHeight: 1,
                      ...(i === 0 ? {} : {}),
                    }}
                      className={i === 0 ? "shimmer-text" : ""}
                    >
                      {i + 1}
                    </div>

                    {/* Avatar wrapper */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      {i === 0 && (
                        <span style={{
                          position: "absolute", top: -16, left: "50%",
                          transform: "translateX(-50%)", fontSize: 16, zIndex: 2,
                        }}>👑</span>
                      )}
                      <div
                        className={i === 0 ? "gold-ring" : ""}
                        style={{
                          borderRadius: "50%",
                          padding: isTop3 ? 2.5 : 0,
                          background: isTop3
                            ? `conic-gradient(${rank.ring} 0deg, ${rank.ring}40 180deg, ${rank.ring} 360deg)`
                            : "transparent",
                        }}
                      >
                        <Avatar src={p.image} name={p.name} size={rank ? rank.size : 52} color={p.color} />
                      </div>
                    </div>

                    {/* Name + stats */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 700,
                        fontSize: isTop3 ? 16 : 14,
                        color: isTop3 ? "#fff" : "rgba(255,255,255,0.75)",
                        marginBottom: 3,
                        letterSpacing: 0.2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}>
                        {p.name}
                      </div>
                      {matchHistory.length > 0 && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{
                            fontSize: 11, color: c.accent, fontWeight: 600,
                            background: `${c.glow}`,
                            padding: "1px 8px", borderRadius: 99,
                            border: `1px solid ${c.border}`,
                          }}>
                            {p.winCount}W
                          </span>
                          {p.about && (
                            <span style={{
                              fontSize: 11, color: "rgba(255,255,255,0.3)",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                              maxWidth: 120,
                            }}>
                              {p.about}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Points */}
                    {matchHistory.length > 0 && (
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: isTop3 ? 28 : 22,
                          lineHeight: 1,
                          color: isTop3 ? rank.ring : c.accent,
                          ...(i === 0 ? {} : {}),
                        }}
                          className={i === 0 ? "shimmer-text" : ""}
                        >
                          {Math.round(p.total).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 500, marginTop: 1 }}>
                          PTS
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {sorted.length === 0 && (
              <div style={{ textAlign: "center", color: "rgba(255,255,255,0.2)", padding: "48px 0", fontSize: 14 }}>
                No players yet
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center", marginTop: 40,
            fontSize: 10, color: "rgba(255,255,255,0.12)",
            letterSpacing: "0.2em", fontWeight: 600,
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease 0.8s",
          }}>
            HPL · 2026
          </div>
        </div>
      </div>
    </>
  );
}