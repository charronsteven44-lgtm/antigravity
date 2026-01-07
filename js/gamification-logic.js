class GameLogic {
    constructor() {
        this.loadState();
        this.initSensors();
        this.checkPassiveChallenges();

        window.addEventListener('update-gamification', () => {
            /* Optional: triggers UI refresh */
        });
    }

    loadState() {
        const saved = localStorage.getItem('essor_gamification');
        if (saved) {
            this.state = JSON.parse(saved);
        } else {
            this.state = {
                xp: 0,
                level: 1,
                completed: [], // Array of completed IDs
                progress: {}, // { challengeId: currentVal } for accumulated stats
                stats: {
                    steps: 0,
                    days: 1, // Days since install
                    friendsInvited: 0,
                    profileFields: 0 // New stat for profile completion
                }
            };
            this.completeChallenge('welcome_start');
        }

        // Ensure structure exists if updating from old version
        if (!this.state.progress) this.state.progress = {};
        if (!this.state.stats) this.state.stats = { steps: 0, days: 1, friendsInvited: 0, profileFields: 0 };
        // Ensure profileFields exists in stats
        if (typeof this.state.stats.profileFields === 'undefined') this.state.stats.profileFields = 0;
    }

    saveState() {
        localStorage.setItem('essor_gamification', JSON.stringify(this.state));
        window.dispatchEvent(new CustomEvent('update-gamification'));
    }

    addXP(amount) {
        this.state.xp += amount;
        this.checkLevelUp();
        this.saveState();
    }

    // Update the progress of a specific challenge (or global stat)
    updateProgress(statKey, value, isAdditive = true) {
        if (isAdditive) {
            this.state.stats[statKey] = (this.state.stats[statKey] || 0) + value;
        } else {
            this.state.stats[statKey] = value;
        }

        // Auto-check challenges related to this stat
        this.checkStatChallenges(statKey);
        this.saveState();
    }

    // Check all challenges that rely on a specific stat
    checkStatChallenges(statKey) {
        CHALLENGES_DB.forEach(c => {
            // Map challenge to stat
            let relevantStat = null;
            if (c.id.includes('steps')) relevantStat = 'steps';
            if (c.id.includes('loyalty') || c.id.includes('trial') || c.id.includes('month')) relevantStat = 'days';
            if (c.id === 'invite_friend') relevantStat = 'friendsInvited';
            if (c.id === 'profile_optimize') relevantStat = 'profileFields';

            if (relevantStat === statKey) {
                // Check completion
                const currentVal = this.state.stats[statKey] || 0;
                // Update local progress for this challenge for display (min with target)
                this.state.progress[c.id] = Math.min(currentVal, c.target);

                if (currentVal >= c.target) {
                    this.completeChallenge(c.id);
                }
            }
        });
    }

    checkLevelUp() {
        const nextThreshold = LEVEL_THRESHOLDS[this.state.level];
        if (this.state.xp >= nextThreshold) {
            this.state.level++;
            this.showToast(`Niveau ${this.state.level} atteint !`, 'levelup');
        }
    }

    completeChallenge(id) {
        if (this.state.completed.includes(id)) return; // Already done

        const challenge = CHALLENGES_DB.find(c => c.id === id);
        if (!challenge) return;

        this.state.completed.push(id);
        this.state.progress[id] = challenge.target; // Max out progress bar
        this.addXP(challenge.xp);
        this.showToast(`Validé : ${challenge.title} (+${challenge.xp} XP)`, 'success');
        this.saveState();
    }

    isLocked(challenge) {
        if (!challenge.reqId) return false;
        return !this.state.completed.includes(challenge.reqId);
    }

    getChallengeDisplayInfo(id) {
        const c = CHALLENGES_DB.find(x => x.id === id);
        if (!c) return null;

        const isCompleted = this.state.completed.includes(id);
        const isLocked = this.isLocked(c);

        let current = this.state.progress[id] || 0;

        // Ensure sync with global stats if progress entry missing/outdated
        if (c.id.includes('steps')) current = this.state.stats.steps || 0;
        if (c.id.includes('loyalty')) current = this.state.stats.days || 0;
        if (c.id === 'profile_optimize') current = this.state.stats.profileFields || 0;

        // Cap at target
        if (current > c.target) current = c.target;
        if (isCompleted) current = c.target;

        const percent = Math.floor((current / c.target) * 100);

        return {
            ...c,
            isCompleted,
            isLocked,
            current,
            percent
        };
    }

    checkPassiveChallenges() {
        // --- 7 FIELDS PROFILE CHECK ---
        const userStr = localStorage.getItem('clientUser');
        let profileCount = 0;

        if (userStr) {
            try {
                const u = JSON.parse(userStr);
                // 1. Photo (avatar)
                if (u.avatar && u.avatar.length > 5 && !u.avatar.includes('default')) profileCount++; // naive check
                else if (u.avatar && u.avatar.length > 0) profileCount++; // Accept any avatar for now

                // 2. Name
                if (u.name && u.name.trim().length > 1) profileCount++;

                // 3. Email
                if (u.email && u.email.includes('@')) profileCount++;

                // 4. Age
                if (u.age) profileCount++;

                // 5. Weight
                if (u.weight) profileCount++;

                // 6. Height
                // Check if height exists in data structure. 
                // Usually questionnaire saves it. If not present, user must edit profile.
                if (u.height) profileCount++;

                // 7. Sex
                if (u.sex || u.gender) profileCount++;

            } catch (e) { console.error("Profile parsing error", e); }
        }

        // Update with overwrite (false)
        this.updateProgress('profileFields', profileCount, false);


        // Date events
        const today = new Date();
        const d = today.getDate();
        const m = today.getMonth() + 1;

        if (d === 25 && m === 12) this.completeChallenge('special_xmas');
        if (d === 1) this.completeChallenge('prog_month_1');

        // Ensure steps/days stats are checked against DB
        this.checkStatChallenges('steps');
        this.checkStatChallenges('days');
    }

    initSensors() {
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', (event) => {
                const acc = event.accelerationIncludingGravity;
                if (!acc) return;
                const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
                if (total > 30) {
                    this.completeChallenge('shake_it');
                }
            });
        }
    }

    showToast(msg, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-md transform transition-all duration-300 translate-y-[-100%] opacity-0 border`;

        if (type === 'levelup') {
            toast.classList.add('bg-primary/20', 'border-primary', 'text-white');
            toast.innerHTML = `<div class="flex items-center gap-3"><span class="text-2xl">🏆</span><span class="font-bold">${msg}</span></div>`;
        } else if (type === 'success') {
            toast.classList.add('bg-[#1a1a1a]', 'border-primary/50', 'text-white');
            toast.innerHTML = `<div class="flex items-center gap-3"><span class="text-primary text-xl">✓</span><span class="font-bold text-sm">${msg}</span></div>`;
        }

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-[-100%]', 'opacity-0');
        });

        setTimeout(() => {
            toast.classList.add('opacity-0', 'translate-y-[-100%]');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

const game = new GameLogic();
window.game = game;
