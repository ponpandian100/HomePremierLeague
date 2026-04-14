import { useMemo } from "react";
import { useState } from "react";

// Add these at the top of TeamWinsSection.jsx, outside the component

const TEAM_LOGOS = {
  CSK:"CSK.jpg", MI:"MI.png", RCB:"RCB.jpg", PBKS:"PBKS.png",
  DC:"DC.jpg", KKR:"KKR.jpg", GT:"GT.png", LSG:"LSG.jpeg", RR:"RR.jpg", SRH:"SRH.jpg",
};

const TEAM_C = {
  SRH:"#f97316", RCB:"#dc2626", KKR:"#7c3aed", MI:"#2563eb",
  CSK:"#eab308", RR:"#ec4899", GT:"#0891b2", PBKS:"#b91c1c", LSG:"#10b981", DC:"#3b82f6",
};

const PALETTE = {
  Pon:    { dot: "#ef4444", glow: "rgba(239,68,68,0.5)",  bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.35)" },
  Naveen: { dot: "#60a5fa", glow: "rgba(96,165,250,0.5)", bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.35)" },
  Varun:  { dot: "#fbbf24", glow: "rgba(251,191,36,0.5)", bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.35)" },
  Pal:    { dot: "#ec4899", glow: "rgba(236,72,153,0.5)", bg: "rgba(236,72,153,0.12)", border: "rgba(236,72,153,0.35)" },
};

// ← this is what was missing
function imgSrc(filename) {
  const base = import.meta.env.BASE_URL ?? "/";
  return `${base}${filename}`;
}

function TeamPill({ team, isActive, onClick }) {
  const [imgErr, setImgErr] = useState(false);
  const tc = TEAM_C[team] || "#9ca3af";

  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 5, padding: 0,
        transform: isActive ? "scale(1.08)" : "scale(1)",
        transition: "transform .15s",
      }}
    >
      {!imgErr ? (
        <img
          src={imgSrc(TEAM_LOGOS[team] ?? team + ".png")}
          alt={team}
          onError={() => setImgErr(true)}
          style={{
            width: 48, height: 48, borderRadius: "50%", objectFit: "cover",
            border: `2.5px solid ${isActive ? tc : "rgba(255,255,255,.12)"}`,
            boxShadow: isActive ? `0 0 14px ${tc}88` : "none",
          }}
        />
      ) : (
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: `${tc}22`,
          border: `2.5px solid ${isActive ? tc : "rgba(255,255,255,.15)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'Bebas Neue',sans-serif", fontSize: 12, color: tc,
        }}>
          {team.slice(0, 3)}
        </div>
      )}
      <div style={{
        fontFamily: "'Bebas Neue',sans-serif", fontSize: 12,
        letterSpacing: ".1em",
        color: isActive ? tc : "rgba(255,255,255,.3)",
      }}>
        {team}
      </div>
    </button>
  );
}

function TeamWinsSection({ matchHistory = [] }) {
  const [activeTeam, setActiveTeam] = useState(null);

  const teamWinData = useMemo(() => {
    const td = {};
    matchHistory.forEach(m => {
      const pts = (m.players||[]).map(p => parseFloat(p.points||0));
      const max = Math.max(...pts);
      if (max === 0) return;
      const winners = (m.players||[]).filter(p => parseFloat(p.points||0) === max).map(p => p.player);
      (m.teams||[]).forEach(t => {
        if (!td[t]) td[t] = { matches: 0, wins: {} };
        td[t].matches++;
        winners.forEach(w => { td[t].wins[w] = (td[t].wins[w]||0) + 1; });
      });
    });
    return td;
  }, [matchHistory]);

  const allTeams = Object.keys(teamWinData).sort((a,b) =>
    Object.values(teamWinData[b].wins).reduce((s,v)=>s+v,0) -
    Object.values(teamWinData[a].wins).reduce((s,v)=>s+v,0)
  );

  const selected = activeTeam ? teamWinData[activeTeam] : null;
  const winners = selected ? Object.entries(selected.wins).sort((a,b)=>b[1]-a[1]) : [];
  const totalW = winners.reduce((s,[,w])=>s+w,0);
  const tc = TEAM_C[activeTeam] || "#9ca3af";

  return (
    <div style={{ marginTop: 40 }}>
      {/* divider */}
      <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent)", marginBottom: 28 }} />
      <div className="hp-fadein" style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.18)", marginBottom: 16, textTransform: "uppercase" }}>
        Team Performance · Win Leaders
      </div>

      {/* Team pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 22 }}>
   {allTeams.map(team => (
  <TeamPill
    key={team}
    team={team}
    isActive={activeTeam === team}
    onClick={() => setActiveTeam(activeTeam === team ? null : team)}
  />
))}
      </div>

      {/* Panel */}
      {activeTeam && selected && (
        <div className="hp-fadeup" style={{ borderRadius: 20, border: `1px solid ${tc}33`, background: `linear-gradient(135deg,${tc}12 0%,rgba(255,255,255,.02) 100%)`, overflow: "hidden" }}>
          {/* Header: donut + team info */}
          <div style={{ padding: "14px 16px 12px", display: "flex", alignItems: "center", gap: 14, borderBottom: "1px solid rgba(255,255,255,.06)" }}>
            {/* donut placeholder — use canvas in real React with useEffect + Chart.js */}
            <div style={{ width: 90, height: 90, borderRadius: "50%", border: `3px solid ${tc}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: `${tc}0a`, position: "relative" }}>
              <img src={imgSrc(TEAM_LOGOS[activeTeam]||activeTeam+".png")} alt={activeTeam}
                style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: `2px solid ${tc}66` }}
                onError={e=>e.currentTarget.style.display="none"} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, color: "rgba(255,255,255,.9)", letterSpacing: ".06em" }}>{activeTeam}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.28)", fontWeight: 700, letterSpacing: ".1em", marginBottom: 10 }}>{selected.matches} MATCHES PLAYED</div>
              {winners[0] && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img src={imgSrc(winners[0][0]+".png")} alt={winners[0][0]}
                    style={{ width: 30, height: 30, borderRadius: "50%", border: `2px solid ${(PALETTE[winners[0][0]]||{dot:"#9ca3af"}).dot}`, objectFit: "cover" }}
                    onError={e=>e.currentTarget.style.display="none"} />
                  <div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,.4)", fontWeight: 700, letterSpacing: ".1em" }}>TOP WINNER</div>
                    <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 17, color: (PALETTE[winners[0][0]]||{dot:"#fff"}).dot }}>{winners[0][0]}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Player rows */}
          {winners.map(([name, wcount], i) => {
            const p = PALETTE[name]||{dot:"#9ca3af",bg:"rgba(156,163,175,.08)",border:"rgba(156,163,175,.2)"};
            const pct = Math.round((wcount/totalW)*100);
            const isTop = i===0;
            return (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", background: isTop?p.bg:"transparent", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 18, color: isTop?"#ffff":"rgba(255,255,255,.2)", minWidth: 20, textAlign: "center" }}>{i+1}</div>
                <div style={{ width: isTop?44:38, height: isTop?44:38, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `${isTop?2.5:1.5}px solid ${p.border}` }}>
                  <img src={imgSrc(name+".png")} alt={name} style={{ width:"100%",height:"100%",objectFit:"cover",display:"block" }} onError={e=>e.currentTarget.style.display="none"} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: isTop?14:13, color: isTop?"rgba(255,255,255,.9)":"rgba(255,255,255,.5)" }}>{name}</div>
                  <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,.07)", overflow: "hidden", marginTop: 4 }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: p.dot, borderRadius: 99 }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: isTop?26:20, color: p.dot, lineHeight: 1 }}>{wcount}</div>
                  <div style={{ fontSize: 9, color: "rgba(255,255,255,.22)", fontWeight: 700, letterSpacing: ".1em" }}>{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!activeTeam && (
        <div style={{ textAlign: "center", color: "rgba(255,255,255,.18)", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", padding: "20px 0" }}>TAP A TEAM TO SEE WIN LEADERS</div>
      )}
    </div>
  );
}

export default TeamWinsSection;