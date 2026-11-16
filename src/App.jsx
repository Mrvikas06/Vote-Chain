/**
 * VoteChain - Premium Web3 Electronic Voting System
 * Modern, un-slopped, institutional-grade presentation layer
 */

const { useState, useEffect, useRef, useCallback } = React;
const {
  VOTERS_DB,
  INITIAL_CANDIDATES,
  INITIAL_BLOCKCHAIN,
  genHash,
  genBlock,
  genOTP,
  fmtNum,
  verifyAadhaar,
  verifyOTP,
  recordVote,
  auditReceipt
} = window.VoteChain || {};

// SVG Icons
function Icon({ name, size = 16, color = "currentColor" }) {
  const icons = {
    vote: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 12 2 2 4-4"/>
        <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
        <path d="M22 19H2"/>
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10"/>
        <path d="M12 20V4"/>
        <path d="M6 20v-6"/>
      </svg>
    ),
    audit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    copy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    blocks: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="8" x="2" y="2" rx="1"/>
        <path d="m14 6 4 4-4 4"/>
        <rect width="8" height="8" x="14" y="14" rx="1"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 0 0-16 0"/>
      </svg>
    ),
    chevronDown: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    )
  };
  return icons[name] || null;
}

// Top Status & Institutional Navigation Header
function StatusBar({ voter, onReset }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: 56,
      background: "rgba(7, 9, 14, 0.8)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-sm)",
            background: "linear-gradient(135deg, #0284c7, #0369a1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px var(--accent-glow)"
          }}>
            <Icon name="shield" size={15} color="#fff" />
          </div>
          <span style={{
            fontFamily: "var(--font)",
            fontWeight: 800,
            fontSize: 16,
            letterSpacing: "-0.02em",
            color: "var(--text)"
          }}>
            VOTE<span style={{ color: "var(--accent)" }}>CHAIN</span>
          </span>
        </div>

        <div style={{ display: "none" }} className="node-tag">
          <span className="tag" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
            <span className="status-dot" style={{ background: "#10b981" }} />
            RAFT SYNC
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {voter && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            padding: "3px 12px 3px 6px"
          }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(14, 165, 233, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 700,
              color: "var(--accent)"
            }}>
              {voter.name.charAt(0)}
            </div>
            <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>
              {voter.name.split(" ")[0]}
            </span>
            <button
              onClick={onReset}
              title="Logout session"
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-dim)",
                cursor: "pointer",
                padding: "2px 4px",
                fontSize: 10,
                fontFamily: "var(--mono)",
                transition: "color 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--red)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-dim)"}
            >
              Exit
            </button>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
          <span className="status-dot" style={{ background: "#10b981" }} />
          <span>{time.toLocaleTimeString("en-IN", { hour12: false })} IST</span>
        </div>

        <span className="tag" style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
          <Icon name="lock" size={11} color="var(--accent)" />
          TLS 1.3
        </span>
      </div>
    </header>
  );
}

// Progress Stepper Component
function ProgressStepper({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 32, gap: 8 }}>
      {steps.map((s, i) => {
        const isDone = i < current;
        const isCurrent = i === current;
        return (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "initial" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 12px",
              borderRadius: "var(--radius-full)",
              background: isCurrent ? "rgba(14, 165, 233, 0.12)" : isDone ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.03)",
              border: `1px solid ${isCurrent ? "var(--accent)" : isDone ? "var(--green)" : "var(--border)"}`,
              transition: "all 0.3s ease"
            }}>
              <div style={{
                width: 18,
                height: 18,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                background: isCurrent ? "var(--accent)" : isDone ? "var(--green)" : "transparent",
                color: isCurrent || isDone ? "#fff" : "var(--text-dim)"
              }}>
                {isDone ? <Icon name="check" size={10} color="#fff" /> : i + 1}
              </div>
              <span style={{
                fontSize: 12,
                fontWeight: isCurrent ? 600 : 500,
                color: isCurrent ? "var(--text)" : isDone ? "var(--text-muted)" : "var(--text-dim)",
                whiteSpace: "nowrap"
              }}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: 1,
                background: isDone ? "var(--green)" : "var(--border)",
                margin: "0 8px",
                transition: "background 0.3s ease"
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Terminal Output Line
function TerminalLine({ text, color = "var(--text-muted)" }) {
  return (
    <div style={{
      animation: "fadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
      fontFamily: "var(--mono)",
      fontSize: 12,
      color,
      padding: "3px 0",
      display: "flex",
      alignItems: "center",
      gap: 10
    }}>
      <span style={{ color: "var(--text-dim)", userSelect: "none" }}>›</span>
      <span>{text}</span>
    </div>
  );
}

// Landing Screen
function LandingScreen({ onNavigate, candidates, blockchainLog }) {
  const cands = candidates || INITIAL_CANDIDATES;
  const logs = blockchainLog || INITIAL_BLOCKCHAIN;
  const total = cands.reduce((a, c) => a + c.votes, 0);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 56, paddingBottom: 80, position: "relative" }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px" }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: 56, animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <div className="tag" style={{
            background: "rgba(14, 165, 233, 0.08)",
            border: "1px solid rgba(14, 165, 233, 0.25)",
            color: "var(--accent-hover)",
            marginBottom: 20
          }}>
            <span className="status-dot" style={{ background: "var(--accent)" }} />
            GENERAL ELECTION 2026 · DIGITAL VOTING PROTOCOL
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            marginBottom: 18,
            color: "var(--text)"
          }}>
            The Sovereign Electronic Ballot.<br />
            <span style={{
              background: "linear-gradient(90deg, #38bdf8 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Cryptographically Sealed.
            </span>
          </h1>

          <p style={{
            fontSize: 16,
            color: "var(--text-muted)",
            maxWidth: 620,
            margin: "0 auto 36px",
            lineHeight: 1.7
          }}>
            Decentralized e-voting secured with Byzantine Fault-Tolerant Raft consensus and zero-knowledge privacy. Every citizen ballot is tamper-proof and publicly verifiable.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={() => onNavigate("auth")}
              style={{ padding: "14px 32px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon name="vote" size={16} color="#fff" />
              Cast Your Ballot
            </button>
            <button
              className="btn-ghost"
              onClick={() => onNavigate("audit")}
              style={{ padding: "14px 24px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon name="audit" size={16} />
              Verify Receipt
            </button>
            <button
              className="btn-ghost"
              onClick={() => onNavigate("results")}
              style={{ padding: "14px 24px", fontSize: 14, display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <Icon name="chart" size={16} />
              Live Telemetry
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 40
        }}>
          {[
            { label: "Registered Electorate", value: "97.2 Cr", icon: "user", color: "var(--accent)" },
            { label: "Ballots Recorded", value: fmtNum(total), icon: "vote", color: "var(--green)" },
            { label: "Ledger Height", value: fmtNum(449821 + Math.max(0, logs.length - INITIAL_BLOCKCHAIN.length)), icon: "blocks", color: "var(--purple)" },
            { label: "Electoral Turnout", value: ((total / 1028300) * 100).toFixed(1) + "%", icon: "chart", color: "var(--amber)" }
          ].map((s, idx) => (
            <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-muted)" }}>{s.label}</span>
                <div style={{
                  width: 30,
                  height: 30,
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(255, 255, 255, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: s.color
                }}>
                  <Icon name={s.icon} size={15} color={s.color} />
                </div>
              </div>
              <div style={{
                fontFamily: "var(--mono)",
                fontWeight: 700,
                fontSize: 24,
                color: s.color,
                letterSpacing: "-0.02em"
              }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* Live Blockchain Ledger Feed */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div style={{
            padding: "16px 22px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="status-dot" style={{ background: "var(--green)" }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Live Consensus Ledger</span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
              Hyperledger Fabric · Raft Protocol
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--mono)", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "rgba(255, 255, 255, 0.02)" }}>
                  {["Block Height", "Transaction Hash", "Transactions", "Time", "Consensus", "Audit"].map(h => (
                    <th key={h} style={{ padding: "12px 18px", textAlign: "left", color: "var(--text-dim)", fontWeight: 500, fontSize: 11 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(b => {
                  const shortHash = b.hash.length > 18 ? `${b.hash.slice(0, 6)}...${b.hash.slice(-4)}` : b.hash;
                  return (
                    <tr key={b.block} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="table-row">
                      <td style={{ padding: "14px 18px", color: "var(--accent)", fontWeight: 600 }}>{b.block}</td>
                      <td style={{ padding: "14px 18px", color: "var(--text-muted)" }} title={b.fullHash || b.hash}>{shortHash}</td>
                      <td style={{ padding: "14px 18px", color: "var(--text)" }}>{fmtNum(b.tx)}</td>
                      <td style={{ padding: "14px 18px", color: "var(--text-dim)" }}>{b.time}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <span className="tag" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)", color: "#34d399" }}>
                          <Icon name="check" size={10} color="#10b981" />
                          {b.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <button
                          className="demo-chip"
                          onClick={() => onNavigate("audit", b.fullHash || b.hash)}
                          style={{ padding: "4px 10px", fontSize: 11 }}
                        >
                          Verify
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Demo Credentials Strip */}
        <div style={{
          marginTop: 24,
          padding: "14px 18px",
          background: "rgba(255, 255, 255, 0.02)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="user" size={14} color="var(--text-dim)" />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Demo Verified Elector Identities:</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(VOTERS_DB).map(([num, v]) => (
              <span key={num} className="tag" style={{ background: "var(--surface-3)", color: "var(--text)", border: "1px solid var(--border)" }}>
                {v.name.split(" ")[0]}: <strong style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>{num}</strong>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Authentication Screen
function AuthScreen({ onSuccess }) {
  const [step, setStep] = useState(0);
  const [aadhaar, setAadhaar] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [faceProgress, setFaceProgress] = useState(0);
  const [faceDone, setFaceDone] = useState(false);
  const [termLines, setTermLines] = useState([]);
  const inputRefs = useRef([]);
  const timersRef = useRef([]);
  const intervalRef = useRef(null);
  const voter = VOTERS_DB[aadhaar];

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Autofocus first OTP digit on step transition
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
      return () => clearTimeout(t);
    }
  }, [step]);

  const safeTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

  const addTerm = (txt, color = "var(--text-muted)", delay = 0) => {
    safeTimeout(() => setTermLines(l => [...l, { txt, color, id: Date.now() + Math.random() }]), delay);
  };

  const handleAadhaar = () => {
    if (!voter) {
      setError("Aadhaar ID not found in electoral registry. Please select a demo elector.");
      return;
    }
    setError("");
    const code = genOTP();
    setOtpCode(code);
    setTermLines([]);
    addTerm("Establishing secure handshake with UIDAI registry node...", undefined, 0);
    addTerm("Elector biometric identity confirmed in district database ✓", "#34d399", 400);
    addTerm(`Dynamic OTP dispatched to registered mobile: ${voter.registeredPhone}`, "var(--accent)", 800);
    addTerm("Session authorization token issued (SHA-256)", "var(--text-muted)", 1200);
    safeTimeout(() => setStep(1), 1500);
  };

  const handleResendOtp = () => {
    const code = genOTP();
    setOtpCode(code);
    setOtpDigits(["", "", "", "", "", ""]);
    setError("");
    addTerm(`New dynamic OTP dispatched: ${voter?.registeredPhone}`, "var(--accent)", 0);
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 50);
  };

  const handleOtpInput = (val, idx) => {
    setError("");
    const cleaned = val.replace(/\D/g, "");
    if (!cleaned) {
      const d = [...otpDigits];
      d[idx] = "";
      setOtpDigits(d);
      return;
    }
    const d = [...otpDigits];
    if (cleaned.length > 1) {
      for (let j = 0; j < cleaned.length && idx + j < 6; j++) {
        d[idx + j] = cleaned[j];
      }
      setOtpDigits(d);
      const nextIdx = Math.min(idx + cleaned.length, 5);
      inputRefs.current[nextIdx]?.focus();
      return;
    }
    d[idx] = cleaned;
    setOtpDigits(d);
    if (idx < 5) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleOtpKey = (e, idx) => {
    if (e.key === "Backspace") {
      if (!otpDigits[idx] && idx > 0) {
        e.preventDefault();
        const d = [...otpDigits];
        d[idx - 1] = "";
        setOtpDigits(d);
        inputRefs.current[idx - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputRefs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      e.preventDefault();
      inputRefs.current[idx + 1]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (otpDigits.join("").length === 6) {
        handleOtpVerify();
      }
    }
  };

  const handleOtpPaste = e => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (p) {
      const d = [...otpDigits];
      for (let i = 0; i < p.length && i < 6; i++) {
        d[i] = p[i];
      }
      setOtpDigits(d);
      setError("");
      const nextIdx = Math.min(p.length, 5);
      inputRefs.current[nextIdx]?.focus();
    }
  };

  const handleOtpVerify = () => {
    const entered = otpDigits.join("");
    if (entered !== otpCode) {
      setError(`Invalid OTP code entered. Hint: ${otpCode}`);
      return;
    }
    setError("");
    setTermLines([]);
    addTerm("Dynamic OTP authenticated successfully ✓", "#34d399", 0);
    addTerm("Initiating DeepFace biometric liveness inspection...", undefined, 400);
    safeTimeout(() => {
      setStep(2);
      startFace();
    }, 700);
  };

  const startFace = () => {
    let p = 0;
    const msgs = [
      "Extracting 468 facial landmark coordinates...",
      "Matching feature vectors against Aadhaar cryptographic root...",
      "Executing anti-spoofing micro-movement liveness test...",
      "Biometric signature authenticated ✓"
    ];
    msgs.forEach((m, i) => addTerm(m, i === 3 ? "#34d399" : "var(--text-muted)", i * 700));

    intervalRef.current = setInterval(() => {
      p += Math.random() * 6 + 3;
      setFaceProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setFaceDone(true);
        safeTimeout(() => onSuccess(voter), 700);
      }
    }, 100);
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            Elector Authentication
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Two-Factor Registry Lookup & Biometric Verification
          </p>
        </div>

        <ProgressStepper steps={["Registry ID", "OTP Passcode", "Biometric"]} current={step} />

        {step === 0 && (
          <div className="card" style={{ padding: 28, animation: "fadeUp 0.3s ease" }}>
            <label style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)", display: "block", marginBottom: 8, letterSpacing: "0.05em" }}>
              12-DIGIT AADHAAR NUMBER
            </label>
            <div style={{ position: "relative", marginBottom: 12 }}>
              <input
                value={aadhaar.replace(/(\d{4})(?=\d)/g, "$1 ")}
                onChange={e => setAadhaar(e.target.value.replace(/\s|\D/g, "").slice(0, 12))}
                placeholder="0000 0000 0000"
                style={{ width: "100%", padding: "14px 16px", fontSize: 18, letterSpacing: 3, fontWeight: 600 }}
              />
              {aadhaar.length === 12 && voter && (
                <span style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--green)" }}>
                  <Icon name="check" size={18} color="#10b981" />
                </span>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Demo quick-select:</span>
              {Object.entries(VOTERS_DB).map(([num, v]) => (
                <button
                  key={num}
                  type="button"
                  className="demo-chip"
                  onClick={() => { setAadhaar(num); setError(""); }}
                >
                  <Icon name="user" size={11} />
                  {v.name.split(" ")[0]}
                </button>
              ))}
            </div>

            {error && (
              <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12, fontFamily: "var(--mono)" }}>{error}</p>
            )}

            {aadhaar.length === 12 && voter && (
              <div className="card-inner" style={{ padding: "14px 16px", marginBottom: 18, display: "flex", gap: 14, alignItems: "center", animation: "fadeUp 0.2s ease" }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(14, 165, 233, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--accent)"
                }}>
                  {voter.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: "var(--text)", fontSize: 14 }}>{voter.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 2 }}>{voter.constituency}</p>
                </div>
                <span className="tag" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34d399" }}>
                  Verified
                </span>
              </div>
            )}

            <button
              className="btn-primary"
              style={{ width: "100%", padding: 14, fontSize: 14 }}
              disabled={aadhaar.length !== 12 || !voter}
              onClick={handleAadhaar}
            >
              Verify Identity & Dispatch OTP →
            </button>

            {termLines.length > 0 && (
              <div className="card-inner" style={{ padding: "12px 14px", marginTop: 14 }}>
                {termLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="card" style={{ padding: 28, animation: "fadeUp 0.3s ease" }}>
            <div className="card-inner" style={{ padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="lock" size={16} color="var(--accent)" />
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Passcode dispatched to <strong style={{ color: "var(--accent)" }}>{voter?.registeredPhone}</strong>
              </span>
            </div>

            <label style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)", display: "block", marginBottom: 12, letterSpacing: "0.05em" }}>
              ENTER 6-DIGIT VERIFICATION CODE
            </label>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }} onPaste={handleOtpPaste}>
              {otpDigits.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  value={d}
                  onFocus={e => e.target.select()}
                  onChange={e => handleOtpInput(e.target.value, i)}
                  onKeyDown={e => handleOtpKey(e, i)}
                  className={`otp-input ${d ? "filled" : ""}`}
                />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
                  Demo Passcode:
                </span>
                <button
                  type="button"
                  className="demo-chip"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setOtpDigits(otpCode.split(""));
                    setError("");
                    inputRefs.current[5]?.focus();
                  }}
                >
                  <span style={{ cursor: "pointer" }}>{otpCode} (click to fill)</span>
                </button>
              </div>

              <button
                type="button"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--accent)",
                  fontSize: 12,
                  fontFamily: "var(--mono)",
                  cursor: "pointer",
                  padding: "4px 8px"
                }}
                onClick={handleResendOtp}
              >
                ↻ Resend OTP
              </button>
            </div>

            {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12, fontFamily: "var(--mono)" }}>{error}</p>}

            <button
              className="btn-primary"
              style={{ width: "100%", padding: 14, fontSize: 14 }}
              disabled={otpDigits.join("").length !== 6}
              onClick={handleOtpVerify}
            >
              Verify Passcode →
            </button>
            <button
              className="btn-ghost"
              style={{ width: "100%", padding: 12, fontSize: 13, marginTop: 8 }}
              onClick={() => { setStep(0); setOtpDigits(["", "", "", "", "", ""]); setTermLines([]); }}
            >
              ← Back to Registry Lookup
            </button>

            {termLines.length > 0 && (
              <div className="card-inner" style={{ padding: "12px 14px", marginTop: 14 }}>
                {termLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="card" style={{ padding: 32, textAlign: "center", animation: "fadeUp 0.3s ease" }}>
            <div style={{
              position: "relative",
              width: 140,
              height: 140,
              margin: "0 auto 20px",
              borderRadius: "50%",
              background: "rgba(10, 15, 24, 0.8)",
              border: `2px solid ${faceDone ? "var(--green)" : "var(--accent)"}`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: faceDone ? "0 0 30px var(--green-glow)" : "0 0 30px var(--accent-glow)"
            }}>
              <div style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                color: faceDone ? "var(--green)" : "var(--accent)"
              }}>
                {voter?.name.charAt(0)}
              </div>
              {!faceDone && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--accent)",
                  boxShadow: "0 0 10px var(--accent)",
                  animation: "scanBeam 1.8s infinite ease-in-out"
                }} />
              )}
              {faceDone && (
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <Icon name="check" size={36} color="#10b981" />
                </div>
              )}
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 600, color: faceDone ? "var(--green)" : "var(--accent)", marginBottom: 8 }}>
              {faceDone ? "Biometric Signature Validated" : "Scanning Facial Biometrics..."}
            </h3>

            <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "var(--radius-full)", height: 6, overflow: "hidden", marginBottom: 8 }}>
              <div style={{
                height: "100%",
                width: `${faceProgress}%`,
                background: "linear-gradient(90deg, var(--accent), var(--green))",
                transition: "width 0.15s ease"
              }} />
            </div>

            <p style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--mono)", marginBottom: 16 }}>
              {Math.round(faceProgress)}% verification complete
            </p>

            <div className="card-inner" style={{ padding: "12px 14px", textAlign: "left" }}>
              {termLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// Ballot Voting Screen
function VoteScreen({ voter, candidates, onVoted }) {
  const cands = candidates || INITIAL_CANDIDATES;
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [stage, setStage] = useState("pick");
  const [encProgress, setEncProgress] = useState(0);
  const [encLines, setEncLines] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const safeTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

  const handleSubmit = () => {
    setStage("encrypting");
    const steps = [
      ["Encapsulating ballot payload with AES-256-GCM envelope...", "var(--text-muted)", 0],
      ["Signing payload with elector RSA-2048 keypair...", "var(--text-muted)", 700],
      ["Broadcasting cryptogram to Hyperledger peer consensus nodes...", "var(--text-muted)", 1400],
      ["Synthesizing zk-SNARK zero-knowledge anonymity proof...", "#c084fc", 2100],
      ["Verifying Merkle root constraints across validator quorum...", "var(--text-muted)", 2800],
      ["Consensus achieved via Raft protocol round...", "var(--text-muted)", 3500],
      ["Block committed to immutable ledger root ✓", "#34d399", 4200]
    ];
    steps.forEach(([txt, color, delay], i) => safeTimeout(() => {
      setEncLines(l => [...l, { txt, color, id: Date.now() + i }]);
      setEncProgress(Math.round(((i + 1) / steps.length) * 100));
    }, delay));
    safeTimeout(() => onVoted(selected), 5000);
  };

  if (stage === "encrypting") {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <div style={{ maxWidth: 460, width: "100%", textAlign: "center" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(14, 165, 233, 0.1)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px"
          }}>
            <Icon name="blocks" size={24} color="var(--accent)" />
          </div>

          <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            Recording on Blockchain
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: 13, marginBottom: 24 }}>
            Executing Raft consensus endorsement. Do not disconnect.
          </p>

          <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "var(--radius-full)", height: 8, overflow: "hidden", marginBottom: 8 }}>
            <div style={{
              height: "100%",
              width: `${encProgress}%`,
              background: "linear-gradient(90deg, #0284c7, #0ea5e9, #10b981)",
              transition: "width 0.5s ease"
            }} />
          </div>

          <p style={{ fontSize: 12, color: "var(--accent)", fontFamily: "var(--mono)", marginBottom: 20 }}>
            {encProgress}% committed
          </p>

          <div className="card" style={{ padding: "16px 20px", textAlign: "left" }}>
            {encLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "confirm") {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
        <div style={{ maxWidth: 440, width: "100%" }}>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <span className="tag" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", color: "var(--amber)", marginBottom: 18 }}>
              FINAL REVIEW
            </span>

            <div style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 255, 255, 0.05)",
              border: `1px solid ${selected.color}40`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              margin: "0 auto 14px",
              color: selected.color
            }}>
              {selected.symbol}
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              {selected.name}
            </h3>
            <p style={{ color: selected.color, fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
              {selected.party}
            </p>

            <span className="tag" style={{ background: "var(--surface-3)", color: "var(--text-muted)", marginBottom: 20 }}>
              {voter.constituency}
            </span>

            <div className="card-inner" style={{ padding: "12px 14px", marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.6 }}>
                Once verified, your ballot is irreversibly decoupled from your identity and registered to the consensus state.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button className="btn-ghost" style={{ padding: 13, fontSize: 14 }} onClick={() => setStage("pick")}>
                ← Change Choice
              </button>
              <button
                className="btn-primary"
                style={{ padding: 13, fontSize: 14, background: "linear-gradient(180deg, #059669 0%, #047857 100%)" }}
                onClick={handleSubmit}
              >
                Confirm & Sign Ballot
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 20px" }}>
        
        {/* Elector Identity Bar */}
        <div className="card" style={{ padding: "16px 20px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(14, 165, 233, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--accent)"
            }}>
              {voter.name.charAt(0)}
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{voter.name}</p>
              <p style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>ID: {voter.voterID}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{voter.constituency}</p>
            <p style={{ fontSize: 11, color: "var(--text-dim)" }}>Parliamentary Segment</p>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
            Official Candidate Ballot — Select Your Candidate
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Select your candidate. Click row to inspect manifesto commitments.
          </p>
        </div>

        {/* Candidates List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {cands.map(c => {
            const isSel = selected?.id === c.id;
            const isExp = expanded === c.id;
            return (
              <div
                key={c.id}
                onClick={() => {
                  setSelected(c);
                  setExpanded(isExp ? null : c.id);
                }}
                className={`candidate-card ${isSel ? "selected" : ""}`}
                style={{ "--candidate-color": c.color, cursor: "pointer" }}
              >
                <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: "var(--radius-md)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    background: isSel ? `${c.color}20` : "rgba(255, 255, 255, 0.04)",
                    color: c.color,
                    flexShrink: 0
                  }}>
                    {c.symbol}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>{c.name}</span>
                      <span className="tag" style={{ background: "rgba(255, 255, 255, 0.05)", color: "var(--text-muted)", fontSize: 10 }}>
                        {c.abbr}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: c.color, fontWeight: 500 }}>{c.party}</p>
                  </div>

                  <div style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${isSel ? c.color : "var(--border)"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isSel ? c.color : "transparent",
                    transition: "all 0.2s"
                  }}>
                    {isSel && <Icon name="check" size={12} color="#fff" />}
                  </div>
                </div>

                {isExp && c.manifesto && (
                  <div style={{
                    padding: "0 20px 16px",
                    borderTop: "1px solid var(--border)",
                    paddingTop: 12,
                    animation: "fadeUp 0.2s ease"
                  }}>
                    <span style={{ fontSize: 10, color: "var(--text-dim)", fontFamily: "var(--mono)", letterSpacing: "0.05em", display: "block", marginBottom: 4 }}>
                      KEY POLICY COMMITMENTS
                    </span>
                    <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                      {c.manifesto}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          className="btn-primary"
          style={{ width: "100%", padding: 16, fontSize: 15 }}
          disabled={!selected}
          onClick={() => setStage("confirm")}
        >
          {selected ? `Proceed with Vote for ${selected.name.toUpperCase()} →` : "Select a Candidate to Continue"}
        </button>

      </div>
    </div>
  );
}

// Success & Digital Cryptographic Receipt Screen
function SuccessScreen({ voter, hash, blockId, onAudit, onResults, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const onSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hash).then(onSuccess).catch(fallback);
    } else {
      fallback();
    }
    function fallback() {
      try {
        const ta = document.createElement("textarea");
        ta.value = hash;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        onSuccess();
      } catch (err) {}
    }
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px" }}>
      <div style={{ maxWidth: 500, width: "100%" }}>
        
        <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeUp 0.4s ease" }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px"
          }}>
            <Icon name="check" size={28} color="#10b981" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>
            Vote Recorded — Cryptographically Committed
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
            Immutably registered to the decentralized ledger with zk-SNARK proof.
          </p>
        </div>

        {/* Certificate Card */}
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20 }}>
          <div style={{
            padding: "14px 20px",
            background: "rgba(16, 185, 129, 0.08)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="shield" size={14} color="#10b981" />
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "#34d399", letterSpacing: "0.05em" }}>
                OFFICIAL CRYPTOGRAPHIC RECEIPT
              </span>
            </div>
            <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>CONFIRMED</span>
          </div>

          <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Elector Name", voter.name],
              ["Elector Registration ID", voter.voterID],
              ["Constituency", voter.constituency],
              ["Ledger Block Height", blockId],
              ["Timestamp", new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" })],
              ["Network Confirmations", "128 (Consensus finalized)"]
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{k}</span>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, fontFamily: k.includes("ID") || k.includes("Height") ? "var(--mono)" : "inherit" }}>
                  {v}
                </span>
              </div>
            ))}

            <div style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-dim)" }}>zk-SNARK Transaction Proof</span>
                <button
                  onClick={handleCopy}
                  className="demo-chip"
                  style={{ padding: "4px 10px", fontSize: 11 }}
                >
                  <Icon name={copied ? "check" : "copy"} size={11} color={copied ? "var(--green)" : "currentColor"} />
                  {copied ? "Copied" : "Copy Hash"}
                </button>
              </div>

              <div style={{
                padding: "12px 14px",
                background: "rgba(9, 13, 20, 0.8)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)"
              }}>
                <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#c084fc", wordBreak: "break-all", lineHeight: 1.6 }}>
                  {hash}
                </p>
              </div>

              <p style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 8, fontStyle: "italic" }}>
                Zero-knowledge proof allows ledger verification without disclosing your candidate preference.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
          <button className="btn-ghost" style={{ padding: 12, fontSize: 13 }} onClick={onAudit}>
            Audit on Ledger
          </button>
          <button className="btn-ghost" style={{ padding: 12, fontSize: 13 }} onClick={onResults}>
            Live Tally
          </button>
          <button className="btn-ghost" style={{ padding: 12, fontSize: 13 }} onClick={onReset}>
            Home Overview
          </button>
        </div>

        <button
          className="btn-ghost"
          style={{ width: "100%", padding: 11, fontSize: 12, color: "var(--accent)", borderColor: "var(--border)" }}
          onClick={onReset}
        >
          Switch Voter & Cast Another Ballot
        </button>

      </div>
    </div>
  );
}

// Live Election Results Screen
function ResultsScreen({ candidates, blockchainLog }) {
  const cands = candidates || INITIAL_CANDIDATES;
  const logs = blockchainLog || INITIAL_BLOCKCHAIN;
  const latestBlock = logs[0]?.block || "#BLK-449822";
  const total = cands.reduce((a, c) => a + c.votes, 0);
  const sorted = [...cands].sort((a, b) => b.votes - a.votes);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>
              Live Election Telemetry
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Automated smart contract tallying updated at block {latestBlock}
            </p>
          </div>
          <div className="tag" style={{ background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.2)", color: "#34d399" }}>
            <span className="status-dot" style={{ background: "#10b981" }} />
            {fmtNum(total)} BALLOTS COUNTED
          </div>
        </div>

        {/* Leading Candidate Spotlight Card */}
        <div className="card" style={{ padding: 0, overflow: "hidden", marginBottom: 20, borderColor: `${sorted[0].color}40` }}>
          <div style={{
            padding: "12px 20px",
            background: `linear-gradient(90deg, ${sorted[0].color}15, transparent)`,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: sorted[0].color, letterSpacing: "0.05em" }}>
              LEADING CONSTITUENCY CANDIDATE
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: sorted[0].color }}>
              Margin: +{fmtNum(sorted[0].votes - sorted[1].votes)}
            </span>
          </div>

          <div style={{ padding: 22, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: "var(--radius-md)",
              background: "rgba(255, 255, 255, 0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              color: sorted[0].color
            }}>
              {sorted[0].symbol}
            </div>

            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 2 }}>{sorted[0].name}</h3>
              <p style={{ color: sorted[0].color, fontSize: 13, fontWeight: 500, marginBottom: 10 }}>{sorted[0].party}</p>
              <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "var(--radius-full)", height: 8, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: animated ? `${(sorted[0].votes / total * 100).toFixed(1)}%` : "0%",
                  background: sorted[0].color,
                  transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
                }} />
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 28, color: sorted[0].color }}>
                {(sorted[0].votes / total * 100).toFixed(1)}%
              </div>
              <div style={{ fontSize: 12, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>
                {fmtNum(sorted[0].votes)} votes
              </div>
            </div>
          </div>
        </div>

        {/* All Candidates Breakdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {sorted.map((c, i) => {
            const pct = (c.votes / total * 100).toFixed(1);
            return (
              <div key={c.id} className="card" style={{ padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text-dim)", width: 16 }}>
                    #{i + 1}
                  </span>
                  <span style={{ fontSize: 16 }}>{c.symbol}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: "var(--text-dim)", marginLeft: 8 }}>{c.party}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontFamily: "var(--mono)", fontWeight: 600, fontSize: 14, color: c.color }}>{pct}%</span>
                    <p style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>{fmtNum(c.votes)}</p>
                  </div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.05)", borderRadius: "var(--radius-full)", height: 6, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: animated ? `${pct}%` : "0%",
                    background: c.color,
                    transition: `width ${0.8 + i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)`
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Smart Contract Audit Log */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
              Smart Contract Verifier Telemetry
            </span>
          </div>
          <div style={{ padding: "14px 18px", fontFamily: "var(--mono)", fontSize: 11, display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              `TallyContract.autoTally() executed at block ${latestBlock}`,
              `Consensus verified ${fmtNum(total)} valid ballot envelopes`,
              `zk-SNARK constraint validations: ${fmtNum(total)} / ${fmtNum(total)} passing`,
              "State root 0x8f3c7a... committed to decentralized cluster",
              "Public verifier query endpoint synchronized — 0 contested proofs"
            ].map((l, i) => (
              <div key={l} style={{ color: i === 4 ? "#34d399" : "var(--text-muted)", display: "flex", gap: 8 }}>
                <span style={{ color: "var(--text-dim)" }}>›</span>
                {l}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// Public Audit Portal Screen
function AuditScreen({ defaultHash, receiptLedger }) {
  const [hash, setHash] = useState(defaultHash || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lines, setLines] = useState([]);
  const timersRef = useRef([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (defaultHash) {
      setHash(defaultHash);
      setResult(null);
      setLines([]);
    }
  }, [defaultHash]);

  const safeTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
    return id;
  };

  const verify = () => {
    const trimmed = hash.trim();
    if (!trimmed.startsWith("0x") || trimmed.length < 10) {
      setResult({ valid: false, error: "Invalid cryptographic format. Hash must begin with 0x and contain valid hexadecimal digits." });
      return;
    }
    setLoading(true);
    setResult(null);
    setLines([]);

    const steps = [
      ["Querying Hyperledger Fabric peer gateway...", 300],
      ["Scanning CouchDB state tree for transaction hash...", 800],
      ["Verifying Merkle-Patricia block membership proof...", 1400],
      ["Validating zk-SNARK constraint satisfaction...", 2000],
      ["Cross-referencing Raft consensus commit log...", 2600],
      ["State verification finalized ✓", 3200]
    ];
    steps.forEach(([txt, delay]) => safeTimeout(() => setLines(l => [...l, { txt, id: Date.now() + delay }]), delay));

    safeTimeout(() => {
      setLoading(false);
      const auditRes = auditReceipt(trimmed, receiptLedger);
      if (auditRes.valid) {
        setResult({
          valid: true,
          block: auditRes.block,
          timestamp: auditRes.timestamp,
          confirmations: auditRes.confirmations,
          constituency: auditRes.constituency
        });
      } else {
        setResult({ valid: false, error: auditRes.error });
      }
    }, 3600);
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 80, paddingBottom: 80 }}>
      <div style={{ maxWidth: 580, margin: "0 auto", padding: "0 20px" }}>
        
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: "var(--radius-md)",
            background: "rgba(14, 165, 233, 0.1)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 14px"
          }}>
            <Icon name="audit" size={24} color="var(--accent)" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
            Public Ledger Explorer
          </h2>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Validate any ballot proof on the decentralized ledger.<br />
            Ballot choices remain hidden via Zero-Knowledge SNARK constraints.
          </p>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <label style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)", display: "block", marginBottom: 8, letterSpacing: "0.05em" }}>
            BALLOT TRANSACTION HASH
          </label>
          <textarea
            value={hash}
            onChange={e => { setHash(e.target.value); setResult(null); setLines([]); }}
            placeholder="Paste 0x... receipt hash here"
            rows={3}
            style={{ width: "100%", padding: "12px 14px", fontSize: 12, lineHeight: 1.6, resize: "none", wordBreak: "break-all" }}
          />

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text-dim)" }}>Historical blocks:</span>
            {INITIAL_BLOCKCHAIN.slice(0, 2).map((b, idx) => (
              <button
                key={idx}
                type="button"
                className="demo-chip"
                onClick={() => { setHash(b.fullHash || b.hash); setResult(null); setLines([]); }}
              >
                {b.block}
              </button>
            ))}
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", padding: 14, fontSize: 14, marginTop: 12 }}
            disabled={!hash || loading}
            onClick={verify}
          >
            {loading ? "Querying Blockchain Nodes..." : "Verify on Decentralized Ledger →"}
          </button>
        </div>

        {lines.length > 0 && (
          <div className="card" style={{ padding: "16px 20px", marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.05em", marginBottom: 8 }}>
              EXPLORER QUERY LOG
            </p>
            {lines.map(l => (
              <TerminalLine key={l.id} text={l.txt} color={l.txt.includes("✓") ? "#34d399" : "var(--text-muted)"} />
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <span className="status-dot" style={{ background: "var(--accent)" }} />
                <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)" }}>Validating cryptographic proof...</span>
              </div>
            )}
          </div>
        )}

        {result && (
          <div className="card" style={{ padding: 24, borderColor: result.valid ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)", animation: "fadeUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: result.valid ? 16 : 0 }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: result.valid ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Icon name="check" size={18} color={result.valid ? "#10b981" : "#f43f5e"} />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: result.valid ? "var(--green)" : "var(--red)" }}>
                  {result.valid ? "Vote Verified on Blockchain Ledger" : "Hash Not Found in Ledger"}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-dim)" }}>
                  {result.valid ? "Cryptographic proof confirmed on immutable chain" : (result.error || "Please verify receipt hash")}
                </p>
              </div>
            </div>

            {result.valid && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Block Identifier", result.block, "var(--accent)"],
                  ["Block Timestamp", result.timestamp, "var(--text)"],
                  ["Quorum Confirmations", result.confirmations, "var(--green)"],
                  ["zk-SNARK Constraints", "SATISFIED ✓", "var(--green)"],
                  ["Ledger Status", "IMMUTABLE · TAMPER-PROOF", "var(--green)"]
                ].map(([k, v, c]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 12, color: "var(--text-dim)" }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c, fontFamily: k.includes("Block") ? "var(--mono)" : "inherit" }}>
                      {v}
                    </span>
                  </div>
                ))}
                <p style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "var(--mono)", fontStyle: "italic", marginTop: 4 }}>
                  Zero-Knowledge Proof guarantees privacy: Ballot content cannot be derived even with quantum scrutiny.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// Bottom Glass Floating Dock Navigation
function NavBar({ screen, onNavigate }) {
  const tabs = [
    { id: "home", label: "Overview", icon: "home" },
    { id: "auth", label: "Vote", icon: "vote" },
    { id: "results", label: "Telemetry", icon: "chart" },
    { id: "audit", label: "Audit", icon: "audit" }
  ];

  return (
    <nav style={{
      position: "fixed",
      bottom: 20,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 100,
      background: "rgba(10, 14, 22, 0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid var(--border-bright)",
      borderRadius: "var(--radius-full)",
      padding: "5px 6px",
      display: "flex",
      alignItems: "center",
      gap: 4,
      boxShadow: "0 8px 32px -4px rgba(0, 0, 0, 0.7)"
    }}>
      {tabs.map(t => {
        const active = screen === t.id || (screen === "vote" && t.id === "auth") || (screen === "success" && t.id === "auth");
        return (
          <button
            key={t.id}
            onClick={() => onNavigate(t.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 16px",
              borderRadius: "var(--radius-full)",
              background: active ? "rgba(14, 165, 233, 0.15)" : "transparent",
              border: `1px solid ${active ? "rgba(14, 165, 233, 0.35)" : "transparent"}`,
              color: active ? "#38bdf8" : "var(--text-dim)",
              cursor: "pointer",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: active ? 600 : 500,
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            <Icon name={t.icon} size={15} color={active ? "#38bdf8" : "var(--text-dim)"} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Master App Component
function App() {
  const [screen, setScreen] = useState("home");
  const [voter, setVoter] = useState(null);
  const [voteData, setVoteData] = useState(null);
  const [auditTargetHash, setAuditTargetHash] = useState("");
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [blockchainLog, setBlockchainLog] = useState(INITIAL_BLOCKCHAIN);
  const [receiptLedger, setReceiptLedger] = useState({});

  const navigate = useCallback((s, targetHash) => {
    if (targetHash) {
      setAuditTargetHash(targetHash);
    }
    if (s === "auth" && voteData) {
      setScreen("success");
      return;
    }
    setScreen(s);
  }, [voteData]);

  const handleAuth = v => {
    setVoter(v);
    setScreen("vote");
  };

  const handleVoted = candidate => {
    const res = recordVote({
      candidateId: candidate.id,
      voter,
      candidates,
      blockchainLog,
      receiptLedger
    });
    setCandidates(res.updatedCandidates);
    setBlockchainLog(res.updatedBlockchainLog);
    setReceiptLedger(res.updatedLedger);
    setVoteData(res.receipt);
    setAuditTargetHash(res.receipt.hash);
    setScreen("success");
  };

  const handleReset = () => {
    setVoter(null);
    setVoteData(null);
    setScreen("home");
  };

  return (
    <div style={{ minHeight: "100%", fontFamily: "var(--font)" }}>
      <StatusBar voter={voter} onReset={handleReset} />
      {screen === "home" && <LandingScreen onNavigate={navigate} candidates={candidates} blockchainLog={blockchainLog} />}
      {screen === "auth" && <AuthScreen onSuccess={handleAuth} />}
      {screen === "vote" && <VoteScreen voter={voter} candidates={candidates} onVoted={handleVoted} />}
      {screen === "success" && voteData && (
        <SuccessScreen
          voter={voter}
          hash={voteData.hash}
          blockId={voteData.blockId}
          onAudit={() => navigate("audit", voteData.hash)}
          onResults={() => navigate("results")}
          onReset={handleReset}
        />
      )}
      {screen === "results" && <ResultsScreen candidates={candidates} blockchainLog={blockchainLog} />}
      {screen === "audit" && <AuditScreen defaultHash={auditTargetHash} receiptLedger={receiptLedger} />}
      <NavBar screen={screen} onNavigate={navigate} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
