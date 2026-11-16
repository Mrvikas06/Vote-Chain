const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

async function build() {
  console.log("Compiling src/App.jsx to js/app.js...");
  const babelRes = await fetch("https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js");
  const babelCode = await babelRes.text();
  const ctx = { window: {}, console: console };
  vm.createContext(ctx);
  vm.runInContext(babelCode, ctx);
  const Babel = ctx.Babel || ctx.window.Babel;

  const sourceFile = path.join(__dirname, "..", "src", "App.jsx");
  if (!fs.existsSync(sourceFile)) {
    console.error("Source file src/App.jsx not found!");
    process.exit(1);
  }

  const rawCode = fs.readFileSync(sourceFile, "utf8");
  const wrappedCode = `(function() {\n${rawCode}\n})();`;
  const transformed = Babel.transform(wrappedCode, { presets: ["react"] });
  const outDir = path.join(__dirname, "..", "js");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "app.js"), transformed.code, "utf8");
  console.log("Built js/app.js successfully! Length:", transformed.code.length);
}

build();
