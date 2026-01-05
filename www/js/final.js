document.addEventListener('DOMContentLoaded', () => {
    try {
        let responses = {};
        const saved = localStorage.getItem('responses');
        if (saved) responses = JSON.parse(saved);

        // Generate Program Locally
        const program = WorkoutLogic.generate(responses);
        WorkoutLogic.saveToLocal(program);

        // Display Data
        const goalEl = document.getElementById('user-goal');
        const freqEl = document.getElementById('user-frequency');

        if (goalEl) goalEl.textContent = program.title.replace('Programme ESSOR - ', '');

        if (freqEl) {
            const timePerSession = responses[6] || '30 min';
            const frequency = responses[7] || '3x / semaine';
            freqEl.textContent = `${timePerSession} / ${frequency}`;
        }

        // Form Logic
        const form = document.getElementById('lead-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Génération...';
            btn.disabled = true;

            const email = document.getElementById('email-input').value;
            const name = document.getElementById('name-input').value;

            try {
                // Send data to server for processing and email delivery
                const response = await fetch('/api/send-program', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, responses })
                });

                if (response.ok) {
                    // Show Confirmation Message
                    btn.innerHTML = '✅ Questionnaire validé !';
                    btn.className = "w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2";

                    // Overlay transition
                    const overlay = document.createElement('div');
                    overlay.className = "fixed inset-0 bg-background-dark/95 z-[100] flex flex-col items-center justify-center p-8 text-center animate-fade-in";
                    overlay.innerHTML = `
                        <div class="max-w-md space-y-8">
                            <div class="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span class="material-symbols-outlined text-primary text-5xl">task_alt</span>
                            </div>
                            <h2 class="text-3xl font-extrabold text-white">Questionnaire complété avec succès !</h2>
                            <p class="text-gray-400 text-lg">
                                Votre programme automatique personnalisé sur 7 jours est en cours de génération.<br>
                                <span class="text-primary font-medium">📩 Il sera envoyé par email dans quelques minutes.</span>
                            </p>
                            <div class="h-px bg-white/10 w-full"></div>
                            <p class="text-white text-base">
                                Pour aller plus loin et débloquer tout le potentiel de votre progression, découvrez maintenant nos formules d’accompagnement ESSOR.
                            </p>
                            <button onclick="window.location.href='client-register.html'" class="w-full bg-primary hover:bg-primary-hover text-background-dark text-xl font-black py-5 rounded-full shadow-[0_4px_30px_rgba(73,230,25,0.4)] transition-all transform active:scale-95 flex items-center justify-center gap-3">
                                <span>CRÉER MON ESPACE CLIENT</span>
                                <span class="material-symbols-outlined font-bold">person_add</span>
                            </button>
                        </div>
                    `;
                    document.body.appendChild(overlay);
                } else {
                    throw new Error('Erreur serveur');
                }
            } catch (error) {
                console.error('Email error:', error);
                alert('Petit souci technique, mais votre programme est sauvegardé !');
                window.location.href = 'subscription.html';
            }
        });

    } catch (err) {
        console.error('Final page error:', err);
    }
});
