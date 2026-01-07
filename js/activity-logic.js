class ActivityTracker {
    constructor() {
        this.STORAGE_KEY = 'essor_activity_history';
        this.permissionsGranted = localStorage.getItem('essor_permissions_granted') === 'true';
        this.init();
    }

    init() {
        // Initialize history if empty
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            this.seedHistory();
        }

        // Only start updates if permissions granted
        if (this.permissionsGranted) {
            this.simulateRealtimeUpdates();
        }
    }

    async requestPermissions() {
        return new Promise((resolve) => {
            // Simulate OS Dialog delay
            setTimeout(() => {
                this.permissionsGranted = true;
                localStorage.setItem('essor_permissions_granted', 'true');
                this.simulateRealtimeUpdates();
                // Sync immediate 'today' step count to ensure display is not 0
                this.addSteps(0);
                resolve(true);
            }, 1000); // 1s delay
        });
    }

    // Seed 7 days of dummy data for the prototype
    seedHistory() {
        const history = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            // Random steps between 3000 and 12000
            const steps = Math.floor(Math.random() * (12000 - 3000 + 1)) + 3000;
            history.push({ date: dateStr, steps: steps });
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    }

    getHistory() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }

    getToday() {
        const history = this.getHistory();
        const todayStr = new Date().toISOString().split('T')[0];
        let entry = history.find(h => h.date === todayStr);

        if (!entry) {
            entry = { date: todayStr, steps: 0 };
            history.push(entry);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        }
        return entry;
    }

    addSteps(amount) {
        const history = this.getHistory();
        const todayStr = new Date().toISOString().split('T')[0];
        const index = history.findIndex(h => h.date === todayStr);

        if (index !== -1) {
            history[index].steps += amount;
        } else {
            history.push({ date: todayStr, steps: amount });
        }

        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
        this.syncGamification(history[index]?.steps || amount);
        this.notifyUpdate();
    }

    // Calculate metrics based on user profile
    getMetrics() {
        const history = this.getHistory();
        const todayStr = new Date().toISOString().split('T')[0];
        const todaySteps = history.find(h => h.date === todayStr)?.steps || 0;
        const totalSteps = history.reduce((acc, curr) => acc + curr.steps, 0);

        const user = JSON.parse(localStorage.getItem('clientUser') || '{}');
        const heightCm = parseFloat(user.height) || 170; // fallback
        const weightKg = parseFloat(user.weight) || 70; // fallback

        // Formulas
        const strideM = (heightCm * 0.415) / 100;
        const distanceKm = (todaySteps * strideM) / 1000;
        const calories = distanceKm * weightKg * 1.036; // Approx factor

        return {
            todaySteps,
            distanceKm: distanceKm.toFixed(1),
            calories: Math.round(calories),
            totalSteps7d: totalSteps,
            avgSteps: Math.round(totalSteps / Math.max(history.length, 1)),
            bestDay: history.reduce((max, p) => p.steps > max.steps ? p : max, { steps: 0 })
        };
    }

    syncGamification(currentSteps) {
        if (window.game) {
            // Update the 'steps' stat in gamification
            // Note: In a real app we might sync total accumulated steps, here we sync 'today's steps' or 'total steps' 
            // depending on how the challenge is defined. Assuming 'steps' stat is cumulative or daily max.
            // Let's assume the gamification logic treats 'steps' as "steps taken today" for daily challenges
            // OR "total steps" for lifetime. Let's send the Daily count for now.
            window.game.updateProgress('steps', currentSteps, false); // false = overwrite current value
        }
    }

    simulateRealtimeUpdates() {
        // Increment steps every few seconds to show life
        setInterval(() => {
            const inc = Math.floor(Math.random() * 10) + 1;
            this.addSteps(inc);
        }, 5000);
    }

    notifyUpdate() {
        window.dispatchEvent(new CustomEvent('activity-updated'));
    }
}

const activityTracker = new ActivityTracker();
window.activityTracker = activityTracker;
