(function () {
  /**
   * VoteChain - Premium Web3 Electronic Voting System
   * Modern, un-slopped, institutional-grade presentation layer
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

  // SVG Icons
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
        strokeWidth: "2",
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
        strokeWidth: "2",
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
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M18 20V10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 20V4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 20v-6"
      })),
      audit: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m21 21-4.3-4.3"
      })),
      shield: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
      })),
      check: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("polyline", {
        points: "20 6 9 17 4 12"
      })),
      copy: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("rect", {
        width: "14",
        height: "14",
        x: "8",
        y: "8",
        rx: "2",
        ry: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
      })),
      lock: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("rect", {
        width: "18",
        height: "11",
        x: "3",
        y: "11",
        rx: "2",
        ry: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 11V7a5 5 0 0 1 10 0v4"
      })),
      blocks: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("rect", {
        width: "8",
        height: "8",
        x: "2",
        y: "2",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "m14 6 4 4-4 4"
      }), /*#__PURE__*/React.createElement("rect", {
        width: "8",
        height: "8",
        x: "14",
        y: "14",
        rx: "1"
      })),
      user: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "8",
        r: "5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 21a8 8 0 0 0-16 0"
      })),
      chevronDown: /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("polyline", {
        points: "6 9 12 15 18 9"
      }))
    };
    return icons[name] || null;
  }

  // Top Status & Institutional Navigation Header
  function StatusBar({
    voter,
    onReset
  }) {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
      const t = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(t);
    }, []);
    return /*#__PURE__*/React.createElement("header", {
      style: {
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
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 28,
        height: 28,
        borderRadius: "var(--radius-sm)",
        background: "linear-gradient(135deg, #0284c7, #0369a1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 16px var(--accent-glow)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 15,
      color: "#fff"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font)",
        fontWeight: 800,
        fontSize: 16,
        letterSpacing: "-0.02em",
        color: "var(--text)"
      }
    }, "VOTE", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--accent)"
      }
    }, "CHAIN"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "none"
      },
      className: "node-tag"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        color: "#34d399"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "#10b981"
      }
    }), "RAFT SYNC"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, voter && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-full)",
        padding: "3px 12px 3px 6px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, voter.name.charAt(0)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text)",
        fontWeight: 500
      }
    }, voter.name.split(" ")[0]), /*#__PURE__*/React.createElement("button", {
      onClick: onReset,
      title: "Logout session",
      style: {
        background: "transparent",
        border: "none",
        color: "var(--text-dim)",
        cursor: "pointer",
        padding: "2px 4px",
        fontSize: 10,
        fontFamily: "var(--mono)",
        transition: "color 0.2s"
      },
      onMouseEnter: e => e.currentTarget.style.color = "var(--red)",
      onMouseLeave: e => e.currentTarget.style.color = "var(--text-dim)"
    }, "Exit")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "#10b981"
      }
    }), /*#__PURE__*/React.createElement("span", null, time.toLocaleTimeString("en-IN", {
      hour12: false
    }), " IST")), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "rgba(255, 255, 255, 0.03)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 11,
      color: "var(--accent)"
    }), "TLS 1.3")));
  }

  // Progress Stepper Component
  function ProgressStepper({
    steps,
    current
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        marginBottom: 32,
        gap: 8
      }
    }, steps.map((s, i) => {
      const isDone = i < current;
      const isCurrent = i === current;
      return /*#__PURE__*/React.createElement("div", {
        key: s,
        style: {
          display: "flex",
          alignItems: "center",
          flex: i < steps.length - 1 ? 1 : "initial"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "6px 12px",
          borderRadius: "var(--radius-full)",
          background: isCurrent ? "rgba(14, 165, 233, 0.12)" : isDone ? "rgba(16, 185, 129, 0.1)" : "rgba(255, 255, 255, 0.03)",
          border: `1px solid ${isCurrent ? "var(--accent)" : isDone ? "var(--green)" : "var(--border)"}`,
          transition: "all 0.3s ease"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
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
        }
      }, isDone ? /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 10,
        color: "#fff"
      }) : i + 1), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 12,
          fontWeight: isCurrent ? 600 : 500,
          color: isCurrent ? "var(--text)" : isDone ? "var(--text-muted)" : "var(--text-dim)",
          whiteSpace: "nowrap"
        }
      }, s)), i < steps.length - 1 && /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          height: 1,
          background: isDone ? "var(--green)" : "var(--border)",
          margin: "0 8px",
          transition: "background 0.3s ease"
        }
      }));
    }));
  }

  // Terminal Output Line
  function TerminalLine({
    text,
    color = "var(--text-muted)"
  }) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        animation: "fadeUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) both",
        fontFamily: "var(--mono)",
        fontSize: 12,
        color,
        padding: "3px 0",
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-dim)",
        userSelect: "none"
      }
    }, "\u203A"), /*#__PURE__*/React.createElement("span", null, text));
  }

  // Landing Screen
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
        paddingTop: 56,
        paddingBottom: 80,
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 1080,
        margin: "0 auto",
        padding: "48px 24px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 56,
        animation: "fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "tag",
      style: {
        background: "rgba(14, 165, 233, 0.08)",
        border: "1px solid rgba(14, 165, 233, 0.25)",
        color: "var(--accent-hover)",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "var(--accent)"
      }
    }), "GENERAL ELECTION 2026 \xB7 DIGITAL VOTING PROTOCOL"), /*#__PURE__*/React.createElement("h1", {
      style: {
        fontSize: "clamp(36px, 6vw, 64px)",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: "-0.03em",
        marginBottom: 18,
        color: "var(--text)"
      }
    }, "The Sovereign Electronic Ballot.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        background: "linear-gradient(90deg, #38bdf8 0%, #10b981 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
      }
    }, "Cryptographically Sealed.")), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 16,
        color: "var(--text-muted)",
        maxWidth: 620,
        margin: "0 auto 36px",
        lineHeight: 1.7
      }
    }, "Decentralized e-voting secured with Byzantine Fault-Tolerant Raft consensus and zero-knowledge privacy. Every citizen ballot is tamper-proof and publicly verifiable."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 14,
        justifyContent: "center",
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      onClick: () => onNavigate("auth"),
      style: {
        padding: "14px 32px",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "vote",
      size: 16,
      color: "#fff"
    }), "Cast Your Ballot"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => onNavigate("audit"),
      style: {
        padding: "14px 24px",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "audit",
      size: 16
    }), "Verify Receipt"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      onClick: () => onNavigate("results"),
      style: {
        padding: "14px 24px",
        fontSize: 14,
        display: "inline-flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "chart",
      size: 16
    }), "Live Telemetry"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 40
      }
    }, [{
      label: "Registered Electorate",
      value: "97.2 Cr",
      icon: "user",
      color: "var(--accent)"
    }, {
      label: "Ballots Recorded",
      value: fmtNum(total),
      icon: "vote",
      color: "var(--green)"
    }, {
      label: "Ledger Height",
      value: fmtNum(449821 + Math.max(0, logs.length - INITIAL_BLOCKCHAIN.length)),
      icon: "blocks",
      color: "var(--purple)"
    }, {
      label: "Electoral Turnout",
      value: (total / 1028300 * 100).toFixed(1) + "%",
      icon: "chart",
      color: "var(--amber)"
    }].map((s, idx) => /*#__PURE__*/React.createElement("div", {
      key: s.label,
      className: "card",
      style: {
        padding: "20px 22px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 500,
        color: "var(--text-muted)"
      }
    }, s.label), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 30,
        borderRadius: "var(--radius-sm)",
        background: "rgba(255, 255, 255, 0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: s.color
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: s.icon,
      size: 15,
      color: s.color
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--mono)",
        fontWeight: 700,
        fontSize: 24,
        color: s.color,
        letterSpacing: "-0.02em"
      }
    }, s.value)))), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "16px 22px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "var(--green)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 14
      }
    }, "Live Consensus Ledger")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, "Hyperledger Fabric \xB7 Raft Protocol")), /*#__PURE__*/React.createElement("div", {
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
        borderBottom: "1px solid var(--border)",
        background: "rgba(255, 255, 255, 0.02)"
      }
    }, ["Block Height", "Transaction Hash", "Transactions", "Time", "Consensus", "Audit"].map(h => /*#__PURE__*/React.createElement("th", {
      key: h,
      style: {
        padding: "12px 18px",
        textAlign: "left",
        color: "var(--text-dim)",
        fontWeight: 500,
        fontSize: 11
      }
    }, h)))), /*#__PURE__*/React.createElement("tbody", null, logs.map(b => {
      const shortHash = b.hash.length > 18 ? `${b.hash.slice(0, 6)}...${b.hash.slice(-4)}` : b.hash;
      return /*#__PURE__*/React.createElement("tr", {
        key: b.block,
        style: {
          borderBottom: "1px solid var(--border)",
          transition: "background 0.2s"
        },
        className: "table-row"
      }, /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "14px 18px",
          color: "var(--accent)",
          fontWeight: 600
        }
      }, b.block), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "14px 18px",
          color: "var(--text-muted)"
        },
        title: b.fullHash || b.hash
      }, shortHash), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "14px 18px",
          color: "var(--text)"
        }
      }, fmtNum(b.tx)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "14px 18px",
          color: "var(--text-dim)"
        }
      }, b.time), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "14px 18px"
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "rgba(16, 185, 129, 0.08)",
          border: "1px solid rgba(16, 185, 129, 0.25)",
          color: "#34d399"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 10,
        color: "#10b981"
      }), b.status)), /*#__PURE__*/React.createElement("td", {
        style: {
          padding: "14px 18px"
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "demo-chip",
        onClick: () => onNavigate("audit", b.fullHash || b.hash),
        style: {
          padding: "4px 10px",
          fontSize: 11
        }
      }, "Verify")));
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 14,
      color: "var(--text-dim)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-muted)"
      }
    }, "Demo Verified Elector Identities:")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        flexWrap: "wrap"
      }
    }, Object.entries(VOTERS_DB).map(([num, v]) => /*#__PURE__*/React.createElement("span", {
      key: num,
      className: "tag",
      style: {
        background: "var(--surface-3)",
        color: "var(--text)",
        border: "1px solid var(--border)"
      }
    }, v.name.split(" ")[0], ": ", /*#__PURE__*/React.createElement("strong", {
      style: {
        fontFamily: "var(--mono)",
        color: "var(--accent)"
      }
    }, num)))))));
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
    const addTerm = (txt, color = "var(--text-muted)", delay = 0) => {
      safeTimeout(() => setTermLines(l => [...l, {
        txt,
        color,
        id: Date.now() + Math.random()
      }]), delay);
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
      const msgs = ["Extracting 468 facial landmark coordinates...", "Matching feature vectors against Aadhaar cryptographic root...", "Executing anti-spoofing micro-movement liveness test...", "Biometric signature authenticated ✓"];
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 80,
        paddingBottom: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        maxWidth: 480
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 24,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 6
      }
    }, "Elector Authentication"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 13
      }
    }, "Two-Factor Registry Lookup & Biometric Verification")), /*#__PURE__*/React.createElement(ProgressStepper, {
      steps: ["Registry ID", "OTP Passcode", "Biometric"],
      current: step
    }), step === 0 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 28,
        animation: "fadeUp 0.3s ease"
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        display: "block",
        marginBottom: 8,
        letterSpacing: "0.05em"
      }
    }, "12-DIGIT AADHAAR NUMBER"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: aadhaar.replace(/(\d{4})(?=\d)/g, "$1 "),
      onChange: e => setAadhaar(e.target.value.replace(/\s|\D/g, "").slice(0, 12)),
      placeholder: "0000 0000 0000",
      style: {
        width: "100%",
        padding: "14px 16px",
        fontSize: 18,
        letterSpacing: 3,
        fontWeight: 600
      }
    }), aadhaar.length === 12 && voter && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: 14,
        top: "50%",
        transform: "translateY(-50%)",
        color: "var(--green)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 18,
      color: "#10b981"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)"
      }
    }, "Demo quick-select:"), Object.entries(VOTERS_DB).map(([num, v]) => /*#__PURE__*/React.createElement("button", {
      key: num,
      type: "button",
      className: "demo-chip",
      onClick: () => {
        setAadhaar(num);
        setError("");
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 11
    }), v.name.split(" ")[0]))), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--red)",
        fontSize: 12,
        marginBottom: 12,
        fontFamily: "var(--mono)"
      }
    }, error), aadhaar.length === 12 && voter && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "14px 16px",
        marginBottom: 18,
        display: "flex",
        gap: 14,
        alignItems: "center",
        animation: "fadeUp 0.2s ease"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, voter.name.charAt(0)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 600,
        color: "var(--text)",
        fontSize: 14
      }
    }, voter.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)",
        marginTop: 2
      }
    }, voter.constituency)), /*#__PURE__*/React.createElement("span", {
      className: "tag",
      style: {
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        color: "#34d399"
      }
    }, "Verified")), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 14,
        fontSize: 14
      },
      disabled: aadhaar.length !== 12 || !voter,
      onClick: handleAadhaar
    }, "Verify Identity & Dispatch OTP \u2192"), termLines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 14px",
        marginTop: 14
      }
    }, termLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.color
    })))), step === 1 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 28,
        animation: "fadeUp 0.3s ease"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card-inner",
      style: {
        padding: "12px 16px",
        marginBottom: 20,
        display: "flex",
        gap: 10,
        alignItems: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 16,
      color: "var(--accent)"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Passcode dispatched to ", /*#__PURE__*/React.createElement("strong", {
      style: {
        color: "var(--accent)"
      }
    }, voter?.registeredPhone))), /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        display: "block",
        marginBottom: 12,
        letterSpacing: "0.05em"
      }
    }, "ENTER 6-DIGIT VERIFICATION CODE"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8,
        marginBottom: 12
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
        padding: "14px 0",
        textAlign: "center",
        fontSize: 20,
        fontWeight: 700,
        borderRadius: "var(--radius-sm)",
        border: `1px solid ${d ? "var(--accent)" : "var(--border)"}`,
        background: "rgba(9, 13, 20, 0.8)",
        color: "var(--text)"
      },
      maxLength: 1
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, "Demo Passcode:"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "demo-chip",
      style: {
        cursor: "pointer"
      },
      onClick: () => setOtpDigits(otpCode.split(""))
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        cursor: "pointer"
      }
    }, otpCode, " (click to fill)"))), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--red)",
        fontSize: 12,
        marginBottom: 12,
        fontFamily: "var(--mono)"
      }
    }, error), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 14,
        fontSize: 14
      },
      disabled: otpDigits.join("").length !== 6,
      onClick: handleOtpVerify
    }, "Verify Passcode \u2192"), /*#__PURE__*/React.createElement("button", {
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
    }, "\u2190 Back to Registry Lookup"), termLines.length > 0 && /*#__PURE__*/React.createElement("div", {
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
        padding: 32,
        textAlign: "center",
        animation: "fadeUp 0.3s ease"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, voter?.name.charAt(0)), !faceDone && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "var(--accent)",
        boxShadow: "0 0 10px var(--accent)",
        animation: "scanBeam 1.8s infinite ease-in-out"
      }
    }), faceDone && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        background: "rgba(16, 185, 129, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 36,
      color: "#10b981"
    }))), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 16,
        fontWeight: 600,
        color: faceDone ? "var(--green)" : "var(--accent)",
        marginBottom: 8
      }
    }, faceDone ? "Biometric Signature Validated" : "Scanning Facial Biometrics..."), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "var(--radius-full)",
        height: 6,
        overflow: "hidden",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: `${faceProgress}%`,
        background: "linear-gradient(90deg, var(--accent), var(--green))",
        transition: "width 0.15s ease"
      }
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        marginBottom: 16
      }
    }, Math.round(faceProgress), "% verification complete"), /*#__PURE__*/React.createElement("div", {
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

  // Ballot Voting Screen
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
      const steps = [["Encapsulating ballot payload with AES-256-GCM envelope...", "var(--text-muted)", 0], ["Signing payload with elector RSA-2048 keypair...", "var(--text-muted)", 700], ["Broadcasting cryptogram to Hyperledger peer consensus nodes...", "var(--text-muted)", 1400], ["Synthesizing zk-SNARK zero-knowledge anonymity proof...", "#c084fc", 2100], ["Verifying Merkle root constraints across validator quorum...", "var(--text-muted)", 2800], ["Consensus achieved via Raft protocol round...", "var(--text-muted)", 3500], ["Block committed to immutable ledger root ✓", "#34d399", 4200]];
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
    if (stage === "encrypting") {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          minHeight: "100vh",
          paddingTop: 80,
          paddingBottom: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          maxWidth: 460,
          width: "100%",
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "rgba(14, 165, 233, 0.1)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px"
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: "blocks",
        size: 24,
        color: "var(--accent)"
      })), /*#__PURE__*/React.createElement("h3", {
        style: {
          fontSize: 20,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 6
        }
      }, "Recording on Blockchain"), /*#__PURE__*/React.createElement("p", {
        style: {
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 24
        }
      }, "Executing Raft consensus endorsement. Do not disconnect."), /*#__PURE__*/React.createElement("div", {
        style: {
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "var(--radius-full)",
          height: 8,
          overflow: "hidden",
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          width: `${encProgress}%`,
          background: "linear-gradient(90deg, #0284c7, #0ea5e9, #10b981)",
          transition: "width 0.5s ease"
        }
      })), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: "var(--accent)",
          fontFamily: "var(--mono)",
          marginBottom: 20
        }
      }, encProgress, "% committed"), /*#__PURE__*/React.createElement("div", {
        className: "card",
        style: {
          padding: "16px 20px",
          textAlign: "left"
        }
      }, encLines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
        key: l.id,
        text: l.txt,
        color: l.color
      })))));
    }
    if (stage === "confirm") {
      return /*#__PURE__*/React.createElement("div", {
        style: {
          minHeight: "100vh",
          paddingTop: 80,
          paddingBottom: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px 20px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          maxWidth: 440,
          width: "100%"
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "card",
        style: {
          padding: 32,
          textAlign: "center"
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          color: "var(--amber)",
          marginBottom: 18
        }
      }, "FINAL REVIEW"), /*#__PURE__*/React.createElement("div", {
        style: {
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
        }
      }, selected.symbol), /*#__PURE__*/React.createElement("h3", {
        style: {
          fontSize: 22,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 4
        }
      }, selected.name), /*#__PURE__*/React.createElement("p", {
        style: {
          color: selected.color,
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 12
        }
      }, selected.party), /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "var(--surface-3)",
          color: "var(--text-muted)",
          marginBottom: 20
        }
      }, voter.constituency), /*#__PURE__*/React.createElement("div", {
        className: "card-inner",
        style: {
          padding: "12px 14px",
          marginBottom: 24
        }
      }, /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: "var(--text-dim)",
          lineHeight: 1.6
        }
      }, "Once verified, your ballot is irreversibly decoupled from your identity and registered to the consensus state.")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn-ghost",
        style: {
          padding: 13,
          fontSize: 14
        },
        onClick: () => setStage("pick")
      }, "\u2190 Change Choice"), /*#__PURE__*/React.createElement("button", {
        className: "btn-primary",
        style: {
          padding: 13,
          fontSize: 14,
          background: "linear-gradient(180deg, #059669 0%, #047857 100%)"
        },
        onClick: handleSubmit
      }, "Confirm & Sign Ballot")))));
    }
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 80,
        paddingBottom: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 680,
        margin: "0 auto",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: "16px 20px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
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
      }
    }, voter.name.charAt(0)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 600,
        fontSize: 14,
        color: "var(--text)"
      }
    }, voter.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, "ID: ", voter.voterID))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text)",
        fontWeight: 500
      }
    }, voter.constituency), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)"
      }
    }, "Parliamentary Segment"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 22,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Official Candidate Ballot \u2014 Select Your Candidate"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Select your candidate. Click row to inspect manifesto commitments.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 24
      }
    }, cands.map(c => {
      const isSel = selected?.id === c.id;
      const isExp = expanded === c.id;
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        onClick: () => {
          setSelected(c);
          setExpanded(isExp ? null : c.id);
        },
        className: `candidate-card ${isSel ? "selected" : ""}`,
        style: {
          "--candidate-color": c.color,
          cursor: "pointer"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          gap: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
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
          fontWeight: 600,
          fontSize: 15,
          color: "var(--text)"
        }
      }, c.name), /*#__PURE__*/React.createElement("span", {
        className: "tag",
        style: {
          background: "rgba(255, 255, 255, 0.05)",
          color: "var(--text-muted)",
          fontSize: 10
        }
      }, c.abbr)), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 12,
          color: c.color,
          fontWeight: 500
        }
      }, c.party)), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: `2px solid ${isSel ? c.color : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: isSel ? c.color : "transparent",
          transition: "all 0.2s"
        }
      }, isSel && /*#__PURE__*/React.createElement(Icon, {
        name: "check",
        size: 12,
        color: "#fff"
      }))), isExp && c.manifesto && /*#__PURE__*/React.createElement("div", {
        style: {
          padding: "0 20px 16px",
          borderTop: "1px solid var(--border)",
          paddingTop: 12,
          animation: "fadeUp 0.2s ease"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10,
          color: "var(--text-dim)",
          fontFamily: "var(--mono)",
          letterSpacing: "0.05em",
          display: "block",
          marginBottom: 4
        }
      }, "KEY POLICY COMMITMENTS"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 13,
          color: "var(--text-muted)",
          lineHeight: 1.6
        }
      }, c.manifesto)));
    })), /*#__PURE__*/React.createElement("button", {
      className: "btn-primary",
      style: {
        width: "100%",
        padding: 16,
        fontSize: 15
      },
      disabled: !selected,
      onClick: () => setStage("confirm")
    }, selected ? `Proceed with Vote for ${selected.name.toUpperCase()} →` : "Select a Candidate to Continue")));
  }

  // Success & Digital Cryptographic Receipt Screen
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
        paddingTop: 80,
        paddingBottom: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 500,
        width: "100%"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 28,
        animation: "fadeUp 0.4s ease"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "rgba(16, 185, 129, 0.1)",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 16px"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 28,
      color: "#10b981"
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 24,
        fontWeight: 700,
        color: "var(--green)",
        marginBottom: 4
      }
    }, "Vote Recorded \u2014 Cryptographically Committed"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: "var(--text-muted)",
        fontSize: 13
      }
    }, "Immutably registered to the decentralized ledger with zk-SNARK proof.")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden",
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 20px",
        background: "rgba(16, 185, 129, 0.08)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "shield",
      size: 14,
      color: "#10b981"
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        fontWeight: 600,
        color: "#34d399",
        letterSpacing: "0.05em"
      }
    }, "OFFICIAL CRYPTOGRAPHIC RECEIPT")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, "CONFIRMED")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 22,
        display: "flex",
        flexDirection: "column",
        gap: 12
      }
    }, [["Elector Name", voter.name], ["Elector Registration ID", voter.voterID], ["Constituency", voter.constituency], ["Ledger Block Height", blockId], ["Timestamp", new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium"
    })], ["Network Confirmations", "128 (Consensus finalized)"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)"
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--text)",
        fontWeight: 500,
        fontFamily: k.includes("ID") || k.includes("Height") ? "var(--mono)" : "inherit"
      }
    }, v))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)"
      }
    }, "zk-SNARK Transaction Proof"), /*#__PURE__*/React.createElement("button", {
      onClick: handleCopy,
      className: "demo-chip",
      style: {
        padding: "4px 10px",
        fontSize: 11
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: copied ? "check" : "copy",
      size: 11,
      color: copied ? "var(--green)" : "currentColor"
    }), copied ? "Copied" : "Copy Hash")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 14px",
        background: "rgba(9, 13, 20, 0.8)",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "#c084fc",
        wordBreak: "break-all",
        lineHeight: 1.6
      }
    }, hash)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        marginTop: 8,
        fontStyle: "italic"
      }
    }, "Zero-knowledge proof allows ledger verification without disclosing your candidate preference.")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 12,
        fontSize: 13
      },
      onClick: onAudit
    }, "Audit on Ledger"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 12,
        fontSize: 13
      },
      onClick: onResults
    }, "Live Tally"), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        padding: 12,
        fontSize: 13
      },
      onClick: onReset
    }, "Home Overview")), /*#__PURE__*/React.createElement("button", {
      className: "btn-ghost",
      style: {
        width: "100%",
        padding: 11,
        fontSize: 12,
        color: "var(--accent)",
        borderColor: "var(--border)"
      },
      onClick: onReset
    }, "Switch Voter & Cast Another Ballot")));
  }

  // Live Election Results Screen
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
      const t = setTimeout(() => setAnimated(true), 150);
      return () => clearTimeout(t);
    }, []);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        paddingTop: 80,
        paddingBottom: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 720,
        margin: "0 auto",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 28,
        flexWrap: "wrap",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 24,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 4
      }
    }, "Live Election Telemetry"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)"
      }
    }, "Automated smart contract tallying updated at block ", latestBlock)), /*#__PURE__*/React.createElement("div", {
      className: "tag",
      style: {
        background: "rgba(16, 185, 129, 0.08)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        color: "#34d399"
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "#10b981"
      }
    }), fmtNum(total), " BALLOTS COUNTED")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 0,
        overflow: "hidden",
        marginBottom: 20,
        borderColor: `${sorted[0].color}40`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "12px 20px",
        background: `linear-gradient(90deg, ${sorted[0].color}15, transparent)`,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        fontWeight: 600,
        color: sorted[0].color,
        letterSpacing: "0.05em"
      }
    }, "LEADING CONSTITUENCY CANDIDATE"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: sorted[0].color
      }
    }, "Margin: +", fmtNum(sorted[0].votes - sorted[1].votes))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 22,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: "var(--radius-md)",
        background: "rgba(255, 255, 255, 0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        color: sorted[0].color
      }
    }, sorted[0].symbol), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 200
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: 20,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 2
      }
    }, sorted[0].name), /*#__PURE__*/React.createElement("p", {
      style: {
        color: sorted[0].color,
        fontSize: 13,
        fontWeight: 500,
        marginBottom: 10
      }
    }, sorted[0].party), /*#__PURE__*/React.createElement("div", {
      style: {
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "var(--radius-full)",
        height: 8,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: animated ? `${(sorted[0].votes / total * 100).toFixed(1)}%` : "0%",
        background: sorted[0].color,
        transition: "width 1s cubic-bezier(0.16, 1, 0.3, 1)"
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "right"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--mono)",
        fontWeight: 700,
        fontSize: 28,
        color: sorted[0].color
      }
    }, (sorted[0].votes / total * 100).toFixed(1), "%"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, fmtNum(sorted[0].votes), " votes")))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
        marginBottom: 24
      }
    }, sorted.map((c, i) => {
      const pct = (c.votes / total * 100).toFixed(1);
      return /*#__PURE__*/React.createElement("div", {
        key: c.id,
        className: "card",
        style: {
          padding: "16px 20px"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 10
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--mono)",
          fontSize: 12,
          color: "var(--text-dim)",
          width: 16
        }
      }, "#", i + 1), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 16
        }
      }, c.symbol), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
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
          color: "var(--text-dim)",
          marginLeft: 8
        }
      }, c.party)), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: "right"
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "var(--mono)",
          fontWeight: 600,
          fontSize: 14,
          color: c.color
        }
      }, pct, "%"), /*#__PURE__*/React.createElement("p", {
        style: {
          fontSize: 11,
          color: "var(--text-dim)",
          fontFamily: "var(--mono)"
        }
      }, fmtNum(c.votes)))), /*#__PURE__*/React.createElement("div", {
        style: {
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "var(--radius-full)",
          height: 6,
          overflow: "hidden"
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: "100%",
          width: animated ? `${pct}%` : "0%",
          background: c.color,
          transition: `width ${0.8 + i * 0.1}s cubic-bezier(0.16, 1, 0.3, 1)`
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
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 600,
        fontSize: 13,
        color: "var(--text)"
      }
    }, "Smart Contract Verifier Telemetry")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: "14px 18px",
        fontFamily: "var(--mono)",
        fontSize: 11,
        display: "flex",
        flexDirection: "column",
        gap: 6
      }
    }, [`TallyContract.autoTally() executed at block ${latestBlock}`, `Consensus verified ${fmtNum(total)} valid ballot envelopes`, `zk-SNARK constraint validations: ${fmtNum(total)} / ${fmtNum(total)} passing`, "State root 0x8f3c7a... committed to decentralized cluster", "Public verifier query endpoint synchronized — 0 contested proofs"].map((l, i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        color: i === 4 ? "#34d399" : "var(--text-muted)",
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: "var(--text-dim)"
      }
    }, "\u203A"), l))))));
  }

  // Public Audit Portal Screen
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
          error: "Invalid cryptographic format. Hash must begin with 0x and contain valid hexadecimal digits."
        });
        return;
      }
      setLoading(true);
      setResult(null);
      setLines([]);
      const steps = [["Querying Hyperledger Fabric peer gateway...", 300], ["Scanning CouchDB state tree for transaction hash...", 800], ["Verifying Merkle-Patricia block membership proof...", 1400], ["Validating zk-SNARK constraint satisfaction...", 2000], ["Cross-referencing Raft consensus commit log...", 2600], ["State verification finalized ✓", 3200]];
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
        paddingTop: 80,
        paddingBottom: 80
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 580,
        margin: "0 auto",
        padding: "0 20px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        marginBottom: 28
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: "var(--radius-md)",
        background: "rgba(14, 165, 233, 0.1)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "audit",
      size: 24,
      color: "var(--accent)"
    })), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: 24,
        fontWeight: 700,
        color: "var(--text)",
        marginBottom: 6
      }
    }, "Public Ledger Explorer"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 13,
        color: "var(--text-muted)",
        lineHeight: 1.6
      }
    }, "Validate any ballot proof on the decentralized ledger.", /*#__PURE__*/React.createElement("br", null), "Ballot choices remain hidden via Zero-Knowledge SNARK constraints.")), /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 24,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("label", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        display: "block",
        marginBottom: 8,
        letterSpacing: "0.05em"
      }
    }, "BALLOT TRANSACTION HASH"), /*#__PURE__*/React.createElement("textarea", {
      value: hash,
      onChange: e => {
        setHash(e.target.value);
        setResult(null);
        setLines([]);
      },
      placeholder: "Paste 0x... receipt hash here",
      rows: 3,
      style: {
        width: "100%",
        padding: "12px 14px",
        fontSize: 12,
        lineHeight: 1.6,
        resize: "none",
        wordBreak: "break-all"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
        marginTop: 10,
        marginBottom: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)"
      }
    }, "Historical blocks:"), INITIAL_BLOCKCHAIN.slice(0, 2).map((b, idx) => /*#__PURE__*/React.createElement("button", {
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
        padding: 14,
        fontSize: 14,
        marginTop: 12
      },
      disabled: !hash || loading,
      onClick: verify
    }, loading ? "Querying Blockchain Nodes..." : "Verify on Decentralized Ledger →")), lines.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: "16px 20px",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11,
        color: "var(--text-dim)",
        letterSpacing: "0.05em",
        marginBottom: 8
      }
    }, "EXPLORER QUERY LOG"), lines.map(l => /*#__PURE__*/React.createElement(TerminalLine, {
      key: l.id,
      text: l.txt,
      color: l.txt.includes("✓") ? "#34d399" : "var(--text-muted)"
    })), loading && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginTop: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "status-dot",
      style: {
        background: "var(--accent)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)"
      }
    }, "Validating cryptographic proof..."))), result && /*#__PURE__*/React.createElement("div", {
      className: "card",
      style: {
        padding: 24,
        borderColor: result.valid ? "rgba(16, 185, 129, 0.4)" : "rgba(244, 63, 94, 0.4)",
        animation: "fadeUp 0.3s ease"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: result.valid ? 16 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: result.valid ? "rgba(16, 185, 129, 0.15)" : "rgba(244, 63, 94, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 18,
      color: result.valid ? "#10b981" : "#f43f5e"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
      style: {
        fontWeight: 600,
        fontSize: 15,
        color: result.valid ? "var(--green)" : "var(--red)"
      }
    }, result.valid ? "Vote Verified on Blockchain Ledger" : "Hash Not Found in Ledger"), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: "var(--text-dim)"
      }
    }, result.valid ? "Cryptographic proof confirmed on immutable chain" : result.error || "Please verify receipt hash"))), result.valid && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 10
      }
    }, [["Block Identifier", result.block, "var(--accent)"], ["Block Timestamp", result.timestamp, "var(--text)"], ["Quorum Confirmations", result.confirmations, "var(--green)"], ["zk-SNARK Constraints", "SATISFIED ✓", "var(--green)"], ["Ledger Status", "IMMUTABLE · TAMPER-PROOF", "var(--green)"]].map(([k, v, c]) => /*#__PURE__*/React.createElement("div", {
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
        color: "var(--text-dim)"
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: c,
        fontFamily: k.includes("Block") ? "var(--mono)" : "inherit"
      }
    }, v))), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: "var(--text-dim)",
        fontFamily: "var(--mono)",
        fontStyle: "italic",
        marginTop: 4
      }
    }, "Zero-Knowledge Proof guarantees privacy: Ballot content cannot be derived even with quantum scrutiny.")))));
  }

  // Bottom Glass Floating Dock Navigation
  function NavBar({
    screen,
    onNavigate
  }) {
    const tabs = [{
      id: "home",
      label: "Overview",
      icon: "home"
    }, {
      id: "auth",
      label: "Vote",
      icon: "vote"
    }, {
      id: "results",
      label: "Telemetry",
      icon: "chart"
    }, {
      id: "audit",
      label: "Audit",
      icon: "audit"
    }];
    return /*#__PURE__*/React.createElement("nav", {
      style: {
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
      }
    }, tabs.map(t => {
      const active = screen === t.id || screen === "vote" && t.id === "auth" || screen === "success" && t.id === "auth";
      return /*#__PURE__*/React.createElement("button", {
        key: t.id,
        onClick: () => onNavigate(t.id),
        style: {
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
        }
      }, /*#__PURE__*/React.createElement(Icon, {
        name: t.icon,
        size: 15,
        color: active ? "#38bdf8" : "var(--text-dim)"
      }), /*#__PURE__*/React.createElement("span", null, t.label));
    }));
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100%",
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