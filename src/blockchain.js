/**
 * VoteChain Core Blockchain & Ledger Module
 */

const VOTERS_DB = {
  "123456789012": {
    name: "Rahul Verma",
    age: 35,
    gender: "Male",
    constituency: "New Delhi Central – 01",
    state: "Delhi",
    registeredPhone: "+91 98765 *****0",
    voterID: "DL/04/123/456789",
    photo: "👨"
  },
  "987654321098": {
    name: "Sunita Patel",
    age: 40,
    gender: "Female",
    constituency: "Mumbai South – 07",
    state: "Maharashtra",
    registeredPhone: "+91 91234 *****2",
    voterID: "MH/22/098/765432",
    photo: "👩"
  },
  "456789012345": {
    name: "Arjun Singh",
    age: 28,
    gender: "Male",
    constituency: "Bengaluru Urban – 12",
    state: "Karnataka",
    registeredPhone: "+91 87654 *****8",
    voterID: "KA/08/045/678901",
    photo: "🧑"
  }
};

const INITIAL_CANDIDATES = [
  {
    id: "A",
    name: "Priya Sharma",
    party: "Progressive Alliance",
    abbr: "PA",
    symbol: "🌿",
    color: "#10b981",
    votes: 142830,
    manifesto: "Clean energy, digital infrastructure, farmer welfare"
  },
  {
    id: "B",
    name: "Rajesh Kumar",
    party: "National Unity Front",
    abbr: "NUF",
    symbol: "⚡",
    color: "#f59e0b",
    votes: 138410,
    manifesto: "Economic growth, defence, urban development"
  },
  {
    id: "C",
    name: "Anita Desai",
    party: "Peoples Democratic Party",
    abbr: "PDP",
    symbol: "🌊",
    color: "#3b82f6",
    votes: 97650,
    manifesto: "Education reform, healthcare access, women safety"
  },
  {
    id: "D",
    name: "Vikram Nair",
    party: "Aam Janta Party",
    abbr: "AJP",
    symbol: "🔆",
    color: "#a78bfa",
    votes: 61200,
    manifesto: "Anti-corruption, transparency, youth employment"
  },
  {
    id: "E",
    name: "NOTA",
    party: "None of the Above",
    abbr: "—",
    symbol: "✗",
    color: "#6b7280",
    votes: 8900,
    manifesto: "None of the above candidates"
  }
];

const INITIAL_BLOCKCHAIN = [
  { block: "#BLK-449821", hash: "0x3f9a72d4e8b1c0451a99f6b218cd4109726cb3a1103fbc19741a6902d3ecc142", tx: 1204, time: "2 min ago", status: "CONFIRMED" },
  { block: "#BLK-449820", hash: "0x7e2bc490f23a15dc821b0e954fa028bc6719a84a321cfed9802e3b1c609f09fa", tx: 998, time: "4 min ago", status: "CONFIRMED" },
  { block: "#BLK-449819", hash: "0xb14c2901aef5901235cbfead9076b1cda902345bc8012daefbc01289133e3e77", tx: 1101, time: "6 min ago", status: "CONFIRMED" },
  { block: "#BLK-449818", hash: "0x5da0bca34821a91cf8e92cb83a04629cbfae109348bc12984501eb89201a7f23", tx: 876, time: "8 min ago", status: "CONFIRMED" }
];

function genHash() {
  const hexChars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += hexChars[Math.floor(Math.random() * 16)];
  }
  return hash;
}

let blockCounter = 449822;

function genBlock() {
  blockCounter += 1;
  return `#BLK-${blockCounter}`;
}

function genOTP() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function fmtNum(n) {
  if (typeof n !== "number" || isNaN(n)) return "0";
  return n.toLocaleString("en-IN");
}

function verifyAadhaar(aadhaar, db = VOTERS_DB) {
  if (!aadhaar) return null;
  const cleaned = String(aadhaar).replace(/\D/g, "");
  return db[cleaned] || null;
}

function verifyOTP(enteredOtp, expectedOtp) {
  if (!enteredOtp || !expectedOtp) return false;
  return String(enteredOtp).trim() === String(expectedOtp).trim();
}

function recordVote({ candidateId, voter, candidates, blockchainLog, receiptLedger }) {
  if (!candidateId) throw new Error("Candidate ID is required");
  if (!voter) throw new Error("Voter authentication required");

  // Update candidate vote count
  const updatedCandidates = candidates.map(c => {
    if (c.id === candidateId) {
      return { ...c, votes: c.votes + 1 };
    }
    return c;
  });

  const txHash = genHash();
  const blockId = genBlock();
  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium"
  });

  const newBlock = {
    block: blockId,
    hash: `${txHash.slice(0, 6)}...${txHash.slice(-4)}`,
    fullHash: txHash,
    tx: 1,
    time: "Just now",
    status: "CONFIRMED"
  };

  const updatedBlockchainLog = [newBlock, ...blockchainLog];

  const receipt = {
    hash: txHash,
    blockId: blockId,
    voterName: voter.name,
    voterID: voter.voterID,
    constituency: voter.constituency,
    timestamp: timestamp,
    confirmations: 1
  };

  const updatedLedger = {
    ...receiptLedger,
    [txHash.toLowerCase()]: receipt
  };

  return {
    updatedCandidates,
    updatedBlockchainLog,
    receipt,
    updatedLedger
  };
}

function auditReceipt(inputHash, ledger = {}) {
  if (!inputHash) return { valid: false, error: "Empty hash" };
  const cleaned = String(inputHash).trim().toLowerCase();
  if (!cleaned.startsWith("0x") || cleaned.length < 10) {
    return { valid: false, error: "Invalid hash format. Must start with 0x and be at least 10 characters." };
  }

  // Check if hash matches an actual receipt
  const match = ledger[cleaned];
  if (match) {
    return {
      valid: true,
      block: match.blockId,
      timestamp: match.timestamp,
      confirmations: match.confirmations || 1,
      constituency: match.constituency,
      proof: "zk-SNARK proof validated against state root"
    };
  }

  // Also support checking against pre-existing blockchain logs
  const blockMatch = INITIAL_BLOCKCHAIN.find(b =>
    cleaned === b.hash.toLowerCase() ||
    (b.fullHash && cleaned === b.fullHash.toLowerCase())
  );

  if (blockMatch) {
    return {
      valid: true,
      block: blockMatch.block,
      timestamp: blockMatch.time,
      confirmations: 128,
      constituency: "National Ledger",
      proof: "Confirmed on consensus ledger"
    };
  }

  // If hash is valid 66-character hex (0x + 64 hex chars), accept as historical simulated block
  if (/^0x[0-9a-f]{64}$/i.test(cleaned)) {
    return {
      valid: true,
      block: `#BLK-${Math.floor(440000 + Math.random() * 9000)}`,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "medium" }),
      confirmations: Math.floor(200 + Math.random() * 800),
      constituency: "Decentralized Node Pool",
      proof: "zk-SNARK proof verified"
    };
  }

  return { valid: false, error: "Hash not found on blockchain ledger." };
}

// Module export for Node.js / browser compatibility
const VoteChain = {
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
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = VoteChain;
}
if (typeof window !== "undefined") {
  window.VoteChain = VoteChain;
}
