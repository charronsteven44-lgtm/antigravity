// Questionnaire State Management
let currentStep = 1;
const totalSteps = 10;

// Questions data
const questions = [
  {
    step: 1,
    category: "Profil de base",
    title: "Quel est votre prénom?",
    type: "text",
    placeholder: "Entrez votre prénom",
    field: "firstName"
  },
  {
    step: 2,
    category: "Profil de base",
    title: "Quel est votre nom?",
    type: "text",
    placeholder: "Entrez votre nom",
    field: "lastName"
  },
  {
    step: 3,
    category: "Objectifs",
    title: "Quel est votre objectif principal?",
    type: "select",
    options: ["Perte de poids", "Gain musculaire", "Endurance", "Flexibilité", "Santé générale"],
    field: "objective"
  },
  {
    step: 4,
    category: "Objectifs",
    title: "Quelle est votre niveau actuel?",
    type: "select",
    options: ["Débutant", "Intermédiaire", "Avancé"],
    field: "level"
  },
  {
    step: 5,
    category: "Santé",
    title: "Avez-vous des blessures ou problèmes de santé?",
    type: "text",
    placeholder: "Décrivez vos problèmes (optionnel)",
    field: "health"
  },
  {
    step: 6,
    category: "Disponibilité",
    title: "Combien de jours par semaine pouvez-vous vous entraîner?",
    type: "select",
    options: ["1-2 jours", "3-4 jours", "5-6 jours", "7 jours"],
    field: "daysPerWeek"
  },
  {
    step: 7,
    category: "Disponibilité",
    title: "Combien de minutes pouvez-vous consacrer par séance?",
    type: "select",
    options: ["15-30 min", "30-45 min", "45-60 min", "60+ min"],
    field: "sessionDuration"
  },
  {
    step: 8,
    category: "Équipement",
    title: "Quel équipement avez-vous disponible?",
    type: "select",
    options: ["Aucun (poids du corps)", "Haltères", "Équipement complet de gym", "Autres"],
    field: "equipment"
  },
  {
    step: 9,
    category: "Préférences",
    title: "Quel type d'entraînement préférez-vous?",
    type: "select",
    options: ["Force", "Cardio", "HIIT", "Yoga/Flexibilité", "Mélangé"],
    field: "trainingType"
  },
  {
    step: 10,
    category: "Confirmation",
    title: "Avez-vous d'autres informations à ajouter?",
    type: "text",
    placeholder: "Entrez vos commentaires (optionnel)",
    field: "comments"
  }
];

// Answers storage
const answers = {};

// Initialize questionnaire
function initQuestionnaire() {
  loadQuestion(currentStep);
  updateProgressBar();
}

// Load and display question
function loadQuestion(step) {
  const question = questions.find(q => q.step === step);
  if (!question) return;

  const container = document.getElementById('question-container');
  container.innerHTML = '';

  // Update header
  document.getElementById('current-step').textContent = step;
  document.getElementById('step-category').textContent = question.category;

  // Create question content
  const questionDiv = document.createElement('div');
  questionDiv.className = 'flex flex-col gap-6';

  const titleEl = document.createElement('h3');
  titleEl.className = 'text-white text-2xl font-bold leading-tight';
  titleEl.textContent = question.title;
  questionDiv.appendChild(titleEl);

  // Create input based on type
  let inputEl;
  if (question.type === 'text') {
    inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.className = 'w-full px-4 py-3 bg-surface-dark text-white rounded-lg border border-gray-700 focus:border-primary focus:outline-none transition-colors';
    inputEl.placeholder = question.placeholder;
    inputEl.value = answers[question.field] || '';
    inputEl.id = 'answer-input';
  } else if (question.type === 'select') {
    inputEl = document.createElement('select');
    inputEl.className = 'w-full px-4 py-3 bg-surface-dark text-white rounded-lg border border-gray-700 focus:border-primary focus:outline-none transition-colors';
    inputEl.id = 'answer-input';
    
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = 'Sélectionnez une option';
    inputEl.appendChild(placeholder);

    question.options.forEach(option => {
      const optEl = document.createElement('option');
      optEl.value = option;
      optEl.textContent = option;
      if (answers[question.field] === option) optEl.selected = true;
      inputEl.appendChild(optEl);
    });
  }

  if (inputEl) {
    inputEl.addEventListener('change', (e) => {
      answers[question.field] = e.target.value;
      updateNextButtonState();
    });
    questionDiv.appendChild(inputEl);
  }

  container.appendChild(questionDiv);
  updateNextButtonState();
}

// Update progress bar
function updateProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const percentage = (currentStep / totalSteps) * 100;
  progressBar.style.width = percentage + '%';
}

// Update next button state
function updateNextButtonState() {
  const question = questions.find(q => q.step === currentStep);
  const nextButton = document.getElementById('next-button');
  const input = document.getElementById('answer-input');

  if (!input || !question) {
    nextButton.classList.add('opacity-50', 'pointer-events-none');
    return;
  }

  const hasAnswer = input.value && input.value.trim() !== '';
  
  if (hasAnswer) {
    nextButton.classList.remove('opacity-50', 'pointer-events-none');
  } else {
    nextButton.classList.add('opacity-50', 'pointer-events-none');
  }
}

// Next step
function nextStep() {
  if (currentStep < totalSteps) {
    currentStep++;
    loadQuestion(currentStep);
    updateProgressBar();
  } else if (currentStep === totalSteps) {
    // Submit questionnaire
    submitQuestionnaire();
  }
}

// Go back
function goBack() {
  if (currentStep > 1) {
    currentStep--;
    loadQuestion(currentStep);
    updateProgressBar();
  } else {
    // Go back to main page
    window.location.href = '/';
  }
}

// Submit questionnaire
function submitQuestionnaire() {
  console.log('Questionnaire submitted:', answers);
  alert('Merci d\'avoir complété le questionnaire!');
  window.location.href = '/';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initQuestionnaire);
