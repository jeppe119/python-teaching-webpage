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
        const predefinedOutput = getPredefinedOutput(exampleId);
        if (predefinedOutput) {
            return predefinedOutput;
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
