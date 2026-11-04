# The Human Decision Project

Advanced Personality, Responsibility & Life Compatibility Assessment.

**Live:** https://your-gj.github.io/human-decision-project/

- 38 timed situations in 18 minutes: 30 judgement scenarios plus 8 intimacy and sexual-compatibility questions mixed in (18+ confirmation required; intimacy questions can be left unanswered)
- Mobile-first: thumb-reach buttons, auto-advance on answer, swipe between questions, question map
- Autosave, timed warnings, auto-submit, locked answers after submission
- Administrator dashboard (`#admin`): every submission from every device, with a full analysis for each, no downloading

## Collect submissions from all devices (free, 5 minutes)
1. Create a Google Sheet → **Extensions → Apps Script** → paste `backend/Code.gs`.
2. Change `ADMIN_KEY` in that file to your own private key. Save.
3. **Deploy → New deployment → Web app** · Execute as **Me** · Access **Anyone** → copy the `/exec` URL.
4. In `index.html`, set `const SUBMIT_URL = "https://script.google.com/macros/s/…/exec";` and commit.
5. Open `/#admin` and enter your `ADMIN_KEY`.

Without step 4 the site still works offline: submissions stay on the device and can be exported/imported as JSON.

## Editing questions
Edit `src/data.js`, then: `cd src && HDP_SUBMIT_URL="<your url>" node build.js && cp dist/index.html ../index.html`
