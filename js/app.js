(function () {
  const {
    useState,
    useEffect,
    useRef,
    useCallback
  } = React;
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
  function StatusBar({
    voter,
    onReset
  }) {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
      const t = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(t);
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        height: 52,
        background: "rgba(3,7,15,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 18,
        background: "linear-gradient(90deg,#0ea5e9,#06b6d4)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }
    }, "VoteChain"), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "#0c2a0c",
        border: "1px solid #14532d",
        color: "#4ade80"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "#4ade80"
      }
    }), "LIVE"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        display: "none"
      }
    }, "Hyperledger Fabric v2.5")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, voter && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text2)",
        fontFamily: "var(--mono)"
      }
    }, "\uD83D\uDC64 ", voter.name.split(" ")[0]), /*#__PURE__*/React.createElement("button", {
      onClick: onReset,
      style: {
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        color: "var(--text3)",
        borderRadius: 6,
        padding: "2px 8px",
        fontSize: 10,
        cursor: "pointer",
        fontFamily: "var(--mono)"
      }
    }, "Logout")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, time.toLocaleTimeString("en-IN")), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        color: "var(--text2)"
      }
    }, "\uD83D\uDD12 TLS 1.3")));
  }
  function ProgressStepper({
    steps,
    current
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        marginBottom: 28
      }
    }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: s,
      style: {
        display: "flex",
        alignItems: "center",
        flex: i < steps.length - 1 ? 1 : "auto"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        minWidth: 72
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        transition: "all 0.3s",
        background: i < current ? "var(--green)" : i === current ? "var(--accent)" : "var(--bg3)",
        border: `2px solid ${i < current ? "var(--green)" : i === current ? "var(--accent)" : "var(--border2)"}`,
        color: i <= current ? "#fff" : "var(--text3)",
        boxShadow: i === current ? "0 0 16px rgba(14,165,233,0.4)" : "none"
      }
    }, i < current ? "✓" : i + 1), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: i === current ? "var(--accent)" : i < current ? "var(--green)" : "var(--text3)",
        fontFamily: "var(--font)",
        fontWeight: 600,
        whiteSpace: "nowrap"
      }
    }, s)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        height: 2,
        background: i < current ? "var(--green)" : "var(--border)",
        margin: "0 4px",
        marginBottom: 20,
        transition: "background 0.3s"
      }
    }))));
  }
  function TerminalLine({
    text,
    color = "var(--text2)"
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        animation: "fadeUp 0.3s ease both",
        fontFamily: "var(--mono)",
        fontSize: 12,
        color,
        padding: "2px 0",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text3)"
      }
    }, "\u203A"), text);
  }
  function LandingScreen({
    onNavigate,
    candidates,
    blockchainLog
  }) {
    const cands = candidates || INITIAL_CANDIDATES;
    const logs = blockchainLog || INITIAL_BLOCKCHAIN;
    const total = cands.reduce((a, c) => a + c.votes, 0);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        background: "var(--bg)",
        position: "relative",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        backgroundImage: "linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px)",
        backgroundSize: "40px 40px"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        maxWidth: 960,
        margin: "0 auto",
        padding: "48px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 48,
        animation: "fadeUp 0.6s ease both"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tag",
      style: {
        background: "#0c2031",
        border: "1px solid var(--border2)",
        color: "var(--accent)",
        marginBottom: 20,
        fontSize: 12
      }
    }, "\uD83C\uDDEE\uD83C\uDDF3 India General Election 2026 \xB7 Constituency Voting Portal"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: "clamp(38px,7vw,76px)",
        lineHeight: 1.05,
        letterSpacing: -2,
        marginBottom: 16,
        color: "var(--text)"
      }
    }, "Secure. Transparent.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        background: "linear-gradient(90deg,#0ea5e9,#06b6d4,#10b981)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }
    }, "Democratic.")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 15,
        color: "var(--text2)",
        maxWidth: 500,
        margin: "0 auto 32px",
        lineHeight: 1.8
      }
    }, "Blockchain-secured e-voting powered by Hyperledger Fabric. Every vote is immutable, anonymous via zk-SNARKs, and publicly verifiable."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: () => onNavigate("auth"),
      style: {
        padding: "14px 32px",
        fontSize: 15
      }
    }, "\uD83D\uDDF3\uFE0F Cast Your Vote"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => onNavigate("audit"),
      style: {
        padding: "14px 22px",
        fontSize: 15
      }
    }, "\uD83D\uDD0D Verify Receipt"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => onNavigate("results"),
      style: {
        padding: "14px 22px",
        fontSize: 15
      }
    }, "\uD83D\uDCCA Live Results"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: 12,
        marginBottom: 36
      }
    }, [{
      label: "Eligible Voters",
      value: "97.2 Cr",
      icon: "👥",
      color: "#0ea5e9"
    }, {
      label: "Votes Cast",
      value: fmtNum(total),
      icon: "🗳️",
      color: "#10b981"
    }, {
      label: "Blocks Confirmed",
      value: fmtNum(449821 + Math.max(0, logs.length - INITIAL_BLOCKCHAIN.length)),
      icon: "⛓️",
      color: "#a78bfa"
    }, {
      label: "Turnout",
      value: (total / 1028300 * 100).toFixed(1) + "%",
      icon: "📈",
      color: "#f59e0b"
    }].map(s => /*#__PURE__*/React.createElement("div", {
      key: s.label,
      className: "card",
      style: {
        padding: "16px 18px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 20,
        marginBottom: 6
      }
    }, s.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 20,
        color: s.color,
        marginBottom: 2
      }
    }, s.value), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--text3)"
      }
    }, s.label)))), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 18px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "#4ade80"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 700,
        fontSize: 14,
        color: "var(--text)"
      }
    }, "Live Blockchain Feed"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        marginLeft: "auto"
      }
    }, "Hyperledger Fabric \xB7 Raft Consensus")), /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: "auto"
      }
    }, /*#__PURE__*/React.createElement("table", {
      style: {
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: "var(--mono)",
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
      style: {
        borderBottom: "1px solid var(--border)"
      }
    }, ["Block", "Hash", "Transactions", "Time", "Status", "Action"].map(h => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        padding: "10px 14px",
        textAlign: "left",
        color: "var(--text3)",
        fontWeight: 500
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, logs.map((b, i) => {
      const shortHash = b.hash.length > 18 ? b.hash.slice(0, 6) + "..." + b.hash.slice(-4) : b.hash;
      return /*#__PURE__*/React.createElement("tr", {
        key: b.block,
        style: {
          borderBottom: "1px solid var(--border)",
          animation: `chainAdd 0.4s ${i * 0.1}s ease both`
        }
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "11px 14px",
          color: "var(--accent)",
          fontWeight: 700
        }
      }, b.block), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "11px 14px",
          color: "var(--text2)"
        },
        title: b.fullHash || b.hash
      }, shortHash), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "11px 14px",
          color: "var(--text)"
        }
      }, fmtNum(b.tx)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "11px 14px",
          color: "var(--text3)"
        }
      }, b.time), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "11px 14px"
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "#0c2a0c",
          border: "1px solid #14532d",
          color: "#4ade80"
        }
      }, "\u2713 ", b.status)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "11px 14px"
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "demo-chip",
        onClick: () => onNavigate("audit", b.fullHash || b.hash),
        style: {
          padding: "2px 8px",
          fontSize: 10
        }
      }, "Audit")));
    }))))), /*#__PURE__*/React.createElement("p", {
      style: {
        textAlign: "center",
        marginTop: 16,
        fontSize: 12,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, "Demo: 123456789012 \xB7 987654321098 \xB7 456789012345")));
  }
  function AuthScreen({
    onSuccess
  }) {
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
    const safeTimeout = (fn, delay) => {
      const id = setTimeout(fn, delay);
      timersRef.current.push(id);
      return id;
    };
    const addTerm = (txt, color = "var(--text2)", delay = 0) => {
      safeTimeout(() => setTermLines(l => [...l, {
        txt,
        color,
        id: Date.now() + Math.random()
      }]), delay);
    };
    const handleAadhaar = () => {
      if (!voter) {
        setError("Aadhaar not found. Try: 123456789012");
        return;
      }
      setError("");
      const code = genOTP();
      setOtpCode(code);
      setTermLines([]);
      addTerm("› Connecting to UIDAI server…", undefined, 0);
      addTerm("› Aadhaar validated ✓", "#4ade80", 400);
      addTerm(`› OTP dispatched to ${voter.registeredPhone}`, "#0ea5e9", 800);
      addTerm("› Session token generated (SHA-256)", "var(--text2)", 1200);
      safeTimeout(() => setStep(1), 1500);
    };
    const handleOtpInput = (val, idx) => {
      const d = [...otpDigits];
      d[idx] = val.replace(/\D/, "").slice(-1);
      setOtpDigits(d);
      setError("");
      if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };
    const handleOtpKey = (e, idx) => {
      if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) inputRefs.current[idx - 1]?.focus();
    };
    const handleOtpPaste = e => {
      const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
      if (p.length === 6) {
        setOtpDigits(p.split(""));
        inputRefs.current[5]?.focus();
      }
      e.preventDefault();
    };
    const handleOtpVerify = () => {
      const entered = otpDigits.join("");
      if (entered !== otpCode) {
        setError(`Invalid OTP. Hint: ${otpCode}`);
        return;
      }
      setError("");
      setTermLines([]);
      addTerm("› OTP verified ✓", "#4ade80", 0);
      addTerm("› Initiating DeepFace biometric scan…", undefined, 400);
      safeTimeout(() => {
        setStep(2);
        startFace();
      }, 700);
    };
    const startFace = () => {
      let p = 0;
      const msgs = ["Detecting face landmarks…", "Cross-checking Aadhaar biometric DB…", "Anti-spoofing liveness check…", "Identity confirmed ✓"];
      msgs.forEach((m, i) => addTerm("› " + m, i === 3 ? "#4ade80" : "var(--text2)", i * 700));
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 20px 24px",
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        maxWidth: 500
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 26,
        color: "var(--text)",
        marginBottom: 6
      }
    }, "Voter Authentication"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text3)",
        fontSize: 13
      }
    }, "2-Factor \xB7 Aadhaar + OTP + DeepFace Biometric")), /*#__PURE__*/React.createElement(ProgressStepper, {
      steps: ["Aadhaar", "OTP", "Biometric"],
      current: step
    }), step === 0 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 24,
        animation: "fadeUp 0.4s ease both"
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        display: "block",
        marginBottom: 8,
        letterSpacing: 1
      }
    }, "AADHAAR NUMBER"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: aadhaar.replace(/(\d{4})(?=\d)/g, "$1 "),
      onChange: e => setAadhaar(e.target.value.replace(/\s|\D/g, "").slice(0, 12)),
      placeholder: "XXXX XXXX XXXX",
      style: {
        width: "100%",
        padding: "14px 16px",
        fontSize: 18,
        letterSpacing: 4
      }
    }), aadhaar.length === 12 && voter && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: 12,
        top: "50%",
        transform: "translateY(-50%)",
        color: "#4ade80",
        fontSize: 18
      }
    }, "\u2713")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, "Demo quick-fill:"), Object.entries(VOTERS_DB).map(([num, v]) => /*#__PURE__*/React.createElement("button", {
      key: num,
      type: "button",
      className: "demo-chip",
      onClick: () => {
        setAadhaar(num);
        setError("");
      }
    }, v.photo, " ", v.name.split(" ")[0]))), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--red)",
        fontSize: 12,
        marginBottom: 8,
        fontFamily: "var(--mono)"
      }
    }, error), aadhaar.length === 12 && voter && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginBottom: 12,
        display: "flex",
        gap: 12,
        alignItems: "center",
        animation: "fadeUp 0.3s ease"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26
      }
    }, voter.photo), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 700,
        color: "var(--text)",
        fontSize: 14
      }
    }, voter.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text3)",
        marginTop: 2
      }
    }, voter.constituency)), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "#0c2a0c",
        border: "1px solid #14532d",
        color: "#4ade80",
        marginLeft: "auto"
      }
    }, "Found")), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 13,
        fontSize: 14
      },
      disabled: aadhaar.length !== 12 || !voter,
      onClick: handleAadhaar
    }, "VERIFY & SEND OTP \u2192"), termLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginTop: 12
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))), step === 1 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 24,
        animation: "fadeUp 0.4s ease both"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "10px 14px",
        marginBottom: 18,
        display: "flex",
        gap: 8,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCF1"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text2)"
      }
    }, "OTP sent to ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--accent)"
      }
    }, voter?.registeredPhone))), /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        display: "block",
        marginBottom: 10,
        letterSpacing: 1
      }
    }, "ENTER 6-DIGIT OTP"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 8
      },
      onPaste: handleOtpPaste
    }, otpDigits.map((d, i) => /*#__PURE__*/React.createElement("input", {
      key: i,
      ref: el => inputRefs.current[i] = el,
      value: d,
      onChange: e => handleOtpInput(e.target.value, i),
      onKeyDown: e => handleOtpKey(e, i),
      style: {
        flex: 1,
        padding: "13px 0",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 700,
        borderRadius: 10,
        border: `2px solid ${d ? "var(--accent)" : "var(--border)"}`,
        background: "var(--bg1)",
        color: "var(--text)"
      },
      maxLength: 1
    }))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        marginBottom: 10
      }
    }, "\uD83D\uDCA1 Demo OTP: ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--accent)",
        cursor: "pointer",
        textDecoration: "underline"
      },
      onClick: () => setOtpDigits(otpCode.split(""))
    }, otpCode, " (click to fill)")), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--red)",
        fontSize: 12,
        marginBottom: 8,
        fontFamily: "var(--mono)"
      }
    }, error), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 13,
        fontSize: 14
      },
      disabled: otpDigits.join("").length !== 6,
      onClick: handleOtpVerify
    }, "VERIFY OTP \u2192"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        width: "100%",
        padding: 12,
        fontSize: 13,
        marginTop: 8
      },
      onClick: () => {
        setStep(0);
        setOtpDigits(["", "", "", "", "", ""]);
        setTermLines([]);
      }
    }, "\u2190 Back"), termLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginTop: 12
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))), step === 2 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 24,
        textAlign: "center",
        animation: "fadeUp 0.4s ease both"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: 130,
        height: 130,
        margin: "0 auto 16px",
        borderRadius: "50%",
        background: "var(--bg3)",
        border: `3px solid ${faceDone ? "var(--green)" : "var(--accent)"}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 58
      }
    }, voter?.photo), !faceDone && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        background: "var(--accent)",
        animation: "scanline 1.5s linear infinite"
      }
    }), faceDone && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(16,185,129,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36
      }
    }, "\u2713")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 700,
        fontSize: 15,
        color: faceDone ? "var(--green)" : "var(--accent)",
        marginBottom: 8
      }
    }, faceDone ? "Identity Verified ✓" : "Scanning Biometrics…"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--bg3)",
        borderRadius: 8,
        height: 6,
        overflow: "hidden",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${faceProgress}%`,
        background: "linear-gradient(90deg,var(--accent),var(--green))",
        transition: "width 0.15s"
      }
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        marginBottom: 12
      }
    }, Math.round(faceProgress), "% complete"), /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        textAlign: "left"
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    }))))));
  }
  function VoteScreen({
    voter,
    candidates,
    onVoted
  }) {
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
      const steps = [["Encrypting ballot with AES-256-GCM…", "var(--text2)", 0], ["Signing payload with RSA-2048…", "var(--text2)", 700], ["Establishing TLS 1.3 handshake…", "var(--text2)", 1400], ["Broadcasting to Hyperledger peer nodes…", "var(--text2)", 2100], ["Generating zk-SNARK anonymity proof…", "#a78bfa", 2800], ["Endorsing via Raft consensus…", "var(--text2)", 3500], ["Block confirmed on ledger ✓", "#4ade80", 4200]];
      steps.forEach(([txt, color, delay], i) => safeTimeout(() => {
        setEncLines(l => [...l, {
          txt,
          color,
          id: Date.now() + i
        }]);
        setEncProgress(Math.round((i + 1) / steps.length * 100));
      }, delay));
      safeTimeout(() => onVoted(selected), 5000);
    };
    if (stage === "encrypting") return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 20px 24px",
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 460,
        width: "100%",
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 42,
        marginBottom: 14,
        animation: "spin 2s linear infinite",
        display: "inline-block"
      }
    }, "\u26D3\uFE0F"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 21,
        color: "var(--text)",
        marginBottom: 6
      }
    }, "Recording on Blockchain"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text3)",
        fontSize: 13,
        marginBottom: 20
      }
    }, "Do not close this window"), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--bg3)",
        borderRadius: 8,
        height: 8,
        overflow: "hidden",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${encProgress}%`,
        background: "linear-gradient(90deg,#0369a1,#0ea5e9,#10b981)",
        transition: "width 0.6s ease",
        borderRadius: 8
      }
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--accent)",
        fontFamily: "var(--mono)",
        marginBottom: 18
      }
    }, encProgress, "%"), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: "14px 18px",
        textAlign: "left"
      }
    }, encLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))));
    if (stage === "confirm") return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 20px 24px",
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 420,
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 26,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        letterSpacing: 1,
        marginBottom: 14
      }
    }, "CONFIRM YOUR VOTE"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 48,
        marginBottom: 10
      }
    }, selected.symbol), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 21,
        color: "var(--text)",
        marginBottom: 4
      }
    }, selected.name), /*#__PURE__*/React.createElement("p", {
      style: {
        color: selected.color,
        fontSize: 14,
        marginBottom: 4
      }
    }, selected.party), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        color: "var(--text2)",
        marginBottom: 18,
        display: "inline-flex"
      }
    }, voter.constituency), /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "10px 14px",
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--red)",
        fontFamily: "var(--mono)"
      }
    }, "\u26A0 Irreversible once submitted to blockchain")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 12,
        fontSize: 14
      },
      onClick: () => setStage("pick")
    }, "\u2190 Change"), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        padding: 12,
        fontSize: 14,
        background: "linear-gradient(135deg,#065f46,#10b981)"
      },
      onClick: handleSubmit
    }, "\u2713 Confirm")))));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 640,
        margin: "0 auto",
        padding: "28px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: "14px 18px",
        marginBottom: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 24
      }
    }, voter.photo), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 700,
        fontSize: 14,
        color: "var(--text)"
      }
    }, voter.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, voter.voterID))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text2)"
      }
    }, voter.constituency), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text3)"
      }
    }, "General Election 2026"))), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 21,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Select Your Candidate"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text3)",
        marginBottom: 18
      }
    }, "Tap to expand \xB7 Your choice is encrypted end-to-end"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 20
      }
    }, cands.map(c => {
      const isSel = selected?.id === c.id,
        isExp = expanded === c.id;
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        onClick: () => {
          setSelected(c);
          setExpanded(isExp ? null : c.id);
        },
        style: {
          borderRadius: 14,
          border: `2px solid ${isSel ? c.color : "var(--border)"}`,
          background: isSel ? `${c.color}12` : "var(--bg2)",
          cursor: "pointer",
          transition: "all 0.2s",
          transform: isSel ? "scale(1.01)" : "scale(1)",
          boxShadow: isSel ? `0 4px 20px ${c.color}30` : "none",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "15px 18px",
          display: "flex",
          alignItems: "center",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 42,
          height: 42,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          background: isSel ? `${c.color}20` : "var(--bg3)",
          flexShrink: 0
        }
      }, c.symbol), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 2
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font)",
          fontWeight: 700,
          fontSize: 15,
          color: "var(--text)"
        }
      }, c.name), /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          color: "var(--text3)",
          fontSize: 10
        }
      }, c.abbr)), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: c.color
        }
      }, c.party)), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: `2px solid ${isSel ? c.color : "var(--border2)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isSel ? c.color : "transparent",
          flexShrink: 0
        }
      }, isSel && /*#__PURE__*/React.createElement("div", {
        style: {
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "white"
        }
      }))), isExp && c.manifesto && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "0 18px 14px",
          borderTop: "1px solid var(--border)",
          paddingTop: 12,
          animation: "fadeUp 0.2s ease"
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 11,
          color: "var(--text3)",
          fontFamily: "var(--mono)",
          marginBottom: 6,
          letterSpacing: 1
        }
      }, "MANIFESTO"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 13,
          color: "var(--text2)",
          lineHeight: 1.6
        }
      }, c.manifesto)));
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 15,
        fontSize: 15
      },
      disabled: !selected,
      onClick: () => setStage("confirm")
    }, selected ? `PROCEED WITH VOTE FOR ${selected.name.toUpperCase()} →` : "SELECT A CANDIDATE TO CONTINUE")));
  }
  function SuccessScreen({
    voter,
    hash,
    blockId,
    onAudit,
    onResults,
    onReset
  }) {
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 20px 24px",
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 480,
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 22,
        animation: "pop 0.5s ease both"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 60,
        marginBottom: 10
      }
    }, "\u2705"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 26,
        color: "var(--green)",
        marginBottom: 4
      }
    }, "Vote Recorded!"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text3)",
        fontSize: 14
      }
    }, "Immutably stored on Hyperledger Fabric blockchain.")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "11px 18px",
        background: "linear-gradient(90deg,#0c2a0c,#0a1525)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", null, "\uD83E\uDDFE"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--green)",
        letterSpacing: 2
      }
    }, "CRYPTOGRAPHIC VOTE RECEIPT")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, [["Voter Name", voter.name], ["Voter ID", voter.voterID], ["Constituency", voter.constituency], ["Block ID", blockId], ["Timestamp", new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium"
    })], ["Confirmations", "1 (propagating…)"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 8,
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text3)"
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text)",
        fontFamily: k === "Block ID" || k === "Voter ID" ? "var(--mono)" : "inherit",
        fontWeight: 600
      }
    }, v))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text3)"
      }
    }, "Vote Hash (zk-SNARK)"), /*#__PURE__*/React.createElement("button", {
      onClick: handleCopy,
      style: {
        padding: "3px 10px",
        borderRadius: 6,
        border: "1px solid var(--border2)",
        background: "transparent",
        color: copied ? "var(--green)" : "var(--text3)",
        cursor: "pointer",
        fontSize: 11,
        fontFamily: "var(--mono)"
      }
    }, copied ? "✓ Copied" : "Copy")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 12px",
        background: "var(--bg1)",
        borderRadius: 8,
        border: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "#a78bfa",
        wordBreak: "break-all",
        lineHeight: 1.6
      }
    }, hash)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        marginTop: 6,
        fontStyle: "italic"
      }
    }, "\uD83C\uDFAD Vote choice protected by zk-SNARKs \u2014 cannot be revealed even by officials.")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 8,
        marginBottom: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 11,
        fontSize: 13
      },
      onClick: onAudit
    }, "\uD83D\uDD0D Verify"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 11,
        fontSize: 13
      },
      onClick: onResults
    }, "\uD83D\uDCCA Results"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 11,
        fontSize: 13
      },
      onClick: onReset
    }, "\u2190 Home")), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        width: "100%",
        padding: 10,
        fontSize: 12,
        color: "var(--accent)",
        borderColor: "var(--border2)"
      },
      onClick: onReset
    }, "\uD83D\uDC64 Switch Voter & Cast Another Ballot")));
  }
  function ResultsScreen({
    candidates,
    blockchainLog
  }) {
    const cands = candidates || INITIAL_CANDIDATES;
    const logs = blockchainLog || INITIAL_BLOCKCHAIN;
    const latestBlock = logs[0]?.block || "#BLK-449822";
    const total = cands.reduce((a, c) => a + c.votes, 0);
    const sorted = [...cands].sort((a, b) => b.votes - a.votes);
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
      const t = setTimeout(() => setAnimated(true), 200);
      return () => clearTimeout(t);
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 660,
        margin: "0 auto",
        padding: "28px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 22,
        flexWrap: "wrap",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 24,
        color: "var(--text)",
        marginBottom: 2
      }
    }, "Live Election Results"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text3)"
      }
    }, "Auto-tallied by Smart Contracts \xB7 No manual counting")), /*#__PURE__*/React.createElement("div", {
      className: "tag",
      style: {
        background: "var(--bg3)",
        border: "1px solid var(--border2)",
        color: "var(--text2)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "#4ade80"
      }
    }), "LIVE \xB7 ", fmtNum(total), " counted")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden",
        marginBottom: 14,
        border: `1px solid ${sorted[0].color}40`,
        boxShadow: `0 0 28px ${sorted[0].color}12`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "10px 18px",
        background: `linear-gradient(90deg,${sorted[0].color}18,transparent)`,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDFC6"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: sorted[0].color,
        letterSpacing: 2
      }
    }, "LEADING CANDIDATE")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 18,
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 44
      }
    }, sorted[0].symbol), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 20,
        color: "var(--text)",
        marginBottom: 2
      }
    }, sorted[0].name), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sorted[0].color,
        fontSize: 13,
        marginBottom: 8
      }
    }, sorted[0].party), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--bg3)",
        borderRadius: 6,
        height: 10,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: animated ? `${(sorted[0].votes / total * 100).toFixed(1)}%` : "0%",
        background: `linear-gradient(90deg,${sorted[0].color},${sorted[0].color}80)`,
        transition: "width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
        borderRadius: 6
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 26,
        color: sorted[0].color
      }
    }, (sorted[0].votes / total * 100).toFixed(1), "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, fmtNum(sorted[0].votes))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 20
      }
    }, sorted.map((c, i) => {
      const pct = (c.votes / total * 100).toFixed(1);
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        className: "card",
        style: {
          padding: "14px 18px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--text3)",
          width: 14
        }
      }, "#", i + 1), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 18
        }
      }, c.symbol), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font)",
          fontWeight: 700,
          fontSize: 14,
          color: "var(--text)"
        }
      }, c.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: "var(--text3)",
          marginLeft: 8
        }
      }, c.party)), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "right"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--font)",
          fontWeight: 700,
          fontSize: 15,
          color: c.color
        }
      }, pct, "%"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 10,
          color: "var(--text3)",
          fontFamily: "var(--mono)"
        }
      }, fmtNum(c.votes)))), /*#__PURE__*/React.createElement("div", {
        style: {
          background: "var(--bg3)",
          borderRadius: 4,
          height: 5,
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          width: animated ? `${pct}%` : "0%",
          background: c.color,
          transition: `width ${1 + i * 0.1}s cubic-bezier(0.34,1.2,0.64,1)`,
          borderRadius: 4
        }
      })));
    })), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "11px 18px",
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 700,
        fontSize: 14,
        color: "var(--text)"
      }
    }, "Smart Contract Audit Log")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 16px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        display: "flex",
        flexDirection: "column",
        gap: 5
      }
    }, [`TallyContract.autoTally() executed at block ${latestBlock}`, `Chaincode verified ${fmtNum(total)} valid transactions`, `zk-SNARK proofs validated: ${fmtNum(total)} / ${fmtNum(total)}`, "Result hash: 0x8f3c...e1a4 committed to ledger", "Public verifier portal updated — 0 disputes"].map((l, i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        color: i === 4 ? "#4ade80" : "var(--text2)",
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text3)"
      }
    }, "\u203A"), l))))));
  }
  function AuditScreen({
    defaultHash,
    receiptLedger
  }) {
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
        setResult({
          valid: false,
          error: "Invalid hash format. Receipt hash must start with 0x and be at least 10 characters."
        });
        return;
      }
      setLoading(true);
      setResult(null);
      setLines([]);
      const steps = [["Connecting to Hyperledger Fabric gateway…", 300], ["Querying CouchDB state database…", 800], ["Retrieving block metadata…", 1400], ["Validating zk-SNARK proof…", 2000], ["Cross-checking Raft consensus log…", 2600], ["Verification complete ✓", 3200]];
      steps.forEach(([txt, delay]) => safeTimeout(() => setLines(l => [...l, {
        txt,
        id: Date.now() + delay
      }]), delay));
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
          setResult({
            valid: false,
            error: auditRes.error
          });
        }
      }, 3600);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 52,
        background: "var(--bg)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 540,
        margin: "0 auto",
        padding: "28px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        marginBottom: 8
      }
    }, "\uD83D\uDD0D"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 24,
        color: "var(--text)",
        marginBottom: 6
      }
    }, "Public Audit Portal"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text3)",
        lineHeight: 1.7
      }
    }, "Verify any vote on the public ledger.", /*#__PURE__*/React.createElement("br", null), "Vote choice stays hidden via zk-SNARK cryptography.")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 20,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        display: "block",
        marginBottom: 8,
        letterSpacing: 1
      }
    }, "VOTE RECEIPT HASH"), /*#__PURE__*/React.createElement("textarea", {
      value: hash,
      onChange: e => {
        setHash(e.target.value);
        setResult(null);
        setLines([]);
      },
      placeholder: "Paste your 0x... receipt hash here",
      rows: 3,
      style: {
        width: "100%",
        padding: "12px 14px",
        fontSize: 11,
        lineHeight: 1.7,
        resize: "none",
        wordBreak: "break-all"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginTop: 8,
        marginBottom: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, "Sample blocks:"), INITIAL_BLOCKCHAIN.slice(0, 2).map((b, idx) => /*#__PURE__*/React.createElement("button", {
      key: idx,
      type: "button",
      className: "demo-chip",
      onClick: () => {
        setHash(b.fullHash || b.hash);
        setResult(null);
        setLines([]);
      }
    }, b.block))), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 13,
        fontSize: 14,
        marginTop: 10
      },
      disabled: !hash || loading,
      onClick: verify
    }, loading ? "⛓️ Querying blockchain nodes…" : "VERIFY ON CHAIN →")), lines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: "14px 16px",
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--text3)",
        letterSpacing: 1,
        marginBottom: 8
      }
    }, "QUERY LOG"), lines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.txt.includes("✓") ? "#4ade80" : "var(--text2)"
    })), loading && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: "var(--accent)",
        animation: "blink 0.8s infinite"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)"
      }
    }, "processing\u2026"))), result && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 20,
        border: `1px solid ${result.valid ? "#14532d" : "#7f1d1d"}`,
        animation: "fadeUp 0.4s ease"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: result.valid ? 14 : 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 26
      }
    }, result.valid ? "✅" : "❌"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 700,
        fontSize: 15,
        color: result.valid ? "var(--green)" : "var(--red)"
      }
    }, result.valid ? "Vote Verified on Blockchain" : "Hash Not Found"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text3)"
      }
    }, result.valid ? "Your vote was counted correctly" : result.error || "Check the hash and try again"))), result.valid && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8
      }
    }, [["Block ID", result.block, "var(--accent)"], ["Timestamp", result.timestamp, "var(--text)"], ["Confirmations", result.confirmations, "var(--green)"], ["zk-SNARK Proof", "VALID ✓", "var(--green)"], ["Ledger Status", "IMMUTABLE · TAMPER-PROOF", "var(--green)"]].map(([k, v, c]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: "flex",
        justifyContent: "space-between",
        paddingBottom: 8,
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text3)"
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 700,
        color: c,
        fontFamily: k === "Block ID" ? "var(--mono)" : "inherit"
      }
    }, v))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text3)",
        fontFamily: "var(--mono)",
        fontStyle: "italic",
        marginTop: 4
      }
    }, "\uD83C\uDFAD Vote choice permanently protected \u2014 cannot be revealed even by election officials.")))));
  }
  function NavBar({
    screen,
    onNavigate
  }) {
    const tabs = [{
      id: "home",
      label: "Home",
      icon: "🏠"
    }, {
      id: "auth",
      label: "Vote",
      icon: "🗳️"
    }, {
      id: "results",
      label: "Results",
      icon: "📊"
    }, {
      id: "audit",
      label: "Audit",
      icon: "🔍"
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(3,7,15,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        height: 56
      }
    }, tabs.map(t => {
      const active = screen === t.id || screen === "vote" && t.id === "auth" || screen === "success" && t.id === "auth";
      return /*#__PURE__*/React.createElement("button", {
        key: t.id,
        onClick: () => onNavigate(t.id),
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: active ? "var(--accent)" : "var(--text3)",
          transition: "color 0.2s",
          fontFamily: "var(--font)",
          fontSize: 10,
          fontWeight: active ? 700 : 400
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 16
        }
      }, t.icon), t.label);
    }));
  }
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        paddingBottom: 56,
        fontFamily: "var(--font)"
      }
    }, /*#__PURE__*/React.createElement(StatusBar, {
      voter: voter,
      onReset: handleReset
    }), screen === "home" && /*#__PURE__*/React.createElement(LandingScreen, {
      onNavigate: navigate,
      candidates: candidates,
      blockchainLog: blockchainLog
    }), screen === "auth" && /*#__PURE__*/React.createElement(AuthScreen, {
      onSuccess: handleAuth
    }), screen === "vote" && /*#__PURE__*/React.createElement(VoteScreen, {
      voter: voter,
      candidates: candidates,
      onVoted: handleVoted
    }), screen === "success" && voteData && /*#__PURE__*/React.createElement(SuccessScreen, {
      voter: voter,
      hash: voteData.hash,
      blockId: voteData.blockId,
      onAudit: () => navigate("audit", voteData.hash),
      onResults: () => navigate("results"),
      onReset: handleReset
    }), screen === "results" && /*#__PURE__*/React.createElement(ResultsScreen, {
      candidates: candidates,
      blockchainLog: blockchainLog
    }), screen === "audit" && /*#__PURE__*/React.createElement(AuditScreen, {
      defaultHash: auditTargetHash,
      receiptLedger: receiptLedger
    }), /*#__PURE__*/React.createElement(NavBar, {
      screen: screen,
      onNavigate: navigate
    }));
  }
  ReactDOM.createRoot(document.getElementById("root")).render( /*#__PURE__*/React.createElement(App, null));
})();