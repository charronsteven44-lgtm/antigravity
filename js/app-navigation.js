// Application Navigation Logic

function switchSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        item.classList.add('text-gray-400');
        item.classList.remove('text-primary');
    });

    const activeNav = document.querySelector(`[data-section="${sectionName}"]`);
    if (activeNav) {
        activeNav.classList.add('active');
        activeNav.classList.remove('text-gray-400');
        activeNav.classList.add('text-primary');
    }

    // Save current section to localStorage
    localStorage.setItem('currentSection', sectionName);
}

// Restore last viewed section on load
document.addEventListener('DOMContentLoaded', () => {
    const lastSection = localStorage.getItem('currentSection') || 'programme';
    switchSection(lastSection);
});

// Add CSS for active state
const style = document.createElement('style');
style.textContent = `
    .nav-item {
        transition: all 0.3s ease;
        color: #6b7280;
    }
    
    .nav-item.active {
        color: #49e619;
    }
    
    .nav-item:not(.active):hover {
        color: #9ca3af;
    }
`;
document.head.appendChild(style);
