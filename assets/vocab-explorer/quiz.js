/**
 * Quiz: multiple-choice (serbian → english).
 * Auto-advances on correct answer; pauses on wrong to show the right one.
 */

import { latinToCyrillic } from "./vocabulary.js";

let questions = [];
let current = 0;
let score = 0;
let total = 0;
let onFinish = null;
let alphabet = "cyrillic";

const AUTO_ADVANCE_MS = 400;

function start(allItems, finishCb, alphabetSetting) {
  onFinish = finishCb;
  alphabet = alphabetSetting || "cyrillic";
  score = 0;
  current = 0;

  const QUIZ_SIZE = 10;
  questions = shuffle(allItems.map((item) => ({
    serbian: item.serbian,
    correct: item.english,
  }))).slice(0, QUIZ_SIZE);
  total = questions.length;

  document.getElementById("quiz-overlay").classList.add("active");
  document.getElementById("quiz-score").textContent = "";
  document.getElementById("quiz-next-btn").style.display = "none";
  document.getElementById("quiz-done-btn").style.display = "none";
  document.getElementById("quiz-done-btn").onclick = finish;

  showQuestion();
}

function serbianDisplay(latinWord) {
  return alphabet === "latin" ? latinWord : latinToCyrillic(latinWord);
}

function showQuestion() {
  const q = questions[current];
  document.getElementById("quiz-prompt").textContent = serbianDisplay(q.serbian);
  document.getElementById("quiz-score").textContent =
    `${current + 1} / ${total}  —  Score: ${score}`;

  const wrong = questions
    .filter((o) => o.correct !== q.correct)
    .map((o) => o.correct);
  const picks = shuffle(wrong).slice(0, 3);
  picks.push(q.correct);
  const options = shuffle(picks);

  const choicesEl = document.getElementById("quiz-choices");
  choicesEl.innerHTML = "";
  document.getElementById("quiz-next-btn").style.display = "none";
  document.getElementById("quiz-done-btn").style.display = "none";

  for (const opt of options) {
    const btn = document.createElement("button");
    btn.className = "quiz-choice";
    btn.textContent = opt;
    btn.addEventListener("click", () => pick(btn, opt, q.correct));
    choicesEl.appendChild(btn);
  }
}

function pick(btn, chosen, correct) {
  const buttons = document.getElementById("quiz-choices").querySelectorAll(".quiz-choice");
  buttons.forEach((b) => (b.style.pointerEvents = "none"));

  if (chosen === correct) {
    btn.classList.add("correct");
    score++;
    document.getElementById("quiz-score").textContent =
      `${current + 1} / ${total} - Score: ${score}`;

    if (current < total - 1) {
      // Auto-advance on correct
      setTimeout(() => { current++; showQuestion(); }, AUTO_ADVANCE_MS);
    } else {
      setTimeout(finish, AUTO_ADVANCE_MS);
    }
  } else {
    btn.classList.add("wrong");
    buttons.forEach((b) => {
      if (b.textContent === correct) b.classList.add("correct");
    });
    document.getElementById("quiz-score").textContent =
      `${current + 1} / ${total}  —  Score: ${score}`;

    if (current < total - 1) {
      // Pause to show correct answer, then show Next button
      document.getElementById("quiz-next-btn").style.display = "inline-block";
      document.getElementById("quiz-next-btn").onclick = () => {
        current++;
        showQuestion();
      };
    } else {
      const doneBtn = document.getElementById("quiz-done-btn");
      doneBtn.style.display = "inline-block";
      doneBtn.textContent = `Finish (${score}/${total})`;
    }
  }
}

function finish() {
  document.getElementById("quiz-overlay").classList.remove("active");
  if (onFinish) onFinish(score, total);
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export { start };
