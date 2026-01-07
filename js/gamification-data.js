const LEVEL_THRESHOLDS = [
    0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, // Levels 1-10
    7500, 10000, 13000, 17000, 22000 // Levels 11-15
];

const CHALLENGES_DB = [
    // --- ONBOARDING ---
    {
        id: "welcome_start",
        title: "Bienvenue à Bord",
        desc: "Créer son compte sur ESSOR ACTIVE.",
        xp: 100,
        type: "one_shot",
        category: "start",
        reward: "Points"
    },
    {
        id: "profile_optimize",
        title: "Identité Confirmée",
        desc: "Compléter son profil (Photo, Poids, Taille).",
        xp: 150,
        type: "one_shot",
        category: "start",
        reward: "Ebook : Nutrition Base"
    },

    // --- ENGAGEMENT ---
    {
        id: "trial_complete",
        title: "La Semaine d'Essai",
        desc: "Terminer les 7 jours du programme gratuit.",
        xp: 500,
        type: "one_shot",
        category: "progression",
        reward: "Points"
    },
    {
        id: "loyalty_3weeks",
        title: "Habitude Ancrée",
        desc: "Utiliser l'application pendant 3 semaines consécutives.",
        xp: 1000,
        type: "one_shot",
        category: "progression",
        reward: "Badge 'Aigle' + Points"
    },

    // --- ACTIVITY (Steps simulated for MVP) ---
    {
        id: "steps_5k",
        title: "Marcheur Débutant",
        desc: "Atteindre 5 000 pas en une journée.",
        xp: 50,
        type: "daily",
        category: "activity",
        reward: "Points"
    },
    {
        id: "steps_10k",
        title: "Marcheur Confirmé",
        desc: "Atteindre 10 000 pas en une journée.",
        xp: 100,
        type: "daily",
        category: "activity",
        reward: "Points"
    },

    // --- FUN / SOCIAL ---
    {
        id: "shake_it",
        title: "Secoue-moi !",
        desc: "Secouer son téléphone vigoureusement.",
        xp: 50,
        type: "hidden",
        category: "fun",
        reward: "Points"
    },
    {
        id: "special_event",
        title: "Fidèle au Poste",
        desc: "Ouvrir l'application à Noël ou à son Anniversaire.",
        xp: 500,
        type: "hidden",
        category: "fun",
        reward: "Cadeau Surprise"
    },
    {
        id: "invite_friend",
        title: "Ambassadeur",
        desc: "Inviter un ami à rejoindre l'aventure.",
        xp: 300,
        type: "repeatable",
        category: "social",
        reward: "Points"
    }
];
