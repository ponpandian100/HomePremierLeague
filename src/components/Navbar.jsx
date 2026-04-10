import { useRef } from "react";
// Ionicons 5
import { IoFlame, IoFlameOutline }           from "react-icons/io5";
import { IoBarChart, IoBarChartOutline }     from "react-icons/io5";
import { IoHome, IoHomeOutline }             from "react-icons/io5";
import { IoFootball, IoFootballOutline }     from "react-icons/io5";
import { IoCash, IoCashOutline }             from "react-icons/io5";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes homeFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50%       { transform: translateY(-3px) scale(1.04); }
  }
  @keyframes iconPop {
    0%   { transform: scale(1); }
    35%  { transform: scale(1.35) rotate(-8deg); }
    65%  { transform: scale(0.92) rotate(4deg); }
    100% { transform: scale(1) rotate(0deg); }
  }
  @keyframes rippleOut {
    0%   { transform: translate(-50%,-50%) scale(0); opacity: 0.55; }
    100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0; }
  }
  @keyframes glowPulse {
    0%, 100% { box-shadow: 0 0 16px 2px rgba(239,68,68,0.45); }
    50%       { box-shadow: 0 0 28px 6px rgba(239,68,68,0.7); }
  }
  @keyframes labelFade {
    from { opacity:0; transform:translateY(3px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes homeGlow {
    0%, 100% { box-shadow: 0 8px 32px rgba(239,68,68,0.45), 0 0 0 0 rgba(239,68,68,0.2); }
    50%       { box-shadow: 0 12px 40px rgba(239,68,68,0.65), 0 0 0 8px rgba(239,68,68,0); }
  }

  .icon-pop    { animation: iconPop    0.42s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .label-fade  { animation: labelFade  0.25s ease forwards; }
  .home-float  { animation: homeFloat  3s ease-in-out infinite; }
  .home-glow   { animation: homeGlow   2.5s ease-in-out infinite; }

  .nb-btn {
    -webkit-tap-highlight-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;
    background: transparent;
    padding: 0;
  }
`;

// Side tabs (fixed equal width, no size change when inactive)
const SIDE_TABS = [
  { id: "hot",     label: "Hot",     Icon: IoFlame,    IconOff: IoFlameOutline,    color: "#ec4899" },
  { id: "points",  label: "Points",  Icon: IoBarChart, IconOff: IoBarChartOutline, color: "#facc15" },
  // center placeholder — handled separately
  { id: "matches", label: "Matches", Icon: IoFootball, IconOff: IoFootballOutline, color: "#60a5fa" },
  { id: "amount",  label: "Amount",  Icon: IoCash,     IconOff: IoCashOutline,     color: "#34d399" },
];

export default function Navbar({ active, onTabChange }) {
  const prevRef = useRef(active);

  const handleTab = (id) => {
    prevRef.current = active;
    onTabChange(id);
  };

  const isHome = active === "home";

  return (
    <>
      <style>{style}</style>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100 }}>

        {/* ── Glass backing ── */}
        <div style={{
          position: "absolute", inset: 0,
          backdropFilter: "blur(30px)",
          WebkitBackdropFilter: "blur(30px)",
          background: "rgba(10,10,16,0.93)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }} />

        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: "12%", right: "12%", height: 1,
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.65), transparent)",
        }} />

        {/* ── Row ── */}
        <div style={{
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-around",
          padding: "0 10px calc(14px + env(safe-area-inset-bottom,0px))",
          height: 100,
        }}>

          {/* Left two tabs */}
          {SIDE_TABS.slice(0, 2).map(tab => (
            <SideTab key={tab.id} tab={tab} active={active} prevRef={prevRef} onTab={handleTab} />
          ))}

          {/* ── CENTER HOME BUTTON ── */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", marginTop: -28 }}>
            <button
              className="nb-btn"
              onClick={() => handleTab("home")}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
            >
              {/* Floating circle */}
              <div
                className={`home-float ${isHome ? "home-glow" : ""}`}
                style={{
                  position: "relative",
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: isHome
                    ? "linear-gradient(145deg, #ef4444 0%, #b91c1c 100%)"
                    : "linear-gradient(145deg, #1f1f2e, #141420)",
                  border: isHome
                    ? "2px solid rgba(255,255,255,0.25)"
                    : "2px solid rgba(255,255,255,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.3s, border 0.3s",
                  overflow: "hidden",
                }}
              >
                {/* Inner shimmer ring */}
                {isHome && (
                  <div style={{
                    position: "absolute", inset: 3, borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    pointerEvents: "none",
                  }} />
                )}

                {/* Ripple on tap */}
                {isHome && prevRef.current !== "home" && (
                  <span style={{
                    position: "absolute",
                    top: "50%", left: "50%",
                    width: 62, height: 62,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.25)",
                    animation: "rippleOut 0.55s ease-out forwards",
                    pointerEvents: "none",
                  }} />
                )}

                {isHome
                  ? <IoHome    style={{ fontSize: 28, color: "#fff", filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))" }} />
                  : <IoHomeOutline style={{ fontSize: 24, color: "rgba(255,255,255,0.4)" }} />
                }
              </div>

              {/* Label under circle */}
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 12,
                letterSpacing: "0.12em",
                color: isHome ? "#ef4444" : "rgba(255,255,255,0.28)",
                lineHeight: 1,
                transition: "color 0.2s",
              }}>
                Home
              </span>

              {/* Active dot */}
              <div style={{
                width: isHome ? 20 : 4,
                height: 3,
                borderRadius: 99,
                background: isHome ? "linear-gradient(90deg,#ef4444,#f97316)" : "rgba(255,255,255,0.1)",
                boxShadow: isHome ? "0 0 8px rgba(239,68,68,0.9)" : "none",
                transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, box-shadow 0.2s",
                marginTop: 1,
              }} />
            </button>
          </div>

          {/* Right two tabs */}
          {SIDE_TABS.slice(2).map(tab => (
            <SideTab key={tab.id} tab={tab} active={active} prevRef={prevRef} onTab={handleTab} />
          ))}

        </div>
      </div>
    </>
  );
}

// ── Side Tab (fixed size, only icon+color changes on active) ──
function SideTab({ tab, active, prevRef, onTab }) {
  const isActive   = active === tab.id;
  const justBecame = isActive && prevRef.current !== tab.id;
  const Icon = isActive ? tab.Icon : tab.IconOff;

  return (
    <button
      className="nb-btn"
      onClick={() => onTab(tab.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 5,
        paddingBottom: 2,
        width: 56,
        position: "relative",
      }}
    >
      {/* Ripple */}
      {justBecame && (
        <span style={{
          position: "absolute",
          top: "30%", left: "50%",
          width: 44, height: 44,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tab.color}55 0%, transparent 70%)`,
          animation: "rippleOut 0.5s ease-out forwards",
          pointerEvents: "none",
        }} />
      )}

      {/* Fixed-size icon container — same size always */}
      <div
        className={justBecame ? "icon-pop" : ""}
        style={{
          width: 42,
          height: 42,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isActive
            ? `linear-gradient(145deg, ${tab.color}28, ${tab.color}10)`
            : "rgba(255,255,255,0.04)",
          border: isActive
            ? `1.5px solid ${tab.color}55`
            : "1.5px solid rgba(255,255,255,0.07)",
          transition: "background 0.25s, border 0.25s",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Glow behind active icon */}
        {isActive && (
          <div style={{
            position: "absolute", inset: -4, borderRadius: 18,
            background: `radial-gradient(circle, ${tab.color}30 0%, transparent 70%)`,
            filter: "blur(6px)",
            pointerEvents: "none",
          }} />
        )}

        <Icon style={{
          fontSize: 20,
          color: isActive ? tab.color : "rgba(255,255,255,0.3)",
          filter: isActive ? `drop-shadow(0 0 5px ${tab.color}99)` : "none",
          transition: "color 0.22s, filter 0.22s",
          position: "relative", zIndex: 1,
        }} />
      </div>

      {/* Label */}
      <span
        className={justBecame ? "label-fade" : ""}
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: isActive ? tab.color : "rgba(255,255,255,0.28)",
          lineHeight: 1,
          transition: "color 0.22s",
        }}
      >
        {tab.label}
      </span>

      {/* Bottom dot */}
      <div style={{
        width: isActive ? 16 : 4,
        height: 3,
        borderRadius: 99,
        background: isActive ? tab.color : "rgba(255,255,255,0.08)",
        boxShadow: isActive ? `0 0 8px ${tab.color}` : "none",
        transition: "width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, box-shadow 0.2s",
        marginTop: 1,
      }} />
    </button>
  );
}