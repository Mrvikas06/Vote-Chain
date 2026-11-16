const puppeteer = require("puppeteer-core");
const fs = require("node:fs");

function findChromePath() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

async function runFullInteractiveUITest() {
  const chromePath = findChromePath();
  if (!chromePath) {
    console.log("Chrome executable not found on this environment; skipping headless browser UI tests.");
    return;
  }

  console.log("=== STARTING FULL INTERACTIVE UI TEST ===");
  console.log("Using Chrome at:", chromePath);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  page.on("console", msg => {
    if (msg.type() === "error") {
      console.log(`[BROWSER ERROR] ${msg.text()}`);
    }
  });

  page.on("pageerror", err => {
    console.error(`[PAGE ERROR] ${err.toString()}`);
  });

  try {
    console.log("1. Loading Landing Screen...");
    await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle0" });
    const title = await page.title();
    console.log("   Title:", title);

    const cardsText = await page.$$eval(".card", cards => cards.map(c => c.innerText));
    console.log("   Found", cardsText.length, "cards on page.");

    console.log("2. Clicking 'Cast Your Vote' button...");
    const voteBtn = await page.waitForSelector("button.btn-primary");
    await voteBtn.click();
    await new Promise(r => setTimeout(r, 800));

    console.log("3. Testing Auth Screen (Aadhaar step)...");
    const demoChip = await page.waitForSelector(".demo-chip");
    await demoChip.click();
    console.log("   Clicked demo quick-fill chip.");

    const verifyAadhaarBtn = await page.waitForSelector("button.btn-primary:not(:disabled)");
    await verifyAadhaarBtn.click();
    console.log("   Clicked 'VERIFY & SEND OTP ->'. Waiting for OTP step...");
    await new Promise(r => setTimeout(r, 1800));

    console.log("4. Testing OTP Step...");
    const otpLink = await page.$('span[style*="cursor: pointer"], span[style*="cursor:pointer"], .demo-chip');
    if (otpLink) {
      await otpLink.click();
      console.log("   Clicked demo OTP link.");
    }
    const verifyOtpBtn = await page.waitForSelector("button.btn-primary:not(:disabled)");
    await verifyOtpBtn.click();
    console.log("   Clicked 'VERIFY OTP ->'. Waiting for biometric scan...");

    console.log("5. Waiting for Biometric Scan (5-7 seconds)...");
    await page.waitForFunction(() => {
      const h2 = document.querySelector("h2");
      return h2 && h2.innerText.includes("Select Your Candidate");
    }, { timeout: 15000 });
    console.log("   Biometric scan succeeded! Candidate screen loaded.");

    console.log("6. Selecting candidate and confirming...");
    const firstCandidate = await page.$('div[style*="cursor: pointer"], div[style*="cursor:pointer"]');
    await firstCandidate.click();
    console.log("   Candidate selected.");

    const proceedBtn = await page.waitForSelector("button.btn-primary:not(:disabled)");
    await proceedBtn.click();
    console.log("   Clicked 'PROCEED WITH VOTE'.");

    await new Promise(r => setTimeout(r, 400));
    const confirmBtn = await page.waitForSelector("button.btn-primary:not(:disabled)");
    await confirmBtn.click();
    console.log("   Clicked 'Confirm'. Recording on blockchain (encryption sequence)...");

    await page.waitForFunction(() => {
      const h2 = document.querySelector("h2");
      return h2 && h2.innerText.includes("Vote Recorded");
    }, { timeout: 15000 });
    console.log("   Vote recorded on blockchain! Success Screen loaded.");

    const receiptText = await page.$eval(".card", c => c.innerText);
    console.log("   Receipt preview:\n", receiptText.split("\n").slice(0, 8).join(" | "));

    console.log("7. Clicking 'Verify' to test Public Audit Portal...");
    const verifyReceiptBtn = (await page.$$("button.btn-ghost"))[0];
    await verifyReceiptBtn.click();
    await new Promise(r => setTimeout(r, 800));

    const auditHeader = await page.$eval("h2", h => h.innerText);
    console.log("   Audit portal loaded with header:", auditHeader);

    const textareaVal = await page.$eval("textarea", t => t.value);
    console.log("   Audit textarea contains hash:", textareaVal ? textareaVal.slice(0, 15) + "..." : "EMPTY");

    const verifyOnChainBtn = await page.waitForSelector("button.btn-primary:not(:disabled)");
    await verifyOnChainBtn.click();
    console.log("   Clicked 'VERIFY ON CHAIN ->'. Waiting for query log...");

    await page.waitForFunction(() => {
      return document.body.innerText.includes("Vote Verified on Blockchain");
    }, { timeout: 15000 });
    console.log("   Vote verification confirmed on ledger!");

    console.log("8. Testing Results Screen...");
    const resultsTab = (await page.$$("nav button, div[style*='position: fixed; bottom: 0'] button, div[style*='position: fixed'] button"))[2];
    await resultsTab.click();
    await new Promise(r => setTimeout(r, 800));

    const resultsHeader = await page.$eval("h2", h => h.innerText);
    console.log("   Results header:", resultsHeader);
    const leadingCandidate = await page.$eval(".card h3", h => h.innerText);
    console.log("   Leading candidate:", leadingCandidate);

    console.log("9. Testing Home Screen live feed update...");
    const homeTab = (await page.$$("nav button, div[style*='position: fixed; bottom: 0'] button, div[style*='position: fixed'] button"))[0];
    await homeTab.click();
    await new Promise(r => setTimeout(r, 800));

    const firstBlock = await page.$eval("table tbody tr td", td => td.innerText);
    console.log("   Latest block in live feed:", firstBlock);

    console.log("\n=== ALL WORKFLOW STEPS PASSED SUCCESSFULLY ===");

  } catch (err) {
    console.error("UI Test failed at step:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runFullInteractiveUITest();
