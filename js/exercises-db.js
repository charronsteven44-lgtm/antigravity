const EXERCISES_DB = {
    // --- HIIT / CARDIO ---
    "Circuit Cardio-Hiit au poids du corps": {
        id: "cardio_hiit",
        name: "Circuit Cardio-Hiit",
        thumbnail: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/ml6cT4AZdqI",
        instructions: "Enchaînez les exercices sans repos : Jumping Jacks, Mountain Climbers, Burpees.",
        tips: "Gardez une intensité maximale, c'est le secret du HIIT."
    },
    "Circuit brûle-graisses intense": {
        id: "fat_burn",
        name: "Circuit Brûle-Graisses",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-e96057a661b6?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/8v_5VAnS2pI",
        instructions: "Série d'exercices polyarticulaires à haute intensité pour vider les stocks de glycogène.",
        tips: "Ne buvez que de petites gorgées d'eau pendant l'effort."
    },
    "HIIT Tabata (Poids du corps)": {
        id: "tabata",
        name: "Tabata Intense",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/ml6cT4AZdqI",
        instructions: "20 secondes d'effort à 100%, 10 secondes de repos. Répétez 8 fois.",
        tips: "Explosivité maximale sur chaque répétition."
    },

    // --- REINFORCEMENT ---
    "Renforcement musculaire ciblé (Full Body)": {
        id: "fullbody",
        name: "Renforcement Full Body",
        thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/lID68uFkSsw",
        instructions: "Squats, Pompes, Fentes et Gainage. 3 à 4 séries de 12-15 répétitions.",
        tips: "Concentrez-vous sur la connexion cerveau-muscle."
    },
    "Poussée (Pectoraux, Épaules, Triceps)": {
        id: "push_day",
        name: "Push Day (Poussée)",
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/IODxDxX7oi4",
        instructions: "Pompes larges, développé militaire (avec haltères ou bouteilles), dips sur chaise.",
        tips: "Gardez les coudes légèrement rentrés pour protéger vos épaules."
    },
    "Tirage (Dos, Biceps, Arrière épaules)": {
        id: "pull_day",
        name: "Pull Day (Tirage)",
        thumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/ml6cT4AZdqI",
        instructions: "Tirage inversé sous une table, rowing unilatéral (haltères), curls biceps.",
        tips: "Tirez avec vos coudes, pas avec vos mains."
    },
    "Jambes & Abdos": {
        id: "legs_abs",
        name: "Séance Bas du Corps",
        thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/aclHkVaku9U",
        instructions: "Fentes sautées, squats sumo, relevés de jambes au sol.",
        tips: "Gainer fort les abdos pendant les mouvements de jambes."
    },

    // --- MOBILITY / WELLNESS ---
    "Session Mobilité & Souplesse": {
        id: "mobility",
        name: "Mobilité & Souplesse",
        thumbnail: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/L_xrDAtykMI",
        instructions: "Mouvements fluides pour délier les articulations et étirer les muscles profonds.",
        tips: "La respiration doit guider le mouvement. Expirez sur l'étirement."
    },
    "Décompression vertébrale & Mobilité Hanche": {
        id: "back_health",
        name: "Santé du Dos",
        thumbnail: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/L_xrDAtykMI",
        instructions: "Position de l'enfant, Cobra, Chien tête en bas. Focus sur la colonne.",
        tips: "Ne forcez jamais sur une douleur vertébrale."
    },
    "Routine Bien-être (Étirements)": {
        id: "wellness",
        name: "Stretching Bien-être",
        thumbnail: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/L_xrDAtykMI",
        instructions: "Étirements légers pour favoriser la circulation et la détente.",
        tips: "Idéal avant de dormir ou après une journée assise."
    },

    // --- RECOVERY / LOW INTENSITY ---
    "Récupération active : 30 min de marche rapide": {
        id: "active_recovery",
        name: "Marche Active",
        thumbnail: "https://images.unsplash.com/photo-1552674605-469527217b3d?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/L_xrDAtykMI",
        instructions: "Marchez à un rythme soutenu, sans être essoufflé. Mobilisez vos bras.",
        tips: "Profitez-en pour écouter un podcast motivant."
    },
    "Marche active en extérieur": {
        id: "walk_outdoor",
        name: "Marche Extérieure",
        thumbnail: "https://images.unsplash.com/photo-1551632322-3c4495c01bc8?auto=format&fit=crop&q=80&w=400",
        video: "https://www.youtube.com/embed/L_xrDAtykMI",
        instructions: "Sortie en plein air pour oxygéner les tissus musculaires.",
        tips: "Regardez loin devant vous pour une meilleure posture."
    }
};

// Fuzzy Matching Helper
function findExercise(activityName) {
    if (!activityName) return null;

    // Direct match
    if (EXERCISES_DB[activityName]) return EXERCISES_DB[activityName];

    // Search for keywords
    const lowerName = activityName.toLowerCase();

    if (lowerName.includes('cardio') || lowerName.includes('hiit') || lowerName.includes('brûle')) {
        return EXERCISES_DB["Circuit Cardio-Hiit au poids du corps"];
    }
    if (lowerName.includes('mobilité') || lowerName.includes('étirement') || lowerName.includes('yoga') || lowerName.includes('bien-être')) {
        return EXERCISES_DB["Session Mobilité & Souplesse"];
    }
    if (lowerName.includes('dos')) {
        return EXERCISES_DB["Décompression vertébrale & Mobilité Hanche"];
    }
    if (lowerName.includes('poussée') || lowerName.includes('pect') || lowerName.includes('bras')) {
        return EXERCISES_DB["Poussée (Pectoraux, Épaules, Triceps)"];
    }
    if (lowerName.includes('tirage') || lowerName.includes('dos')) {
        return EXERCISES_DB["Tirage (Dos, Biceps, Arrière épaules)"];
    }
    if (lowerName.includes('jambes') || lowerName.includes('squat')) {
        return EXERCISES_DB["Jambes & Abdos"];
    }
    if (lowerName.includes('renforcement') || lowerName.includes('full body') || lowerName.includes('tonus')) {
        return EXERCISES_DB["Renforcement musculaire ciblé (Full Body)"];
    }
    if (lowerName.includes('marche') || lowerName.includes('récupération')) {
        return EXERCISES_DB["Récupération active : 30 min de marche rapide"];
    }

    // Fallback if nothing found
    return null;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EXERCISES_DB, findExercise };
} else {
    window.EXERCISES_DB = EXERCISES_DB;
    window.findExercise = findExercise;
}
