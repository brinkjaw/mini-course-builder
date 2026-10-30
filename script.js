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
  const answerIntro = question.dataset.match === "contains" ? "Accepted answers include" : "The answer is";
  verdict.textContent = correct ? "Correct!" : `Not quite. ${answerIntro}: ${correctAnswer}`;

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
// With data-match="contains", the answer only needs to include one of the
// accepted words (e.g. "its fire rating" matches "fire").
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
  const contains = question.dataset.match === "contains";

  question.addEventListener("submit", (event) => {
    event.preventDefault();
    const answer = normalise(input.value);
    if (!answer) return;
    const correct = contains
      ? accepted.some((word) => ` ${answer} `.includes(` ${word} `))
      : accepted.includes(answer);
    input.disabled = true;
    button.disabled = true;
    input.classList.add(correct ? "is-correct" : "is-wrong");
    showResult(question, correct, question.dataset.display);
  });
});

// ---------- Scenario simulator ----------

const CATEGORIES = [
  "Reality Capture",
  "BIM Modelling",
  "BIM Coordination",
  "Simulation & Analysis",
  "Computational & AI-assisted Design",
];

const SCENARIOS = [
  {
    title: "Drawings that don't match",
    text: "The existing building's original drawings are decades old, and the site team says they no longer match what's actually there. You need accurate dimensions where the extension will connect.",
    answer: "Reality Capture",
    why: "Laser scanning / LiDAR captures the real shape and dimensions of the existing building, so the extension is designed around what actually exists on site.",
    tools: "Laser scanning, LiDAR, drone photogrammetry",
  },
  {
    title: "One source of information",
    text: "The client wants every wall, door and window in the extension to record its material, fire rating and manufacturer, so drawings and schedules all come from one source.",
    answer: "BIM Modelling",
    why: "A BIM model is 3D geometry plus information. Each component carries its own data, and drawings and schedules are produced from the model.",
    tools: "Revit, Archicad",
  },
  {
    title: "Ducts versus beams",
    text: "The architect, structural engineer and M&E engineer have each finished their own model. Before construction starts, you want to find any place where ducts or pipes run into beams.",
    answer: "BIM Coordination",
    why: "Combining the discipline models lets the team detect clashes digitally and resolve them (e.g. reroute a duct) before they become problems on site.",
    tools: "Navisworks, BIMcollab",
  },
  {
    title: "A hot west façade",
    text: "The proposed west façade is mostly glass. The team is worried the classrooms behind it will get too much afternoon sun and need a lot of cooling.",
    answer: "Simulation & Analysis",
    why: "Solar and energy analysis on the BIM model show where exposure and cooling load are high, so the team can test fixes like shading before building.",
    tools: "Energy simulation, solar analysis",
  },
  {
    title: "Many possible forms",
    text: "With a height limit, setbacks and a floor-area target, the team wants to explore many building forms quickly and compare them on daylight, energy and cost.",
    answer: "Computational & AI-assisted Design",
    why: "Algorithms and AI can generate and compare many options against set criteria. The designer then decides which one to take forward and refine.",
    tools: "Dynamo, Grasshopper, generative design, Generative AI",
  },
  {
    title: "Air in the courtyard",
    text: "A new courtyard will sit between the existing building and the extension. The team wants to know whether air will move through it well or become still and stuffy.",
    answer: "Simulation & Analysis",
    why: "Airflow (CFD) analysis predicts how air moves around and within buildings, so the layout can be adjusted before it is built.",
    tools: "CFD (Computational Fluid Dynamics)",
  },
];

const sim = document.querySelector(".sim");
if (sim) {
  sim.hidden = false;
  const el = (cls) => sim.querySelector(cls);
  const play = el(".sim-play");
  const end = el(".sim-end");
  const choices = el(".sim-choices");
  const feedback = el(".sim-feedback");
  const nextButton = el(".sim-next");

  let order = [];
  let index = 0;
  let results = [];

  function shuffle(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function updateStatus() {
    el(".sim-progress").textContent = `Scenario ${Math.min(index + 1, order.length)} of ${order.length}`;
    const score = results.filter((r) => r.correct).length;
    el(".sim-score").textContent = `Score: ${score} / ${results.length}`;
  }

  function showScenario({ focus = true } = {}) {
    const scenario = order[index];
    el(".sim-title").textContent = scenario.title;
    el(".sim-text").textContent = scenario.text;
    feedback.replaceChildren();
    nextButton.hidden = true;

    choices.replaceChildren(...CATEGORIES.map((name) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option";
      button.textContent = name;
      button.addEventListener("click", () => choose(name));
      return button;
    }));

    updateStatus();
    if (focus) el(".sim-title").focus();
  }

  function choose(name) {
    const scenario = order[index];
    const correct = name === scenario.answer;
    results.push({ scenario, picked: name, correct });

    choices.querySelectorAll(".option").forEach((button) => {
      button.disabled = true;
      if (button.textContent === scenario.answer) button.classList.add(correct ? "is-correct" : "is-answer");
      else if (button.textContent === name) button.classList.add("is-wrong");
    });

    const verdict = document.createElement("p");
    verdict.className = "verdict " + (correct ? "correct" : "wrong");
    verdict.textContent = correct ? "Correct!" : `Not quite. This one calls for ${scenario.answer}.`;
    const why = document.createElement("p");
    why.textContent = scenario.why;
    const tools = document.createElement("p");
    tools.className = "sim-tools";
    tools.textContent = `Examples: ${scenario.tools}`;
    feedback.replaceChildren(verdict, why, tools);

    nextButton.textContent = index === order.length - 1 ? "See results →" : "Next scenario →";
    nextButton.hidden = false;
    updateStatus();
  }

  function showEnd() {
    play.hidden = true;
    end.hidden = false;
    el(".sim-status").hidden = true;

    const score = results.filter((r) => r.correct).length;
    const total = results.length;
    el(".sim-end-title").textContent = `You scored ${score} out of ${total}`;
    el(".sim-end-text").textContent =
      score === total ? "Excellent: you matched every situation to the right technology."
      : score >= total - 2 ? "Good work. Look over the ones you missed below, then try again."
      : "Worth another go. Revisit the category sections for the ones you missed below, then restart.";

    el(".sim-recap").replaceChildren(...results.map((r) => {
      const li = document.createElement("li");
      li.className = r.correct ? "correct" : "wrong";
      const mark = r.correct ? "✓" : "✗";
      li.textContent = r.correct
        ? `${mark} ${r.scenario.title}: ${r.scenario.answer}`
        : `${mark} ${r.scenario.title}: you picked ${r.picked}; the answer is ${r.scenario.answer}`;
      return li;
    }));
    el(".sim-end-title").focus();
  }

  function start({ focus = true } = {}) {
    order = shuffle(SCENARIOS);
    index = 0;
    results = [];
    play.hidden = false;
    end.hidden = true;
    el(".sim-status").hidden = false;
    showScenario({ focus });
  }

  nextButton.addEventListener("click", () => {
    index += 1;
    if (index < order.length) showScenario();
    else showEnd();
  });

  el(".sim-restart").addEventListener("click", () => start());

  start({ focus: false });
}

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
