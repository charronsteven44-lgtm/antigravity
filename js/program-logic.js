/**
 * Shared Workout Generation Logic
 * Used by both the questionnaire and the dashboard
 */

const WorkoutLogic = {
    generate: function (responses) {
        // Use the smart selector if available (Browser environment)
        if (typeof ProgramSelector !== 'undefined') {
            return ProgramSelector.select(responses);
        }

        // Fallback to legacy simplified logic if selector is missing
        const goal = responses[5] || 'Remise en forme';
        return {
            title: "Programme ESSOR - " + goal,
            schedule: [],
            id: 'prog_' + Date.now(),
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorkoutLogic;
}
