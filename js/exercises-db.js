const EXERCISES_DB = {
    // --- PECTORAUX (Chest) ---
    "push_ups_knees": {
        id: "push_ups_knees",
        name: "Pompes sur les genoux",
        video: "https://www.youtube.com/embed/WpHbwQiHzsE", // Placeholder generic
        instructions: "Mains écartées, corps gainé, descendez la poitrine au sol.",
        level: "debutant",
        type: "renforcement",
        muscles: ["pectoral_major", "triceps", "deltoid_ant"]
    },
    "push_ups_classic": {
        id: "push_ups_classic",
        name: "Pompes Classiques",
        video: "https://www.youtube.com/embed/IODxDxX7oi4",
        instructions: "Corps aligné, descendez jusqu'à frôler le sol.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["pectoral_major", "triceps", "deltoid_ant"]
    },
    "push_ups_diamond": {
        id: "push_ups_diamond",
        name: "Pompes Diamant",
        video: "https://www.youtube.com/embed/pup213sJ1A0", // Mock ID
        instructions: "Mains jointes sous le sternum. Cible l'intérieur des pecs et triceps.",
        level: "avance",
        type: "renforcement",
        muscles: ["pectoral_major", "triceps"]
    },
    "dips_chair": {
        id: "dips_chair",
        name: "Dips sur Chaise",
        video: "https://www.youtube.com/embed/033ogJglDbI",
        instructions: "Dos proche de la chaise, descendez les fesses vers le sol.",
        level: "debutant",
        type: "renforcement",
        muscles: ["triceps", "pectoral_major"]
    },
    "chest_squeeze": {
        id: "chest_squeeze",
        name: "Contraction Isométrique Pecs",
        video: "https://www.youtube.com/embed/none",
        instructions: "Presser les mains l'une contre l'autre très fort devant le thorax.",
        level: "debutant",
        type: "renforcement",
        muscles: ["pectoral_major"]
    },
    "wide_push_ups": {
        id: "wide_push_ups",
        name: "Pompes Larges",
        video: "https://www.youtube.com/embed/none",
        instructions: "Mains plus larges que les épaules pour isoler les pecs.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["pectoral_major"]
    },
    "decline_push_ups": {
        id: "decline_push_ups",
        name: "Pompes Déclinées",
        video: "https://www.youtube.com/embed/none",
        instructions: "Pieds surélevés (canapé). Cible le haut des pectoraux.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["pectoral_major", "deltoid_ant"]
    },
    "plyo_push_ups": {
        id: "plyo_push_ups",
        name: "Pompes Explosives",
        video: "https://www.youtube.com/embed/none",
        instructions: "Poussez fort pour décoller les mains du sol.",
        level: "avance",
        type: "renforcement",
        muscles: ["pectoral_major"]
    },
    "chest_stretch_door": {
        id: "chest_stretch_door",
        name: "Étirement Pectoral (Porte)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Bras contre le cadre de porte, avancez le buste.",
        level: "debutant",
        type: "etirement",
        muscles: ["pectoral_major"]
    },

    // --- ABDOS (Abs) ---
    "crunch_basic": {
        id: "crunch_basic",
        name: "Crunchs au Sol",
        video: "https://www.youtube.com/embed/MkfD5z87I1I",
        instructions: "Décollez les omoplates en contractant les abdos.",
        level: "debutant",
        type: "renforcement",
        muscles: ["rectus_abdominis"]
    },
    "leg_raises": {
        id: "leg_raises",
        name: "Relevés de Jambes",
        video: "https://www.youtube.com/embed/l4kQd9eWclE",
        instructions: "Dos plaqué, levez les jambes tendues.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["rectus_abdominis"]
    },
    "plank_static": {
        id: "plank_static",
        name: "Gainage Planche",
        video: "https://www.youtube.com/embed/pSHjTRCQxIw",
        instructions: "Corps droit, sur les coudes. Tenez la position.",
        level: "debutant",
        type: "renforcement",
        muscles: ["rectus_abdominis", "obliques"]
    },
    "mountain_climber": {
        id: "mountain_climber",
        name: "Mountain Climbers",
        video: "https://www.youtube.com/embed/nmwgirgXLIg",
        instructions: "En planche, ramenez les genoux vers la poitrine dynamiquement.",
        level: "intermediaire",
        type: "cardio",
        muscles: ["rectus_abdominis"]
    },
    "russian_twist": {
        id: "russian_twist",
        name: "Russian Twist",
        video: "https://www.youtube.com/embed/wkD8rjkodUI",
        instructions: "Assis, buste incliné, tournez les épaules de gauche à droite.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["obliques", "rectus_abdominis"]
    },
    "hollow_body": {
        id: "hollow_body",
        name: "Hollow Body Hold",
        video: "https://www.youtube.com/embed/none",
        instructions: "Corps en banane, lombaires plaquées.",
        level: "avance",
        type: "renforcement",
        muscles: ["rectus_abdominis"]
    },
    "v_ups": {
        id: "v_ups",
        name: "V-Ups / Portefeuille",
        video: "https://www.youtube.com/embed/none",
        instructions: "Relevez buste et jambes simultanément pour toucher vos pieds.",
        level: "avance",
        type: "renforcement",
        muscles: ["rectus_abdominis"]
    },
    "plank_side": {
        id: "plank_side",
        name: "Gainage Latéral",
        video: "https://www.youtube.com/embed/none",
        instructions: "Sur un coude, levez le bassin.",
        level: "debutant",
        type: "renforcement",
        muscles: ["obliques"]
    },

    // --- DOS (Back - Lats/Traps) ---
    "superman": {
        id: "superman",
        name: "Superman / Extension lombaire",
        video: "https://www.youtube.com/embed/cc6UVRS7PW4",
        instructions: "Au sol, levez bras et jambes simultanément.",
        level: "debutant",
        type: "renforcement",
        muscles: ["erector_spinae", "gluteus_max", "trapezius_mid_inf"]
    },
    "door_pullins": {
        id: "door_pullins",
        name: "Tirage Porte (Door Pulls)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Tenez les poignées de porte, pieds proches, tirez le buste vers la porte.",
        level: "debutant",
        type: "renforcement",
        muscles: ["latissimus", "biceps"]
    },
    "scapular_pushups": {
        id: "scapular_pushups",
        name: "Pompes Scapulaires",
        video: "https://www.youtube.com/embed/none",
        instructions: "Bras tendus, serrez uniquement les omoplates.",
        level: "debutant",
        type: "mobilite",
        muscles: ["trapezius_mid_inf"]
    },
    "snow_angels_prone": {
        id: "snow_angels_prone",
        name: "Anges au sol (Ventre)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Allongé ventre, faites des cercles avec les bras sans toucher le sol.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["trapezius_mid_inf", "deltoid_post"]
    },
    "reverse_snow_angels": {
        id: "reverse_snow_angels",
        name: "Reverse Snow Angels",
        video: "https://www.youtube.com/embed/none",
        instructions: "Variante lente avec contrôle scapulaire.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["trapezius_mid_inf"]
    },
    "towel_row": {
        id: "towel_row",
        name: "Rowing Serviette (Porte)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Coincez une serviette dans la porte, tirez-vous vers elle.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["latissimus", "biceps"]
    },
    "pull_ups": {
        id: "pull_ups",
        name: "Tractions (Pull-ups)",
        video: "https://www.youtube.com/embed/eGo4IYlbE5g",
        instructions: "Menton au-dessus de la barre. Dos large.",
        level: "avance",
        type: "renforcement",
        muscles: ["latissimus", "biceps"]
    },
    "cat_cow": {
        id: "cat_cow",
        name: "Chat / Vache",
        video: "https://www.youtube.com/embed/none",
        instructions: "À 4 pattes, arrondissez puis creusez le dos.",
        level: "debutant",
        type: "mobilite",
        muscles: ["erector_spinae"]
    },

    // --- JAMBES (Legs - Quads/Hamstrings/Glutes/Calves) ---
    "squat_air": {
        id: "squat_air",
        name: "Air Squat",
        video: "https://www.youtube.com/embed/aclHkVaku9U",
        instructions: "Poids sur les talons, dos droit, descendez les fesses.",
        level: "debutant",
        type: "renforcement",
        muscles: ["quadriceps", "gluteus_max"]
    },
    "lunges": {
        id: "lunges",
        name: "Fentes Avant",
        video: "https://www.youtube.com/embed/QOVaHwm-Q6U",
        instructions: "Genou arrière frôle le sol. Angles à 90°.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["quadriceps", "gluteus_max"]
    },
    "glute_bridge": {
        id: "glute_bridge",
        name: "Relevé de Bassin (Bridge)",
        video: "https://www.youtube.com/embed/8bbE64NuDTU",
        instructions: "Poussez sur les talons pour lever le bassin.",
        level: "debutant",
        type: "renforcement",
        muscles: ["gluteus_max", "hamstrings"]
    },
    "single_leg_bridge": {
        id: "single_leg_bridge",
        name: "Bridge Unilatéral",
        video: "https://www.youtube.com/embed/none",
        instructions: "Même chose sur une seule jambe.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["gluteus_max", "hamstrings"]
    },
    "calf_raises": {
        id: "calf_raises",
        name: "Extensions Mollets",
        video: "https://www.youtube.com/embed/-M4-G8p8fmc",
        instructions: "Montez sur la pointe des pieds, tenez 1 sec.",
        level: "debutant",
        type: "renforcement",
        muscles: ["calves"]
    },
    "jump_squats": {
        id: "jump_squats",
        name: "Squats Sautés",
        video: "https://www.youtube.com/embed/72BSZdnJYPQ",
        instructions: "Explosez vers le haut à la montée de squat.",
        level: "avance",
        type: "cardio",
        muscles: ["quadriceps", "gluteus_max", "calves"]
    },
    "bulgarian_split_squat": {
        id: "bulgarian_split_squat",
        name: "Fentes Bulgares",
        video: "https://www.youtube.com/embed/2C-uNgKwPLE",
        instructions: "Pied arrière surélevé sur chaise. Descendez verticalement.",
        level: "avance",
        type: "renforcement",
        muscles: ["quadriceps", "gluteus_max"]
    },
    "step_ups": {
        id: "step_ups",
        name: "Step Ups (Chaise)",
        video: "https://www.youtube.com/embed/dDvMJbylPQA",
        instructions: "Montez sur une chaise stable en poussant sur le talon.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["quadriceps", "gluteus_max"]
    },
    "wall_sit": {
        id: "wall_sit",
        name: "Chaise (Isométrie)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Dos au mur, cuisses parallèles au sol. Tenez.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["quadriceps"]
    },

    // --- BRAS (Arms - Biceps/Triceps/Forearms) ---
    "bicep_curl_water": {
        id: "bicep_curl_water",
        name: "Curl Biceps (Bouteilles)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Fléchissez le coude sans bouger l'épaule.",
        level: "debutant",
        type: "renforcement",
        muscles: ["biceps"]
    },
    "hammer_curl": {
        id: "hammer_curl",
        name: "Curl Prise Marteau",
        video: "https://www.youtube.com/embed/none",
        instructions: "Pouces vers le haut. Cible le brachial.",
        level: "debutant",
        type: "renforcement",
        muscles: ["biceps", "forearm_flexors"]
    },
    "chair_dips": {
        id: "chair_dips_triceps",
        name: "Dips Triceps",
        video: "https://www.youtube.com/embed/033ogJglDbI",
        instructions: "Focus triceps : gardez le dos très proche du banc.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["triceps"]
    },
    "diamond_pushups_knees": {
        id: "diamond_pushups_knees",
        name: "Pompes Diamant (Genoux)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Mains jointes, sur les genoux.",
        level: "debutant",
        type: "renforcement",
        muscles: ["triceps"]
    },
    "wrist_curls": {
        id: "wrist_curls",
        name: "Flexions Poignet",
        video: "https://www.youtube.com/embed/none",
        instructions: "Avant-bras sur cuisse, relevez la main (avec bouteille).",
        level: "debutant",
        type: "renforcement",
        muscles: ["forearm_flexors"]
    },
    "forearm_hang": {
        id: "forearm_hang",
        name: "Suspension Barre (Grip)",
        video: "https://www.youtube.com/embed/none",
        instructions: "Restez suspendu bras tendus le plus longtemps possible.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["forearm_flexors"]
    },

    // --- ÉPAULES (Shoulders) ---
    "lateral_raises": {
        id: "lateral_raises",
        name: "Élévations Latérales",
        video: "https://www.youtube.com/embed/3VcKaXpzqRo",
        instructions: "Levez les bras sur le côté jusqu'à l'horizontale. Coudes fléchis.",
        level: "intermediaire",
        type: "renforcement",
        muscles: ["deltoid_ant"] // Lateral head actually
    },
    "front_raises": {
        id: "front_raises",
        name: "Élévations Frontales",
        video: "https://www.youtube.com/embed/none",
        instructions: "Levez les bras devant vous. Cible l'avant d'épaule.",
        level: "debutant",
        type: "renforcement",
        muscles: ["deltoid_ant"]
    },
    "pike_pushups": {
        id: "pike_pushups",
        name: "Pike Push-ups",
        video: "https://www.youtube.com/embed/sposDXWEB0A",
        instructions: "Fesses en l'air (V inversé), descendez la tête vers le sol.",
        level: "avance",
        type: "renforcement",
        muscles: ["deltoid_ant", "triceps"]
    },
    "shoulder_press_water": {
        id: "shoulder_press_water",
        name: "Développé Militaire",
        video: "https://www.youtube.com/embed/B-aVuyhvLHU",
        instructions: "Poussez les charges au-dessus de la tête.",
        level: "debutant",
        type: "renforcement",
        muscles: ["deltoid_ant"]
    }
};

// HELPER: Search function
function searchExercises(query) {
    if (!query) return [];
    const lowerQ = query.toLowerCase();
    return Object.values(EXERCISES_DB).filter(ex =>
        ex.name.toLowerCase().includes(lowerQ) ||
        ex.instructions.toLowerCase().includes(lowerQ)
    );
}

// HELPER: Get by muscle and level
function getExercisesForMuscle(muscleId, levelFilter = 'all') {
    const all = Object.values(EXERCISES_DB);
    return all.filter(ex => {
        const hitsMuscle = ex.muscles.includes(muscleId);
        if (!hitsMuscle) return false;

        if (levelFilter === 'all') return true;
        return ex.level === levelFilter;
    });
}
