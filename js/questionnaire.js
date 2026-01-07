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
        options: ["Aucune", "Dos", "Épaules", "Genoux", "Hanches", "Cervicales"],
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
    },
];

let currentStep = 1;
let responses = {};
let contactInfo = { name: '', email: '', phone: '' };

// Helper to get URL params
function getStepFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('step')) || 1;
}

// UPDATE UI
function updateUI() {
    const totalQuestions = QUESTIONS.length;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const progress = (currentStep / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
    }

    const currentStepEl = document.getElementById('current-step');
    if (currentStepEl) currentStepEl.textContent = Math.min(currentStep, totalQuestions);

    const categoryEl = document.getElementById('step-category');
    if (categoryEl && QUESTIONS[currentStep - 1]) {
        categoryEl.textContent = QUESTIONS[currentStep - 1].category;
    }
}

// RENDER QUESTION
function displayQuestion(step) {
    const container = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-button');
    const loader = document.getElementById('loading-overlay');
    if (!container) return;

    container.style.opacity = '0';

    setTimeout(() => {
        container.innerHTML = '';
        container.classList.add('question-fade-in');
        container.style.opacity = '1';

        const q = QUESTIONS[step - 1];
        if (!q) {
            submitData();
            return;
        }

        // Title
        const title = document.createElement('h1');
        title.className = "text-3xl font-bold text-white mb-3 leading-tight";
        title.textContent = q.question;
        container.appendChild(title);

        if (q.type !== 'contact') {
            const sub = document.createElement('p');
            sub.className = "text-white/40 text-sm mb-10";
            sub.textContent = q.type === 'multiple' ? "Plusieurs choix possibles." : "Choisissez l'option qui vous correspond le mieux.";
            container.appendChild(sub);

            const optsDiv = document.createElement('div');
            optsDiv.className = "space-y-4 pb-20";

            const currentResponses = responses[q.id] || (q.type === 'multiple' ? [] : null);

            q.options.forEach((optText) => {
                const btn = document.createElement('button');
                const isSelected = q.type === 'multiple' ? currentResponses.includes(optText) : currentResponses === optText;
                btn.className = `w-full text-left p-6 rounded-2xl border transition-all duration-300 group flex items-center justify-between relative overflow-hidden ${isSelected ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(73,230,25,0.15)]' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'}`;
                btn.onclick = () => q.type === 'multiple' ? toggleOption(q.id, optText) : selectOption(q.id, optText);
                btn.innerHTML = `
                    <div class="flex items-center gap-5 z-10 transition-transform duration-300 ${isSelected ? 'translate-x-1' : ''}">
                        <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-primary border-primary' : 'bg-transparent'}">
                            <span class="material-symbols-outlined text-sm ${isSelected ? 'text-background-dark font-bold' : 'text-white/20'}">${q.type === 'multiple' ? 'check' : 'circle'}</span>
                        </div>
                        <p class="text-white font-medium text-lg leading-none transition-colors duration-300 ${isSelected ? 'text-primary' : ''}">${optText}</p>
                    </div>
                `;
                optsDiv.appendChild(btn);
            });
            container.appendChild(optsDiv);
        } else {
            const sub = document.createElement('p');
            sub.className = "text-white/40 text-sm mb-10";
            sub.textContent = "Dernière étape !";
            container.appendChild(sub);
            const formDiv = document.createElement('div');
            formDiv.className = "space-y-8 pb-20";
            const fields = [{ id: 'name', label: 'Prénom', type: 'text', placeholder: 'Votre prénom' }, { id: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' }, { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: '06 00 00 00 00' }];
            fields.forEach(f => {
                const group = document.createElement('div');
                group.className = "flex flex-col gap-3";
                group.innerHTML = `<label class="text-white/30 text-xs font-bold uppercase tracking-widest px-1">${f.label}</label>`;
                const input = document.createElement('input');
                input.className = "w-full bg-white/[0.03] border-white/5 rounded-xl p-5 text-white focus:bg-white/[0.07] focus:border-white/20 focus:ring-0 transition-all outline-none placeholder:text-white/10";
                input.type = f.type; input.placeholder = f.placeholder; input.value = contactInfo[f.id] || '';
                input.oninput = (e) => { contactInfo[f.id] = e.target.value; validateStep(); };
                group.appendChild(input);
                formDiv.appendChild(group);
            });
            container.appendChild(formDiv);
        }

        updateUI();
        validateStep();
        if (loader) loader.classList.add('fade-out');
        setTimeout(() => container.classList.remove('question-fade-in'), 500);
    }, 150);
}

function selectOption(questionId, value) {
    responses[questionId] = value;
    saveResponses();
    if (currentStep < QUESTIONS.length) setTimeout(() => nextStep(), 400);
}

function toggleOption(questionId, value) {
    if (!responses[questionId]) responses[questionId] = [];
    const index = responses[questionId].indexOf(value);
    if (index > -1) responses[questionId].splice(index, 1);
    else {
        if (value === "Aucune") responses[questionId] = ["Aucune"];
        else {
            const noneIndex = responses[questionId].indexOf("Aucune");
            if (noneIndex > -1) responses[questionId].splice(noneIndex, 1);
            responses[questionId].push(value);
        }
    }
    saveResponses();
    validateStep();
}

function validateStep() {
    const q = QUESTIONS[currentStep - 1];
    const nextBtn = document.getElementById('next-button');
    if (!nextBtn) return;
    let isValid = true;
    if (q.type === 'contact') isValid = contactInfo.name && contactInfo.email && contactInfo.email.includes('@');
    else if (q.required) {
        const resp = responses[q.id];
        isValid = q.type === 'multiple' ? (resp && resp.length > 0) : (resp !== undefined && resp !== null && resp !== '');
    }
    if (isValid) {
        nextBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
        nextBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
        nextBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
        nextBtn.classList.remove('opacity-100', 'translate-y-0');
    }
}

function saveResponses() { localStorage.setItem('responses', JSON.stringify(responses)); }

function nextStep() {
    if (currentStep < QUESTIONS.length) {
        currentStep++;
        const url = new URL(window.location.href);
        url.searchParams.set('step', currentStep);
        window.history.pushState({}, '', url);
        displayQuestion(currentStep);
    } else submitData();
}

async function submitData() {
    const container = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-button');

    // UI: Show "Analysis" animation
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-center gap-8 question-fade-in">
            <div class="w-16 h-16 border-2 border-white/10 border-t-primary rounded-full animate-spin"></div>
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">Analyse en cours...</h2>
                <p class="text-white/40">Nous préparons votre programme personnalisé.</p>
            </div>
        </div>
    `;
    if (nextBtn) nextBtn.style.display = 'none';

    // Simulate analysis time then redirect to final results
    setTimeout(() => {
        window.location.href = 'final.html';
    }, 2500);
}

function goBack() {
    if (currentStep > 1) {
        currentStep--;
        const url = new URL(window.location.href);
        url.searchParams.set('step', currentStep);
        window.history.pushState({}, '', url);
        displayQuestion(currentStep);
    } else window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('responses');
    if (saved) try { responses = JSON.parse(saved); } catch (e) { responses = {}; }
    currentStep = getStepFromUrl();
    displayQuestion(currentStep);
});
