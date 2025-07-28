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
                // Check if it looks like unquoted text
                if (/^[A-Za-z][A-Za-z\s]+[^"'0-9\]\}\)]$/.test(value)) {
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
