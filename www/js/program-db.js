const PROGRAM_DB = [
    {
        id: "poids_debutant_aucun",
        title: "Perte de Poids - Débutant (Sans matériel)",
        goal: "Perte de poids",
        level: "Débutant (0–6 mois)",
        equipment: "Aucun",
        schedule: [
            { day: "Lundi", activity: "Circuit Cardio-Hiit au poids du corps", duration: "20 min", intensity: "Modérée" },
            { day: "Mardi", activity: "Récupération active : 30 min de marche rapide", duration: "30 min", intensity: "Faible" },
            { day: "Mercredi", activity: "Renforcement musculaire ciblé (Full Body)", duration: "25 min", intensity: "Modérée" },
            { day: "Jeudi", activity: "Repos complet", duration: "-", intensity: "-" },
            { day: "Vendredi", activity: "Circuit brûle-graisses intense", duration: "20 min", intensity: "Moyenne+" },
            { day: "Samedi", activity: "Session Mobilité & Souplesse", duration: "15 min", intensity: "Faible" },
            { day: "Dimanche", activity: "Activité de loisir libre (vélo, marche, natation)", duration: "45 min", intensity: "Modérée" }
        ],
        description: "Un programme doux pour relancer votre métabolisme sans choc articulaire."
    },
    {
        id: "poids_intermediaire_elastiques",
        title: "Brûle-Graisse & Tonification (Élastiques)",
        goal: "Perte de poids",
        level: "Intermédiaire",
        equipment: "Élastiques",
        schedule: [
            { day: "Lundi", activity: "Full Body Resistance (Élastiques)", duration: "30 min", intensity: "Moyenne" },
            { day: "Mardi", activity: "HIIT Tabata (Poids du corps)", duration: "20 min", intensity: "Élevée" },
            { day: "Mercredi", activity: "Récupération active ou Yoga", duration: "40 min", intensity: "Faible" },
            { day: "Jeudi", activity: "Bas du corps & Cardio (Élastiques)", duration: "30 min", intensity: "Élevée" },
            { day: "Vendredi", activity: "Haut du corps & Gainage", duration: "30 min", intensity: "Moyenne" },
            { day: "Samedi", activity: "Cardio longue durée (Marche ou course)", duration: "45 min", intensity: "Modérée" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "Utilisez la résistance des élastiques pour sculpter votre silhouette en brûlant un maximum de calories."
    },
    {
        id: "muscle_debutant_halteres",
        title: "Volume Musculaire - Initiation (Haltères)",
        goal: "Prise de muscle",
        level: "Débutant (0–6 mois)",
        equipment: "Haltères",
        schedule: [
            { day: "Lundi", activity: "Poussée (Pectoraux, Épaules, Triceps)", duration: "45 min", intensity: "Moyenne" },
            { day: "Mardi", activity: "Repos", duration: "-", intensity: "-" },
            { day: "Mercredi", activity: "Tirage (Dos, Biceps, Arrière épaules)", duration: "45 min", intensity: "Moyenne" },
            { day: "Jeudi", activity: "Repos", duration: "-", intensity: "-" },
            { day: "Vendredi", activity: "Jambes & Abdos", duration: "50 min", intensity: "Moyenne+" },
            { day: "Samedi", activity: "Rappel Full Body léger", duration: "30 min", intensity: "Faible" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "Les bases de l'hypertrophie avec haltères pour construire vos premiers muscles de manière sécurisée."
    },
    {
        id: "muscle_avance_salle",
        title: "Force & Hypertrophie Pro (Salle de sport)",
        goal: "Prise de muscle",
        level: "Avancé",
        equipment: "Salle de sport",
        schedule: [
            { day: "Lundi", activity: "Lourds : Pectoraux & Triceps", duration: "60 min", intensity: "Très élevée" },
            { day: "Mardi", activity: "Lourds : Dos & Biceps", duration: "60 min", intensity: "Très élevée" },
            { day: "Mercredi", activity: "Repos ou Cardio léger", duration: "30 min", intensity: "Faible" },
            { day: "Jeudi", activity: "Jambes (Focus Quadriceps)", duration: "75 min", intensity: "Maximale" },
            { day: "Vendredi", activity: "Épaules & Points faibles", duration: "60 min", intensity: "Élevée" },
            { day: "Samedi", activity: "Jambes (Focus Ischios) & Abdos", duration: "60 min", intensity: "Très élevée" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "Un programme exigeant pour ceux qui veulent passer un cap physique en salle."
    },
    {
        id: "forme_tous_aucun",
        title: "Vitalité Quotidienne (Tout niveau)",
        goal: "Remise en forme",
        level: "Débutant (0–6 mois)",
        equipment: "Aucun",
        schedule: [
            { day: "Lundi", activity: "Réveil musculaire & Gainage", duration: "15 min", intensity: "Moyenne" },
            { day: "Mardi", activity: "Routine Bien-être (Étirements)", duration: "15 min", intensity: "Faible" },
            { day: "Mercredi", activity: "Circuit Tonus Full Body", duration: "20 min", intensity: "Moyenne" },
            { day: "Jeudi", activity: "Réveil musculaire & Gainage", duration: "15 min", intensity: "Moyenne" },
            { day: "Vendredi", activity: "Cardio Fun (Danse ou Boxe à vide)", duration: "20 min", intensity: "Élevée" },
            { day: "Samedi", activity: "Marche active en extérieur", duration: "40 min", intensity: "Moyenne" },
            { day: "Dimanche", activity: "Repos et Méditation", duration: "15 min", intensity: "Faible" }
        ],
        description: "Idéal pour intégrer le sport dans un emploi du temps chargé et retrouver son énergie."
    },
    {
        id: "sante_dos_aucun",
        title: "Spécial Dos & Posture (Sans matériel)",
        goal: "Soulager des douleurs",
        level: "Toutes conditions",
        equipment: "Aucun",
        schedule: [
            { day: "Lundi", activity: "Décompression vertébrale & Mobilité Hanche", duration: "15 min", intensity: "Douce" },
            { day: "Mardi", activity: "Renforcement muscles profonds (Pilates)", duration: "20 min", intensity: "Moyenne" },
            { day: "Mercredi", activity: "Repos", duration: "-", intensity: "-" },
            { day: "Jeudi", activity: "Étirements Chaîne Postérieure", duration: "15 min", intensity: "Douce" },
            { day: "Vendredi", activity: "Gainage Statique & Dynamique", duration: "15 min", intensity: "Moyenne" },
            { day: "Samedi", activity: "Marche décontractée", duration: "30 min", intensity: "Faible" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "Ciblé sur la réduction des tensions lombaires et l'amélioration de la posture quotidienne."
    },
    {
        id: "perf_avance_salle",
        title: "Performance & Athlétisme (Salle)",
        goal: "Performance",
        level: "Avancé",
        equipment: "Salle de sport",
        schedule: [
            { day: "Lundi", activity: "Puissance explosive (Plyométrie + Force)", duration: "60 min", intensity: "Maximale" },
            { day: "Mardi", activity: "Endurance de force", duration: "60 min", intensity: "Élevée" },
            { day: "Mercredi", activity: "Récupération active (Natation)", duration: "45 min", intensity: "Moyenne" },
            { day: "Jeudi", activity: "Agilité & Vitesse", duration: "45 min", intensity: "Maximale" },
            { day: "Vendredi", activity: "Conditionnement métabolique", duration: "60 min", intensity: "Très élevée" },
            { day: "Samedi", activity: "Mobilité articulaire profonde", duration: "30 min", intensity: "Faible" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "Dépassez vos limites avec des entraînements dignes des athlètes pros."
    },
    {
        id: "forme_intermediaire_halteres",
        title: "Remise en Forme Plus (Haltères)",
        goal: "Remise en forme",
        level: "Intermédiaire",
        equipment: "Haltères",
        schedule: [
            { day: "Lundi", activity: "Full Body Tonification (Haltères)", duration: "30 min", intensity: "Moyenne" },
            { day: "Mardi", activity: "Repos", duration: "-", intensity: "-" },
            { day: "Mercredi", activity: "Circuit Metabolic Burn", duration: "30 min", intensity: "Élevée" },
            { day: "Jeudi", activity: "Renforcement Sangle Abdominale", duration: "20 min", intensity: "Moyenne" },
            { day: "Vendredi", activity: "Haut du corps & Cardio", duration: "30 min", intensity: "Moyenne" },
            { day: "Samedi", activity: "Repos", duration: "-", intensity: "-" },
            { day: "Dimanche", activity: "Sortie longue (Vigne, Forêt)", duration: "60 min", intensity: "Moyenne" }
        ],
        description: "Le mixte parfait entre force et endurance pour un corps tonique."
    },
    {
        id: "sante_cervicales_aucun",
        title: "Spécial Cervicales & Mobilité",
        goal: "Soulager des douleurs",
        level: "Toutes conditions",
        equipment: "Aucun",
        schedule: [
            { day: "Lundi", activity: "Mobilité du cou & Épaules", duration: "10 min", intensity: "Douce" },
            { day: "Mardi", activity: "Renforcement trapèzes inférieurs", duration: "15 min", intensity: "Moyenne" },
            { day: "Mercredi", activity: "Auto-massages & Respiration", duration: "15 min", intensity: "Faible" },
            { day: "Jeudi", activity: "Yoga Doux (Hatha)", duration: "20 min", intensity: "Faible" },
            { day: "Vendredi", activity: "Renforcement Postural", duration: "15 min", intensity: "Moyenne" },
            { day: "Samedi", activity: "Marche tranquille", duration: "30 min", intensity: "Faible" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "Libérez vos tensions accumulées dans le haut du dos et la nuque."
    },
    {
        id: "poids_avance_salle",
        title: "Perte de Poids Extrême (Salle)",
        goal: "Perte de poids",
        level: "Avancé",
        equipment: "Salle de sport",
        schedule: [
            { day: "Lundi", activity: "Supersets Brûleurs (Haut du corps)", duration: "60 min", intensity: "Très élevée" },
            { day: "Mardi", activity: "Intervalles Cardio (Tapis/Vélo)", duration: "45 min", intensity: "Maximale" },
            { day: "Mercredi", activity: "Supersets Brûleurs (Bas du corps)", duration: "60 min", intensity: "Très élevée" },
            { day: "Jeudi", activity: "Récupération active (Marche inclinaire)", duration: "45 min", intensity: "Moyenne" },
            { day: "Vendredi", activity: "Circuit Full Body HIIT", duration: "50 min", intensity: "Élevée" },
            { day: "Samedi", activity: "Cardio basse intensité", duration: "60 min", intensity: "Faible" },
            { day: "Dimanche", activity: "Repos", duration: "-", intensity: "-" }
        ],
        description: "La science de la perte de gras couplée à l'intensité de la salle de musculation."
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PROGRAM_DB;
} else {
    window.PROGRAM_DB = PROGRAM_DB;
}
