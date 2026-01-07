const GameLogic = {
    state: {
        xp: 0,
        level: 1,
        completed: [], // List of challenge IDs
        lastShake: 0
    },

    init() {
        this.loadState();
        this.checkPassiveChallenges();
        this.setupShakeDetection();
        this.updateUI();
    },

    loadState() {
        const saved = JSON.parse(localStorage.getItem('userGamification') || '{}');
        this.state = { ...this.state, ...saved };

        // Safety: If level is 0 or undefined, recalc
        this.calcLevel();
    },

    saveState() {
        localStorage.setItem('userGamification', JSON.stringify(this.state));
        this.updateUI();
    },

    calcLevel() {
        let lvl = 1;
        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (this.state.xp >= LEVEL_THRESHOLDS[i]) {
                lvl = i + 1;
            }
        }
        this.state.level = lvl;
    },

    addXP(amount) {
        const oldLvl = this.state.level;
        this.state.xp += amount;
        this.calcLevel();

        if (this.state.level > oldLvl) {
            this.showToast(`Niveau Supérieur : ${this.state.level} ! 🚀`, 'levelup');
        }
        this.saveState();
    },

    completeChallenge(id) {
        if (this.state.completed.includes(id)) return; // Already done

        const challenge = CHALLENGES_DB.find(c => c.id === id);
        if (!challenge) return;

        this.state.completed.push(id);
        this.addXP(challenge.xp);
        this.showToast(`Challenge Validé : ${challenge.title} (+${challenge.xp} XP)`, 'success');
        this.saveState();
    },

    checkPassiveChallenges() {
        // 1. Welcome (Always true if they are here)
        this.completeChallenge('welcome_start');

        // 2. Profile (Check local storage)
        const profile = JSON.parse(localStorage.getItem('clientUser') || '{}');
        if (profile.avatar && profile.weight && profile.height) {
            this.completeChallenge('profile_optimize');
        }

        // 3. Special Date
        const today = new Date();
        const isXmas = (today.getMonth() === 11 && today.getDate() === 25);
        if (isXmas) this.completeChallenge('special_event');
    },

    setupShakeDetection() {
        // Simple shake detection logic
        if (!window.DeviceMotionEvent) return;

        let shakeThreshold = 15;
        let lastX = 0, lastY = 0, lastZ = 0;
        let lastUpdate = 0;

        window.addEventListener('devicemotion', (e) => {
            const current = e.accelerationIncludingGravity;
            if (!current) return;

            const now = Date.now();
            if ((now - lastUpdate) > 100) {
                const diffTime = (now - lastUpdate);
                lastUpdate = now;

                const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;

                if (speed > shakeThreshold) {
                    // Debounce shake challenge
                    if (now - this.state.lastShake > 2000) {
                        this.state.lastShake = now;
                        this.completeChallenge('shake_it');
                    }
                }

                lastX = current.x;
                lastY = current.y;
                lastZ = current.z;
            }
        });
    },

    getNextLevelXP() {
        // Find threshold next
        // Array index is Level - 1
        // Level 1 threshold index 0 is 0. Next is index 1 for Level 2.
        const idx = this.state.level;
        if (idx >= LEVEL_THRESHOLDS.length) return 999999;
        return LEVEL_THRESHOLDS[idx];
    },

    showToast(msg, type = 'normal') {
        // Simple alert fallback if UI not present, or custom toast if exists
        // ideally dispatch event or use existing toast overlay
        const overlay = document.getElementById('feedback-overlay');
        if (overlay) {
            const msgEl = document.getElementById('feedback-msg');
            if (msgEl) msgEl.textContent = msg;
            overlay.style.opacity = '1';
            setTimeout(() => overlay.style.opacity = '0', 3000);
        } else {
            console.log("GAME TOAST:", msg);
        }
    },

    updateUI() {
        // Dispatch event for UI components to listen
        window.dispatchEvent(new CustomEvent('gamification-updated', { detail: this.state }));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    GameLogic.init();
});
