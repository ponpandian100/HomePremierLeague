const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes rollRight {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-12px); }
  }
  @keyframes shadowBreath {
    0%, 100% { transform: scaleX(1);   opacity: 0.4; }
    50%       { transform: scaleX(0.5); opacity: 0.1; }
  }
  @keyframes dotBlink {
    0%, 100% { opacity: 0.15; transform: scale(0.8); }
    50%       { opacity: 1;   transform: scale(1); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(0.85); opacity: 0.6; }
    100% { transform: scale(1.6);  opacity: 0; }
  }
  @keyframes bgShimmer {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .loading-bg {
    background: linear-gradient(135deg, #000000 0%, #000000 50%, #000000 100%);
    background-size: 400% 400%;
    animation: bgShimmer 6s ease infinite;
  }

  .ball-float { animation: float 2s ease-in-out infinite; }
  .ball-seam  { animation: rollRight 0.6s linear infinite; transform-origin: 50% 50%; }
  .ball-shadow { animation: shadowBreath 2s ease-in-out infinite; }
  .pulse-ring  { animation: pulseRing 1.8s ease-out infinite; }

  .dot-blink { animation: dotBlink 1.2s ease-in-out infinite; }
  .dot-blink:nth-child(2) { animation-delay: 0.18s; }
  .dot-blink:nth-child(3) { animation-delay: 0.36s; }
`;

export default function Loading() {
  return (
    <>
      <style>{style}</style>
      <div
        className="loading-bg flex flex-col items-center justify-center gap-8"
        style={{ minHeight: "100svh" }}
      >
        {/* Ball stack */}
        <div className="flex flex-col items-center gap-3">
          {/* Pulse ring behind ball */}
          <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
            <div
              className="pulse-ring absolute rounded-full"
              style={{ width: 80, height: 80, border: "2px solid rgba(239,68,68,0.4)" }}
            />
            <div
              className="pulse-ring absolute rounded-full"
              style={{ width: 80, height: 80, border: "2px solid rgba(239,68,68,0.25)", animationDelay: "0.6s" }}
            />

            <div className="ball-float">
              <div
                className="relative rounded-full"
                style={{
                  width: 76,
                  height: 76,
                  background: "radial-gradient(circle at 38% 32%, #f87171 0%, #dc2626 48%, #7f1d1d 100%)",
                  boxShadow: "0 12px 40px rgba(220,38,38,0.5), inset 0 -6px 12px rgba(0,0,0,0.4), 0 0 60px rgba(239,68,68,0.15)",
                }}
              >
                {/* Specular */}
                <div
                  className="absolute rounded-full"
                  style={{
                    width: "30%", height: "20%",
                    top: "14%", left: "18%",
                    background: "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 80%)",
                    filter: "blur(2px)",
                  }}
                />
                {/* Seam */}
                <div className="ball-seam absolute inset-0">
                  <svg viewBox="0 0 76 76" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M38 5 C66 5, 72 38, 38 38 C4 38, 10 71, 38 71"
                      fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M38 5 C10 5, 4 38, 38 38 C72 38, 66 71, 38 71"
                      fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 4" />
                    {[...Array(6)].map((_, i) => {
                      const t = (i + 0.8) / 6.5;
                      const cx = 38 + 32 * Math.sin(t * Math.PI) * 0.5;
                      const cy = 5 + 66 * t;
                      return (
                        <line key={i}
                          x1={cx - 3} y1={cy - 1.5} x2={cx + 3} y2={cy + 1.5}
                          stroke="rgba(255,255,255,0.65)" strokeWidth="1.4" strokeLinecap="round" />
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Shadow */}
          <div
            className="ball-shadow rounded-full"
            style={{
              width: 50, height: 7,
              background: "radial-gradient(ellipse, rgba(220,38,38,0.5) 0%, transparent 80%)",
              filter: "blur(4px)",
            }}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col items-center gap-3">
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "2rem",
            letterSpacing: "0.22em",
            background: "linear-gradient(135deg, #f87171, #dc2626)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.1,
          }}>
            HPL 2026
          </div>
          <div className="" style={{ fontSize: 11, letterSpacing: "0.2em", color: "rgba(255,255,255,0.25)", fontWeight: 500 }}>
            HOME PREMIER LEAGUE
          </div>

          <div className="flex gap-2 mt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="dot-blink rounded-full"
                style={{
                  width: 8, height: 8,
                  background: "#ef4444",
                  display: "inline-block",
                  animationDelay: `${i * 0.18}s`,
                  marginTop: "8px",
                  marginRight: "5px",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}