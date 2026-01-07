const LEVEL_THRESHOLDS = [
    0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500,
    7500, 10000, 13000, 17000, 22000
];

// Added 'target' for progress bar calc (e.g., max value). 
// Added 'unit' for display.
// Added 'reqId' for dependency/locking chain (Unlock logic).

const CHALLENGES_DB = [
    // --- ONBOARDING (Start) ---
    {
        id: "welcome_start",
        title: "Bienvenue à Bord",
        desc: "Créer son compte sur ESSOR ACTIVE.",
        xp: 100,
        type: "one_shot",
        target: 1, unit: "action",
        category: "start",
        reward: "Points"
    },
    {
        id: "profile_optimize",
        title: "Identité Confirmée",
        desc: "Compléter son profil à 100% (7 champs).",
        xp: 150,
        type: "accumulate",
        target: 7, unit: "champs",
        reqId: "welcome_start",
        category: "start",
        reward: "Ebook : Nutrition Base"
    },

    // --- PROGRESSION PROGRAMME ---
    {
        id: "trial_complete",
        title: "Semaine d'Essai",
        desc: "Terminer les 7 jours gratuits.",
        xp: 500,
        type: "one_shot",
        target: 7, unit: "jours",
        reqId: "profile_optimize",
        category: "progression",
        reward: "Points"
    },
    {
        id: "prog_adv_start",
        title: "Vers l'Infini",
        desc: "Démarrer le programme avancé après l'essai.",
        xp: 200,
        type: "one_shot",
        target: 1, unit: "action",
        reqId: "trial_complete",
        category: "progression",
        reward: "Points"
    },
    {
        id: "prog_month_1",
        title: "Premier Mois",
        desc: "Compléter 4 semaines de programme.",
        xp: 800,
        type: "one_shot",
        target: 28, unit: "jours",
        reqId: "prog_adv_start",
        category: "progression",
        reward: "Badge 'Fer'"
    },

    // --- ACTIVITY (STEPS) ---
    {
        id: "steps_5k",
        title: "Marcheur Débutant",
        desc: "Atteindre 5 000 pas cumulés.",
        xp: 50,
        type: "accumulate",
        target: 5000, unit: "pas",
        category: "activity",
        reward: "Points"
    },
    {
        id: "steps_50k",
        title: "Marcheur Confirmé",
        desc: "Atteindre 50 000 pas cumulés.",
        xp: 300,
        type: "accumulate",
        target: 50000, unit: "pas",
        reqId: "steps_5k",
        category: "activity",
        reward: "Points"
    },
    {
        id: "steps_1m",
        title: "Légende de la Marche",
        desc: "Atteindre 1 Million de pas.",
        xp: 5000,
        type: "accumulate",
        target: 1000000, unit: "pas",
        reqId: "steps_50k",
        category: "activity",
        reward: "Badge 'Or'"
    },

    // --- LOYALTY ---
    {
        id: "loyalty_3weeks",
        title: "Habitude Ancrée",
        desc: "Utiliser l'app pendant 21 jours.",
        xp: 1000,
        type: "accumulate",
        target: 21, unit: "jours",
        category: "progression",
        reward: "Badge 'Aigle'"
    },
    {
        id: "loyalty_year",
        title: "Fidélité Annuelle",
        desc: "Un an de transformation.",
        xp: 10000,
        type: "accumulate",
        target: 365, unit: "jours",
        reqId: "loyalty_3weeks",
        category: "progression",
        reward: "Surprise"
    },

    // --- FUN / EVENTS ---
    {
        id: "shake_it",
        title: "Secoue-moi !",
        desc: "Secouer ton téléphone pour activer l'énergie.",
        xp: 50,
        type: "action",
        target: 1, unit: "shake",
        category: "fun",
        reward: "Points"
    },
    {
        id: "special_xmas",
        title: "Esprit de Noël",
        desc: "Ouvrir l'application le 25 Décembre.",
        xp: 500,
        type: "date",
        target: 1, unit: "event",
        category: "fun",
        reward: "Cadeau"
    },
    {
        id: "special_bday",
        title: "Joyeux Anniversaire",
        desc: "Ouvrir l'application le jour de ton anniversaire.",
        xp: 1000,
        type: "date",
        target: 1, unit: "event",
        category: "fun",
        reward: "Cadeau"
    },

    // --- SOCIAL ---
    {
        id: "invite_friend",
        title: "Ambassadeur",
        desc: "Partager l'application avec un ami.",
        xp: 300,
        type: "action",
        target: 1, unit: "invit",
        category: "social",
        reward: "Points"
    }
];
