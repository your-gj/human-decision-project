# Relationship Rapid Fire

20 Questions. Honest Choices. Real Compatibility.

**Live:** https://your-gj.github.io/human-decision-project/ · **Admin:** `/#admin`

- 20 questions in 6 categories (loyalty, emotional maturity, finances, future, physical intimacy, trust), 4–5 options each, answer order shuffled
- 15-minute timer with warnings at 5 min, 2 min and 30 s; auto-submits when time ends
- One question per screen, answers lock (no going back); intimacy questions can be skipped
- Submissions are encrypted on the device and stored in Firebase (`rrf/submissions`); only the admin passcode can read them
- Admin: every submission live, full report (loyalty, emotional maturity, finances, sexual compatibility, communication, commitment, conflicting answers, friction points), compare two people, download JSON + HTML report
- Five themes (Rosé default)

Edit questions in `src/data.js`, then `cd src && node build.js && cp dist/index.html ../index.html`.

The earlier Human Decision Project assessment is kept at `/classic/`.
