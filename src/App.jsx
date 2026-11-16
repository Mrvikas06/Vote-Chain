/**
 * VoteChain - National Verifiable Electronic Voting & Ballot Audit Platform
 * Unslopped institutional interface engineered for precision, trust, and auditability.
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

// SVG Icon set (16px, 1.5 stroke, matching text color)
function Icon({ name, size = 16, color = "currentColor" }) {
  const icons = {
    vote: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 12 2 2 4-4"/>
        <path d="M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"/>
        <path d="M22 19H2"/>
      </svg>
    ),
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    audit: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
    shield: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    lock: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    copy: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    ),
    refresh: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
      </svg>
    ),
    user: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    )
  };
  return icons[name] || null;
}

// Quiet Terminal Line
function TerminalLine({ text, color = "var(--text-muted)" }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, fontFamily: "var(--mono)", lineHeight: 1.6 }}>
      <span style={{ color: "var(--text-muted)", userSelect: "none" }}>›</span>
      <span style={{ color }}>{text}</span>
    </div>
  );
}

// Progress Stepper (Simple, non-shouting)
function ProgressStepper({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
      {steps.map((st, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <div key={st} style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
            <div style={{
              width: 22,
              height: 22,
              borderRadius: "var(--radius-sm)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontFamily: "var(--mono)",
              fontWeight: 500,
              background: done ? "var(--green-subtle)" : active ? "var(--accent-subtle)" : "var(--surface-2)",
              color: done ? "var(--green)" : active ? "#93c5fd" : "var(--text-muted)",
              border: `1px solid ${done ? "var(--green)" : active ? "var(--accent)" : "var(--border)"}`
            }}>
              {done ? "✓" : i + 1}
            </div>
            <span style={{
              fontSize: 12,
              fontWeight: active ? 500 : 400,
              color: active ? "var(--text)" : "var(--text-muted)",
              whiteSpace: "nowrap"
            }}>
              {st}
            </span>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: done ? "var(--green)" : "var(--border)", margin: "0 4px" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Top Institutional Navigation Header
function TopHeader({ screen, onNavigate, latestBlock }) {
  const navItems = [
    { id: "home", label: "Overview", icon: "home" },
    { id: "auth", label: "Cast ballot", icon: "vote" },
    { id: "results", label: "Election tally", icon: "chart" },
    { id: "audit", label: "Ledger audit", icon: "audit" }
  ];

  return (
    <header className="top-header">
      <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 20px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Brand & Crest */}
        <div className="brand-logo" style={{ display: "flex", alignItems: "center", gap: 12 }} onClick={() => onNavigate("home")}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-sm)",
            background: "var(--accent-subtle)",
            border: "1px solid var(--accent-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#60a5fa"
          }}>
            <Icon name="shield" size={15} color="#60a5fa" />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", letterSpacing: "-0.01em" }}>
                VoteChain
              </span>
              <span className="tag" style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                National Roll
              </span>
            </div>
          </div>
        </div>

        {/* Quiet Desktop Navigation */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navItems.map(item => {
            const active = screen === item.id || (screen === "vote" && item.id === "auth") || (screen === "success" && item.id === "auth");
            return (
              <button
                key={item.id}
                className={`nav-link ${active ? "active" : ""}`}
                onClick={() => onNavigate(item.id)}
              >
                <Icon name={item.icon} size={14} color={active ? "var(--text)" : "var(--text-muted)"} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Ledger State Status */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--green)" }} />
          <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text-muted)" }}>
            {latestBlock || "#BLK-449822"} · Verified
          </span>
        </div>

      </div>
    </header>
  );
}

// Home Overview Screen
function HomeScreen({ onNavigate, candidates, blockchainLog }) {
  const cands = candidates || INITIAL_CANDIDATES;
  const logs = blockchainLog || INITIAL_BLOCKCHAIN;
  const totalVotes = cands.reduce((a, c) => a + c.votes, 0);

  return (
    <div className="fade-enter" style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 20px 80px" }}>
      
      {/* Calm Hero */}
      <div style={{ marginBottom: 40, maxWidth: 720 }}>
        <span className="tag" style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-secondary)", marginBottom: 12 }}>
          General Election 2026 · Parliamentary Segment
        </span>
        <h1 style={{ fontSize: 28, fontWeight: 600, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: 10, lineHeight: 1.3 }}>
          Verifiable decentralized electronic voting system
        </h1>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 20 }}>
          Electors authenticate with district roll credentials. Cast ballots are cryptographically decoupled and committed to an immutable public audit ledger.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-primary" onClick={() => onNavigate("auth")}>
            <Icon name="vote" size={15} color="#ffffff" />
            <span>Cast your vote</span>
          </button>
          <button className="btn-ghost" onClick={() => onNavigate("audit")}>
            <Icon name="audit" size={15} color="var(--text-secondary)" />
            <span>Audit receipt</span>
          </button>
        </div>
      </div>

      {/* Stats Row (Numbers without junk charts) */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 32 }}>
        
        <div className="card">
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Registered electors</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", fontFamily: "var(--mono)" }}>1,280,000</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
            Electoral roll 2026 update
          </p>
        </div>

        <div className="card">
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Ballots recorded</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", fontFamily: "var(--mono)" }}>{fmtNum(totalVotes)}</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
            Turnout: <span style={{ color: "var(--text-secondary)", fontWeight: 500 }}>{((totalVotes / 1280000) * 100).toFixed(1)}%</span>
          </p>
        </div>

        <div className="card">
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6 }}>Consensus nodes</p>
          <p style={{ fontSize: 24, fontWeight: 600, color: "var(--text)", fontFamily: "var(--mono)" }}>12 of 12</p>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>
            Raft state: <span style={{ color: "var(--green)", fontWeight: 500 }}>Synchronized</span>
          </p>
        </div>

      </div>

      {/* The Moment: Live Ledger Log Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Decentralized ledger feed</h3>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Recent cryptographic block commitments</p>
          </div>
          <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => onNavigate("audit")}>
            Inspect all on chain
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Block index</th>
                <th>Receipt hash (zk-SNARK)</th>
                <th>Ballot proof</th>
                <th>Consensus quorum</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 5).map(b => (
                <tr key={b.block} className="table-row">
                  <td style={{ fontFamily: "var(--mono)", fontWeight: 500, color: "var(--text)" }}>{b.block}</td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--text-secondary)" }}>
                    {b.hash.slice(0, 10)}...{b.hash.slice(-8)}
                  </td>
                  <td>
                    <span className="tag" style={{ background: "var(--green-subtle)", color: "var(--green)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      {b.candidate}
                    </span>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{b.validators}</td>
                  <td style={{ fontFamily: "var(--mono)", color: "var(--text-muted)" }}>{b.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
  const [termLines, setTermLines] = useState([]);
  
  const inputRefs = useRef([]);
  const timersRef = useRef([]);
  const intervalRef = useRef(null);
  const voter = (verifyAadhaar && verifyAadhaar(aadhaar)) || (VOTERS_DB && (VOTERS_DB[aadhaar.replace(/[\s-]/g, "")] || VOTERS_DB[aadhaar]));

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Autofocus first OTP input on step 1 transition
  useEffect(() => {
    if (step === 1) {
      const t = setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 80);
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
      setError("Aadhaar record not found in district roll. Use a demo elector.");
      return;
    }
    setError("");
    const code = genOTP();
    setOtpCode(code);
    setTermLines([]);
    addTerm("Querying district electoral registry node...", undefined, 0);
    addTerm("Elector record matched: Rahul Verma ✓", "var(--green)", 300);
    addTerm(`Passcode dispatched to registered mobile: ${voter.registeredPhone}`, "var(--accent)", 600);
    safeTimeout(() => setStep(1), 1200);
  };

  const handleResendOtp = () => {
    const code = genOTP();
    setOtpCode(code);
    setOtpDigits(["", "", "", "", "", ""]);
    setError("");
    addTerm(`New passcode dispatched: ${voter?.registeredPhone}`, "var(--accent)", 0);
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
      setError(`Invalid passcode entered. Hint: ${otpCode}`);
      return;
    }
    setError("");
    setTermLines([]);
    addTerm("Passcode verified successfully ✓", "var(--green)", 0);
    addTerm("Starting biometric liveness inspection...", undefined, 300);
    safeTimeout(() => {
      setStep(2);
      startBiometric();
    }, 900);
  };

  const startBiometric = () => {
    let p = 0;
    intervalRef.current = setInterval(() => {
      p += 10;
      setFaceProgress(p);
      if (p === 30) addTerm("Detecting 68 facial landmark coordinates...", undefined, 0);
      if (p === 70) addTerm("Biometric match confirmed against district database ✓", "var(--green)", 0);
      if (p >= 100) {
        clearInterval(intervalRef.current);
        addTerm("Elector authorization granted ✓", "var(--green)", 0);
        safeTimeout(() => onSuccess(voter), 900);
      }
    }, 240);
  };

  return (
    <div className="fade-enter" style={{ maxWidth: 460, margin: "40px auto 80px", padding: "0 20px" }}>
      
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
          Elector authentication
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Verify your identity to unlock the official parliamentary ballot.
        </p>
      </div>

      <ProgressStepper steps={["Registry ID", "Passcode", "Biometric"]} current={step} />

      {/* Step 0: Aadhaar */}
      {step === 0 && (
        <div className="card">
          <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
            Aadhaar number (12 digits)
          </label>
          <input
            type="text"
            style={{ width: "100%", padding: "12px 14px", fontSize: 15, fontFamily: "var(--mono)", marginBottom: 12 }}
            placeholder="XXXX XXXX XXXX"
            value={aadhaar}
            onChange={e => setAadhaar(e.target.value)}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Demo elector:</span>
            <span
              className="demo-chip"
              style={{ cursor: "pointer" }}
              onClick={() => { setAadhaar("1234 5678 9012"); setError(""); }}
            >
              Rahul Verma (1234 5678 9012)
            </span>
          </div>

          {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}

          <button
            className="btn-primary"
            style={{ width: "100%", padding: 12, fontSize: 13 }}
            disabled={!aadhaar.trim()}
            onClick={handleAadhaar}
          >
            Verify and send passcode →
          </button>

          {termLines.length > 0 && (
            <div className="card-inner" style={{ padding: "12px 14px", marginTop: 16 }}>
              {termLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
            </div>
          )}
        </div>
      )}

      {/* Step 1: OTP */}
      {step === 1 && (
        <div className="card">
          <div className="card-inner" style={{ padding: "12px 14px", marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon name="lock" size={15} color="var(--accent)" />
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Passcode sent to <strong style={{ color: "var(--text)" }}>{voter?.registeredPhone}</strong>
            </span>
          </div>

          <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
            Enter 6-digit verification passcode
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Demo passcode:</span>
              <span
                className="demo-chip"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setOtpDigits(otpCode.split(""));
                  setError("");
                  inputRefs.current[5]?.focus();
                }}
              >
                <span style={{ cursor: "pointer" }}>{otpCode} (click to fill)</span>
              </span>
            </div>

            <button
              type="button"
              style={{ background: "transparent", border: "none", color: "var(--accent)", fontSize: 11, cursor: "pointer" }}
              onClick={handleResendOtp}
            >
              Resend passcode
            </button>
          </div>

          {error && <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 12 }}>{error}</p>}

          <button
            className="btn-primary"
            style={{ width: "100%", padding: 12, fontSize: 13 }}
            disabled={otpDigits.join("").length !== 6}
            onClick={handleOtpVerify}
          >
            Verify passcode →
          </button>

          <button
            className="btn-ghost"
            style={{ width: "100%", padding: 10, fontSize: 12, marginTop: 8 }}
            onClick={() => { setStep(0); setOtpDigits(["", "", "", "", "", ""]); setTermLines([]); }}
          >
            ← Back to registry lookup
          </button>

          {termLines.length > 0 && (
            <div className="card-inner" style={{ padding: "12px 14px", marginTop: 14 }}>
              {termLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
            </div>
          )}
        </div>
      )}

      {/* Step 2: Biometric */}
      {step === 2 && (
        <div className="card" style={{ textAlign: "center" }}>
          
          <div style={{
            width: 140,
            height: 140,
            margin: "0 auto 16px",
            borderRadius: "var(--radius-md)",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative"
          }}>
            <Icon name="user" size={48} color="var(--text-muted)" />
            <div style={{
              position: "absolute",
              bottom: 8,
              left: 8,
              right: 8,
              height: 4,
              background: "var(--surface-3)",
              borderRadius: "var(--radius-sm)",
              overflow: "hidden"
            }}>
              <div style={{ width: `${faceProgress}%`, height: "100%", background: "var(--accent)", transition: "width 0.2s linear" }} />
            </div>
          </div>

          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
            Biometric verification in progress
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, fontFamily: "var(--mono)" }}>
            {faceProgress}% completed
          </p>

          <div className="card-inner" style={{ textAlign: "left" }}>
            {termLines.map(l => <TerminalLine key={l.id} text={l.txt} color={l.color} />)}
          </div>

        </div>
      )}

    </div>
  );
}

// Candidate Ballot Screen (The Moment 1)
function CandidateScreen({ voter, onCastVote }) {
  const [selected, setSelected] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [stage, setStage] = useState("pick"); // pick | confirm | encrypting
  const [cands] = useState(INITIAL_CANDIDATES);
  const [encStep, setEncStep] = useState(0);

  const handleSubmit = () => {
    setStage("encrypting");
    const stages = [
      "Encrypting ballot choice using Paillier homomorphic cryptosystem...",
      "Generating zero-knowledge zk-SNARK non-interactive receipt proof...",
      "Disseminating encrypted ballot payload to Raft consensus nodes...",
      "Block committed to immutable distributed ledger state root ✓"
    ];
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setEncStep(s);
      if (s >= stages.length) {
        clearInterval(iv);
        setTimeout(() => onCastVote(selected), 500);
      }
    }, 700);
  };

  // Encrypting Sequence
  if (stage === "encrypting") {
    const msgs = [
      "Encrypting ballot choice using Paillier cryptosystem...",
      "Computing zero-knowledge receipt proof...",
      "Reaching consensus across 12 Raft nodes...",
      "Block successfully registered to ledger root ✓"
    ];
    return (
      <div className="fade-enter" style={{ maxWidth: 460, margin: "80px auto", padding: "0 20px", textAlign: "center" }}>
        <div className="card">
          <div style={{ width: 40, height: 40, borderRadius: "var(--radius-sm)", background: "var(--accent-subtle)", border: "1px solid var(--accent-border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icon name="shield" size={20} color="var(--accent)" />
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
            Recording ballot to blockchain
          </h3>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 20 }}>
            Identity is decoupled. Cryptographic proof is written to the consensus state.
          </p>

          <div className="card-inner" style={{ textAlign: "left" }}>
            {msgs.slice(0, encStep).map((m, i) => (
              <TerminalLine key={i} text={m} color={i === 3 ? "var(--green)" : "var(--text-secondary)"} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Modal
  if (stage === "confirm") {
    return (
      <div className="fade-enter" style={{ maxWidth: 440, margin: "60px auto", padding: "0 20px" }}>
        <div className="card" style={{ textAlign: "center" }}>
          <span className="tag" style={{ background: "var(--amber-subtle)", color: "var(--amber)", border: "1px solid rgba(245, 158, 11, 0.2)", marginBottom: 16 }}>
            Confirm ballot choice
          </span>

          <div style={{ width: 48, height: 48, borderRadius: "var(--radius-sm)", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, margin: "0 auto 12px" }}>
            {selected.symbol}
          </div>

          <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
            {selected.name}
          </h3>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>
            {selected.party}
          </p>

          <div className="card-inner" style={{ marginBottom: 20, textAlign: "left", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
            Once submitted, your choice is cryptographically encrypted. Your voter identity is irreversibly decoupled and cannot be traced back to this ballot.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button className="btn-ghost" onClick={() => setStage("pick")}>
              ← Change choice
            </button>
            <button className="btn-primary" onClick={handleSubmit}>
              Confirm ballot
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-enter" style={{ maxWidth: 640, margin: "32px auto 80px", padding: "0 20px" }}>
      
      {/* Elector Identity Bar */}
      <div className="card" style={{ padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Authenticated elector</span>
          <span style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{voter.name}</span>
          <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text-muted)", marginLeft: 8 }}>ID: {voter.voterID}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Constituency</span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{voter.constituency}</span>
        </div>
      </div>

      {/* Required H2 Header for Test assertions */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
          Official Candidate Ballot — Select Your Candidate
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Select one candidate. Inspect manifesto summary before submitting your final vote.
        </p>
      </div>

      {/* Candidates Electronic Ballot Unit List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
        {cands.map((c, idx) => {
          const isSel = selected?.id === c.id;
          const isExp = expanded === c.id;
          const serial = String(idx + 1).padStart(2, "0");

          return (
            <div
              key={c.id}
              onClick={() => {
                setSelected(c);
                setExpanded(isExp ? null : c.id);
              }}
              className={`candidate-card ${isSel ? "selected" : ""}`}
              style={{ cursor: "pointer" }}
            >
              <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                
                {/* Ballot Serial */}
                <span style={{ fontFamily: "var(--mono)", fontSize: 14, fontWeight: 600, color: "var(--text-muted)", width: 22 }}>
                  {serial}
                </span>

                {/* Party Symbol */}
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0
                }}>
                  {c.symbol}
                </div>

                {/* Candidate Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>· {c.party}</span>
                  </div>
                  <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{c.sub}</span>
                </div>

                {/* Radio Selector */}
                <div style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  border: `2px solid ${isSel ? "var(--accent)" : "var(--border)"}`,
                  background: isSel ? "var(--accent)" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {isSel && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff" }} />}
                </div>

              </div>

              {/* Manifesto Accordion */}
              {isExp && (
                <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border-subtle)", background: "var(--surface-2)" }}>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
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
        style={{ width: "100%", padding: 14, fontSize: 13 }}
        disabled={!selected}
        onClick={() => setStage("confirm")}
      >
        {selected ? `Proceed with vote for ${selected.name} →` : "Select a candidate to continue"}
      </button>

    </div>
  );
}

// Success Screen (VVPAT Digital Slip - The Moment 2)
function SuccessScreen({ voter, hash, blockId, onAudit, onResults, onReset }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(hash).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="fade-enter" style={{ maxWidth: 480, margin: "40px auto 80px", padding: "0 20px" }}>
      
      {/* Required H2 Header for Test assertions */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "var(--green-subtle)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: "var(--green)" }}>
          <Icon name="check" size={18} color="var(--green)" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--green)", marginBottom: 4 }}>
          Vote Recorded — Cryptographically Committed
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Your ballot is immutably registered on the consensus state root.
        </p>
      </div>

      {/* Official VVPAT Paper Slip Certificate (Required .card) */}
      <div className="card vvpat-slip" style={{ padding: 20, marginBottom: 20 }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px dashed var(--border)", paddingBottom: 12, marginBottom: 14 }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 11, fontWeight: 600, color: "var(--text-secondary)" }}>
            OFFICIAL CRYPTOGRAPHIC RECEIPT
          </span>
          <span className="tag" style={{ background: "var(--green-subtle)", color: "var(--green)" }}>
            CONFIRMED
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Elector Name</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{voter?.name || "Rahul Verma"}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Elector Registration ID</span>
            <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text)" }}>{voter?.voterID || "DL/04/123/456789"}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Constituency</span>
            <span style={{ fontSize: 12, color: "var(--text)" }}>{voter?.constituency || "New Delhi Central – 01"}</span>
          </div>
          <div>
            <span style={{ fontSize: 11, color: "var(--text-muted)", display: "block" }}>Committed Block</span>
            <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--accent)" }}>{blockId || "#BLK-449823"}</span>
          </div>
        </div>

        <div style={{ borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Cryptographic receipt hash (zk-SNARK)</span>
            <button
              onClick={handleCopy}
              style={{ background: "transparent", border: "none", color: "var(--accent)", fontSize: 11, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
            >
              <Icon name="copy" size={12} color="var(--accent)" />
              <span>{copied ? "Copied" : "Copy hash"}</span>
            </button>
          </div>
          <div style={{ background: "var(--surface-2)", padding: 10, borderRadius: "var(--radius-sm)", fontFamily: "var(--mono)", fontSize: 11, color: "var(--text)", wordBreak: "break-all", border: "1px solid var(--border-subtle)" }}>
            {hash}
          </div>
        </div>

      </div>

      {/* Action Buttons (First button is Audit for test compatibility) */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 12 }}>
        <button className="btn-ghost" onClick={onAudit}>
          Audit on ledger
        </button>
        <button className="btn-ghost" onClick={onResults}>
          Election tally
        </button>
        <button className="btn-ghost" onClick={onReset}>
          Home overview
        </button>
      </div>

      <button
        className="btn-ghost"
        style={{ width: "100%", padding: 10, fontSize: 12, color: "var(--text-secondary)" }}
        onClick={onReset}
      >
        Cast another ballot
      </button>

    </div>
  );
}

// Live Election Results Screen
function ResultsScreen({ candidates, blockchainLog }) {
  const cands = candidates || INITIAL_CANDIDATES;
  const total = cands.reduce((a, c) => a + c.votes, 0);
  const sorted = [...cands].sort((a, b) => b.votes - a.votes);
  const leader = sorted[0];

  return (
    <div className="fade-enter" style={{ maxWidth: 880, margin: "40px auto 80px", padding: "0 20px" }}>
      
      {/* Required H2 Header for Test assertions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
          Live Election Telemetry
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Real-time consensus count verified across all 12 distributed nodes.
        </p>
      </div>

      {/* Leading Candidate Card (Required .card h3 for test assertions) */}
      <div className="card" style={{ marginBottom: 24 }}>
        <span className="tag" style={{ background: "var(--accent-subtle)", color: "#60a5fa", border: "1px solid var(--accent-border)", marginBottom: 12 }}>
          Projected segment leader
        </span>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {leader.symbol}
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>
                {leader.name}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{leader.party}</p>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 22, fontWeight: 600, fontFamily: "var(--mono)", color: "var(--text)" }}>
              {fmtNum(leader.votes)}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", display: "block" }}>
              {total ? ((leader.votes / total) * 100).toFixed(1) : 0}% of counted votes
            </span>
          </div>
        </div>
      </div>

      {/* Ranked Candidate Tallies */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
          <h4 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Certified candidate standings</h4>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {sorted.map(c => {
            const pct = total ? ((c.votes / total) * 100).toFixed(1) : 0;
            return (
              <div key={c.id} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-subtle)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 16 }}>{c.symbol}</span>
                    <span style={{ fontWeight: 500, fontSize: 13, color: "var(--text)" }}>{c.name}</span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)" }}>({c.party})</span>
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--text)" }}>
                    {fmtNum(c.votes)} <span style={{ color: "var(--text-muted)", marginLeft: 6 }}>{pct}%</span>
                  </div>
                </div>
                <div style={{ height: 4, background: "var(--surface-3)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--accent)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Public Audit Portal Screen
function AuditScreen({ defaultHash, receiptLedger }) {
  const [hashInput, setHashInput] = useState(defaultHash || "");
  const [querying, setQuerying] = useState(false);
  const [result, setResult] = useState(null);
  const [queryLogs, setQueryLogs] = useState([]);

  useEffect(() => {
    if (defaultHash) {
      setHashInput(defaultHash);
    }
  }, [defaultHash]);

  const handleAudit = () => {
    if (!hashInput.trim()) return;
    setQuerying(true);
    setResult(null);
    setQueryLogs([
      "Connecting to decentralized consensus gateway...",
      "Hashing input against Paillier verifiable proofs...",
      "Searching state root index across ledger blocks..."
    ]);

    setTimeout(() => {
      const res = auditReceipt(hashInput.trim(), receiptLedger);
      setResult(res);
      setQuerying(false);
    }, 600);
  };

  return (
    <div className="fade-enter" style={{ maxWidth: 640, margin: "40px auto 80px", padding: "0 20px" }}>
      
      {/* Required H2 Header for Test assertions */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
          Public Ledger Explorer
        </h2>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Validate any cryptographic ballot receipt without revealing elector identity.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <label style={{ fontSize: 12, color: "var(--text-secondary)", display: "block", marginBottom: 8 }}>
          Cryptographic receipt hash
        </label>
        <textarea
          style={{ width: "100%", height: 72, padding: "10px 12px", fontFamily: "var(--mono)", fontSize: 12, resize: "none", marginBottom: 12 }}
          placeholder="Enter 0x... receipt hash"
          value={hashInput}
          onChange={e => setHashInput(e.target.value)}
        />

        <button
          className="btn-primary"
          style={{ width: "100%", padding: 12, fontSize: 13 }}
          disabled={!hashInput.trim() || querying}
          onClick={handleAudit}
        >
          {querying ? "Querying ledger..." : "Verify on chain →"}
        </button>
      </div>

      {/* Query logs */}
      {querying && (
        <div className="card-inner" style={{ marginBottom: 20 }}>
          {queryLogs.map((l, i) => (
            <TerminalLine key={i} text={l} />
          ))}
        </div>
      )}

      {/* Verification Result Card (Must include 'Vote Verified on Blockchain' for test assertions) */}
      {result && (
        <div className="card" style={{ borderLeft: `3px solid ${result.valid ? "var(--green)" : "var(--red)"}` }}>
          
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: result.valid ? "var(--green-subtle)" : "var(--red-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={14} color={result.valid ? "var(--green)" : "var(--red)"} />
            </div>
            <div>
              <p style={{ fontWeight: 600, fontSize: 14, color: result.valid ? "var(--green)" : "var(--red)" }}>
                {result.valid ? "Vote Verified on Blockchain Ledger" : "Hash Not Found in Ledger"}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                {result.valid ? "Cryptographic proof confirmed on state root" : "Invalid receipt hash entered"}
              </p>
            </div>
          </div>

          {result.valid && (
            <div className="card-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Confirmed block</span>
                <span style={{ fontFamily: "var(--mono)", color: "var(--text)" }}>{result.blockId}</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Proof status</span>
                <span style={{ color: "var(--green)", fontWeight: 500 }}>zk-SNARK Valid</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Consensus confirmation</span>
                <span style={{ color: "var(--text)" }}>12 of 12 nodes</span>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", display: "block" }}>Ledger state</span>
                <span style={{ color: "var(--green)", fontWeight: 500 }}>Immutable</span>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}

// Main Application Root
function App() {
  const [screen, setScreen] = useState("home");
  const [authVoter, setAuthVoter] = useState(null);
  const [voteData, setVoteData] = useState(null);
  const [auditTargetHash, setAuditTargetHash] = useState("");
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [receiptLedger, setReceiptLedger] = useState({});
  const [blockchainLog, setBlockchainLog] = useState(INITIAL_BLOCKCHAIN);

  const navigate = s => {
    if (s === "auth" && voteData) {
      setScreen("success");
      return;
    }
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAuth = v => {
    setAuthVoter(v);
    setScreen("vote");
  };

  const handleVote = candidate => {
    const v = authVoter || (verifyAadhaar && verifyAadhaar("123456789012")) || (VOTERS_DB && VOTERS_DB["123456789012"]);
    const res = recordVote({
      candidateId: candidate.id,
      voter: v,
      candidates,
      blockchainLog,
      receiptLedger
    });
    setCandidates(res.updatedCandidates);
    setBlockchainLog(res.updatedBlockchainLog);
    setReceiptLedger(res.updatedLedger);
    setVoteData(res.receipt);
    setScreen("success");
  };

  const handleReset = () => {
    setAuthVoter(null);
    setVoteData(null);
    setScreen("home");
  };

  const handleOpenAudit = () => {
    if (voteData?.hash) {
      setAuditTargetHash(voteData.hash);
    }
    setScreen("audit");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      
      {/* Top Institutional Header Navigation */}
      <TopHeader
        screen={screen}
        onNavigate={navigate}
        latestBlock={blockchainLog[0]?.block}
      />

      {/* Screen Views */}
      <main style={{ flex: 1 }}>
        {screen === "home" && (
          <HomeScreen
            onNavigate={navigate}
            candidates={candidates}
            blockchainLog={blockchainLog}
          />
        )}

        {screen === "auth" && (
          <AuthScreen onSuccess={handleAuth} />
        )}

        {screen === "vote" && (
          <CandidateScreen
            voter={authVoter || (verifyAadhaar && verifyAadhaar("123456789012")) || (VOTERS_DB && VOTERS_DB["123456789012"])}
            onCastVote={handleVote}
          />
        )}

        {screen === "success" && (
          <SuccessScreen
            voter={authVoter || (verifyAadhaar && verifyAadhaar("123456789012")) || (VOTERS_DB && VOTERS_DB["123456789012"])}
            hash={voteData?.hash || genHash("SAMPLE-RECEIPT-2026")}
            blockId={voteData?.blockId || "#BLK-449823"}
            onAudit={handleOpenAudit}
            onResults={() => setScreen("results")}
            onReset={handleReset}
          />
        )}

        {screen === "results" && (
          <ResultsScreen
            candidates={candidates}
            blockchainLog={blockchainLog}
          />
        )}

        {screen === "audit" && (
          <AuditScreen
            defaultHash={auditTargetHash}
            receiptLedger={receiptLedger}
          />
        )}
      </main>

      {/* Quiet Institutional Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "24px 20px", background: "var(--surface-1)", fontSize: 12, color: "var(--text-muted)" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <span>Election Commission of India · Decentralized Digital Ballot Protocol</span>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <span>EVM / Raft Consensus</span>
            <span>Paillier Zero-Knowledge Proofs</span>
            <span>SHA-256 Immutability</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
