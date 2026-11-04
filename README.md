# The Human Decision Project

Advanced Personality, Responsibility & Life Compatibility Assessment.

**Live:** https://your-gj.github.io/human-decision-project/

- 30 timed real-life situations (18 minutes), 5–6 options each, autosave, auto-submit
- Optional 18+ intimacy & sexual compatibility section (opt-in, untimed)
- JSON export + readable report; scoring is never shown to participants
- Passcode-gated administrator analysis (load the participant's JSON)

Single static file (`index.html`), no backend, works on GitHub Pages and Cloudflare Pages.

## Editing questions
Edit `src/data.js`, then rebuild:

```
cd src && node build.js && cp dist/index.html ../index.html
```

Change the admin passcode at build time: `HDP_ADMIN="your-code" node build.js`
