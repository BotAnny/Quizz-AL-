let questionBank = [];
let selectedQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
const TOTAL_QUESTIONS = 20;

function getRandomShuffled(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Charge le fichier questions.json externe
async function loadQuestionBank() {
  try {
    const response = await fetch('questions.json');
    questionBank = await response.json();
    initGame();
  } catch (error) {
    console.error("Erreur lors du chargement des questions :", error);
    document.getElementById('question-text').textContent = "Impossible de charger le fichier questions.json.";
  }
}

function loadQuestion() {
  const gameSection = document.getElementById('game-section');
  const endScreen = document.getElementById('end-screen');
  const mainCatEl = document.getElementById('main-cat');
  const themeEl = document.getElementById('theme');
  const questionTextEl = document.getElementById('question-text');
  const currentQEl = document.getElementById('current-q');
  const progressBarEl = document.getElementById('progress-bar');
  const optionsContainerEl = document.getElementById('options-container');
  const nextBtn = document.getElementById('next-btn');

  gameSection.style.display = 'flex';
  endScreen.style.display = 'none';

  const q = selectedQuestions[currentQuestionIndex];
  
  mainCatEl.textContent = q.categorie_generale || "CULTURE G";
  themeEl.textContent = q.sous_categorie || q.theme || "DIVERS";
  questionTextEl.textContent = q.question;
  currentQEl.textContent = currentQuestionIndex + 1;
  progressBarEl.style.width = `${((currentQuestionIndex + 1) / selectedQuestions.length) * 100}%`;
  
  optionsContainerEl.innerHTML = '';
  nextBtn.disabled = true;
  nextBtn.textContent = (currentQuestionIndex === selectedQuestions.length - 1) ? "Terminer la partie" : "Question suivante";

  const randomizedOptions = getRandomShuffled(q.options);

  randomizedOptions.forEach(optionText => {
    const btn = document.createElement('button');
    btn.classList.add('btn-option');
    btn.textContent = optionText;
    btn.onclick = () => handleAnswer(btn, optionText, q.answer);
    optionsContainerEl.appendChild(btn);
  });
}

function handleAnswer(selectedBtn, chosenText, correctText) {
  const optionsContainerEl = document.getElementById('options-container');
  const scoreEl = document.getElementById('score');
  const nextBtn = document.getElementById('next-btn');
  const allButtons = optionsContainerEl.querySelectorAll('.btn-option');
  
  allButtons.forEach(btn => btn.disabled = true);

  if (chosenText === correctText) {
    selectedBtn.classList.add('correct');
    score++;
    scoreEl.textContent = score;
  } else {
    selectedBtn.classList.add('wrong');
    allButtons.forEach(btn => {
      if (btn.textContent === correctText) {
        btn.classList.add('correct');
      }
    });
  }

  nextBtn.disabled = false;
}

function showEndScreen() {
  const gameSection = document.getElementById('game-section');
  const endScreen = document.getElementById('end-screen');
  const finalScoreText = document.getElementById('final-score-text');

  gameSection.style.display = 'none';
  endScreen.style.display = 'flex';
  finalScoreText.innerHTML = `Partie terminée !<br><br>Ton score : <strong>${score} / ${selectedQuestions.length}</strong> 🍔`;
}

function initGame() {
  if (!questionBank || questionBank.length === 0) return;

  score = 0;
  currentQuestionIndex = 0;

  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = score;
  
  const shuffledBank = getRandomShuffled(questionBank);
  selectedQuestions = shuffledBank.slice(0, Math.min(TOTAL_QUESTIONS, shuffledBank.length));
  
  loadQuestion();
}

document.getElementById('next-btn').onclick = () => {
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn.disabled) return;
  currentQuestionIndex++;
  if (currentQuestionIndex < selectedQuestions.length) {
    loadQuestion();
  } else {
    showEndScreen();
  }
};

document.getElementById('restart-btn').onclick = () => initGame();

// Lancement au chargement de la page
loadQuestionBank();
