# VoteChain - Blockchain E-Voting System

VoteChain is a secure, decentralized electronic voting prototype engineered to demonstrate tamper-evident ballot recording, end-to-end voter anonymity through zero-knowledge proofs (zk-SNARK simulations), multi-factor voter authentication, and real-time verifiable election tallying.

## Live Deployment

The system is deployed on GitHub Pages:
https://mrvikas06.github.io/Vote-chain/

## Key Features

- Multi-Factor Voter Authentication: Two-factor authentication pipeline combining 12-digit Aadhaar registry lookup, dynamic one-time password (OTP) verification, and biometric verification simulation.
- Immutable Ledger: Append-only distributed ledger structure with cryptographic block hashing, transaction indexing, and consensus validation.
- Anonymized Balloting: Ballots are decoupled from voter identity using cryptographic hash receipts and zero-knowledge verification mechanisms.
- Dynamic Tallying: Smart contract auto-tally logic that recalculates candidate vote distribution immediately upon transaction confirmation.
- Public Audit Portal: Ledger verification portal allowing voters and independent auditors to validate receipt hashes against committed blocks.

## Technology Stack

- Runtime: Node.js (v18+)
- Frontend Framework: React 18
- Cryptography and State: Pure JavaScript cryptographic hashing, state tracking, and ledger verification
- Styling: Custom CSS with CSS variables, responsive grid layouts, and hardware-accelerated animations
- Test Suite: Node.js native test runner (`node:test`, `node:assert`)
- Continuous Integration: GitHub Actions

## Architecture Overview

```
+--------------------------------------------------------------------+
|                         Presentation Layer                         |
|   Landing Screen  |  Auth Screen  |  Vote Screen  |  Audit Portal  |
+---------------------------------+----------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
|                         Application State                          |
|    Candidates State   |   Blockchain Log   |    Receipt Ledger     |
+---------------------------------+----------------------------------+
                                  |
                                  v
+--------------------------------------------------------------------+
|                      VoteChain Core Engine                         |
| - verifyAadhaar()     - verifyOTP()        - recordVote()          |
| - genHash()           - genBlock()         - auditReceipt()        |
+--------------------------------------------------------------------+
```

### Transaction Lifecycle

1. Authentication: Voter submits 12-digit Aadhaar credential, verifies one-time passcode, and passes biometric scan verification.
2. Selection and Encryption: Voter selects preferred candidate; ballot payload is encrypted and signed.
3. Consensus Endorsement: Simulated Raft consensus protocol commits the transaction into a newly minted block.
4. Ledger Record: State stores the block, updates the candidate tally, and records the receipt hash into the audit ledger.
5. Receipt and Verification: Voter receives a 64-character cryptographic hash for independent verification on the public audit portal.

## Project Structure

```
Vote-chain/
├── .github/
│   └── workflows/
│       └── ci.yml             # Continuous integration workflow
├── css/
│   └── style.css              # Core styling and responsive definitions
├── src/
│   └── blockchain.js          # Core ledger, cryptography, and voting engine
├── test/
│   ├── blockchain.test.js     # Unit tests for core ledger operations
│   └── validation.test.js     # Validation and security edge case tests
├── .gitignore                 # Git ignore configuration
├── index.html                 # Main single-page application entry point
├── package.json               # Project manifest, metadata, and scripts
└── README.md                  # System documentation
```

## Demo Credentials

The prototype contains the following pre-configured voter accounts for demonstration and testing:

| Aadhaar Number | Voter Name | Parliamentary Constituency | State |
|---|---|---|---|
| `123456789012` | Rahul Verma | New Delhi Central - 01 | Delhi |
| `987654321098` | Sunita Patel | Mumbai South - 07 | Maharashtra |
| `456789012345` | Arjun Singh | Bengaluru Urban - 12 | Karnataka |

## Installation and Local Setup

### Prerequisites

- Node.js version 18.0.0 or higher
- npm version 9.0.0 or higher

### Clone the Repository

```bash
git clone https://github.com/Mrvikas06/Vote-chain.git
cd Vote-chain
```

### Running Locally

Serve the application using any static HTTP server:

```bash
npx serve .
```

Alternatively, open `index.html` directly in any modern web browser supporting ES6 and HTML5.

## Testing and Verification

Run the automated test suite using the native Node.js test runner:

```bash
npm test
```

The test suite validates:
- Aadhaar number verification and formatting normalization
- 6-digit OTP generation and validation
- Cryptographic SHA-style 64-character hex hash uniqueness
- Candidate ballot counting and state immutability
- Ledger block generation and transaction indexing
- Public audit portal receipt verification logic
- NOTA and edge-case ballot processing

## Core API Reference

The core engine in `src/blockchain.js` exports the following methods:

- `verifyAadhaar(aadhaar: string, db?: object): object | null`
  Validates a voter's 12-digit Aadhaar number against the registered voter database.

- `verifyOTP(enteredOtp: string, expectedOtp: string): boolean`
  Compares entered verification code with expected dispatch code.

- `genHash(): string`
  Generates a 66-character prefixed hexadecimal cryptographic transaction hash.

- `genBlock(): string`
  Generates an incremental block identifier.

- `recordVote(params: object): object`
  Processes ballot submission, updates candidate totals, appends a confirmed block to the blockchain log, and creates an audit receipt.

- `auditReceipt(hash: string, ledger?: object): object`
  Performs verification of a transaction hash against the state ledger and returns block metadata.

## Contribution Guidelines

1. Fork the repository on GitHub.
2. Create a topic branch: `git checkout -b feature/improvement-name`.
3. Ensure all unit tests pass: `npm test`.
4. Commit your changes with clear, descriptive commit messages.
5. Push to your branch: `git push origin feature/improvement-name`.
6. Open a Pull Request detailing the changes and verification steps.

## License

This project is licensed under the MIT License. See `package.json` for details.
