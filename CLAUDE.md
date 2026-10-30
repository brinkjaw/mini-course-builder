# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened or served exactly as written.

## Project Structure
- `index.html` — the whole course: header, all sections, and their content.
- `styles.css` — all styling, with light/dark colours defined at the top.
- `script.js` — theme switch, section switching, self-checks, full-size picture viewer.
- `images/` — slide pictures extracted from the Lesson 5 PDF (the deck itself is not in the repo).
- `CLAUDE.md` — this file.

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Feature Plan

### Site structure
One page (`index.html`) showing one section at a time, built once from the Lesson 5 slides (E227, PDF).
1. **Header**: "E227 Technologies for Integrated Digital Delivery — Lesson 5", the light/dark theme switch, and a menu of section links. No school logo.
2. **Intro**: lesson title, lesson outcomes, and the opening scenario (new extension building) with its picture.
3. **Five lesson sections**, one per category, each with its slide picture, a short explanation, and one check-in question on its key idea:
   Reality Capture · BIM Modelling · BIM Coordination · Simulation & Analysis · Computational & AI-assisted Design
4. **Quick-reference table**: every category, what it involves, and examples (from slide 15). On phones it turns into stacked cards.

Left out: admin slides (module outline, submission, Lesson 6/7 notes, lesson plan), the simulator game, and "The End".

### How students move between sections
- JavaScript shows one section at a time; no separate pages.
- Move with the header's menu (a menu button on phones) or the Previous/Next links at the end of each section.
- The address bar tracks the section (e.g. `#bim-coordination`), so the Back button and shared links work.
- Without JavaScript, all sections show as one long page.
- Tapping a picture opens it full size.

### Phases
**Phase 1: Course from the slides**
- Build the page above in plain HTML, CSS, and JS: responsive, and light theme by default. Styling stays plain until it works; design comes later.
- Check-ins: one per technology section, multiple choice or short answer, one try. The page shows right/wrong, the correct answer and a one-line reason, then a "Continue to…" link. Prev/Next always work. Nothing is saved or graded.
- The teacher reviews the check-in questions before they're final.

**Phase 2: Check and polish**
- Test on desktop, tablet, and phone, in both themes.
- Fix wording and layout issues from the teacher's review.

**Later phases**: to be decided with the teacher.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- When something is unclear, ask rather than guess.
