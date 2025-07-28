// Global variables
let currentSection = 'home';
let completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeProgressBar();
    loadProgress();
    
    // Show home section by default
    showSection('home');
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling and section switching
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('href').substring(1);
            showSection(targetSection);
        });
    });
}

// Section navigation
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
        currentSection = sectionId;
        
        // Update URL hash
        window.location.hash = sectionId;
        
        // Update progress
        updateProgress();
    }
}

function scrollToSection(sectionId) {
    showSection(sectionId);
}

// Progress tracking
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

// Code execution functionality
function runCode(exampleId) {
    const codeTextarea = document.getElementById(exampleId + '-code');
    const outputDiv = document.getElementById(exampleId + '-output');
    
    if (!codeTextarea || !outputDiv) {
        console.error('Code textarea or output div not found for:', exampleId);
        return;
    }
    
    const code = codeTextarea.value;
    const outputContent = outputDiv.querySelector('.output-content');
    
    // Clear previous output
    outputContent.textContent = 'Running...';
    outputContent.className = 'output-content';
    
    // Simulate code execution
    setTimeout(() => {
        try {
            const result = executeSimulatedPython(code, exampleId);
            outputContent.textContent = result;
            outputContent.classList.add('success');
            
            // Mark section as completed when code is successfully run
            const sectionName = exampleId.split('-')[0];
            markSectionComplete(sectionName);
            
        } catch (error) {
            outputContent.textContent = 'Error: ' + error.message;
            outputContent.classList.add('error');
        }
    }, 500);
}

// Simulated Python execution
function executeSimulatedPython(code, exampleId) {
    // This is a simplified simulation of Python code execution
    // In a real application, you would use a Python interpreter like Pyodide
    
    try {
        // Remove comments and empty lines for processing
        const lines = code.split('\n').filter(line => 
            line.trim() && !line.trim().startsWith('#')
        );
        
        let output = '';
        let variables = {};
        
        // Process each line
        for (let line of lines) {
            line = line.trim();
            
            // Handle print statements
            if (line.startsWith('print(')) {
                const printContent = line.slice(6, -1); // Remove 'print(' and ')'
                output += evaluatePrintStatement(printContent, variables) + '\n';
            }
            // Handle variable assignments
            else if (line.includes(' = ') && !line.startsWith('def ') && !line.startsWith('class ')) {
                const [varName, value] = line.split(' = ');
                variables[varName.trim()] = evaluateValue(value.trim());
            }
            // Handle function definitions (simplified)
            else if (line.startsWith('def ')) {
                // For demo purposes, we'll just acknowledge function definition
                const funcName = line.split('(')[0].replace('def ', '');
                output += `Function '${funcName}' defined\n`;
            }
            // Handle class definitions (simplified)
            else if (line.startsWith('class ')) {
                const className = line.split(':')[0].replace('class ', '');
                output += `Class '${className}' defined\n`;
            }
        }
        
        // Special handling for specific examples
        if (exampleId === 'variables') {
            return getVariablesOutput();
        } else if (exampleId === 'functions') {
            return getFunctionsOutput();
        } else if (exampleId === 'classes') {
            return getClassesOutput();
        } else if (exampleId === 'imports') {
            return getImportsOutput();
        } else if (exampleId === 'lists') {
            return getListsOutput();
        } else if (exampleId === 'patterns') {
            return getPatternsOutput();
        }
        
        return output || 'Code executed successfully!';
        
    } catch (error) {
        throw new Error('Invalid Python syntax or unsupported operation');
    }
}

function evaluatePrintStatement(content, variables) {
    // Handle f-strings
    if (content.startsWith('f"') && content.endsWith('"')) {
        let result = content.slice(2, -1); // Remove f" and "
        // Replace variables in braces
        result = result.replace(/\{([^}]+)\}/g, (match, expression) => {
            // Handle type() function calls
            if (expression.startsWith('type(') && expression.endsWith(')')) {
                const varName = expression.slice(5, -1); // Remove 'type(' and ')'
                if (variables[varName] !== undefined) {
                    const varValue = variables[varName];
                    if (typeof varValue === 'string') return "<class 'str'>";
                    if (typeof varValue === 'number' && Number.isInteger(varValue)) return "<class 'int'>";
                    if (typeof varValue === 'number') return "<class 'float'>";
                    if (typeof varValue === 'boolean') return "<class 'bool'>";
                }
                return match;
            }
            // Handle regular variables
            if (variables[expression]) {
                return variables[expression];
            }
            return match;
        });
        return result;
    }
    
    // Handle regular strings
    if (content.startsWith('"') && content.endsWith('"')) {
        return content.slice(1, -1);
    }
    
    // Handle variables
    if (variables[content]) {
        return variables[content];
    }
    
    return content;
}

function evaluateValue(value) {
    // Handle strings
    if (value.startsWith('"') && value.endsWith('"')) {
        return value.slice(1, -1);
    }
    
    // Handle numbers
    if (!isNaN(value)) {
        return value.includes('.') ? parseFloat(value) : parseInt(value);
    }
    
    // Handle booleans
    if (value === 'True') return true;
    if (value === 'False') return false;
    
    return value;
}

// Predefined outputs for examples
function getVariablesOutput() {
    return `Name: Alice
Age: 25
Height: 5.6
Is Student: True
Type of name: <class 'str'>
Type of age: <class 'int'>
Type of height: <class 'float'>
Type of is_student: <class 'bool'>`;
}

function getFunctionsOutput() {
    return `Hello, World!
Hello, Alice!
5 + 3 = 8
Hi, I'm Bob and I'm 25 years old.
Hi, I'm Charlie and I'm 30 years old.`;
}

function getClassesOutput() {
    return `Buddy says Woof!
Buddy is a 3-year-old Golden Retriever
Happy Birthday Buddy! Now 4 years old.
Max says Woof!
Max is a 5-year-old German Shepherd`;
}

function getImportsOutput() {
    return `Random number: 7
Current date: 2025-07-28
Square root of 16: 4.0
Today is: Monday

Available math constants:
π (pi): 3.141592653589793
e: 2.718281828459045`;
}

function getListsOutput() {
    return `Original fruits: ['apple', 'banana', 'orange']
After adding grape: ['apple', 'banana', 'orange', 'grape']
Second fruit: banana
Fruits 1-3: ['banana', 'orange']
Number of fruits: 4

Numbers: [1, 2, 3, 4, 5]
Squared numbers: [1, 4, 9, 16, 25]
Even numbers: [2, 4]
Sum of numbers: 15`;
}

function getPatternsOutput() {
    return `=== Singleton Pattern ===
Database instance 1 ID: 140712234567890
Database instance 2 ID: 140712234567890
Same instance? True

=== Factory Pattern ===
Dog: Buddy says Woof!
Cat: Whiskers says Meow!

=== Observer Pattern ===
User1 received: Breaking news!
User2 received: Breaking news!
User1 received: Weather update!
User2 received: Weather update!

=== Strategy Pattern ===
Credit Card: Processing $100.00 with card ****1234
PayPal: Processing $150.00 via PayPal account user@email.com

=== Command Pattern ===
Light is ON
Light is OFF
Undoing last command...
Light is ON`;
}

// Utility functions
function resetProgress() {
    if (confirm('Are you sure you want to reset your progress?')) {
        localStorage.removeItem('completedSections');
        completedSections = [];
        updateProgress();
        alert('Progress reset successfully!');
    }
}

// Handle browser back/forward
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        showSection(hash);
    }
});

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

// Auto-save functionality for code editors
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('code-input')) {
        const textareaId = e.target.id;
        localStorage.setItem(textareaId, e.target.value);
    }
});

// Load saved code when page loads
document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('.code-input');
    codeInputs.forEach(textarea => {
        const savedCode = localStorage.getItem(textarea.id);
        if (savedCode) {
            textarea.value = savedCode;
        }
    });
});

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
