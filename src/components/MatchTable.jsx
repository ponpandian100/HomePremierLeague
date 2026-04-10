import { useEffect, useState, useMemo } from "react";

const ANIM = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
  @keyframes fadeUp { from { opacity:0; transform:translateY(18px);} to {opacity:1; transform:translateY(0);} }
  .mc-card { animation: fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) both; }
.shine-text {
  background: linear-gradient(
    90deg,
    #2563eb,
    #3b82f6,
    #93c5fd,
    #3b82f6,
    #2563eb
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}
  @keyframes shimmer { 0% { background-position: -200% center } 100% { background-position: 200% center } }
`;

/* fixed palette per player */
const PALETTE_BY_NAME = {
  Pon: { dot: "#ef4444", glow: "rgba(239,68,68,0.28)", dim: "rgba(239,68,68,0.06)" },
  Naveen: { dot: "#60a5fa", glow: "rgba(96,165,250,0.28)", dim: "rgba(96,165,250,0.06)" },
  Varun: { dot: "#fbbf24", glow: "rgba(251,191,36,0.28)", dim: "rgba(251,191,36,0.06)" },
  Pal: { dot: "#ec4899", glow: "rgba(236,72,153,0.28)", dim: "rgba(236,72,153,0.06)" },
};

/* filename mapping — players */
const FILENAME_BY_NAME = {
  Pon: "Pon.png",
  Naveen: "Naveen.png",
  Pal: "Pal.png",
  Varun: "Varun.png",
};

/* IPL team logo mapping */
const TEAM_LOGOS = {
  CSK: "CSK.jpg",
  MI: "MI.png",
  RCB: "RCB.jpg",
  PBKS: "PBKS.png",
  DC: "DC.jpg",
  KKR: "KKR.jpg",
  GT: "GT.png",
  LSG: "LSG.jpeg",
  RR: "RR.jpg",
  SRH: "SRH.jpg",
};

function getPrize(players = []) {
  return players.reduce((s, p) => s + parseFloat(p.paid || 0), 0);
}

function imageSrcFor(name) {
  const filename = FILENAME_BY_NAME[name] || `${name}.png`;
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${filename}`;
}

function teamLogoSrc(teamName) {
  const filename = TEAM_LOGOS[teamName?.toUpperCase()] || `${teamName}.png`;
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${filename}`;
}

/* Team badge: logo on top, name below */
function TeamBadge({ name }) {
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      {!imgFailed ? (
        <img
          src={teamLogoSrc(name)}
          alt={name}
          onError={() => setImgFailed(true)}
          style={{ width: 36, height: 36, display: "block", borderRadius: "50%" }}
        />
      ) : (
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.04em"
        }}>
          {name?.slice(0, 3).toUpperCase()}
        </div>
      )}
      <span style={{
        fontSize: 11, fontWeight: 800, letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.7)",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "3px 10px", borderRadius: 99
      }}>
        {name}
      </span>
    </div>
  );
}

/* Header winner image(s) — big, no circle, supports 1..4 images */
function WinnerHeader({ winners = [], width = 140, height = 92 }) {
  const count = Math.min(4, winners?.length || 0);

  if (!count) {
    return (
      <div style={{
        width, height, background: "rgba(255,255,255,0.03)", display: "flex",
        alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.18)",
        borderRadius: 8, border: "1px solid rgba(255,255,255,0.04)"
      }}>
        —
      </div>
    );
  }

  if (count === 1) {
    const name = winners[0].player;
    return (
      <div style={{
        width: "92px", height: "92px", overflow: "hidden", borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 28px rgba(0,0,0,0.5)"
      }}>
        <img
          src={imageSrcFor(name)} alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      </div>
    );
  }

  const gap = 8;
  const imgW = Math.floor((width - gap * (count - 1)) / count);

  return (
    <div style={{
      width, height, display: "flex", gap, alignItems: "center",
      justifyContent: "center", borderRadius: 8, overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.02)"
    }}>
      {winners.slice(0, 4).map((w, i) => (
        <div key={w.player + i} style={{
          width: imgW, height, overflow: "hidden", flex: "0 0 auto",
          borderRadius: 6, background: "#111",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <img
            src={imageSrcFor(w.player)} alt={w.player}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        </div>
      ))}
    </div>
  );
}

export default function MatchTable({ matchHistory = [] }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  const reversed = useMemo(() => [...(matchHistory || [])].reverse(), [matchHistory]);

  return (
    <>
      <style>{ANIM}</style>
      <div className="min-h-screen" style={{ background: "#080810", color: "#fff" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

          {/* Page Header */}
          <div style={{
            padding: "52px 0 32px",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(-10px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>
              HPL · Season 2026
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", lineHeight: 0.9 }}>
                <span style={{ fontSize: 46, color: "rgba(255,255,255,0.88)" }}>Match&nbsp;</span>
                <span className="shine-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 54 }}>History</span>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>
                  {matchHistory.length} match{matchHistory.length !== 1 ? "es" : ""} played
                </div>
              </div>
              <div aria-hidden style={{ width: 44 }} />
            </div>
          </div>

          {matchHistory.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", padding: "64px 0", fontSize: 14 }}>
              No matches yet
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {reversed.map((match, idx) => {
              const matchNum = matchHistory.length - idx;
              const players = match.players || [];
              const sorted = [...players].sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
              const winners = (() => {
                if (!sorted.length) return [];
                const maxP = Math.max(...sorted.map(p => parseFloat(p.points || 0)));
                return sorted.filter(p => parseFloat(p.points || 0) === maxP);
              })();

              const teams = match.teams || [];
              const entryFee = parseFloat(match.entryFee || 0);

              /* ── Prize logic ── */
              const totalPrize = entryFee > 0
                ? entryFee * players.length        // e.g. ₹10 × 4 = ₹40
                : getPrize(players);               // fallback: sum of players.paid

              const share = winners.length ? totalPrize / winners.length : 0;

              const winnerPalette = PALETTE_BY_NAME[sorted[0]?.player] || {
                dot: "#7c3aed", glow: "rgba(124,58,237,0.2)", dim: "rgba(124,58,237,0.06)"
              };

              return (
                <div
                  key={match.match || idx}
                  className="mc-card"
                  style={{
                    animationDelay: `${0.04 + idx * 0.06}s`,
                    borderRadius: 24, overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 40px ${winnerPalette.dim}`,
                    background: "rgba(255,255,255,0.028)", backdropFilter: "blur(8px)",
                  }}
                >
                  {/* Top accent bar */}
                  <div style={{ height: 3, background: `linear-gradient(90deg, ${winnerPalette.dot}, transparent)` }} />

                  {/* Card Header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "14px 18px 10px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}>

                    {/* Left: Match number + date */}
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 2 }}>
                        Match
                      </div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 34, lineHeight: 1, color: winnerPalette.dot, textShadow: `0 0 18px ${winnerPalette.glow}` }}>
                        {String(matchNum).padStart(2, "0")}
                      </div>
                      {match.matchOn && (
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.22)", fontWeight: 600, marginTop: 3, letterSpacing: "0.06em" }}>
                          {match.matchOn}
                        </div>
                      )}
                    </div>

                    {/* Centre: Team logos + names + entry fee */}
                    <div style={{ textAlign: "center" }}>
                      {/* Team logos row */}
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, justifyContent: "center" }}>
                        {teams.map((t, ti) => (
                          <TeamBadge key={ti} name={t} />
                        ))}
                        {/* {teams.length === 2 && (
                          <span style={{
                            fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.25)",
                            alignSelf: "center", marginBottom: 20, letterSpacing: "0.06em"
                          }}>
                            VS
                          </span>
                        )} */}
                      </div>

                      {/* Entry fee */}
                      <div style={{ marginTop: 8, fontSize: 11, color: "rgba(255,255,255,0.28)" }}>
                        Entry:&nbsp;
                        <span style={{ color: entryFee > 0 ? "#fbbf24" : "#34d399", fontWeight: 800 }}>
                          {entryFee > 0 ? `₹${entryFee}` : "FREE"}
                        </span>
                        {entryFee > 0 && players.length > 0 && (
                          <span style={{ color: "rgba(255,255,255,0.2)", marginLeft: 4 }}>
                            · Prize&nbsp;
                            <span style={{ color: "#fbbf24", fontWeight: 800 }}>₹{totalPrize}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Winner image(s) */}
                    <div style={{ marginLeft: 12 }}>
                      <WinnerHeader winners={winners} width={140} height={92} />
                    </div>
                  </div>

                  {/* Player rows */}
                  <div style={{ padding: "6px 0 8px" }}>
                    {sorted.map((mp, pi) => {
                      const pal = PALETTE_BY_NAME[mp.player] || {
                        dot: "#9ca3af", glow: "rgba(156,163,175,0.18)", dim: "rgba(156,163,175,0.06)"
                      };
                      const pts = parseFloat(mp.points || 0);
                      const isWinner = winners.some(w => w.player === mp.player);
                      const maxPts = parseFloat(sorted[0]?.points || 1);
                      const barW = Math.round((pts / maxPts) * 100);

                      return (
                        <div key={mp.player} style={{
                          padding: "9px 18px",
                          background: isWinner ? pal.dim : "transparent",
                          position: "relative", transition: "background 0.2s"
                        }}>
                          {/* Progress bar */}
                          <div style={{
                            position: "absolute", bottom: 0, left: 18, right: 18,
                            height: 1, background: "rgba(255,255,255,0.04)",
                            borderRadius: 99, overflow: "hidden"
                          }}>
                            <div style={{ width: `${barW}%`, height: "100%", background: pal.dot, opacity: 0.35, borderRadius: 99 }} />
                          </div>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 12, minWidth: 20, textAlign: "center", color: "rgba(255,255,255,0.25)", fontWeight: 700 }}>
                                {pi + 1}
                              </span>

                              {/* Player avatar */}
                              <div style={{
                                width: 36, height: 36, borderRadius: "20px", overflow: "hidden", flexShrink: 0,
                                border: `2px solid ${isWinner ? pal.dot : "rgba(255,255,255,0.06)"}`,
                                boxShadow: isWinner ? `0 0 10px ${pal.glow}` : "none",
                                background: `${pal.dot}22`,
                                opacity: isWinner ? 1 : 0.32,
                                filter: isWinner ? "none" : "grayscale(60%) brightness(0.7)",
                                transition: "opacity 0.18s ease, filter 0.18s ease",
                                display: "flex", alignItems: "center", justifyContent: "center"
                              }}>
                                <img
                                  src={imageSrcFor(mp.player)} alt={mp.player}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                                />
                              </div>

                              <span style={{
                                fontSize: 14, fontWeight: isWinner ? 800 : 500,
                                color: isWinner ? "#fff" : "rgba(255,255,255,0.45)",
                                letterSpacing: "0.02em"
                              }}>
                                {mp.player}
                              </span>
                            </div>

                            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                              <div style={{
                                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, lineHeight: 1,
                                color: isWinner ? pal.dot : "rgba(255,255,255,0.32)",
                                textShadow: isWinner ? `0 0 12px ${pal.glow}` : "none"
                              }}>
                                {Number.isInteger(pts) ? pts : pts.toFixed(1)}
                              </div>

                              {isWinner && totalPrize > 0 && (
                                <div style={{
                                  fontSize: 12, fontWeight: 800, color: "#fbbf24",
                                  background: "rgba(251,191,36,0.09)",
                                  padding: "4px 8px", borderRadius: 99
                                }}>
                                  🏆 ₹{Number(share % 1 === 0 ? share : share.toFixed(1))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}