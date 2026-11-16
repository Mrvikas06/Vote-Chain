const { describe, it } = require("node:test");
const assert = require("node:assert");
const VoteChain = require("../src/blockchain.js");

describe("VoteChain Validation & Security Checks", () => {
  it("should validate all candidate records have required ballot fields", () => {
    VoteChain.INITIAL_CANDIDATES.forEach(candidate => {
      assert.ok(candidate.id, "Candidate must have an id");
      assert.ok(candidate.name, "Candidate must have a name");
      assert.ok(candidate.party, "Candidate must have a party");
      assert.ok(candidate.symbol, "Candidate must have an election symbol");
      assert.ok(candidate.color, "Candidate must have a theme color");
      assert.strictEqual(typeof candidate.votes, "number");
    });
  });

  it("should reject voter verification when Aadhaar input is malformed or invalid", () => {
    assert.strictEqual(VoteChain.verifyAadhaar(null), null);
    assert.strictEqual(VoteChain.verifyAadhaar(""), null);
    assert.strictEqual(VoteChain.verifyAadhaar("123"), null);
    assert.strictEqual(VoteChain.verifyAadhaar("abcdefghijkl"), null);
    assert.strictEqual(VoteChain.verifyAadhaar("123456789019"), null);
  });

  it("should strip formatting characters from Aadhaar input", () => {
    const formattedWithDashes = "1234-5678-9012";
    const voter = VoteChain.verifyAadhaar(formattedWithDashes);
    assert.ok(voter);
    assert.strictEqual(voter.name, "Rahul Verma");
  });

  it("should fail OTP verification on mismatched length or mismatched characters", () => {
    const expected = "582910";
    assert.strictEqual(VoteChain.verifyOTP("58291", expected), false);
    assert.strictEqual(VoteChain.verifyOTP("5829101", expected), false);
    assert.strictEqual(VoteChain.verifyOTP("582911", expected), false);
    assert.strictEqual(VoteChain.verifyOTP("", expected), false);
    assert.strictEqual(VoteChain.verifyOTP(null, expected), false);
    assert.strictEqual(VoteChain.verifyOTP(undefined, expected), false);
  });

  it("should produce unique cryptographic hashes for consecutive ballots", () => {
    const hash1 = VoteChain.genHash();
    const hash2 = VoteChain.genHash();
    const hash3 = VoteChain.genHash();
    assert.notStrictEqual(hash1, hash2);
    assert.notStrictEqual(hash2, hash3);
    assert.notStrictEqual(hash1, hash3);
  });

  it("should reject vote submission without authenticated voter or candidate", () => {
    const candidates = [...VoteChain.INITIAL_CANDIDATES];
    const blockchainLog = [...VoteChain.INITIAL_BLOCKCHAIN];
    const receiptLedger = {};

    assert.throws(() => {
      VoteChain.recordVote({
        candidateId: null,
        voter: VoteChain.VOTERS_DB["123456789012"],
        candidates,
        blockchainLog,
        receiptLedger
      });
    }, /Candidate ID is required/);

    assert.throws(() => {
      VoteChain.recordVote({
        candidateId: "A",
        voter: null,
        candidates,
        blockchainLog,
        receiptLedger
      });
    }, /Voter authentication required/);
  });

  it("should correctly handle voting for NOTA without altering political candidates", () => {
    const candidates = [...VoteChain.INITIAL_CANDIDATES];
    const blockchainLog = [...VoteChain.INITIAL_BLOCKCHAIN];
    const voter = VoteChain.VOTERS_DB["456789012345"];

    const initialNota = candidates.find(c => c.id === "E").votes;
    const initialCandA = candidates.find(c => c.id === "A").votes;

    const result = VoteChain.recordVote({
      candidateId: "E",
      voter,
      candidates,
      blockchainLog,
      receiptLedger: {}
    });

    const updatedNota = result.updatedCandidates.find(c => c.id === "E").votes;
    const updatedCandA = result.updatedCandidates.find(c => c.id === "A").votes;

    assert.strictEqual(updatedNota, initialNota + 1);
    assert.strictEqual(updatedCandA, initialCandA);
  });
});
