# Translate 1 Material pages into Gujarati

Follow DOT.md. The full translation brief the app normally sends is below, unchanged, with two differences for this job:

- **Where to write the answer:** wherever the brief says to return or reply with the JSON, write that JSON array to
  `out/gujarati.json` instead (one object per page with exactly `artifact_id`, `title`, `body`).
- **The books:** the brief names the ChatGPT project "Gujarati Medium Books". The same PDFs are on your computer in
  `/workspace/shared/GPSC_GUJ_34_Files_2026-10-02/`. Start with `GPSC_GUJ_00_MASTER_SYLLABUS_AND_AGGREGATOR_GUIDE.pdf`.

The English pages are also in `inputs/english.json` (the same content as the English JSON inside the brief).
When `node check.mjs` prints PASS, commit `out/` and comment DONE.

---

TEST JOB (end-to-end check of the job loop).

Translate the one English Material page in inputs/english.json into natural academic Gujarati for GPSC Class 1/2 candidates, following the standard in DOT.md. Use the Gujarati textbooks for terminology. Return a JSON array with one object: artifact_id (copied), title, body (Gujarati HTML with the same structure).
