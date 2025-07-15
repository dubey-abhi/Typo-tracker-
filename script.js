const textDisplay = document.getElementById('textDisplay');
const inputArea = document.getElementById('inputArea');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const progress = document.getElementById('progress');
const restartBtn = document.getElementById('restartBtn');
const toggleTheme = document.getElementById('toggleTheme');
const leaderboardBtn = document.getElementById('showLeaderboard');
const leaderboard = document.getElementById('leaderboard');
const leaderboardList = document.getElementById('leaderboardList');
const closeLeaderboard = document.getElementById('closeLeaderboard');
const clearLeaderboard = document.getElementById('clearLeaderboard');
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const cursorToggle = document.getElementById('cursorToggle');
const difficultyBtns = document.querySelectorAll('.difficulty');

const paragraphs = {
  easy: [
    "The quick brown fox jumps over the lazy dog.",
    "Hello world! Typing practice is fun.",
    "Cats and dogs are common pets."
  ],
  medium: [
    "Practice typing to improve your speed and accuracy.",
    "Learning to type quickly takes time and patience.",
    "Coding requires focus and precision when typing."
  ],
  hard: [
    "Pneumonoultramicroscopicsilicovolcanoconiosis is a lung disease.",
    "Supercalifragilisticexpialidocious is a long and whimsical word.",
    "The five boxing wizards jump quickly over the lazy dwarf."
  ]
};

let targetText = "";
let startTime = null;
let interval = null;
let correctChars = 0;
let totalChars = 0;
let currentDifficulty = "medium";
let cursorEnabled = true;

function startGame() {
  const options = paragraphs[currentDifficulty];
  targetText = options[Math.floor(Math.random() * options.length)];
  textDisplay.innerHTML = formatText("", targetText);
  inputArea.value = "";
  wpmEl.textContent = 0;
  accuracyEl.textContent = 100;
  timeEl.textContent = 0;
  scoreEl.textContent = 0;
  progress.style.width = "0%";
  startTime = null;
  correctChars = 0;
  totalChars = 0;
  clearInterval(interval);
}

inputArea.addEventListener('input', () => {
  if (!startTime) {
    startTime = new Date();
    interval = setInterval(updateStats, 1000);
  }
  const typed = inputArea.value;
  totalChars = typed.length;
  correctChars = [...typed].filter((c, i) => c === targetText[i]).length;
  textDisplay.innerHTML = formatText(typed, targetText);

  let percent = Math.min((typed.length / targetText.length) * 100, 100);
  progress.style.width = percent + "%";

  if (typed === targetText) {
    clearInterval(interval);
    saveToLeaderboard(Math.round(wpmEl.textContent));
  }
});

function formatText(typed, target) {
  let formatted = "";
  for (let i = 0; i < target.length; i++) {
    let cls = "";
    if (i < typed.length) cls = typed[i] === target[i] ? "correct" : "incorrect";
    if (i === typed.length && cursorEnabled) cls += " current";
    formatted += `<span class="${cls}">${target[i]}</span>`;
  }
  return formatted;
}

function updateStats() {
  const elapsed = (new Date() - startTime) / 60000;
  const wpm = elapsed > 0 ? (correctChars / 5) / elapsed : 0;
  const accuracy = totalChars ? (correctChars / totalChars) * 100 : 100;
  const score = Math.round(wpm * (accuracy / 100));
  wpmEl.textContent = Math.round(wpm);
  accuracyEl.textContent = Math.round(accuracy);
  timeEl.textContent = Math.floor((new Date() - startTime) / 1000);
  scoreEl.textContent = score;
}

function saveToLeaderboard(wpm) {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  scores.push(wpm);
  scores.sort((a, b) => b - a);
  scores = scores.slice(0, 5);
  localStorage.setItem("leaderboard", JSON.stringify(scores));
  displayLeaderboard();
}

function displayLeaderboard() {
  let scores = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboardList.innerHTML = scores.map((wpm, i) => `<li>${i + 1}. ${wpm} WPM</li>`).join("");
}

restartBtn.addEventListener('click', startGame);
toggleTheme.addEventListener('click', () => document.body.classList.toggle('dark'));
settingsBtn.addEventListener('click', () => settingsPanel.classList.toggle('hidden'));
cursorToggle.addEventListener('change', () => {
  cursorEnabled = cursorToggle.checked;
  textDisplay.innerHTML = formatText(inputArea.value, targetText);
});
difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentDifficulty = btn.dataset.difficulty;
    difficultyBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    startGame();
  });
});
leaderboardBtn.addEventListener('click', () => leaderboard.classList.toggle('hidden'));
closeLeaderboard.addEventListener('click', () => leaderboard.classList.add('hidden'));
clearLeaderboard.addEventListener('click', () => {
  localStorage.removeItem("leaderboard");
  displayLeaderboard();
});

startGame();