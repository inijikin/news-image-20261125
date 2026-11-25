// news-image-20261125 — entry program (Node 22, standard library only).
// Copies the entry.png shipped in this repository to the grader's output
// directory. No network, no timestamps, no randomness: the same input bytes
// always produce the same output bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const here = dirname(fileURLToPath(import.meta.url));

// Create the output folder if it is missing. Never delete it: the grader
// mounts /output and deleting the folder itself fails the run.
mkdirSync(outDir, { recursive: true });

const src = join(here, 'entry.png');
const dst = join(outDir, 'entry.png');

// Fail fast instead of shipping an invalid entry: the gate refuses any
// image over 1 MiB, so refuse to copy one here with a clear error.
const srcBytes = statSync(src).size;
if (srcBytes > 1048576) {
  console.error(`entry.png is ${srcBytes} bytes, over the 1048576-byte gate; refusing to copy`);
  process.exit(1);
}

copyFileSync(src, dst);

// Verify the copy landed whole: a truncated output would fail the gate.
const dstBytes = statSync(dst).size;
if (dstBytes !== srcBytes) {
  console.error(`copy mismatch: wrote ${dstBytes} of ${srcBytes} bytes`);
  process.exit(1);
}
