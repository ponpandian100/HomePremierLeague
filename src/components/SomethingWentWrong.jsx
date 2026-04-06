const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes spinSlow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  .spin-slow { animation: spinSlow 8s linear infinite; }
  .cursor    { animation: blink 1.1s step-end infinite; }
`;

export default function SomethingWentWrong({ label = "Page" }) {
  return (
    <>
      <style>{style}</style>
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0f",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        padding: "0 32px",
        textAlign: "center",
      }}>

        {/* Decorative ring */}
        <div style={{ position: "relative", width: 96, height: 96 }}>
          <div
            className="spin-slow"
            style={{
              position: "absolute", inset: 0,
              borderRadius: "50%",
              border: "1.5px dashed rgba(239,68,68,0.3)",
            }}
          />
          <div style={{
            position: "absolute", inset: 10,
            borderRadius: "50%",
            border: "1.5px solid rgba(239,68,68,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontSize: 30 }}>🚧</span>
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 36,
            letterSpacing: "0.1em",
            background: "linear-gradient(135deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1,
            marginBottom: 8,
          }}>
            {label}
          </div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 22,
            color: "#ef4444",
            letterSpacing: "0.08em",
          }}>
            Coming Soon<span className="cursor">_</span>
          </div>
        </div>

        <div style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.2)",
          lineHeight: 1.6,
          maxWidth: 240,
        }}>
          This section is under construction. Check back soon.
        </div>

        {/* Terminal-style decoration */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 12,
          padding: "12px 20px",
          fontFamily: "monospace",
          fontSize: 12,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: 0.5,
        }}>
          <span style={{ color: "#ef4444" }}>$</span> hpl build {label.toLowerCase()}<span className="cursor">_</span>
        </div>
      </div>
    </>
  );
}