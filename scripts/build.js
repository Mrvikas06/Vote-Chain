const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

async function build() {
  console.log("Fetching Babel for pre-compilation...");
  const babelRes = await fetch("https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js");
  const babelCode = await babelRes.text();
  const ctx = { window: {}, console: console };
  vm.createContext(ctx);
  vm.runInContext(babelCode, ctx);
  const Babel = ctx.Babel || ctx.window.Babel;

  const html = fs.readFileSync("index.html", "utf8");
  const match = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
  if (!match) {
    console.error("No babel script found in index.html");
    return;
  }

  const rawCode = match[1];
  const transformed = Babel.transform(rawCode, { presets: ["react"] });
  fs.mkdirSync("js", { recursive: true });
  fs.writeFileSync("js/app.js", transformed.code, "utf8");
  console.log("Built js/app.js successfully! Length:", transformed.code.length);
}

build();
