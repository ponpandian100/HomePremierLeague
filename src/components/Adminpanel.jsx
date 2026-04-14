import { useState } from "react";

// ─────────────────────────────────────────────────────────────
//  FILL THESE IN — your GitHub details
// ─────────────────────────────────────────────────────────────
const GITHUB_OWNER = "ponpandian100";   // e.g. "ponpandian"
const GITHUB_REPO  = "HomePremierLeague";          // e.g. "hpl-app"
const FILE_PATH    = "public/data.json";        // path inside repo
const BRANCH       = "hpl";                    // your default branch
// ─────────────────────────────────────────────────────────────

const PLAYERS = ["Pon", "Naveen", "Varun", "Pal"];
const IPL_TEAMS = ["SRH","RCB","KKR","MI","CSK","RR","GT","PBKS","LSG","DC"];

const PALETTE = {
  Pon:    "#ef4444",
  Naveen: "#60a5fa",
  Varun:  "#fbbf24",
  Pal:    "#ec4899",
};

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600;700&display=swap');

  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin    { to{transform:rotate(360deg)} }

  .ap-fadeup { animation: fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) both; }
  .ap-spin   { display:inline-block; animation: spin 0.85s linear infinite; }

  .ap-btn {
    -webkit-tap-highlight-color: transparent;
    cursor: pointer; border: none; outline: none;
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.1em;
    transition: opacity 0.15s, transform 0.15s;
  }
  .ap-btn:active  { transform: scale(0.96); }
  .ap-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }

  .ap-input {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    padding: 10px 12px; outline: none;
    width: 100%; box-sizing: border-box;
    transition: border-color 0.2s;
  }
  .ap-input:focus { border-color: rgba(239,68,68,0.5); }
  .ap-input option { background: #1a1a2e; }

  .tok-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 13px;
    padding: 12px 44px 12px 14px; outline: none;
    width: 100%; box-sizing: border-box;
    transition: border-color 0.2s; letter-spacing: 0.03em;
  }
  .tok-input:focus { border-color: rgba(239,68,68,0.4); }
  .tok-input::placeholder { color: rgba(255,255,255,0.18); font-size: 12px; }
`;

const lbl = {
  fontSize: 9, fontFamily: "'DM Sans',sans-serif", fontWeight: 700,
  letterSpacing: "0.15em", color: "rgba(255,255,255,0.22)",
  textTransform: "uppercase", marginBottom: 5,
};

// ── GitHub helpers ────────────────────────────────────────────
async function ghGet(token) {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}?ref=${BRANCH}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" } }
  );
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `GET failed (${res.status})`); }
  const d = await res.json();
  return { sha: d.sha, data: JSON.parse(atob(d.content.replace(/\n/g, ""))) };
}

async function ghPut(token, sha, payload) {
  const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "Content-Type": "application/json" },
      body: JSON.stringify({ message: `HPL update · ${new Date().toLocaleString("en-IN")}`, content, sha, branch: BRANCH }),
    }
  );
  if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `PUT failed (${res.status})`); }
}

// ── Token Gate ────────────────────────────────────────────────
function TokenGate({ onConnect, onBack }) {
  const [val,  setVal]  = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState("");

  async function connect() {
    if (!val.trim()) return;
    setBusy(true); setErr("");
    try {
      const { sha, data } = await ghGet(val.trim());
      onConnect(val.trim(), sha, data);
    } catch (e) { setErr(e.message); }
    finally { setBusy(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "'DM Sans',sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 20px 60px" }}>
        <div style={{ paddingTop: 32, marginBottom: 32 }}>
          <button className="ap-btn" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", color: "rgba(255,255,255,0.5)", fontSize: 13 }}>← Back</button>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(239,68,68,0.6)", marginBottom: 8 }}>ADMIN · HPL 2026</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, lineHeight: 0.92, marginBottom: 10 }}>
          CONNECT TO<br />
          <span style={{ background: "linear-gradient(90deg,#ef4444,#fca5a5,#ef4444)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>GITHUB</span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.65, marginBottom: 28 }}>
          Your token is used only in this session — never stored anywhere.
        </div>

        {/* Instructions */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "16px 18px", marginBottom: 22 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.22)", marginBottom: 10 }}>HOW TO CREATE YOUR TOKEN</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", lineHeight: 1.8 }}>
            1. GitHub → <span style={{ color: "#60a5fa" }}>Settings → Developer settings</span><br />
            2. Personal access tokens → Fine-grained tokens → New<br />
            3. Repository access → Only select repos → pick <strong style={{ color: "rgba(255,255,255,0.55)" }}>{GITHUB_REPO}</strong><br />
            4. Permissions → Contents → <strong style={{ color: "rgba(255,255,255,0.55)" }}>Read and Write</strong><br />
            5. Generate token → paste below
          </div>
        </div>

        {/* Token field */}
        <div style={{ marginBottom: 16 }}>
          <div style={lbl}>GitHub Token</div>
          <div style={{ position: "relative" }}>
            <input
              className="tok-input"
              type={show ? "text" : "password"}
              placeholder="github_pat_xxxxxxxxxxxxxxxx"
              value={val}
              onChange={e => { setVal(e.target.value); setErr(""); }}
              onKeyDown={e => e.key === "Enter" && connect()}
            />
            <button onClick={() => setShow(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, opacity: 0.35, color: "#fff" }}>
              {show ? "🙈" : "👁"}
            </button>
          </div>
        </div>

        {err && (
          <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#ef4444", marginBottom: 16 }}>
            ✗ {err}
          </div>
        )}

        <button
          className="ap-btn"
          onClick={connect}
          disabled={busy || !val.trim()}
          style={{ width: "100%", padding: "15px 0", borderRadius: 14, fontSize: 17, background: "linear-gradient(135deg,#ef4444,#b91c1c)", color: "#fff", boxShadow: "0 4px 20px rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
        >
          {busy ? <><span className="ap-spin">⟳</span> CONNECTING…</> : "🔗 CONNECT & LOAD DATA"}
        </button>

        <div style={{ marginTop: 18, fontSize: 11, color: "rgba(255,255,255,0.13)", textAlign: "center" }}>
          <code style={{ color: "rgba(255,255,255,0.25)" }}>{GITHUB_OWNER}/{GITHUB_REPO}</code> · <code style={{ color: "rgba(255,255,255,0.25)" }}>{FILE_PATH}</code>
        </div>
      </div>
    </div>
  );
}

// ── Match Card ────────────────────────────────────────────────
function MatchCard({ match, idx, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [data,     setData]     = useState(match);
  const [dirty,    setDirty]    = useState(false);

  function set(field, val) { setData(d => ({ ...d, [field]: val })); setDirty(true); }
  function setPlayer(pi, field, val) {
    setData(d => ({ ...d, players: d.players.map((p, i) => i === pi ? { ...p, [field]: val } : p) }));
    setDirty(true);
  }
  function save() { onUpdate(idx, data); setDirty(false); }

  return (
    <div className="ap-fadeup" style={{ animationDelay: `${idx * 0.03}s`, border: `1px solid ${dirty ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, overflow: "hidden", marginBottom: 12, transition: "border-color 0.2s" }}>

      {/* Header row */}
      <div onClick={() => setExpanded(e => !e)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "rgba(255,255,255,0.03)", cursor: "pointer", userSelect: "none" }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: "rgba(239,68,68,0.8)", minWidth: 34 }}>#{data.match}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: "#fff", letterSpacing: "0.06em" }}>{data.teams?.join(" vs ") || "—"}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>{data.matchOn} · ₹{data.entryFee}</div>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {data.players?.map(p => <div key={p.player} style={{ width: 8, height: 8, borderRadius: "50%", background: PALETTE[p.player] || "#888", opacity: parseFloat(p.points) > 0 ? 1 : 0.2 }} />)}
        </div>
        {dirty && <div style={{ fontSize: 9, fontFamily: "'Bebas Neue',sans-serif", color: "#ef4444", letterSpacing: "0.1em" }}>UNSAVED</div>}
        <div style={{ fontSize: 17, color: "rgba(255,255,255,0.25)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.22s" }}>▾</div>
      </div>

      {/* Expanded edit */}
      {expanded && (
        <div style={{ padding: "16px 16px 20px", background: "rgba(0,0,0,0.22)" }}>

          {/* Meta row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div><div style={lbl}>Date</div><input className="ap-input" value={data.matchOn || ""} onChange={e => set("matchOn", e.target.value)} placeholder="DD/MM/YY" /></div>
            <div><div style={lbl}>Match #</div><input className="ap-input" value={data.match || ""} onChange={e => set("match", e.target.value)} /></div>
            <div><div style={lbl}>Entry ₹</div><input className="ap-input" type="number" value={data.entryFee || ""} onChange={e => set("entryFee", e.target.value)} /></div>
          </div>

          {/* Teams */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            {[0, 1].map(ti => (
              <div key={ti}>
                <div style={lbl}>Team {ti + 1}</div>
                <select className="ap-input" value={data.teams?.[ti] || ""} onChange={e => { const t = [...(data.teams || ["", ""])]; t[ti] = e.target.value; set("teams", t); }}>
                  <option value="">—</option>
                  {IPL_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ))}
          </div>

          {/* Players */}
          <div style={{ fontSize: 10, fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)", marginBottom: 10 }}>PLAYER SCORES</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.players?.map((p, pi) => {
              const c = PALETTE[p.player] || "#9ca3af";
              return (
                <div key={p.player} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 10, alignItems: "center", padding: "10px 12px", borderRadius: 12, background: `linear-gradient(90deg,${c}10,rgba(255,255,255,0.02))`, border: `1px solid ${c}22` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 80 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}` }} />
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 16, color: c, letterSpacing: "0.05em" }}>{p.player}</span>
                  </div>
                  <div><div style={lbl}>Points</div><input className="ap-input" type="number" step="0.5" value={p.points} onChange={e => setPlayer(pi, "points", e.target.value)} /></div>
                  <div><div style={lbl}>Paid ₹</div><input className="ap-input" type="number" value={p.paid} onChange={e => setPlayer(pi, "paid", e.target.value)} /></div>
                </div>
              );
            })}
          </div>

          {/* Row actions */}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="ap-btn" onClick={save} style={{ flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 15, background: dirty ? "linear-gradient(135deg,#ef4444,#b91c1c)" : "rgba(255,255,255,0.06)", color: dirty ? "#fff" : "rgba(255,255,255,0.28)", boxShadow: dirty ? "0 4px 14px rgba(239,68,68,0.3)" : "none" }}>
              {dirty ? "✓ MARK READY" : "✓ UP TO DATE"}
            </button>
            <button className="ap-btn" onClick={() => onDelete(idx)} style={{ padding: "12px 18px", borderRadius: 12, fontSize: 15, background: "rgba(239,68,68,0.07)", color: "rgba(239,68,68,0.5)", border: "1px solid rgba(239,68,68,0.15)" }}>🗑</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────
function Editor({ token, initialSha, initialMatches, onBack }) {
  const [matches, setMatches] = useState(initialMatches);
  const [saving,  setSaving]  = useState(false);
  const [status,  setStatus]  = useState(null);

  function handleUpdate(idx, updated) { setMatches(m => m.map((x, i) => i === idx ? updated : x)); }
  function handleDelete(idx) {
    if (!window.confirm(`Delete match #${matches[idx].match}?`)) return;
    setMatches(m => m.filter((_, i) => i !== idx));
  }
  function handleAdd() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yy = String(today.getFullYear()).slice(2);
    setMatches(m => [...m, {
      matchOn: `${dd}/${mm}/${yy}`,
      match: String(m.length + 1),
      teams: ["", ""],
      entryFee: "10",
      players: PLAYERS.map(p => ({ player: p, paid: "10", points: "0" })),
    }]);
    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }), 80);
  }

  async function saveToGitHub() {
    setSaving(true); setStatus(null);
    try {
      // Always fetch latest sha before writing to avoid conflicts
      const { sha } = await ghGet(token);
      await ghPut(token, sha, { hpl: matches });
      setStatus({ ok: true, msg: "✓ Saved! GitHub Pages will update in ~60 seconds." });
    } catch (e) {
      setStatus({ ok: false, msg: "✗ " + e.message });
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 7000);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#fff", fontFamily: "'DM Sans',sans-serif", paddingBottom: 120 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>

        {/* Header */}
        <div style={{ padding: "32px 0 18px" }}>
          <button className="ap-btn" onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "8px 14px", color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 20 }}>← Back</button>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(239,68,68,0.6)", marginBottom: 4 }}>ADMIN · HPL 2026</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, lineHeight: 0.92, marginBottom: 8 }}>
            MATCH{" "}
            <span style={{ background: "linear-gradient(90deg,#ef4444,#fca5a5,#ef4444)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", animation: "shimmer 3s linear infinite" }}>EDITOR</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            {matches.length} matches · <code style={{ color: "#60a5fa" }}>{GITHUB_OWNER}/{GITHUB_REPO}</code>
          </div>
        </div>

        {/* Action bar */}
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <button className="ap-btn" onClick={handleAdd} style={{ flex: 1, padding: "13px 0", borderRadius: 14, fontSize: 16, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.28)", color: "#ef4444" }}>
            + ADD MATCH
          </button>
          <button
            className="ap-btn"
            onClick={saveToGitHub}
            disabled={saving}
            style={{ flex: 1.4, padding: "13px 0", borderRadius: 14, fontSize: 16, background: saving ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#ef4444,#b91c1c)", color: saving ? "rgba(255,255,255,0.35)" : "#fff", boxShadow: saving ? "none" : "0 4px 18px rgba(239,68,68,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            {saving ? <><span className="ap-spin">⟳</span> SAVING…</> : "☁ SAVE TO GITHUB"}
          </button>
        </div>

        {/* Status */}
        {status && (
          <div style={{ padding: "12px 16px", borderRadius: 12, marginBottom: 14, fontSize: 13, fontWeight: 600, background: status.ok ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${status.ok ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, color: status.ok ? "#22c55e" : "#ef4444" }}>
            {status.msg}
          </div>
        )}

        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(239,68,68,0.2),transparent)", marginBottom: 16 }} />

        {/* Cards */}
        {matches.map((m, i) => (
          <MatchCard key={`${m.match}-${i}`} match={m} idx={i} onUpdate={handleUpdate} onDelete={handleDelete} />
        ))}

        {matches.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.16)", fontSize: 14 }}>
            No matches — click ADD MATCH to begin
          </div>
        )}

        {/* Help */}
        <div style={{ marginTop: 28, padding: 16, background: "rgba(96,165,250,0.05)", border: "1px solid rgba(96,165,250,0.13)", borderRadius: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(96,165,250,0.6)", marginBottom: 8 }}>HOW IT WORKS</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.28)", lineHeight: 1.75 }}>
            1. Expand any match card to edit<br />
            2. Tap <strong style={{ color: "rgba(255,255,255,0.45)" }}>✓ MARK READY</strong> on edited cards<br />
            3. Tap <strong style={{ color: "rgba(255,255,255,0.45)" }}>☁ SAVE TO GITHUB</strong> — done!<br />
            4. GitHub Pages auto-redeploys in ~60 sec
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Root Export ───────────────────────────────────────────────
export default function AdminPanel({ onBack }) {
  const [session, setSession] = useState(null); // { token, sha, matches }

  if (!session) {
    return (
      <>
        <style>{STYLE}</style>
        <TokenGate
          onBack={onBack}
          onConnect={(token, sha, data) => {
            const hpl = data?.hpl ?? (Array.isArray(data) ? data : []);
            setSession({ token, sha, matches: hpl });
          }}
        />
      </>
    );
  }

  return (
    <>
      <style>{STYLE}</style>
      <Editor
        token={session.token}
        initialSha={session.sha}
        initialMatches={session.matches}
        onBack={onBack}
      />
    </>
  );
}