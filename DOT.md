# How to do a job

This repo carries Gujarati translation jobs from Material Studio, an app that writes study packages for the GPSC
(Gujarat Public Service Commission) Class 1/2 exams. Each folder in `jobs/` is one job.

## Jobs arrive as pull requests

A job arrives as a pull request whose branch, `job/<name>`, adds one folder: `jobs/<name>/`. Work on that PR's
branch: commit your files to the PR branch itself, then comment on the PR with `DONE` on the first line, followed by
your report. If you can't finish, comment `STUCK` on the first line and say why.

**The PR comment is the only signal the app reads.** A report in chat or anywhere else is not seen, and the job
waits forever. Every job ends with a `DONE` or `STUCK` comment on its PR, even if you also report elsewhere.

When new commits wake you on a PR, look at who made the newest commit:
- **You:** nothing to do (you already commented DONE).
- **Anyone else:** usually the app has added `problems.md`, which lists what its checker found. Fix those problems
  in `out/`, run the check again until it prints PASS, commit, and comment `DONE` again.

**Several jobs at once:** up to 3 job PRs may be open together. They're independent; work on them in parallel if you
can, each on its own branch.

## Steps

1. Copy the whole job folder onto your computer, keeping the layout (`jobs/<name>/`).
2. Read `instructions.md`. It holds the full translation brief. The English source is `inputs/english.json`.
3. Use the Gujarati textbooks already on your computer, in `/workspace/shared/GPSC_GUJ_34_Files_2026-10-02/`.
   Start with `GPSC_GUJ_00_MASTER_SYLLABUS_AND_AGGREGATOR_GUIDE.pdf` to find the chapters for the job's subject,
   then read those chapters (extract the text with a tool such as `pdftotext -f <first> -l <last> <file> -`). Use
   their terminology and natural phrasing. The instructions may call this library "the ChatGPT project named
   Gujarati Medium Books": it is the same set of PDFs.
4. Write your translation to `out/gujarati.json`: a JSON array with one object per English page, in the same order,
   each with exactly `artifact_id` (copied from English), `title` and `body` (Gujarati HTML).
5. Run `node check.mjs` inside the job folder. Fix what it reports and run it again until it prints PASS.
6. Commit only the files in `out/`, to the PR branch. Never commit to `main`.
7. Comment on the PR: `DONE` on the first line, then a short report: whether the check printed PASS, how many tries
   it took, and which textbook files and page ranges you actually opened.

Leave `instructions.md`, `check.mjs` and `inputs/` as they are: they're the job's record.

## The standard

These pages become study material that GPSC candidates read in Gujarati. Treat each one as work you'd sign your name to.

- **Passing the check is the floor, not the goal.** The checker only catches format mistakes. Before you commit,
  reread your Gujarati as a demanding Gujarati-medium teacher would, and fix anything that sounds translated.
- **Faithful first.** Keep the exact meaning, qualifiers and level of certainty of the English. Don't add facts,
  examples or explanations, and don't narrow or widen a term (for example "food" is not "grain", "cattle" is not
  "cows and buffaloes").
- **Natural Gujarati.** Use the terms GCERT Gujarati-medium textbooks use. Avoid leaving English words in Gujarati
  sentences when a standard Gujarati term exists.
- **Citations stay exactly as written.** Anything inside square brackets `[ … ]` is a source citation: copy it
  character for character, even the English parts.
- **Structure stays the same.** Keep every heading, paragraph, list, table and callout, and the same number of bold
  and italic phrases in each paragraph. Their order inside a paragraph may change to suit Gujarati.
- **Report honestly.** Name only the textbook pages you really opened. If a book didn't help, say so.
