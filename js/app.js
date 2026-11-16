(function () {
  /**
   * VoteChain - National Verifiable Electronic Voting & Ballot Audit Platform
   * Unslopped institutional interface engineered for precision, trust, and auditability.
   */

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

  // SVG Icon set (16px, 1.5 stroke, matching text color)
  function Icon({
    name,
    size = 16,
    color = "currentColor"
  }) {
    const icons = {
      vote: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "m9 12 2 2 4-4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M22 19H2"
      })),
      home: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
      }), /*#__PURE__*/React.createElement("polyline", {
        points: "9 22 9 12 15 12 15 22"
      })),
      chart: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("line", {
        x1: "18",
        y1: "20",
        x2: "18",
        y2: "10"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "12",
        y1: "20",
        x2: "12",
        y2: "4"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "6",
        y1: "20",
        x2: "6",
        y2: "14"
      })),
      audit: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
      }), /*#__PURE__*/React.createElement("line", {
        x1: "21",
        y1: "21",
        x2: "16.65",
        y2: "16.65"
      })),
      shield: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      })),
      check: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("polyline", {
        points: "20 6 9 17 4 12"
      })),
      lock: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "11",
        width: "18",
        height: "11",
        rx: "2",
        ry: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 11V7a5 5 0 0 1 10 0v4"
      })),
      copy: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "9",
        width: "13",
        height: "13",
        rx: "2",
        ry: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
      })),
      refresh: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"
      })),
      user: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "1.75",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "7",
        r: "4"
      }))
    };
    return icons[name] || null;
  }

  // Quiet Terminal Line
  function TerminalLine({
    text,
    color = "var(--text-muted)"
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        fontSize: 12,
        fontFamily: "var(--mono)",
        lineHeight: 1.6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        userSelect: "none"
      }
    }, "\u203A"), /*#__PURE__*/React.createElement("span", {
      style: {
        color
      }
    }, text));
  }

  // Progress Stepper (Simple, non-shouting)
  function ProgressStepper({
    steps,
    current
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 24
      }
    }, steps.map((st, i) => {
      const active = i === current;
      const done = i < current;
      return /*#__PURE__*/React.createElement("div", {
        key: st,
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
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
        }
      }, done ? "✓" : i + 1), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: active ? 500 : 400,
          color: active ? "var(--text)" : "var(--text-muted)",
          whiteSpace: "nowrap"
        }
      }, st), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          height: 1,
          background: done ? "var(--green)" : "var(--border)",
          margin: "0 4px"
        }
      }));
    }));
  }

  // Top Institutional Navigation Header
  function TopHeader({
    screen,
    onNavigate,
    latestBlock
  }) {
    const navItems = [{
      id: "home",
      label: "Overview",
      icon: "home"
    }, {
      id: "auth",
      label: "Cast ballot",
      icon: "vote"
    }, {
      id: "results",
      label: "Election tally",
      icon: "chart"
    }, {
      id: "audit",
      label: "Ledger audit",
      icon: "audit"
    }];
    return /*#__PURE__*/React.createElement("header", {
      className: "top-header"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1120,
        margin: "0 auto",
        padding: "0 20px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "brand-logo",
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      },
      onClick: () => onNavigate("home")
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: "var(--radius-sm)",
        background: "var(--accent-subtle)",
        border: "1px solid var(--accent-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#60a5fa"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 15,
      color: "#60a5fa"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: "var(--text)",
        letterSpacing: "-0.01em"
      }
    }, "VoteChain"), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--surface-2)",
        color: "var(--text-muted)",
        border: "1px solid var(--border)"
      }
    }, "National Roll")))), /*#__PURE__*/React.createElement("nav", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 4
      }
    }, navItems.map(item => {
      const active = screen === item.id || screen === "vote" && item.id === "auth" || screen === "success" && item.id === "auth";
      return /*#__PURE__*/React.createElement("button", {
        key: item.id,
        className: `nav-link ${active ? "active" : ""}`,
        onClick: () => onNavigate(item.id)
      }, /*#__PURE__*/React.createElement(Icon, {
        name: item.icon,
        size: 14,
        color: active ? "var(--text)" : "var(--text-muted)"
      }), /*#__PURE__*/React.createElement("span", null, item.label));
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "var(--green)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontFamily: "var(--mono)",
        color: "var(--text-muted)"
      }
    }, latestBlock || "#BLK-449822", " \xB7 Verified"))));
  }

  // Home Overview Screen
  function HomeScreen({
    onNavigate,
    candidates,
    blockchainLog
  }) {
    const cands = candidates || INITIAL_CANDIDATES;
    const logs = blockchainLog || INITIAL_BLOCKCHAIN;
    const totalVotes = cands.reduce((a, c) => a + c.votes, 0);
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-enter",
      style: {
        maxWidth: 1040,
        margin: "0 auto",
        padding: "40px 20px 80px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 40,
        maxWidth: 720
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        marginBottom: 12
      }
    }, "General Election 2026 \xB7 Parliamentary Segment"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: 28,
        fontWeight: 600,
        color: "var(--text)",
        letterSpacing: "-0.02em",
        marginBottom: 10,
        lineHeight: 1.3
      }
    }, "Verifiable decentralized electronic voting system"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 14,
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        marginBottom: 20
      }
    }, "Electors authenticate with district roll credentials. Cast ballots are cryptographically decoupled and committed to an immutable public audit ledger."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: () => onNavigate("auth")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "vote",
      size: 15,
      color: "#ffffff"
    }), /*#__PURE__*/React.createElement("span", null, "Cast your vote")), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => onNavigate("audit")
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "audit",
      size: 15,
      color: "var(--text-secondary)"
    }), /*#__PURE__*/React.createElement("span", null, "Audit receipt")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16,
        marginBottom: 32
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginBottom: 6
      }
    }, "Registered electors"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 24,
        fontWeight: 600,
        color: "var(--text)",
        fontFamily: "var(--mono)"
      }
    }, "1,280,000"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginTop: 6
      }
    }, "Electoral roll 2026 update")), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginBottom: 6
      }
    }, "Ballots recorded"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 24,
        fontWeight: 600,
        color: "var(--text)",
        fontFamily: "var(--mono)"
      }
    }, fmtNum(totalVotes)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginTop: 6
      }
    }, "Turnout: ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-secondary)",
        fontWeight: 500
      }
    }, (totalVotes / 1280000 * 100).toFixed(1), "%"))), /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginBottom: 6
      }
    }, "Consensus nodes"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 24,
        fontWeight: 600,
        color: "var(--text)",
        fontFamily: "var(--mono)"
      }
    }, "12 of 12"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginTop: 6
      }
    }, "Raft state: ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--green)",
        fontWeight: 500
      }
    }, "Synchronized")))), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text)"
      }
    }, "Decentralized ledger feed"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, "Recent cryptographic block commitments")), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: "6px 12px",
        fontSize: 12
      },
      onClick: () => onNavigate("audit")
    }, "Inspect all on chain")), /*#__PURE__*/React.createElement("div", {
      style: {
        overflowX: "auto"
      }
    }, /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Block index"), /*#__PURE__*/React.createElement("th", null, "Receipt hash (zk-SNARK)"), /*#__PURE__*/React.createElement("th", null, "Ballot proof"), /*#__PURE__*/React.createElement("th", null, "Consensus quorum"), /*#__PURE__*/React.createElement("th", null, "Timestamp"))), /*#__PURE__*/React.createElement("tbody", null, logs.slice(0, 5).map(b => /*#__PURE__*/React.createElement("tr", {
      key: b.block,
      className: "table-row"
    }, /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "var(--mono)",
        fontWeight: 500,
        color: "var(--text)"
      }
    }, b.block), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "var(--mono)",
        color: "var(--text-secondary)"
      }
    }, b.hash.slice(0, 10), "...", b.hash.slice(-8)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--green-subtle)",
        color: "var(--green)",
        border: "1px solid rgba(16, 185, 129, 0.2)"
      }
    }, b.candidate)), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "var(--mono)",
        color: "var(--text-muted)"
      }
    }, b.validators), /*#__PURE__*/React.createElement("td", {
      style: {
        fontFamily: "var(--mono)",
        color: "var(--text-muted)"
      }
    }, b.time))))))));
  }

  // Authentication Screen
  function AuthScreen({
    onSuccess
  }) {
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
    const voter = verifyAadhaar && verifyAadhaar(aadhaar) || VOTERS_DB && (VOTERS_DB[aadhaar.replace(/[\s-]/g, "")] || VOTERS_DB[aadhaar]);
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
      safeTimeout(() => setTermLines(l => [...l, {
        txt,
        color,
        id: Date.now() + Math.random()
      }]), delay);
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
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-enter",
      style: {
        maxWidth: 460,
        margin: "40px auto 80px",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24,
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 20,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Elector authentication"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Verify your identity to unlock the official parliamentary ballot.")), /*#__PURE__*/React.createElement(ProgressStepper, {
      steps: ["Registry ID", "Passcode", "Biometric"],
      current: step
    }), step === 0 && /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)",
        display: "block",
        marginBottom: 8
      }
    }, "Aadhaar number (12 digits)"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      style: {
        width: "100%",
        padding: "12px 14px",
        fontSize: 15,
        fontFamily: "var(--mono)",
        marginBottom: 12
      },
      placeholder: "XXXX XXXX XXXX",
      value: aadhaar,
      onChange: e => setAadhaar(e.target.value)
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)"
      }
    }, "Demo elector:"), /*#__PURE__*/React.createElement("span", {
      className: "demo-chip",
      style: {
        cursor: "pointer"
      },
      onClick: () => {
        setAadhaar("1234 5678 9012");
        setError("");
      }
    }, "Rahul Verma (1234 5678 9012)")), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--red)",
        fontSize: 12,
        marginBottom: 12
      }
    }, error), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 12,
        fontSize: 13
      },
      disabled: !aadhaar.trim(),
      onClick: handleAadhaar
    }, "Verify and send passcode \u2192"), termLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginTop: 16
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))), step === 1 && /*#__PURE__*/React.createElement("div", {
      className: "card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginBottom: 16,
        display: "flex",
        gap: 10,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 15,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)"
      }
    }, "Passcode sent to ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--text)"
      }
    }, voter?.registeredPhone))), /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)",
        display: "block",
        marginBottom: 10
      }
    }, "Enter 6-digit verification passcode"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 16
      },
      onPaste: handleOtpPaste
    }, otpDigits.map((d, i) => /*#__PURE__*/React.createElement("input", {
      key: i,
      ref: el => inputRefs.current[i] = el,
      type: "text",
      inputMode: "numeric",
      pattern: "[0-9]*",
      autoComplete: "one-time-code",
      value: d,
      onFocus: e => e.target.select(),
      onChange: e => handleOtpInput(e.target.value, i),
      onKeyDown: e => handleOtpKey(e, i),
      className: `otp-input ${d ? "filled" : ""}`
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)"
      }
    }, "Demo passcode:"), /*#__PURE__*/React.createElement("span", {
      className: "demo-chip",
      style: {
        cursor: "pointer"
      },
      onClick: () => {
        setOtpDigits(otpCode.split(""));
        setError("");
        inputRefs.current[5]?.focus();
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: "pointer"
      }
    }, otpCode, " (click to fill)"))), /*#__PURE__*/React.createElement("button", {
      type: "button",
      style: {
        background: "transparent",
        border: "none",
        color: "var(--accent)",
        fontSize: 11,
        cursor: "pointer"
      },
      onClick: handleResendOtp
    }, "Resend passcode")), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--red)",
        fontSize: 12,
        marginBottom: 12
      }
    }, error), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 12,
        fontSize: 13
      },
      disabled: otpDigits.join("").length !== 6,
      onClick: handleOtpVerify
    }, "Verify passcode \u2192"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        width: "100%",
        padding: 10,
        fontSize: 12,
        marginTop: 8
      },
      onClick: () => {
        setStep(0);
        setOtpDigits(["", "", "", "", "", ""]);
        setTermLines([]);
      }
    }, "\u2190 Back to registry lookup"), termLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginTop: 14
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))), step === 2 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 48,
      color: "var(--text-muted)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        bottom: 8,
        left: 8,
        right: 8,
        height: 4,
        background: "var(--surface-3)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: `${faceProgress}%`,
        height: "100%",
        background: "var(--accent)",
        transition: "width 0.2s linear"
      }
    }))), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Biometric verification in progress"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        marginBottom: 16,
        fontFamily: "var(--mono)"
      }
    }, faceProgress, "% completed"), /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        textAlign: "left"
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))));
  }

  // Candidate Ballot Screen (The Moment 1)
  function CandidateScreen({
    voter,
    onCastVote
  }) {
    const [selected, setSelected] = useState(null);
    const [expanded, setExpanded] = useState(null);
    const [stage, setStage] = useState("pick"); // pick | confirm | encrypting
    const [cands] = useState(INITIAL_CANDIDATES);
    const [encStep, setEncStep] = useState(0);
    const handleSubmit = () => {
      setStage("encrypting");
      const stages = ["Encrypting ballot choice using Paillier homomorphic cryptosystem...", "Generating zero-knowledge zk-SNARK non-interactive receipt proof...", "Disseminating encrypted ballot payload to Raft consensus nodes...", "Block committed to immutable distributed ledger state root ✓"];
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
      const msgs = ["Encrypting ballot choice using Paillier cryptosystem...", "Computing zero-knowledge receipt proof...", "Reaching consensus across 12 Raft nodes...", "Block successfully registered to ledger root ✓"];
      return /*#__PURE__*/React.createElement("div", {
        className: "fade-enter",
        style: {
          maxWidth: 460,
          margin: "80px auto",
          padding: "0 20px",
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "card"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 40,
          height: 40,
          borderRadius: "var(--radius-sm)",
          background: "var(--accent-subtle)",
          border: "1px solid var(--accent-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "shield",
        size: 20,
        color: "var(--accent)"
      })), /*#__PURE__*/React.createElement("h3", {
        style: {
          fontSize: 16,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: 4
        }
      }, "Recording ballot to blockchain"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 20
        }
      }, "Identity is decoupled. Cryptographic proof is written to the consensus state."), /*#__PURE__*/React.createElement("div", {
        className: "card-inner",
        style: {
          textAlign: "left"
        }
      }, msgs.slice(0, encStep).map((m, i) => /*#__PURE__*/React.createElement(TerminalLine, {
        key: i,
        text: m,
        color: i === 3 ? "var(--green)" : "var(--text-secondary)"
      })))));
    }

    // Confirmation Modal
    if (stage === "confirm") {
      return /*#__PURE__*/React.createElement("div", {
        className: "fade-enter",
        style: {
          maxWidth: 440,
          margin: "60px auto",
          padding: "0 20px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "card",
        style: {
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "var(--amber-subtle)",
          color: "var(--amber)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          marginBottom: 16
        }
      }, "Confirm ballot choice"), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 48,
          height: 48,
          borderRadius: "var(--radius-sm)",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          margin: "0 auto 12px"
        }
      }, selected.symbol), /*#__PURE__*/React.createElement("h3", {
        style: {
          fontSize: 18,
          fontWeight: 600,
          color: "var(--text)",
          marginBottom: 2
        }
      }, selected.name), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 13,
          color: "var(--text-secondary)",
          marginBottom: 12
        }
      }, selected.party), /*#__PURE__*/React.createElement("div", {
        className: "card-inner",
        style: {
          marginBottom: 20,
          textAlign: "left",
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.6
        }
      }, "Once submitted, your choice is cryptographically encrypted. Your voter identity is irreversibly decoupled and cannot be traced back to this ballot."), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn-ghost",
        onClick: () => setStage("pick")
      }, "\u2190 Change choice"), /*#__PURE__*/React.createElement("button", {
        className: "btn-primary",
        onClick: handleSubmit
      }, "Confirm ballot"))));
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-enter",
      style: {
        maxWidth: 640,
        margin: "32px auto 80px",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: "14px 18px",
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Authenticated elector"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        color: "var(--text)"
      }
    }, voter.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontFamily: "var(--mono)",
        color: "var(--text-muted)",
        marginLeft: 8
      }
    }, "ID: ", voter.voterID)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Constituency"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)",
        fontWeight: 500
      }
    }, voter.constituency))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 20,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Official Candidate Ballot \u2014 Select Your Candidate"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Select one candidate. Inspect manifesto summary before submitting your final vote.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 20
      }
    }, cands.map((c, idx) => {
      const isSel = selected?.id === c.id;
      const isExp = expanded === c.id;
      const serial = String(idx + 1).padStart(2, "0");
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        onClick: () => {
          setSelected(c);
          setExpanded(isExp ? null : c.id);
        },
        className: `candidate-card ${isSel ? "selected" : ""}`,
        style: {
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--mono)",
          fontSize: 14,
          fontWeight: 600,
          color: "var(--text-muted)",
          width: 22
        }
      }, serial), /*#__PURE__*/React.createElement("div", {
        style: {
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
        }
      }, c.symbol), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 600,
          fontSize: 14,
          color: "var(--text)"
        }
      }, c.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: "var(--text-secondary)"
        }
      }, "\xB7 ", c.party)), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          color: "var(--text-muted)"
        }
      }, c.sub)), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: `2px solid ${isSel ? "var(--accent)" : "var(--border)"}`,
          background: isSel ? "var(--accent)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }, isSel && /*#__PURE__*/React.createElement("div", {
        style: {
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#ffffff"
        }
      }))), isExp && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "12px 18px",
          borderTop: "1px solid var(--border-subtle)",
          background: "var(--surface-2)"
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: "var(--text-secondary)",
          lineHeight: 1.5
        }
      }, c.manifesto)));
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 14,
        fontSize: 13
      },
      disabled: !selected,
      onClick: () => setStage("confirm")
    }, selected ? `Proceed with vote for ${selected.name} →` : "Select a candidate to continue"));
  }

  // Success Screen (VVPAT Digital Slip - The Moment 2)
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
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hash).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-enter",
      style: {
        maxWidth: 480,
        margin: "40px auto 80px",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: "var(--radius-sm)",
        background: "var(--green-subtle)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 12px",
        color: "var(--green)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 18,
      color: "var(--green)"
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 20,
        fontWeight: 600,
        color: "var(--green)",
        marginBottom: 4
      }
    }, "Vote Recorded \u2014 Cryptographically Committed"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Your ballot is immutably registered on the consensus state root.")), /*#__PURE__*/React.createElement("div", {
      className: "card vvpat-slip",
      style: {
        padding: 20,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px dashed var(--border)",
        paddingBottom: 12,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        fontWeight: 600,
        color: "var(--text-secondary)"
      }
    }, "OFFICIAL CRYPTOGRAPHIC RECEIPT"), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--green-subtle)",
        color: "var(--green)"
      }
    }, "CONFIRMED")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Elector Name"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text)"
      }
    }, voter?.name || "Rahul Verma")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Elector Registration ID"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontFamily: "var(--mono)",
        color: "var(--text)"
      }
    }, voter?.voterID || "DL/04/123/456789")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Constituency"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text)"
      }
    }, voter?.constituency || "New Delhi Central – 01")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Committed Block"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontFamily: "var(--mono)",
        color: "var(--accent)"
      }
    }, blockId || "#BLK-449823"))), /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: "1px dashed var(--border)",
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-muted)"
      }
    }, "Cryptographic receipt hash (zk-SNARK)"), /*#__PURE__*/React.createElement("button", {
      onClick: handleCopy,
      style: {
        background: "transparent",
        border: "none",
        color: "var(--accent)",
        fontSize: 11,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "copy",
      size: 12,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", null, copied ? "Copied" : "Copy hash"))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "var(--surface-2)",
        padding: 10,
        borderRadius: "var(--radius-sm)",
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--text)",
        wordBreak: "break-all",
        border: "1px solid var(--border-subtle)"
      }
    }, hash))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: onAudit
    }, "Audit on ledger"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: onResults
    }, "Election tally"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: onReset
    }, "Home overview")), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        width: "100%",
        padding: 10,
        fontSize: 12,
        color: "var(--text-secondary)"
      },
      onClick: onReset
    }, "Cast another ballot"));
  }

  // Live Election Results Screen
  function ResultsScreen({
    candidates,
    blockchainLog
  }) {
    const cands = candidates || INITIAL_CANDIDATES;
    const total = cands.reduce((a, c) => a + c.votes, 0);
    const sorted = [...cands].sort((a, b) => b.votes - a.votes);
    const leader = sorted[0];
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-enter",
      style: {
        maxWidth: 880,
        margin: "40px auto 80px",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 20,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Live Election Telemetry"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Real-time consensus count verified across all 12 distributed nodes.")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "var(--accent-subtle)",
        color: "#60a5fa",
        border: "1px solid var(--accent-border)",
        marginBottom: 12
      }
    }, "Projected segment leader"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20
      }
    }, leader.symbol), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 18,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 2
      }
    }, leader.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-secondary)"
      }
    }, leader.party))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 22,
        fontWeight: 600,
        fontFamily: "var(--mono)",
        color: "var(--text)"
      }
    }, fmtNum(leader.votes)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)",
        display: "block"
      }
    }, total ? (leader.votes / total * 100).toFixed(1) : 0, "% of counted votes")))), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("h4", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: "var(--text)"
      }
    }, "Certified candidate standings")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column"
      }
    }, sorted.map(c => {
      const pct = total ? (c.votes / total * 100).toFixed(1) : 0;
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        style: {
          padding: "14px 20px",
          borderBottom: "1px solid var(--border-subtle)"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 6
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 16
        }
      }, c.symbol), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: 500,
          fontSize: 13,
          color: "var(--text)"
        }
      }, c.name), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          color: "var(--text-muted)"
        }
      }, "(", c.party, ")")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--text)"
        }
      }, fmtNum(c.votes), " ", /*#__PURE__*/React.createElement("span", {
        style: {
          color: "var(--text-muted)",
          marginLeft: 6
        }
      }, pct, "%"))), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 4,
          background: "var(--surface-3)",
          borderRadius: "var(--radius-sm)",
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: `${pct}%`,
          height: "100%",
          background: "var(--accent)"
        }
      })));
    }))));
  }

  // Public Audit Portal Screen
  function AuditScreen({
    defaultHash,
    receiptLedger
  }) {
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
      setQueryLogs(["Connecting to decentralized consensus gateway...", "Hashing input against Paillier verifiable proofs...", "Searching state root index across ledger blocks..."]);
      setTimeout(() => {
        const res = auditReceipt(hashInput.trim(), receiptLedger);
        setResult(res);
        setQuerying(false);
      }, 600);
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "fade-enter",
      style: {
        maxWidth: 640,
        margin: "40px auto 80px",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 24
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 20,
        fontWeight: 600,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Public Ledger Explorer"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Validate any cryptographic ballot receipt without revealing elector identity.")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 12,
        color: "var(--text-secondary)",
        display: "block",
        marginBottom: 8
      }
    }, "Cryptographic receipt hash"), /*#__PURE__*/React.createElement("textarea", {
      style: {
        width: "100%",
        height: 72,
        padding: "10px 12px",
        fontFamily: "var(--mono)",
        fontSize: 12,
        resize: "none",
        marginBottom: 12
      },
      placeholder: "Enter 0x... receipt hash",
      value: hashInput,
      onChange: e => setHashInput(e.target.value)
    }), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 12,
        fontSize: 13
      },
      disabled: !hashInput.trim() || querying,
      onClick: handleAudit
    }, querying ? "Querying ledger..." : "Verify on chain →")), querying && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        marginBottom: 20
      }
    }, queryLogs.map((l, i) => /*#__PURE__*/React.createElement(TerminalLine, {
      key: i,
      text: l
    }))), result && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        borderLeft: `3px solid ${result.valid ? "var(--green)" : "var(--red)"}`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: result.valid ? "var(--green-subtle)" : "var(--red-subtle)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 14,
      color: result.valid ? "var(--green)" : "var(--red)"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: result.valid ? "var(--green)" : "var(--red)"
      }
    }, result.valid ? "Vote Verified on Blockchain Ledger" : "Hash Not Found in Ledger"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, result.valid ? "Cryptographic proof confirmed on state root" : "Invalid receipt hash entered"))), result.valid && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        fontSize: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Confirmed block"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        color: "var(--text)"
      }
    }, result.blockId)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Proof status"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--green)",
        fontWeight: 500
      }
    }, "zk-SNARK Valid")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Consensus confirmation"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text)"
      }
    }, "12 of 12 nodes")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-muted)",
        display: "block"
      }
    }, "Ledger state"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--green)",
        fontWeight: 500
      }
    }, "Immutable")))));
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
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    };
    const handleAuth = v => {
      setAuthVoter(v);
      setScreen("vote");
    };
    const handleVote = candidate => {
      const v = authVoter || verifyAadhaar && verifyAadhaar("123456789012") || VOTERS_DB && VOTERS_DB["123456789012"];
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column"
      }
    }, /*#__PURE__*/React.createElement(TopHeader, {
      screen: screen,
      onNavigate: navigate,
      latestBlock: blockchainLog[0]?.block
    }), /*#__PURE__*/React.createElement("main", {
      style: {
        flex: 1
      }
    }, screen === "home" && /*#__PURE__*/React.createElement(HomeScreen, {
      onNavigate: navigate,
      candidates: candidates,
      blockchainLog: blockchainLog
    }), screen === "auth" && /*#__PURE__*/React.createElement(AuthScreen, {
      onSuccess: handleAuth
    }), screen === "vote" && /*#__PURE__*/React.createElement(CandidateScreen, {
      voter: authVoter || verifyAadhaar && verifyAadhaar("123456789012") || VOTERS_DB && VOTERS_DB["123456789012"],
      onCastVote: handleVote
    }), screen === "success" && /*#__PURE__*/React.createElement(SuccessScreen, {
      voter: authVoter || verifyAadhaar && verifyAadhaar("123456789012") || VOTERS_DB && VOTERS_DB["123456789012"],
      hash: voteData?.hash || genHash("SAMPLE-RECEIPT-2026"),
      blockId: voteData?.blockId || "#BLK-449823",
      onAudit: handleOpenAudit,
      onResults: () => setScreen("results"),
      onReset: handleReset
    }), screen === "results" && /*#__PURE__*/React.createElement(ResultsScreen, {
      candidates: candidates,
      blockchainLog: blockchainLog
    }), screen === "audit" && /*#__PURE__*/React.createElement(AuditScreen, {
      defaultHash: auditTargetHash,
      receiptLedger: receiptLedger
    })), /*#__PURE__*/React.createElement("footer", {
      style: {
        borderTop: "1px solid var(--border)",
        padding: "24px 20px",
        background: "var(--surface-1)",
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1120,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "Election Commission of India \xB7 Decentralized Digital Ballot Protocol")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", null, "EVM / Raft Consensus"), /*#__PURE__*/React.createElement("span", null, "Paillier Zero-Knowledge Proofs"), /*#__PURE__*/React.createElement("span", null, "SHA-256 Immutability")))));
  }

  // Mount
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render( /*#__PURE__*/React.createElement(App, null));
})();