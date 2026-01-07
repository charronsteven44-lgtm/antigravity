const MUSCLE_DATA = {
    // --- HAUT DU CORPS (ANTÉRIEUR) ---
    "deltoid_ant": {
        name: "Deltoïde (Antérieur)",
        origin: "Clavicule (tiers latéral)",
        insertion: "Humérus (tubérosité deltoïdienne)",
        action: "Flexion et rotation interne du bras.",
        description: "Muscle principal de l'épaule donnant le galbe. La portion antérieure est sollicitée dans les mouvements de poussée.",
    },
    "pectoral_major": {
        name: "Grand Pectoral",
        origin: "Clavicule, Sternum, Cartilages costaux",
        insertion: "Humérus (sillon bicipital)",
        action: "Adduction et rotation interne du bras.",
        description: "Puissant muscle du thorax, essentiel pour les mouvements d'étreinte et de poussée vers l'avant.",
    },
    "biceps": {
        name: "Biceps Brachial",
        origin: "Scapula (Omoplate)",
        insertion: "Radius (tubérosité radiale)",
        action: "Flexion du coude et supination.",
        description: "Muscle à deux chefs situé à l'avant du bras, emblème de la force de flexion.",
    },
    "brachialis": {
        name: "Brachial Antérieur",
        origin: "Humérus (moitié distale)",
        insertion: "Ulna (cubitus)",
        action: "Flexion pure du coude.",
        description: "Situé sous le biceps, c'est le fléchisseur le plus puissant du coude, donnant du volume au bras.",
    },
    "serratus": {
        name: "Dentelé Antérieur",
        origin: "Côtes 1 à 8",
        insertion: "Scapula (bord médial)",
        action: "Abduction et stabilisation de la scapula.",
        description: "Muscle 'du boxeur', il permet de projeter l'épaule en avant et stabilise l'omoplate contre le thorax.",
        relatedExercises: ["push_day", "mobility"]
    },
    "rectus_abdominis": {
        name: "Grand Droit (Abdominaux)",
        origin: "Pubis",
        insertion: "Côtes 5-7, Processus xiphoïde",
        action: "Flexion du tronc.",
        description: "Les fameuses 'tablettes de chocolat'. Assure la flexion du buste et la compression viscérale.",
        relatedExercises: ["legs_abs", "ball_crunch", "plank"]
    },
    "obliques": {
        name: "Obliques (Ext/Int)",
        origin: "Côtes inférieures / Crête iliaque",
        insertion: "Crête iliaque / Ligne blanche",
        action: "Rotation et inclinaison du tronc.",
        description: "Muscles latéraux de la taille, essentiels pour les mouvements de torsion et le gainage.",
        relatedExercises: ["legs_abs", "side_plank"]
    },
    "trapezius_sup": {
        name: "Trapèze (Supérieur)",
        origin: "Occiput, Vertèbres cervicales",
        insertion: "Clavicule",
        action: "Élévation de l'épaule (haussement).",
        description: "Partie visible du cou aux épaules. Souvent tendu par le stress ou le port de charges.",
        relatedExercises: ["mobility", "neck_rolls"]
    },

    // --- HAUT DU CORPS (POSTÉRIEUR) ---
    "trapezius_mid_inf": {
        name: "Trapèze (Moyen/Inf)",
        origin: "Vertèbres thoraciques",
        insertion: "Scapula (épine)",
        action: "Rétraction et abaissement de la scapula.",
        description: "Essentiel pour la posture, il tire les épaules vers l'arrière et le bas.",
        relatedExercises: ["pull_day", "face_pull"]
    },
    "deltoid_post": {
        name: "Deltoïde (Postérieur)",
        origin: "Scapula (épine)",
        insertion: "Humérus",
        action: "Extension et rotation externe du bras.",
        description: "Arrière de l'épaule, crucial pour l'équilibre postural et les mouvements de tirage.",
        relatedExercises: ["pull_day", "face_pull"]
    },
    "latissimus": {
        name: "Grand Dorsal",
        origin: "Vertèbres T7-L5, Crête iliaque",
        insertion: "Humérus (sillon bicipital)",
        action: "Adduction et extension du bras.",
        description: "Le plus grand muscle du dos, donnant la forme en 'V'. Puissant tracteur.",
        relatedExercises: ["pull_day", "fullbody"]
    },
    "rhomboids": {
        name: "Rhomboïdes",
        origin: "Vertèbres C7-T5",
        insertion: "Scapula (bord médial)",
        action: "Rétraction de la scapula.",
        description: "Situés entre les omoplates, ils les rapprochent de la colonne vertébrale.",
        relatedExercises: ["pull_day", "mobility"]
    },
    "triceps": {
        name: "Triceps Brachial",
        origin: "Scapula, Humérus",
        insertion: "Ulna (olécrâne)",
        action: "Extension du coude.",
        description: "Muscle à trois chefs occupant tout l'arrière du bras. Seul extenseur notable du coude.",
        relatedExercises: ["push_day", "dips"]
    },
    "erectors": {
        name: "Érecteurs du Rachis",
        origin: "Sacrum, Crête iliaque",
        insertion: "Vertèbres, Côtes, Occiput",
        action: "Extension de la colonne.",
        description: "Les 'lombaires' et muscles paravertébraux qui maintiennent la colonne droite.",
        relatedExercises: ["back_health", "superman"]
    },

    // --- AVANT-BRAS ---
    "brachioradialis": {
        name: "Brachio-radial",
        origin: "Humérus (crête supracondylaire)",
        insertion: "Radius (styloïde)",
        action: "Flexion du coude (pouce en haut).",
        description: "Muscle de l'avant-bras donnant du volume sur le dessus, actif en prise marteau.",
        relatedExercises: ["pull_day"]
    },
    "forearm_flexors": {
        name: "Fléchisseurs poignet/doigts",
        origin: "Humérus (épicondyle médial)",
        insertion: "Mains, Doigts",
        action: "Flexion du poignet et des doigts.",
        description: "Loge antérieure de l'avant-bras, responsable de la force de préhension.",
        relatedExercises: ["grip_train"]
    },

    // --- JAMBES (ANTÉRIEUR) ---
    "quadriceps": {
        name: "Quadriceps",
        origin: "Fémur / Bassin",
        insertion: "Tibia (tubérosité via rotule)",
        action: "Extension du genou.",
        description: "Groupe de 4 muscles volumineux à l'avant la cuisse. Essentiel pour marcher, sauter, s'accroupir.",
        relatedExercises: ["legs_abs", "squat", "lunges"]
    },
    "sartorius": {
        name: "Sartorius",
        origin: "Épine iliaque ant-sup",
        insertion: "Tibia (patte d'oie)",
        action: "Flexion et rotation de hanche.",
        description: "Le muscle 'couturier', le plus long du corps, traversant la cuisse en diagonale.",
        relatedExercises: ["legs_abs", "mobility"]
    },
    "tibialis_anterior": {
        name: "Tibial Antérieur",
        origin: "Tibia (condyle latéral)",
        insertion: "Pied (Métatarse 1)",
        action: "Dorsiflexion du pied.",
        description: "Situé à l'avant du tibia, il relève la pointe du pied.",
        relatedExercises: ["legs_abs", "mobility"]
    },
    "tensor_fasciae_latae": {
        name: "Tenseur Fascia Lata",
        origin: "Crête iliaque",
        insertion: "Tibia (via tractus ilio-tibial)",
        action: "Abduction et rotation hanche.",
        description: "Petit muscle latéral de hanche se prolongeant par une longue bande fibreuse sur le côté de la cuisse.",
        relatedExercises: ["legs_abs", "hip_abduction"]
    },

    // --- JAMBES (POSTÉRIEUR) ---
    "hamstrings": {
        name: "Ischio-jambiers",
        origin: "Ischion (bassin)",
        insertion: "Tibia / Fibula",
        action: "Flexion du genou, Extension hanche.",
        description: "Groupe postérieur de la cuisse (Biceps fémoral, Semi-tendineux/membraneux). Antagonistes des quadriceps.",
        relatedExercises: ["legs_abs", "deadlift"]
    },
    "gluteus_max": {
        name: "Grand Fessier",
        origin: "Ilium, Sacrum",
        insertion: "Fémur, Tractus ilio-tibial",
        action: "Extension puissante de la hanche.",
        description: "Le muscle le plus volumineux et puissant du corps, donne le galbe de la fesse.",
        relatedExercises: ["legs_abs", "hip_thrust"]
    },
    "gluteus_med": {
        name: "Moyen Fessier",
        origin: "Ilium",
        insertion: "Fémur (Grand trochanter)",
        action: "Abduction de la hanche.",
        description: "Situé sur le côté du bassin, stabilisateur essentiel lors de la marche sur un pied.",
        relatedExercises: ["legs_abs", "fire_hydrant"]
    },
    "calves": {
        name: "Mollets (Triceps Sural)",
        origin: "Fémur (Gastrocs) / Tibia (Soléaire)",
        insertion: "Calcaneus (Talon)",
        action: "Extension de la cheville.",
        description: "Composé des jumeaux (gastrocnémiens) et du soléaire. Propulseurs de la marche.",
        relatedExercises: ["legs_abs", "calf_raise"]
    },

    // --- HANCHES / BASSIN ---
    "psoas": {
        name: "Psoas-Iliaque",
        origin: "Vertèbres lombaires / Fosse iliaque",
        insertion: "Fémur (petit trochanter)",
        action: "Flexion de la hanche.",
        description: "Fléchisseur principal de la hanche, reliant le tronc aux jambes.",
        relatedExercises: ["abs", "leg_raise"]
    },
    "adductors": {
        name: "Adducteurs",
        origin: "Pubis / Ischion",
        insertion: "Fémur (ligne âpre)",
        action: "Adduction de la cuisse.",
        description: "Loge interne de la cuisse. Rapprochent les jambes l'une de l'autre.",
        relatedExercises: ["legs_abs", "copenhagen_plank"]
    },

    // --- TÊTE / COU ---
    "scm": {
        name: "Sterno-cléido-mastoïdien",
        origin: "Sternum, Clavicule",
        insertion: "Processus mastoïde (crâne)",
        action: "Rotation et flexion de la tête.",
        description: "Gros muscle visible sur le côté du cou lors de la rotation de la tête.",
        relatedExercises: ["neck_stretch"]
    }
};
