const { describe, it } = require("node:test");
const assert = require("node:assert");
const VoteChain = require("../src/blockchain.js");

describe("VoteChain Core Module", () => {
  it("should have pre-configured voters in the database", () => {
    assert.ok(VoteChain.VOTERS_DB["123456789012"]);
    assert.strictEqual(VoteChain.VOTERS_DB["123456789012"].name, "Rahul Verma");
    assert.strictEqual(VoteChain.VOTERS_DB["987654321098"].name, "Sunita Patel");
    assert.strictEqual(VoteChain.VOTERS_DB["456789012345"].name, "Arjun Singh");
  });

  it("should verify Aadhaar number accurately", () => {
    const voter = VoteChain.verifyAadhaar("123456789012");
    assert.ok(voter);
    assert.strictEqual(voter.name, "Rahul Verma");

    // Formatted with spaces
    const voterWithSpaces = VoteChain.verifyAadhaar("1234 5678 9012");
    assert.ok(voterWithSpaces);
    assert.strictEqual(voterWithSpaces.name, "Rahul Verma");

    // Invalid Aadhaar
    const invalidVoter = VoteChain.verifyAadhaar("000000000000");
    assert.strictEqual(invalidVoter, null);
  });

  it("should generate and verify 6-digit OTP", () => {
    const otp = VoteChain.genOTP();
    assert.strictEqual(otp.length, 6);
    assert.match(otp, /^\d{6}$/);

    assert.strictEqual(VoteChain.verifyOTP(otp, otp), true);
    assert.strictEqual(VoteChain.verifyOTP(otp, "000000"), false);
  });

  it("should generate valid 64-character hex cryptographic hashes", () => {
    const hash = VoteChain.genHash();
    assert.ok(hash.startsWith("0x"));
    assert.strictEqual(hash.length, 66);
    assert.match(hash, /^0x[0-9a-f]{64}$/);
  });

  it("should format numbers according to Indian locale standard", () => {
    assert.strictEqual(VoteChain.fmtNum(1000), "1,000");
    assert.strictEqual(VoteChain.fmtNum(142830), "1,42,830");
    assert.strictEqual(VoteChain.fmtNum(0), "0");
    assert.strictEqual(VoteChain.fmtNum(null), "0");
  });

  it("should record a vote, increment candidate count, and append block to ledger", () => {
    const initialCandidates = [...VoteChain.INITIAL_CANDIDATES];
    const initialBlockchain = [...VoteChain.INITIAL_BLOCKCHAIN];
    const initialLedger = {};
    const voter = VoteChain.VOTERS_DB["123456789012"];

    const initialVotesA = initialCandidates.find(c => c.id === "A").votes;

    const result = VoteChain.recordVote({
      candidateId: "A",
      voter,
      candidates: initialCandidates,
      blockchainLog: initialBlockchain,
      receiptLedger: initialLedger
    });

    // Check candidate tally incremented
    const updatedVotesA = result.updatedCandidates.find(c => c.id === "A").votes;
    assert.strictEqual(updatedVotesA, initialVotesA + 1);

    // Check blockchain log updated
    assert.strictEqual(result.updatedBlockchainLog.length, initialBlockchain.length + 1);
    assert.ok(result.updatedBlockchainLog[0].block.startsWith("#BLK-"));
    assert.strictEqual(result.updatedBlockchainLog[0].status, "CONFIRMED");

    // Check receipt created
    assert.ok(result.receipt.hash.startsWith("0x"));
    assert.strictEqual(result.receipt.voterID, voter.voterID);

    // Check receipt recorded in ledger
    assert.ok(result.updatedLedger[result.receipt.hash.toLowerCase()]);
  });

  it("should audit and verify receipt hash from ledger", () => {
    const voter = VoteChain.VOTERS_DB["123456789012"];
    const initialCandidates = [...VoteChain.INITIAL_CANDIDATES];
    const initialBlockchain = [...VoteChain.INITIAL_BLOCKCHAIN];

    const result = VoteChain.recordVote({
      candidateId: "B",
      voter,
      candidates: initialCandidates,
      blockchainLog: initialBlockchain,
      receiptLedger: {}
    });

    const receiptHash = result.receipt.hash;

    // Verify valid receipt
    const auditRes = VoteChain.auditReceipt(receiptHash, result.updatedLedger);
    assert.strictEqual(auditRes.valid, true);
    assert.strictEqual(auditRes.block, result.receipt.blockId);

    // Verify invalid hash
    const invalidRes = VoteChain.auditReceipt("0xinvalid", result.updatedLedger);
    assert.strictEqual(invalidRes.valid, false);

    // Verify empty hash
    const emptyRes = VoteChain.auditReceipt("", result.updatedLedger);
    assert.strictEqual(emptyRes.valid, false);
  });
});
