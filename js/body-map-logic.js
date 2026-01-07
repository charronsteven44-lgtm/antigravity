let isFlipped = false;
let activeMuscle = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Toggle Switch
    const btnMuscles = document.getElementById('btn-front');
    const btnSkeleton = document.getElementById('btn-back');

    // Using these buttons as Front/Back toggles for this MVP
    // Assuming UI text says "Face" / "Dos" based on user implementation plan
    // If not, we map: Muscles -> Front, Squelette -> Back for now or rename in HTML later.

    // Let's assume the HTML will be updated to Face/Dos buttons.
    // For safety, I'll attach listeners to the IDs I will put in the HTML.
});

function toggleView(view) {
    const svgFront = document.getElementById('body-front');
    const svgBack = document.getElementById('body-back');
    const btnFront = document.getElementById('btn-view-front');
    const btnBack = document.getElementById('btn-view-back');

    if (view === 'front') {
        svgFront.style.display = 'block';
        svgBack.style.display = 'none';
        btnFront.classList.add('bg-primary', 'text-black');
        btnFront.classList.remove('text-gray-400');
        btnBack.classList.remove('bg-primary', 'text-black');
        btnBack.classList.add('text-gray-400');
        isFlipped = false;
    } else {
        svgFront.style.display = 'none';
        svgBack.style.display = 'block';
        btnBack.classList.add('bg-primary', 'text-black');
        btnBack.classList.remove('text-gray-400');
        btnFront.classList.remove('bg-primary', 'text-black');
        btnFront.classList.add('text-gray-400');
        isFlipped = true;
    }

    // Reset Zoom
    resetZoom();
}

// State
let currentFilter = 'all';

function onMuscleClick(id, element) {
    // 1. Highlight Logic
    document.querySelectorAll('.muscle-path').forEach(el => {
        el.style.fill = 'url(#muscle-gradient)'; // Revert to gradient (defined in HTML later) or base color
        // Fallback if gradient not defined yet in HTML (we will add it):
        if (!document.getElementById('muscle-gradient')) el.style.fill = '#2a3626';

        el.style.opacity = '0.3'; // Dim everything
    });

    // Active
    element.style.fill = '#ff4444'; // Red for Active Focus
    element.style.opacity = '1';

    activeMuscle = id;

    // 2. Populate Data
    const data = MUSCLE_DATA[id];
    if (data) {
        document.getElementById('sheet-title').textContent = data.name;
        document.getElementById('sheet-subtitle').textContent = id.toUpperCase().replace('_', ' ');
        document.getElementById('sheet-desc').textContent = data.description;
        document.getElementById('sheet-origin').textContent = data.origin;
        document.getElementById('sheet-insertion').textContent = data.insertion;
        document.getElementById('sheet-action').textContent = data.action;

        // Open Sheet
        openSheet();
    }

    // 3. Smart Zoom (Simple ViewBox manipulation)
    zoomToElement(element);
}

function setFilter(level) {
    currentFilter = level;

    // UI Updates
    document.querySelectorAll('.filter-tab').forEach(btn => {
        if (btn.dataset.level === level) {
            btn.classList.add('bg-white', 'text-black');
            btn.classList.remove('bg-white/10', 'text-white');
        } else {
            btn.classList.remove('bg-white', 'text-black');
            btn.classList.add('bg-white/10', 'text-white');
        }
    });

    // Refresh list if open
    showExercises();
}

function showExercises() {
    if (!activeMuscle) return;

    // Use the helper from exercises-db.js
    // Note: getExercisesForMuscle must be available globally
    const exerciseList = getExercisesForMuscle(activeMuscle, currentFilter);

    const list = document.getElementById('exercise-list');
    list.innerHTML = '';

    if (exerciseList.length === 0) {
        list.innerHTML = `<div class="text-center text-gray-500 py-10 italic">Aucun exercice trouvé pour ce niveau.</div>`;
    } else {
        exerciseList.forEach(exercise => {
            const html = `
            <div class="bg-black/30 rounded-xl overflow-hidden border border-white/5">
                <div class="relative h-48 bg-black">
                     <iframe src="${exercise.video}" class="absolute inset-0 w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-bold text-white text-lg">${exercise.name}</h4>
                        <span class="text-[10px] uppercase font-bold text-black bg-white px-2 py-1 rounded">${exercise.level}</span>
                    </div>
                    <p class="text-sm text-gray-400 mb-2"><strong class="text-white">Instructions:</strong> ${exercise.instructions}</p>
                    <div class="flex items-center gap-2 mt-2">
                         <span class="text-[10px] uppercase font-bold text-gray-500 border border-white/10 px-2 py-1 rounded">${exercise.type}</span>
                    </div>
                </div>
            </div>
            `;
            list.innerHTML += html;
        });
    }

    const panel = document.getElementById('exercise-panel');
    const content = document.getElementById('exercise-panel-content');

    panel.classList.remove('pointer-events-none', 'opacity-0');
    setTimeout(() => {
        content.style.transform = 'translateY(0)';
    }, 10);
}

function zoomToElement(element) {
    const svg = isFlipped ? document.getElementById('svg-back') : document.getElementById('svg-front');
    const bbox = element.getBBox();

    // Add padding
    const padding = 50;
    const x = bbox.x - padding;
    const y = bbox.y - padding;
    const w = bbox.width + (padding * 2);
    const h = bbox.height + (padding * 2);

    // Smooth transition via CSS or JS? 
    // For MVP, direct setAttribute with CSS transition on svg viewBox is tricky.
    // We will use a simple approach: simple distinct visual change or CSS transform on a group.

    // Better approach for smooth zoom: Transform a main Group <g> inside SVG.
    const group = isFlipped ? document.getElementById('g-back') : document.getElementById('g-front');

    // Calculate scale to fit
    // SVG viewBox is approx 0 0 500 900
    const svgW = 500;
    const svgH = 900;

    const scale = Math.min(svgW / w, svgH / h) * 0.8; // 0.8 factor to not fill totally

    // Center point of muscle
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    // Center point of SVG
    const svgCx = svgW / 2;
    const svgCy = svgH / 2;

    // Translate calculation
    const tx = svgCx - (cx * scale);
    const ty = svgCy - (cy * scale);

    group.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    group.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
}

function resetZoom() {
    ['g-front', 'g-back'].forEach(id => {
        const g = document.getElementById(id);
        if (g) g.style.transform = 'translate(0, 0) scale(1)';
    });

    // Deselect colors
    document.querySelectorAll('.muscle-path').forEach(el => {
        el.style.fill = '#2a3626';
        el.style.opacity = '0.6';
    });
}
