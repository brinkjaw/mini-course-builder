// Mini-course behaviour: theme switch, one-section-at-a-time navigation,
// self-checks, and the full-size picture viewer.

// ---------- Theme (light by default, remembered in this browser) ----------
const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const themeLabel = themeButton.querySelector(".theme-label");

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  const dark = theme === "dark";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeLabel.textContent = dark ? "Light" : "Dark";
  themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
}

applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");

themeButton.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) {}
});

// ---------- Section switching ----------
const sections = Array.from(document.querySelectorAll("main .section"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const nav = document.querySelector(".site-nav");
const menuButton = document.querySelector(".menu-toggle");

function sectionTitle(section) {
  return section.querySelector("h2, h1").textContent;
}

// Add "Previous" / "Next" links to the bottom of each section.
sections.forEach((section, i) => {
  const bar = document.createElement("nav");
  bar.className = "section-nav";
  bar.setAttribute("aria-label", "Previous and next section");
  const prev = sections[i - 1];
  const next = sections[i + 1];
  if (prev) {
    bar.insertAdjacentHTML("beforeend",
      `<a class="prev" href="#${prev.id}"><small>Previous</small>← ${navLabel(prev)}</a>`);
  }
  if (next) {
    bar.insertAdjacentHTML("beforeend",
      `<a class="next" href="#${next.id}"><small>Next</small>${navLabel(next)} →</a>`);
  }
  section.appendChild(bar);
});

function navLabel(section) {
  const link = navLinks.find((a) => a.hash === "#" + section.id);
  return link ? link.textContent : sectionTitle(section);
}

function showSection(id, { scroll = true } = {}) {
  const target = sections.find((s) => s.id === id) || sections[0];
  sections.forEach((s) => { s.hidden = s !== target; });
  navLinks.forEach((a) => {
    if (a.hash === "#" + target.id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
  document.title = `${navLabel(target)} — E227 Lesson 5`;
  if (scroll) window.scrollTo(0, 0);
  closeMenu();
}

function currentHashId() {
  return decodeURIComponent(location.hash.slice(1));
}

window.addEventListener("hashchange", () => {
  const id = currentHashId();
  // Only switch for section links; other anchors (e.g. #top, #main) just scroll.
  if (sections.some((s) => s.id === id)) showSection(id);
});

showSection(currentHashId(), { scroll: false });

// A direct link like "#bim-coordination" makes the browser jump to that
// section on load; since only one section shows, start at the top instead.
window.addEventListener("load", () => setTimeout(() => window.scrollTo(0, 0), 0));

// ---------- Phone menu ----------
function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
});

// ---------- Check-in questions (one try each) ----------

// Show right/wrong, the explanation, and a link on to the next section.
function showResult(question, correct, correctAnswer) {
  const result = question.querySelector(".result");
  const section = question.closest(".section");
  const next = sections[sections.indexOf(section) + 1];

  const verdict = document.createElement("p");
  verdict.className = "verdict " + (correct ? "correct" : "wrong");
  verdict.textContent = correct ? "Correct!" : `Not quite. The answer is: ${correctAnswer}`;

  const explain = document.createElement("p");
  explain.textContent = question.dataset.explain;

  result.replaceChildren(verdict, explain);
  if (next) {
    const link = document.createElement("a");
    link.className = "continue";
    link.href = "#" + next.id;
    link.textContent = `Continue to ${navLabel(next)} →`;
    result.appendChild(link);
  }
}

// Multiple choice: the first click locks the question.
document.querySelectorAll("fieldset.question").forEach((question) => {
  const options = Array.from(question.querySelectorAll(".option"));
  const right = options.find((o) => o.hasAttribute("data-correct"));

  options.forEach((option) => {
    option.addEventListener("click", () => {
      const correct = option === right;
      options.forEach((o) => { o.disabled = true; });
      option.classList.add(correct ? "is-correct" : "is-wrong");
      if (!correct) right.classList.add("is-answer");
      showResult(question, correct, right.textContent);
    });
  });
});

// Short answer: compare against the accepted answers, ignoring case,
// punctuation, extra spaces and a leading "a", "an" or "the".
function normalise(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^(a|an|the) /, "");
}

document.querySelectorAll("form.short-answer").forEach((question) => {
  const input = question.querySelector("input");
  const button = question.querySelector("button");
  const accepted = question.dataset.answers.split("|").map(normalise);

  question.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = normalise(input.value);
    if (!answer) return;
    const correct = accepted.includes(answer);
    input.disabled = true;
    button.disabled = true;
    input.classList.add(correct ? "is-correct" : "is-wrong");
    showResult(question, correct, question.dataset.display);
  });
});

// ---------- Full-size picture viewer ----------
const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector("img");

if (typeof lightbox.showModal === "function") {
  document.querySelectorAll("a.zoom").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const img = link.querySelector("img");
      lightboxImg.src = link.href;
      lightboxImg.alt = img.alt;
      lightbox.showModal();
    });
  });
  lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
  // Clicking the dark area around the picture also closes it.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });
}
