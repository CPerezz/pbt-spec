import { buildSync } from "esbuild";
import { writeFileSync, readFileSync } from "fs";
import { createRequire } from "module";

// Step 1: Bundle JSX → CJS module that exports the component
buildSync({
  entryPoints: ["pbt-spec-final.jsx"],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: ".build-tmp.cjs",
  jsx: "automatic",
  external: ["react", "react-dom"],
  logLevel: "warning",
});

// Step 2: Require the bundled module and render to HTML
const require = createRequire(import.meta.url);
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

// Clear module cache to pick up fresh build
delete require.cache[require.resolve("./.build-tmp.cjs")];
const mod = require("./.build-tmp.cjs");
const Component = mod.default || mod;

const bodyHtml = renderToStaticMarkup(React.createElement(Component));

// Step 3: Read CSS from existing index.html head (or use inline styles from JSX)
// Since the JSX uses inline styles, we just need a minimal HTML shell
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PBT — Partitioned Binary Tree Specification</title>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; padding: 0; }
    button { font: inherit; }
    code { font: inherit; }
  </style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

writeFileSync("index.html", html);
console.log("Built index.html (" + Math.round(html.length / 1024) + " KB)");

// Clean up temp file
import("fs").then((fs) => fs.unlinkSync(".build-tmp.cjs")).catch(() => {});
