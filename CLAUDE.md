# CLAUDE.md

## Tech Stack
- Plain HTML, CSS, and JavaScript only.
- No frameworks or libraries (no React, Vue, Tailwind, etc.).
- No build step: files are opened or served exactly as written.

## Project Structure
The project is nearly empty for now.
- `CLAUDE.md` — this file, at the top level of the repository.
- New HTML, CSS, and JavaScript files will be added as the project grows; update this section when they are.

## Key Requirements
1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.

## Feature Plan

### Site structure
One long scrolling page (`index.html`), built once from the Lesson 5 slides (E227, PDF).
1. **Header**: "E227 Technologies for Integrated Digital Delivery — Lesson 5", the light/dark theme switch, and a menu of section links. No school logo.
2. **Intro**: lesson title, lesson outcomes, and the opening scenario (new extension building) with its picture.
3. **Five lesson sections**, one per category, each with its slide picture, a short explanation, and a 1–2 question self-check:
   Reality Capture · BIM Modelling · BIM Coordination · Simulation & Analysis · Computational & AI-assisted Design
4. **Quick-reference table**: every category, what it involves, and examples (from slide 15). On phones it turns into stacked cards.

Left out: admin slides (module outline, submission, Lesson 6/7 notes, lesson plan), the simulator game, and "The End".

### How students move between sections
- Scroll straight down, or jump to a section using the header's menu (a menu button on phones).
- The header stays at the top while scrolling, and a "Back to top" link ends each section.
- Tapping a picture opens it full size.

### Phases
**Phase 1: Course from the slides**
- Build the page above in plain HTML, CSS, and JS: responsive, and light theme by default.
- Self-checks: tap an answer to see right/wrong plus a one-line reason. Nothing is saved or graded.
- The teacher reviews the self-check questions before they're final.

**Phase 2: Check and polish**
- Test on desktop, tablet, and phone, in both themes.
- Fix wording and layout issues from the teacher's review.

**Later phases**: to be decided with the teacher.

## Rules for Claude
- Explain technical terms in plain language.
- Ask before making big changes.
- When something is unclear, ask rather than guess.
