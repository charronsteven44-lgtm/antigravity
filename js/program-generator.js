// Program Generator - Generates personalized 7-day workout programs based on user responses

function generateProgram(responses) {
    const goal = responses[5] || 'Remise en forme';
    const level = responses[4] || 'Débutant (0–6 mois)';
    const frequency = responses[7] || '3x / semaine';
    const duration = responses[6] || '20–30 min';
    const equipment = responses[8] || 'Aucun';
    const injuries = responses[9] || ['Aucune'];

    // Parse frequency number
    const freqNum = parseInt(frequency.match(/\d+/)[0]);
    const durationNum = duration.includes('10') ? '15' : duration.includes('20') ? '30' : duration.includes('45') ? '45' : '60';

    // Determine program type
    let programTitle = '';
    if (goal.includes('Perte de poids')) programTitle = 'Programme Perte de Poids';
    else if (goal.includes('Prise de muscle')) programTitle = 'Programme Prise de Muscle';
    else if (goal.includes('Mobilité')) programTitle = 'Programme Mobilité & Santé';
    else if (goal.includes('Performance')) programTitle = 'Programme Performance';
    else programTitle = 'Programme Remise en Forme';

    // Generate 7-day schedule
    const schedule = [];
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    for (let i = 0; i < 7; i++) {
        const dayName = days[i];

        // Determine if this is a training day based on frequency
        const isTrainingDay = shouldTrain(i, freqNum);

        if (isTrainingDay) {
            schedule.push(generateTrainingDay(dayName, goal, level, duration, equipment, injuries, i));
        } else {
            schedule.push(generateRestDay(dayName, i));
        }
    }

    return {
        title: programTitle,
        goal: goal,
        frequency: freqNum,
        duration: durationNum,
        schedule: schedule
    };
}

function shouldTrain(dayIndex, frequency) {
    // Distribute training days throughout the week
    if (frequency === 2) return [0, 3].includes(dayIndex); // Mon, Thu
    if (frequency === 3) return [0, 2, 4].includes(dayIndex); // Mon, Wed, Fri
    if (frequency === 4) return [0, 2, 3, 5].includes(dayIndex); // Mon, Wed, Thu, Sat
    if (frequency >= 5) return dayIndex < 6; // Mon-Sat
    return false;
}

function generateTrainingDay(day, goal, level, duration, equipment, injuries, dayIndex) {
    const hasInjuries = !injuries.includes('Aucune');
    const isBodyweight = equipment === 'Aucun';

    // Determine workout focus based on day
    const focuses = ['Haut du corps', 'Bas du corps', 'Full Body', 'Cardio & Core'];
    const focus = focuses[dayIndex % focuses.length];

    const sections = [];

    // 1. Mobilité / Motricité (5 min)
    sections.push({
        name: '🔄 Mobilité / Motricité (5 min)',
        exercises: generateMobilityExercises(injuries, hasInjuries)
    });

    // 2. Échauffement (5-8 min)
    sections.push({
        name: '🔥 Échauffement',
        exercises: generateWarmup(focus, level)
    });

    // 3. Renforcement spécifique
    if (hasInjuries) {
        sections.push({
            name: '💪 Renforcement préventif',
            exercises: generatePreventiveWork(injuries)
        });
    }

    // 4. Corps de séance
    sections.push({
        name: '⚡ Corps de séance',
        exercises: generateMainWork(goal, level, focus, equipment)
    });

    // 5. Retour au calme (5 min)
    sections.push({
        name: '🧘 Retour au calme',
        exercises: generateCooldown()
    });

    return {
        day: day,
        type: 'training',
        title: `Séance : ${focus}`,
        sections: sections
    };
}

function generateRestDay(day, dayIndex) {
    const activities = [
        'Repos actif : Marche légère 20-30 min',
        'Récupération : Étirements doux 15 min',
        'Mobilité douce : Yoga ou stretching 20 min',
        'Repos complet : Récupération musculaire'
    ];

    return {
        day: day,
        type: 'rest',
        title: 'Repos / Récupération Active',
        description: activities[dayIndex % activities.length]
    };
}

function generateMobilityExercises(injuries, hasInjuries) {
    const base = [
        'Rotations cervicales : 10 répétitions lentes',
        'Cercles d\'épaules : 10 avant + 10 arrière',
        'Rotations de hanches : 10 de chaque côté'
    ];

    if (hasInjuries) {
        if (injuries.includes('Dos')) {
            base.push('Cat-Cow (chat-vache) : 10 répétitions');
        }
        if (injuries.includes('Genoux')) {
            base.push('Flexions de genoux légères : 10 répétitions');
        }
    }

    return base;
}

function generateWarmup(focus, level) {
    const exercises = [];

    if (focus.includes('Haut')) {
        exercises.push(
            'Jumping jacks : 30 secondes',
            'Pompes au mur : 10 répétitions',
            'Rotations de bras : 20 répétitions'
        );
    } else if (focus.includes('Bas')) {
        exercises.push(
            'Montées de genoux : 30 secondes',
            'Squats au poids du corps : 10 répétitions',
            'Fentes alternées : 10 de chaque côté'
        );
    } else {
        exercises.push(
            'Marche sur place : 1 minute',
            'Squats légers : 10 répétitions',
            'Rotations du tronc : 10 de chaque côté'
        );
    }

    return exercises;
}

function generatePreventiveWork(injuries) {
    const exercises = [];

    if (injuries.includes('Dos')) {
        exercises.push(
            'Bird-dog : 3 séries de 8 répétitions',
            'Planche sur genoux : 3 x 20 secondes',
            'Superman : 3 séries de 10 répétitions'
        );
    }

    if (injuries.includes('Genoux')) {
        exercises.push(
            'Renforcement quadriceps : 3 x 12 répétitions',
            'Ponts fessiers : 3 séries de 15 répétitions'
        );
    }

    if (injuries.includes('Épaules')) {
        exercises.push(
            'Rotations externes légères : 3 x 12',
            'Élévations latérales sans poids : 3 x 10'
        );
    }

    return exercises.length > 0 ? exercises : ['Renforcement général adapté'];
}

function generateMainWork(goal, level, focus, equipment) {
    const exercises = [];
    const isAdvanced = level.includes('Avancé');
    const sets = isAdvanced ? '4' : '3';
    const reps = goal.includes('Prise de muscle') ? '8-12' : '12-15';

    if (focus.includes('Haut')) {
        if (equipment === 'Aucun') {
            exercises.push(
                `Pompes (variante adaptée) : ${sets} séries de ${reps}`,
                `Dips sur chaise : ${sets} x ${reps}`,
                `Planche : ${sets} x 30-45 secondes`,
                `Superman : ${sets} x 12 répétitions`
            );
        } else if (equipment.includes('Haltères') || equipment.includes('Salle')) {
            exercises.push(
                `Développé couché/incliné : ${sets} x ${reps}`,
                `Rowing haltères : ${sets} x ${reps}`,
                `Élévations latérales : ${sets} x ${reps}`,
                `Curl biceps : ${sets} x ${reps}`
            );
        }
    } else if (focus.includes('Bas')) {
        if (equipment === 'Aucun') {
            exercises.push(
                `Squats : ${sets} séries de ${reps}`,
                `Fentes alternées : ${sets} x ${reps} par jambe`,
                `Ponts fessiers : ${sets} x 15-20`,
                `Mollets debout : ${sets} x 20`
            );
        } else {
            exercises.push(
                `Squats avec charge : ${sets} x ${reps}`,
                `Soulevé de terre : ${sets} x ${reps}`,
                `Leg press : ${sets} x ${reps}`,
                `Fentes marchées : ${sets} x ${reps}`
            );
        }
    } else if (focus.includes('Cardio')) {
        exercises.push(
            'Burpees : 3 séries de 10 répétitions',
            'Mountain climbers : 3 x 30 secondes',
            'Jumping jacks : 3 x 45 secondes',
            'Planche dynamique : 3 x 30 secondes'
        );
    } else {
        // Full Body
        exercises.push(
            `Squats : ${sets} x ${reps}`,
            `Pompes : ${sets} x ${reps}`,
            `Fentes : ${sets} x ${reps}`,
            `Planche : ${sets} x 30-45s`,
            `Burpees : 3 x 8`
        );
    }

    return exercises;
}

function generateCooldown() {
    return [
        'Étirement quadriceps : 30 secondes par jambe',
        'Étirement ischio-jambiers : 30 secondes par jambe',
        'Étirement épaules : 30 secondes par bras',
        'Respiration profonde : 2 minutes'
    ];
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateProgram };
}
