// Progress tracking functionality
function initializeProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<div class="progress-bar"></div>';
    document.body.appendChild(progressContainer);
}

function updateProgress() {
    const totalSections = 6; // variables, functions, classes, imports, lists, patterns
    const completedCount = completedSections.length;
    const progressPercentage = (completedCount / totalSections) * 100;
    
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = progressPercentage + '%';
    }
}

function markSectionComplete(sectionId) {
    if (!completedSections.includes(sectionId)) {
        completedSections.push(sectionId);
        localStorage.setItem('completedSections', JSON.stringify(completedSections));
        updateProgress();
    }
}

function loadProgress() {
    updateProgress();
}

function showProgress() {
    const totalSections = 6;
    const completedCount = completedSections.length;
    const progressPercentage = Math.round((completedCount / totalSections) * 100);
    
    alert(`Your Progress: ${completedCount}/${totalSections} sections completed (${progressPercentage}%)\n\nCompleted sections: ${completedSections.join(', ') || 'None'}`);
}

function resetProgress() {
    if (confirm('Are you sure you want to reset your progress?')) {
        localStorage.removeItem('completedSections');
        completedSections = [];
        updateProgress();
        alert('Progress reset successfully!');
    }
}

// Export/Import progress functionality
function exportProgress() {
    const progressData = {
        completedSections,
        timestamp: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'python-learning-progress.json';
    link.click();
}

function importProgress() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const progressData = JSON.parse(e.target.result);
                    if (progressData.completedSections) {
                        completedSections = progressData.completedSections;
                        localStorage.setItem('completedSections', JSON.stringify(completedSections));
                        updateProgress();
                        alert('Progress imported successfully!');
                    }
                } catch (error) {
                    alert('Error importing progress: Invalid file format');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}
