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
    },
    {
        id: 11,
        question: "Finalisons votre profil",
        type: "contact",
        required: true,
        category: "Contact"
    }
];

let currentStep = 1;
let responses = {};
let contactInfo = {
    name: '',
    email: '',
    phone: ''
};

// Helper to get URL params
function getStepFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('step')) || 1;
}

// UPDATE UI
function updateUI() {
    // Only count actual questions (not contact form) for progress
    const totalQuestions = 10;
    const progress = (currentStep / QUESTIONS.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${progress}%`;

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
    if (!container) return;

    // Smooth transition: fade out current content
    container.style.opacity = '0';

    setTimeout(() => {
        container.innerHTML = '';
        container.classList.add('question-fade-in');
        container.style.opacity = '1';

        const qIndex = step - 1;
        if (qIndex >= QUESTIONS.length) {
            submitData();
            return;
        }

        const q = QUESTIONS[qIndex];

        // Title
        const title = document.createElement('h1');
        title.className = "text-3xl font-bold text-white mb-3 leading-tight";
        title.textContent = q.question;
        container.appendChild(title);

        // Subtitle/Description
        if (q.type !== 'contact') {
            const sub = document.createElement('p');
            sub.className = "text-white/40 text-sm mb-10";
            sub.textContent = q.type === 'multiple' ? "Plusieurs choix possibles." : "Choisissez l'option qui vous correspond le mieux.";
            container.appendChild(sub);

            // Options Container
            const optsDiv = document.createElement('div');
            optsDiv.className = "space-y-4 pb-20";

            const currentResponses = responses[q.id] || (q.type === 'multiple' ? [] : null);

            q.options.forEach((optText) => {
                const btn = document.createElement('button');
                const isSelected = q.type === 'multiple'
                    ? currentResponses.includes(optText)
                    : currentResponses === optText;

                btn.className = `w-full text-left p-6 rounded-2xl border transition-all duration-300 group flex items-center justify-between relative overflow-hidden ${isSelected
                    ? 'border-white bg-white/10'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                    }`;

                btn.onclick = () => {
                    if (q.type === 'multiple') {
                        toggleOption(q.id, optText);
                    } else {
                        selectOption(q.id, optText);
                    }
                };

                const content = `
                    <div class="flex items-center gap-5 z-10 transition-transform duration-300 ${isSelected ? 'translate-x-1' : ''}">
                        <div class="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isSelected ? 'bg-white border-white' : 'bg-transparent'}">
                            <span class="material-symbols-outlined text-sm ${isSelected ? 'text-black' : 'text-white/20'}">${q.type === 'multiple' ? 'check' : 'circle'}</span>
                        </div>
                        <div>
                            <p class="text-white font-medium text-lg leading-none">${optText}</p>
                        </div>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-white transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}"></div>
                `;
                btn.innerHTML = content;
                optsDiv.appendChild(btn);
            });
            container.appendChild(optsDiv);
        } else {
            // Contact Form Step
            const sub = document.createElement('p');
            sub.className = "text-white/40 text-sm mb-10";
            sub.textContent = "Dernière étape ! Nous avons besoin de vos coordonnées pour vous envoyer l'analyse personnalisée.";
            container.appendChild(sub);

            const formDiv = document.createElement('div');
            formDiv.className = "space-y-8 pb-20";

            const fields = [
                { id: 'name', label: 'Prénom', type: 'text', placeholder: 'Votre prénom' },
                { id: 'email', label: 'Email', type: 'email', placeholder: 'votre@email.com' },
                { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: '06 00 00 00 00' }
            ];

            fields.forEach(f => {
                const group = document.createElement('div');
                group.className = "flex flex-col gap-3";

                const label = document.createElement('label');
                label.className = "text-white/30 text-xs font-bold uppercase tracking-widest px-1";
                label.textContent = f.label;

                const input = document.createElement('input');
                input.className = "w-full bg-white/[0.03] border-white/5 rounded-xl p-5 text-white focus:bg-white/[0.07] focus:border-white/20 focus:ring-0 transition-all outline-none placeholder:text-white/10";
                input.type = f.type;
                input.placeholder = f.placeholder;
                input.value = contactInfo[f.id] || '';
                input.oninput = (e) => {
                    contactInfo[f.id] = e.target.value;
                    validateStep();
                };

                group.appendChild(label);
                group.appendChild(input);
                formDiv.appendChild(group);
            });
            container.appendChild(formDiv);
        }

        updateUI();
        validateStep();

        // Remove animation class after it plays
        setTimeout(() => container.classList.remove('question-fade-in'), 500);
    }, 150);
}

function selectOption(questionId, value) {
    responses[questionId] = value;
    saveResponses();
    displayQuestion(currentStep);

    // Simple auto-advance for single choice if not last question
    if (currentStep < QUESTIONS.length) {
        setTimeout(() => {
            nextStep();
        }, 350);
    }
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

    // Auto-advance for question 9 (pain/injury) after selection
    const q = QUESTIONS[currentStep - 1];
    if (q.id === 9 && responses[questionId] && responses[questionId].length > 0) {
        setTimeout(() => {
            nextStep();
        }, 600);
    }
}

function validateStep() {
    const q = QUESTIONS[currentStep - 1];
    const nextBtn = document.getElementById('next-button');
    if (!nextBtn) return;

    let isValid = true;
    if (q.type === 'contact') {
        isValid = contactInfo.name && contactInfo.email && contactInfo.email.includes('@');
    } else if (q.required) {
        const resp = responses[q.id];
        if (q.type === 'multiple') {
            isValid = resp && resp.length > 0;
        } else {
            isValid = resp !== undefined && resp !== null && resp !== '';
        }
    }

    if (isValid) {
        nextBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-2');
        nextBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
        nextBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-2');
        nextBtn.classList.remove('opacity-100', 'translate-y-0');
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
        submitData();
    }
}

async function submitData() {
    const container = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-button');

    // Loading State
    container.innerHTML = `
        <div class="flex flex-col items-center justify-center py-20 text-center gap-8 question-fade-in">
            <div class="w-16 h-16 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
            <div>
                <h2 class="text-2xl font-bold text-white mb-2">Analyse en cours...</h2>
                <p class="text-white/40">Nous préparons votre programme personnalisé.</p>
            </div>
        </div>
    `;
    nextBtn.style.display = 'none';

    try {
        const payload = {
            responses: responses,
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone
        };

        const response = await fetch('/api/send-program', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('lastProgramId', result.programId);
            localStorage.setItem('userName', contactInfo.name);
            localStorage.setItem('userEmail', contactInfo.email);

            // Redirection after success message
            container.innerHTML = `
                <div class="flex flex-col items-center justify-center py-20 text-center gap-8 question-fade-in">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-black text-4xl">check</span>
                    </div>
                    <div>
                        <h2 class="text-2xl font-bold text-white mb-2">C'est prêt !</h2>
                        <p class="text-white/40">Un email vient de vous être envoyé.<br>Redirection vers votre tableau de bord...</p>
                    </div>
                </div>
            `;

            setTimeout(() => {
                window.location.href = 'final.html';
            }, 3000);
        } else {
            throw new Error(result.error);
        }
    } catch (err) {
        console.error('Submission failed:', err);
        alert("Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        displayQuestion(currentStep); // Return to form
        nextBtn.style.display = 'flex';
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
