// ============================================
// ISOMERO - finaltests.js FINAL UPDATED
// Project: isomero-f6887
// Works with units.js - Auto 40 Qs + Scoring + Timer + Firebase
// NO LISTENING
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "AIzaSyCAgHa3qAim81fVuAEjy6SDW8C3tEX60jk",
  authDomain: "isomero-f6887.firebaseapp.com",
  projectId: "isomero-f6887",
  storageBucket: "isomero-f6887.firebasestorage.app",
  messagingSenderId: "669743420568",
  appId: "1:669743420568:web:3b478914e4cd1525cd2ced",
  measurementId: "G-0QJZTRLQPG"
};

let db = null, auth = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  getAnalytics(app);
  signInAnonymously(auth).catch(() => {});
  onAuthStateChanged(auth, (u) => { if (u) localStorage.setItem("isomero_user_id", u.uid); });
} catch (e) { console.log("Firebase offline", e); }

async function saveScoreToFirebase(unitId, result) {
  if (!db) return;
  try {
    const userId = localStorage.getItem("isomero_user_id") || "guest";
    await setDoc(doc(db, "users", userId, "scores", unitId), {
      score: result.score, total: result.total, percent: result.percent,
      stars: result.stars, pass: result.pass, breakdown: result.breakdown,
      date: new Date().toISOString()
    });
  } catch (e) { console.log("Offline - saved locally", e); }
}

// ===== HELPERS =====
function getData() {
  if (typeof ISOMERO_DATA !== "undefined") return ISOMERO_DATA;
  if (typeof window !== "undefined" && window.ISOMERO_DATA) return window.ISOMERO_DATA;
  return null;
}
function safeCall(fnName, ...args) {
  if (typeof window[fnName] === "function") return window[fnName](...args);
  console.log(fnName, ...args);
}
function shuffleArray(arr) { return [...arr].sort(() => Math.random() - 0.5); }
function getDistractors(correct, allVocab) {
  return shuffleArray(allVocab.filter(w => w !== correct)).slice(0, 2);
}
function getUnitData(unitId) {
  const data = getData();
  if (!data) return null;
  for (let level of data.levels) {
    for (let u of level.units) { if (u.unit === unitId) return u; }
  }
  return null;
}

// ===== GENERATE 40 Qs - UPDATED =====
function generateFinalTest(unitId) {
  const unit = getUnitData(unitId);
  if (!unit) { alert("Unit not found: " + unitId + " - Check units.js"); return []; }
  const data = getData();
  const allVocab = [];
  data.levels.forEach(l => l.units.forEach(u => { if (u.vocab) allVocab.push(...u.vocab); }));
  const vocabList = unit.vocab || ["mother", "father", "school", "book", "family"];
  let questions = [];

  // 1-10 VOCAB - 2 Qs per word, 5 words = 10 Qs
  vocabList.slice(0, 5).forEach(word => {
    let o1 = shuffleArray([word, ...getDistractors(word, allVocab)]);
    questions.push({ q: "Choose the correct word: " + word, options: o1, answer: o1.indexOf(word), type: "vocab" });
    let o2 = shuffleArray([word, ...getDistractors(word, allVocab)]);
    questions.push({ q: "Which word did you learn in " + unitId + "?", options: o2,
