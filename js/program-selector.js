/**
 * Moteur de sélection de programme intelligent ESSOR ACTIVE
 */
const ProgramSelector = {
    select: function (responses) {
        // Extraction des réponses clés
        const userGoal = responses[5] || '';
        const userLevel = responses[4] || '';
        const userEquip = responses[8] || '';
        const userPains = responses[9] || [];
        const userFreq = responses[7] || '';
        const userTime = responses[6] || '';

        const db = (typeof require !== 'undefined') ? require('./program-db') : window.PROGRAM_DB;

        // Système de scoring
        let bestMatch = null;
        let highestScore = -1;

        db.forEach(prog => {
            let score = 0;

            // Score Objectif (Poids fort)
            if (userGoal.toLowerCase().includes(prog.goal.toLowerCase())) score += 10;

            // Score Niveau
            if (userLevel.toLowerCase().includes(prog.level.toLowerCase())) score += 5;

            // Score Matériel
            if (userEquip.toLowerCase().includes(prog.equipment.toLowerCase())) score += 8;
            else if (prog.equipment === "Aucun" && userEquip !== "Salle de sport") score += 4; // Compatibilité ascendante

            // Priorité absolue si douleur spécifique (ex: Dos)
            if (userPains.includes("Dos") && prog.id === "sante_dos_aucun") score += 20;

            if (score > highestScore) {
                highestScore = score;
                bestMatch = JSON.parse(JSON.stringify(prog)); // Deep copy
            }
        });

        // Personnalisation finale du programme sélectionné
        if (bestMatch) {
            // Ajustement de la durée selon la réponse utilisateur
            bestMatch.schedule = bestMatch.schedule.map(s => {
                if (s.duration !== "-") {
                    s.duration = userTime;
                }
                return s;
            });

            // Ajout du bilan personnalisé (Textuel)
            bestMatch.summary = this.generateSummary(responses);
        }

        return bestMatch;
    },

    generateSummary: function (responses) {
        const goal = responses[5] || 'votre forme';
        const level = responses[4] || 'débutant';
        const pains = responses[9] || [];

        let summary = `Basé sur votre profil de ${level}, votre objectif de ${goal} est tout à fait réalisable. `;

        if (pains.length > 0 && !pains.includes("Aucune")) {
            summary += `Nous avons pris en compte vos sensibilités (${pains.join(', ')}) pour adapter les exercices. `;
        } else {
            summary += `Votre condition physique actuelle nous permet de travailler sur une large gamme de mouvements. `;
        }

        summary += "Ce programme a été conçu pour maximiser vos résultats en fonction de votre matériel disponible.";
        return summary;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProgramSelector;
} else {
    window.ProgramSelector = ProgramSelector;
}
