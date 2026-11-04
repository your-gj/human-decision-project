# The Human Decision Project

Advanced Personality, Responsibility & Life Compatibility Assessment.

**Live:** https://your-gj.github.io/human-decision-project/

- 38 timed situations in 18 minutes: 30 judgement scenarios plus 8 intimacy and sexual-compatibility questions mixed in (18+ confirmation required; intimacy questions can be left unanswered)
- Mobile-first: thumb-reach buttons, auto-advance on answer, swipe between questions, question map
- Autosave, timed warnings, auto-submit, locked answers after submission
- Administrator dashboard (`#admin`): every submission from every device, with a full analysis for each, no downloading

## Submissions (Firebase, end-to-end encrypted)
Each submission is encrypted on the participant's phone (RSA-OAEP + AES-GCM) and stored in Firebase Realtime Database at `hdp/submissions`. Only the admin passcode can unlock the private key (`src/keys/admin-keys.json`, PBKDF2-protected), so the stored data is unreadable without it. Open `/#admin` and enter the passcode to see every submission.

## Editing questions
Edit `src/data.js`, then: `cd src && node build.js && cp dist/index.html ../index.html`
