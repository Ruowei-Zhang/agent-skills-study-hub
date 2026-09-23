// Post-build workaround for Next.js on Windows (vercel/next.js#92339,
// fix PR #92340 not yet merged as of 16.2.6).
//
// On Windows, static export writes client-segment-cache payloads to nested
// directories (e.g. out/docs/overview/__next.docs/$d$slug/__PAGE__.txt)
// because path.relative() yields backslashes that never get converted to
// dots. The browser, however, requests the flat dotted name
// (/docs/overview/__next.docs.$d$slug.__PAGE__.txt, per
// convertSegmentPathToStaticExportFilename in next/dist), so every RSC
// soft-navigation/prefetch request 404s. Linux/macOS builds are unaffected.
//
// This script flattens those directories (at any depth) into the dotted
// files the client expects, then removes the emptied directories.
// Safe to run on any OS: a no-op when no __next.* directories exist.
import { readdirSync, statSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const OUT_DIR = fileURLToPath(new URL("../out", import.meta.url));

let flattened = 0;

// Recursively collect every file under `dir`, flattening the path chain
// into dotted filenames placed next to the top-level __next.* directory.
// e.g. __next.docs/$d$slug/__PAGE__.txt -> __next.docs.$d$slug.__PAGE__.txt
function flattenInto(topDir, dir, prefix) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const dottedName = `${prefix}.${entry}`;
    if (statSync(full).isDirectory()) {
      flattenInto(topDir, full, dottedName);
    } else {
      const dest = join(topDir, dottedName);
      if (!existsSync(dest)) copyFileSync(full, dest);
      flattened++;
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) continue;
    if (entry.startsWith("__next.")) {
      flattenInto(dir, full, entry);
      rmSync(full, { recursive: true, force: true });
    } else {
      walk(full);
    }
  }
}

walk(OUT_DIR);
console.log(`postbuild: flattened ${flattened} segment-cache file(s).`);
