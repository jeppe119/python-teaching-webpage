// Global variables and initialization
let currentSection = 'home';
let completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeProgressBar();
    loadProgress();
    loadSavedCode();
    
    // Show home section by default
    showSection('home');
    
    // Handle browser back/forward
    handleHashChange();
});

// Handle browser back/forward navigation
function handleHashChange() {
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            showSection(hash);
        }
    });
}

// Auto-save functionality for code editors
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('code-input')) {
        const textareaId = e.target.id;
        localStorage.setItem(textareaId, e.target.value);
    }
});

// Load saved code when page loads
function loadSavedCode() {
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach(textarea => {
        const savedCode = localStorage.getItem(textarea.id);
        if (savedCode) {
            textarea.value = savedCode;
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                showSection('home');
                break;
            case '2':
                e.preventDefault();
                showSection('variables');
                break;
            case '3':
                e.preventDefault();
                showSection('functions');
                break;
            case '4':
                e.preventDefault();
                showSection('classes');
                break;
            case '5':
                e.preventDefault();
                showSection('imports');
                break;
            case '6':
                e.preventDefault();
                showSection('lists');
                break;
            case '7':
                e.preventDefault();
                showSection('patterns');
                break;
        }
    }
});
