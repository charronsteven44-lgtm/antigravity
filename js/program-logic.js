/**
 * Shared Workout Generation Logic
 * Used by both the questionnaire and the dashboard
 */

const WorkoutLogic = {
    generate: function (responses) {
        // Mapping based on new questionnaire IDs
        const goal = responses[5] || 'Remise en forme'; // Objectif principal
        const level = responses[4] || 'Débutant (0–6 mois)'; // Niveau sportif
        const equipment = responses[8] || 'Aucun'; // Matériel
        const frequencyStr = responses[7] || '3x / semaine'; // Fréquence

        let frequency = 3;
        if (frequencyStr.includes('2x')) frequency = 2;
        if (frequencyStr.includes('4x')) frequency = 4;
        if (frequencyStr.includes('Tous les jours')) frequency = 7;

        let title = "Programme ESSOR - ";
        if (goal.includes('poids')) title += "Perte de Poids";
        else if (goal.includes('muscle')) title += "Prise de Muscle";
        else if (goal.includes('douleurs')) title += "Mobilité & Santé";
        else if (goal.includes('Performance')) title += "Performance Athlétique";
        else title += "Remise en Forme";

        title += (level.includes('Avancé') ? " (Avancé)" : " (Initial)");

        let schedule = [];
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        for (let i = 0; i < 7; i++) {
            let activity = "Repos / Récupération Active";

            // Distribute sessions based on frequency
            const isTrainingDay = (frequency === 2 && (i === 1 || i === 4)) ||
                (frequency === 3 && (i === 0 || i === i === 2 || i === 4)) ||
                (frequency === 4 && (i === 0 || i === 1 || i === 3 || i === 4)) ||
                (frequency === 7);

            if (isTrainingDay) {
                activity = `Séance : ${goal} (${responses[6] || '30 min'})`;
            } else if (i === 5 || i === 6) {
                activity = "Balade oxygénante ou Étirements";
            }

            schedule.push({ day: days[i], activity: activity, details: "Contenu complet disponible en version Premium" });
        }

        const details = `
            <h3>🏃 ${title}</h3>
            <p>Objectif: ${goal} | Niveau: ${level} | Matériel: ${equipment}</p>
            <ul>
                ${schedule.map(s => `<li><strong>${s.day}:</strong> ${s.activity}</li>`).join('')}
            </ul>
        `;

        return {
            title,
            schedule,
            details,
            id: 'prog_' + Date.now(),
            created: Date.now(),
            isPremium: false
        };
    },

    saveToLocal: function (program) {
        localStorage.setItem('userProgram', JSON.stringify(program));
        localStorage.setItem('lastProgramId', program.id);
    },

    loadFromLocal: function () {
        const saved = localStorage.getItem('userProgram');
        return saved ? JSON.parse(saved) : null;
    }
};

if (typeof module !== 'undefined') {
    module.exports = WorkoutLogic;
}
