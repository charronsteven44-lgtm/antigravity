// --- CONFIGURATION ---
const QUESTIONS = [
    {
        id: 1,
        question: "Quel est votre âge ?",
        options: ["-18", "18-25", "26-35", "36-45", "46-60", "+60"],
        type: "single",
        required: true,
        category: "Profil"
    },
    {
        id: 2,
        question: "Sexe (optionnel)",
        options: ["Homme", "Femme", "Préfère ne pas répondre"],
        type: "single",
        required: false,
        category: "Profil"
    },
    {
        id: 3,
        question: "Métier / Type de travail",
        options: ["Travail assis", "Travail debout", "Travail physique", "Travail mixte", "Travail posté / de nuit"],
        type: "single",
        required: true,
        category: "Activité"
    },
    {
        id: 4,
        question: "Niveau sportif actuel",
        options: ["Débutant (0–6 mois)", "Intermédiaire", "Avancé", "Reprise après arrêt"],
        type: "single",
        required: true,
        category: "Activité"
    },
    {
        id: 5,
        question: "Objectif principal",
        options: ["Perte de poids", "Remise en forme", "Prise de muscle", "Mobilité / santé", "Soulager des douleurs", "Performance"],
        type: "single",
        required: true,
        category: "Objectifs"
    },
    {
        id: 6,
        question: "Temps disponible par séance",
        options: ["10–15 min", "20–30 min", "45 min", "1h +"],
        type: "single",
        required: true,
        category: "Disponibilité"
    },
    {
        id: 7,
        question: "Fréquence souhaitée",
        options: ["2x / semaine", "3x / semaine", "4x / semaine", "Tous les jours"],
        type: "single",
        required: true,
        category: "Disponibilité"
    },
    {
        id: 8,
        question: "Matériel disponible",
        options: ["Aucun", "Élastiques", "Haltères", "Salle de sport"],
        type: "single",
        required: true,
        category: "Équipement"
    },
    {
        id: 9,
        question: "Douleurs ou blessures actuelles",
        options: ["Aucune", "Dos", "Épaules", "Genoux", "Hanches", "Cervicales", "Autre"],
        type: "multiple",
        required: true,
        category: "Santé"
    },
    {
        id: 10,
        question: "Motivation actuelle",
        options: ["Faible", "Moyenne", "Élevée", "Très élevée"],
        type: "single",
        required: true,
        category: "Motivation"
    }
];

let currentStep = 1;
let responses = {};

// Helper to get URL params
function getStepFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('step')) || 1;
}

// UPDATE UI
function updateUI() {
    const progress = (currentStep / QUESTIONS.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;

    const currentStepEl = document.getElementById('current-step');
    if (currentStepEl) currentStepEl.textContent = currentStep;

    const categoryEl = document.getElementById('step-category');
    if (categoryEl && QUESTIONS[currentStep - 1]) {
        categoryEl.textContent = QUESTIONS[currentStep - 1].category;
    }
}

// RENDER QUESTION
function displayQuestion(step) {
    const container = document.getElementById('question-container');
    if (!container) return;
    container.innerHTML = '';

    const qIndex = step - 1;
    if (qIndex >= QUESTIONS.length) {
        window.location.href = 'final.html';
        return;
    }

    const q = QUESTIONS[qIndex];

    // Title
    const title = document.createElement('h1');
    title.className = "text-2xl font-bold text-white mb-2 leading-tight";
    title.textContent = q.question;
    container.appendChild(title);

    // Subtitle
    const sub = document.createElement('p');
    sub.className = "text-gray-400 text-sm mb-6";
    sub.textContent = q.type === 'multiple' ? "Sélectionnez une ou plusieurs options." : "Choisissez l'option qui vous correspond.";
    container.appendChild(sub);

    // Options Container
    const optsDiv = document.createElement('div');
    optsDiv.className = "space-y-3 pb-20";

    const currentResponses = responses[q.id] || (q.type === 'multiple' ? [] : null);

    q.options.forEach((optText) => {
        const btn = document.createElement('button');
        const isSelected = q.type === 'multiple'
            ? currentResponses.includes(optText)
            : currentResponses === optText;

        btn.className = `w-full text-left p-4 rounded-3xl border-2 transition-all group flex items-center justify-between relative overflow-hidden ${isSelected ? 'border-primary bg-primary/10' : 'border-surface-light/10 bg-surface-dark hover:border-primary/50'
            }`;

        btn.onclick = () => {
            if (q.type === 'multiple') {
                toggleOption(q.id, optText);
            } else {
                selectOption(q.id, optText);
            }
        };

        const content = `
            <div class="flex items-center gap-4 z-10">
                <div class="w-10 h-10 rounded-full bg-surface-light/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <span class="material-symbols-outlined text-white group-hover:text-primary transition-colors ${isSelected ? 'text-primary' : ''}">${q.type === 'multiple' ? 'check_box' : 'circle'}</span>
                </div>
                <div>
                    <p class="text-white font-bold text-lg group-hover:text-primary transition-colors ${isSelected ? 'text-primary' : ''}">${optText}</p>
                </div>
            </div>
            <div class="w-6 h-6 rounded-full border-2 ${isSelected ? 'border-primary' : 'border-white/20'} group-hover:border-primary flex items-center justify-center">
                <div class="w-3 h-3 rounded-full bg-primary ${isSelected ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 transition-opacity"></div>
            </div>
        `;
        btn.innerHTML = content;
        optsDiv.appendChild(btn);
    });

    container.appendChild(optsDiv);
    updateUI();
    validateStep();
}

function selectOption(questionId, value) {
    responses[questionId] = value;
    saveResponses();
    displayQuestion(currentStep);

    // Simple auto-advance for single choice if not last question
    setTimeout(() => {
        nextStep();
    }, 200);
}

function toggleOption(questionId, value) {
    if (!responses[questionId]) responses[questionId] = [];

    const index = responses[questionId].indexOf(value);
    if (index > -1) {
        responses[questionId].splice(index, 1);
    } else {
        // If "Aucune" is selected, clear others. If others selected, clear "Aucune".
        if (value === "Aucune") {
            responses[questionId] = ["Aucune"];
        } else {
            const noneIndex = responses[questionId].indexOf("Aucune");
            if (noneIndex > -1) responses[questionId].splice(noneIndex, 1);
            responses[questionId].push(value);
        }
    }
    saveResponses();
    displayQuestion(currentStep);
}

function validateStep() {
    const q = QUESTIONS[currentStep - 1];
    const nextBtn = document.getElementById('next-button');
    if (!nextBtn) return;

    let isValid = true;
    if (q.required) {
        const resp = responses[q.id];
        if (q.type === 'multiple') {
            isValid = resp && resp.length > 0;
        } else {
            isValid = resp !== undefined && resp !== null && resp !== '';
        }
    }

    if (isValid) {
        nextBtn.classList.remove('opacity-50', 'pointer-events-none');
    } else {
        nextBtn.classList.add('opacity-50', 'pointer-events-none');
    }
}

function saveResponses() {
    localStorage.setItem('responses', JSON.stringify(responses));
}

function nextStep() {
    if (currentStep < QUESTIONS.length) {
        currentStep++;
        const url = new URL(window.location.href);
        url.searchParams.set('step', currentStep);
        window.history.pushState({}, '', url);
        displayQuestion(currentStep);
    } else {
        window.location.href = 'final.html';
    }
}

function goBack() {
    if (currentStep > 1) {
        currentStep--;
        const url = new URL(window.location.href);
        url.searchParams.set('step', currentStep);
        window.history.pushState({}, '', url);
        displayQuestion(currentStep);
    } else {
        window.location.href = 'index.html';
    }
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('responses');
    if (saved) {
        try {
            responses = JSON.parse(saved);
        } catch (e) {
            responses = {};
        }
    }
    currentStep = getStepFromUrl();
    displayQuestion(currentStep);
    updateUI();
});
