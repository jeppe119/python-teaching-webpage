// Global variables
let currentSection = 'home';
let completedSections = JSON.parse(localStorage.getItem('completedSections')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeProgressBar();
    loadProgress();
    
    // Check if there's a hash in the URL, otherwise show home
    const hash = window.location.hash.substring(1);
    const targetSection = hash && document.getElementById(hash) ? hash : 'home';
    showSection(targetSection);
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

    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.classList.add('fade-in');
        currentSection = sectionId;
        
        // Add active class to corresponding nav link
        const activeNavLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }
        
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
        
        // Check if there's any meaningful code
        if (lines.length === 0) {
            throw new Error('No code to execute. Please write some Python code first!');
        }
        
        // Check if code contains basic Python elements
        const hasValidPython = lines.some(line => {
            const trimmed = line.trim();
            return trimmed.includes('=') || 
                   trimmed.startsWith('print(') || 
                   trimmed.startsWith('def ') || 
                   trimmed.startsWith('class ') ||
                   trimmed.startsWith('import ') ||
                   trimmed.startsWith('from ');
        });
        
        if (!hasValidPython) {
            throw new Error('Please write valid Python code (variables, print statements, functions, etc.)');
        }
        
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
        
        // Only show success message if there's actual output or valid code was processed
        if (output.trim()) {
            return output;
        } else {
            return 'Code processed successfully! (No output to display)';
        }
        
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
                if (variables.hasOwnProperty(varName)) {
                    const varValue = variables[varName];
                    if (typeof varValue === 'string') return "<class 'str'>";
                    if (typeof varValue === 'number' && Number.isInteger(varValue)) return "<class 'int'>";
                    if (typeof varValue === 'number') return "<class 'float'>";
                    if (typeof varValue === 'boolean') return "<class 'bool'>";
                }
                return match;
            }
            // Handle regular variables - use hasOwnProperty to catch false values
            if (variables.hasOwnProperty(expression)) {
                const value = variables[expression];
                // Convert boolean values to Python format
                if (typeof value === 'boolean') {
                    return value ? 'True' : 'False';
                }
                return value;
            }
            return match;
        });
        return result;
    }
    
    // Handle regular strings
    if (content.startsWith('"') && content.endsWith('"')) {
        return content.slice(1, -1);
    }
    
    // Handle variables - use hasOwnProperty to catch false values
    if (variables.hasOwnProperty(content)) {
        const value = variables[content];
        // Convert boolean values to Python format
        if (typeof value === 'boolean') {
            return value ? 'True' : 'False';
        }
        return value;
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

/**
 * Interactive Explanations and Feedback System
 * Provides contextual help, smart feedback, and success celebrations
 */

// Explanation content for different topics
const explanations = {
    variables: {
        strings: {
            title: "String Variables Explained",
            content: `
                <strong>Strings in Python:</strong><br><br>
                • Must be enclosed in quotes: <code>"text"</code> or <code>'text'</code><br>
                • Can contain letters, numbers, spaces, and symbols<br>
                • Example: <code>name = "Fast and Furious"</code><br><br>
                <strong>Common Mistake:</strong><br>
                Forgetting quotes makes Python look for a variable name instead of text!<br><br>
                <strong>✅ Correct:</strong> <code>movie = "Avatar"</code><br>
                <strong>❌ Wrong:</strong> <code>movie = Avatar</code>
            `
        },
        numbers: {
            title: "Number Variables Explained", 
            content: `
                <strong>Numbers in Python:</strong><br><br>
                • <strong>Integers:</strong> Whole numbers like <code>25</code>, <code>-10</code>, <code>0</code><br>
                • <strong>Floats:</strong> Decimal numbers like <code>4.9</code>, <code>-2.5</code>, <code>3.14</code><br>
                • Use dots (.) for decimals, not commas (,)<br><br>
                <strong>Examples:</strong><br>
                • <code>age = 25</code> (integer)<br>
                • <code>rating = 4.9</code> (float) ✅<br>
                • <code>rating = 4,9</code> (creates a tuple) ❌
            `
        },
        booleans: {
            title: "Boolean Variables Explained",
            content: `
                <strong>Booleans in Python:</strong><br><br>
                • Only two values: <code>True</code> or <code>False</code><br>
                • Must be capitalized (Python is case-sensitive)<br>
                • Used for yes/no, on/off situations<br><br>
                <strong>Examples:</strong><br>
                • <code>is_student = True</code> ✅<br>
                • <code>has_car = False</code> ✅<br>
                • <code>is_ready = true</code> ❌ (lowercase won't work)<br>
                • <code>owns_house = false</code> ❌ (lowercase won't work)
            `
        },
        fstrings: {
            title: "F-strings Explained",
            content: `
                <strong>F-strings (Formatted Strings):</strong><br><br>
                • Start with <code>f</code> before the quotes: <code>f"text"</code><br>
                • Use <code>{variable_name}</code> to insert variable values<br>
                • The variable name goes inside {}, not the value<br><br>
                <strong>Example:</strong><br>
                <code>name = "Alice"</code><br>
                <code>print(f"Hello {name}")</code> → "Hello Alice"<br><br>
                <strong>Remember:</strong><br>
                • <code>{name}</code> uses the variable ✅<br>
                • <code>{"Alice"}</code> uses literal text ✅<br>
                • <code>{Alice}</code> looks for variable "Alice" ❌
            `
        },
        types: {
            title: "Variable Types Explained",
            content: `
                <strong>The type() Function:</strong><br><br>
                • Shows what kind of data a variable contains<br>
                • Useful for debugging and learning<br>
                • Always use with the variable name, not the value<br><br>
                <strong>Common Types:</strong><br>
                • <code>&lt;class 'str'&gt;</code> = String (text)<br>
                • <code>&lt;class 'int'&gt;</code> = Integer (whole number)<br>
                • <code>&lt;class 'float'&gt;</code> = Float (decimal number)<br>
                • <code>&lt;class 'bool'&gt;</code> = Boolean (True/False)<br><br>
                <strong>Usage:</strong> <code>print(f"Type: {type(variable_name)}")</code>
            `
        }
    },
    functions: {
        basics: {
            title: "Function Basics Explained",
            content: `
                <strong>Functions in Python:</strong><br><br>
                • Use <code>def</code> keyword to define a function<br>
                • Functions help organize and reuse code<br>
                • Can take inputs (parameters) and return outputs<br><br>
                <strong>Basic Structure:</strong><br>
                <code>def function_name(parameters):</code><br>
                <code>&nbsp;&nbsp;&nbsp;&nbsp;# code here</code><br>
                <code>&nbsp;&nbsp;&nbsp;&nbsp;return result</code><br><br>
                <strong>Example:</strong><br>
                <code>def greet(name):</code><br>
                <code>&nbsp;&nbsp;&nbsp;&nbsp;return f"Hello {name}!"</code>
            `
        }
    }
};

// Success messages for completed tasks
const successMessages = {
    variables: {
        basic: "🎉 Great job! You've successfully created variables of different types!",
        advanced: "⭐ Excellent! You understand how to use variables in f-strings!",
        types: "🔍 Perfect! You can now check variable types like a real Python developer!",
        complete: "🚀 Amazing! You've mastered Python variables and data types!"
    },
    functions: {
        basic: "🎉 Well done! You've created your first Python function!",
        parameters: "⭐ Excellent! You understand function parameters and return values!",
        complete: "🚀 Outstanding! You've mastered Python functions!"
    }
};

/**
 * Creates and shows explanation tooltip
 */
function showExplanation(topic, subtopic, element) {
    // Remove any existing tooltips
    removeExplanation();
    
    const explanation = explanations[topic]?.[subtopic];
    if (!explanation) return;
    
    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'explanation-tooltip';
    tooltip.innerHTML = `
        <div class="explanation-header">
            <h4>${explanation.title}</h4>
            <button class="close-explanation" onclick="removeExplanation()">×</button>
        </div>
        <div class="explanation-content">
            ${explanation.content}
        </div>
        <div class="explanation-footer">
            <button class="btn-secondary" onclick="removeExplanation()">Got it!</button>
        </div>
    `;
    
    // Position tooltip fixed to top navbar area - always visible
    tooltip.style.position = 'fixed';
    tooltip.style.top = '80px'; // Just below the navbar
    tooltip.style.left = '20px'; // Left side with some margin
    tooltip.style.zIndex = '1000'; // Ensure it's above other content
    
    // Adjust for mobile
    if (window.innerWidth <= 768) {
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
    }
    
    document.body.appendChild(tooltip);
    
    // Add backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'explanation-backdrop';
    backdrop.onclick = removeExplanation;
    document.body.appendChild(backdrop);
    
    // Animate in
    setTimeout(() => {
        tooltip.classList.add('show');
        backdrop.classList.add('show');
    }, 10);
}

/**
 * Removes explanation tooltip
 */
function removeExplanation() {
    const tooltip = document.querySelector('.explanation-tooltip');
    const backdrop = document.querySelector('.explanation-backdrop');
    
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => tooltip.remove(), 300);
    }
    
    if (backdrop) {
        backdrop.classList.remove('show');
        setTimeout(() => backdrop.remove(), 300);
    }
}

/**
 * Shows success message when task is completed
 */
// Removed: Modal success popup function - replaced with inline feedback only
// function showSuccessMessage(topic, level, element) {
//     Modal popup functionality has been disabled per user request
//     All feedback is now shown inline under the code editor
// }

/**
 * Analyzes code and provides smart feedback
 */
function analyzeCode(code, sectionId) {
    const feedback = [];
    
    // Check for common mistakes
    if (code.includes('= true') || code.includes('= false')) {
        feedback.push({
            type: 'error',
            message: 'Remember: Boolean values must be capitalized (True/False) in Python!'
        });
    }
    
    if (code.includes(',') && code.match(/\d+,\d+/)) {
        feedback.push({
            type: 'error', 
            message: 'Use dots (.) for decimal numbers, not commas (,)!'
        });
    }
    
    if (code.includes('{') && !code.includes('f"') && !code.includes("f'")) {
        feedback.push({
            type: 'tip',
            message: 'Don\'t forget the "f" before your string when using {variable} formatting!'
        });
    }
    
    // Check for missing quotes around strings
    const lines = code.split('\n');
    for (let line of lines) {
        if (line.includes(' = ') && !line.trim().startsWith('#')) {
            const parts = line.split(' = ');
            if (parts.length >= 2) {
                const value = parts[1].trim();
                // Check if it looks like unquoted text (contains letters/spaces but no quotes, and not a boolean/number)
                if (/^[A-Za-z][A-Za-z\s]+$/.test(value) && 
                    value !== 'True' && 
                    value !== 'False' && 
                    !value.startsWith('"') && 
                    !value.startsWith("'") &&
                    isNaN(value)) {
                    feedback.push({
                        type: 'error',
                        message: 'String values need quotes! Try: name = "Your Text Here"'
                    });
                    break;
                }
            }
        }
    }
    
    // Check for good practices
    if (code.includes('print(f"') && code.includes('{') && code.includes('type(')) {
        feedback.push({
            type: 'success',
            message: 'Great job using f-strings and the type() function!'
        });
    }
    
    return feedback;
}

/**
 * Enhanced code execution with feedback
 */
function runCodeWithFeedback(exampleId) {
    const codeTextarea = document.getElementById(exampleId + '-code');
    const outputDiv = document.getElementById(exampleId + '-output');
    
    if (!codeTextarea || !outputDiv) {
        console.error('Code textarea or output div not found for:', exampleId);
        return;
    }
    
    const code = codeTextarea.value;
    
    // Run the original code execution
    runCode(exampleId);
    
    // Analyze code for feedback
    const sectionId = exampleId.split('-')[0];
    const feedback = analyzeCode(code, sectionId);
    
    // Show feedback if any issues found
    if (feedback.length > 0) {
        showCodeFeedback(feedback, codeTextarea);
    }
    
    // Check if task completed successfully
    setTimeout(() => {
        checkTaskCompletion(code, sectionId, codeTextarea);
    }, 1000);
}

/**
 * Shows code feedback messages
 */
function showCodeFeedback(feedback, element) {
    // Remove existing feedback
    const existingFeedback = document.querySelector('.code-feedback');
    if (existingFeedback) existingFeedback.remove();
    
    // Create feedback container
    const feedbackDiv = document.createElement('div');
    feedbackDiv.className = 'code-feedback';
    
    feedback.forEach(item => {
        const feedbackItem = document.createElement('div');
        feedbackItem.className = `feedback-item feedback-${item.type}`;
        
        let icon = '💡';
        if (item.type === 'error') icon = '⚠️';
        if (item.type === 'success') icon = '✅';
        
        feedbackItem.innerHTML = `
            <span class="feedback-icon">${icon}</span>
            <span class="feedback-message">${item.message}</span>
        `;
        feedbackDiv.appendChild(feedbackItem);
    });
    
    // Insert after the code editor
    const codeEditor = element.closest('.code-editor');
    if (codeEditor) {
        codeEditor.parentNode.insertBefore(feedbackDiv, codeEditor.nextSibling);
    }
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (feedbackDiv.parentElement) {
            feedbackDiv.remove();
        }
    }, 10000);
}

/**
 * Checks if the current task has been completed successfully
 */
function checkTaskCompletion(code, sectionId, element) {
    // Completion tracking for progress purposes
    let completionLevel = null;
    
    // Variables section completion check
    if (sectionId === 'variables') {
        if (code.includes('print(f"Type of') && 
            code.includes('type(') && 
            code.includes('name =') && 
            code.includes('rating =') &&
            !code.includes('= true') &&
            !code.includes('= false') &&
            !code.includes(',') || !code.match(/\d+,\d+/)) {
            
            completionLevel = 'complete';
        } else if (code.includes('print(f"Type of') && code.includes('type(')) {
            completionLevel = 'types';
        } else if (code.includes('print(f"') && code.includes('{')) {
            completionLevel = 'advanced';
        } else if (code.includes('name =') && code.includes('rating =')) {
            completionLevel = 'basic';
        }
    }
    
    // Functions section completion check
    if (sectionId === 'functions') {
        if (code.includes('def ') && code.includes('return') && code.includes('*')) {
            completionLevel = 'complete';
        } else if (code.includes('def ') && code.includes('return')) {
            completionLevel = 'parameters';
        } else if (code.includes('def ')) {
            completionLevel = 'basic';
        }
    }
    
    // Note: Modal popup removed - only inline feedback is shown
    // Completion level is tracked but no popup is displayed
}

/**
 * Shows contextual help based on the current section
 */
function showContextualHelp(exerciseElement) {
    const section = document.querySelector('.section.active');
    const sectionId = section?.id;
    
    let helpTopic, helpSubtopic;
    
    switch(sectionId) {
        case 'variables':
            // Determine what help to show based on exercise content
            const exerciseText = exerciseElement.textContent.toLowerCase();
            if (exerciseText.includes('type')) {
                helpTopic = 'variables';
                helpSubtopic = 'types';
            } else if (exerciseText.includes('print(f')) {
                helpTopic = 'variables';
                helpSubtopic = 'fstrings';
            } else if (exerciseText.includes('boolean')) {
                helpTopic = 'variables';
                helpSubtopic = 'booleans';
            } else if (exerciseText.includes('float') || exerciseText.includes('rating')) {
                helpTopic = 'variables';
                helpSubtopic = 'numbers';
            } else {
                helpTopic = 'variables';
                helpSubtopic = 'strings';
            }
            break;
        case 'functions':
            helpTopic = 'functions';
            helpSubtopic = 'basics';
            break;
        default:
            helpTopic = 'variables';
            helpSubtopic = 'strings';
    }
    
    showExplanation(helpTopic, helpSubtopic, exerciseElement);
}

/**
 * Adds help buttons to exercises
 */
function addHelpButtons() {
    const exercises = document.querySelectorAll('.exercise');
    
    exercises.forEach((exercise) => {
        // Add help button if it doesn't exist
        if (!exercise.querySelector('.help-button')) {
            const helpButton = document.createElement('button');
            helpButton.className = 'help-button';
            helpButton.innerHTML = '❓ Need Help?';
            helpButton.onclick = () => showContextualHelp(exercise);
            
            const runButton = exercise.querySelector('.run-btn');
            if (runButton) {
                runButton.parentElement.insertBefore(helpButton, runButton);
            }
        }
    });
}

/**
 * Enhances existing run buttons with feedback
 */
function enhanceRunButtons() {
    const runButtons = document.querySelectorAll('.run-btn');
    runButtons.forEach(button => {
        // Store original onclick
        const originalOnclick = button.getAttribute('onclick');
        
        if (originalOnclick && originalOnclick.includes('runCode')) {
            const exampleId = originalOnclick.match(/runCode\('([^']+)'\)/)?.[1];
            if (exampleId) {
                // Replace with enhanced version
                button.setAttribute('onclick', `runCodeWithFeedback('${exampleId}')`);
            }
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all content is loaded
    setTimeout(() => {
        addHelpButtons();
        enhanceRunButtons();
    }, 100);
});

// Also initialize when sections change
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('topic-card')) {
        setTimeout(() => {
            addHelpButtons();
            enhanceRunButtons();
        }, 100);
    }
});

// Global function for manual initialization (if needed)
window.initializeExplanations = function() {
    addHelpButtons();
    enhanceRunButtons();
};
