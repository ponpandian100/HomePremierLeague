import { useEffect, useState, useMemo } from "react";

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes shimmer  { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes pulseRing{ 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
  @keyframes crownGlow { 0%,100%{filter:drop-shadow(0 0 6px #FFD700aa)} 50%{filter:drop-shadow(0 0 16px #FFD700ff)} }
  @keyframes crownSpin { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }

  .hp-fadeup  { animation: fadeUp  0.55s cubic-bezier(0.16,1,0.3,1) both; }
  .hp-fadein  { animation: fadeIn  0.6s ease both; }

  .gold-shimmer {
    background: linear-gradient(90deg,#ffd700,#fffacd,#ffd700,#b8860b,#ffd700);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  .silver-shimmer {
    background: linear-gradient(90deg,#c0c0c0,#fff,#c0c0c0,#a8a8a8,#c0c0c0);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
  .bronze-shimmer {
    background: linear-gradient(90deg,#cd7f32,#f4a460,#cd7f32,#8b4513,#cd7f32);
    background-size: 300% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
.shine-title {
  background: linear-gradient(
    90deg,
    #b91c1c,
    #ef4444,
    #fca5a5,
    #ef4444,
    #b91c1c
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 4s linear infinite;
}
  .pulse-ring { animation: pulseRing 2.5s ease-in-out infinite; }
  .float-anim { animation: floatUp 3s ease-in-out infinite; }
  .crown-glow  { animation: crownGlow 2.5s ease-in-out infinite; }
`;

const PALETTE = {
  Pon:    { dot: "#ef4444", glow: "rgba(239,68,68,0.5)",   bg: "rgba(239,68,68,0.12)",   border: "rgba(239,68,68,0.35)" },
  Naveen: { dot: "#60a5fa", glow: "rgba(96,165,250,0.5)",  bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.35)" },
  Varun:  { dot: "#fbbf24", glow: "rgba(251,191,36,0.5)",  bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.35)" },
  Pal:    { dot: "#ec4899", glow: "rgba(236,72,153,0.5)",  bg: "rgba(236,72,153,0.12)",  border: "rgba(236,72,153,0.35)" },
};

const FILENAME = { Pon:"Pon.png", Naveen:"Naveen.png", Pal:"Pal.png", Varun:"Varun.png" };

const RANK_META = [
  { shimmer:"gold-shimmer",   ring:"#FFD700", podiumH:110, crown:true,  label:"1ST" },
  { shimmer:"silver-shimmer", ring:"#C0C0C0", podiumH:82,  crown:false, label:"2ND" },
  { shimmer:"bronze-shimmer", ring:"#CD7F32", podiumH:62,  crown:false, label:"3RD" },
];

function imgSrc(name) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${FILENAME[name] || name + ".png"}`;
}

/* ── Ornate Crown SVG — larger, more detailed ── */
function OrnamentCrown({ size = 48 }) {
  return (
    <svg
      width={size}
      height={size * 0.82}
      viewBox="0 0 80 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="crown-glow"
    >
      {/* Base band */}
      <rect x="5" y="42" width="70" height="13" rx="4" fill="#7A5500" />
      <rect x="5" y="42" width="70" height="13" rx="4" fill="url(#cg1)" />

      {/* Main crown body */}
      <path
        d="M5 46 L5 22 L20 35 L40 3 L60 35 L75 22 L75 46 Z"
        fill="url(#cg2)"
        stroke="#FFD700"
        strokeWidth="0.7"
        strokeLinejoin="round"
      />

      {/* Inner highlight */}
      <path
        d="M11 46 L11 27 L23 38 L40 9 L57 38 L69 27 L69 46 Z"
        fill="url(#cg3)"
        opacity="0.25"
      />

      {/* Left slope gleam */}
      <path d="M10 44 L22 30 L27 37" stroke="#FFF8DC" strokeWidth="1" strokeLinecap="round" opacity="0.4" fill="none" />
      {/* Right slope gleam */}
      <path d="M70 44 L58 30 L53 37" stroke="#FFF8DC" strokeWidth="1" strokeLinecap="round" opacity="0.3" fill="none" />

      {/* Jewel — top centre peak */}
      <circle cx="40" cy="4.5" r="5" fill="url(#jRed)" stroke="#FFD700" strokeWidth="0.8" />
      <circle cx="38.5" cy="3" r="1.8" fill="#fff" opacity="0.55" />

      {/* Jewel — left peak */}
      <circle cx="7" cy="23" r="4.2" fill="url(#jBlue)" stroke="#FFD700" strokeWidth="0.7" />
      <circle cx="5.8" cy="21.5" r="1.4" fill="#fff" opacity="0.5" />

      {/* Jewel — right peak */}
      <circle cx="73" cy="23" r="4.2" fill="url(#jGreen)" stroke="#FFD700" strokeWidth="0.7" />
      <circle cx="71.8" cy="21.5" r="1.4" fill="#fff" opacity="0.5" />

      {/* Band jewels */}
      <circle cx="40" cy="48.5" r="4.5" fill="url(#jRed)" stroke="#FFD700" strokeWidth="0.8" />
      <circle cx="38.5" cy="47" r="1.5" fill="#fff" opacity="0.45" />
      <circle cx="24" cy="48.5" r="3.2" fill="url(#jBlue)" stroke="#FFD700" strokeWidth="0.6" />
      <circle cx="56" cy="48.5" r="3.2" fill="url(#jGreen)" stroke="#FFD700" strokeWidth="0.6" />
      <circle cx="14" cy="48.5" r="2" fill="url(#jRed)" stroke="#FFD700" strokeWidth="0.5" opacity="0.8" />
      <circle cx="66" cy="48.5" r="2" fill="url(#jRed)" stroke="#FFD700" strokeWidth="0.5" opacity="0.8" />

      {/* Band trim lines */}
      <line x1="5" y1="42" x2="75" y2="42" stroke="#FFD700" strokeWidth="0.8" opacity="0.9" />
      <line x1="5" y1="55" x2="75" y2="55" stroke="#FFD700" strokeWidth="0.6" opacity="0.5" />

      {/* Decorative dots on band */}
      <circle cx="34" cy="48.5" r="1" fill="#FFD700" opacity="0.6" />
      <circle cx="46" cy="48.5" r="1" fill="#FFD700" opacity="0.6" />

      <defs>
        <linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8B6914" stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="cg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE966" />
          <stop offset="40%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#A07010" />
        </linearGradient>
        <linearGradient id="cg3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
        <radialGradient id="jRed" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#FF9090" />
          <stop offset="100%" stopColor="#BB0000" />
        </radialGradient>
        <radialGradient id="jBlue" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#99CCFF" />
          <stop offset="100%" stopColor="#1133CC" />
        </radialGradient>
        <radialGradient id="jGreen" cx="35%" cy="30%">
          <stop offset="0%" stopColor="#99FFCC" />
          <stop offset="100%" stopColor="#119955" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/* Podium player card */
function PodiumCard({ player, rank, idx, delay }) {
  const meta = RANK_META[rank - 1];
  const pal = PALETTE[player.name] || { dot: "#9ca3af", glow: "rgba(156,163,175,0.3)", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.2)" };
  const [imgErr, setImgErr] = useState(false);
  const isFirst = rank === 1;
  const avatarSize = isFirst ? 100 : 82;

  return (
    <div
      className="hp-fadeup"
      style={{
        animationDelay: `${delay}s`,
        display: "flex", flexDirection: "column", alignItems: "center",
        flex: isFirst ? "0 0 38%" : "0 0 28%",
        position: "relative",
        zIndex: isFirst ? 2 : 1,
      }}
    >
      {/* Crown sits right above the avatar, touching it */}
      {meta.crown && (
        <div
          className="float-anim"
          style={{
            marginBottom: -14,
            zIndex: 10,
            position: "relative",
          }}
        >
          <OrnamentCrown size={isFirst ? 52 : 40} />
        </div>
      )}
      {!meta.crown && <div style={{ height: 20 }} />}

      {/* Avatar ring — NO fade overlay */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <div
          className={isFirst ? "pulse-ring" : ""}
          style={{
            width: avatarSize + 12, height: avatarSize + 12,
            borderRadius: "50%",
            background: `conic-gradient(${meta.ring}, ${meta.ring}55, ${meta.ring}, ${meta.ring}33, ${meta.ring})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 0 ${isFirst ? 32 : 18}px ${meta.ring}66`,
          }}
        >
          <div style={{
            width: avatarSize + 5, height: avatarSize + 5, borderRadius: "50%",
            background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {!imgErr ? (
              <img
                src={imgSrc(player.name)} alt={player.name}
                onError={() => setImgErr(true)}
                style={{
                  width: avatarSize, height: avatarSize, borderRadius: "50%",
                  objectFit: "cover", display: "block",
                  /* No fade, no gradient overlay */
                }}
              />
            ) : (
              <div style={{
                width: avatarSize, height: avatarSize, borderRadius: "50%",
                background: pal.bg, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Bebas Neue',sans-serif", fontSize: avatarSize * 0.4, color: pal.dot,
              }}>{player.name[0]}</div>
            )}
          </div>
        </div>

        {/* Rank badge */}
        <div style={{
          position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
          background: meta.ring, borderRadius: 99,
          padding: "2px 11px",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, letterSpacing: "0.14em",
          color: "#000", fontWeight: 900,
          boxShadow: `0 2px 10px ${meta.ring}99`,
        }}>
          {meta.label}
        </div>
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: isFirst ? 21 : 17,
        letterSpacing: "0.08em",
        color: "#fff",
        marginBottom: 2, textAlign: "center",
        textShadow: `0 0 20px ${pal.glow}`,
      }}>
        {player.name}
      </div>

      {/* Points */}
      <div
        className={meta.shimmer}
        style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: isFirst ? 30 : 23,
          letterSpacing: "0.04em",
          lineHeight: 1,
          marginBottom: 6,
        }}
      >
        {Math.round(player.total).toLocaleString()}
      </div>

      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: "0.14em", fontWeight: 600, marginBottom: 10 }}>
        PTS · {player.winCount}W
      </div>

      {/* Podium block */}
      <div style={{
        width: "100%", height: meta.podiumH,
        background: `linear-gradient(180deg, ${meta.ring}22 0%, ${meta.ring}08 100%)`,
        border: `1px solid ${meta.ring}33`,
        borderBottom: "none",
        borderRadius: "10px 10px 0 0",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${meta.ring}88, transparent)` }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${meta.ring}18 0%, transparent 70%)`,
        }} />
      </div>
    </div>
  );
}

/* Rank row for 4th and 5th */
function RankRow({ player, rank, delay }) {
  const pal = PALETTE[player.name] || { dot: "#9ca3af", glow: "rgba(156,163,175,0.2)", bg: "rgba(156,163,175,0.06)", border: "rgba(156,163,175,0.15)" };
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="hp-fadeup"
      style={{
        animationDelay: `${delay}s`,
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.025)",
        border: `1px solid rgba(255,255,255,0.07)`,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "50%",
        background: `linear-gradient(270deg, ${pal.glow} 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      <div style={{
        fontFamily: "'Bebas Neue',sans-serif", fontSize: 22,
        color: "rgba(255,255,255,0.18)", minWidth: 28, textAlign: "center", flexShrink: 0,
      }}>
        {rank}
      </div>

      <div style={{
        width: 46, height: 46, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        border: `1.5px solid ${pal.border}`,
        boxShadow: `0 0 10px ${pal.glow}`,
        background: pal.bg,
      }}>
        {!imgErr ? (
          <img src={imgSrc(player.name)} alt={player.name} onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: pal.dot }}>{player.name[0]}</div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.85)", marginBottom: 3 }}>
          {player.name}
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: pal.bg, border: `1px solid ${pal.border}`,
          borderRadius: 99, padding: "2px 9px",
          fontSize: 11, fontWeight: 600, color: pal.dot,
        }}>
          {player.winCount}W
        </div>
      </div>

      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, lineHeight: 1, color: pal.dot }}>
          {Math.round(player.total).toLocaleString()}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.1em" }}>PTS</div>
      </div>
    </div>
  );
}

/* ── Top 5 Highest Single-Match Scores ── */
function HighScoreRow({ entry, rank, delay }) {
  const pal = PALETTE[entry.player] || { dot: "#9ca3af", glow: "rgba(156,163,175,0.2)", bg: "rgba(156,163,175,0.06)", border: "rgba(156,163,175,0.15)" };
  const [imgErr, setImgErr] = useState(false);

  return (
    <div
      className="hp-fadeup"
      style={{
        animationDelay: `${delay}s`,
        display: "flex", alignItems: "center", gap: 12,
        padding: "13px 16px",
        borderRadius: 14,
        background: `linear-gradient(90deg, ${pal.bg}, rgba(255,255,255,0.012))`,
        border: `1px solid ${pal.border}`,
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Left accent bar in player color */}
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 3,
        background: pal.dot,
        borderRadius: "14px 0 0 14px",
        boxShadow: `0 0 8px ${pal.glow}`,
      }} />

      {/* Right glow in player color */}
      <div style={{
        position: "absolute", top: 0, right: 0, bottom: 0, width: "45%",
        background: `linear-gradient(270deg, ${pal.glow} 0%, transparent 100%)`,
        pointerEvents: "none",
      }} />

      {/* Rank number in player color */}
      <div style={{
        fontFamily: "'Bebas Neue',sans-serif",
        fontSize: 20,
        color: pal.dot,
        minWidth: 24,
        textAlign: "center",
        flexShrink: 0,
        textShadow: `0 0 12px ${pal.glow}`,
      }}>
        {rank}
      </div>

      {/* Avatar — with player color ring, NO fade */}
      <div style={{
        width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
        border: `2px solid ${pal.dot}`,
        boxShadow: `0 0 12px ${pal.glow}`,
        background: pal.bg,
      }}>
        {!imgErr ? (
          <img
            src={imgSrc(entry.player)} alt={entry.player}
            onError={() => setImgErr(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: pal.dot }}>{entry.player[0]}</div>
        )}
      </div>

      {/* Player + match info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.9)", marginBottom: 3 }}>
          {entry.player}
        </div>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: pal.bg, border: `1px solid ${pal.border}`,
          borderRadius: 99, padding: "2px 8px",
          fontSize: 10, fontWeight: 600, color: pal.dot, letterSpacing: "0.08em",
        }}>
          MATCH {entry.matchNum}{entry.matchOn ? ` · ${entry.matchOn}` : ""}
        </div>
      </div>

      {/* Score in player color */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{
          fontFamily: "'Bebas Neue',sans-serif",
          fontSize: 28, lineHeight: 1,
          color: pal.dot,
          textShadow: `0 0 16px ${pal.glow}`,
        }}>
          {Number.isInteger(entry.points) ? entry.points : entry.points.toFixed(1)}
        </div>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontWeight: 700, letterSpacing: "0.12em" }}>PTS</div>
      </div>
    </div>
  );
}

export default function HomePage({ players = [], matchHistory = [] }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 60); return () => clearTimeout(t); }, []);

  /* Season standings */
  const sorted = useMemo(() => {
    const totals = {}, wins = {};
    matchHistory.forEach(m => {
      m.players?.forEach(mp => {
        totals[mp.player] = (totals[mp.player] || 0) + parseFloat(mp.points || 0);
      });
      const pts = (m.players || []).map(mp => parseFloat(mp.points || 0));
      const max = Math.max(...pts);
      m.players?.forEach(mp => {
        if (parseFloat(mp.points || 0) === max) wins[mp.player] = (wins[mp.player] || 0) + 1;
      });
    });

    const names = players.length
      ? players.map(p => p.player || p.name)
      : [...new Set(matchHistory.flatMap(m => m.players?.map(mp => mp.player) || []))];

    return names
      .map(name => ({ name, total: totals[name] || 0, winCount: wins[name] || 0 }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [players, matchHistory]);

  /* Top 5 highest individual match scores */
  const topScores = useMemo(() => {
    const allScores = [];
    matchHistory.forEach((m, idx) => {
      const matchNum = idx + 1;
      (m.players || []).forEach(mp => {
        const pts = parseFloat(mp.points || 0);
        if (pts > 0) {
          allScores.push({
            player: mp.player,
            points: pts,
            matchNum,
            matchOn: m.matchOn || null,
          });
        }
      });
    });
    return allScores
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);
  }, [matchHistory]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 5);

  const podiumOrder = top3.length === 3
    ? [top3[1], top3[0], top3[2]]
    : top3.length === 2
    ? [top3[1], top3[0]]
    : top3;
  const podiumRanks = top3.length === 3 ? [2, 1, 3] : top3.length === 2 ? [2, 1] : [1];

  return (
    <>
      <style>{STYLE}</style>
      <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px" }}>

          {/* Header */}
          <div style={{
            padding: "48px 0 32px",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(-12px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.2)", marginBottom: 8, textTransform: "uppercase" }}>
                  HPL · Season 2026
                </div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", lineHeight: 0.88 }}>
                  <div style={{ fontSize: 38, color: "rgba(255,255,255,0.9)", letterSpacing: "0.02em" }}>Home Premier</div>
                  <div className="shine-title" style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 54, letterSpacing: "0.02em" }}>League</div>
                </div>
              </div>
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 12, padding: "8px 14px", textAlign: "center", marginTop: 8,
              }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, lineHeight: 1, color: "#ef4444" }}>{matchHistory.length}</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", fontWeight: 700, letterSpacing: "0.12em" }}>MATCHES</div>
              </div>
            </div>
          </div>

          {/* Section label */}
          <div className="hp-fadein" style={{ animationDelay: "0.15s", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)", marginBottom: 20, textTransform: "uppercase" }}>
            Top Players · Season Standings
          </div>

          {/* Podium */}
          {top3.length > 0 && (
            <div
              className="hp-fadein"
              style={{
                animationDelay: "0.2s",
                display: "flex", alignItems: "flex-end", justifyContent: "center",
                gap: 0, marginBottom: 0,
                background: "linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 100%)",
                borderRadius: "20px 20px 0 0",
                border: "1px solid rgba(255,255,255,0.05)",
                borderBottom: "none",
                padding: "28px 12px 0",
                position: "relative", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.02) 40px)", pointerEvents: "none" }} />
              {podiumOrder.map((player, i) => (
                <PodiumCard key={player.name} player={player} rank={podiumRanks[i]} idx={i} delay={0.25 + i * 0.08} />
              ))}
            </div>
          )}

          {/* Ground line */}
          {top3.length > 0 && (
            <div style={{ height: 3, background: "linear-gradient(90deg,transparent,rgba(255,215,0,0.3),rgba(255,255,255,0.15),rgba(205,127,50,0.3),transparent)", marginBottom: 28 }} />
          )}

          {/* 4th & 5th */}
          {rest.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {rest.map((p, i) => (
                <RankRow key={p.name} player={p} rank={i + 4} delay={0.5 + i * 0.08} />
              ))}
            </div>
          )}

          {sorted.length === 0 && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.18)", padding: "60px 0", fontSize: 14 }}>
              No matches played yet
            </div>
          )}


          <div style={{ textAlign: "center", marginTop: 44, fontSize: 10, color: "rgba(255,255,255,0.1)", letterSpacing: "0.2em", fontWeight: 600 }}>
            HPL · 2026
          </div>
        </div>
      </div>
    </>
  );
}