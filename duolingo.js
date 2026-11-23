// duolingo.js - Isomero Duolingo System - V1
let xp = 0;
let hearts = 3;
let streak = parseInt(localStorage.getItem("isomero_streak") || "1");

// 1. Create the top bar automatically - you don't need to edit HTML
document.addEventListener("DOMContentLoaded", () => {
  const bar = document.createElement("div");
  bar.innerHTML = `
    <div style="display:flex;justify-content:space-between;padding:10px;font-weight:bold;position:sticky;top:0;background:#fff;z-index:999;border-bottom:1px solid #eee">
      <span>🔥 <span id="streak">${streak}</span> DAYS</span>
      <span id="xp">⭐ 0 XP</span>
      <span id="hearts">❤️❤️❤️</span>
    </div>
    <div style="height:10px;background:#eee;border-radius:10px;overflow:hidden;margin:10px">
      <div id="progress" style="height:100%;width:0%;background:#58cc02;transition:0.3s"></div>
    </div>`;
  document.body.prepend(bar);
});

// 2. Call this when answer is CORRECT
function addXP() {
  xp += 10;
  const el = document.getElementById("xp");
  if (el) el.innerText = "⭐ " + xp + " XP";
  const p = document.getElementById("progress");
  if (p) p.style.width = Math.min(xp, 100) + "%";
}

// 3. Call this when answer is WRONG
function loseHeart() {
  hearts--;
  const h = document.getElementById("hearts");
  if (h) h.innerText = "❤️".repeat(Math.max(hearts, 0)) || "💔";
  if (hearts <= 0) {
    alert("You lost all hearts! Try again ❤️");
    hearts = 3;
    if (h) h.innerText = "❤️❤️❤️";
  }
}

// 4. Call this when lesson is FINISHED
function finishLesson() {
  streak++;
  localStorage.setItem("isomero_streak", streak);
  const s = document.getElementById("streak");
  if (s) s.innerText = streak;
  alert("🎉 Lesson done! Streak: " + streak + " days 🔥 Come back tomorrow!");
}
