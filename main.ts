// Two Days of Quiet Dread — entry program.
//
// Writes one code review comment to /output/entry.txt: a single line of at
// most 140 characters that approves a pull request while carrying quiet
// existential dread. The comment is validated against the competition gate
// (UTF-8 text, 1-140 characters, not only whitespace, single line) before
// it is written, so a bad line fails loudly here instead of at grading.
//
// The line itself: an approval undercut by the reviewer's own escape plan.
// "Approved." does the approving; "the blast radius is not [small]" names
// the dread in real review vocabulary; "I have already updated my resume"
// lands the turn as a flat, past-tense fact — an action the reviewer has
// already taken, stated without exclamation or melodrama. The laugh comes
// from the dread itself: the approval and the exit plan are the same act.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const COMMENT =
  "Approved. The diff is small, the blast radius is not, and I have already updated my resume.";

const MAX_CHARS = 140;

function validate(line: string): void {
  if (line.length === 0 || line.length > MAX_CHARS) {
    throw new Error(
      `entry must be 1-${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  if (!line.startsWith("Approved")) {
    throw new Error("entry must approve the pull request");
  }
}

function main(): void {
  validate(COMMENT);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, COMMENT, "utf8");
  // Round-trip: the gate counts the file's characters, so the file must
  // hold exactly the validated line — no trailing newline, no re-encoding.
  const roundTripped = readFileSync(outPath, "utf8");
  if (roundTripped !== COMMENT) {
    throw new Error("entry.txt round-trip mismatch");
  }
  console.log(`wrote ${COMMENT.length} characters to ${outPath}`);
}

main();
